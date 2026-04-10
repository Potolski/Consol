# Consol — Work Breakdown Structure

## Hackathon: Solana Frontier (Colosseum)

- **Start**: April 6, 2026
- **Submission deadline**: May 11, 2026
- **Last updated**: April 10, 2026

---

## Timeline Overview

```
Week 1  (Apr 6-13)   ████████  Foundation — scaffold, core accounts, basic instructions
Week 2  (Apr 14-20)  ████████  Core Logic — payments, VRF, round resolution, defaults
Week 3  (Apr 21-27)  ████████  Frontend — wallet, pages, program integration
Week 4  (Apr 28-May 4) ██████  Integration — end-to-end flows, testing, polish
Week 5  (May 5-11)   ████████  Demo — presentation, video, submission, bugfixes
```

### ⚡ Actual Progress (as of Apr 10)

We're ahead of schedule — backend Weeks 1-2 AND frontend Weeks 3 tasks completed in Week 1.

```
Apr 6-8    ████  Backend: scaffold + state + core instructions + payments + VRF
Apr 9-10   ████  Frontend: scaffold + UX design + all pages + data layer + mock wiring
Apr 11+    ····  Next: smart contract completion + deploy + real integration + demo
```

---

## Track 1: Backend (Solana Program)

### 1.1 Project Scaffold ✅
- [x] `B-001` Anchor project setup (`anchor init consol`)
- [x] `B-002` Define program error codes (`errors.rs`) — 25 error codes
- [x] `B-003` Define program events (`events.rs`) — 9 events
- [x] `B-004` Configure Anchor.toml for devnet
- **Completed**: Apr 6

### 1.2 State Accounts ✅
- [x] `B-010` `ConsorcioGroup` account struct + space calculation
- [x] `B-011` `Member` account struct (PDA: group + wallet)
- [x] `B-012` `Round` account struct (PDA: group + round_number)
- [x] `B-013` `Reputation` account struct (PDA: wallet, global)
- **Completed**: Apr 7

### 1.3 Core Instructions ✅
- [x] `B-020` `create_group` — creator initializes group with parameters
- [x] `B-021` `join_group` — member deposits collateral, gets Member PDA
- [x] `B-022` `leave_group` — member exits during formation phase (full refund)
- [x] `B-023` `activate_group` — transition Forming → Active when all slots filled
- **Completed**: Apr 7

### 1.4 Payment & Round Logic ✅
- [x] `B-030` `make_payment` — member submits monthly contribution (7d window + 3d grace + 5% late fee)
- [x] `B-031` `start_round` — initialize Round account, open collection window
- [x] `B-032` `close_collection` — lock collection, transition to Selecting
- [x] `B-033` `mark_default` — progressive collateral slashing (10% → 25% → 100%)
- [x] `B-034` `distribute` — transfer pool funds to winner (push model, 1.5% protocol fee)
- **Completed**: Apr 8

### 1.5 VRF Integration (Lottery Selection) ✅
- [x] `B-040` Research Switchboard VRF — chose commit-reveal pattern
- [x] `B-041` `commit_round` — commit phase, stores randomness account + seed slot
- [x] `B-042` `resolve_round` — reveal phase, reads VRF value, selects winner from eligible members
- [ ] `B-043` End-to-end VRF test on devnet
- **Code completed**: Apr 8 — **needs devnet testing**

### 1.6 Group Completion ✅
- [x] `B-050` `close_group` — finalize group (normal completion or dissolution)
- [x] `B-051` `return_collateral` — release collateral to non-defaulted members (per-member crank)
- [x] `B-052` `distribute_insurance` — split insurance surplus pro-rata (per-member crank)
- **Completed**: Apr 10

### 1.7 Safety & Constraints ✅
- [x] `B-060` Checked arithmetic (overflow/underflow protection on all math)
- [x] `B-061` Payment window validation (7 days + 3 days grace)
- [x] `B-062` Prevent double payments (last_paid_round marker)
- [x] `B-063` `skip_round` — handle all-default rounds (no payments / no eligible members)
- [x] `B-064` `close_group` extended — dissolution when active < MIN_GROUP_SIZE, formation timeout cancel

---

## Track 2: Testing (Partial)

### 2.1 Unit Tests ✅
- [x] `T-001` Test group creation with valid/invalid parameters (6 tests)
- [x] `T-002` Test join: collateral deposit, member PDA creation, capacity check (2 tests)
- [x] `T-003` Test payment: correct amount, late fee, window enforcement, vault balance (4 tests)
- [x] `T-004` Test default: missed payment detection, collateral slash math (2 tests)
- [x] `T-005` Test skip_round: no-payment scenario, round advancement (1 test)
- [x] `T-006` Test completion: collateral return, insurance surplus, formation timeout, double-claim prevention (6 tests)
- **Framework**: LiteSVM 0.10 with direct token account injection
- **Total**: 26 tests, all passing
- **Completed**: Apr 10
- **Note**: Full distribution flow (VRF) deferred to integration tests (T-010+)

### 2.2 Integration Tests
- [ ] `T-010` through `T-014` — Not started
- **Depends on**: B-050, anchor build + deploy

### 2.3 Stress Tests
- [ ] `T-020` through `T-023` — Not started

---

## Track 3: Frontend ✅ (Phases 1-3 Complete)

### 3.1 Project Setup ✅
- [x] `F-001` Next.js 16 (App Router) + React 19 + TypeScript
- [x] `F-002` Reown AppKit wallet adapter (replaced @solana/wallet-adapter)
- [x] `F-003` Tailwind CSS 4 + shadcn/ui (base-nova) + custom dark theme
- [x] `F-004` Program IDL — Generated (43KB), imported in ConsolProvider
- [x] `F-005` Layout: Navbar + custom WalletButton + Footer + AppShell
- **Completed**: Apr 9

