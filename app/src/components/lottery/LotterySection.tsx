"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PoolverMark } from "@/components/brand/PoolverLogo";
import { SectionHead } from "@/components/layout/SectionHead";
import { BidPanel } from "./BidPanel";
import { MEMBERS } from "@/lib/mock-data";

type Stage = "idle" | "requesting" | "drawing" | "revealed";

interface LogLine {
  p: string;
  t: ReactNode;
}

export function LotterySection() {
  const [stage, setStage] = useState<Stage>("idle");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
  const [seed, setSeed] = useState("");
  const [logs, setLogs] = useState<LogLine[]>([
    { p: "$", t: <>poolver-cli round 07 --pool PLVR-4A9F</> },
    {
      p: ">",
      t: (
        <>
          <b>20</b> members loaded · <b>13</b> eligible · <b>6</b> received ·{" "}
          <b>1</b> default
        </>
      ),
    },
    {
      p: ">",
      t: (
        <>
          status:{" "}
          <span style={{ color: "var(--warn)" }}>awaiting VRF request</span>
        </>
      ),
    },
  ]);

  const spinRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const eligible = MEMBERS.filter((m) => m.status === "eligible");
  const eligibleIds = eligible.map((m) => m.i);

  const append = (line: LogLine) => setLogs((prev) => [...prev, line]);

  const request = () => {
    setStage("requesting");
    setActiveIdx(null);
    setWinnerIdx(null);
    append({ p: "$", t: <>switchboard.request_randomness()</> });
    append({ p: ">", t: <>commit hash published to slot 308,411,902</> });

    const chars = "0123456789abcdef";
    const tick = setInterval(() => {
      const h = Array.from(
        { length: 64 },
        () => chars[Math.floor(Math.random() * 16)]
      ).join("");
      setSeed(h);
    }, 50);

    setTimeout(() => {
      clearInterval(tick);
      append({ p: ">", t: <>oracle callback received · seed locked</> });
      append({
        p: ">",
        t: (
          <>
            cursor spinning through <b>{eligible.length}</b> eligible members…
          </>
        ),
      });
      setStage("drawing");
      let i = 0;
      spinRef.current = setInterval(() => {
        i++;
        setActiveIdx(eligibleIds[i % eligibleIds.length]);
      }, 90);
    }, 1400);
  };

  const reveal = () => {
    if (spinRef.current) clearInterval(spinRef.current);
    const preferred =
      eligible.find((m) => m.ens === "sofia.sol") ??
      eligible[Math.floor(Math.random() * eligible.length)];
    setActiveIdx(null);
    setWinnerIdx(preferred.i);
    setStage("revealed");
    append({
      p: ">",
      t: (
        <>
          selection resolved · winner index = <b>{preferred.i - 1}</b>
        </>
      ),
    });
    append({
      p: ">",
      t: (
        <>
          transferring{" "}
          <b style={{ color: "var(--acc)" }}>$49,250 USDC</b> to{" "}
          <span className="dim">{preferred.addr}</span>
        </>
      ),
    });
    append({
      p: ">",
      t: (
        <>
          tx confirmed · <span className="dim">5x7K…9FrA</span> · <b>412ms</b> ✓
        </>
      ),
    });
  };

  const reset = () => {
    if (spinRef.current) clearInterval(spinRef.current);
    setStage("idle");
    setActiveIdx(null);
    setWinnerIdx(null);
    setSeed("");
    setLogs([
      { p: "$", t: <>poolver-cli round 07 --pool PLVR-4A9F</> },
      { p: ">", t: <>cursor reset · awaiting operator</> },
    ]);
  };

  useEffect(
    () => () => {
      if (spinRef.current) clearInterval(spinRef.current);
    },
    []
  );

  const winner = winnerIdx != null ? MEMBERS.find((m) => m.i === winnerIdx) : null;

  return (
    <section className="shell section">
      <SectionHead
        n="03"
        title="VRF <em>Draw</em>"
        meta="Switchboard · commit-reveal"
      />
      <div className="vrf-grid">
        <div className="console">
          <div className="console-head">
            <span>◆ draw.ts</span>
            <span style={{ color: "var(--acc)" }}>● LIVE</span>
          </div>
          <div className="console-body">
            {logs.map((l, i) => (
              <div key={i} className="console-line">
                <span className="prompt">{l.p}</span>
                <span className="txt">{l.t}</span>
              </div>
            ))}

            <div className="member-grid">
              {MEMBERS.map((m) => {
                let cls = "";
                if (m.status === "received" || m.status === "default") cls = "done";
                else if (m.i === winnerIdx) cls = "winner";
                else if (m.i === activeIdx) cls = "active";
                return (
                  <div key={m.i} className={`m-slot ${cls}`} title={m.addr}>
                    {m.init}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--fg-3)",
                marginBottom: 6,
              }}
            >
              VRF_SEED · Ed25519
            </div>
            <div className="seed">{seed ? seed : "— awaiting commit-reveal —"}</div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 16,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {stage === "idle" && (
                <button className="btn primary" onClick={request}>
                  ↯ Request Randomness
                </button>
              )}
              {stage === "requesting" && (
                <button className="btn primary" disabled>
                  ↯ Drawing…
                </button>
              )}
              {stage === "drawing" && (
                <button className="btn primary" onClick={reveal}>
                  ✶ Reveal Winner
                </button>
              )}
              {stage === "revealed" && (
                <button className="btn ghost" onClick={reset}>
                  ↺ Reset
                </button>
              )}
              <button className="btn ghost sm" style={{ marginLeft: "auto" }}>
                Verify proof ↗
              </button>
            </div>
          </div>
        </div>

        <div className="outcome">
          <PoolverMark size={280} className="outcome-watermark" />
          <div className="outcome-label">SELECTED FOR ROUND 07</div>
          {winner ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    background: "var(--acc)",
                    color: "var(--acc-ink)",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--display)",
                    fontSize: 24,
                    fontWeight: 600,
                    boxShadow: "0 0 24px var(--acc)",
                  }}
                >
                  {winner.init}
                </div>
                <div>
                  <div className="outcome-name">{winner.addr}</div>
                  <div className="outcome-handle">
                    {winner.ens ? `◆ ${winner.ens} · ` : ""}wallet reputation{" "}
                    <b style={{ color: "var(--acc)" }}>{winner.rep}</b> / 1000
                  </div>
                </div>
              </div>
              <hr className="rule-dashed" />
              <div>
                <div className="outcome-label" style={{ marginBottom: 6 }}>
                  receives
                </div>
                <div className="outcome-amt">
                  $49,250
                  <span style={{ fontSize: "0.36em", color: "var(--fg-3)" }}>
                    .00
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>
                  $50,000 pool − $750 protocol fee
                </div>
              </div>
              <hr className="rule-dashed" />
              <div className="outcome-row">
                <span>Tranche 1 (now)</span>
                <span className="v">$24,625</span>
              </div>
              <div className="outcome-row">
                <span>Tranche 2 (+3mo)</span>
                <span className="v">$12,312</span>
              </div>
              <div className="outcome-row">
                <span>Tranche 3 (+6mo)</span>
                <span className="v">$12,313</span>
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: "var(--fg-3)",
                  marginTop: 4,
                  fontFamily: "var(--mono)",
                }}
              >
                50% immediate · 50% tranche release
              </div>
            </>
          ) : (
            <>
              <div className="outcome-name" style={{ color: "var(--fg-3)" }}>
                Awaiting draw
              </div>
              <div className="outcome-handle">
                Trigger randomness to select this round&apos;s recipient.
              </div>
              <div
                style={{
                  marginTop: 18,
                  padding: 18,
                  border: "1px dashed var(--line-2)",
                  borderRadius: 2,
                  fontSize: 12,
                  color: "var(--fg-3)",
                  lineHeight: 1.55,
                  fontFamily: "var(--mono)",
                }}
              >
                Switchboard VRF commits to a seed in the same block it is
                revealed. Front-running impossible; selection verifiable
                on-chain in perpetuity.
              </div>
              <pre className="ascii" style={{ marginTop: 16 }}>
{`   ┌─ VRF FLOW ────────────┐
   │  request  →  commit   │
   │  commit   →  reveal   │
   │  reveal   →  select   │
   │  select   →  settle   │
   └───────────────────────┘`}
              </pre>
            </>
          )}
        </div>
      </div>
      <BidPanel />
    </section>
  );
}
