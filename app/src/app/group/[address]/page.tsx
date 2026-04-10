"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GroupDetailPage() {
  const params = useParams<{ address: string }>();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="border-primary/30 text-primary">
          Forming
        </Badge>
        <h1 className="text-3xl font-bold">Group Detail</h1>
      </div>

      <p className="text-sm font-mono text-muted-foreground">
        {params.address}
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Pool Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">— USDC</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Insurance Fund
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">— USDC</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Next Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">— USDC</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members & Rounds</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Full group detail coming in Phase 5...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
