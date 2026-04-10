import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Users,
  DollarSign,
  BarChart3,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-8">
      {/* Hero */}
      <section className="relative flex flex-col items-center gap-8 pt-16 text-center sm:pt-24">
        {/* Background glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[120px]" />

        <div className="relative inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-sm font-medium text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Live on Devnet
        </div>

        <h1 className="relative max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Collective Purchasing
          <br />
          Power,{" "}
          <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
            On-Chain
          </span>
        </h1>

        <p className="max-w-lg text-base leading-relaxed text-white/50 sm:text-lg">
          The Brazilian consorcio model — transparent pools, verifiable
          fair lottery, minimal fees. Powered by Solana and Switchboard VRF.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
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
            className="border-white/10 bg-white/[0.03] px-6 text-white hover:bg-white/[0.06]"
            render={<Link href="#groups" />}
          >
            Explore Groups
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { icon: Users, label: "Total Groups", value: "—" },
          { icon: DollarSign, label: "Active Members", value: "—" },
          { icon: BarChart3, label: "USDC Volume", value: "—" },
          { icon: Trophy, label: "Rounds Complete", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]"
          >
            <stat.icon className="mb-3 h-5 w-5 text-white/20 transition-colors group-hover:text-primary/60" />
            <p className="text-2xl font-bold tabular-nums font-mono text-white">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-white/40">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Groups placeholder */}
      <section id="groups" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Open Groups
          </h2>
        </div>
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
            <Users className="h-6 w-6 text-white/20" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/60">
              No groups found yet
            </p>
            <p className="mt-1 text-xs text-white/30">
              Be the first to create a consorcio
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

      {/* How it works */}
      <section className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            How It Works
          </h2>
          <p className="mt-2 text-sm text-white/40">
            Three simple steps to join the collective
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {[
            {
              icon: Shield,
              step: "01",
              title: "Create & Join",
              description:
                "Create a group or join an existing one by depositing collateral and your first payment in USDC.",
              color: "from-primary/20 to-primary/5",
              iconColor: "text-primary",
            },
            {
              icon: Zap,
              step: "02",
              title: "Pay & Select",
              description:
                "Members pay monthly. Each round, a winner is selected via VRF-powered verifiable lottery.",
              color: "from-amber-500/20 to-amber-500/5",
              iconColor: "text-amber-500",
            },
            {
              icon: Globe,
              step: "03",
              title: "Receive & Repeat",
              description:
                "Winner receives the full pool. Repeat until every member has been selected.",
              color: "from-blue-500/20 to-blue-500/5",
              iconColor: "text-blue-500",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:border-white/[0.1]"
            >
              {/* Gradient bg */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${step.color} opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative">
                <span className="text-xs font-bold text-white/20">
                  {step.step}
                </span>
                <div
                  className={`mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] ${step.iconColor}`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
