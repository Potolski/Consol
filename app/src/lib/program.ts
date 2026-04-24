import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import idl from "@/lib/idl/poolver.json";
import { DEVNET_RPC, PROGRAM_ID, USDC_DECIMALS } from "./constants";
import type { Pool, PoolStatus } from "./mock-data";
import {
  GroupStatus,
  MemberStatus,
  parseGroupStatus,
  parseMemberStatus,
  parseRoundStatus,
  type RawGroup,
  type RawMember,
  type RawRound,
  RoundStatus,
} from "./types";
import { truncateAddress } from "./utils";

let readOnlyProgram: Program | null = null;

function readOnlyWallet(): Wallet {
  const kp = Keypair.generate();
  return {
    publicKey: kp.publicKey,
    signTransaction: async (tx) => tx,
    signAllTransactions: async (txs) => txs,
    payer: kp,
  };
}

export function getReadOnlyProgram(): Program {
  if (readOnlyProgram) return readOnlyProgram;
  const connection = new Connection(DEVNET_RPC, "confirmed");
  const provider = new AnchorProvider(connection, readOnlyWallet(), {
    commitment: "confirmed",
  });
  readOnlyProgram = new Program(idl as never, provider);
  return readOnlyProgram;
}

export const programId = new PublicKey(PROGRAM_ID);

export interface GroupView {
  address: string;
  creator: string;
  mint: string;
  monthlyContribution: number;
  totalMembers: number;
  currentMembers: number;
  currentRound: number;
  status: GroupStatus;
  collateralBps: number;
  insuranceBps: number;
  protocolFeeBps: number;
  description: string;
  createdAt: number;
  formationDeadline: number;
  roundStartedAt: number;
  membersReceived: number;
  activeMembers: number;
}

export interface MemberView {
  address: string;
  group: string;
  wallet: string;
  collateralDeposited: number;
  paymentsMade: number;
  paymentsMissed: number;
  hasReceived: boolean;
  receivedRound: number;
  totalPaid: number;
  lastPaidRound: number;
  lastDefaultRound: number;
  insuranceClaimed: boolean;
  status: MemberStatus;
  joinedAt: number;
}

export interface RoundView {
  address: string;
  group: string;
  roundNumber: number;
  totalCollected: number;
  paymentsReceived: number;
  lotteryWinner: string;
  winnerSelected: boolean;
  distributionClaimed: boolean;
  distributionAmount: number;
  status: RoundStatus;
  startedAt: number;
}

function mapGroup(address: PublicKey, raw: RawGroup): GroupView {
  return {
    address: address.toBase58(),
    creator: raw.creator.toBase58(),
    mint: raw.mint.toBase58(),
    monthlyContribution: raw.monthlyContribution.toNumber(),
    totalMembers: raw.totalMembers,
    currentMembers: raw.currentMembers,
    currentRound: raw.currentRound,
    status: parseGroupStatus(raw.status),
    collateralBps: raw.collateralBps,
    insuranceBps: raw.insuranceBps,
    protocolFeeBps: raw.protocolFeeBps,
    description: raw.description,
    createdAt: raw.createdAt.toNumber(),
    formationDeadline: raw.formationDeadline.toNumber(),
    roundStartedAt: raw.roundStartedAt.toNumber(),
    membersReceived: raw.membersReceived,
    activeMembers: raw.activeMembers,
  };
}

function mapMember(address: PublicKey, raw: RawMember): MemberView {
  return {
    address: address.toBase58(),
    group: raw.group.toBase58(),
    wallet: raw.wallet.toBase58(),
    collateralDeposited: raw.collateralDeposited.toNumber(),
    paymentsMade: raw.paymentsMade,
    paymentsMissed: raw.paymentsMissed,
    hasReceived: raw.hasReceived,
    receivedRound: raw.receivedRound,
    totalPaid: raw.totalPaid.toNumber(),
    lastPaidRound: raw.lastPaidRound,
    lastDefaultRound: raw.lastDefaultRound,
    insuranceClaimed: raw.insuranceClaimed,
    status: parseMemberStatus(raw.status),
    joinedAt: raw.joinedAt.toNumber(),
  };
}

