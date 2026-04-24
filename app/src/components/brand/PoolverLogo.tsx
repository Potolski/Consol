interface PoolverMarkProps {
  size?: number;
  className?: string;
}

export function PoolverMark({ size = 24, className }: PoolverMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="16" r="8.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <circle cx="20" cy="16" r="8.5" stroke="var(--acc)" strokeWidth="1.6" fill="none" />
      <circle cx="16" cy="16" r="1.8" fill="var(--acc)" />
    </svg>
  );
}

export function PoolverWordmark({ size = 18, className }: PoolverMarkProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        color: "var(--fg)",
      }}
    >
      <PoolverMark size={size + 6} />
      <b
        style={{
          fontFamily: "var(--display)",
          fontSize: size,
          letterSpacing: "-0.025em",
          fontWeight: 600,
        }}
      >
        Poolver
      </b>
    </span>
  );
}
