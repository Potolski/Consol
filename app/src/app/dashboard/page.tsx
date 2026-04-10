"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletButton } from "@/components/wallet/WalletButton";

export default function DashboardPage() {
  const { connected, publicKey } = useWallet();

  if (!connected) {
    return (
      <div className="flex flex-col items-center gap-6 pt-20 text-center">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <p className="text-muted-foreground">
          Connect your wallet to view your groups and payments.
        </p>
        <WalletButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <p className="font-mono text-sm text-muted-foreground">
          {publicKey?.toBase58()}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Active Groups", value: "0" },
          { label: "Total Invested", value: "0 USDC" },
          { label: "Next Payment", value: "—" },
          { label: "Winnings", value: "0 USDC" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold font-mono">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your groups will appear here. Full dashboard coming in Phase 7...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
