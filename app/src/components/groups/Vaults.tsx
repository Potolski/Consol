import { PoolverMark } from "@/components/brand/PoolverLogo";
import { SectionHead } from "@/components/layout/SectionHead";

export function Vaults() {
  return (
    <section className="shell section">
      <SectionHead
        n="04"
        title="Protocol <em>Vaults</em>"
        meta="USDC liquidity pools"
      />
      <div className="stats">
        <div className="stat">
          <div className="lbl">
            <PoolverMark size={11} /> Pool Vault
          </div>
          <div className="v">$50,000</div>
          <div className="sub">Liquid · this round</div>
          <div className="mini-bar">
            <div className="fill" style={{ width: "100%" }} />
          </div>
        </div>
        <div className="stat">
          <div className="lbl">
            <PoolverMark size={11} /> Insurance Reserve
          </div>
          <div className="v">$15,000</div>
          <div className="sub">5% of monthly contributions</div>
          <div className="mini-bar">
            <div className="fill" style={{ width: "30%" }} />
          </div>
        </div>
        <div className="stat">
          <div className="lbl">
            <PoolverMark size={11} /> Total Collateral
          </div>
          <div className="v">$48,500</div>
          <div className="sub">Locked until completion</div>
          <div className="mini-bar">
            <div className="fill" style={{ width: "97%" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
