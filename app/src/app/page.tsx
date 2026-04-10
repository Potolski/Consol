import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  Users,
  Wallet,
  Sparkles,
  Trophy,
  X,
  Check,
  BarChart3,
  DollarSign,
  CircleDot,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-28 pb-16">
      {/* ── Hero Section ── */}
      <section className="relative flex flex-col items-center gap-8 pt-12 text-center sm:pt-20">
        {/* Background radial glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[140px]" />

        {/* Live on Devnet badge */}
        <div className="relative inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-sm font-medium text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Live on Devnet
        </div>

        {/* Headline */}
        <h1 className="relative max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
          Save Together.
          <br />
          Win{" "}
          <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
            Together.
          </span>
        </h1>

        {/* Subtext */}
        <p className="relative max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
          A cons&oacute;rcio is a savings circle: a group pools money monthly
          and each round one member receives the full pot. No banks. No
          interest. Just collective power.
        </p>

        {/* CTAs */}
        <div className="relative flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2 bg-primary px-6 font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40"
            render={<Link href="/create" />}
          >
            Create Group
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-white/10 bg-white/[0.03] px-6 text-white hover:bg-white/[0.06]"
            render={<Link href="#how-it-works" />}
          >
            See How It Works
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ── How A Consórcio Works ── */}
      <section id="how-it-works" className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            How a Cons&oacute;rcio Works
          </h2>
          <p className="mt-3 text-sm text-white/40 sm:text-base">
            Used by 10M+ Brazilians to buy cars, homes, and more
          </p>
        </div>

        {/* 4-step cards */}
        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          {/* Connecting line (desktop only) */}
          <div className="pointer-events-none absolute top-1/2 right-8 left-8 hidden h-px -translate-y-1/2 bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04] lg:block" />

          {[
            {
              step: "01",
              label: "POOL",
              description: "Members form a group of 5-50 people",
              icon: Users,
              gradient: "from-primary/20 to-primary/5",
              iconColor: "text-primary",
            },
            {
              step: "02",
              label: "PAY",
              description: "Everyone pays monthly into the shared pool",
              icon: Wallet,
              gradient: "from-amber-500/20 to-amber-500/5",
              iconColor: "text-amber-500",
            },
            {
              step: "03",
              label: "DRAW",
              description:
                "VRF picks a winner fairly — provably random, on-chain",
              icon: Sparkles,
              gradient: "from-blue-500/20 to-blue-500/5",
              iconColor: "text-blue-500",
            },
            {
              step: "04",
              label: "RECEIVE",
              description: "Winner gets the full pot to make their purchase",
              icon: Trophy,
              gradient: "from-purple-500/20 to-purple-500/5",
              iconColor: "text-purple-500",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="group relative z-10 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
            >
              {/* Hover gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${item.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white/20">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-white/30">
                    {item.label}
                  </span>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] ${item.iconColor}`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-sm leading-relaxed text-white/50">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-white/30">
          Repeat until everyone has received. Then collateral is returned.
        </p>
      </section>

      {/* ── Why On-Chain? ── */}
      <section className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Why On-Chain?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]">
          {/* Traditional side */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
            <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-white/30">
              Traditional Cons&oacute;rcio
            </h3>
            <div className="flex flex-col gap-4">
              {[
                "10-20% admin fees",
                "Opaque lottery",
                "Brazil only",
                "Weeks to set up",
                "Trust a company",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                    <X className="h-3.5 w-3.5 text-red-400" />
                  </div>
                  <span className="text-sm text-white/40">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* VS divider */}
          <div className="flex items-center justify-center px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-bold text-white/30">
              vs
            </div>
          </div>

          {/* Consol side */}
          <div className="rounded-2xl border border-primary/[0.15] bg-primary/[0.03] p-6 sm:p-8">
            <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-primary/60">
              Consol Protocol
            </h3>
            <div className="flex flex-col gap-4">
              {[
                "1.5% protocol fee",
                "VRF verifiable lottery",
                "Global — anyone with a wallet",
                "Minutes to set up",
                "Trust the code",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Example Calculator ── */}
      <section className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            See the Math
          </h2>
          <p className="mt-3 text-sm text-white/40 sm:text-base">
            A{" "}
            <span className="font-mono text-white/60">$500</span>/mo group of{" "}
            <span className="font-mono text-white/60">10</span> members
          </p>
        </div>

        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
          <div className="flex flex-col gap-5">
            {/* Row: You pay */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-white/50">You pay</span>
              <span className="text-right font-mono text-sm text-white/70">
                $500/mo &times; 10 months ={" "}
                <span className="font-semibold text-white">$5,000</span>
              </span>
            </div>

            <div className="h-px bg-white/[0.06]" />

            {/* Row: You receive */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-white/50">You receive</span>
              <span className="text-right font-mono text-sm">
                <span className="font-semibold text-primary">$5,000</span>{" "}
                <span className="text-white/30">in one lump sum</span>
              </span>
            </div>

            <div className="h-px bg-white/[0.06]" />

            {/* Row: Protocol fee */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-white/50">Protocol fee</span>
              <span className="text-right font-mono text-sm text-white/70">
                1.5% ={" "}
                <span className="font-semibold text-white">$75</span>
              </span>
            </div>

            <div className="h-px bg-white/[0.06]" />

            {/* Row: Collateral */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-white/50">Your collateral</span>
              <span className="text-right font-mono text-sm text-white/70">
                $1,000{" "}
                <span className="text-white/30">(returned at end)</span>
              </span>
            </div>

            <div className="h-px bg-white/[0.06]" />

            {/* Row: Net cost — highlighted */}
            <div className="flex items-center justify-between gap-4 rounded-xl bg-primary/[0.06] px-4 py-3">
              <span className="text-sm font-medium text-primary">
                Net cost
              </span>
              <span className="text-right font-mono text-sm">
                <span className="font-bold text-primary">$75 total</span>
                <span className="ml-2 text-white/30">
                  vs $500-1,000 in traditional fees
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Protocol Stats Bar ── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { icon: Users, label: "Total Groups", value: "\u2014" },
          { icon: Activity, label: "Active Members", value: "\u2014" },
          { icon: DollarSign, label: "USDC Volume", value: "\u2014" },
          { icon: CircleDot, label: "Rounds Complete", value: "\u2014" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]"
          >
            <stat.icon className="mb-3 h-5 w-5 text-white/20 transition-colors group-hover:text-primary/60" />
            <p className="font-mono text-2xl font-bold tabular-nums text-white">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-white/40">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* ── Open Groups Grid ── */}
      <section id="groups" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Open Groups
          </h2>
          <Link
            href="/create"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Create yours
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
            <Users className="h-6 w-6 text-white/20" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/60">
              No groups yet
            </p>
            <p className="mt-1 text-xs text-white/30">
              Be the first to create a cons&oacute;rcio
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
            render={<Link href="/create" />}
          >
            Create Group
          </Button>
        </div>
      </section>
    </div>
  );
}
