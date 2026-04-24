import { PoolverMark } from "@/components/brand/PoolverLogo";
import { SectionHead } from "@/components/layout/SectionHead";
import { ROUNDS } from "@/lib/mock-data";

export function Timeline() {
  return (
    <section className="shell section">
      <SectionHead n="01" title="Round <em>Timeline</em>" meta="20 rounds · 20 recipients" />
      <div className="timeline">
        <div className="months">
          {ROUNDS.map((r) => {
            const cls = r.winner ? "done" : r.current ? "current" : "empty";
            return (
              <div key={r.m} className={`month ${cls}`}>
                <div className="m-n">M{String(r.m).padStart(2, "0")}</div>
                <div className="m-w">{r.winner ?? (r.current ? "pending" : "—")}</div>
                <div className="m-a">{r.amt ? `$${r.amt}` : ""}</div>
              </div>
            );
          })}
        </div>
        <div className="timeline-side">
          <h4>
            <PoolverMark size={11} /> Circle stats
          </h4>
          <div className="kv-list">
            <div className="kv-row"><span className="k">Rounds complete</span><span className="v">06 / 20</span></div>
            <div className="kv-row"><span className="k">Distributed</span><span className="v">$300,000</span></div>
            <div className="kv-row"><span className="k">Outstanding</span><span className="v">$700,000</span></div>
            <div className="kv-row"><span className="k">Avg. payment delay</span><span className="v">0.4d</span></div>
            <div className="kv-row"><span className="k">Default rate</span><span className="v">5.0%</span></div>
            <div className="kv-row"><span className="k">Circle reputation</span><span className="v acc">4.2 / 5</span></div>
          </div>
          <pre className="ascii" style={{ marginTop: 24 }}>
{`  ┌─ round 07 ──────────┐
  │  collecting    ▓▓▓░░ │
  │  selection     ░░░░░ │
  │  distribution  ░░░░░ │
  └──────────────────────┘`}
          </pre>
        </div>
      </div>
    </section>
  );
}
