"use client";

import { useState, useEffect, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConsolProgram } from "@/providers/ConsolProvider";

interface GroupData {
  address: string;
  creator: string;
  mint: string;
  monthlyContribution: number;
  totalMembers: number;
  currentMembers: number;
  currentRound: number;
  status: "forming" | "active" | "completed" | "cancelled";
  collateralBps: number;
  insuranceBps: number;
  protocolFeeBps: number;
  createdAt: number;
  formationDeadline: number;
  roundStartedAt: number;
  membersReceived: number;
  activeMembers: number;
  description: string;
}

export function useGroup(address: string | undefined) {
  const { program } = useConsolProgram();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!address || !program) return;
    setLoading(true);
    setError(null);
    try {
      const pubkey = new PublicKey(address);
      // TODO: program.account.consorcioGroup will be available once IDL is generated
      const account = await (program.account as any).consorcioGroup.fetch(
        pubkey
      );
      // Parse Anchor enum: { forming: {} } -> "forming"
      const statusKey = Object.keys(account.status)[0] as GroupData["status"];
      setGroup({
        address,
        creator: account.creator.toBase58(),
        mint: account.mint.toBase58(),
        monthlyContribution: account.monthlyContribution.toNumber(),
        totalMembers: account.totalMembers,
        currentMembers: account.currentMembers,
        currentRound: account.currentRound,
        status: statusKey,
        collateralBps: account.collateralBps,
        insuranceBps: account.insuranceBps,
        protocolFeeBps: account.protocolFeeBps,
        createdAt: account.createdAt.toNumber(),
        formationDeadline: account.formationDeadline.toNumber(),
        roundStartedAt: account.roundStartedAt.toNumber(),
        membersReceived: account.membersReceived,
        activeMembers: account.activeMembers,
        description: account.description,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch group");
    } finally {
      setLoading(false);
    }
  }, [address, program]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { group, loading, error, refetch: fetch };
}
