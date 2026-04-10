"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateGroupPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Create a Consorcio</h1>
        <p className="text-muted-foreground">
          Configure your savings circle and invite members.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Group Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Form coming in Phase 4...
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Live preview coming in Phase 4...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
