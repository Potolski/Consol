import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./constants";

const programId = new PublicKey(PROGRAM_ID);

export function getGroupPDA(creator: PublicKey, groupId: bigint): [PublicKey, number] {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(groupId);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("group"), creator.toBuffer(), buf],
    programId
  );
}

export function getMemberPDA(group: PublicKey, wallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("member"), group.toBuffer(), wallet.toBuffer()],
    programId
  );
}

export function getRoundPDA(group: PublicKey, roundNumber: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("round"), group.toBuffer(), Buffer.from([roundNumber])],
    programId
  );
}

export function getVaultPDA(group: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), group.toBuffer()],
    programId
  );
}

export function getInsuranceVaultPDA(group: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("insurance"), group.toBuffer()],
    programId
  );
}

export function getReputationPDA(wallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("reputation"), wallet.toBuffer()],
    programId
  );
}
