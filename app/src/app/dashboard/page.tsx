"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/wallet/WalletButton";
import { Badge } from "@/components/ui/badge";
import GroupCard from "@/components/groups/GroupCard";
import { MOCK_GROUPS } from "@/lib/mock-data";
import Link from "next/link";
import {
  Layers,
  DollarSign,
  Clock,
  Trophy,
  Wallet,
  ArrowRight,
  Bell,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const { isConnected, address } = useAppKitAccount();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-8 pt-24 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-[100px]" />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] ring-1 ring-white/[0.06]">
          <Wallet className="h-10 w-10 text-white/20" />
        </div>
        <div className="relative">
          <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/40">
            Connect your wallet to see your active groups, upcoming payments,
            and winnings.
          </p>
        </div>
        <WalletButton />
      </div>
    );
  }

  const truncated = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "";

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 font-mono text-sm text-white/30">{truncated}</p>
        </div>
        <Button
          size="sm"
          className="w-fit gap-2 bg-primary font-medium text-white shadow-lg shadow-primary/20"
          render={<Link href="/create" />}
        >
          Create Group
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Layers,
            label: "Active Groups",
            value: "2",
            color: "text-primary",
          },
          {
            icon: DollarSign,
            label: "Total Invested",
            value: "$3,500",
            color: "text-blue-500",
          },
          {
            icon: Clock,
            label: "Next Payment",
            value: "4d 12h",
            color: "text-amber-500",
          },
          {
            icon: Trophy,
            label: "Total Winnings",
            value: "$5,000",
            color: "text-emerald-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.1]"
          >
            <div className="flex items-center gap-2">
              <stat.icon
                className={`h-4 w-4 ${stat.color} opacity-60`}
              />
              <span className="text-xs font-medium text-white/40">
                {stat.label}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums font-mono text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Payment Alerts */}
      <div className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white/60">
          <Bell className="h-4 w-4" />
          Alerts
        </h2>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-primary/30" />
            <p className="text-sm text-white/40">
              No pending actions. You&apos;re all caught up!
            </p>
          </div>
        </div>
      </div>

      {/* Your Groups */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Your Groups</h2>
          <Badge
            variant="outline"
            className="border-white/[0.08] bg-white/[0.03] text-white/40"
          >
            2 active
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MOCK_GROUPS.filter((g) => g.status === "active")
            .slice(0, 2)
            .map((group) => (
              <GroupCard
                key={group.address}
                address={group.address}
                description={group.description}
                creator={group.creator}
                monthlyContribution={group.monthlyContribution}
                totalMembers={group.totalMembers}
                currentMembers={group.currentMembers}
                status={group.status}
                collateralBps={group.collateralBps}
                insuranceBps={group.insuranceBps}
                currentRound={group.currentRound}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
