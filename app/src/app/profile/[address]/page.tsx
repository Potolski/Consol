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
            <Star className="h-5 w-5 text-[#d5e3fd]" />
            {/* Filled or half-filled overlay */}
            {(filled || half) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : "50%" }}
              >
                <Star className="h-5 w-5 fill-[#b8860b] text-[#b8860b]" />
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
        <h1 className="font-headline text-2xl font-bold text-[#00345e] sm:text-3xl">Profile</h1>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#85f8c4]/30">
            <span className="font-mono text-sm font-bold text-[#006c4a]">
              {address.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-mono text-sm text-[#00345e]">
              {truncateAddress(address, 8)}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-[#526075]">
              <Calendar className="h-3 w-3" />
              Member since {profile.memberSince}
            </p>
          </div>
        </div>
      </div>

      {/* Reputation Card */}
      <div className="rounded-xl bg-[#eff4ff] p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-medium font-headline text-[#526075]">
              <Star className="h-3.5 w-3.5 text-[#b8860b]" />
              Reputation Score
            </div>
            <div className="flex items-center gap-3">
              <span className="font-headline text-3xl font-bold text-[#00345e]">
                {profile.reputation}
              </span>
              <div className="flex flex-col gap-1">
                <StarRating rating={profile.reputation} />
                <span className="text-[10px] text-[#526075]">out of 5.0</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#85f8c4]/30 px-3 py-1.5">
            <Shield className="h-3.5 w-3.5 text-[#006c4a]" />
            <span className="text-xs font-semibold text-[#006c4a]">
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
            color: "text-[#006c4a]",
          },
          {
            icon: AlertTriangle,
            label: "Defaults",
            value: String(profile.groupsDefaulted),
            color: "text-[#006c4a]",
          },
          {
            icon: CreditCard,
            label: "Total Payments",
            value: String(profile.totalPayments),
            color: "text-[#26619d]",
          },
          {
            icon: TrendingUp,
            label: "Active Groups",
            value: String(profile.currentGroups),
            color: "text-[#b8860b]",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group rounded-xl bg-white p-5 shadow-sm transition-colors hover:bg-[#eff4ff]"
          >
            <div className="mb-3 flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs font-medium text-[#26619d]">
                {stat.label}
              </span>
            </div>
            <p className="font-mono text-2xl font-bold text-[#00345e]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Payment History Summary */}
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h2 className="font-headline mb-5 text-sm font-semibold text-[#00345e]">
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
              className="flex items-center justify-between bg-[#eff4ff]/50 rounded-lg px-4 py-3 last:mb-0"
            >
              <div>
                <span className="text-sm text-[#526075]">{row.label}</span>
                <p className="text-[11px] text-[#526075]/60">{row.sub}</p>
              </div>
              <span className="font-mono text-sm font-semibold text-[#00345e]">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* On-chain address */}
      <div className="text-center">
        <p className="text-xs text-[#526075]">
          Wallet:{" "}
          <span className="font-mono text-[#26619d]">{address}</span>
        </p>
      </div>
    </div>
  );
}
