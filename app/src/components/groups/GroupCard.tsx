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
    shadow: "shadow-[#006c4a]/5 hover:shadow-[#006c4a]/10",
    badgeBg: "bg-[#85f8c4]/30",
    badgeText: "text-[#006c4a]",
  },
  active: {
    label: "Active",
    shadow: "shadow-[#b8860b]/5 hover:shadow-[#b8860b]/10",
    badgeBg: "bg-[#b8860b]/10",
    badgeText: "text-[#b8860b]",
  },
  completed: {
    label: "Completed",
    shadow: "",
    badgeBg: "bg-[#eff4ff]",
    badgeText: "text-[#526075]",
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
      className={`group flex flex-col gap-4 rounded-xl bg-white p-8 shadow-sm transition-all hover:bg-[#eff4ff] hover:shadow-md ${cfg.shadow}`}
    >
      {/* Top row: amount + badge */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xl font-bold text-[#00345e]">
          {formatUSDC(monthlyContribution)}{" "}
          <span className="text-sm font-normal text-[#526075]">/mo</span>
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.badgeBg} ${cfg.badgeText}`}
        >
          {cfg.label}
          {status === "active" && currentRound != null && (
            <span className="ml-1 text-[#526075]">
              R{currentRound + 1}
            </span>
          )}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm font-semibold text-[#00345e]">{description}</p>

      {/* Creator */}
      <p className="text-xs text-[#26619d]">
        by {truncateAddress(creator)}
      </p>

      {/* Members progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#526075]">Members</span>
          <span className="font-mono text-xs text-[#00345e]">
            {currentMembers}/{totalMembers}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#d5e3fd]">
          <div
            className="h-full rounded-full bg-[#006c4a] transition-all"
            style={{ width: `${memberPercent}%` }}
          />
        </div>
      </div>

      {/* Bottom stats */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex flex-col">
          <span className="text-[#526075]">Pool/round</span>
          <span className="font-mono font-medium text-[#00345e]">
            $
            {poolPerRound.toLocaleString("en-US", {
              minimumFractionDigits: poolPerRound % 1 === 0 ? 0 : 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="h-6 w-px bg-[#d5e3fd]" />
        <div className="flex flex-col">
          <span className="text-[#526075]">Collateral</span>
          <span className="font-mono font-medium text-[#00345e]">
            {collateralBps / 100}%
          </span>
        </div>
      </div>

      {/* Separator + View Details */}
      <div className="h-px bg-[#eff4ff]" />
      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#006c4a] transition-colors group-hover:text-[#006c4a]">
        View Details
        <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}
