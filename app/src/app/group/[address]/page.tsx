"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Shield, CircleDollarSign, Users } from "lucide-react";

export default function GroupDetailPage() {
  const params = useParams<{ address: string }>();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Badge className="border-primary/30 bg-primary/10 text-primary">
            Forming
          </Badge>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Group Detail
          </h1>
        </div>
        <p className="text-sm font-mono text-white/30">
          {params.address}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {[
          {
            icon: Wallet,
            label: "Pool Balance",
            value: "— USDC",
            color: "text-primary",
          },
          {
            icon: Shield,
            label: "Insurance Fund",
            value: "— USDC",
            color: "text-amber-500",
          },
          {
            icon: CircleDollarSign,
            label: "Next Payout",
            value: "— USDC",
            color: "text-blue-500",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="border-white/[0.06] bg-white/[0.02]"
          >
            <CardHeader className="flex-row items-center gap-2 pb-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
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

      {/* Members & Rounds */}
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-white">Members & Rounds</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
            <Users className="h-6 w-6 text-white/20" />
          </div>
          <p className="text-sm text-white/40">
            Full group detail coming in Phase 5...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
