import { SectionHead } from "@/components/layout/SectionHead";

const STEPS = [
  { t: "Join", d: "Deposit 25% collateral + first month in USDC. Slot activates on-chain." },
  { t: "Pay", d: "Seven-day window each month. Dialect sends reminders." },
  { t: "Win", d: "VRF draws; funds settle in 400ms. Tranche release reduces run-risk." },
  { t: "Exit", d: "On completion, collateral returns. Reputation compounds." },
];

export function How() {
  return (
    <section className="shell section">
      <SectionHead n="05" title="How it <em>Works</em>" meta="Four-step lifecycle" />
      <div className="how">
        {STEPS.map((s, i) => (
          <div key={i} className="how-step">
            <div className="n">0{i + 1}</div>
            <div className="t">{s.t}</div>
            <div className="d">{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
