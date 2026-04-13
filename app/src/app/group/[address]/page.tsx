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
  CheckCircle2,
  Share2,
  Sparkles,
  TrendingUp,
  Check,
  UserCircle,
  Dices,
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { PublicKey } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { truncateAddress } from "@/lib/utils";
import { getMockGroup } from "@/lib/mock-data";
import { useGroup } from "@/hooks/useGroup";
import { usePoolver } from "@/hooks/usePoolver";
import { getMemberPDA } from "@/lib/pdas";

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
  { wallet: "7xKp3dFr9mNq8bWkLz4f2D", status: "active", paymentsMade: 4, paymentsMissed: 0, hasReceived: true, receivedRound: 1, collateralDeposited: 1_000_000_000, isYou: false },
  { wallet: "9mNqBvXr2kLp5dWs7hYt3E", status: "active", paymentsMade: 4, paymentsMissed: 0, hasReceived: true, receivedRound: 2, collateralDeposited: 1_000_000_000, isYou: false },
  { wallet: "3dFrHnKm8wQp1bXs6jYv4G", status: "active", paymentsMade: 4, paymentsMissed: 0, hasReceived: true, receivedRound: 3, collateralDeposited: 1_000_000_000, isYou: false },
  { wallet: "8bWkTmRn4vSp9dXs2hYu5F", status: "active", paymentsMade: 4, paymentsMissed: 0, hasReceived: false, receivedRound: 0, collateralDeposited: 1_000_000_000, isYou: true },
  { wallet: "5hYtLnPm7wQp3dXs8jYv6H", status: "active", paymentsMade: 3, paymentsMissed: 1, hasReceived: false, receivedRound: 0, collateralDeposited: 750_000_000, isYou: false },
  { wallet: "2jYvNnQm6wSp4dXs9hYt7J", status: "defaulted", paymentsMade: 1, paymentsMissed: 3, hasReceived: false, receivedRound: 0, collateralDeposited: 0, isYou: false },
  { wallet: "4dXsMnRm5vQp8bWs1hYu8K", status: "active", paymentsMade: 4, paymentsMissed: 0, hasReceived: false, receivedRound: 0, collateralDeposited: 1_000_000_000, isYou: false },
  { wallet: "6hYuPnSm3wQp7dXs0jYv9L", status: "active", paymentsMade: 4, paymentsMissed: 0, hasReceived: false, receivedRound: 0, collateralDeposited: 1_000_000_000, isYou: false },
];

const memberNames: Record<string, string> = {
  "7xKp3dFr9mNq8bWkLz4f2D": "Alex Rivera",
  "9mNqBvXr2kLp5dWs7hYt3E": "Sarah Chen",
  "3dFrHnKm8wQp1bXs6jYv4G": "Mike Torres",
  "8bWkTmRn4vSp9dXs2hYu5F": "John Doe",
  "5hYtLnPm7wQp3dXs8jYv6H": "Lisa Park",
  "2jYvNnQm6wSp4dXs9hYt7J": "Carlos Ruiz",
  "4dXsMnRm5vQp8bWs1hYu8K": "Emma Davis",
  "6hYuPnSm3wQp7dXs0jYv9L": "Marcus Thorne",
};

const memberRoles: Record<string, string> = {
  "7xKp3dFr9mNq8bWkLz4f2D": "Circle Lead",
  "9mNqBvXr2kLp5dWs7hYt3E": "Verified Member",
  "3dFrHnKm8wQp1bXs6jYv4G": "Verified Member",
  "8bWkTmRn4vSp9dXs2hYu5F": "Action Required",
  "5hYtLnPm7wQp3dXs8jYv6H": "Verified Member",
  "2jYvNnQm6wSp4dXs9hYt7J": "Defaulted",
  "4dXsMnRm5vQp8bWs1hYu8K": "Verified Member",
  "6hYuPnSm3wQp7dXs0jYv9L": "Verified Member",
};

// Color palette for avatar circles based on wallet
const avatarColors = [
  "bg-[#006c4a]",
  "bg-[#26619d]",
  "bg-[#6b21a8]",
  "bg-[#005a3e]",
  "bg-[#b8860b]",
  "bg-[#9f403d]",
  "bg-[#0e7490]",
  "bg-[#4338ca]",
];

