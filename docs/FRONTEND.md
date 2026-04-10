# Consol Frontend — Architecture & Style Guide

## Overview

The Consol frontend is a Next.js 16 application providing the user interface for the decentralized consórcio protocol. It enables users to create savings groups, join existing ones, make payments, and participate in VRF-powered lottery selections — all through a premium light-themed fintech interface following the "Architectural Ledger" design system.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| UI Library | React | 19.x |
| Components | shadcn/ui (base-nova) | latest |
| Styling | Tailwind CSS | 4.x |
| Wallet | Reown AppKit | 1.8.x |
| Blockchain | @solana/web3.js + @coral-xyz/anchor | 1.x / 0.30.x |
| VRF | @switchboard-xyz/on-demand | 0.11.x |
| Animations | framer-motion | 12.x |
| State | zustand | 5.x |
| Toasts | sonner | 1.x |
| Icons | lucide-react | latest |
| Fonts | Manrope + Inter + JetBrains Mono | via next/font |

### Why These Choices

- **Reown AppKit** over `@solana/wallet-adapter`: Better UX with social login (Google, GitHub, Discord), built-in modal, cleaner API. Custom `WalletButton` component for connect/disconnect UI matching our design.
- **shadcn/ui (base-nova)**: Uses `@base-ui/react` primitives instead of Radix. Key difference: uses `render` prop for polymorphism, NOT `asChild`.
- **Switchboard VRF**: Dynamic import via `Function` constructor to bypass Turbopack static analysis. Graceful fallback when SDK unavailable.
- **zustand**: Lightweight state management — simpler than Redux for hackathon speed.

---

## Design System: "The Architectural Ledger"

### Philosophy
Premium fintech aesthetic. Not "bank-in-a-box" — spacious, editorial, trust through precision and white space. Asymmetric layouts, aggressive margins, tonal depth.

### Color Palette (Light Mode)

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#f8f9ff` | Page background |
| Card | `#ffffff` | Elevated cards (surface-container-lowest) |
| Section | `#eff4ff` | Section backgrounds (surface-container-low) |
| Nested | `#e5eeff` | Nested elements (surface-container) |
| Hover | `#dce9ff` | Hover states (surface-container-high) |
| Active | `#d2e4ff` | Active/selected (surface-container-highest) |
| Text Primary | `#00345e` | Main text (on-surface) — NOT pure black |
| Text Secondary | `#26619d` | Secondary text (on-surface-variant) |
| Text Muted | `#526075` | Muted/subtle text (secondary) |
| Primary | `#006c4a` | CTAs, success, emerald |
| Primary Hover | `#005a3e` | Primary hover state |
| On Primary | `#e0ffec` | Text on primary buttons |
| Primary Container | `#85f8c4` | Light green backgrounds |
| Secondary Container | `#d5e3fd` | Secondary button bg |
| On Secondary | `#455367` | Text on secondary |
| Error | `#9f403d` | Error/destructive states |
| Warning | `#b8860b` | Warning, gold accents |

### Critical Design Rules

1. **No 1px borders** — Boundaries defined ONLY by background color shifts
2. **No pure black** — Always use `#00345e` (on-surface)
3. **No gradients** — Depth via tonal layering and glassmorphism only
4. **12px radius** — `rounded-xl` on all components
5. **32px+ padding** — Cards use `p-8`, aggressive margins for premium feel
6. **Glassmorphism** — Only on nav: `bg-white/80 backdrop-blur-md`
7. **Ambient shadows** — `shadow-[0_4px_24px_rgba(0,52,94,0.06)]`
8. **Typography**: Manrope (headlines, `font-headline`), Inter (body), JetBrains Mono (amounts/addresses)

---

## Directory Structure

```
app/src/
├── app/                              # Next.js App Router pages
│   ├── layout.tsx                    # Root layout (providers, fonts, metadata)
│   ├── page.tsx                      # Landing (educational)
│   ├── globals.css                   # Tailwind + CSS custom properties
│   ├── pools/page.tsx                # Browse pools (filtered grid)
│   ├── create/page.tsx               # Create group (2-col form)
│   ├── group/[address]/page.tsx      # Group detail (2-col + sidebar)
│   ├── dashboard/page.tsx            # Portfolio dashboard (sidebar layout)
│   ├── profile/[address]/page.tsx    # Reputation & stats
│   ├── activity/page.tsx             # Activity feed
│   └── treasury/page.tsx             # Treasury placeholder
├── components/
│   ├── ui/                           # shadcn/ui primitives
│   ├── layout/                       # Navbar, Footer, AppShell
│   ├── groups/                       # GroupCard
│   ├── wallet/                       # WalletButton, WalletRedirect
│   └── lottery/                      # LotteryAnimation, ConfettiEffect, VRFProofDisplay
├── hooks/
│   ├── useConsol.ts                  # 10 instruction wrappers (incl. VRF)
│   ├── useGroup.ts                   # Fetch single group
│   ├── useGroups.ts                  # Fetch all/filtered groups
│   ├── useRound.ts                   # Fetch round
│   ├── useMember.ts                  # Fetch member
│   ├── useCountdown.ts              # Timer with phases
│   └── useTransactionToast.ts       # Toast helpers
├── lib/
│   ├── constants.ts                  # On-chain protocol constants
│   ├── pdas.ts                       # 6 PDA derivation helpers
│   ├── types.ts                      # TypeScript enums + interfaces
│   ├── utils.ts                      # formatUSDC, truncateAddress, etc.
│   ├── store.ts                      # Zustand store
│   ├── mock-data.ts                  # Demo data (fallback)
│   ├── switchboard.ts                # Switchboard VRF helpers
│   └── idl/consol.json              # Anchor IDL (generated)
├── providers/
│   ├── SolanaProvider.tsx            # Reown AppKit setup
│   └── ConsolProvider.tsx            # Anchor Program context
├── config/
│   └── index.ts                      # AppKit config
└── types/
    └── appkit.d.ts                   # JSX type declarations
```

