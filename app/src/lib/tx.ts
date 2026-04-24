import { BN, type Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import type { TransactionInstruction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { GROUP_SEED, USDC_MINT } from "./constants";
import { getRoundPda } from "./pdas";

function usdcMint(): PublicKey {
  return new PublicKey(USDC_MINT);
}

async function ensureAta(
  program: Program,
  owner: PublicKey,
  mint: PublicKey,
): Promise<{ ata: PublicKey; createIx: TransactionInstruction | null }> {
  const ata = getAssociatedTokenAddressSync(mint, owner, false);
  try {
    await getAccount(program.provider.connection, ata);
    return { ata, createIx: null };
  } catch {
    return {
      ata,
      createIx: createAssociatedTokenAccountInstruction(owner, ata, owner, mint),
    };
  }
}

export interface CreateGroupArgs {
  monthlyContribution: number;
  totalMembers: number;
  collateralBps: number;
  insuranceBps: number;
  description: string;
}

export async function createGroupTx(
  program: Program,
  args: CreateGroupArgs,
): Promise<{ signature: string; groupAddress: string }> {
  const creator = program.provider.publicKey;
  if (!creator) throw new Error("Wallet not connected");

  const mint = usdcMint();
  const groupId = new BN(Date.now());
  const monthly = new BN(Math.round(args.monthlyContribution * 1_000_000));

  const signature = await program.methods
    .createGroup({
      monthlyContribution: monthly,
      totalMembers: args.totalMembers,
      collateralBps: args.collateralBps,
      insuranceBps: args.insuranceBps,
      description: args.description,
      groupId,
    } as never)
    .accounts({ creator, mint } as never)
    .rpc({ commitment: "confirmed" });

  const [group] = PublicKey.findProgramAddressSync(
    [Buffer.from(GROUP_SEED), creator.toBuffer(), groupId.toArrayLike(Buffer, "le", 8)],
    program.programId,
  );

  return { signature, groupAddress: group.toBase58() };
}

export async function joinGroupTx(
  program: Program,
  groupAddress: string,
): Promise<string> {
  const user = program.provider.publicKey;
  if (!user) throw new Error("Wallet not connected");

  const group = new PublicKey(groupAddress);
  const mint = usdcMint();
  const { ata, createIx } = await ensureAta(program, user, mint);

  let builder = program.methods
    .joinGroup()
    .accounts({ user, group, mint, userTokenAccount: ata } as never);

  if (createIx) builder = builder.preInstructions([createIx]);
  return builder.rpc({ commitment: "confirmed" });
}

export async function leaveGroupTx(
  program: Program,
  groupAddress: string,
): Promise<string> {
  const user = program.provider.publicKey;
  if (!user) throw new Error("Wallet not connected");

  const group = new PublicKey(groupAddress);
  const mint = usdcMint();
  const ata = getAssociatedTokenAddressSync(mint, user, false);

  return program.methods
    .leaveGroup()
    .accounts({ user, group, mint, userTokenAccount: ata } as never)
    .rpc({ commitment: "confirmed" });
}

export async function makePaymentTx(
  program: Program,
  groupAddress: string,
  currentRound: number,
): Promise<string> {
  const user = program.provider.publicKey;
  if (!user) throw new Error("Wallet not connected");

  const group = new PublicKey(groupAddress);
  const mint = usdcMint();
  const { ata, createIx } = await ensureAta(program, user, mint);
  const [round] = getRoundPda(group, currentRound);

  let builder = program.methods
    .makePayment()
    .accounts({ user, group, round, mint, userTokenAccount: ata } as never);

  if (createIx) builder = builder.preInstructions([createIx]);
  return builder.rpc({ commitment: "confirmed" });
}

export function getUserAta(owner: PublicKey): PublicKey {
  return getAssociatedTokenAddressSync(usdcMint(), owner, false);
}

export async function fetchUsdcBalance(
  program: Program,
  owner: PublicKey,
): Promise<number> {
  try {
    const ata = getUserAta(owner);
    const account = await getAccount(program.provider.connection, ata);
    return Number(account.amount) / 1_000_000;
  } catch {
    return 0;
  }
}