function getAvatarColor(wallet: string) {
  let hash = 0;
  for (let i = 0; i < wallet.length; i++) {
    hash = wallet.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Timeline months
const timelineMonths = [
  { label: "March 2024", short: "Mar 2024" },
  { label: "April 2024", short: "Apr 2024" },
  { label: "May 2024", short: "May 2024" },
  { label: "June 2024", short: "Jun 2024" },
  { label: "July 2024", short: "Jul 2024" },
  { label: "August 2024", short: "Aug 2024" },
  { label: "September 2024", short: "Sep 2024" },
  { label: "October 2024", short: "Oct 2024" },
];

type TimelineFilter = "past" | "current" | "future";

// ── Page ─────────────────────────────────────────────────────────────────────

export default function GroupDetailPage() {
  const params = useParams<{ address: string }>();
  const [showLottery, setShowLottery] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("current");
  const [showAllMembers, setShowAllMembers] = useState(false);
  const { makePayment, commitRound, resolveRound } = usePoolver();

  // Try real on-chain data first, then shared mock data, then hardcoded fallback
  const { group: realGroup, loading: groupLoading, error } = useGroup(params.address);

  const found = getMockGroup(params.address ?? "");
  const g = realGroup
    ? {
        description: realGroup.description,
        creator: realGroup.creator,
        monthlyContribution: realGroup.monthlyContribution,
        totalMembers: realGroup.totalMembers,
        currentMembers: realGroup.currentMembers,
        currentRound: realGroup.currentRound,
        status: realGroup.status,
        collateralBps: realGroup.collateralBps,
        insuranceBps: realGroup.insuranceBps,
        protocolFeeBps: realGroup.protocolFeeBps,
        poolBalance: realGroup.monthlyContribution * realGroup.currentMembers,
        insuranceBalance: Math.floor(
          realGroup.monthlyContribution * realGroup.currentMembers * (realGroup.insuranceBps / 10_000) * (realGroup.currentRound + 1)
        ),
        membersReceived: realGroup.membersReceived,
        activeMembers: realGroup.activeMembers,
      }
    : found
      ? {
          ...found,
          poolBalance: found.monthlyContribution * found.currentMembers,
          insuranceBalance: Math.floor(
            found.monthlyContribution * found.currentMembers * (found.insuranceBps / 10_000) * (found.currentRound + 1)
          ),
          activeMembers: found.activeMembers,
        }
      : fallbackGroup;

  const isDemo = !realGroup;

  const handleShareGroup = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const handleMakeContribution = useCallback(async () => {
    try {
      await makePayment(
        params.address,
        g.currentRound,
        new PublicKey("So11111111111111111111111111111111111111112"),
        new PublicKey("11111111111111111111111111111111")
      );
    } catch {
      toast.info("Payment requires devnet deployment. Showing demo confirmation.");
      toast.success("Payment confirmed (demo)!", {
        description: `$${(g.monthlyContribution / 1_000_000).toLocaleString()} USDC contributed to round ${g.currentRound + 1}`,
      });
    }
  }, [makePayment, params.address, g.currentRound, g.monthlyContribution]);

  const handleStartLottery = useCallback(async () => {
    try {
      // Step 1: Commit VRF randomness
      toast.info("Step 1/2: Committing VRF randomness...");
      const { randomnessAccount } = await commitRound(
        params.address,
        g.currentRound
      );

      // Step 2: Wait briefly for Switchboard oracle to process
      toast.info("Waiting for Switchboard oracle...");
      await new Promise((r) => setTimeout(r, 3000));

      // Step 3: Resolve — select winner using revealed randomness
      const eligibleMembers = mockMembers
        .filter((m) => m.status !== "defaulted" && !m.hasReceived)
        .map(
          (m) =>
            getMemberPDA(
              new PublicKey(params.address),
              new PublicKey(m.wallet)
            )[0]
        );

      await resolveRound(
        params.address,
        g.currentRound,
        randomnessAccount,
        eligibleMembers
      );

      // Show lottery animation on success
      setShowLottery(true);
    } catch {
      // If real VRF fails, fall back to demo animation
      toast.error("VRF not available — showing demo animation");
      setShowLottery(true);
    }
  }, [commitRound, resolveRound, params.address, g.currentRound]);

  // Show first 4 members in table preview, or all when toggled
  const displayedMembers = useMemo(() => {
    // Put "you" member at a visible position, sort others naturally
    const sorted = [...mockMembers].sort((a, b) => {
      if (a.isYou) return 0;
      if (b.isYou) return 0;
      return 0;
    });
    return showAllMembers ? sorted : sorted.slice(0, 4);
  }, [showAllMembers]);

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* -- Back link -- */}
      <Link
        href="/pools"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-[#26619d] transition-colors hover:text-[#00345e]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Pools
      </Link>

      {/* Error state */}
      {error && (
        <div className="rounded-xl bg-[#9f403d]/5 p-4 text-center text-sm text-[#9f403d]">
          Failed to load data. Please try again.
        </div>
      )}

      {/* Loading skeleton */}
      {groupLoading && (
        <div className="flex flex-col gap-8">
          {/* Header skeleton */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-32 rounded-full bg-[#eff4ff]" />
            <Skeleton className="h-12 w-full max-w-80 rounded-xl bg-[#eff4ff]" />
            <Skeleton className="h-5 w-full max-w-96 rounded-lg bg-[#eff4ff]" />
          </div>
          {/* Stat cards skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl bg-[#eff4ff]" />
            ))}
          </div>
          {/* Timeline skeleton */}
          <Skeleton className="h-40 rounded-xl bg-[#eff4ff]" />
          {/* Members table skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-7 w-40 rounded-lg bg-[#eff4ff]" />
            <Skeleton className="h-12 rounded-xl bg-[#eff4ff]" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl bg-[#eff4ff]" />
            ))}
          </div>
        </div>
      )}

      {/* Demo mode banner */}
      {isDemo && !groupLoading && (
        <div className="rounded-xl bg-[#eff4ff] px-4 py-3 text-center text-xs text-[#26619d]">
          Showing demo data — deploy to devnet for real group details
        </div>
      )}

      {/* -- Header Section (full width) -- */}
      {!groupLoading && (<>
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-[#006c4a] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#e0ffec]">
              {g.status === "forming"
                ? "Forming Pool"
                : g.status === "completed"
                  ? "Completed"
                  : "Active Pool"}
            </span>
            <span className="font-mono text-sm text-[#26619d]">
              #AP-2024-082
            </span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-[#00345e] md:text-5xl">
            Green Horizon Savings
          </h1>
          <p className="mt-2 max-w-lg text-lg text-[#26619d]">
            A collaborative wealth-building circle focused on renewable energy venture capital. 12 members, monthly rotation.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button
            size="lg"
            className="gap-2 rounded-xl bg-[#d5e3fd] px-6 py-3 font-semibold text-[#455367] hover:bg-[#dce9ff]"
            onClick={handleShareGroup}
          >
            <Share2 className="h-4 w-4" />
            Share Invite
          </Button>
          <Button
            size="lg"
            className="gap-2 rounded-xl bg-[#006c4a] px-6 py-3 font-bold text-[#e0ffec] shadow-[0_4px_24px_rgba(0,52,94,0.06)] hover:bg-[#005a3e]"
            onClick={handleMakeContribution}
          >
            <CircleDollarSign className="h-4 w-4" />
            Make Contribution
          </Button>
        </div>
      </header>

      {/* -- Three Stat Cards (full width, grid-cols-3) -- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Total Pooled Funds */}
        <div className="flex h-48 flex-col justify-between rounded-xl bg-white p-8 shadow-[0_4px_24px_rgba(0,52,94,0.06)]">
          <div className="flex items-start justify-between">
            <span className="font-headline text-xs font-bold uppercase tracking-widest text-[#26619d]">
              Total Pooled Funds
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006c4a]/10 text-[#006c4a]">
              <Wallet className="h-5 w-5" />
            </span>
          </div>
          <div>
            <div className="font-headline text-4xl font-extrabold tracking-tight text-[#00345e]">
              $42,850.00
            </div>
            <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#006c4a]">
              <TrendingUp className="h-3.5 w-3.5" />
              +12.4% vs last round
            </div>
          </div>
        </div>

        {/* Your Contribution */}
        <div className="flex h-48 flex-col justify-between rounded-xl bg-white p-8 shadow-[0_4px_24px_rgba(0,52,94,0.06)]">
          <div className="flex items-start justify-between">
            <span className="font-headline text-xs font-bold uppercase tracking-widest text-[#26619d]">
              Your Contribution
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#26619d]/10 text-[#26619d]">
              <UserCircle className="h-5 w-5" />
            </span>
          </div>
          <div>
            <div className="font-headline text-4xl font-extrabold tracking-tight text-[#00345e]">
              $3,570.00
            </div>
            <div className="mt-1 text-sm font-medium text-[#26619d]">
              8.3% of total pool ownership
            </div>
          </div>
        </div>

        {/* Pool Health */}
        <div className="flex h-48 flex-col justify-between rounded-xl bg-[#eff4ff] p-8 shadow-[0_4px_24px_rgba(0,52,94,0.06)]">
          <div className="flex items-start justify-between">
            <span className="font-headline text-xs font-bold uppercase tracking-widest text-[#26619d]">
              Pool Health
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006c4a]/10 text-[#006c4a]">
              <Shield className="h-5 w-5" />
            </span>
          </div>
          <div>
            <div className="font-headline text-4xl font-extrabold tracking-tight text-[#00345e]">
              98.2%
            </div>
            <div className="mt-1 text-sm font-medium text-[#26619d]">
              On-time contribution rate
            </div>
          </div>
        </div>
      </div>

      {/* -- Two-Column Layout -- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_20rem]">
        {/* ===== LEFT COLUMN ===== */}
        <div className="flex flex-col gap-8">
          {/* -- Monthly Rounds Timeline -- */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-headline text-2xl font-extrabold tracking-tight text-[#00345e]">
                Monthly Rounds Timeline
              </h2>
              <div className="flex items-center gap-4 text-sm font-medium">
                <button
                  onClick={() => setTimelineFilter("past")}
                  className={timelineFilter === "past" ? "font-bold text-[#00345e]" : "text-[#526075]"}
                >
                  Past
                </button>
                <span className="text-[#d2e4ff]">{"·"}</span>
                <button
                  onClick={() => setTimelineFilter("current")}
                  className={timelineFilter === "current" ? "font-bold text-[#00345e]" : "text-[#526075]"}
                >
                  Current
                </button>
                <span className="text-[#d2e4ff]">{"·"}</span>
                <button
                  onClick={() => setTimelineFilter("future")}
                  className={timelineFilter === "future" ? "font-bold text-[#00345e]" : "text-[#526075]"}
                >
                  Future
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-white p-8 shadow-[0_4px_24px_rgba(0,52,94,0.06)]">
              {/* Horizontal line */}
              <div className="absolute left-8 right-8 top-1/2 z-0 h-0.5 -translate-y-1/2 bg-[#dce9ff]" />

              <div className="no-scrollbar relative z-10 flex justify-between gap-4 overflow-x-auto pb-4">
                {timelineMonths.slice(0, 5).map((month, i) => {
                  const roundNum = i + 3; // rounds 3-7 for display
                  const isPast = roundNum < 5;
                  const isCurrent = roundNum === 5;
                  const isFuture = roundNum > 5;

                  return (
                    <div key={i} className={`flex min-w-[140px] flex-col items-center ${isPast ? "opacity-60" : ""}`}>
                      {/* Label above */}
                      <span className={`mb-4 text-xs font-bold uppercase tracking-widest ${
                        isCurrent
                          ? "font-headline text-[#006c4a]"
                          : isFuture
                            ? "text-[#26619d]/40"
                            : "font-headline text-[#26619d]"
                      }`}>
                        {isCurrent ? "Active Now" : `Round ${roundNum < 10 ? "0" : ""}${roundNum}`}
                      </span>

                      {/* Circle node */}
                      {isCurrent ? (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#006c4a] text-[#e0ffec] shadow-[0_4px_24px_rgba(0,52,94,0.06)] ring-8 ring-white">
                          <Sparkles className="h-5 w-5" />
                        </div>
                      ) : isPast ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dce9ff] text-[#00345e] ring-8 ring-white">
                          <Check className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff4ff] text-[#26619d]/40 ring-8 ring-white">
                          <Clock className="h-4 w-4" />
                        </div>
                      )}

                      {/* Month label */}
                      <span className={`mt-3 text-sm ${
                        isCurrent
                          ? "font-extrabold text-[#00345e]"
                          : isFuture
                            ? "font-medium text-[#26619d]/60"
                            : "font-semibold text-[#00345e]"
                      }`}>
                        {month.short}
                      </span>

                      {/* Sub-label */}
                      {isPast && (
                        <span className="text-[10px] font-bold uppercase text-[#26619d]">
                          $3,500 Paid
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-[#006c4a]">
                          Contribution Due
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* -- Group Members -- */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-headline text-2xl font-extrabold tracking-tight text-[#00345e]">
                Group Members
              </h2>
              <span className="text-sm font-medium text-[#26619d]">
                12 Contributors
              </span>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-[0_4px_24px_rgba(0,52,94,0.06)]">
              <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#eff4ff]">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#26619d]">
                      Member
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#26619d]">
                      Contribution
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#26619d]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-[#26619d]">
                      Last Paid
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedMembers.map((member, i) => {
                    const name = memberNames[member.wallet] ?? truncateAddress(member.wallet);
                    const role = memberRoles[member.wallet] ?? "Member";
                    const isYou = member.isYou;
                    const isPending = member.paymentsMissed > 0 || isYou;
                    const isDefaulted = member.status === "defaulted";

                    return (
                      <tr
                        key={member.wallet}
                        className={`transition-colors hover:bg-[#dce9ff] ${isYou ? "bg-[#e5eeff]/30" : i % 2 === 1 ? "bg-[#eff4ff]/50" : "bg-white"}`}
                      >
                        {/* Member */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white ${
                                isYou ? "bg-[#006c4a]" : getAvatarColor(member.wallet)
                              }`}
                            >
                              {getInitials(name)}
                            </div>
                            <div>
                              <div className="font-bold text-[#00345e]">
                                {name}
                                {isYou && " (You)"}
                              </div>
                              <div className={`text-xs ${isYou ? "font-semibold text-[#006c4a]" : "text-[#26619d]"}`}>
                                {role}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contribution */}
                        <td className={`px-6 py-5 font-semibold ${isYou ? "text-[#006c4a]" : "text-[#00345e]"}`}>
                          $3,500.00
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          {isDefaulted ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9f403d]/10 px-3 py-1 text-xs font-bold text-[#9f403d]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#9f403d]" />
                              Defaulted
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d5e3fd] px-3 py-1 text-xs font-bold text-[#455367]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#526075]" />
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006c4a]/10 px-3 py-1 text-xs font-bold text-[#006c4a]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#006c4a]" />
                              Confirmed
                            </span>
                          )}
                        </td>

                        {/* Last Paid */}
                        <td className="px-6 py-5 text-right text-sm text-[#26619d]">
                          {isYou
                            ? "---"
                            : member.paymentsMade >= 4
                              ? i === 0
                                ? "2h ago"
                                : i === 1
                                  ? "Yesterday"
                                  : "3 days ago"
                              : "---"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>

              {/* View All link */}
              <div className="bg-[#eff4ff]/30 px-6 py-4 text-center">
                <button
                  onClick={() => setShowAllMembers((prev) => !prev)}
                  className="text-sm font-bold text-[#006c4a] hover:underline"
                >
                  {showAllMembers ? "Show Less" : "View All 12 Members"}
                </button>
              </div>
            </div>
          </section>

          {/* Lottery Buttons */}
          <div className="flex justify-center gap-3">
            <Button
              size="lg"
              className="gap-2 rounded-xl bg-[#006c4a] px-6 text-sm font-bold text-[#e0ffec] shadow-[0_4px_24px_rgba(0,52,94,0.06)] hover:bg-[#005a3e]"
              onClick={handleStartLottery}
            >
              <Dices className="h-4 w-4" />
              Start Lottery (VRF)
            </Button>
            <Button
              size="lg"
              className="gap-2 rounded-xl bg-[#d5e3fd] px-6 text-sm text-[#455367] hover:bg-[#dce9ff]"
              onClick={() => setShowLottery(true)}
            >
              <Sparkles className="h-4 w-4 text-[#b8860b]" />
              Demo Lottery
            </Button>
          </div>
        </div>

        {/* ===== RIGHT COLUMN (Sidebar) ===== */}
        <div className="flex flex-col gap-6">
          {/* Round Summary */}
          <div className="rounded-xl bg-white p-8 shadow-[0_4px_24px_rgba(0,52,94,0.06)]">
            <h3 className="font-headline text-lg font-bold text-[#00345e]">
              Round Summary
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#26619d]">Current Target</span>
                <span className="font-bold text-[#00345e]">$42,000.00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#26619d]">Collected</span>
                <span className="font-bold text-[#00345e]">$28,000.00</span>
              </div>
              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5eeff]">
                <div className="h-full w-2/3 rounded-full bg-[#006c4a]" />
              </div>
              <p className="text-xs leading-relaxed text-[#26619d]">
                8 of 12 members have contributed. The round closes in{" "}
                <span className="font-bold text-[#00345e]">4 days, 12 hours</span>.
              </p>
            </div>
          </div>

          {/* Group Protocol */}
          <div className="rounded-xl bg-[#eff4ff] p-8">
            <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-[#00345e]">
              Group Protocol
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2 text-xs text-[#26619d]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#006c4a]" />
                <span>Mandatory contribution by the 1st of every month.</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-[#26619d]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#006c4a]" />
                <span>1.5% fee directed to insurance pool.</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-[#26619d]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#006c4a]" />
                <span>Full collateral returned after completion.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* -- On-chain address -- */}
      <div className="text-center">
        <p className="text-xs text-[#526075]">
          Group address:{" "}
          <span className="font-mono text-[#26619d]">{params.address}</span>
        </p>
      </div>
      </>)}

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
