"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function CreateGroupPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Create a Consorcio</h1>
        <p className="mt-1 text-white/50">
          Configure your savings circle and invite members.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="border-white/[0.06] bg-white/[0.02] lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-white">Group Settings</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-white/40">
              Form coming in Phase 4...
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/[0.06] bg-white/[0.02] lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] p-8 text-center">
              <p className="text-xs text-white/30">
                Preview will update as you configure
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
