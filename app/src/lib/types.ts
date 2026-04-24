import { PublicKey } from "@solana/web3.js";

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

interface BNLike {
  toString(): string;
  toNumber(): number;
}

export interface RawGroup {
  creator: PublicKey;
  mint: PublicKey;
  monthlyContribution: BNLike;
  totalMembers: number;
  currentMembers: number;
  currentRound: number;
  status: Record<string, object>;
  collateralBps: number;
  insuranceBps: number;
  protocolFeeBps: number;
  createdAt: BNLike;
  formationDeadline: BNLike;
  roundStartedAt: BNLike;
  membersReceived: number;
  activeMembers: number;
  description: string;
}

export interface RawMember {
  group: PublicKey;
  wallet: PublicKey;
  collateralDeposited: BNLike;
  paymentsMade: number;
  paymentsMissed: number;
  hasReceived: boolean;
  receivedRound: number;
  totalPaid: BNLike;
  lastPaidRound: number;
  lastDefaultRound: number;
  insuranceClaimed: boolean;
  status: Record<string, object>;
  joinedAt: BNLike;
}

export interface RawRound {
  group: PublicKey;
  roundNumber: number;
  totalCollected: BNLike;
  paymentsReceived: number;
  lotteryWinner: PublicKey;
  winnerSelected: boolean;
  distributionClaimed: boolean;
  distributionAmount: BNLike;
  vrfResult: number[] | Uint8Array;
  status: Record<string, object>;
  startedAt: BNLike;
  commitSlot: BNLike;
}

export function parseGroupStatus(raw: Record<string, object>): GroupStatus {
  if ("forming" in raw) return GroupStatus.Forming;
  if ("active" in raw) return GroupStatus.Active;
  if ("completed" in raw) return GroupStatus.Completed;
  if ("cancelled" in raw) return GroupStatus.Cancelled;
  return GroupStatus.Forming;
}

export function parseMemberStatus(raw: Record<string, object>): MemberStatus {
  if ("defaulted" in raw) return MemberStatus.Defaulted;
  if ("withdrawn" in raw) return MemberStatus.Withdrawn;
  return MemberStatus.Active;
}

export function parseRoundStatus(raw: Record<string, object>): RoundStatus {
  if ("selecting" in raw) return RoundStatus.Selecting;
  if ("distributing" in raw) return RoundStatus.Distributing;
  if ("completed" in raw) return RoundStatus.Completed;
  return RoundStatus.Collecting;
}
