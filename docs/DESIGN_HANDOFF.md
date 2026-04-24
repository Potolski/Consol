# Handoff: Poolver Protocol — Landing, Pools, Group, Create, Docs

## Overview

Poolver is an on-chain ROSCA (rotating savings) protocol on Solana. N wallets commit a fixed monthly USDC contribution; each round, a Switchboard VRF draw selects one wallet to receive the entire pool. Over N rounds, everyone receives exactly once.

This handoff covers a full end-to-end prototype with **5 primary views**:

1. **Landing** — marketing home (hero, value props, featured pools, CTAs)
2. **Pools** — filterable index of all concurrent pools
3. **Group** — pool-specific detail page (timeline, VRF draw, roster, vaults)
4. **Create** — 4-step wizard to launch a new pool
5. **Docs** — protocol spec with sticky TOC + scroll-spy

Plus supporting flows: Pay-this-round modal, Join-pool modal, VRF draw interaction, EN/PT-BR i18n, theme/accent tweaks.

---

## About the Design Files

The files in `prototype/` are **design references created as an HTML + React (Babel in-browser) prototype**. They are NOT production code to copy directly.

Your task: **recreate these designs in the target codebase's environment** — likely a Next.js / Vite + React app talking to a Solana program (Anchor). Use the codebase's established component primitives, styling system, state management, and wallet adapter. Where the prototype uses hardcoded mock data (`data.jsx`, `pools-data.jsx`), replace with program account reads via the Anchor IDL.

The prototype is a **single-page app** that routes between views via a `nav` state string. In a real app, replace this with file-based routing (Next.js App Router / React Router).

---

## Fidelity

**High-fidelity.** Colors, typography, spacing, borders, animations, and interactions are final-intent. Recreate pixel-level. Tokens are OKLCH in the prototype; convert to your codebase's format (Tailwind custom props, CSS vars, etc.) but preserve perceptual values.

---

## Design System

### Type

| Role | Family | Stack | Usage |
|---|---|---|---|
| Display / sans | **Geist** | `ui-sans-serif, system-ui, sans-serif` | Headlines, body copy, button labels |
| Mono | **JetBrains Mono** | `ui-monospace, 'SF Mono', Menlo, monospace` | All labels, kv rows, pool IDs, addresses, terminal chrome |
| Serif | **Instrument Serif** | `serif` | `<em>` italic accents inside headlines only |

Load via Google Fonts: `Instrument+Serif:ital@0;1`, `JetBrains+Mono:wght@400;500;600`, `Geist:wght@300;400;500;600`.

### Color tokens — dark theme (default)

All colors are OKLCH for hue stability across themes. Convert to your system.

```
--bg       oklch(0.14 0.015 260)   /* page background */
--bg-1     oklch(0.17 0.018 260)   /* card background */
--bg-2     oklch(0.20 0.02  260)   /* segmented control, input wells */
--bg-3     oklch(0.24 0.022 260)   /* chip backgrounds */
--line     oklch(0.28 0.02  260)   /* default borders */
--line-2   oklch(0.38 0.022 260)   /* emphasized borders */

--fg       oklch(0.96 0.012 240)   /* primary text */
--fg-2     oklch(0.78 0.015 240)   /* secondary text / body */
--fg-3     oklch(0.58 0.018 240)   /* tertiary / hints */
--fg-4     oklch(0.44 0.02  260)   /* very dim / meta */

--acc      oklch(0.78 0.20  240)   /* electric blue — primary accent */
--acc-2    oklch(0.70 0.19  240)
--acc-ink  oklch(0.14 0.02  260)   /* text on --acc */
--acc-tint oklch(0.30 0.12  240)   /* accent-tinted panel bg */

--vio      oklch(0.72 0.15  210)   /* secondary glow (teal) */
--vio-tint oklch(0.28 0.09  210)

--ok       oklch(0.82 0.20  150)   /* success / receive green */
--warn     oklch(0.82 0.18  75)    /* forming / bid yellow */
--err      oklch(0.72 0.24  25)    /* default / error red */
```

### Accent variants (via `html[data-accent="..."]`)

