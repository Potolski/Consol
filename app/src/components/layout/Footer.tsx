import { PoolverWordmark } from "@/components/brand/PoolverLogo";

const SECTIONS = {
  proto: ["Whitepaper", "GitHub", "Audit Report", "Program ID", "Status"],
  poolver: ["Browse Pools", "Create Pool", "Reputation", "Treasury", "Insurance"],
  social: ["@poolver", "Discord", "Telegram EN", "Telegram PT", "Dialect"],
};

export function Footer() {
  return (
    <footer className="shell footer">
      <div className="footer-grid">
        <div>
          <PoolverWordmark size={16} />
          <p className="footer-about">
            Poolver is a decentralized rotating savings protocol on Solana.
            Bringing the $500B ROSCA market on-chain — no administrator, no
            geography, no permission.
          </p>
          <pre className="ascii footer-ascii">
{`PROGRAM_ID
5x7Kq9FrA2pM8vLk3Rn2XyQ…
IDL v0.1.0 · devnet
`}
          </pre>
        </div>
        <div>
          <h4>Protocol</h4>
          <ul>
            {SECTIONS.proto.map((x) => (
              <li key={x}>
                <a href="#">{x} ↗</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Poolver</h4>
          <ul>
            {SECTIONS.poolver.map((x) => (
              <li key={x}>
                <a href="#">{x}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Social</h4>
          <ul>
            {SECTIONS.social.map((x) => (
              <li key={x}>
                <a href="#">{x}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bot">
        <span>◆ Built on Solana · Switchboard VRF · SPL USDC</span>
        <span>Not an offer of securities · DYOR · © 2026</span>
      </div>
    </footer>
  );
}
