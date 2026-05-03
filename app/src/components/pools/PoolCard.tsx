"use client";

import Link from "next/link";
import { PoolverMark } from "@/components/brand/PoolverLogo";
import { fmtUSD, type Pool } from "@/lib/mock-data";

function StatusChip({ s }: { s: Pool["status"] }) {
  const map = {
    active: { label: "● ACTIVE", color: "var(--acc)", bg: "var(--acc-tint)" },
    forming: { label: "◐ FORMING", color: "var(--warn)", bg: "oklch(0.3 0.1 75)" },
    closing: { label: "◉ CLOSING", color: "var(--fg-2)", bg: "var(--bg-3)" },
  } as const;
  const m = map[s];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--mono)",
        fontSize: 9.5,
        letterSpacing: "0.14em",
        padding: "3px 7px",
        border: `1px solid ${m.color}`,
        color: m.color,
        background: m.bg,
        borderRadius: 2,
      }}
    >
      {m.label}
    </span>
  );
}

interface PoolCardProps {
  p: Pool;
  featured?: boolean;
}

export function PoolCard({ p, featured }: PoolCardProps) {
  const isForming = p.status === "forming";
  const cap = p.memberCap ?? p.members;
  const fill = isForming ? p.members / cap : p.round / p.duration;
  const barColor = isForming ? "var(--warn)" : "var(--acc)";

  return (
    <Link href={`/group/${p.address ?? p.id}`} className={`pool-card ${featured ? "featured" : ""}`}>
      {featured && <div className="pool-featured-badge">YOUR POSITION</div>}
      <div className="pool-card-head">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PoolverMark size={18} />
          <div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 14,
                color: "var(--fg)",
                fontWeight: 500,
              }}
            >
              {p.id}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--fg-4)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {p.chain} · {p.asset}
            </div>
          </div>
        </div>
        <StatusChip s={p.status} />
      </div>

      <div className="pool-hero">
        <div>
          <div
            style={{
              fontSize: 9.5,
              color: "var(--fg-4)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Pool size
          </div>
          <div
            style={{
              fontFamily: "var(--display)",
              fontSize: 32,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--fg)",
              marginTop: 4,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fmtUSD(p.total)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 9.5,
              color: "var(--fg-4)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Monthly
          </div>
          <div
            style={{
              fontFamily: "var(--display)",
              fontSize: 18,
              color: "var(--acc)",
              marginTop: 4,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.01em",
            }}
          >
            ${p.monthly.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "var(--fg-3)",
            fontFamily: "var(--mono)",
            letterSpacing: "0.08em",
            marginBottom: 6,
          }}
        >
          <span>
            {isForming
              ? `FILLING ${p.members}/${cap}`
              : `ROUND ${String(p.round).padStart(2, "0")} / ${p.duration}`}
          </span>
          <span style={{ color: "var(--fg-4)" }}>{Math.round(fill * 100)}%</span>
        </div>
        <div
          style={{
            height: 3,
            background: "var(--bg-3)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${fill * 100}%`,
              background: barColor,
              boxShadow: `0 0 8px ${barColor}`,
            }}
          />
        </div>
      </div>

      <div className="pool-kv">
        <div className="pool-kv-row">
          <span>Next draw</span>
          <span
            className="v"
            style={{ color: p.status === "active" ? "var(--acc)" : "var(--fg-3)" }}
          >
            {p.nextDraw}
          </span>
        </div>
        <div className="pool-kv-row">
          <span>Collateral</span>
          <span className="v">{p.ratio}%</span>
        </div>
        <div className="pool-kv-row">
          <span>Poolver rep</span>
          <span className="v">{p.rep ? `${p.rep} / 1000` : "—"}</span>
        </div>
        <div className="pool-kv-row">
          <span>On-time rate</span>
          <span
            className="v"
            style={{
              color:
                p.onTime == null
                  ? "var(--fg-3)"
                  : p.onTime >= 95
                    ? "var(--acc)"
                    : p.onTime >= 85
                      ? "var(--fg)"
                      : "var(--err)",
            }}
          >
            {p.onTime != null ? `${p.onTime}%` : "—"}
          </span>
        </div>
      </div>

      <div className="pool-card-foot">
        <span
          style={{
            fontSize: 10,
            color: "var(--fg-4)",
            fontFamily: "var(--mono)",
            letterSpacing: "0.1em",
          }}
        >
          {isForming
            ? `OPENS @ ${cap}/${cap}`
            : `${p.duration - p.round} rounds remaining`}
        </span>
        <span
          style={{
            fontSize: 11,
            color: "var(--acc)",
            fontFamily: "var(--mono)",
            letterSpacing: "0.1em",
          }}
        >
          {featured ? "OPEN →" : isForming ? "JOIN →" : "VIEW →"}
        </span>
      </div>
    </Link>
  );
}
