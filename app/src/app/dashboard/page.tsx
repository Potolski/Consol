"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKit } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { WalletButton } from "@/components/wallet/WalletButton";
import { MOCK_GROUPS } from "@/lib/mock-data";
import { formatUSDC, truncateAddress } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import {
  Wallet,
  Users,
  History,
  Award,
  ShieldCheck,
  Plus,
  HelpCircle,
  LogOut,
  Download,
  TrendingUp,
  PieChart,
  PartyPopper,
  ChevronRight,
  PlusCircle,
  Gift,
  RefreshCw,
  Home,
  Car,
  Plane,
} from "lucide-react";

/* ─── Avatar helper ─────────────────────────────────────────────────────────── */

const AVATAR_COLORS = [
  "bg-[#006c4a]",
  "bg-[#26619d]",
  "bg-[#b8860b]",
  "bg-[#9f403d]",
  "bg-[#6b21a8]",
  "bg-[#005a3e]",
  "bg-[#c2410c]",
  "bg-[#0e7490]",
];

const AVATAR_INITIALS = ["JD", "AM", "KL", "RS", "MT", "NP", "DW", "SB"];

function AvatarCircle({ index }: { index: number }) {
  return (
    <div
      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}
    >
      {AVATAR_INITIALS[index % AVATAR_INITIALS.length]}
    </div>
  );
}

/* ─── Pool card icon mapping ────────────────────────────────────────────────── */

const POOL_ICONS: Record<string, React.ReactNode> = {
  "Car Fund Circle": <Car className="h-5 w-5" />,
  "Home Savings Group": <Home className="h-5 w-5" />,
  "Tech Gadgets Pool": <PieChart className="h-5 w-5" />,
  "Vacation Fund": <Plane className="h-5 w-5" />,
  "Emergency Fund Co-op": <ShieldCheck className="h-5 w-5" />,
};

const POOL_TAGS: Record<string, string> = {
  "Car Fund Circle": "Personal Savings",
  "Home Savings Group": "Real Estate Pool",
  "Tech Gadgets Pool": "Tech Savings",
  "Vacation Fund": "Family Trip",
  "Emergency Fund Co-op": "Emergency Fund",
};

/* ─── Sidebar nav items ─────────────────────────────────────────────────────── */

const sidebarNavItems = [
  { icon: Wallet, label: "My Portfolio", active: true },
  { icon: Users, label: "Savings Groups", active: false },
  { icon: History, label: "Contribution History", active: false },
  { icon: Award, label: "Rewards", active: false },
  { icon: ShieldCheck, label: "Security", active: false },
];

/* ─── Activity data ─────────────────────────────────────────────────────────── */