- `electric` (default) — hue 240
- `mint` — hue 165 (`--acc: oklch(0.86 0.18 165)`)
- `ice` — hue 220 (`--acc: oklch(0.9 0.12 220)`)

### Light theme (`html[data-theme="light"]`)

Inverts bg/fg ramp, keeps accents. See `styles.css` `html[data-theme="light"]` block.

### Spacing / radii / misc

- Container: `--maxw: 1440px`, horizontal padding 32px.
- Border radius: 2px for chips/inputs, 3px for cards/panels. **Never** heavy rounded corners — the aesthetic is terminal/precise.
- Standard dashed rule: `border-top: 1px dashed var(--line-2)` — used as section separator.
- Shadow is sparse — only `box-shadow: 0 8px 32px -8px var(--acc-tint)` on pool-card hover and `0 0 6–24px` glows on active accent elements.

### Motion

- Hover transitions 150ms ease.
- Card lift on hover: `translateY(-2px)` + accent-tinted shadow.
- Three drifting background glow orbs (`.glow-orb.a/.b/.c`), 28–42s loops, `mix-blend-mode: screen`, blurred 80px. Respects `prefers-reduced-motion`.
- Logo mark spins slowly (60–80s) as a decorative watermark behind hero terminals and outcome cards.
- Outcome glow pulses 4s alternate.

---

## Logo

Poolver mark = **two concentric circles + center dot**. Used extensively:
- As prefix in all section-number chips (01, 02, …)
- In stat-card labels
- Inside terminal chrome next to pool IDs
- As a large spinning watermark behind hero terminals (4% opacity)
- In the closing CTA (18% opacity, 40s spin)
- In TOC header, status chips

See `prototype/logo.jsx` for the SVG. It renders at any size via `<PoolverMark size={N} />`. There's also a `PoolverWordmark` used in the footer.

---

## Screens / Views

### 01. Landing (`nav === "landing"`, brand-click returns here)

**Purpose:** Marketing front door. Visitors learn what Poolver is and decide to browse or create.

**Layout:** Single-column stacking sections inside `.shell` (1440px max). All sections have the standard `SectionHead` component (section number chip + italic-accent headline + meta label).

Sections in order:
1. **Ticker** — infinite-scroll row of stats (TVL, active pools, pair prices). See `Ticker` in `components.jsx`.
2. **Hero** — 2-col grid (1fr 1fr). Left: kicker chip + 52–60px italic-accent headline "Pool *savings*, not risk." + deck paragraph + 3 CTAs (Browse pools / Create pool / Read docs) + byline chips. Right: "terminal" card with protocol summary (TVL $22.9M, fee 1.50%, insurance reserve, on-time rate, network, asset) + watermark logo.
3. **"Why Poolver"** — 3-column value-prop cards with left accent bar. Icons: logo mark, ◈, ◆.
4. **"Three moves"** — 3-column step strip in a single card (JOIN / CONTRIBUTE / DRAW & RECEIVE).
5. **"Protocol at a glance"** — 3-column stats (Active pools 12, Total locked $22.9M, Insurance reserve $89K) with mini progress bars.
6. **"Circles now forming"** — featured 3-pool `PoolCard` grid + "All pools →" button.
7. **Closing CTA** — centered card with spinning logo watermark, radial accent gradient, "Ready to join a circle?" + 2 buttons.
8. **Footer**.

### 02. Pools (`nav === "pools"`)

**Purpose:** Browse/filter/sort all concurrent pools.

**Layout:**
- Hero strip: kicker + headline "Concurrent *circles*. Pick your ticket." + TVL and active-wallets stat cards.
- Toolbar: filter tabs (ALL/ACTIVE/FORMING/CLOSING with counts) + sort `<select>` (rep / size / monthly / soonest draw).
- **Pool grid**: 3 columns ≥1200px, 2 columns ≥1000px, 1 column below.

**PoolCard anatomy** (≈380×330px):
- Head: logo mark + pool ID + chain/asset (left) · status chip (right)
- Hero strip (dashed top+bottom): pool size ($XK/M) left, monthly right (accent color)
- Progress row: "ROUND NN / total" or "FILLING n/cap" + percentage, 3px progress bar
- KV grid (2 cols): next draw / collateral / circle rep / on-time rate
- Foot: remaining-rounds meta + action CTA (OPEN → / JOIN → / VIEW →)

