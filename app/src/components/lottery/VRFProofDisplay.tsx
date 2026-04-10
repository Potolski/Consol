"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";

interface VRFProofDisplayProps {
  vrfResult: string;
  roundNumber: number;
  winnerIndex: number;
  totalEligible: number;
}

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
    <div className="flex flex-col gap-3 rounded-xl bg-[#eff4ff] p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium uppercase tracking-wider text-[#526075]">
          Verifiable Random Function Proof
        </h4>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#006c4a]/10 px-2 py-0.5 text-[10px] font-medium text-[#006c4a]">
          <ShieldCheck className="h-3 w-3" />
          Provably Fair
        </span>
      </div>

      {/* VRF bytes */}
      <div className="group relative overflow-hidden rounded-lg bg-white p-3">
        <code className="block break-all font-mono text-xs text-[#26619d]">
          {truncatedVrf}
        </code>
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 rounded-md bg-[#eff4ff] p-1.5 text-[#526075] transition-colors hover:bg-[#dce9ff] hover:text-[#00345e]"
          aria-label="Copy VRF result"
        >
          {copied ? (
            <Check className="h-3 w-3 text-[#006c4a]" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </div>

      {/* Calculation */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[#526075]">
          Selection Calculation
        </span>
        <code className="font-mono text-xs text-[#00345e]">
          hash(vrf_result[0..8]) % {totalEligible} = {winnerIndex}
        </code>
      </div>

      {/* Round info */}
      <div className="flex items-center justify-between pt-3">
        <span className="text-xs text-[#526075]">
          Round {roundNumber}
        </span>
        <a
          href={`https://explorer.solana.com/tx/${vrfResult?.slice(0, 16)}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[#006c4a] transition-colors hover:text-[#005a3e]"
        >
          Verify on Solana Explorer
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
