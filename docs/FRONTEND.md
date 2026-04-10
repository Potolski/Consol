# Consol Frontend — Architecture & Style Guide

## Overview

The Consol frontend is a Next.js 16 application providing the user interface for the decentralized consórcio protocol. It enables users to create savings groups, join existing ones, make payments, and participate in VRF-powered lottery selections — all through a modern, dark-themed DeFi interface.

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
| Animations | framer-motion | 12.x |
| State | zustand | 5.x |
| Toasts | sonner | 1.x |
| Icons | lucide-react | latest |
| Fonts | Inter + JetBrains Mono | via next/font |

### Why These Choices

- **Reown AppKit** over `@solana/wallet-adapter`: Better UX with social login (Google, GitHub, Discord), built-in modal, cleaner API. We use a custom `WalletButton` component for the connect/disconnect UI to match our design system.
- **shadcn/ui (base-nova)**: Uses `@base-ui/react` primitives instead of Radix. Key difference: uses `render` prop for polymorphism, NOT `asChild`.
- **zustand**: Lightweight state management — simpler than Redux for hackathon speed.
- **sonner**: Toast notifications integrated with shadcn ecosystem.

---

## Design System

### Color Palette

The design follows a dark-mode-first DeFi aesthetic with emerald (trust/growth) and gold (value/premium) as the primary accent colors.

| Token | Hex | CSS Usage | Role |
|-------|-----|-----------|------|
| Background | `#0A0F1E` | `bg-[#0A0F1E]` | Page background |
| Surface | `#111827` | `bg-white/[0.02]` | Cards, elevated surfaces |
| Surface Hover | `#1A2235` | `bg-white/[0.04]` | Hover states |
| Border | — | `border-white/[0.06]` | Dividers, card borders |
| Border Hover | — | `border-white/[0.1]` | Interactive borders |
| Text Primary | `#F1F5F9` | `text-white` | Main text |
| Text Muted | — | `text-white/50` | Secondary text |
| Text Subtle | — | `text-white/30` | Tertiary text |
| Primary | `#10B981` | `text-primary` / `bg-primary` | CTAs, success, emerald |
| Primary Hover | `#059669` | `bg-primary/90` | Primary hover |
| Accent | `#F59E0B` | `text-amber-500` | Active states, gold |
| Destructive | `#EF4444` | `text-red-500` | Errors, defaults |
| Info | `#3B82F6` | `text-blue-500` | Informational |
| Solana Purple | `#9945FF` | `text-[#9945FF]` | Solana branding |

### Typography

- **Sans**: Inter — headings, body text, UI labels
- **Mono**: JetBrains Mono — wallet addresses, USDC amounts, numbers, timestamps

### Spacing & Radius

- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-xl` (12px)
- Badges: `rounded-full`
- Page container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### Component Patterns

**Glass cards**:
```tsx
className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6
           transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]"
```

**Status glow** (GroupCard):
- Forming: `border-primary/20 hover:shadow-lg hover:shadow-primary/10`
- Active: `border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/10`
- Completed: no glow

**Background glow** (hero sections):
```tsx
<div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px]
                -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[140px]" />