Hover: border → accent, `translateY(-2px)`, accent-tinted shadow. The user's own position (`featured: true`) shows a "YOUR POSITION" badge and a linear-gradient accent-tinted background.

**Status chips:**
- `active` — green dot ● ACTIVE (accent color)
- `forming` — half-circle ◐ FORMING (warn/yellow)
- `closing` — filled ◉ CLOSING (fg-2 muted)

### 03. Group (`nav === "group"`)

**Purpose:** Pool-specific detail page. Selected pool tracked in state; routed from any PoolCard click.

**Sections in order:**
1. `← All pools` back button
2. **GroupHero** — same 2-col layout as Landing hero but specific to the pool: kicker "LIVE · {poolId} · ROUND NN/total", headline "{poolId}\n*${monthly}/mo · {members} members*", paragraph with live stats (round, pool size, next draw, circle rep, on-time). CTAs: "▶ Contribute this round", "◆ Place bid (Lance)". Right terminal card shows pool-specific KVs (monthly, members, collateral, next draw, circle rep, on-time).
3. **Timeline** — grid of 20 round cells (current highlighted, past with winner + amount) + right sidebar with circle stats and ASCII status block.
4. **LotterySection** — the VRF draw interactive. Left: terminal log with interactive buttons (commit VRF → reveal → select). Right: eligibility list + outcome card (winner avatar, address, rep, payout amount, tranche schedule).
5. **Roster** — table of 20 members: index, wallet avatar+addr+ens, collateral, reputation bar (tier letter + score + progress), circles·on-time, status badge, received month. "You" row highlighted.
6. **Vaults** — 3 stat cards: pool / insurance / collateral.
7. **How it works** — 4-step strip.

### 04. Create (`nav === "create"`)

**Purpose:** 4-step wizard to configure and deploy a new pool.

**Layout:** 2-col grid — form body (1fr) + sticky live-summary sidebar (280px).

**Steps:**
1. **Basics** — name (text input), asset (segmented USDC/USDT/EURC), monthly (range 100–15000 + chip presets 500/1K/2.5K/5K/10K), members (range 6–30), duration (range 6–30 rounds).
2. **Risk** — collateral % (range 10–50, shows locked $ computed live), insurance % (range 0–10, shows per-contribution carve), tranched release (segmented 100/0/0 · 50/25/25 · 40/30/30 with descriptive hint), bidding (ON/OFF).
3. **Access** — open/invite segmented, min reputation (range 0–900, shows tier S/A/B/C gate live), + a placeholder "post-v0.1" box.
4. **Review** — summary card with pool size, lifetime volume, member × duration, per-member pay/receive, collateral, insurance, tranche, bidding, access. Below: a "deploy sequence" callout listing the 4 transactions.

**Stepper:** 4 chips + dashed separators across the top. Completed steps are clickable to go back; future steps are disabled.

**Sidebar (sticky, top: 80px):** `{total}` headline + "per round · N members" + dashed rule + monthly/rounds/collateral/insurance/tranche/bidding/access kv + dashed rule + protocol fee computation.

**Nav:** `← Back` and `Continue →` / `▶ Deploy pool` at the bottom of the form body.

### 05. Docs (`nav === "docs"`)

**Purpose:** Full protocol specification.

**Layout:** 2-col grid — 220px sticky left TOC + `max-width: 720px` right body.

**TOC:** logo + "Contents" label + 9 numbered links (border-left highlight when active via IntersectionObserver scroll-spy) + a `PROGRAM_ID` footer block.

**Sections (all h2, preceded by section-num chip + logo):**
1. What Poolver is (callout on why on-chain)
2. Lifecycle (ASCII diagram + ordered list)
3. What you pay, when (two tables — cost side and receive side — plus callout with total-cost math)
4. The draw (VRF, ASCII commit-reveal diagram)
5. Bidding (Lance) — Track A/B auction, tie-breakers, offset, binding callout
6. **Post-win enforcement** — 4-layer stack: collateral lock / tranche release table / insurance waterfall / reputation slashing + ASCII stack diagram + "honest caveat" callout
7. Protocol economics (fee, insurance, oracle cost table)
8. Wallet reputation (signal-weight table + tier thresholds)
9. Risks & disclaimers

