"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAppKit } from "@reown/appkit/react";
import { usePoolverProgram } from "@/providers/PoolverProvider";
import { GroupStatus, MemberStatus } from "@/lib/types";
import type { GroupView, MemberView } from "@/lib/program";
import { joinGroupTx, leaveGroupTx, makePaymentTx } from "@/lib/tx";

interface Props {
  group: GroupView;
  members: MemberView[];
  onRefresh: () => Promise<void>;
}

export function GroupActions({ group, members, onRefresh }: Props) {
  const { program, connected, address } = usePoolverProgram();
  const { open } = useAppKit();
  const [busy, setBusy] = useState<"join" | "pay" | "leave" | null>(null);

  const me = useMemo(
    () => (address ? members.find((m) => m.wallet === address) : undefined),
    [address, members],
  );

  const isForming = group.status === GroupStatus.Forming;
  const isActive = group.status === GroupStatus.Active;
  const isFull = group.currentMembers >= group.totalMembers;
  const activeMember = me?.status === MemberStatus.Active;
  const hasPaidThisRound = me ? me.lastPaidRound >= group.currentRound : false;

  const run = async (
    kind: "join" | "pay" | "leave",
    label: string,
    fn: () => Promise<string>,
  ) => {
    if (!program) {
      toast.error("Wallet not ready");
      return;
    }
    setBusy(kind);
    const toastId = toast.loading(`${label}…`);
    try {
      const sig = await fn();
      toast.success(`${label} confirmed`, {
        id: toastId,
        description: `sig: ${sig.slice(0, 12)}…`,
      });
      await onRefresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(`${label} failed`, { id: toastId, description: msg.slice(0, 180) });
    } finally {
      setBusy(null);
    }
  };

  if (!connected) {
    return (
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <button className="btn primary lg" onClick={() => open()}>
          ▶ Connect wallet to join
        </button>
      </div>
    );
  }

  if (isForming) {
    if (me && activeMember) {
      return (
        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <button className="btn lg" disabled>
            ✓ Collateral locked
          </button>
          <button
            className="btn ghost lg"
            disabled={busy !== null}
            onClick={() =>
              run("leave", "Leaving pool", () =>
                leaveGroupTx(program!, group.address),
              )
            }
          >
            {busy === "leave" ? "Leaving…" : "Withdraw collateral"}
          </button>
        </div>
      );
    }
    return (
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          className="btn primary lg"
          disabled={isFull || busy !== null}
          onClick={() =>
            run("join", "Depositing collateral", () =>
              joinGroupTx(program!, group.address),
            )
          }
        >
          {isFull
            ? "Pool full"
            : busy === "join"
              ? "Signing…"
              : `▶ Join pool · lock ${(group.collateralBps / 100).toFixed(0)}% collateral`}
        </button>
      </div>
    );
  }

  if (isActive) {
    if (!activeMember) {
      return (
        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <button className="btn lg" disabled>
            Pool closed to new members
          </button>
        </div>
      );
    }
    return (
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          className="btn primary lg"
          disabled={hasPaidThisRound || busy !== null}
          onClick={() =>
            run("pay", "Sending contribution", () =>
              makePaymentTx(program!, group.address, group.currentRound),
            )
          }
        >
          {hasPaidThisRound
            ? "✓ Paid this round"
            : busy === "pay"
              ? "Signing…"
              : "▶ Contribute this round"}
        </button>
        <button className="btn lg" disabled title="Bidding (Lance) — coming soon">
          ◆ Place bid (Lance)
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
      <button className="btn lg" disabled>
        Pool {group.status}
      </button>
    </div>
  );
}
