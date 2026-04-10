"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const params = useParams<{ address: string }>();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="font-mono text-sm text-muted-foreground">
          {params.address}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reputation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Reputation system coming in Phase 7...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