---

## Pages

### Landing (`/`)
Educational page for first-time visitors. Pure content — no pool data.
- Hero: "Save Together. Win Together."
- How a Consórcio Works (4-step flow)
- Why On-Chain? (comparison table)
- See the Math (example calculator)
- Final CTA: Browse Pools / Create a Pool

### Pools (`/pools`)
Browse and filter all groups. Uses `useGroups()` with mock fallback.
- Filter tabs: All / Forming / Active / Completed (with counts)
- Responsive GroupCard grid
- Loading skeletons while fetching
- Demo banner when using mock data

### Dashboard (`/dashboard`)
Personal portfolio hub. Sidebar + main content layout.
- Sidebar: nav links, "Start New Pool" CTA, profile link
- Hero: "Building sustainable wealth, together."
- Bento grid: portfolio balance + bar chart + active pools + rewards
- Pool cards from `useGroups()` (mock fallback)
- Recent activity feed

### Create (`/create`)
Group creation wizard. **Requires wallet connection.**
- Two-column layout: info + badges (left), form (right)
- Sliders for group size, collateral, insurance
- Live fee breakdown and "Total to Commit"
- Uses `useConsol().createGroup()` with demo fallback
- Security badges: Vault-Grade, Member Protection, Verifiable Fairness

### Group Detail (`/group/[address]`)
Main interaction hub. Two-column layout.
- Header: status badge, title, description, action buttons
- 3 stat cards: Total Pooled / Your Contribution / Pool Health
- Monthly Rounds Timeline with month labels
- Group Members table with names, avatars, status badges
- Round Summary sidebar + Group Protocol rules
- "Start Lottery (VRF)" button (Switchboard commit+reveal)
- "Demo Lottery" button (animation preview)
- Uses `useGroup()` with 3-tier fallback

### Profile (`/profile/[address]`)
Reputation display. Accessible via WalletButton dropdown + Dashboard sidebar.
- Star rating (4.5/5)
- Stats: completed groups, defaults, payments, active
- Payment summary

### Activity (`/activity`)
Protocol event feed with mock data.

### Treasury (`/treasury`)
Placeholder — "Under Development".

---

## Data Flow

### Hook Integration Pattern

All pages use the same pattern:
```tsx
const { groups: realGroups, loading } = useGroups();
const groups = realGroups.length > 0 ? realGroups : MOCK_GROUPS;
const isDemo = realGroups.length === 0;
```

When the program is deployed on devnet, real data automatically replaces mock data — no code changes needed.

### Switchboard VRF Integration

```
Step 1: commitRound()
  → buildCommitIx() creates Switchboard randomness account
  → Bundles commitIx + program's commit_round in same tx

Step 2: Wait ~3s for oracle

Step 3: resolveRound()
  → buildRevealIx() gets reveal instruction
  → Bundles revealIx + program's resolve_round + remaining_accounts (eligible members)
  → Winner selected on-chain
```

Dynamic import via `Function` constructor to bypass Turbopack static analysis:
```ts
const loader = new Function("m", "return import(m)");
const sb = await loader("@switchboard-xyz/on-demand");
```

---

## Key API Patterns

### shadcn base-ui

```tsx
// Button polymorphism
<Button render={<Link href="/pools" />}>Browse Pools</Button>

// Slider (single thumb)
<Slider value={[val]} onValueChange={(v) => setVal(Array.isArray(v) ? v[0] : v)} />

// SheetTrigger
<SheetTrigger render={<Button variant="ghost" size="icon" />}>
  <Menu />
</SheetTrigger>
```

### Wallet Integration

```tsx
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
const { open } = useAppKit();
const { isConnected, address } = useAppKitAccount();
```

---

## Environment Variables

```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=Fz4KqVayYMmRyToZxJzErd9qRsnh8Bdq84yicvhv4114
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_REOWN_PROJECT_ID=<from dashboard.reown.com>
```

---

## Running Locally

```bash
cd app
nvm use 24          # Node 24 required
npm install
npm run dev         # http://localhost:3000
```

## What's Next

1. **Deploy to devnet**: `anchor deploy --provider.cluster devnet` (needs SOL airdrop first)
2. **Real data**: Hooks already connected — just deploy and data flows automatically
3. **Vercel deploy**: `vercel --prod` from app/ directory
4. **Demo video**: Record 3-5 min walkthrough for Colosseum submission
