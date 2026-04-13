"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import GroupCard from "@/components/groups/GroupCard";
import { useGroups } from "@/hooks/useGroups";
import { MOCK_GROUPS } from "@/lib/mock-data";

export default function Home() {
  const { groups: onChainGroups, loading } = useGroups();

  // Use on-chain groups if available, otherwise show mock data
  const hasOnChain = onChainGroups.length > 0;
  const displayGroups = hasOnChain
    ? onChainGroups.filter((g) => g.status === "forming" || g.status === "active")
    : MOCK_GROUPS.filter((g) => g.status === "forming" || g.status === "active");

  return (
    <div className="flex flex-col gap-28 pb-16">
      {/* ── Hero Section ── */}
      <section className="relative flex flex-col items-center gap-8 pt-12 text-center sm:pt-20">
        {/* Live on Devnet badge */}
        <div className="relative inline-flex items-center gap-2 rounded-full bg-[#85f8c4]/20 px-4 py-1.5 text-sm font-medium text-[#006c4a]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#006c4a] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#006c4a]" />
          </span>
          Live on Devnet
        </div>

        {/* Headline */}
        <h1 className="font-headline relative max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-[#00345e] sm:text-5xl lg:text-7xl">
          Save Together.
          <br />
          Win{" "}
          <span className="text-[#006c4a]">
            Together.
          </span>
        </h1>

        {/* Subtext */}
        <p className="relative max-w-xl text-base leading-relaxed text-[#26619d] sm:text-lg">
          A cons&oacute;rcio is a savings circle: a group pools money monthly
          and each round one member receives the full pot. No banks. No
          interest. Just collective power.
        </p>

        {/* CTAs */}
        <div className="relative flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2 bg-[#006c4a] px-6 font-semibold text-[#e0ffec] shadow-lg shadow-[#006c4a]/10 hover:bg-[#005a3e] rounded-xl"
            render={<Link href="/pools" />}
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-0 bg-[#d5e3fd] px-6 text-[#455367] hover:bg-[#dce9ff] rounded-xl"
            render={<Link href="#how-it-works" />}
          >
            See How It Works
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ── How A Consorcio Works ── */}
      <section id="how-it-works" className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="font-headline text-2xl font-bold text-[#00345e] sm:text-3xl">
            How a Cons&oacute;rcio Works
          </h2>
          <p className="mt-3 text-sm text-[#526075] sm:text-base">
            Used by 10M+ Brazilians to buy cars, homes, and more
          </p>
        </div>

        {/* 4-step cards on tonal bg */}
        <div className="rounded-xl bg-[#eff4ff] p-6 sm:p-8">
          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
            {[
              {
                step: "01",
                label: "POOL",
                description: "Members form a group of 5-50 people",
                icon: Users,
                iconColor: "text-[#006c4a]",
                iconBg: "bg-[#006c4a]/10",
              },
              {
                step: "02",
                label: "PAY",
                description: "Everyone pays monthly into the shared pool",
                icon: Wallet,
                iconColor: "text-[#b8860b]",
                iconBg: "bg-[#b8860b]/10",
              },
              {
                step: "03",
                label: "DRAW",
                description:
                  "VRF picks a winner fairly — provably random, on-chain",
                icon: Sparkles,
                iconColor: "text-[#26619d]",
                iconBg: "bg-[#26619d]/10",
              },
              {
                step: "04",
                label: "RECEIVE",
                description: "Winner gets the full pot to make their purchase",
                icon: Trophy,
                iconColor: "text-[#526075]",
                iconBg: "bg-[#526075]/10",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative z-10 overflow-hidden rounded-xl bg-white p-6 transition-all hover:bg-[#eff4ff]"
              >
                <div className="relative flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#26619d]/40">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-bold tracking-widest text-[#526075]">
                      {item.label}
                    </span>
                  </div>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm leading-relaxed text-[#526075]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-[#526075]">
          Repeat until everyone has received. Then collateral is returned.
        </p>
      </section>

      {/* ── Why On-Chain? ── */}
      <section className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="font-headline text-2xl font-bold text-[#00345e] sm:text-3xl">
            Why On-Chain?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]">
          {/* Traditional side */}
          <div className="rounded-xl bg-[#eff4ff] p-6 sm:p-8">
            <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-[#526075]">
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
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#9f403d]/10">
                    <X className="h-3.5 w-3.5 text-[#9f403d]" />
                  </div>
                  <span className="text-sm text-[#526075]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* VS divider */}
          <div className="flex items-center justify-center px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d5e3fd] text-xs font-bold text-[#455367]">
              vs
            </div>
          </div>

          {/* Poolver side */}
          <div className="rounded-xl bg-[#006c4a]/5 p-6 sm:p-8">
            <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-[#006c4a]">
              Poolver Protocol
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
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#006c4a]/10">
                    <Check className="h-3.5 w-3.5 text-[#006c4a]" />
                  </div>
                  <span className="text-sm text-[#00345e]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Example Calculator ── */}
      <section className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="font-headline text-2xl font-bold text-[#00345e] sm:text-3xl">
            See the Math
          </h2>
          <p className="mt-3 text-sm text-[#526075] sm:text-base">
            A{" "}
            <span className="font-mono text-[#00345e]">$500</span>/mo group of{" "}
            <span className="font-mono text-[#00345e]">10</span> members
          </p>
        </div>

        <div className="mx-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow-sm shadow-[#00345e]/5 sm:p-8">
          <div className="flex flex-col gap-5">
            {/* Row: You pay */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[#526075]">You pay</span>
              <span className="text-right font-mono text-sm text-[#00345e]">
                $500/mo &times; 10 months ={" "}
                <span className="font-semibold text-[#00345e]">$5,000</span>
              </span>
            </div>

            <div className="h-px bg-[#eff4ff]" />

            {/* Row: You receive */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[#526075]">You receive</span>
              <span className="text-right font-mono text-sm">
                <span className="font-semibold text-[#006c4a]">$5,000</span>{" "}
                <span className="text-[#526075]">in one lump sum</span>
              </span>
            </div>

            <div className="h-px bg-[#eff4ff]" />

            {/* Row: Protocol fee */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[#526075]">Protocol fee</span>
              <span className="text-right font-mono text-sm text-[#00345e]">
                1.5% ={" "}
                <span className="font-semibold text-[#00345e]">$75</span>
              </span>
            </div>

            <div className="h-px bg-[#eff4ff]" />

            {/* Row: Collateral */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[#526075]">Your collateral</span>
              <span className="text-right font-mono text-sm text-[#00345e]">
                $1,000{" "}
                <span className="text-[#526075]">(returned at end)</span>
              </span>
            </div>

            <div className="h-px bg-[#eff4ff]" />

            {/* Row: Net cost — highlighted */}
            <div className="flex items-center justify-between gap-4 rounded-xl bg-[#006c4a]/5 px-4 py-3">
              <span className="text-sm font-medium text-[#006c4a]">
                Net cost
              </span>
              <span className="text-right font-mono text-sm">
                <span className="font-bold text-[#006c4a]">$75 total</span>
                <span className="ml-2 text-[#526075]">
                  vs $500-1,000 in traditional fees
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Open Groups Grid ── */}
      <section id="groups" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-xl font-bold text-[#00345e] sm:text-2xl">
            Open Pools
          </h2>
          <Link
            href="/create"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#006c4a] transition-colors hover:text-[#005a3e]"
          >
            Create yours
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-[#526075]">Loading pools...</div>
        ) : displayGroups.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#526075]">
            No open pools yet. Be the first to create one!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayGroups.map((group) => (
              <GroupCard
                key={group.address}
                address={group.address}
                description={group.description}
                creator={group.creator}
                monthlyContribution={group.monthlyContribution}
                totalMembers={group.totalMembers}
                currentMembers={group.currentMembers}
                status={group.status}
                collateralBps={group.collateralBps}
                insuranceBps={group.insuranceBps}
                currentRound={group.currentRound}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Final CTA ── */}
      <section className="rounded-xl bg-[#eff4ff] p-12 text-center">
        <h2 className="font-headline text-2xl font-bold text-[#00345e] sm:text-3xl">
          Ready to join a cons&oacute;rcio?
        </h2>
        <p className="mt-3 text-[#526075]">
          Browse open pools or create your own.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2 bg-[#006c4a] px-6 font-semibold text-[#e0ffec] shadow-lg shadow-[#006c4a]/10 hover:bg-[#005a3e] rounded-xl"
            render={<Link href="/pools" />}
          >
            Browse Pools
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-0 bg-[#d5e3fd] px-6 text-[#455367] hover:bg-[#dce9ff] rounded-xl"
            render={<Link href="/create" />}
          >
            Create a Pool
          </Button>
        </div>
      </section>
    </div>
  );
}
