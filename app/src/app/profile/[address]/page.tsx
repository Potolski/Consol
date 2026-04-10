"use client";

import { useParams } from "next/navigation";
import {
  Star,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Calendar,
  Shield,
  TrendingUp,
} from "lucide-react";
import { truncateAddress } from "@/lib/utils";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <div key={star} className="relative">
            {/* Empty star (background) */}
            <Star className="h-5 w-5 text-white/10" />
            {/* Filled or half-filled overlay */}
            {(filled || half) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : "50%" }}
              >
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams<{ address: string }>();
  const address = params.address ?? "";

  // Mock profile data
  const profile = {
    reputation: 4.5,
    groupsCompleted: 5,
    groupsDefaulted: 0,
    totalPayments: 47,
    memberSince: "October 2025",
    currentGroups: 2,
    totalContributed: 23_500_000_000, // raw USDC
    totalReceived: 15_000_000_000,
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Profile</h1>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
            <span className="font-mono text-sm font-bold text-primary">
              {address.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-mono text-sm text-white/60">
              {truncateAddress(address, 8)}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-white/30">
              <Calendar className="h-3 w-3" />
              Member since {profile.memberSince}
            </p>
          </div>
        </div>
      </div>

      {/* Reputation Card */}
      <div className="rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-amber-500/[0.02] to-transparent p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-medium text-white/40">
              <Star className="h-3.5 w-3.5 text-amber-500" />
              Reputation Score
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-white">
                {profile.reputation}
              </span>
              <div className="flex flex-col gap-1">
                <StarRating rating={profile.reputation} />
                <span className="text-[10px] text-white/30">out of 5.0</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">
              Trusted Member
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          {
            icon: CheckCircle2,
            label: "Groups Completed",
            value: String(profile.groupsCompleted),
            color: "text-primary",
          },
          {
            icon: AlertTriangle,
            label: "Defaults",
            value: String(profile.groupsDefaulted),
            color: "text-emerald-400",
          },
          {
            icon: CreditCard,
            label: "Total Payments",
            value: String(profile.totalPayments),
            color: "text-blue-400",
          },
          {
            icon: TrendingUp,
            label: "Active Groups",
            value: String(profile.currentGroups),
            color: "text-amber-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]"
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
          </div>
        ))}
      </div>

      {/* Payment History Summary */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="mb-5 text-sm font-semibold text-white">
          Payment Summary
        </h2>
        <div className="flex flex-col gap-4">
          {[
            {
              label: "Total Contributed",
              value: "$23,500",
              sub: "across all groups",
            },
            {
              label: "Total Received",
              value: "$15,000",
              sub: "lottery winnings",
            },
            {
              label: "On-Time Rate",
              value: "100%",
              sub: "47 of 47 payments",
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-white/[0.04] pb-3 last:border-0 last:pb-0"
            >
              <div>
                <span className="text-sm text-white/50">{row.label}</span>
                <p className="text-[11px] text-white/25">{row.sub}</p>
              </div>
              <span className="font-mono text-sm font-semibold text-white/70">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* On-chain address */}
      <div className="text-center">
        <p className="text-xs text-white/20">
          Wallet:{" "}
          <span className="font-mono text-white/30">{address}</span>
        </p>
      </div>
    </div>
  );
}