const recentActivity = [
  {
    icon: PlusCircle,
    iconBg: "bg-[#006c4a]/10",
    iconColor: "text-[#006c4a]",
    title: "Contribution to Real Estate Fund",
    date: "Today, 2:45 PM",
    amount: "+$450.00",
    amountColor: "text-[#006c4a]",
    status: "COMPLETED",
  },
  {
    icon: Gift,
    iconBg: "bg-[#26619d]/10",
    iconColor: "text-[#26619d]",
    title: "Monthly Staking Rewards",
    date: "Oct 18, 2023",
    amount: "+$12.45",
    amountColor: "text-[#26619d]",
    status: "REWARD",
  },
  {
    icon: RefreshCw,
    iconBg: "bg-[#eff4ff]",
    iconColor: "text-[#526075]",
    title: "Pool Rebalancing Adjustment",
    date: "Oct 15, 2023",
    amount: "-$2.10",
    amountColor: "text-[#526075]",
    status: "SYSTEM",
  },
];

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const { isConnected, address } = useAppKitAccount();
  const { open } = useAppKit();
  const router = useRouter();

  /* ── Disconnected state ─────────────────────────────────────────────────── */

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-8 pt-24 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[#eff4ff]">
          <Wallet className="h-10 w-10 text-[#26619d]" />
        </div>
        <div className="relative">
          <h1 className="text-3xl font-bold font-headline text-[#00345e]">Your Dashboard</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#526075]">
            Connect your wallet to see your active groups, upcoming payments,
            and winnings.
          </p>
        </div>
        <WalletButton />
      </div>
    );
  }

  /* ── Connected state ────────────────────────────────────────────────────── */

  const truncated = address ? truncateAddress(address) : "";

  // Use the first 3 active/forming groups as pool cards
  const poolGroups = MOCK_GROUPS.filter(
    (g) => g.status === "active" || g.status === "forming"
  ).slice(0, 3);

  // Mock balances for pool cards
  const poolBalances = ["$12,400.00", "$28,500.00", "$1,950.24"];
  const poolProgress = [75, 32, 12];
  const poolNextDates = ["Oct 24, 2023", "Nov 02, 2023", "Oct 30, 2023"];
  const poolMemberCounts = [14, 2, 6];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-0 min-h-[calc(100vh-4rem)]">
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col bg-[#f8f9ff] py-6 text-sm font-medium">
        {/* Profile */}
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff4ff] text-[#006c4a]">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-[#00345e]">Portfolio Overview</p>
              <p className="text-xs text-[#526075]">{truncated}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1">
          {sidebarNavItems.map((item) => {
            if (item.label === "My Portfolio") {
              return (
                <button
                  key={item.label}
                  className="flex items-center gap-3 mx-2 px-4 py-3 rounded-lg transition-all bg-[#006c4a]/10 text-[#006c4a] w-full text-left"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            }
            if (item.label === "Savings Groups") {
              return (
                <Link
                  key={item.label}
                  href="/pools"
                  className="flex items-center gap-3 mx-2 px-4 py-3 rounded-lg transition-all text-[#526075] hover:bg-[#eff4ff]"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            }
            if (item.label === "Contribution History") {
              return (
                <button
                  key={item.label}
                  onClick={() => toast.info("Contribution history coming soon")}
                  className="flex items-center gap-3 mx-2 px-4 py-3 rounded-lg transition-all text-[#526075] hover:bg-[#eff4ff] w-full text-left"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            }
            if (item.label === "Rewards") {
              return (
                <button
                  key={item.label}
                  onClick={() => toast.info("Rewards coming soon")}
                  className="flex items-center gap-3 mx-2 px-4 py-3 rounded-lg transition-all text-[#526075] hover:bg-[#eff4ff] w-full text-left"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            }
            if (item.label === "Security") {
              return (
                <button
                  key={item.label}
                  onClick={() => toast.info("Security settings coming soon")}
                  className="flex items-center gap-3 mx-2 px-4 py-3 rounded-lg transition-all text-[#526075] hover:bg-[#eff4ff] w-full text-left"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            }
            return null;
          })}
        </nav>

        {/* Start New Pool CTA */}
        <div className="px-4 mb-6">
          <button
            onClick={() => router.push("/create")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006c4a] py-3 font-bold text-white transition-colors hover:bg-[#005a3e]"
          >
            <Plus className="h-4 w-4" />
            Start New Pool
          </button>
        </div>

        {/* Support + Log Out */}
        <div className="mt-4 pt-4">
          <button
            onClick={() => toast.info("Support coming soon")}
            className="flex items-center gap-3 mx-2 px-4 py-3 text-[#526075] hover:bg-[#eff4ff] rounded-lg transition-all w-full text-left"
          >
            <HelpCircle className="h-5 w-5" />
            Support
          </button>
          <button
            onClick={() => open({ view: "Account" })}
            className="flex w-full items-center gap-3 mx-2 px-4 py-3 text-[#526075] hover:bg-[#eff4ff] rounded-lg transition-all"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main className="px-6 md:px-8 py-8 pb-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* ── Hero header ───────────────────────────────────────────────── */}
          <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-[#00345e] mb-4">
                Building sustainable{" "}
                <span className="text-[#006c4a]">wealth</span>, together.
              </h1>
              <p className="text-lg text-[#26619d]">
                Your decentralized savings architecture for collective growth
                and transparent financial management.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => toast.info("Export coming soon")}
                className="flex items-center gap-2 rounded-xl bg-[#d5e3fd] px-6 py-3 font-bold text-[#455367] transition-opacity hover:opacity-90"
              >
                <Download className="h-5 w-5" />
                Export Statement
              </button>
            </div>
          </header>

          {/* ── Bento grid — portfolio summary ────────────────────────────── */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
            {/* Total Portfolio Balance */}
            <div className="md:col-span-8 bg-white rounded-xl p-8 shadow-[0_4px_24px_rgba(0,52,94,0.06)]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold text-[#526075] tracking-widest uppercase">
                    TOTAL PORTFOLIO BALANCE
                  </span>
                  <h2 className="text-5xl font-extrabold font-headline text-[#00345e] mt-2">
                    $42,850.24
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[#006c4a] bg-[#006c4a]/10 px-3 py-1 rounded-full">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold">+12.4%</span>
                </div>
              </div>
              {/* Bar chart */}
              <div className="h-32 w-full flex items-end gap-1">
                <div className="bg-[#006c4a]/10 h-1/3 flex-1 rounded-t-sm" />
                <div className="bg-[#006c4a]/10 h-2/5 flex-1 rounded-t-sm" />
                <div className="bg-[#006c4a]/20 h-1/2 flex-1 rounded-t-sm" />
                <div className="bg-[#006c4a]/15 h-3/5 flex-1 rounded-t-sm" />
                <div className="bg-[#006c4a]/25 h-1/2 flex-1 rounded-t-sm" />
                <div className="bg-[#006c4a]/30 h-3/4 flex-1 rounded-t-sm" />
                <div className="bg-[#006c4a]/40 h-2/3 flex-1 rounded-t-sm" />
                <div className="bg-[#006c4a]/50 h-5/6 flex-1 rounded-t-sm" />
                <div className="bg-[#006c4a] h-full flex-1 rounded-t-sm" />
              </div>
            </div>

            {/* Right stacked cards */}
            <div className="md:col-span-4 grid grid-rows-2 gap-6">
              {/* Active Pools */}
              <div className="bg-[#eff4ff] rounded-xl p-8 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-[#526075]">
                  <PieChart className="h-5 w-5" />
                  <span className="text-sm font-semibold">Active Pools</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold font-headline">08</span>
                  <span className="text-xs text-[#526075] font-medium">
                    Top 5% Saver
                  </span>
                </div>
              </div>

              {/* Rewards Earned */}
              <div className="bg-[#006c4a] rounded-xl p-8 flex flex-col justify-between text-white">
                <div className="flex items-center gap-2 text-white/70">
                  <PartyPopper className="h-5 w-5" />
                  <span className="text-sm font-semibold">Rewards Earned</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold font-headline">
                    $1,240.00
                  </span>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          </section>

          {/* ── My Savings Pools ───────────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold font-headline">
                My Savings Pools
              </h3>
              <Link
                href="/pools"
                className="flex items-center gap-1 text-sm font-bold text-[#006c4a] hover:underline"
              >
                View All Pools
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {poolGroups.map((group, idx) => {
                const tag =
                  POOL_TAGS[group.description] || group.description;
                const icon =
                  POOL_ICONS[group.description] || (
                    <Wallet className="h-5 w-5" />
                  );
                const balance = poolBalances[idx] || formatUSDC(group.monthlyContribution);
                const progress = poolProgress[idx] ?? 50;
                const nextDate = poolNextDates[idx] || "TBD";
                const memberCount = poolMemberCounts[idx] || group.currentMembers;
                const showAvatars = Math.min(memberCount, 3);
                const extraMembers = memberCount - showAvatars;

                return (
                  <Link
                    key={group.address}
                    href={`/group/${group.address}`}
                    className="bg-white rounded-xl p-8 shadow-[0_4px_24px_rgba(0,52,94,0.06)] hover:bg-[#eff4ff] transition-all cursor-pointer group"
                  >
                    {/* Top: icon + category tag */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff] text-[#006c4a] transition-colors group-hover:bg-[#006c4a] group-hover:text-white">
                        {icon}
                      </div>
                      <span className="px-3 py-1 bg-[#e5eeff] text-[#26619d] text-[10px] font-bold rounded-full uppercase tracking-tighter">
                        {tag}
                      </span>
                    </div>

                    {/* Pool name */}
                    <h4 className="text-lg font-bold font-headline mb-1">
                      {group.description}
                    </h4>

                    {/* Members with avatars */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex -space-x-2">
                        {Array.from({ length: showAvatars }).map((_, i) => (
                          <AvatarCircle key={i} index={idx * 3 + i} />
                        ))}
                        {extraMembers > 0 && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#eff4ff] text-[10px] font-bold text-[#526075]">
                            +{extraMembers}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-[#526075] font-medium">
                        {memberCount} Members
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-[#526075] font-medium">
                            Progress
                          </span>
                          <span className="text-[#006c4a] font-bold">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-[#eff4ff] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#006c4a] rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Balance + Next Contribution */}
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-[#526075] font-bold uppercase">
                            BALANCE
                          </p>
                          <p className="text-xl font-bold font-headline">
                            {balance}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-[#526075] font-bold uppercase">
                            NEXT CONTRIBUTION
                          </p>
                          <p className="text-sm font-semibold text-[#006c4a]">
                            {nextDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── Recent Activity ─────────────────────────────────────────────── */}
          <section className="mt-12">
            <div className="bg-[#eff4ff] rounded-xl overflow-hidden p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold font-headline">
                    Recent Activity
                  </h3>
                  <p className="text-sm text-[#526075]">
                    Track all contributions and rewards in real-time
                  </p>
                </div>
                <button
                  onClick={() => toast.info("CSV export coming soon")}
                  className="bg-white text-[#00345e] px-4 py-2 rounded-lg text-sm font-bold shadow-[0_4px_24px_rgba(0,52,94,0.06)] hover:bg-[#eff4ff]"
                >
                  Download CSV
                </button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((tx) => (
                  <div
                    key={tx.title}
                    className="bg-white p-4 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.iconBg} ${tx.iconColor}`}
                      >
                        <tx.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#00345e]">
                          {tx.title}
                        </p>
                        <p className="text-xs text-[#526075] font-medium">
                          {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.amountColor}`}>
                        {tx.amount}
                      </p>
                      <p className="text-[10px] text-[#526075] uppercase tracking-widest font-bold">
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ── Mobile FAB ──────────────────────────────────────────────────────── */}
      <button
        onClick={() => router.push("/create")}
        className="lg:hidden fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#006c4a] text-[#e0ffec] shadow-[0_4px_24px_rgba(0,52,94,0.06)] z-50"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
