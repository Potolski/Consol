"use client";

import Link from "next/link";
import { PoolverMark } from "@/components/brand/PoolverLogo";
import { Ticker } from "@/components/layout/Ticker";
import { SectionHead } from "@/components/layout/SectionHead";
import { PoolCard } from "@/components/pools/PoolCard";
import { useGroups } from "@/hooks/useGroups";

export default function Home() {
  const { pools, loading } = useGroups();
  const featured = pools.slice(0, 3);

  return (
    <>
      <Ticker />

      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <div className="hero-kicker">
              <span className="sq" />
              POOLVER PROTOCOL · v0.1.0-devnet
            </div>
            <h1 className="hero-headline">
              Pool <em>savings</em>,<br />
              not risk.
            </h1>
            <p className="hero-deck">
              An on-chain rotating savings protocol. N wallets pool monthly USDC; a verifiable draw each round selects who receives. No administrator, no custodian, no permission — just a Solana program running 24/7.
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 24,
                flexWrap: "wrap",
              }}
            >
              <Link href="/pools" className="btn primary lg">
                ▶ Browse pools
              </Link>
              <Link href="/create" className="btn lg">
                + Create a pool
              </Link>
              <Link href="/docs" className="btn ghost lg">
                Read the docs →
              </Link>
            </div>
            <div className="hero-byline">
              <span>PROGRAM 5x7K…9FrA</span>
              <span>v0.1.0-devnet</span>
              <span>AUDIT PENDING</span>
            </div>
          </div>

          <div className="terminal">
            <div className="term-head">
              <span>
                <PoolverMark size={12} /> protocol.summary
              </span>
              <div className="term-dots">
                <div className="d" />
                <div className="d" />
                <div className="d" />
              </div>
            </div>
            <div className="term-body">
              <PoolverMark size={240} className="terminal-watermark" />
              <div className="metric-label">Total value locked</div>
              <div className="metric-value">
                $22.9M<span className="tick">_</span>
              </div>
              <div className="metric-bar">
                <div className="fill" />
              </div>
              <div className="metric-sub">
                Across 12 active pools · 184 members
              </div>
              <div className="metric-kv">
                <span className="k">Protocol fee</span>
                <span className="v">1.50%</span>
                <span className="k">Insurance reserve</span>
                <span className="v">$89,214</span>
                <span className="k">Avg. on-time rate</span>
                <span className="v acc">95.4%</span>
                <span className="k">Defaults to date</span>
                <span className="v">0</span>
                <span className="k">Network</span>
                <span className="v">Solana · 400ms</span>
                <span className="k">Settlement asset</span>
                <span className="v">SPL · USDC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell section">
        <SectionHead n="01" title="Why <em>Poolver</em>" meta="THE THESIS" />
        <div className="landing-cards">
          <div className="landing-card">
            <div className="lc-icon">
              <PoolverMark size={28} />
            </div>
            <h3>Rotation, not interest</h3>
            <p>
              ROSCAs have funded families for 500+ years. You pay a fixed amount
              monthly; one round you receive the whole pool. Over N rounds
              everyone gets exactly what they put in — earlier liquidity for
              whoever needs it.
            </p>
          </div>
          <div className="landing-card">
            <div className="lc-icon">◈</div>
            <h3>Trustless by construction</h3>
            <p>
              Traditional circles break when the administrator vanishes with the
              money. Poolver has no administrator. Every contribution, draw, and
              release is a public transaction against an open Solana program.
            </p>
          </div>
          <div className="landing-card">
            <div className="lc-icon">◆</div>
            <h3>Collateral + reputation</h3>
            <p>
              25% locked collateral + tranched release + insurance reserve +
              on-chain reputation scoring. Four layers of enforcement mean
              defaulting costs more than walking away.
            </p>
          </div>
        </div>
      </section>

      <section className="shell section">
        <SectionHead n="02" title="Three moves" meta="MECHANIC" />
        <div className="landing-how">
          <div className="lh-step">
            <div className="lh-n">01</div>
            <div className="lh-k">JOIN</div>
            <div className="lh-t">
              Deposit 25% collateral + first month&apos;s contribution. Your
              slot activates when the pool fills.
            </div>
          </div>
          <div className="lh-step">
            <div className="lh-n">02</div>
            <div className="lh-k">CONTRIBUTE</div>
            <div className="lh-t">
              Pay your monthly USDC within a 7-day window. Optionally bid for
              priority in the auction slot.
            </div>
          </div>
          <div className="lh-step">
            <div className="lh-n">03</div>
            <div className="lh-k">DRAW &amp; RECEIVE</div>
            <div className="lh-t">
              Switchboard VRF selects a recipient. Payout releases in three
              tranches as you keep paying.
            </div>
          </div>
        </div>
      </section>

      <section className="shell section">
        <SectionHead n="03" title="Protocol at a glance" meta="LIVE DATA" />
        <div className="stats">
          <div className="stat">
            <div className="lbl">
              <PoolverMark size={11} /> Active pools
            </div>
            <div className="v">12</div>
            <div className="sub">5 forming · 5 active · 2 closing</div>
            <div className="mini-bar">
              <div className="fill" style={{ width: "85%" }} />
            </div>
          </div>
          <div className="stat">
            <div className="lbl">
              <PoolverMark size={11} /> Total locked
            </div>
            <div className="v">$22.9M</div>
            <div className="sub">USDC · across circles</div>
            <div className="mini-bar">
              <div className="fill" style={{ width: "70%" }} />
            </div>
          </div>
          <div className="stat">
            <div className="lbl">
              <PoolverMark size={11} /> Insurance reserve
            </div>
            <div className="v">$89K</div>
            <div className="sub">5% of all contributions accrues</div>
            <div className="mini-bar">
              <div className="fill" style={{ width: "45%" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="shell section">
        <SectionHead
          n="04"
          title="Circles <em>now forming</em>"
          meta="FEATURED"
        />
        {loading ? (
          <div
            style={{
              padding: "48px 16px",
              textAlign: "center",
              color: "var(--fg-3)",
              fontFamily: "var(--mono)",
              fontSize: 12,
              letterSpacing: "0.1em",
              border: "1px dashed var(--line)",
              borderRadius: 2,
            }}
          >
            Loading pools from devnet…
          </div>
        ) : featured.length === 0 ? (
          <div
            style={{
              padding: "48px 16px",
              textAlign: "center",
              border: "1px dashed var(--line)",
              borderRadius: 2,
            }}
          >
            <div style={{ color: "var(--fg-2)", fontSize: 14, marginBottom: 16 }}>
              No pools on devnet yet. Be the first.
            </div>
            <Link href="/create" className="btn primary">
              + Create a pool
            </Link>
          </div>
        ) : (
          <>
            <div className="pools-grid">
              {featured.map((p) => (
                <PoolCard key={p.address ?? p.id} p={p} featured={p.featured} />
              ))}
            </div>
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <Link href="/pools" className="btn lg">
                All pools ({pools.length}) →
              </Link>
            </div>
          </>
        )}
      </section>

      <section className="shell section">
        <div className="landing-cta">
          <PoolverMark size={56} className="cta-mark" />
          <h2>Ready to join a circle?</h2>
          <p>
            Browse 12 active pools, or configure your own in under 5 minutes.
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 20,
            }}
          >
            <Link href="/pools" className="btn primary lg">
              ▶ Browse pools
            </Link>
            <Link href="/create" className="btn lg">
              + Create a pool
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
