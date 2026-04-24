"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppKit } from "@reown/appkit/react";
import { PoolverMark } from "@/components/brand/PoolverLogo";
import { usePoolverProgram } from "@/providers/PoolverProvider";
import { createGroupTx } from "@/lib/tx";

type Tranches = "100/0/0" | "50/25/25" | "40/30/30";
type Access = "open" | "invite";

interface PoolConfig {
  name: string;
  asset: "USDC" | "USDT" | "EURC";
  monthly: number;
  duration: number;
  memberCap: number;
  collateralPct: number;
  insurancePct: number;
  biddingOn: boolean;
  tranches: Tranches;
  access: Access;
  minRep: number;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="create-field">
      <label>{label}</label>
      {hint && <div className="create-hint">{hint}</div>}
      {children}
    </div>
  );
}

function Kv({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="review-kv-row">
      <span>{k}</span>
      <b style={{ color: accent ? "var(--acc)" : "var(--fg)" }}>{v}</b>
    </div>
  );
}

export default function CreatePage() {
  const router = useRouter();
  const { program, connected } = usePoolverProgram();
  const { open } = useAppKit();
  const [step, setStep] = useState(1);
  const [deploying, setDeploying] = useState(false);
  const [cfg, setCfg] = useState<PoolConfig>({
    name: "",
    asset: "USDC",
    monthly: 2500,
    duration: 20,
    memberCap: 20,
    collateralPct: 25,
    insurancePct: 5,
    biddingOn: true,
    tranches: "50/25/25",
    access: "open",
    minRep: 500,
  });

  const set = <K extends keyof PoolConfig>(k: K, v: PoolConfig[K]) =>
    setCfg((c) => ({ ...c, [k]: v }));

  const total = cfg.monthly * cfg.memberCap;
  const yourCollateral = Math.round(
    cfg.monthly * cfg.duration * (cfg.collateralPct / 100)
  );
  const protocolFee = total * 0.015;
  const insurancePerContribution = Math.round(
    cfg.monthly * (cfg.insurancePct / 100)
  );

  const tier =
    cfg.minRep >= 850
      ? "S only"
      : cfg.minRep >= 700
        ? "A+"
        : cfg.minRep >= 500
          ? "B+"
          : cfg.minRep >= 300
            ? "C+"
            : "Open to all";

  const trancheHint =
    cfg.tranches === "100/0/0"
      ? "Lump-sum release at draw. Lower enforcement."
      : cfg.tranches === "50/25/25"
        ? "Default. 50% at draw · 25% at +3mo · 25% at +6mo."
        : "Conservative. 40% at draw · 30% at +3mo · 30% at +6mo.";

  async function launch() {
    if (!connected || !program) {
      open();
      return;
    }
    if (cfg.asset !== "USDC") {
      toast.error("Only USDC is supported on devnet right now");
      return;
    }
    setDeploying(true);
    const toastId = toast.loading("Deploying pool…");
    try {
      const { groupAddress } = await createGroupTx(program, {
        monthlyContribution: cfg.monthly,
        totalMembers: cfg.memberCap,
        collateralBps: cfg.collateralPct * 100,
        insuranceBps: cfg.insurancePct * 100,
        description: (cfg.name || "Poolver pool").slice(0, 64),
      });
      toast.success("Pool deployed", {
        id: toastId,
        description: `${groupAddress.slice(0, 8)}…`,
      });
      router.push(`/group/${groupAddress}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error("Deploy failed", { id: toastId, description: msg.slice(0, 200) });
    } finally {
      setDeploying(false);
    }
  }

  return (
    <div
      className="shell"
      style={{ padding: "48px 0 80px", position: "relative", zIndex: 1 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 8,
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--fg-3)",
          letterSpacing: "0.1em",
        }}
      >
        <button className="btn ghost sm" onClick={() => router.push("/pools")}>
          ← Cancel
        </button>
        <span>CREATE / new-pool / step {step} of 4</span>
      </div>
      <h1
        className="hero-headline"
        style={{ fontSize: "clamp(36px, 4.4vw, 56px)", margin: "12px 0 8px" }}
      >
        Launch a <em>circle</em>.
      </h1>
      <p className="hero-deck" style={{ maxWidth: "62ch" }}>
        Configure the parameters. Deploy as a new PDA on Solana. Anyone with the
        link can join once it&apos;s live.
      </p>

      <div className="create-steps">
        {["Basics", "Risk", "Access", "Review"].map((lbl, i) => {
          const n = i + 1;
          const state = step === n ? "on" : step > n ? "done" : "";
          return (
            <div key={n} style={{ display: "contents" }}>
              <button
                className={`create-step ${state}`}
                onClick={() => step > n && setStep(n)}
                disabled={step <= n && step !== n}
              >
                <span className="n">{String(n).padStart(2, "0")}</span>
                <span className="l">{lbl}</span>
              </button>
              {n < 4 && <div className="create-step-sep">───</div>}
            </div>
          );
        })}
      </div>

      <div className="create-grid">
        <div className="create-body">
          {step === 1 && (
            <>
              <h3 className="create-h">Pool basics</h3>
              <div className="create-fields">
                <Field label="Pool name" hint="Displayed on the pool card. Can be empty.">
                  <input
                    className="create-input"
                    placeholder="e.g. Frontend devs Q2"
                    value={cfg.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </Field>
                <Field
                  label="Settlement asset"
                  hint="Which SPL token the pool contributions settle in."
                >
                  <div className="seg">
                    {(["USDC", "USDT", "EURC"] as const).map((a) => (
                      <button
                        key={a}
                        className={`seg-btn ${cfg.asset === a ? "on" : ""}`}
                        onClick={() => set("asset", a)}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field
                  label={`Monthly contribution — $${cfg.monthly.toLocaleString()}`}
                  hint="Each member pays this every round."
                >
                  <input
                    type="range"
                    min={100}
                    max={15000}
                    step={100}
                    value={cfg.monthly}
                    onChange={(e) => set("monthly", Number(e.target.value))}
                    className="create-slider"
                  />
                  <div className="seg" style={{ marginTop: 8 }}>
                    {[500, 1000, 2500, 5000, 10000].map((v) => (
                      <button
                        key={v}
                        className={`seg-btn ${cfg.monthly === v ? "on" : ""}`}
                        onClick={() => set("monthly", v)}
                      >
                        ${v}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field
                  label={`Members — ${cfg.memberCap}`}
                  hint="How many wallets must join before the pool opens."
                >
                  <input
                    type="range"
                    min={6}
                    max={30}
                    step={1}
                    value={cfg.memberCap}
                    onChange={(e) => set("memberCap", Number(e.target.value))}
                    className="create-slider"
                  />
                </Field>
                <Field
                  label={`Duration — ${cfg.duration} rounds`}
                  hint="Number of monthly rounds. Must equal members (one draw each)."
                >
                  <input
                    type="range"
                    min={6}
                    max={30}
                    step={1}
                    value={cfg.duration}
                    onChange={(e) => set("duration", Number(e.target.value))}
                    className="create-slider"
                  />
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="create-h">Risk &amp; collateral</h3>
              <div className="create-fields">
                <Field
                  label={`Collateral — ${cfg.collateralPct}%`}
                  hint="Locked at join. Higher = safer circle, more capital needed."
                >
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={cfg.collateralPct}
                    onChange={(e) =>
                      set("collateralPct", Number(e.target.value))
                    }
                    className="create-slider"
                  />
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "var(--fg-3)",
                      marginTop: 6,
                    }}
                  >
                    Each member locks{" "}
                    <b style={{ color: "var(--fg)" }}>
                      ${yourCollateral.toLocaleString()}
                    </b>{" "}
                    at T0.
                  </div>
                </Field>
                <Field
                  label={`Insurance allocation — ${cfg.insurancePct}%`}
                  hint="Carved from each contribution. Covers defaults first."
                >
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={cfg.insurancePct}
                    onChange={(e) =>
                      set("insurancePct", Number(e.target.value))
                    }
                    className="create-slider"
                  />
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "var(--fg-3)",
                      marginTop: 6,
                    }}
                  >
                    Per contribution:{" "}
                    <b style={{ color: "var(--fg)" }}>
                      ${insurancePerContribution}
                    </b>{" "}
                    → insurance PDA.
                  </div>
                </Field>
                <Field
                  label="Tranched release"
                  hint="How winnings unlock after a draw. Enforces post-win payment."
                >
                  <div className="seg">
                    {(["100/0/0", "50/25/25", "40/30/30"] as const).map((v) => (
                      <button
                        key={v}
                        className={`seg-btn ${cfg.tranches === v ? "on" : ""}`}
                        onClick={() => set("tranches", v)}
                      >
                        {v}%
                      </button>
                    ))}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "var(--fg-3)",
                      marginTop: 6,
                    }}
                  >
                    {trancheHint}
                  </div>
                </Field>
                <Field
                  label="Bidding (Lance) slot"
                  hint="Enables the optional auction track for priority."
                >
                  <div className="seg">
                    <button
                      className={`seg-btn ${cfg.biddingOn ? "on" : ""}`}
                      onClick={() => set("biddingOn", true)}
                    >
                      ON
                    </button>
                    <button
                      className={`seg-btn ${!cfg.biddingOn ? "on" : ""}`}
                      onClick={() => set("biddingOn", false)}
                    >
                      OFF
                    </button>
                  </div>
                </Field>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="create-h">Access</h3>
              <div className="create-fields">
                <Field
                  label="Who can join"
                  hint="Open: anyone meeting the rep threshold. Invite: a whitelist you define."
                >
                  <div className="seg">
                    <button
                      className={`seg-btn ${cfg.access === "open" ? "on" : ""}`}
                      onClick={() => set("access", "open")}
                    >
                      Open
                    </button>
                    <button
                      className={`seg-btn ${cfg.access === "invite" ? "on" : ""}`}
                      onClick={() => set("access", "invite")}
                    >
                      Invite-only
                    </button>
                  </div>
                </Field>
                <Field
                  label={`Minimum wallet reputation — ${cfg.minRep}`}
                  hint="Wallets below this cannot join. 0 = no gate."
                >
                  <input
                    type="range"
                    min={0}
                    max={900}
                    step={50}
                    value={cfg.minRep}
                    onChange={(e) => set("minRep", Number(e.target.value))}
                    className="create-slider"
                  />
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "var(--fg-3)",
                      marginTop: 6,
                    }}
                  >
                    Tier gate:{" "}
                    <b style={{ color: "var(--acc)" }}>{tier}</b>
                  </div>
                </Field>
                <Field
                  label="Additional controls"
                  hint="Reserved for future: peer-vouch requirements, KYC wrappers, jurisdiction filters."
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "var(--fg-4)",
                      padding: "10px 12px",
                      border: "1px dashed var(--line-2)",
                      borderRadius: 3,
                    }}
                  >
                    ◆ Post-v0.1 feature. Default: none.
                  </div>
                </Field>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h3 className="create-h">Review &amp; deploy</h3>
              <div
                style={{
                  padding: 20,
                  border: "1px solid var(--line)",
                  borderRadius: 3,
                  background: "var(--bg-1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <PoolverMark size={24} />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 13,
                        color: "var(--fg)",
                      }}
                    >
                      {cfg.name || "PLVR-XXXX"}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--fg-4)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginTop: 2,
                      }}
                    >
                      Solana · {cfg.asset}
                    </div>
                  </div>
                </div>
                <div className="review-kv">
                  <Kv k="Pool size / round" v={`$${total.toLocaleString()}`} />
                  <Kv
                    k="Total lifetime volume"
                    v={`$${(total * cfg.duration).toLocaleString()}`}
                  />
                  <Kv
                    k="Members × duration"
                    v={`${cfg.memberCap} × ${cfg.duration}`}
                  />
                  <Kv
                    k="Each member pays"
                    v={`$${cfg.monthly.toLocaleString()} × ${cfg.duration} = $${(cfg.monthly * cfg.duration).toLocaleString()}`}
                  />
                  <Kv
                    k="Each member receives"
                    v={`$${Math.round(total * 0.985).toLocaleString()} (pool − 1.5% fee)`}
                    accent
                  />
                  <Kv
                    k="Collateral (per member)"
                    v={`$${yourCollateral.toLocaleString()} locked at join`}
                  />
                  <Kv
                    k="Insurance carve"
                    v={`${cfg.insurancePct}% of contributions → insurance_pda`}
                  />
                  <Kv k="Tranched release" v={cfg.tranches} />
                  <Kv k="Bidding" v={cfg.biddingOn ? "Enabled" : "Disabled"} />
                  <Kv
                    k="Access"
                    v={
                      cfg.access === "open"
                        ? `Open · min rep ${cfg.minRep}`
                        : "Invite-only"
                    }
                  />
                </div>
              </div>

              <div className="docs-callout" style={{ marginTop: 20 }}>
                <div className="docs-callout-title">◆ Deploy sequence</div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--fg-2)",
                    lineHeight: 1.7,
                  }}
                >
                  1. Sign program instruction{" "}
                  <code className="docs-code">create_pool</code>
                  <br />
                  2. Seed pool_pda with your collateral + first contribution
                  <br />
                  3. Pool becomes visible in /pools with status{" "}
                  <span style={{ color: "var(--warn)" }}>FORMING</span>
                  <br />
                  4. First draw auto-triggers when {cfg.memberCap}/
                  {cfg.memberCap} join
                </div>
              </div>
            </>
          )}

          <div className="create-nav">
            {step > 1 && (
              <button className="btn lg" onClick={() => setStep(step - 1)}>
                ← Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < 4 && (
              <button
                className="btn primary lg"
                onClick={() => setStep(step + 1)}
              >
                Continue →
              </button>
            )}
            {step === 4 && (
              <button
                className="btn primary lg"
                onClick={launch}
                disabled={deploying}
              >
                {deploying
                  ? "Deploying…"
                  : connected
                    ? "▶ Deploy pool"
                    : "▶ Connect wallet to deploy"}
              </button>
            )}
          </div>
        </div>

        <aside className="create-summary">
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--fg-4)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <PoolverMark size={11} /> Live summary
          </div>
          <div className="summary-headline">${total.toLocaleString()}</div>
          <div className="summary-sub">
            per round · {cfg.memberCap} members
          </div>
          <hr className="rule-dashed" style={{ margin: "16px 0" }} />
          <div className="summary-kv">
            <div>
              <span>Monthly</span>
              <b>${cfg.monthly.toLocaleString()}</b>
            </div>
            <div>
              <span>Rounds</span>
              <b>{cfg.duration}</b>
            </div>
            <div>
              <span>Collateral</span>
              <b>{cfg.collateralPct}%</b>
            </div>
            <div>
              <span>Insurance</span>
              <b>{cfg.insurancePct}%</b>
            </div>
            <div>
              <span>Tranche</span>
              <b>{cfg.tranches}</b>
            </div>
            <div>
              <span>Bidding</span>
              <b>{cfg.biddingOn ? "ON" : "OFF"}</b>
            </div>
            <div>
              <span>Access</span>
              <b>
                {cfg.access === "open" ? `Rep ≥ ${cfg.minRep}` : "Invite"}
              </b>
            </div>
          </div>
          <hr className="rule-dashed" style={{ margin: "16px 0" }} />
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--fg-4)",
              letterSpacing: "0.14em",
              marginBottom: 6,
            }}
          >
            PROTOCOL FEE
          </div>
          <div
            style={{
              fontFamily: "var(--display)",
              fontSize: 20,
              color: "var(--acc)",
            }}
          >
            ${protocolFee.toLocaleString()}
          </div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10.5,
              color: "var(--fg-3)",
              marginTop: 4,
            }}
          >
            1.5% · deducted at each draw
          </div>
        </aside>
      </div>
    </div>
  );
}