### 3.2 Core Pages ✅
- [x] `F-010` **Landing** — Educational (hero, 4-step explainer, comparison, calculator, CTA)
- [x] `F-011` **Pools** — Browse with filters (All/Forming/Active/Completed), loading skeletons
- [x] `F-012` **Create Group** — 2-col form + wallet gate + live preview + real createGroup hook
- [x] `F-013` **Group Detail** — 2-col: stats + timeline + members | sidebar: round summary + protocol
- [x] `F-014` **Dashboard** — Sidebar + portfolio balance + bar chart + pool cards + activity feed
- [x] `F-015` **Profile** — Reputation stars + stats + payment summary
- [x] `F-016` **Activity** — Protocol event feed
- [x] `F-017` **Treasury** — Placeholder "Under Development"
- **Completed**: Apr 10

### 3.3 Interactive Components ✅
- [x] `F-020` `GroupCard` — Status glow, progress bar, pool/collateral stats
- [x] `F-021` `RoundTimeline` — Monthly timeline with status dots, tooltips, "NOW" pulse
- [x] `F-022` Make Contribution — Integrated in Group Detail CTA, useConsol().makePayment with fallback
- [x] `F-023` `MemberList` — Table with names, avatars, status badges, filter, "View All" toggle
- [x] `F-024` `CountdownTimer` — useCountdown hook with phase detection
- [x] `F-025` `LotteryAnimation` — Light-themed SVG wheel + ConfettiEffect + VRFProofDisplay
- **Completed**: Apr 10

### 3.4 Program Integration (Hooks) ✅
- [x] `F-030` `useConsol` — 10 instruction wrappers (incl. commitRound + resolveRound VRF)
- [x] `F-031` `useGroup` — Fetch group, connected in Group Detail with 3-tier fallback
- [x] `F-032` `useGroups` — Fetch all groups, connected in Pools + Dashboard with mock fallback
- [x] `F-033` `useMember` — Fetch member PDA for connected wallet
- [x] `F-034` `useRound` — Fetch round state
- [x] `F-035` Switchboard VRF client: lib/switchboard.ts (dynamic import, buildCommitIx/buildRevealIx)
- [x] `F-036` Demo banners + loading skeletons when using mock data
- **Completed**: Apr 10 — hooks connected with automatic mock fallback

### 3.5 UX Polish ✅
- [x] `F-040` Toast notifications (transaction loading/success/error)
- [x] `F-041` Loading skeletons (pools page), button spinners, empty states
- [x] `F-042` Error handling — graceful fallbacks throughout
- [x] `F-043` Wallet gate on /create
- [x] `F-044` WalletRedirect (landing → dashboard on connect)
- [x] `F-045` Profile accessible via WalletButton dropdown + sidebar
- [x] `F-046` Zero dead links — all nav items functional or "Coming soon" toast
- **Completed**: Apr 10

---

## Track 4: Infrastructure & DevOps (Partial)

### 4.1 Deployment
- [x] `I-001` Deploy program to devnet — `Fz4KqVayYMmRyToZxJzErd9qRsnh8Bdq84yicvhv4114`
- [x] `I-002` Mint test USDC on devnet — `27GAbtwSgLHi53dhfTfika5jKjjSn38uEVpP29ki9nDw` (6 decimals)
- [x] `I-002b` Publish IDL on-chain + verify binary hash match
- [x] `I-002c` Wire frontend pages to on-chain data (useGroups, useGroup, useConsol hooks)
- [ ] `I-003` Deploy frontend (Vercel)
- [ ] `I-004` Configure domain
- **Deployed**: Apr 10

### 4.2 Developer Tooling
- [ ] `I-010` Seed script: create demo group + populate with test wallets
- [ ] `I-011` Fast-forward script: simulate N rounds
- [ ] `I-012` Reset script: clean devnet state

---

## Track 5: Presentation & Submission ❌

- [ ] `P-001` through `P-034` — Not started
- **Target**: Week 4-5

---

## Track 6: Stretch Goals

Ordered by impact-to-effort ratio:

- [ ] `S-001` **Solana Blinks** — Shareable "Join this consórcio" link
- [ ] `S-002` **Lottery animation** — VRF reveal with spinning wheel (framer-motion) ← **next priority**
- [ ] `S-003` **Bid mechanism (Lance)** — Sealed bid selection track
- [ ] `S-004` **Tranche disbursement** — 50/25/25 release schedule
- [ ] `S-005` **Notification integration** — Dialect/Notifi payment reminders
- [ ] `S-006` **Yield on idle funds** — Deposit insurance into Marinade/Kamino
- [ ] `S-007` **Reputation display** — On-chain track record on profile page

---

## Current Status Summary

| Track | Progress | Notes |
|-------|----------|-------|
| Backend (Smart Contract) | **100%** | 15/15 instructions, IDL generated + deployed |
| Frontend (UI) | **98%** | 9 routes, Architectural Ledger design, light mode |
| Frontend (Integration) | **85%** | Hooks connected with mock fallback, VRF client ready |
| Testing | **30%** | 26 unit tests passing (LiteSVM), integration pending |
| Infrastructure | **60%** | Program deployed to devnet, test USDC minted, IDL verified |
| Presentation | **0%** | Not started |

**Estimated remaining**: ~6h for full hackathon MVP

**Next critical path**: Seed demo data → VRF test on devnet → Deploy frontend (Vercel) → Demo video → Submit on Colosseum
