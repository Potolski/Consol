/**
 * Poolver Logomark — "The Verified Pool"
 *
 * 8 dots arranged in a circle. The node at ~1 o'clock is 1.5× larger
 * and rendered in accent green, representing the VRF-verified winner.
 * A small checkmark sits inside the winner node.
 */

interface PoolverLogoProps {
  size?: number;
  className?: string;
  /** Use "light" on dark backgrounds (mint dots), "dark" on light backgrounds (navy dots) */
  variant?: "light" | "dark";
}

export function PoolverLogo({ size = 36, className, variant = "dark" }: PoolverLogoProps) {
  const dotColor = variant === "light" ? "#e0ffec" : "#d5e3fd";
  const cx = 50;
  const cy = 50;
  const r = 34; // orbit radius
  const dotR = 6; // normal dot radius
  const winnerR = 9; // winner dot is 1.5×
  const winnerIndex = 1; // 1 o'clock position (index 1 out of 8, starting at 12 o'clock)

  const dots = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 360) / 8 - 90; // -90 so index 0 starts at 12 o'clock
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
      isWinner: i === winnerIndex,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Poolver logo"
    >
      {/* Regular member dots */}
      {dots.map((dot, i) =>
        dot.isWinner ? null : (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={dotR}
            fill={dotColor}
          />
        )
      )}

      {/* Winner node — larger, accent green */}
      {dots
        .filter((d) => d.isWinner)
        .map((dot, i) => (
          <g key={`winner-${i}`}>
            <circle cx={dot.x} cy={dot.y} r={winnerR} fill="#006c4a" />
            {/* Checkmark inside winner node */}
            <polyline
              points={`${dot.x - 3.5},${dot.y + 0.5} ${dot.x - 0.5},${dot.y + 3.5} ${dot.x + 4},${dot.y - 3}`}
              stroke="#e0ffec"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        ))}
    </svg>
  );
}

/**
 * Full lockup: logomark + "Poolver" wordmark, horizontal.
 */
export function PoolverWordmark({
  size = 36,
  className,
}: PoolverLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <PoolverLogo size={size} />
      <span
        className="font-headline font-bold tracking-tight text-[#006c4a]"
        style={{ fontSize: size * 0.5 }}
      >
        Poolver
      </span>
    </div>
  );
}
