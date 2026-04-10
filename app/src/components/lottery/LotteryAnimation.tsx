"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronDown, ChevronUp, Trophy } from "lucide-react";
import { formatUSDC, truncateAddress } from "@/lib/utils";
import { ConfettiEffect } from "./ConfettiEffect";
import { VRFProofDisplay } from "./VRFProofDisplay";

// ── Types ────────────────────────────────────────────────────────────────────

interface LotteryAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  members: Array<{ wallet: string; isYou: boolean }>;
  winnerWallet: string;
  winnerAmount: number; // raw USDC (6 decimals)
  roundNumber: number;
  vrfResult?: string; // hex string of VRF bytes
}

// ── Animation phases ─────────────────────────────────────────────────────────

type Phase =
  | "backdrop"     // 0-0.3s
  | "wheel-in"     // 0.3-0.8s
  | "spinning"     // 0.8-3.8s
  | "highlight"    // 3.8-4.3s
  | "winner-card"  // 4.3-6s
  | "idle";        // after 6s, fully interactive

const AUTO_CLOSE_MS = 8000;

// ── Helpers ──────────────────────────────────────────────────────────────────

function walletToColor(wallet: string): string {
  const hash = wallet.slice(0, 6);
  const r = parseInt(hash.slice(0, 2), 16) || 100;
  const g = parseInt(hash.slice(2, 4), 16) || 100;
  const b = parseInt(hash.slice(4, 6), 16) || 100;
  // Vibrant, saturated colors for light theme
  const boost = (v: number) => Math.min(255, Math.floor(v * 0.5 + 120));
  return `rgb(${boost(r)}, ${boost(g)}, ${boost(b)})`;
}

