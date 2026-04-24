import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import {
  GROUP_SEED,
  INSURANCE_SEED,
  MEMBER_SEED,
  PROGRAM_ID,
  REPUTATION_SEED,
  ROUND_SEED,
  TREASURY_SEED,
  VAULT_SEED,
} from "./constants";

const programId = new PublicKey(PROGRAM_ID);

export function getGroupPda(creator: PublicKey, groupId: bigint | BN): [PublicKey, number] {
  const idBn = BN.isBN(groupId) ? groupId : new BN(groupId.toString());
  return PublicKey.findProgramAddressSync(
    [Buffer.from(GROUP_SEED), creator.toBuffer(), idBn.toArrayLike(Buffer, "le", 8)],
    programId,
  );
}

export function getMemberPda(group: PublicKey, user: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(MEMBER_SEED), group.toBuffer(), user.toBuffer()],
    programId,
  );
}

export function getRoundPda(group: PublicKey, roundNumber: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(ROUND_SEED), group.toBuffer(), Buffer.from([roundNumber])],
    programId,
  );
}

export function getVaultPda(group: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(VAULT_SEED), group.toBuffer()],
    programId,
  );
}

export function getInsuranceVaultPda(group: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(INSURANCE_SEED), group.toBuffer()],
    programId,
  );
}

export function getTreasuryVaultPda(group: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(TREASURY_SEED), group.toBuffer()],
    programId,
  );
}

export function getReputationPda(wallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(REPUTATION_SEED), wallet.toBuffer()],
    programId,
  );
}
