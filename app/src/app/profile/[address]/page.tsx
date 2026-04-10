"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Award } from "lucide-react";

export default function ProfilePage() {
  const params = useParams<{ address: string }>();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="mt-1 font-mono text-sm text-white/30">
          {params.address}
        </p>
      </div>

      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Star className="h-4 w-4 text-amber-500" />
            Reputation
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
            <Award className="h-6 w-6 text-amber-500/50" />
          </div>
          <p className="text-sm text-white/40">
            Reputation system coming in Phase 7...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
