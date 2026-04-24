"use client";

import { useState } from "react";
import { BIDS } from "@/lib/mock-data";

export function BidPanel() {
  const [myBid, setMyBid] = useState(2500);
  const [placed, setPlaced] = useState(false);

  const bids = [
    ...BIDS,
    ...(placed
      ? [{ addr: "0x…user", ens: "user.sol", amt: myBid, rep: 412, you: true }]
      : []),
  ].sort((a, b) => b.amt - a.amt);

  return (
    <div className="bid-grid">
      <div className="card">
        <div className="kicker">LANCE · TRACK B</div>
        <h3>Auction for early disbursement</h3>
        <p>
          Bid USDC on top of your monthly contribution to secure the round&apos;s
          second disbursement. Highest bid wins; future obligations drop by the
          bid amount.
        </p>
        <div className="field">
          <label>Your bid · USDC</label>
          <input
            type="range"
            min={0}
            max={10000}
            step={100}
            value={myBid}
            onChange={(e) => setMyBid(Number(e.target.value))}
          />
          <div className="slider-vals">
            <span>$0</span>
            <span className="mid">${myBid.toLocaleString()}</span>
            <span>$10,000</span>
          </div>
        </div>
        <div
          style={{
            fontSize: 10.5,
            color: "var(--fg-4)",
            marginBottom: 12,
            fontFamily: "var(--mono)",
          }}
        >
          → future obligation -${myBid.toLocaleString()} · 13 rounds remaining
        </div>
        <button
          className="btn primary"
          disabled={placed}
          onClick={() => setPlaced(true)}
        >
          {placed ? "Bid recorded ✓" : "▶ Place bid"}
        </button>
      </div>
      <div className="card">
        <div className="kicker">Open auction · 3 bids</div>
        <h3 style={{ marginBottom: 14 }}>Leaderboard</h3>
        {bids.map((b, i) => (
          <div key={i} className={`bid-row ${i === 0 ? "win" : ""}`}>
            <div className="rank">#{String(i + 1).padStart(2, "0")}</div>
            <div>
              <div className="name">
                {b.addr}
                {b.you && (
                  <span className="badge you" style={{ marginLeft: 8 }}>
                    YOU
                  </span>
                )}
              </div>
              <div style={{ fontSize: 10.5, color: "var(--fg-4)" }}>
                {b.ens && <span>◆ {b.ens} · </span>}
                rep <span style={{ color: "var(--fg-2)" }}>{b.rep}</span>
              </div>
            </div>
            <div className="amt">${b.amt.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
