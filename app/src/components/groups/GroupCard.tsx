"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatUSDC, truncateAddress } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface GroupCardProps {
  address: string;
  description: string;
  creator: string;
  monthlyContribution: number; // raw USDC amount (6 decimals)
  totalMembers: number;
  currentMembers: number;
  status: "forming" | "active" | "completed";
  collateralBps: number;
  insuranceBps: number;
  currentRound?: number;
}

// ── Status config ────────────────────────────────────────────────────────────

const statusConfig = {
  forming: {
    label: "Forming",
    border: "border-primary/20",
    hoverShadow: "hover:shadow-lg hover:shadow-primary/10",
    badgeBg: "bg-primary/10",
    badgeText: "text-primary",
    badgeBorder: "border-primary/30",
  },
  active: {
    label: "Active",
    border: "border-amber-500/20",
    hoverShadow: "hover:shadow-lg hover:shadow-amber-500/10",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-500",
    badgeBorder: "border-amber-500/30",
  },
  completed: {
    label: "Completed",
    border: "border-white/[0.06]",
    hoverShadow: "",
    badgeBg: "bg-white/[0.06]",
    badgeText: "text-white/50",
    badgeBorder: "border-white/[0.08]",
  },
} as const;

// ── Component ────────────────────────────────────────────────────────────────

export default function GroupCard({
  address,
  description,
  creator,
  monthlyContribution,
  totalMembers,
  currentMembers,
  status,
  collateralBps,
  currentRound,
}: GroupCardProps) {
  const cfg = statusConfig[status];
  const poolPerRound = (monthlyContribution * totalMembers) / 1_000_000;
  const memberPercent = Math.round((currentMembers / totalMembers) * 100);

  return (
    <Link
      href={`/group/${address}`}
      className={`group flex flex-col gap-4 rounded-2xl border bg-white/[0.02] p-5 transition-all hover:border-white/[0.1] hover:bg-white/[0.04] ${cfg.border} ${cfg.hoverShadow}`}
    >
      {/* Top row: amount + badge */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xl font-bold text-white">
          {formatUSDC(monthlyContribution)}{" "}
          <span className="text-sm font-normal text-white/30">/mo</span>
        </span>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}
        >
          {cfg.label}
          {status === "active" && currentRound != null && (
            <span className="ml-1 text-white/30">
              R{currentRound + 1}
            </span>
          )}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm font-bold text-white">{description}</p>

      {/* Creator */}
      <p className="text-xs text-white/30">
        by {truncateAddress(creator)}
      </p>

      {/* Members progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">Members</span>
          <span className="font-mono text-xs text-white/50">
            {currentMembers}/{totalMembers}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${memberPercent}%` }}
          />
        </div>
      </div>

      {/* Bottom stats */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex flex-col">
          <span className="text-white/30">Pool/round</span>
          <span className="font-mono font-medium text-white/60">
            $
            {poolPerRound.toLocaleString("en-US", {
              minimumFractionDigits: poolPerRound % 1 === 0 ? 0 : 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="h-6 w-px bg-white/[0.06]" />
        <div className="flex flex-col">
          <span className="text-white/30">Collateral</span>
          <span className="font-mono font-medium text-white/60">
            {collateralBps / 100}%
          </span>
        </div>
      </div>

      {/* Separator + View Details */}
      <div className="border-t border-white/[0.06]" />
      <span className="inline-flex items-center gap-1 text-xs font-medium text-white/40 transition-colors group-hover:text-primary">
        View Details
        <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}
