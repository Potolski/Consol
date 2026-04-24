"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAllGroups, groupToPool, type GroupView } from "@/lib/program";
import type { Pool } from "@/lib/mock-data";

interface UseGroupsResult {
  groups: GroupView[];
  pools: Pool[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGroups(): UseGroupsResult {
  const [groups, setGroups] = useState<GroupView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchAllGroups();
      setGroups(rows);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    groups,
    pools: groups.map(groupToPool),
    loading,
    error,
    refetch: load,
  };
}
