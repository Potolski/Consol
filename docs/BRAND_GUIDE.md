# Poolver -- Visual Identity Guide

---

## 1. Brand Name

**Poolver** (noun) -- /puːl.vɜːr/

A portmanteau of **Pool** + **Verify**. The name communicates both the collective savings mechanism (pool) and the cryptographic fairness guarantee (verify). It's international, easy to pronounce in English, Spanish, Portuguese, French, and Swahili, and has no cultural baggage that limits geographic expansion.

**Written forms:**
- Full name: **Poolver**
- Stylized: **poolver** (lowercase in product UI, monospace contexts)
- Domain: **poolver.com**
- Protocol reference: **Poolver Protocol**
- Social handle: **@poolver**

**Wordmark treatment:**
The "oo" in Poolver is the visual anchor. In the wordmark, the two "o"s are rendered as two overlapping circles -- representing the pool of participants coming together. The "ver" portion can be subtly lighter or in the accent color to emphasize the "verify" etymology.

```
P ●● l v e r
  ↑↑
  Two overlapping circles = pool + togetherness
```

---

## 2. Logo Concept

### Primary Mark: The Verified Pool

The logomark combines two core ideas:

1. **The Pool Circle** -- A ring of dots/nodes arranged in a circle, representing the members of a consorcio group. Each dot is a participant.
2. **The Checkmark** -- One node in the circle is highlighted and elevated with a subtle checkmark or glow, representing the VRF-verified winner of the current round.

This creates a symbol that reads as: *"a group of people, one verifiably selected."*

### Variations

| Variant | Use case |
|---------|----------|
| **Full lockup** | Logomark + "Poolver" wordmark, horizontal. Primary usage. |
| **Stacked lockup** | Logomark above "Poolver" wordmark. For square formats (social avatars, app icons). |
| **Logomark only** | The verified pool circle. For favicons, loading states, small spaces. |
| **Wordmark only** | "Poolver" text. For inline mentions, documentation headers. |

### Logo Construction Notes

- The circle of nodes should have exactly **8 dots** in the default mark (not too few to look empty, not too many to lose clarity at small sizes).
- The "winner" node should be at the **1 o'clock position** (upper right) -- psychologically associated with progress and forward motion.
- The winner node is **1.5x larger** than the others and rendered in the Accent Green color.
- A subtle checkmark or verification tick can be integrated into or adjacent to the winner node.
- Minimum clear space around the logo: 1x the height of the logomark on all sides.

---

## 3. Color System

### Foundation: Keep the Green

The existing `#006c4a` primary green is excellent -- it communicates trust, finance, and growth. We evolve it into a richer system.

### Primary Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Poolver Green** (Primary) | Deep emerald | `#006c4a` | Primary buttons, logo accent, interactive elements, success states |
| **Poolver Green Light** | Mint glow | `#e0ffec` | Primary button text, green-on-dark contexts, tag backgrounds |
| **Poolver Green Hover** | Dark emerald | `#005a3e` | Hover states on primary actions |
| **Poolver Green Subtle** | Pale mint | `#85f8c4` at 20% | Badges, status indicators, soft backgrounds |

### Neutral Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Navy** (Foreground) | Deep navy | `#00345e` | Headlines, body text, primary content |
| **Slate** | Medium blue | `#26619d` | Secondary text, descriptions, muted labels |
| **Gray Blue** | Soft | `#455367` | Tertiary text, captions |
| **Surface** | Ice white | `#f8f9ff` | Page background |
| **Card** | Pure white | `#ffffff` | Cards, modals, elevated surfaces |
| **Surface Hover** | Light blue | `#dce9ff` | Hover states on surfaces |
| **Secondary** | Soft blue | `#d5e3fd` | Secondary buttons, tags, inactive tabs |

### Accent Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Gold** | Dark goldenrod | `#b8860b` | Warnings, premium features, VRF lottery highlight |
| **Solana Purple** | Solana brand | `#9945FF` | "Built on Solana" badge, chain-specific elements |
| **Error Red** | Muted crimson | `#9f403d` | Destructive actions, default/slash indicators |
| **Info Blue** | Steel blue | `#26619d` | Informational alerts, links |

### Dark Mode (Future)

When dark mode is implemented:

| Role | Light | Dark |
|------|-------|------|
| Background | `#f8f9ff` | `#0a0f1a` |
| Card | `#ffffff` | `#141b2d` |
| Foreground | `#00345e` | `#e2e8f0` |
| Primary | `#006c4a` | `#34d399` (brighter for contrast) |
| Surface | `#eff4ff` | `#1e293b` |

---

## 4. Typography

### Font Stack (Current -- Keep)

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| **Headlines** | Manrope | 800 (ExtraBold) | H1, H2, hero text, page titles |
| **Body** | Inter | 400 (Regular), 500 (Medium), 600 (SemiBold) | Paragraphs, labels, buttons, nav |
| **Code/Data** | JetBrains Mono | 400, 500 | Addresses, transaction hashes, amounts, technical data |

### Type Scale

