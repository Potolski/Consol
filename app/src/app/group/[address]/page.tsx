"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Wallet,
  Shield,
  CircleDollarSign,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Timer,
  Share2,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatUSDC, truncateAddress } from "@/lib/utils";
import { getMockGroup } from "@/lib/mock-data";

const LotteryAnimation = dynamic(
  () =>
    import("@/components/lottery/LotteryAnimation").then(
      (mod) => mod.LotteryAnimation
    ),
  { ssr: false }
);

// ── Fallback Mock Data ──────────────────────────────────────────────────────

const fallbackGroup = {
  description: "Car Fund Circle",
  creator: "7xKp3dFr9mNq8bWkLz4f2D",
  monthlyContribution: 500_000_000,
  totalMembers: 10,
  currentMembers: 8,
  currentRound: 3,
  status: "active" as const,
  collateralBps: 2000,
  insuranceBps: 300,
  protocolFeeBps: 150,
  poolBalance: 3_500_000_000,
  insuranceBalance: 210_000_000,
  membersReceived: 3,
  activeMembers: 8,
};

const mockMembers = [
  { wallet: "7xKp3dFr9mNq8bWkLz4f2D", status: "active", paymentsMade: 4, paymentsMissed: 0, hasReceived: true, receivedRound: 1, collateralDeposited: 1_000_000_000, isYou: true },
  { wallet: "9mNqBvXr2kLp5dWs7hYt3E", status: "active", paymentsMade: 4, paymentsMissed: 0, hasReceived: true, receivedRound: 2, collateralDeposited: 1_000_000_000, isYou: false },
  { wallet: "3dFrHnKm8wQp1bXs6jYv4G", status: "active", paymentsMade: 4, paymentsMissed: 0, hasReceived: true, receivedRound: 3, collateralDeposited: 1_000_000_000, isYou: false },
  { wallet: "8bWkTmRn4vSp9dXs2hYu5F", status: "active", paymentsMade: 4, paymentsMissed: 0, hasReceived: false, receivedRound: 0, collateralDeposited: 1_000_000_000, isYou: false },
  { wallet: "5hYtLnPm7wQp3dXs8jYv6H", status: "active", paymentsMade: 3, paymentsMissed: 1, hasReceived: false, receivedRound: 0, collateralDeposited: 750_000_000, isYou: false },
  { wallet: "2jYvNnQm6wSp4dXs9hYt7J", status: "defaulted", paymentsMade: 1, paymentsMissed: 3, hasReceived: false, receivedRound: 0, collateralDeposited: 0, isYou: false },
  { wallet: "4dXsMnRm5vQp8bWs1hYu8K", status: "active", paymentsMade: 4, paymentsMissed: 0, hasReceived: false, receivedRound: 0, collateralDeposited: 1_000_000_000, isYou: false },
  { wallet: "6hYuPnSm3wQp7dXs0jYv9L", status: "active", paymentsMade: 4, paymentsMissed: 0, hasReceived: false, receivedRound: 0, collateralDeposited: 1_000_000_000, isYou: false },
];

// Map of round number -> winner wallet for tooltip display
const roundWinners: Record<number, string> = {};
mockMembers.forEach((m) => {
  if (m.hasReceived && m.receivedRound > 0) {
    roundWinners[m.receivedRound] = m.wallet;
  }
});

// ── Status helpers ───────────────────────────────────────────────────────────

type MemberFilter = "all" | "active" | "defaulted";

