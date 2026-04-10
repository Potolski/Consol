"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAppKitAccount } from "@reown/appkit/react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/wallet/WalletButton";
import {
  ArrowLeft,
  Shield,
  Sparkles,
  Check,
  Loader2,
  HelpCircle,
  Wallet,
} from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { useConsol } from "@/hooks/useConsol";
import { USDC_MINT_DEVNET } from "@/lib/constants";

export default function CreateGroupPage() {
  const router = useRouter();
  const { isConnected } = useAppKitAccount();
  const { createGroup } = useConsol();

  if (!isConnected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#eff4ff]">
          <Wallet className="h-8 w-8 text-[#26619d]" />
        </div>
        <div>
          <h1 className="font-headline text-2xl font-bold text-[#00345e]">
            Connect to Create
          </h1>
          <p className="mt-2 text-sm text-[#526075]">
            You need to connect your wallet to create a savings pool.
          </p>
        </div>
        <WalletButton />
      </div>
    );
  }
  const [description, setDescription] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState(500);
  const [groupSize, setGroupSize] = useState(10);
  const [collateralPct, setCollateralPct] = useState(20);
  const [insurancePct, setInsurancePct] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateGroup = async () => {
    if (!createGroup) {
      toast.error("Connect your wallet first");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createGroup({
        monthlyContribution: monthlyAmount * 1_000_000, // dollars to USDC 6-decimal
        totalMembers: groupSize,
        collateralBps: collateralPct * 100,
        insuranceBps: insurancePct * 100,
        description,
        mint: new PublicKey(USDC_MINT_DEVNET),
      });
      router.push(`/group/${result.groupAddress}`);
    } catch {
      // Error already shown by useConsol toast
    } finally {
      setSubmitting(false);
    }
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

  const totalToCommit = preview.collateral + preview.totalYouPay;

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <main className="mx-auto max-w-6xl px-6 pb-12 pt-8">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* ── Left Column: Context & Preview ── */}
          <div className="space-y-8 md:col-span-5">
            {/* Back link */}
            <Link
              href="/pools"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#26619d] transition-colors hover:text-[#006c4a]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Pools
            </Link>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-[#00345e]">
                Create your savings pool
              </h1>
              <p className="text-lg leading-relaxed text-[#526075]">
                Configure your cons&oacute;rcio parameters. Members will join by
                depositing collateral.
              </p>
            </div>

            {/* Pool Preview Card */}
            <div className="rounded-xl bg-[#eff4ff] p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#85f8c4]">
                  <Shield className="h-6 w-6 text-[#005e40]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#26619d]/70">
                    Preview
                  </p>
                  <p className="text-lg font-bold text-[#00345e]">
                    {description || "Your Pool"}
                  </p>
                </div>
              </div>
              <div className="h-px bg-[#eff4ff]" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#526075]">Est. Duration</p>
                  <p className="text-base font-semibold text-[#00345e]">
                    {groupSize} months
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#526075]">Members</p>
                  <p className="text-base font-semibold text-[#00345e]">
                    {groupSize}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Shield className="mt-1 h-5 w-5 text-[#006c4a]" />
                <div>
                  <p className="text-sm font-bold text-[#00345e]">
                    Vault-Grade Security
                  </p>
                  <p className="text-xs text-[#526075]">
                    Smart contracts audited with verifiable on-chain logic
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="mt-1 h-5 w-5 text-[#006c4a]" />
                <div>
                  <p className="text-sm font-bold text-[#00345e]">
                    Member Protection
                  </p>
                  <p className="text-xs text-[#526075]">
                    Covered by the cons&oacute;rcio insurance pool
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 text-[#006c4a]" />
                <div>
                  <p className="text-sm font-bold text-[#00345e]">
                    Verifiable Fairness
                  </p>
                  <p className="text-xs text-[#526075]">
                    VRF-powered lottery selection, provably random
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Form ── */}
          <div className="md:col-span-7">
            <div className="rounded-xl bg-white p-8 shadow-[0px_60px_30px_-20px_rgba(0,52,94,0.04)] md:p-10">
              <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateGroup();
                }}
              >
                {/* Section title */}
                <h2 className="font-headline text-xl font-bold text-[#00345e]">
                  Group Configuration
                </h2>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#26619d]">
                    Description
                  </label>
                  <Input
                    placeholder="e.g. Car Fund Circle, House Savings Group..."
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value.slice(0, 64))
                    }
                    className="border-0 bg-[#eff4ff] rounded-lg px-4 py-3 text-[#00345e] placeholder:text-[#526075]/50 focus:ring-1 focus:ring-[#006c4a]"
                  />
                  <span className="text-xs text-[#526075]">
                    {description.length}/64 characters
                  </span>
                </div>

                {/* Monthly Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#26619d]">
                    Monthly Amount
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={10}
                      max={100000}
                      value={monthlyAmount}
                      onChange={(e) =>
                        setMonthlyAmount(Math.max(10, Number(e.target.value)))
                      }
                      className="border-0 bg-[#eff4ff] rounded-lg px-5 py-4 text-2xl font-bold font-headline text-[#00345e] focus:ring-1 focus:ring-[#006c4a] h-auto"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-lg font-bold text-[#526075]">
                        USDC
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#526075]">Minimum: $10 USDC</p>
                </div>

                {/* Group Size Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-[#26619d]">
                      Group Size
                    </label>
                    <span className="font-mono text-sm font-semibold text-[#00345e]">
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
                  <div className="flex justify-between text-xs text-[#526075]">
                    <span>3</span>
                    <span>50</span>
                  </div>
                </div>

                {/* Collateral % Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-[#26619d]">
                      Collateral Requirement
                    </label>
                    <span className="font-mono text-sm font-semibold text-[#b8860b]">
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
                  <p className="text-xs text-[#526075]">
                    Each member deposits{" "}
                    <span className="font-mono text-[#00345e]">
                      ${preview.collateral.toLocaleString()}
                    </span>{" "}
                    as collateral (returned at end)
                  </p>
                </div>

                {/* Insurance % Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-[#26619d]">
                      Insurance Fund
                    </label>
                    <span className="font-mono text-sm font-semibold text-[#26619d]">
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
                  <p className="text-xs text-[#526075]">
                    Portion of each payment allocated to insurance pool
                  </p>
                </div>

                {/* Fee Breakdown */}
                <div className="space-y-4 pt-6"><div className="-mt-6 mb-4 h-px bg-[#eff4ff]" />
                  <div className="flex justify-between text-sm">
                    <span className="text-[#526075]">Pool per round</span>
                    <span className="font-mono font-medium text-[#00345e]">
                      ${preview.poolPerRound.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#526075]">Est. payout</span>
                    <span className="font-mono font-medium text-[#006c4a]">
                      ~${Math.floor(preview.estimatedPayout).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#526075]">Protocol fee (1.5%)</span>
                    <span className="font-mono font-medium text-[#526075]">
                      ${preview.protocolFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#526075]">Your collateral</span>
                    <span className="font-mono font-medium text-[#b8860b]">
                      ${preview.collateral.toLocaleString()}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="h-px bg-[#eff4ff]" />
                  <div className="flex justify-between pt-4">
                    <span className="text-lg font-bold text-[#00345e]">
                      Total to Commit
                    </span>
                    <span className="font-headline text-2xl font-extrabold text-[#00345e]">
                      $
                      {totalToCommit.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      USDC
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="space-y-4 pt-4">
                  <Button
                    type="submit"
                    disabled={!description || monthlyAmount < 10 || submitting}
                    className="w-full bg-[#006c4a] text-[#e0ffec] py-5 rounded-xl font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_10px_20px_-5px_rgba(0,108,74,0.3)] flex items-center justify-center gap-3 h-auto border-0"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        Confirm Pool Creation
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs leading-relaxed text-[#526075] px-4">
                    By clicking confirm, you agree to the Pool Participation
                    Terms and authorize the smart contract to execute this
                    transaction.
                  </p>
                </div>
              </form>
            </div>

            {/* Support link */}
            <div className="mt-8 flex items-center gap-2 px-4 text-sm text-[#526075]">
              <HelpCircle className="h-4 w-4" />
              Need assistance?
            </div>
          </div>
        </div>

        <footer className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#526075]">
          <p>Consol Protocol &copy; 2026</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Risk Disclosure</span>
            <span>Status</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
