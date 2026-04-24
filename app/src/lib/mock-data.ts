export type PoolStatus = "active" | "forming" | "closing";

export interface Pool {
  id: string;
  address?: string;
  status: PoolStatus;
  monthly: number;
  members: number;
  memberCap?: number;
  total: number;
  round: number;
  duration: number;
  nextDraw: string;
  ratio: number;
  rep: number | null;
  onTime: number | null;
  chain: string;
  asset: string;
  featured?: boolean;
}

export const POOLS: Pool[] = [
  { id: "PLVR-4A9F", status: "active",  monthly: 2500,  members: 20, total: 1_000_000, round: 7,  duration: 20, nextDraw: "2d 14h", ratio: 25, rep: 842, onTime: 96, chain: "Solana", asset: "USDC", featured: true },
  { id: "PLVR-B217", status: "active",  monthly: 6000,  members: 20, total: 2_400_000, round: 12, duration: 20, nextDraw: "5d 02h", ratio: 25, rep: 901, onTime: 99, chain: "Solana", asset: "USDC" },
  { id: "PLVR-C8E0", status: "forming", monthly: 2500,  members: 14, memberCap: 20, total: 1_000_000, round: 0, duration: 20, nextDraw: "—", ratio: 25, rep: null, onTime: null, chain: "Solana", asset: "USDC" },
  { id: "PLVR-9D3A", status: "active",  monthly: 1000,  members: 12, total: 240_000, round: 4, duration: 12, nextDraw: "0d 22h", ratio: 20, rep: 712, onTime: 92, chain: "Solana", asset: "USDC" },
  { id: "PLVR-F451", status: "closing", monthly: 500,   members: 10, total: 120_000, round: 10, duration: 12, nextDraw: "14d 00h", ratio: 15, rep: 665, onTime: 88, chain: "Solana", asset: "USDC" },
  { id: "PLVR-2E6B", status: "active",  monthly: 10000, members: 24, total: 5_760_000, round: 8, duration: 24, nextDraw: "3d 09h", ratio: 30, rep: 923, onTime: 100, chain: "Solana", asset: "USDC" },
  { id: "PLVR-7H82", status: "forming", monthly: 500,   members: 6, memberCap: 12, total: 72_000, round: 0, duration: 12, nextDraw: "—", ratio: 20, rep: null, onTime: null, chain: "Solana", asset: "USDC" },
  { id: "PLVR-K12X", status: "active",  monthly: 2000,  members: 16, total: 640_000, round: 3, duration: 20, nextDraw: "1d 18h", ratio: 25, rep: 788, onTime: 95, chain: "Solana", asset: "USDC" },
  { id: "PLVR-M04P", status: "active",  monthly: 2500,  members: 20, total: 1_500_000, round: 15, duration: 30, nextDraw: "6d 11h", ratio: 25, rep: 867, onTime: 97, chain: "Solana", asset: "USDC" },
  { id: "PLVR-Q771", status: "forming", monthly: 15000, members: 11, memberCap: 24, total: 8_640_000, round: 0, duration: 24, nextDraw: "—", ratio: 30, rep: null, onTime: null, chain: "Solana", asset: "USDC" },
  { id: "PLVR-R9E4", status: "active",  monthly: 3500,  members: 18, total: 1_260_000, round: 9, duration: 20, nextDraw: "4d 07h", ratio: 25, rep: 821, onTime: 94, chain: "Solana", asset: "USDC" },
  { id: "PLVR-W5K1", status: "closing", monthly: 1200,  members: 15, total: 360_000, round: 18, duration: 20, nextDraw: "9d 23h", ratio: 20, rep: 754, onTime: 91, chain: "Solana", asset: "USDC" },
];

export function getPool(id: string): Pool | undefined {
  return POOLS.find((p) => p.id === id);
}

export type MemberStatus = "received" | "eligible" | "default";

export interface Member {
  i: number;
  addr: string;
  ens: string | null;
  init: string;
  status: MemberStatus;
  month: number | null;
  rep: number;
  circles: number;
  onTime: number;
  collateral: number;
  isYou?: boolean;
}

