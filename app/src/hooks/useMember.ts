"use client";

import { useState, useEffect, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { usePoolverProgram } from "@/providers/PoolverProvider";
import { getMemberPDA } from "@/lib/pdas";

interface MemberData {
  address: string;
  group: string;
  wallet: string;
  collateralDeposited: number;
  paymentsMade: number;
  paymentsMissed: number;
  hasReceived: boolean;
  receivedRound: number;
  totalPaid: number;
  lastPaidRound: number;
  status: "active" | "defaulted" | "withdrawn";
  joinedAt: number;
}

export function useMember(
  groupAddress: string | undefined,
  walletAddress: string | undefined
) {
  const { program } = usePoolverProgram();
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMember = member !== null;

  const fetch = useCallback(async () => {
    if (!groupAddress || !walletAddress || !program) return;
    setLoading(true);
    setError(null);
    try {
      const groupPubkey = new PublicKey(groupAddress);
      const walletPubkey = new PublicKey(walletAddress);
      const [memberPDA] = getMemberPDA(groupPubkey, walletPubkey);
      // TODO: program.account.member will be available once IDL is generated
      const account = await (program.account as any).member.fetch(memberPDA);
      const statusKey = Object.keys(
        account.status
      )[0] as MemberData["status"];
      setMember({
        address: memberPDA.toBase58(),
        group: account.group.toBase58(),
        wallet: account.wallet.toBase58(),
        collateralDeposited: account.collateralDeposited.toNumber(),
        paymentsMade: account.paymentsMade,
        paymentsMissed: account.paymentsMissed,
        hasReceived: account.hasReceived,
        receivedRound: account.receivedRound,
        totalPaid: account.totalPaid.toNumber(),
        lastPaidRound: account.lastPaidRound,
        status: statusKey,
        joinedAt: account.joinedAt.toNumber(),
      });
    } catch {
      // Account doesn't exist = not a member (this is normal, not an error)
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, [groupAddress, walletAddress, program]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { member, isMember, loading, error, refetch: fetch };
}