---

## Interactions & Behavior

### Routing
- `nav` state string: `"landing" | "pools" | "group" | "create" | "docs"`.
- Stored in `localStorage.plvr_nav`; default `"landing"`.
- On nav change, `window.scrollTo(0, 0)`.
- Brand-click in TopBar → `"landing"`.
- PoolCard-click → sets `selectedPoolId` then `nav = "group"`.
- Nav tabs in TopBar from `t.nav` (i18n key map).

### Wallet + connection (prototype-level)
- `connected` boolean toggled from the TopBar "Wallet" pill.
- Real impl: Solana Wallet Adapter (@solana/wallet-adapter-react).

### VRF draw (on Group view, `lottery.jsx`)
- Terminal log state (array of `{p: "$"|">", t: ReactNode}`).
- Eligible list animates through rapid selection, lands on winner.
- Outcome card transitions from "awaiting" to winner state with seed + proof reveal.
- Real impl: subscribe to program events or poll pool account; call Switchboard VRF request/reveal instructions.

### Create wizard
- Single `cfg` state object; `set(k, v)` updates.
- Step `1..4`; navigation only forward unless a later step has been reached.
- Live summary sidebar re-computes `total = monthly * memberCap`, protocol fee, per-member collateral.

### Docs scroll-spy
- `IntersectionObserver` on each section id with `rootMargin: "-20% 0px -70% 0px"`.
- Active link gets border-left accent + accent text color.
- TOC click scrolls to `section.top + window.scrollY - 80` with `behavior: "smooth"`.

### i18n
- EN / PT-BR. Toggle pill in TopBar. Persisted to `localStorage.plvr_lang`.
- See `i18n.jsx` for key structure. Every user-facing string goes through `t.*`.

### Tweaks panel
- Prototype-only dev tool; remove in production. Configures theme (dark/light) and accent (electric/mint/ice) via `html` data attributes.

### Modals
- **PayModal** — summary of the round, amount, breakdown (contribution / insurance carve / net), confirm button.
- **JoinModal** — collateral + first month deposit breakdown, acceptance checkbox, deposit button.
- Standard overlay pattern; close on backdrop click or × button.

### Responsive
- ≥1200px: full layouts.
- 1000–1200px: pool grid 2 cols.
- <1000px: single-column stacks; TopBar nav hidden; docs TOC moves above body as a dashed-separated block; timeline months wrap at 5 cols; roster and member-grid collapse.

---

## State Management

Lift to the closest routing library / app state. In the prototype:

| State | Location | Persisted |
|---|---|---|
| `lang` | App | `plvr_lang` |
| `theme`, `accent` | App | `plvr_theme`, `plvr_accent` |
| `nav` | App | `plvr_nav` |
| `selectedPoolId` | App | `plvr_pool` |
| `payOpen`, `joinOpen`, `tweaksOpen` | App | no |
| `connected` | App | no (real: wallet-adapter session) |
| VRF draw state (logs, winner, seed) | `lottery.jsx` local | no |
| `cfg` (pool creation config) | `create.jsx` local | no |

### Real-data integration points

1. **Pools list** — replace `POOLS` array in `pools-data.jsx` with reads from the program's pool accounts. Derive: `status` from `round / duration / members.length`, `rep` and `onTime` from aggregated member history.
2. **Selected pool** — fetch account by PDA derived from `pool_id`. Subscribe for live round/draw updates.
3. **Members/roster** — fetch member PDAs for the pool. Each holds collateral amount, reputation score, received-round, status enum.
4. **VRF draw** — Switchboard VRF account; request on round close, reveal on oracle callback.
5. **Reputation** — on-chain SBT-like account per wallet. Query `get_reputation(pubkey)`.
6. **Create pool** — Anchor `create_pool` ix taking the `cfg` object shape. Sign with creator wallet; it provides first collateral + contribution.

---

## Components Mapped to Prototype Files

