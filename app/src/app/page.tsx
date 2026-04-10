import Link from "next/link";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 pt-12 text-center sm:pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Live on Devnet
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Collective Purchasing Power,{" "}
          <span className="text-primary">On-Chain</span>
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          The Brazilian consorcio model — transparent pools, verifiable fair
          lottery, minimal fees. Powered by Solana and Switchboard VRF.
        </p>

        <div className="flex gap-3">
          <Button size="lg" className="gap-2" render={<Link href="/create" />}>
            Create Group
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" render={<Link href="#groups" />}>
            Explore Groups
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Groups", value: "—" },
          { label: "Active Members", value: "—" },
          { label: "USDC Volume", value: "—" },
          { label: "Rounds Completed", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/50 bg-card p-4 text-center"
          >
            <p className="text-2xl font-bold font-mono">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Groups placeholder */}
      <section id="groups" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Open Groups</h2>
        </div>
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border/50 py-16 text-center">
          <p className="text-muted-foreground">
            No groups found yet. Be the first to create one!
          </p>
          <Button variant="outline" size="sm" render={<Link href="/create" />}>
            Create Group
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="flex flex-col gap-8">
        <h2 className="text-center text-2xl font-bold">How It Works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Create & Join",
              description:
                "Create a group or join an existing one by depositing collateral and your first payment in USDC.",
            },
            {
              icon: Zap,
              title: "Pay & Select",
              description:
                "Members pay monthly. Each round, a winner is selected via VRF-powered verifiable lottery.",
            },
            {
              icon: Globe,
              title: "Receive & Repeat",
              description:
                "Winner receives the full pool. Repeat until every member has been selected.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