function mapRound(address: PublicKey, raw: RawRound): RoundView {
  return {
    address: address.toBase58(),
    group: raw.group.toBase58(),
    roundNumber: raw.roundNumber,
    totalCollected: raw.totalCollected.toNumber(),
    paymentsReceived: raw.paymentsReceived,
    lotteryWinner: raw.lotteryWinner.toBase58(),
    winnerSelected: raw.winnerSelected,
    distributionClaimed: raw.distributionClaimed,
    distributionAmount: raw.distributionAmount.toNumber(),
    status: parseRoundStatus(raw.status),
    startedAt: raw.startedAt.toNumber(),
  };
}

interface ProgramAccountClient {
  fetch(address: PublicKey): Promise<unknown>;
  all(filters?: { memcmp: { offset: number; bytes: string } }[]): Promise<
    { publicKey: PublicKey; account: unknown }[]
  >;
}

function accountClient(program: Program, name: string): ProgramAccountClient {
  return (program.account as unknown as Record<string, ProgramAccountClient>)[name];
}

export async function fetchAllGroups(program?: Program): Promise<GroupView[]> {
  const p = program ?? getReadOnlyProgram();
  const rows = await accountClient(p, "consorcioGroup").all();
  return rows.map((r) => mapGroup(r.publicKey, r.account as RawGroup));
}

export async function fetchGroup(
  address: string,
  program?: Program,
): Promise<GroupView | null> {
  const p = program ?? getReadOnlyProgram();
  try {
    const pk = new PublicKey(address);
    const raw = (await accountClient(p, "consorcioGroup").fetch(pk)) as RawGroup;
    return mapGroup(pk, raw);
  } catch {
    return null;
  }
}

export async function fetchMembersForGroup(
  groupAddress: string,
  program?: Program,
): Promise<MemberView[]> {
  const p = program ?? getReadOnlyProgram();
  const rows = await accountClient(p, "member").all([
    { memcmp: { offset: 8, bytes: groupAddress } },
  ]);
  return rows.map((r) => mapMember(r.publicKey, r.account as RawMember));
}

function mapGroupStatusToPool(status: GroupStatus): PoolStatus {
  if (status === GroupStatus.Forming) return "forming";
  if (status === GroupStatus.Completed || status === GroupStatus.Cancelled)
    return "closing";
  return "active";
}

function formatNextDraw(group: GroupView): string {
  if (group.status !== GroupStatus.Active) return "—";
  if (!group.roundStartedAt) return "…";
  const MONTH_SEC = 30 * 24 * 60 * 60;
  const now = Math.floor(Date.now() / 1000);
  const remaining = group.roundStartedAt + MONTH_SEC - now;
  if (remaining <= 0) return "NOW";
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  return `${days}d ${String(hours).padStart(2, "0")}h`;
}

export function groupToPool(group: GroupView): Pool {
  const monthly = group.monthlyContribution / 10 ** USDC_DECIMALS;
  const status = mapGroupStatusToPool(group.status);
  const isForming = status === "forming";
  return {
    id: truncateAddress(group.address, 4),
    address: group.address,
    status,
    monthly,
    members: group.currentMembers,
    memberCap: group.totalMembers,
    total: monthly * group.totalMembers,
    round: group.currentRound,
    duration: group.totalMembers,
    nextDraw: isForming ? "—" : formatNextDraw(group),
    ratio: Math.round(group.collateralBps / 100),
    rep: null,
    onTime: null,
    chain: "Solana",
    asset: "USDC",
  };
}

export async function fetchRoundsForGroup(
  groupAddress: string,
  program?: Program,
): Promise<RoundView[]> {
  const p = program ?? getReadOnlyProgram();
  const rows = await accountClient(p, "round").all([
    { memcmp: { offset: 8, bytes: groupAddress } },
  ]);
  return rows
    .map((r) => mapRound(r.publicKey, r.account as RawRound))
    .sort((a, b) => a.roundNumber - b.roundNumber);
}
