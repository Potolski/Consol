"use client";

import { useState, useEffect, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { usePoolverProgram } from "@/providers/PoolverProvider";
import { getRoundPDA } from "@/lib/pdas";

interface RoundData {
  address: string;
  group: string;
  roundNumber: number;
  totalCollected: number;
  paymentsReceived: number;
  lotteryWinner: string;
  winnerSelected: boolean;
  distributionClaimed: boolean;
  distributionAmount: number;
  vrfResult: number[];
  status: "collecting" | "selecting" | "distributing" | "completed";
  startedAt: number;
  commitSlot: number;
}

export function useRound(
  groupAddress: string | undefined,
  roundNumber: number | undefined
) {
  const { program } = usePoolverProgram();
  const [round, setRound] = useState<RoundData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!groupAddress || roundNumber === undefined || !program) return;
    setLoading(true);
    setError(null);
    try {
      const groupPubkey = new PublicKey(groupAddress);
      const [roundPDA] = getRoundPDA(groupPubkey, roundNumber);
      // TODO: program.account.round will be available once IDL is generated
      const account = await (program.account as any).round.fetch(roundPDA);
      const statusKey = Object.keys(
        account.status
      )[0] as RoundData["status"];
      setRound({
        address: roundPDA.toBase58(),
        group: account.group.toBase58(),
        roundNumber: account.roundNumber,
        totalCollected: account.totalCollected.toNumber(),
        paymentsReceived: account.paymentsReceived,
        lotteryWinner: account.lotteryWinner.toBase58(),
        winnerSelected: account.winnerSelected,
        distributionClaimed: account.distributionClaimed,
        distributionAmount: account.distributionAmount.toNumber(),
        vrfResult: Array.from(account.vrfResult),
        status: statusKey,
        startedAt: account.startedAt.toNumber(),
        commitSlot: account.commitSlot.toNumber(),
      });
    } catch {
      setRound(null);
    } finally {
      setLoading(false);
    }
  }, [groupAddress, roundNumber, program]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { round, loading, error, refetch: fetch };
}