function buildSegments(
  members: Array<{ wallet: string; isYou: boolean }>,
  cx: number,
  cy: number,
  radius: number
): Array<{
  path: string;
  color: string;
  labelX: number;
  labelY: number;
  labelAngle: number;
  wallet: string;
  isYou: boolean;
  startAngle: number;
  endAngle: number;
}> {
  const count = members.length;
  const sliceAngle = 360 / count;

  return members.map((m, i) => {
    const startAngle = i * sliceAngle - 90; // -90 so first segment starts at top
    const endAngle = startAngle + sliceAngle;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const path =
      count === 1
        ? `M ${cx - radius},${cy} A ${radius},${radius} 0 1,1 ${cx + radius},${cy} A ${radius},${radius} 0 1,1 ${cx - radius},${cy}`
        : `M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;

    // Label position: midpoint of the arc, offset inward
    const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
    const labelRadius = radius * 0.65;
    const labelX = cx + labelRadius * Math.cos(midAngle);
    const labelY = cy + labelRadius * Math.sin(midAngle);
    const labelAngle = (startAngle + endAngle) / 2;

    return {
      path,
      color: walletToColor(m.wallet),
      labelX,
      labelY,
      labelAngle,
      wallet: m.wallet,
      isYou: m.isYou,
      startAngle: startAngle + 90, // normalize back
      endAngle: endAngle + 90,
    };
  });
}

// ── Component ────────────────────────────────────────────────────────────────

export function LotteryAnimation({
  isOpen,
  onClose,
  members,
  winnerWallet,
  winnerAmount,
  roundNumber,
  vrfResult,
}: LotteryAnimationProps) {
  const [phase, setPhase] = useState<Phase>("backdrop");
  const [showVrfProof, setShowVrfProof] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // ── Derived data ─────────────────────────────────────────────────────────

  const winnerMember = useMemo(
    () => members.find((m) => m.wallet === winnerWallet),
    [members, winnerWallet]
  );
  const isYouWinner = winnerMember?.isYou ?? false;

  const winnerIndex = useMemo(
    () => members.findIndex((m) => m.wallet === winnerWallet),
    [members, winnerWallet]
  );

  // Calculate the angle the wheel must stop at so the winner segment
  // is aligned under the top pointer. The pointer is at 0 degrees (top).
  // Each segment spans (360 / members.length) degrees, and segments are
  // arranged starting from index 0 at the top (-90deg in SVG coords).
  const finalAngle = useMemo(() => {
    if (winnerIndex < 0) return 0;
    const segmentAngle = 360 / members.length;
    // Center of the winning segment relative to start
    const targetAngle = winnerIndex * segmentAngle + segmentAngle / 2;
    // We want this segment at the top (0/360), so rotate by -targetAngle
    // Add full rotations for spin drama (4 full spins = 1440)
    return 360 - targetAngle;
  }, [winnerIndex, members.length]);

  // SVG dimensions
  const svgSize = 350;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const radius = svgSize / 2 - 10;

  const segments = useMemo(
    () => buildSegments(members, cx, cy, radius),
    [members, cx, cy, radius]
  );

  // ── Phase sequencing ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) {
      setPhase("backdrop");
      setShowVrfProof(false);
      setConfettiActive(false);
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
      return;
    }

    // Phase timeline
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase("wheel-in"), 300));
    timers.push(setTimeout(() => setPhase("spinning"), 800));
    timers.push(
      setTimeout(() => {
        setPhase("highlight");
        setConfettiActive(true);
      }, 3800)
    );
    timers.push(setTimeout(() => setPhase("winner-card"), 4300));
    timers.push(setTimeout(() => setPhase("idle"), 6000));

    // Auto-close
    autoCloseRef.current = setTimeout(onClose, AUTO_CLOSE_MS);
    timers.push(autoCloseRef.current);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isOpen, onClose]);

  // ── Keyboard handler ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // ── Cancel auto-close on interaction ──────────────────────────────────────

  const cancelAutoClose = useCallback(() => {
    if (autoCloseRef.current) {
      clearTimeout(autoCloseRef.current);
      autoCloseRef.current = null;
    }
  }, []);

  // ── Render helpers ────────────────────────────────────────────────────────

  const phaseIndex = ["backdrop", "wheel-in", "spinning", "highlight", "winner-card", "idle"].indexOf(phase);
  const showWheel = phaseIndex >= 1;
  const isSpinning = phaseIndex >= 2;
  const showHighlight = phaseIndex >= 3;
  const showWinnerCard = phaseIndex >= 4;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#00345e]/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white/70 transition-colors hover:bg-white/30 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Round label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-4 text-sm font-semibold text-white/80"
          >
            Round {roundNumber} Drawing
          </motion.div>

          {/* ── Wheel ─────────────────────────────────────────────────── */}
          {showWheel && (
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Pointer triangle at top */}
              <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-2">
                <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                  <path d="M12 18L0 0H24L12 18Z" fill="#b8860b" />
                  <path d="M12 14L4 2H20L12 14Z" fill="#d4a843" />
                </svg>
              </div>

              {/* Confetti overlay */}
              <ConfettiEffect active={confettiActive} />

              {/* SVG Wheel */}
              <motion.svg
                width={svgSize}
                height={svgSize}
                viewBox={`0 0 ${svgSize} ${svgSize}`}
                className="h-[280px] w-[280px] sm:h-[350px] sm:w-[350px]"
                animate={
                  isSpinning
                    ? { rotate: [0, 1440 + finalAngle] }
                    : { rotate: 0 }
                }
                transition={
                  isSpinning
                    ? {
                        duration: 3,
                        ease: [0.15, 0.85, 0.35, 1],
                      }
                    : { duration: 0 }
                }
                style={{ originX: "50%", originY: "50%" }}
              >
                {/* Outer ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius + 4}
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  opacity={0.5}
                />

                {/* Segments */}
                {segments.map((seg, i) => {
                  const isWinner = seg.wallet === winnerWallet;
                  return (
                    <g key={i}>
                      <path
                        d={seg.path}
                        fill={seg.color}
                        stroke="white"
                        strokeWidth="2"
                        opacity={showHighlight && !isWinner ? 0.4 : 1}
                        className="transition-opacity duration-500"
                      />
                      {/* Winner glow */}
                      {showHighlight && isWinner && (
                        <path
                          d={seg.path}
                          fill="none"
                          stroke="#b8860b"
                          strokeWidth="3"
                          className="animate-pulse"
                          opacity={0.8}
                        />
                      )}
                      {/* Label */}
                      {members.length <= 12 && (
                        <text
                          x={seg.labelX}
                          y={seg.labelY}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="white"
                          fontSize={members.length > 8 ? "8" : "10"}
                          fontFamily="monospace"
                          opacity={0.9}
                        >
                          {seg.isYou
                            ? "YOU"
                            : truncateAddress(seg.wallet, 3)}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Center dot */}
                <circle cx={cx} cy={cy} r="14" fill="white" />
                <circle
                  cx={cx}
                  cy={cy}
                  r="10"
                  fill="#006c4a"
                />
              </motion.svg>

              {/* Winner glow ring behind wheel */}
              {showHighlight && (
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    boxShadow: isYouWinner
                      ? "0 0 60px 20px rgba(0, 108, 74, 0.3)"
                      : "0 0 60px 20px rgba(184, 134, 11, 0.25)",
                  }}
                />
              )}
            </motion.div>
          )}

          {/* ── Winner Card ───────────────────────────────────────────── */}
          <AnimatePresence>
            {showWinnerCard && (
              <motion.div
                className="mt-6 w-full max-w-sm px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onClick={cancelAutoClose}
              >
                <div
                  className={`relative overflow-hidden rounded-xl bg-white p-8 shadow-[0_8px_40px_rgba(0,52,94,0.15)] ${
                    isYouWinner
                      ? "ring-2 ring-[#006c4a]/30"
                      : ""
                  }`}
                >
                  {/* Accent line at top */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1 rounded-t-xl ${
                      isYouWinner
                        ? "bg-[#006c4a]"
                        : "bg-[#b8860b]"
                    }`}
                  />

                  <div className="flex flex-col items-center gap-3 text-center">
                    {/* Trophy icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        delay: 0.1,
                      }}
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        isYouWinner
                          ? "bg-primary/10 text-primary"
                          : "bg-[#b8860b]/10 text-[#b8860b]"
                      }`}
                    >
                      <Trophy className="h-6 w-6" />
                    </motion.div>

                    {/* Winner label */}
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`text-lg font-bold ${
                        isYouWinner ? "text-primary" : "text-[#b8860b]"
                      }`}
                    >
                      {isYouWinner ? "You Won!" : "Winner!"}
                    </motion.span>

                    {/* Winner address */}
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-sm ${
                        isYouWinner
                          ? "bg-primary/10 text-primary"
                          : "bg-[#eff4ff] text-[#00345e]"
                      }`}
                    >
                      {isYouWinner
                        ? "YOU"
                        : truncateAddress(winnerWallet)}
                    </span>

                    {/* Amount */}
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-3xl font-bold text-[#00345e]">
                        {formatUSDC(winnerAmount)}
                      </span>
                      <span className="text-xs text-[#526075]">
                        USDC Pool Payout
                      </span>
                    </div>

                    {/* Round badge */}
                    <span className="inline-flex items-center rounded-full bg-[#eff4ff] px-2.5 py-0.5 text-xs font-medium text-[#26619d]">
                      Round {roundNumber}
                    </span>
                  </div>

                  {/* VRF Proof toggle */}
                  {vrfResult && (
                    <div className="mt-5 pt-4">
                      <div className="-mt-4 mb-4 h-px bg-[#eff4ff]" />
                      <button
                        onClick={() => {
                          cancelAutoClose();
                          setShowVrfProof((v) => !v);
                        }}
                        className="flex w-full items-center justify-between text-xs text-[#526075] transition-colors hover:text-[#00345e]"
                      >
                        <span>View VRF Proof</span>
                        {showVrfProof ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <AnimatePresence>
                        {showVrfProof && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3">
                              <VRFProofDisplay
                                vrfResult={vrfResult}
                                roundNumber={roundNumber}
                                winnerIndex={winnerIndex >= 0 ? winnerIndex : 0}
                                totalEligible={members.length}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
