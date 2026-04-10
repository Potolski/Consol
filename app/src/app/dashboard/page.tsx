"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Layers,
  DollarSign,
  Clock,
  Trophy,
  Wallet,
} from "lucide-react";

export default function DashboardPage() {
  const { isConnected, address } = useAppKitAccount();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-6 pt-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
          <Wallet className="h-8 w-8 text-white/20" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Your Dashboard</h1>
          <p className="mt-2 text-sm text-white/40">
            Connect your wallet to view your groups and payments.
          </p>
        </div>
        <appkit-button />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
        <p className="mt-1 font-mono text-sm text-white/30">{address}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { icon: Layers, label: "Active Groups", value: "0" },
          { icon: DollarSign, label: "Total Invested", value: "0 USDC" },
          { icon: Clock, label: "Next Payment", value: "—" },
          { icon: Trophy, label: "Winnings", value: "0 USDC" },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="border-white/[0.06] bg-white/[0.02]"
          >
            <CardHeader className="flex-row items-center gap-2 pb-2">
              <stat.icon className="h-4 w-4 text-white/20" />
              <CardTitle className="text-xs font-medium text-white/40">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold font-mono text-white">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-white">Your Groups</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
            <Layers className="h-6 w-6 text-white/20" />
          </div>
          <p className="text-sm text-white/40">
            Your groups will appear here. Full dashboard coming in Phase 7...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