| Component | File | Exported to window |
|---|---|---|
| `TopBar`, `Ticker`, `SectionHead`, `Timeline`, `Roster`, `Vaults`, `How`, `Footer`, `GroupHero`, `WalletId`, `RepBar`, `repTier` | `components.jsx` | ✓ |
| `LandingView` | `landing.jsx` | ✓ |
| `PoolsView`, `PoolCard`, `StatusChip`, `fmtUSD` | `pools.jsx` | ✓ |
| `CreateView`, `Field`, `Kv` | `create.jsx` | ✓ |
| `DocsView`, `DocSection`, `Callout`, `Ascii`, `Code` | `docs.jsx` | ✓ |
| `LotterySection` | `lottery.jsx` | ✓ |
| `PayModal`, `JoinModal` | `modals.jsx` | ✓ |
| `TweaksPanel` | `tweaks.jsx` | ✓ |
| `PoolverMark`, `PoolverWordmark` | `logo.jsx` | ✓ |
| `App` | `app.jsx` | renders into `#root` |
| `MEMBERS`, `ROUNDS` | `data.jsx` | ✓ |
| `POOLS` | `pools-data.jsx` | ✓ |
| `i18n` | `i18n.jsx` | ✓ |

All CSS is in `styles.css` — a single stylesheet with token-driven class hooks. The `index.html` inlines it during build; in a real app split into component-scoped styles or Tailwind.

---

## Implementation Recommendations

1. **Framework:** Next.js 14 (App Router) + Tailwind + shadcn/ui, or whatever's established. Keep the terminal aesthetic by setting Tailwind's `borderRadius.DEFAULT = '3px'` and disabling default shadows.
2. **Solana:** Anchor + `@solana/wallet-adapter-react` + `@solana/web3.js`. Mainnet-beta with devnet toggle.
3. **Data:** Program account subscriptions (`connection.onAccountChange`) for live round updates. Cache with TanStack Query.
4. **VRF:** Switchboard SDK for request/reveal.
5. **i18n:** `next-intl` with the same `t.*` key structure as the prototype's `i18n.jsx`.
6. **Styles:** Map all OKLCH tokens to CSS custom properties in the root stylesheet; Tailwind theme extends from there.
7. **Fonts:** `next/font/google` for Geist, JetBrains Mono, Instrument Serif.
8. **Analytics/logging:** Not in prototype. Add at route transitions and major actions (pay, bid, join).

---

## Files in this handoff

```
prototype/
├── index.html           # Entry point — inlines styles.css, loads all .jsx via Babel
├── styles.css           # Canonical stylesheet (all tokens + component classes)
├── app.jsx              # Root App + router
├── components.jsx       # TopBar, GroupHero, Timeline, Roster, Vaults, How, Footer, etc
├── landing.jsx          # Landing view
├── pools.jsx            # PoolsView + PoolCard + StatusChip
├── pools-data.jsx       # Mock POOLS array (12 pools)
├── create.jsx           # 4-step CreateView wizard
├── docs.jsx             # DocsView with TOC scroll-spy
├── lottery.jsx          # VRF draw interactive
├── modals.jsx           # PayModal + JoinModal
├── tweaks.jsx           # Dev tweaks panel (remove in prod)
├── data.jsx             # Mock MEMBERS, ROUNDS for Group view
├── i18n.jsx             # EN / PT-BR string table
└── logo.jsx             # PoolverMark + PoolverWordmark SVG components
```

Open `index.html` locally (or serve it) to see the full prototype in action. Navigate via the TopBar.

---

## Questions for the product/design lead before building

- Real wallet integration scope — Solana Wallet Adapter multi-wallet, or ship with one (Phantom) first?
- Payment authority delegation — the prototype assumes a standing allowance; confirm this is the intended UX vs manual-sign every round.
- Treasury multisig signers — who holds the keys to the fee treasury pre-governance?
- VRF funding — who refills the Switchboard queue's SOL?
- KYC / jurisdictional gating — the prototype has only rep-based gates; confirm scope for v1.
- Copy — "Lance" is Portuguese for "bid"; confirm this is the final English term vs. "Bid" or "Priority bid".

---

_Last updated: 2026-04-20 — matches prototype at project root_
