"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PoolverMark } from "@/components/brand/PoolverLogo";
import { PoolCard } from "@/components/pools/PoolCard";
import { useGroups } from "@/hooks/useGroups";
import { fmtUSD, type PoolStatus } from "@/lib/mock-data";

type Filter = "all" | PoolStatus;
type Sort = "rep" | "size" | "monthly" | "soon";

export default function PoolsPage() {
  const { pools, loading, error, refetch } = useGroups();
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("size");

  const visible = useMemo(() => {
    const filtered = pools.filter(
      (p) => filter === "all" || p.status === filter
    );
    return [...filtered].sort((a, b) => {
      if (sort === "rep") return (b.rep ?? 0) - (a.rep ?? 0);
      if (sort === "size") return b.total - a.total;
      if (sort === "monthly") return a.monthly - b.monthly;
      if (sort === "soon") return a.nextDraw.localeCompare(b.nextDraw);
      return 0;
    });
  }, [pools, filter, sort]);

  const counts = {
    all: pools.length,
    active: pools.filter((p) => p.status === "active").length,
    forming: pools.filter((p) => p.status === "forming").length,
    closing: pools.filter((p) => p.status === "closing").length,
  };

  const tvl = pools.reduce((s, p) => s + p.total, 0);
  const wallets = pools.reduce((s, p) => s + p.members, 0);

  return (
    <>
      <section style={{ borderBottom: "1px solid var(--line)", padding: "48px 0 32px" }}>
        <div className="shell pools-hero-grid">
          <div>
            <div className="hero-kicker">
              <span className="sq" />
              ALL POOLS · LIVE INDEX
            </div>
            <h1
              className="hero-headline"
              style={{ fontSize: "clamp(36px, 4.4vw, 60px)", margin: "16px 0 14px" }}
            >
              Concurrent <em>circles</em>.<br />Pick your ticket.
            </h1>
            <p className="hero-deck" style={{ maxWidth: "56ch" }}>
              Every pool is isolated state on the Solana program. Collateral,
              roster, draw schedule — independent. Join any you qualify for.
            </p>
          </div>
          <div className="stats" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="stat" style={{ padding: 18 }}>
              <div className="lbl">
                <PoolverMark size={11} /> Total value locked
              </div>
              <div className="v" style={{ fontSize: 32, margin: "10px 0 6px" }}>
                {fmtUSD(tvl)}
              </div>
              <div className="sub">Across {pools.length} pools</div>
            </div>
            <div className="stat" style={{ padding: 18 }}>
              <div className="lbl">
                <PoolverMark size={11} /> Member slots filled
              </div>
              <div className="v" style={{ fontSize: 32, margin: "10px 0 6px" }}>
                {wallets}
              </div>
              <div className="sub">Devnet · USDC test mint</div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="shell"
        style={{
          padding: "24px 0 12px",
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: 3,
            background: "var(--bg-2)",
            border: "1px solid var(--line)",
            borderRadius: 2,
          }}
        >
          {(
            [
              ["all", "ALL"],
              ["active", "ACTIVE"],
              ["forming", "FORMING"],
              ["closing", "CLOSING"],
            ] as const
          ).map(([k, lbl]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              style={{
                padding: "5px 12px",
                fontSize: 10,
                borderRadius: 2,
                border: 0,
                cursor: "pointer",
                fontFamily: "var(--mono)",
                letterSpacing: "0.08em",
                background: filter === k ? "var(--bg)" : "transparent",
                boxShadow: filter === k ? "inset 0 0 0 1px var(--line-2)" : "none",
                color: filter === k ? "var(--acc)" : "var(--fg-3)",
              }}
            >
              {lbl}{" "}
              <span style={{ color: "var(--fg-4)", marginLeft: 4 }}>
                {counts[k]}
              </span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              fontSize: 10,
              color: "var(--fg-4)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="pool-select"
          >
            <option value="size">Pool size</option>
            <option value="monthly">Monthly (low → high)</option>
            <option value="soon">Next draw (soonest)</option>
            <option value="rep">Circle reputation</option>
          </select>
        </div>
      </section>

      <section className="shell" style={{ padding: "12px 0 48px" }}>
        {loading ? (
          <EmptyState label="Loading pools from devnet…" />
        ) : error ? (
          <ErrorState message={error.message} onRetry={refetch} />
        ) : visible.length === 0 ? (
          <EmptyPoolsState total={pools.length} filter={filter} />
        ) : (
          <div className="pools-grid">
            {visible.map((p) => (
              <PoolCard key={p.address ?? p.id} p={p} featured={p.featured} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: "64px 16px",
        textAlign: "center",
        color: "var(--fg-3)",
        fontFamily: "var(--mono)",
        fontSize: 12,
        letterSpacing: "0.1em",
        border: "1px dashed var(--line)",
        borderRadius: 2,
      }}
    >
      {label}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      style={{
        padding: "48px 16px",
        textAlign: "center",
        border: "1px solid var(--err)",
        borderRadius: 2,
        color: "var(--err)",
      }}
    >
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, marginBottom: 8 }}>
        RPC error
      </div>
      <div style={{ color: "var(--fg-2)", fontSize: 13, marginBottom: 16 }}>
        {message}
      </div>
      <button className="btn sm" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

function EmptyPoolsState({ total, filter }: { total: number; filter: Filter }) {
  const none = total === 0;
  return (
    <div
      style={{
        padding: "64px 16px",
        textAlign: "center",
        border: "1px dashed var(--line)",
        borderRadius: 2,
      }}
    >
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "0.14em",
          color: "var(--fg-4)",
          marginBottom: 8,
        }}
      >
        {none ? "NO POOLS ON DEVNET YET" : `NO ${filter.toUpperCase()} POOLS`}
      </div>
      <div style={{ color: "var(--fg-2)", fontSize: 14, marginBottom: 20 }}>
        {none
          ? "Be the first to create a circle on the deployed program."
          : "Try a different filter or create a new pool."}
      </div>
      <Link href="/create" className="btn primary">
        + Create a pool
      </Link>
    </div>
  );
}
