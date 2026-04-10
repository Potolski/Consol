"use client";

import { useEffect, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
  delay: number;
  shape: "circle" | "square";
}

const CONFETTI_COLORS = ["#006c4a", "#85f8c4", "#b8860b", "#26619d", "#d5e3fd"];
const PARTICLE_COUNT = 36;

// ── Component ────────────────────────────────────────────────────────────────

export function ConfettiEffect({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const generated: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 10,
      y: 50 + (Math.random() - 0.5) * 10,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 4 + Math.random() * 6,
      angle: (360 / PARTICLE_COUNT) * i + (Math.random() - 0.5) * 20,
      velocity: 120 + Math.random() * 160,
      delay: Math.random() * 0.15,
      shape: Math.random() > 0.5 ? "circle" : "square",
    }));

    setParticles(generated);

    const timer = setTimeout(() => setParticles([]), 1800);
    return () => clearTimeout(timer);
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => {
        const radians = (p.angle * Math.PI) / 180;
        const tx = Math.cos(radians) * p.velocity;
        const ty = Math.sin(radians) * p.velocity;

        return (
          <span
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
              transform: `translate(-50%, -50%) rotate(${p.angle}deg)`,
              animation: `confetti-burst 1.5s ${p.delay}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
              opacity: 0,
              ["--tx" as string]: `${tx}px`,
              ["--ty" as string]: `${ty}px`,
            }}
          />
        );
      })}

      {/* Inject keyframes via a standard style element */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes confetti-burst {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: translate(
                calc(-50% + var(--tx) * 0.3),
                calc(-50% + var(--ty) * 0.3)
              )
              scale(1)
              rotate(90deg);
          }
          100% {
            opacity: 0;
            transform: translate(
                calc(-50% + var(--tx)),
                calc(-50% + var(--ty) + 60px)
              )
              scale(0.6)
              rotate(360deg);
          }
        }
      ` }} />
    </div>
  );
}
