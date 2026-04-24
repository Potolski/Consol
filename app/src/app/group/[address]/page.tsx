"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PoolverMark } from "@/components/brand/PoolverLogo";
import { Timeline } from "@/components/groups/Timeline";
import { Roster } from "@/components/groups/Roster";
import { Vaults } from "@/components/groups/Vaults";
import { How } from "@/components/groups/How";
import { LotterySection } from "@/components/lottery/LotterySection";
import { getPool, POOLS } from "@/lib/mock-data";

export default function GroupPage() {
  const { address } = useParams<{ address: string }>();
  const router = useRouter();
  const pool = getPool(address) ?? POOLS[0];
  const fill = (pool.round / pool.duration) * 100;

  return (
    <>
      <section className="hero">
        <div className="shell" style={{ paddingTop: 8 }}>
          <button
            className="btn ghost sm"
            onClick={() => router.push("/pools")}
            style={{ marginBottom: 14 }}
          >
            ← All pools
          </button>
        </div>
        <div className="shell hero-grid">
          <div>
            <div className="hero-kicker">
              <span className="sq" />
              LIVE · {pool.id} · ROUND {String(pool.round).padStart(2, "0")}/
              {pool.duration}
            </div>
            <h1 className="hero-headline" style={{ fontSize: "clamp(36px, 4.4vw, 60px)" }}>
              {pool.id}
              <br />
              <em>
                ${pool.monthly.toLocaleString()}/mo · {pool.members} members
              </em>
            </h1>
            <p className="hero-deck">
              Round {pool.round} of {pool.duration}. Pool size{" "}
              <b style={{ color: "var(--fg)" }}>
                ${pool.total.toLocaleString()}
              </b>{" "}
              this round. Next draw in{" "}
              <b style={{ color: "var(--acc)" }}>{pool.nextDraw}</b>.
              {pool.rep && (
                <>
                  {" "}
                  Circle reputation{" "}
                  <b style={{ color: "var(--acc)" }}>{pool.rep}/1000</b> ·
                  on-time{" "}
                  <b style={{ color: "var(--acc)" }}>{pool.onTime}%</b>.
                </>
              )}
            </p>
            <div
              style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}
            >
              <button className="btn primary lg">▶ Contribute this round</button>
              <button className="btn lg">◆ Place bid (Lance)</button>
            </div>
            <div className="hero-byline">
              <span>COLLATERAL {pool.ratio}%</span>
              <span>
                {pool.chain} · {pool.asset}
              </span>
              <span>FEE 1.50%</span>
            </div>
          </div>

          <div className="terminal">
            <div className="term-head">
              <span>
                <PoolverMark size={12} /> pool.vault / {pool.id}
              </span>
              <div className="term-dots">
                <div className="d" />
                <div className="d" />
                <div className="d" />
              </div>
            </div>
            <div className="term-body">
              <PoolverMark size={240} className="terminal-watermark" />
              <div className="metric-label">This round · pool</div>
              <div className="metric-value">
                ${pool.total.toLocaleString()}
                <span className="tick">_</span>
              </div>
              <div className="metric-bar">
                <div className="fill" style={{ width: `${fill}%` }} />
              </div>
              <div className="metric-sub">
                {pool.round} of {pool.duration} rounds settled
              </div>
              <div className="metric-kv">
                <span className="k">Monthly</span>
                <span className="v">${pool.monthly.toLocaleString()}</span>
                <span className="k">Members</span>
                <span className="v">{pool.members}</span>
                <span className="k">Collateral</span>
                <span className="v">{pool.ratio}%</span>
                <span className="k">Next draw</span>
                <span className="v acc">{pool.nextDraw}</span>
                <span className="k">Circle rep</span>
                <span className="v">
                  {pool.rep ?? "—"}
                  {pool.rep ? " / 1000" : ""}
                </span>
                <span className="k">On-time</span>
                <span className="v acc">
                  {pool.onTime ?? "—"}
                  {pool.onTime ? "%" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Timeline />
      <Roster />
      <LotterySection />
      <Vaults />
      <How />

      <section className="shell section">
        <div className="landing-cta">
          <PoolverMark size={40} className="cta-mark" />
          <h2>Need help?</h2>
          <p>Read the protocol documentation for the full mechanic.</p>
          <div style={{ marginTop: 16 }}>
            <Link href="/docs" className="btn lg">
              Open docs →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
