"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import GroupCard from "@/components/groups/GroupCard";
import { useGroups } from "@/hooks/useGroups";
import { usePoolverProgram } from "@/providers/PoolverProvider";
import { MOCK_GROUPS } from "@/lib/mock-data";

type Filter = "all" | "forming" | "active" | "completed";

export default function PoolsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const { groups: realGroups, loading, error } = useGroups();
  const { program } = usePoolverProgram();

  const groups = realGroups.length > 0 ? realGroups : MOCK_GROUPS;
  const isDemo = !program && realGroups.length === 0;

  const filteredGroups =
    filter === "all"
      ? groups
      : groups.filter((g) => g.status === filter);

  const counts = {
    all: groups.length,
    forming: groups.filter((g) => g.status === "forming").length,
    active: groups.filter((g) => g.status === "active").length,
    completed: groups.filter((g) => g.status === "completed").length,
  };

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "forming", label: "Forming" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="flex flex-col gap-8 pb-16 pt-8">
      {/* Demo mode banner */}
      {isDemo && !loading && (
        <div className="rounded-xl bg-[#eff4ff] px-4 py-3 text-center text-xs text-[#26619d]">
          Showing demo data — deploy to devnet for real pools
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-xl bg-[#9f403d]/5 p-4 text-center text-sm text-[#9f403d]">
          Failed to load data. Please try again.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-[#00345e]">
            Savings Pools
          </h1>
          <p className="mt-1 text-[#526075]">
            Browse and join active savings pools
          </p>
        </div>
        <Button
          size="lg"
          className="gap-2 bg-[#006c4a] px-6 font-semibold text-[#e0ffec] shadow-lg shadow-[#006c4a]/10 hover:bg-[#005a3e] rounded-xl"
          render={<Link href="/create" />}
        >
          + Create New Pool
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#eff4ff] rounded-xl p-1 inline-flex gap-1 overflow-x-auto max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              filter === tab.key
                ? "bg-white shadow-sm text-[#00345e] font-semibold"
                : "text-[#526075] hover:text-[#00345e]"
            }`}
          >
            {tab.label}{" "}
            <span
              className={
                filter === tab.key ? "text-[#00345e]" : "text-[#526075]/60"
              }
            >
              ({counts[tab.key]})
            </span>
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl bg-[#eff4ff] p-6"
            >
              <div className="mb-4 h-4 w-2/3 rounded bg-[#dce9ff]" />
              <div className="mb-2 h-3 w-1/2 rounded bg-[#dce9ff]" />
              <div className="mb-6 h-3 w-1/3 rounded bg-[#dce9ff]" />
              <div className="h-8 w-full rounded bg-[#dce9ff]" />
            </div>
          ))}
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.address}
              address={group.address}
              description={group.description}
              creator={group.creator}
              monthlyContribution={group.monthlyContribution}
              totalMembers={group.totalMembers}
              currentMembers={group.currentMembers}
              status={group.status === "cancelled" ? "completed" : group.status}
              collateralBps={group.collateralBps}
              insuranceBps={group.insuranceBps}
              currentRound={group.currentRound}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl bg-[#eff4ff] px-8 py-20 text-center">
          <Search className="mb-4 h-8 w-8 text-[#26619d]" />
          <p className="text-sm font-medium text-[#00345e]">
            No pools match this filter
          </p>
          <p className="mt-1 text-xs text-[#526075]">
            Try selecting a different category or create a new pool
          </p>
        </div>
      )}
    </div>
  );
}
