import { PublicKey } from "@solana/web3.js";

// Enums matching on-chain
export enum GroupStatus {
  Forming = "forming",
  Active = "active",
  Completed = "completed",
  Cancelled = "cancelled",
}

export enum MemberStatus {
  Active = "active",
  Defaulted = "defaulted",
  Withdrawn = "withdrawn",
}

export enum RoundStatus {
  Collecting = "collecting",
  Selecting = "selecting",
  Distributing = "distributing",
  Completed = "completed",
}

// Account interfaces matching on-chain structs (from state/*.rs)
export interface ConsorcioGroupAccount {
  creator: PublicKey;
  mint: PublicKey;
  monthlyContribution: bigint; // u64
  totalMembers: number; // u8
  currentMembers: number; // u8
  currentRound: number; // u8
  status: GroupStatus;
  collateralBps: number; // u16
  insuranceBps: number; // u16
  protocolFeeBps: number; // u16
  createdAt: bigint; // i64
  formationDeadline: bigint; // i64
  roundStartedAt: bigint; // i64
  membersReceived: number; // u8
  activeMembers: number; // u8
  bump: number;
  vaultBump: number;
  insuranceBump: number;
  description: string;
}

export interface MemberAccount {
  group: PublicKey;
  wallet: PublicKey;
  collateralDeposited: bigint; // u64
  paymentsMade: number; // u8
  paymentsMissed: number; // u8
  hasReceived: boolean;
  receivedRound: number; // u8
  totalPaid: bigint; // u64
  lastPaidRound: number; // u8
  status: MemberStatus;
  joinedAt: bigint; // i64
  bump: number;
}

export interface RoundAccount {
  group: PublicKey;
  roundNumber: number; // u8
  totalCollected: bigint; // u64
  paymentsReceived: number; // u8
  lotteryWinner: PublicKey;
  winnerSelected: boolean;
  distributionClaimed: boolean;
  distributionAmount: bigint; // u64
  vrfResult: Uint8Array; // [u8; 32]
  status: RoundStatus;
  startedAt: bigint; // i64
  commitSlot: bigint; // u64
  randomnessAccount: PublicKey;
  bump: number;
}

export interface ReputationAccount {
  wallet: PublicKey;
  completed: number; // u16
  defaulted: number; // u16
  totalPayments: number; // u32
  lastCompletedAt: bigint; // i64
  bump: number;
}

// Helper type for Anchor deserialization (the actual types from program.account.xxx.fetch())
// These use BN instead of bigint — we'll convert in hooks
export interface RawGroupAccount {
  creator: PublicKey;
  mint: PublicKey;
  monthlyContribution: { toNumber(): number };
  totalMembers: number;
  currentMembers: number;
  currentRound: number;
  status: Record<string, object>;
  collateralBps: number;
  insuranceBps: number;
  protocolFeeBps: number;
  createdAt: { toNumber(): number };
  formationDeadline: { toNumber(): number };
  roundStartedAt: { toNumber(): number };
  membersReceived: number;
  activeMembers: number;
  bump: number;
  vaultBump: number;
  insuranceBump: number;
  description: string;
}

// Parse Anchor status enum object to our enum
export function parseGroupStatus(raw: Record<string, object>): GroupStatus {
  if ("forming" in raw) return GroupStatus.Forming;
  if ("active" in raw) return GroupStatus.Active;
  if ("completed" in raw) return GroupStatus.Completed;
  if ("cancelled" in raw) return GroupStatus.Cancelled;
  return GroupStatus.Forming;
}

export function parseMemberStatus(raw: Record<string, object>): MemberStatus {
  if ("active" in raw) return MemberStatus.Active;
  if ("defaulted" in raw) return MemberStatus.Defaulted;
  if ("withdrawn" in raw) return MemberStatus.Withdrawn;
  return MemberStatus.Active;
}

export function parseRoundStatus(raw: Record<string, object>): RoundStatus {
  if ("collecting" in raw) return RoundStatus.Collecting;
  if ("selecting" in raw) return RoundStatus.Selecting;
  if ("distributing" in raw) return RoundStatus.Distributing;
  if ("completed" in raw) return RoundStatus.Completed;
  return RoundStatus.Collecting;
}
