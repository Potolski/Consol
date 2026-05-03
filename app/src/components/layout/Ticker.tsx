export function Ticker() {
  return (
    <div className="ticker">
      <div className="ticker-track">
        {[0, 1].map((k) => (
          <span key={k}>
            <span>PLVR-4A9F <span className="up">+$50,000</span></span><span className="sep">◆</span>
            <span>PLVR-B217 <span className="up">+$120,000</span></span><span className="sep">◆</span>
            <span>TVL <span className="up">$2.4M</span></span><span className="sep">◆</span>
            <span>USDC/USD <b>$0.9998</b></span><span className="sep">◆</span>
            <span>SOL <b>$214.82</b> <span className="up">+2.4%</span></span><span className="sep">◆</span>
            <span>POOLVERS ACTIVE <b>47</b></span><span className="sep">◆</span>
            <span>MEMBERS ONBOARD <b>814</b></span><span className="sep">◆</span>
            <span>INSURANCE <b>$89,214</b></span><span className="sep">◆</span>
            <span>FEE <b>1.50%</b></span><span className="sep">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