function getMemberStatusDot(member: (typeof mockMembers)[number], currentRound: number) {
  if (member.status === "defaulted")
    return <span className="inline-block h-2 w-2 rounded-full bg-red-500" />;
  if (member.paymentsMissed > 0)
    return <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />;
  if (member.paymentsMade >= currentRound + 1)
    return <span className="inline-block h-2 w-2 rounded-full bg-primary" />;
  return <span className="inline-block h-2 w-2 rounded-full bg-white/20" />;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function GroupDetailPage() {
  const params = useParams<{ address: string }>();
  const [rulesOpen, setRulesOpen] = useState(true);
  const [memberFilter, setMemberFilter] = useState<MemberFilter>("all");
  const [showLottery, setShowLottery] = useState(false);

  // Try to find group from shared mock data, fall back to hardcoded
  const found = getMockGroup(params.address ?? "");
  const g = found
    ? {
        ...found,
        poolBalance: found.monthlyContribution * found.currentMembers,
        insuranceBalance: Math.floor(
          found.monthlyContribution * found.currentMembers * (found.insuranceBps / 10_000) * (found.currentRound + 1)
        ),
        activeMembers: found.activeMembers,
      }
    : fallbackGroup;

  const displayRound = g.currentRound + 1; // 0-indexed -> 1-indexed
  const poolPerRound = (g.monthlyContribution * g.totalMembers) / 1_000_000;
  const protocolFeeBps = "protocolFeeBps" in g ? g.protocolFeeBps : 150;
  const estPayout = poolPerRound - (poolPerRound * protocolFeeBps) / 10_000;
  const paidThisRound = mockMembers.filter(
    (m) => m.status !== "defaulted" && m.paymentsMade >= displayRound
  ).length;

  // Filtered members for the table
  const filteredMembers = useMemo(() => {
    if (memberFilter === "all") return mockMembers;
    if (memberFilter === "active")
      return mockMembers.filter((m) => m.status !== "defaulted");
    return mockMembers.filter((m) => m.status === "defaulted");
  }, [memberFilter]);

  const handleShareGroup = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* -- Back link -- */}
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Explore
      </Link>

      {/* -- Header -- */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {g.status === "forming"
              ? "Forming"
              : g.status === "completed"
                ? "Completed"
                : "Active"}
          </span>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
            {g.description}
          </h1>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 border-white/10 bg-white/[0.03] text-xs text-white/50 hover:bg-white/[0.06] hover:text-white/70"
            onClick={handleShareGroup}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>
        <p className="text-sm text-white/50">
          <span className="font-mono">{formatUSDC(g.monthlyContribution)}/mo</span>
          {" \u00B7 "}
          {g.totalMembers} members
          {" \u00B7 "}
          {g.collateralBps / 100}% collateral
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/30">
          <span>
            Created by{" "}
            <span className="font-mono text-white/50">
              {truncateAddress(g.creator)}
            </span>
          </span>
          <span className="hidden sm:inline">{"\u00B7"}</span>
          <span>
            Round{" "}
            <span className="font-mono text-white/50">
              {displayRound} of {g.totalMembers}
            </span>
          </span>
        </div>
      </div>

      {/* -- Action CTA -- */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-primary/[0.04] to-transparent p-6 sm:p-8">
        {/* Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/[0.08] blur-[80px]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white sm:text-xl">
              Make Payment
            </h2>
            <p className="text-sm text-white/40">
              <Timer className="mr-1 inline-block h-3.5 w-3.5 text-white/30" />
              Payment window:{" "}
              <span className="font-mono text-white/60">4d 12h</span>{" "}
              remaining{" \u00B7 "}
              <span className="font-mono text-white/60">
                {paidThisRound}/{g.totalMembers}
              </span>{" "}
              paid this round
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              size="lg"
              className="gap-2 bg-primary px-6 font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40"
            >
              <Zap className="h-4 w-4" />
              Pay {formatUSDC(g.monthlyContribution)} USDC
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/10 bg-white/[0.03] px-5 text-sm text-white/60 hover:bg-white/[0.06] hover:text-white/80"
              onClick={() => setShowLottery(true)}
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              Demo Lottery
            </Button>
          </div>
        </div>
      </div>

      {/* -- Recent Winner Banner -- */}
      {g.currentRound > 0 && (() => {
        const lastRound = g.currentRound;
        const lastWinner = roundWinners[lastRound];
        if (!lastWinner) return null;
        const payoutAmount = (g.monthlyContribution * g.totalMembers) / 1_000_000;
        const netPayout = payoutAmount - (payoutAmount * protocolFeeBps) / 10_000;
        return (
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/15 bg-gradient-to-r from-amber-500/[0.06] via-amber-500/[0.03] to-transparent px-4 py-3">
            <Trophy className="h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-sm text-white/60">
              <span className="font-semibold text-amber-400">Round {lastRound} Winner:</span>{" "}
              <span className="font-mono text-white/50">{truncateAddress(lastWinner)}</span>{" "}
              received{" "}
              <span className="font-mono font-semibold text-white/70">
                ~${netPayout.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>{" "}
              USDC
            </p>
          </div>
        );
      })()}

      {/* -- Pool Overview -- */}
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {[
          {
            icon: Wallet,
            label: "Pool Balance",
            value: formatUSDC(g.poolBalance),
            sub: "this round",
            color: "text-primary",
          },
          {
            icon: Shield,
            label: "Insurance Fund",
            value: formatUSDC(g.insuranceBalance),
            sub: "accumulated",
            color: "text-amber-500",
          },
          {
            icon: CircleDollarSign,
            label: "Est. Next Payout",
            value:
              "~$" +
              estPayout.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
            sub: "after protocol fee",
            color: "text-blue-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]"
          >
            <div className="mb-3 flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs font-medium text-white/40">
                {stat.label}
              </span>
            </div>
            <p className="font-mono text-2xl font-bold text-white">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-white/30">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* -- Round Timeline -- */}
      <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Round Timeline</h2>
          <span className="font-mono text-xs text-white/30">
            Round {displayRound} of {g.totalMembers}
          </span>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-0">
          {Array.from({ length: g.totalMembers }).map((_, i) => {
            const roundNum = i + 1;
            const isCompleted = roundNum <= g.currentRound;
            const isCurrent = roundNum === displayRound;
            const isPending = roundNum > displayRound;
            const winner = roundWinners[roundNum];

            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                {/* Label */}
                <span className="text-[10px] font-medium leading-none">
                  {isCompleted && (
                    <span className="text-primary">Won</span>
                  )}
                  {isCurrent && (
                    <span className="font-bold text-amber-500">NOW</span>
                  )}
                  {isPending && (
                    <span className="text-transparent">&bull;</span>
                  )}
                </span>

                {/* Dot + connector */}
                <div className="flex w-full items-center">
                  {/* Left connector */}
                  {i > 0 && (
                    <div
                      className={`h-0.5 flex-1 ${
                        roundNum <= displayRound
                          ? "bg-primary/40"
                          : "bg-white/[0.06]"
                      }`}
                    />
                  )}
                  {/* Dot */}
                  <div
                    title={
                      isCompleted && winner
                        ? `Round ${roundNum} winner: ${truncateAddress(winner)}`
                        : isCurrent
                          ? `Round ${roundNum} (current)`
                          : `Round ${roundNum} (pending)`
                    }
                    className={`relative z-10 shrink-0 cursor-default rounded-full ${
                      isCompleted
                        ? "h-3 w-3 bg-primary"
                        : isCurrent
                          ? "h-4 w-4 animate-pulse border-2 border-amber-500 bg-amber-500/30"
                          : "h-3 w-3 border border-white/20 bg-transparent"
                    }`}
                  />
                  {/* Right connector */}
                  {i < g.totalMembers - 1 && (
                    <div
                      className={`h-0.5 flex-1 ${
                        roundNum < displayRound
                          ? "bg-primary/40"
                          : "bg-white/[0.06]"
                      }`}
                    />
                  )}
                </div>

                {/* Round number */}
                <span
                  className={`font-mono text-[10px] ${
                    isCurrent
                      ? "font-bold text-amber-500"
                      : isCompleted
                        ? "text-primary/60"
                        : "text-white/20"
                  }`}
                >
                  {roundNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* Timeline info */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-white/60">
              Round {displayRound}{" \u00B7 "}
              <span className="text-white/40">Collecting Payments</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 font-mono text-white/40">
              <Timer className="h-3 w-3" />
              4d 12h remaining
            </span>
            <span className="font-mono text-white/40">
              {paidThisRound}/{g.totalMembers} paid
            </span>
          </div>
        </div>
      </div>

      {/* -- Members Table -- */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">
            <Users className="mr-2 inline-block h-4 w-4 text-white/40" />
            Members ({g.activeMembers}/{g.totalMembers})
          </h2>

          {/* Filter buttons */}
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-0.5">
            {(["all", "active", "defaulted"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setMemberFilter(filter)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  memberFilter === filter
                    ? "bg-white/[0.08] text-white"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {filter === "all"
                  ? "All"
                  : filter === "active"
                    ? "Active"
                    : "Defaulted"}
              </button>
            ))}
          </div>
        </div>

        <div className="-mx-6 overflow-x-auto px-6">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs text-white/30">
                <th className="pb-3 pr-4 font-medium">#</th>
                <th className="pb-3 pr-4 font-medium">Member</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 text-center font-medium">Paid</th>
                <th className="pb-3 pr-4 text-center font-medium">Received</th>
                <th className="pb-3 text-right font-medium">Collateral</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, i) => {
                const isDefaulted = member.status === "defaulted";
                return (
                  <tr
                    key={member.wallet}
                    className={`border-b border-white/[0.03] transition-colors hover:bg-white/[0.02] ${
                      isDefaulted ? "opacity-40" : ""
                    }`}
                  >
                    {/* # */}
                    <td className="py-3 pr-4 font-mono text-xs text-white/30">
                      {i + 1}
                    </td>

                    {/* Member */}
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs ${
                            isDefaulted
                              ? "line-through text-white/30"
                              : "text-white/70"
                          }`}
                        >
                          {truncateAddress(member.wallet)}
                        </span>
                        {member.isYou && (
                          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                            you
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {getMemberStatusDot(member, g.currentRound)}
                        <span
                          className={`text-xs ${
                            isDefaulted
                              ? "text-red-400"
                              : member.paymentsMissed > 0
                                ? "text-amber-500"
                                : "text-white/50"
                          }`}
                        >
                          {isDefaulted
                            ? "Defaulted"
                            : member.paymentsMissed > 0
                              ? "Late"
                              : "Active"}
                        </span>
                      </div>
                    </td>

                    {/* Paid */}
                    <td className="py-3 pr-4 text-center font-mono text-xs">
                      <span className="text-white/60">
                        {member.paymentsMade}
                      </span>
                      {member.paymentsMissed > 0 && (
                        <span className="ml-1 text-red-400">
                          ({member.paymentsMissed} missed)
                        </span>
                      )}
                    </td>

                    {/* Received */}
                    <td className="py-3 pr-4 text-center">
                      {member.hasReceived ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          <CheckCircle2 className="h-3 w-3" />
                          R{member.receivedRound}
                        </span>
                      ) : isDefaulted ? (
                        <span className="text-xs text-white/20">&mdash;</span>
                      ) : (
                        <span className="text-xs text-white/20">Pending</span>
                      )}
                    </td>

                    {/* Collateral */}
                    <td className="py-3 text-right font-mono text-xs text-white/50">
                      {isDefaulted ? (
                        <span className="flex items-center justify-end gap-1 text-red-400">
                          <AlertTriangle className="h-3 w-3" />
                          Slashed
                        </span>
                      ) : (
                        formatUSDC(member.collateralDeposited)
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-white/30">
                    No members match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -- Group Rules (open by default) -- */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <button
          onClick={() => setRulesOpen(!rulesOpen)}
          className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/[0.02]"
        >
          <h2 className="text-sm font-semibold text-white">Group Rules</h2>
          {rulesOpen ? (
            <ChevronUp className="h-4 w-4 text-white/30" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white/30" />
          )}
        </button>

        {rulesOpen && (
          <div className="flex flex-col gap-3 border-t border-white/[0.06] px-6 pb-6 pt-4">
            {[
              { label: "Payment window", value: "7 days" },
              { label: "Grace period", value: "3 days (5% late fee)" },
              { label: "Max missed payments", value: "3" },
              { label: "Protocol fee", value: `${protocolFeeBps / 100}%` },
              {
                label: "Selection method",
                value: "Switchboard VRF (verifiable)",
              },
            ].map((rule) => (
              <div
                key={rule.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-white/40">{rule.label}</span>
                <span className="font-mono text-xs text-white/60">
                  {rule.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* -- On-chain address -- */}
      <div className="text-center">
        <p className="text-xs text-white/20">
          Group address:{" "}
          <span className="font-mono text-white/30">{params.address}</span>
        </p>
      </div>

      {/* -- Lottery Animation -- */}
      <LotteryAnimation
        isOpen={showLottery}
        onClose={() => setShowLottery(false)}
        members={mockMembers
          .filter((m) => m.status !== "defaulted" && !m.hasReceived)
          .map((m) => ({ wallet: m.wallet, isYou: m.isYou }))}
        winnerWallet="8bWkTmRn4vSp9dXs2hYu5F"
        winnerAmount={4_925_000_000}
        roundNumber={4}
        vrfResult="a3f8c2e1d4b59067123456789abcdef0fedcba9876543210abcdef1234567890"
      />
    </div>
  );
}
