"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchGroup,
  fetchMembersForGroup,
  fetchRoundsForGroup,
  groupToPool,
  type GroupView,
  type MemberView,
  type RoundView,
} from "@/lib/program";
import type { Pool } from "@/lib/mock-data";

interface UseGroupResult {
  group: GroupView | null;
  pool: Pool | null;
  members: MemberView[];
  rounds: RoundView[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGroup(address: string | undefined): UseGroupResult {
  const [group, setGroup] = useState<GroupView | null>(null);
  const [members, setMembers] = useState<MemberView[]>([]);
  const [rounds, setRounds] = useState<RoundView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!address) {
      setGroup(null);
      setMembers([]);
      setRounds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const g = await fetchGroup(address);
      setGroup(g);
      if (g) {
        const [ms, rs] = await Promise.all([
          fetchMembersForGroup(address),
          fetchRoundsForGroup(address),
        ]);
        setMembers(ms);
        setRounds(rs);
      } else {
        setMembers([]);
        setRounds([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    group,
    pool: group ? groupToPool(group) : null,
    members,
    rounds,
    loading,
    error,
    refetch: load,
  };
}
