import { SectionHead } from "@/components/layout/SectionHead";
import { MEMBERS, type Member } from "@/lib/mock-data";

function repTier(score: number) {
  if (score >= 850) return { tier: "S", color: "var(--acc)" };
  if (score >= 700) return { tier: "A", color: "var(--acc-2)" };
  if (score >= 500) return { tier: "B", color: "var(--fg-2)" };
  if (score >= 300) return { tier: "C", color: "var(--fg-3)" };
  return { tier: "D", color: "var(--err)" };
}

function WalletId({ m }: { m: Member }) {
  return (
    <div className="wallet-cell">
      <div className="avatar">{m.init}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span className="name">{m.addr}</span>
        {m.ens && <span className="handle">◆ {m.ens}</span>}
      </div>
    </div>
  );
}

function RepBar({ score }: { score: number }) {
  const tier = repTier(score);
  const pct = Math.min(100, (score / 1000) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
      <div
        style={{
          padding: "2px 7px",
          border: `1px solid ${tier.color}`,
          color: tier.color,
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "var(--display)",
          letterSpacing: "0.05em",
          borderRadius: 2,
          minWidth: 22,
          textAlign: "center",
        }}
      >
        {tier.tier}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11.5,
            color: "var(--fg)",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {score}
          <span style={{ color: "var(--fg-4)" }}> / 1000</span>
        </div>
        <div
          style={{
            height: 3,
            background: "var(--bg-3)",
            marginTop: 4,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: tier.color,
              boxShadow: `0 0 6px ${tier.color}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function Roster() {
  return (
    <section className="shell section">
      <SectionHead
        n="02"
        title="Circle <em>Roster</em>"
        meta="Members, reputation, status"
      />
      <div style={{ border: "1px solid var(--line)", borderRadius: 3, overflow: "auto" }}>
        <table className="roster">
          <thead>
            <tr>
              <th></th>
              <th>Wallet</th>
              <th className="num">Collateral</th>
              <th>Wallet Reputation</th>
              <th className="num">Circles · On-time</th>
              <th>Status</th>
              <th className="num">Received</th>
            </tr>
          </thead>
          <tbody>
            {MEMBERS.map((m) => (
              <tr key={m.i} className={m.isYou ? "you-row" : ""}>
                <td className="i-cell">{String(m.i).padStart(2, "0")}</td>
                <td>
                  <WalletId m={m} />
                </td>
                <td className="num">${m.collateral.toLocaleString()}</td>
                <td>
                  <RepBar score={m.rep} />
                </td>
                <td className="num">
                  <span style={{ color: "var(--fg)" }}>{m.circles}</span>
                  <span style={{ color: "var(--fg-4)" }}> · </span>
                  <span
                    style={{
                      color:
                        m.onTime >= 95
                          ? "var(--acc)"
                          : m.onTime >= 85
                            ? "var(--fg-2)"
                            : "var(--err)",
                    }}
                  >
                    {m.onTime}%
                  </span>
                </td>
                <td>
                  {m.isYou && <span className="badge you">You</span>}
                  {!m.isYou && m.status === "received" && (
                    <span className="badge received">Received</span>
                  )}
                  {!m.isYou && m.status === "eligible" && (
                    <span className="badge eligible">Eligible</span>
                  )}
                  {!m.isYou && m.status === "default" && (
                    <span className="badge default">Default</span>
                  )}
                </td>
                <td className="num">
                  {m.month ? `M${String(m.month).padStart(2, "0")}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          marginTop: 16,
          padding: "14px 16px",
          border: "1px dashed var(--line-2)",
          borderRadius: 3,
          background: "var(--bg-1)",
          fontSize: 11.5,
          color: "var(--fg-3)",
          fontFamily: "var(--mono)",
          lineHeight: 1.6,
        }}
      >
        <span style={{ color: "var(--acc)" }}>◆ WALLET REPUTATION</span> is
        computed on-chain from: circles completed · on-time payment rate · total
        volume contributed · tenure · peer vouch-stakes. Non-transferable.
      </div>
    </section>
  );
}
