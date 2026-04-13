"use client";

import { useState, useEffect, useCallback } from "react";
import { usePoolverProgram } from "@/providers/PoolverProvider";

interface GroupListItem {
  address: string;
  description: string;
  creator: string;
  monthlyContribution: number;
  totalMembers: number;
  currentMembers: number;
  status: "forming" | "active" | "completed" | "cancelled";
  collateralBps: number;
  insuranceBps: number;
  currentRound: number;
}

export function useGroups(
  statusFilter?: "forming" | "active" | "completed"
) {
  const { program } = usePoolverProgram();
  const [groups, setGroups] = useState<GroupListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!program) return;
    setLoading(true);
    setError(null);
    try {
      // TODO: program.account.consorcioGroup will be available once IDL is generated
      const accounts = await (program.account as any).consorcioGroup.all();
      const parsed: GroupListItem[] = accounts.map(
        (a: { publicKey: { toBase58(): string }; account: any }) => {
          const statusKey = Object.keys(
            a.account.status
          )[0] as GroupListItem["status"];
          return {
            address: a.publicKey.toBase58(),
            description: a.account.description,
            creator: a.account.creator.toBase58(),
            monthlyContribution: a.account.monthlyContribution.toNumber(),
            totalMembers: a.account.totalMembers,
            currentMembers: a.account.currentMembers,
            status: statusKey,
            collateralBps: a.account.collateralBps,
            insuranceBps: a.account.insuranceBps,
            currentRound: a.account.currentRound,
          };
        }
      );

      if (statusFilter) {
        setGroups(parsed.filter((g) => g.status === statusFilter));
      } else {
        setGroups(parsed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  }, [program, statusFilter]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { groups, loading, error, refetch: fetch };
}
