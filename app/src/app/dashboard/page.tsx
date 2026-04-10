"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Layers,
  DollarSign,
  Clock,
  Trophy,
  Wallet,
  ArrowRight,
  Bell,
  AlertTriangle,
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
        <appkit-button />
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
            value: "0",
            color: "text-primary",
          },
          {
            icon: DollarSign,
            label: "Total Invested",
            value: "$0",
            color: "text-blue-500",
          },
          {
            icon: Clock,
            label: "Next Payment",
            value: "—",
            color: "text-amber-500",
          },
          {
            icon: Trophy,
            label: "Total Winnings",
            value: "$0",
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
            0 active
          </Badge>
        </div>
        <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] p-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
              <Layers className="h-7 w-7 text-white/15" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/50">
                No groups yet
              </p>
              <p className="mt-1 text-xs text-white/30">
                Join an existing group or create your own consórcio
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                render={<Link href="/" />}
              >
                Browse Groups
              </Button>
              <Button
                size="sm"
                className="bg-primary font-medium text-white"
                render={<Link href="/create" />}
              >
                Create Group
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