export const MEMBERS: Member[] = [
  { i: 1,  addr: "H7kQ2…9Fqa", ens: "helena.sol", init: "H7", status: "received", month: 3, rep: 842, circles: 5, onTime: 98,  collateral: 2500 },
  { i: 2,  addr: "7Kx2p…4LvM", ens: null,         init: "7K", status: "received", month: 1, rep: 714, circles: 3, onTime: 94,  collateral: 2500 },
  { i: 3,  addr: "Yk3Nb…Tzp1", ens: "yuki.sol",   init: "Yk", status: "received", month: 5, rep: 901, circles: 7, onTime: 100, collateral: 2500 },
  { i: 4,  addr: "Am9dQ…R2sF", ens: "amadou.sol", init: "Am", status: "received", month: 2, rep: 766, circles: 4, onTime: 96,  collateral: 2500 },
  { i: 5,  addr: "Pr4sM…8Vxw", ens: "priya.sol",  init: "Pr", status: "received", month: 6, rep: 923, circles: 8, onTime: 100, collateral: 2500 },
  { i: 6,  addr: "Cb2Lt…6Kxd", ens: null,         init: "Cb", status: "received", month: 4, rep: 688, circles: 3, onTime: 92,  collateral: 2500 },
  { i: 7,  addr: "0x…user",    ens: "user.sol",   init: "◆",  status: "eligible", month: null, rep: 412, circles: 1, onTime: 100, collateral: 2500, isYou: true },
  { i: 8,  addr: "3Mz9F…Kp41", ens: null,         init: "3M", status: "eligible", month: null, rep: 654, circles: 2, onTime: 95,  collateral: 2500 },
  { i: 9,  addr: "Os8Rv…2Qnl", ens: "seun.sol",   init: "Os", status: "eligible", month: null, rep: 889, circles: 6, onTime: 100, collateral: 2500 },
  { i: 10, addr: "Ig4Tw…9Fcb", ens: "ingrid.sol", init: "Ig", status: "eligible", month: null, rep: 723, circles: 4, onTime: 94,  collateral: 2500 },
  { i: 11, addr: "Dn5Yx…3Hrt", ens: null,         init: "Dn", status: "eligible", month: null, rep: 498, circles: 2, onTime: 88,  collateral: 2500 },
  { i: 12, addr: "Ez7Qm…5Lpj", ens: null,         init: "Ez", status: "eligible", month: null, rep: 712, circles: 3, onTime: 96,  collateral: 2500 },
  { i: 13, addr: "ML8nC…Xwv2", ens: "meilin.sol", init: "ML", status: "eligible", month: null, rep: 945, circles: 9, onTime: 100, collateral: 2500 },
  { i: 14, addr: "9Pq3X…2Xrn", ens: null,         init: "9P", status: "default",  month: null, rep: 112, circles: 1, onTime: 40,  collateral: 1500 },
  { i: 15, addr: "Sf6Lk…Bv7n", ens: "sofia.sol",  init: "Sf", status: "eligible", month: null, rep: 798, circles: 5, onTime: 98,  collateral: 2500 },
  { i: 16, addr: "Td3Ru…9Mkx", ens: null,         init: "Td", status: "eligible", month: null, rep: 544, circles: 2, onTime: 90,  collateral: 2500 },
  { i: 17, addr: "Nk5Pw…4Jvc", ens: "nkechi.sol", init: "Nk", status: "eligible", month: null, rep: 867, circles: 6, onTime: 100, collateral: 2500 },
  { i: 18, addr: "Lb2Qz…8Hnp", ens: null,         init: "Lb", status: "eligible", month: null, rep: 731, circles: 4, onTime: 95,  collateral: 2500 },
  { i: 19, addr: "In9Xf…1Bcq", ens: "ines.sol",   init: "In", status: "eligible", month: null, rep: 702, circles: 3, onTime: 94,  collateral: 2500 },
  { i: 20, addr: "Gv4Km…7Tzw", ens: null,         init: "Gv", status: "eligible", month: null, rep: 521, circles: 2, onTime: 91,  collateral: 2500 },
];

export interface Round {
  m: number;
  winner: string | null;
  amt?: string;
  current?: boolean;
}

export const ROUNDS: Round[] = [
  { m: 1, winner: "7Kx2p…4LvM", amt: "50,000" },
  { m: 2, winner: "Am9dQ…R2sF", amt: "50,000" },
  { m: 3, winner: "H7kQ2…9Fqa", amt: "50,000" },
  { m: 4, winner: "Cb2Lt…6Kxd", amt: "50,000" },
  { m: 5, winner: "Yk3Nb…Tzp1", amt: "50,000" },
  { m: 6, winner: "Pr4sM…8Vxw", amt: "50,000" },
  { m: 7, winner: null, amt: "50,000", current: true },
  { m: 8, winner: null },
  { m: 9, winner: null },
  { m: 10, winner: null },
  { m: 11, winner: null },
  { m: 12, winner: null },
  { m: 13, winner: null },
  { m: 14, winner: null },
  { m: 15, winner: null },
  { m: 16, winner: null },
  { m: 17, winner: null },
  { m: 18, winner: null },
  { m: 19, winner: null },
  { m: 20, winner: null },
];

export interface Bid {
  addr: string;
  ens: string | null;
  amt: number;
  rep: number;
  you?: boolean;
}

export const BIDS: Bid[] = [
  { addr: "Sf6Lk…Bv7n", ens: "sofia.sol",  amt: 4820, rep: 798 },
  { addr: "3Mz9F…Kp41", ens: null,         amt: 3600, rep: 654 },
  { addr: "Ig4Tw…9Fcb", ens: "ingrid.sol", amt: 2100, rep: 723 },
];

export function fmtUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}
