"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  Users,
  Shield,
  DollarSign,
  Info,
  ArrowRight,
  Calculator,
  Loader2,
} from "lucide-react";

export default function CreateGroupPage() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState(500);
  const [groupSize, setGroupSize] = useState(10);
  const [collateralPct, setCollateralPct] = useState(20);
  const [insurancePct, setInsurancePct] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateGroup = async () => {
    setSubmitting(true);
    toast.loading("Creating group...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.dismiss();
    toast.success("Group created successfully!");
    router.push("/group/demo-new-group");
  };

  const preview = useMemo(() => {
    const poolPerRound = monthlyAmount * groupSize;
    const protocolFee = poolPerRound * 0.015;
    const estimatedPayout = poolPerRound - protocolFee;
    const collateral = (monthlyAmount * groupSize * collateralPct) / 100;
    const totalYouPay = monthlyAmount * groupSize;
    return {
      poolPerRound,
      protocolFee,
      estimatedPayout,
      collateral,
      totalYouPay,
    };
  }, [monthlyAmount, groupSize, collateralPct]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Create a Consórcio
        </h1>
        <p className="mt-1 text-white/50">
          Configure your savings circle. Members will join by depositing
          collateral.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {/* Description */}
          <Card className="border-white/[0.06] bg-white/[0.02]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <Sparkles className="h-4 w-4 text-primary" />
                Group Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-white/60">Description</Label>
                <Input
                  placeholder="e.g. Car Fund Circle, House Savings Group..."
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value.slice(0, 64))
                  }
                  className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/20 focus:border-primary/40"
                />
                <span className="text-xs text-white/30">
                  {description.length}/64 characters
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Financial params */}
          <Card className="border-white/[0.06] bg-white/[0.02]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <DollarSign className="h-4 w-4 text-primary" />
                Financial Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Monthly contribution */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-white/60">
                    Monthly Contribution
                  </Label>
                  <span className="font-mono text-sm font-semibold text-primary">
                    ${monthlyAmount.toLocaleString()} USDC
                  </span>
                </div>
                <Input
                  type="number"
                  min={10}
                  max={100000}
                  value={monthlyAmount}
                  onChange={(e) =>
                    setMonthlyAmount(Math.max(10, Number(e.target.value)))
                  }
                  className="border-white/[0.08] bg-white/[0.03] font-mono text-white focus:border-primary/40"
                />
                <p className="text-xs text-white/30">Minimum: $10 USDC</p>
              </div>

              {/* Group size */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-white/60">Group Size</Label>
                  <span className="font-mono text-sm font-semibold text-white">
                    {groupSize} members = {groupSize} months
                  </span>
                </div>
                <Slider
                  value={[groupSize]}
                  onValueChange={(v) =>
                    setGroupSize(Array.isArray(v) ? v[0] : v)
                  }
                  min={3}
                  max={50}
                  step={1}
                />
                <div className="flex justify-between text-xs text-white/30">
                  <span>3</span>
                  <span>50</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety params */}
          <Card className="border-white/[0.06] bg-white/[0.02]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <Shield className="h-4 w-4 text-primary" />
                Safety Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Collateral */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-white/60">
                    Collateral Requirement
                  </Label>
                  <span className="font-mono text-sm font-semibold text-amber-500">
                    {collateralPct}%
                  </span>
                </div>
                <Slider
                  value={[collateralPct]}
                  onValueChange={(v) =>
                    setCollateralPct(Array.isArray(v) ? v[0] : v)
                  }
                  min={5}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-white/30">
                  Each member deposits{" "}
                  <span className="font-mono text-white/50">
                    ${preview.collateral.toLocaleString()}
                  </span>{" "}
                  as collateral (returned at end)
                </p>
              </div>

              {/* Insurance */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-white/60">
                    Insurance Fund
                  </Label>
                  <span className="font-mono text-sm font-semibold text-blue-500">
                    {insurancePct}%
                  </span>
                </div>
                <Slider
                  value={[insurancePct]}
                  onValueChange={(v) =>
                    setInsurancePct(Array.isArray(v) ? v[0] : v)
                  }
                  min={0}
                  max={20}
                  step={1}
                />
                <p className="text-xs text-white/30">
                  Portion of each payment allocated to insurance pool
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Button
            size="lg"
            className="w-full gap-2 bg-primary py-6 text-base font-semibold text-white shadow-lg shadow-primary/25"
            disabled={!description || monthlyAmount < 10 || submitting}
            onClick={handleCreateGroup}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Group
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          <p className="text-center text-xs text-white/30">
            You&apos;ll be the first member. Collateral will be deducted upon
            creation.
          </p>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="sticky top-24 flex flex-col gap-4">
            {/* Live preview card */}
            <Card className="border-primary/20 bg-white/[0.02]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-white/60">
                    Live Preview
                  </CardTitle>
                  <Badge className="border-primary/30 bg-primary/10 text-xs text-primary">
                    Forming
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <p className="font-mono text-xl font-bold text-white">
                    ${monthlyAmount.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-white/40">
                      /mo
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    {description || "Your group name..."}
                  </p>
                </div>

                {/* Progress */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-white/40">
                    <span>Members</span>
                    <span>0/{groupSize}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06]">
                    <div className="h-full w-0 rounded-full bg-primary" />
                  </div>
                </div>

                <Separator className="bg-white/[0.06]" />

                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Users className="h-3.5 w-3.5" />
                  <span>
                    {groupSize} members · {groupSize} months
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Cost breakdown */}
            <Card className="border-white/[0.06] bg-white/[0.02]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm text-white/60">
                  <Calculator className="h-4 w-4" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      label: "Pool per round",
                      value: `$${preview.poolPerRound.toLocaleString()}`,
                      color: "text-white",
                    },
                    {
                      label: "Est. payout (per win)",
                      value: `~$${Math.floor(preview.estimatedPayout).toLocaleString()}`,
                      color: "text-primary",
                    },
                    {
                      label: "Protocol fee",
                      value: `$${preview.protocolFee.toLocaleString()} (1.5%)`,
                      color: "text-white/50",
                    },
                    {
                      label: "Your collateral",
                      value: `$${preview.collateral.toLocaleString()}`,
                      color: "text-amber-500",
                    },
                    {
                      label: "Total you pay",
                      value: `$${preview.totalYouPay.toLocaleString()}`,
                      color: "text-white",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs text-white/40">
                        {row.label}
                      </span>
                      <span className={`font-mono text-sm font-medium ${row.color}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Info callout */}
            <div className="flex gap-3 rounded-xl border border-primary/10 bg-primary/[0.04] p-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="text-xs leading-relaxed text-white/50">
                <p>
                  <span className="font-medium text-white/70">
                    Collateral is refundable
                  </span>{" "}
                  — it&apos;s returned to all non-defaulting members when the
                  group completes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
