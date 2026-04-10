"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface VRFProofDisplayProps {
  vrfResult: string;
  roundNumber: number;
  winnerIndex: number;
  totalEligible: number;
}

// ── Component ────────────────────────────────────────────────────────────────

export function VRFProofDisplay({
  vrfResult,
  roundNumber,
  winnerIndex,
  totalEligible,
}: VRFProofDisplayProps) {
  const [copied, setCopied] = useState(false);

  const truncatedVrf =
    vrfResult.length > 32 ? vrfResult.slice(0, 32) + "..." : vrfResult;

  function handleCopy() {
    navigator.clipboard.writeText(vrfResult).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#0D1117] p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium uppercase tracking-wider text-white/40">
          Verifiable Random Function Proof
        </h4>
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          <ShieldCheck className="h-3 w-3" />
          Provably Fair
        </span>
      </div>

      {/* VRF bytes */}
      <div className="group relative overflow-hidden rounded-lg bg-black/40 p-3">
        <code className="block break-all font-mono text-xs text-white/50">
          {truncatedVrf}
        </code>
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 rounded-md border border-white/[0.08] bg-white/[0.04] p-1.5 text-white/30 transition-colors hover:bg-white/[0.08] hover:text-white/60"
          aria-label="Copy VRF result"
        >
          {copied ? (
            <Check className="h-3 w-3 text-primary" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </div>

      {/* Calculation */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
          Selection Calculation
        </span>
        <code className="font-mono text-xs text-white/60">
          hash(vrf_result[0..8]) % {totalEligible} = {winnerIndex}
        </code>
      </div>

      {/* Round info */}
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
        <span className="text-xs text-white/30">
          Round {roundNumber}
        </span>
        <a
          href="#"
          className="inline-flex items-center gap-1 text-xs text-primary/70 transition-colors hover:text-primary"
          onClick={(e) => e.preventDefault()}
        >
          Verify on Solana Explorer
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