```

---

## Directory Structure

```
app/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout (providers, fonts, metadata)
│   │   ├── page.tsx                  # Home / Explore (educational landing)
│   │   ├── globals.css               # Tailwind + CSS custom properties
│   │   ├── create/page.tsx           # Create Group (form + live preview)
│   │   ├── group/[address]/page.tsx  # Group Detail (single scroll, all state)
│   │   ├── dashboard/page.tsx        # User's groups & payments
│   │   └── profile/[address]/page.tsx # Reputation (placeholder)
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives (auto-generated)
│   │   ├── layout/                   # Navbar, Footer, AppShell
│   │   ├── groups/                   # GroupCard
│   │   └── wallet/                   # WalletButton (custom)
│   ├── hooks/
│   │   ├── useConsol.ts              # 8 instruction wrappers
│   │   ├── useGroup.ts              # Fetch single group
│   │   ├── useGroups.ts             # Fetch all/filtered groups
│   │   ├── useRound.ts             # Fetch round by group + number
│   │   ├── useMember.ts            # Fetch member for wallet
│   │   ├── useCountdown.ts         # Timer with phase detection
│   │   └── useTransactionToast.ts  # Toast helpers
│   ├── lib/
│   │   ├── constants.ts             # Mirror of on-chain protocol constants
│   │   ├── pdas.ts                  # 6 PDA derivation helpers
│   │   ├── types.ts                 # TypeScript enums + account interfaces
│   │   ├── utils.ts                 # formatUSDC, truncateAddress, etc.
│   │   ├── store.ts                 # Zustand store (cache + UI state)
│   │   ├── mock-data.ts             # Demo data for hackathon
│   │   └── idl/consol.json          # Anchor IDL (after anchor build)
│   ├── providers/
│   │   ├── SolanaProvider.tsx       # Reown AppKit setup
│   │   └── ConsolProvider.tsx       # Anchor Program context
│   ├── config/
│   │   └── index.ts                 # AppKit config (networks, adapter)
│   └── types/
│       └── appkit.d.ts              # JSX type declarations for web components
├── next.config.ts
├── .env.local                        # RPC URL, program ID, Reown project ID
└── .nvmrc                            # Node 24
```

---

## Pages

### Home (`/`)
Educational landing page — the "pitch deck" for hackathon judges.

**Sections** (in order):
1. Hero — "Save Together. Win Together." + explainer + CTAs
2. How a Consórcio Works — 4-step flow (Pool → Pay → Draw → Receive)
3. Why On-Chain? — Traditional vs Consol comparison table
4. See the Math — Concrete example ($500/mo × 10 members)
5. Protocol Stats — Live numbers from mock/on-chain data
6. Open Groups — Grid of GroupCards

### Create (`/create`)
Group creation wizard with live preview.
- Form: description, monthly amount, group size slider, collateral %, insurance %
- Live preview card + cost breakdown panel
- Submit: loading toast → success → redirect to group detail

### Group Detail (`/group/[address]`)
Single scrollable page — the main interaction hub.
- Header with status badge + config summary + share button
- Action CTA (context-dependent: Join / Pay / Start Lottery / Distribute)
- Pool overview (3 stat cards)
- Round Timeline (visual dots with tooltips)
- Members Table (filterable: All / Active / Defaulted)
- Group Rules (open by default for transparency)

### Dashboard (`/dashboard`)
Personal hub for connected wallet.
- Wallet-gated (shows connect prompt when disconnected)
- Summary stats + payment alerts
- User's active GroupCards

### Profile (`/profile/[address]`)
Reputation display — placeholder for future implementation.

---

## Key API Patterns

### shadcn base-ui Differences

This project uses shadcn's `base-nova` style which uses `@base-ui/react` instead of Radix. Key differences:

```tsx
// Button polymorphism — use render, NOT asChild
<Button render={<Link href="/create" />}>Create Group</Button>

// Button auto-sets nativeButton={false} when render is used

// SheetTrigger — same pattern
<SheetTrigger render={<Button variant="ghost" size="icon" />}>
  <Menu />
</SheetTrigger>

// Slider — single Thumb, simplified API
<Slider
  value={[groupSize]}
  onValueChange={(v) => setGroupSize(Array.isArray(v) ? v[0] : v)}
  min={3}
  max={50}
/>
```

### Wallet Integration

```tsx
// Connect/disconnect — custom WalletButton uses AppKit hooks
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
const { open } = useAppKit();
const { isConnected, address } = useAppKitAccount();

// Connection for Anchor — via ConsolProvider
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitProvider } from "@reown/appkit/react";
```

### PDA Derivation

```tsx
import { getGroupPDA, getMemberPDA, getRoundPDA } from "@/lib/pdas";

// Seeds match on-chain exactly:
// Group:  [b"group", creator, group_id.to_le_bytes()]
// Member: [b"member", group, wallet]
// Round:  [b"round", group, [round_number]]
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
nvm use 24
npm install
npm run dev
# Open http://localhost:3000
```

### Prerequisites

- Node.js 24+ (via nvm)
- Reown Project ID from [dashboard.reown.com](https://dashboard.reown.com)

### Building

```bash
npm run build  # Production build
npm start      # Start production server
```

---

## What's Next

1. **Install Anchor CLI** → `anchor build` → generate IDL
2. **Copy IDL** to `src/lib/idl/consol.json`
3. **Update ConsolProvider** to import and use real IDL
4. **Deploy to devnet** → test with real USDC
5. **VRF Lottery Animation** (framer-motion) — spinning wheel, winner reveal
6. **Deploy frontend** to Vercel