| Element | Size | Weight | Font |
|---------|------|--------|------|
| Hero headline | 4.5rem (72px) | 800 | Manrope |
| Page title (H1) | 2.25rem (36px) | 800 | Manrope |
| Section title (H2) | 1.5rem (24px) | 700 | Manrope |
| Card title (H3) | 1.125rem (18px) | 600 | Inter |
| Body | 1rem (16px) | 400 | Inter |
| Small / Caption | 0.875rem (14px) | 400 | Inter |
| Code | 0.875rem (14px) | 400 | JetBrains Mono |

### Naming Convention in Typography

When writing "Poolver" in headlines, the word should always use the headline font (Manrope). In body text, it follows the body font. Never italicize the brand name. Never put it in quotes.

---

## 5. Iconography

### Style: Lucide (Current -- Keep)

Continue using Lucide icons. They match the clean, geometric feel of the brand.

### Custom Icons (Recommended for Key Concepts)

| Concept | Icon idea | Where used |
|---------|-----------|-----------|
| **Pool/Group** | Circle of dots (matches logomark) | Navigation, group cards |
| **VRF Lottery** | Sparkle inside a shield | Round status, lottery trigger |
| **Payment** | Arrow entering a vault | Payment buttons, contribution status |
| **Collateral** | Lock with percentage badge | Join flow, member status |
| **Winner** | Crown or trophy with checkmark | Winner reveal, distribution |
| **Reputation** | Star with blockchain nodes | Profile page |

---

## 6. UI Component Style

### Cards
- White background (`#ffffff`)
- No visible border (current `border: transparent` is correct)
- Subtle shadow: `0 4px 24px rgba(0, 52, 94, 0.08)`
- Border radius: `0.75rem` (12px)
- Hover: background shifts to `#f8f9ff` or subtle shadow increase

### Buttons

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| Primary | `#006c4a` | `#e0ffec` | none |
| Primary Hover | `#005a3e` | `#e0ffec` | none |
| Secondary | `#d5e3fd` | `#455367` | none |
| Ghost | transparent | `#00345e` | none |
| Destructive | `#9f403d` | white | none |

Border radius on all buttons: `0.75rem` (xl)

### Status Badges

| Status | Background | Text |
|--------|-----------|------|
| Forming | `#d5e3fd` | `#26619d` |
| Active | `#e0ffec` | `#006c4a` |
| Completed | `#eff4ff` | `#455367` |
| Defaulted | `#fde8e8` | `#9f403d` |

---

## 7. Voice & Tone

### Brand Voice

Poolver speaks with **calm confidence**. It's a financial protocol -- users are trusting it with real money. The tone should feel like a trusted advisor, not a hype machine.

| Do | Don't |
|----|-------|
| "Verifiably fair selection" | "Revolutionary AI-powered lottery!!!" |
| "1.5% protocol fee" | "Almost free!" |
| "Pool funds are held on-chain" | "Your money is SAFU" |
| "Join a savings circle" | "Ape into a pool" |

### Taglines (by context)

| Context | Tagline |
|---------|---------|
| **Primary** | *Pool. Verify. Receive.* |
| **Hero/Homepage** | *Save Together. Win Together.* |
| **Technical** | *Verifiable savings pools on Solana.* |
| **Investor pitch** | *The consorcio protocol. Transparent pools. Fair lotteries.* |
| **Social bio** | *Decentralized savings circles with provably fair selection.* |

---

## 8. Motion & Animation

### Principles
- Motion should feel **fluid and purposeful**, never flashy.
- Use `ease-out` for entrances, `ease-in` for exits.
- Default duration: 200-300ms for micro-interactions, 500ms for page transitions.

### Key Animations (Current)
- **Pulse glow**: `pulse-glow 2s ease-in-out infinite` on the "Live on Devnet" badge. Keep this.
- **Slide up**: `slide-up 0.3s ease-out` for card/content entrances. Keep this.
- **Lottery wheel**: Spinning animation on VRF reveal. This is the signature moment -- make it dramatic (1.5-2s spin with deceleration easing).
- **Confetti**: On winner reveal. Keep it brief (2s) and within the card area, not full-screen.

---

## 9. Brand Architecture

```
Poolver (master brand)
  |
  |-- Poolver Protocol     (the on-chain program)
  |-- Poolver App           (the frontend at poolver.com)
  |-- Poolver Docs          (documentation site)
  |-- Poolver SDK           (future: developer SDK)
```

The word "Poolver" is always the brand. Sub-products use "Poolver [descriptor]" format. Never abbreviate to "PV" or "Plvr" in official communications.

---

## 10. Do's and Don'ts

### Do
- Use "Poolver" with capital P in all written contexts
- Pair the green with white/navy -- never green on green
- Let the logomark breathe with generous whitespace
- Use the pool-of-dots motif as a decorative pattern (subtle, background)

### Don't
- Don't stretch, rotate, or recolor the logo
- Don't use gradients on the primary green (keep it flat and confident)
- Don't add drop shadows to the logo
- Don't use more than 2 accent colors on any single screen
- Don't use crypto slang (wagmi, gm, ape, degen) in official copy
