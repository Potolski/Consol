# Consol — Work Breakdown Structure

## Hackathon: Solana Frontier (Colosseum)

- **Start**: April 6, 2026
- **Submission deadline**: May 11, 2026
- **Available time**: ~33 days from today (April 8)

---

## Timeline Overview

```
Week 1  (Apr 6-13)   ████████  Foundation — scaffold, core accounts, basic instructions
Week 2  (Apr 14-20)  ████████  Core Logic — payments, VRF, round resolution, defaults
Week 3  (Apr 21-27)  ████████  Frontend — wallet, pages, program integration
Week 4  (Apr 28-May 4) ██████  Integration — end-to-end flows, testing, polish
Week 5  (May 5-11)   ████████  Demo — presentation, video, submission, bugfixes
```

---

## Track 1: Backend (Solana Program)

### 1.1 Project Scaffold
- [x] Initialize repo and design doc
- [x] `B-001` Anchor project setup (`anchor init consol`)
- [x] `B-002` Define program error codes (`errors.rs`)
- [x] `B-003` Define program events (`events.rs`)
- [x] `B-004` Configure Anchor.toml for devnet
- **Target**: End of Week 1, Day 1

### 1.2 State Accounts
- [ ] `B-010` `ConsorcioGroup` account struct + space calculation
- [ ] `B-011` `Member` account struct (PDA: group + wallet)
- [ ] `B-012` `Round` account struct (PDA: group + month)
- [ ] `B-013` `Reputation` account struct (PDA: wallet, global)
- **Target**: End of Week 1, Day 2
- **Depends on**: B-001

### 1.3 Core Instructions
- [ ] `B-020` `create_group` — creator initializes group with parameters
- [ ] `B-021` `join_group` — member deposits collateral + first payment, gets Member PDA
- [ ] `B-022` `leave_group` — member exits during formation phase (full refund)
- [ ] `B-023` `activate_group` — transition from Forming → Active when slots filled
- **Target**: End of Week 1
- **Depends on**: B-010, B-011

### 1.4 Payment & Round Logic
- [ ] `B-030` `make_payment` — member submits monthly contribution to vault
- [ ] `B-031` `start_round` — initialize Round account, open collection window
- [ ] `B-032` `close_collection` — lock collection, calculate total, check defaults
- [ ] `B-033` `mark_default` — flag non-payer, apply collateral slash, update member state
- [ ] `B-034` `distribute` — transfer pool funds to selected winner
- [ ] `B-035` `claim_distribution` — winner claims (if using claim model vs direct push)
- **Target**: End of Week 2
- **Depends on**: B-020, B-021, B-012

### 1.5 VRF Integration (Lottery Selection)
- [ ] `B-040` Research Switchboard VRF v2 vs other options (Orao, etc.)
- [ ] `B-041` `request_randomness` — trigger VRF request for round selection
- [ ] `B-042` `consume_randomness` — VRF callback resolves winner from eligible set
- [ ] `B-043` End-to-end VRF test on devnet
- **Target**: End of Week 2
- **Depends on**: B-031

### 1.6 Group Completion
- [ ] `B-050` `complete_round` — finalize a round after distribution
- [ ] `B-051` `close_group` — finalize group after all rounds, return collateral
- [ ] `B-052` `return_collateral` — release collateral to non-defaulted members
- [ ] `B-053` `distribute_insurance_surplus` — split remaining insurance pool
- **Target**: Mid Week 3
- **Depends on**: B-034, B-042

### 1.7 Safety & Constraints
- [ ] `B-060` Add all boundary checks (overflow, underflow, zero amounts)
- [ ] `B-061` Validate payment windows (too early, too late, grace period)
- [ ] `B-062` Prevent double payments, double claims, double selection
- [ ] `B-063` Handle edge case: all members default in a round
- [ ] `B-064` Handle edge case: group dissolution (majority default)
- **Target**: Week 3-4 (ongoing)
- **Depends on**: B-030 through B-053

---

## Track 2: Testing

### 2.1 Unit Tests (Anchor/Rust)
- [ ] `T-001` Test group creation with valid/invalid parameters
- [ ] `T-002` Test join: collateral deposit, member PDA creation, capacity check
- [ ] `T-003` Test payment: correct amount, window enforcement, vault balance
- [ ] `T-004` Test default: missed payment detection, collateral slash math
- [ ] `T-005` Test distribution: correct amount, eligible set filtering
- [ ] `T-006` Test completion: collateral return, insurance surplus
- **Target**: Parallel with backend, always current
- **Depends on**: Corresponding B-xxx tasks

### 2.2 Integration Tests (TypeScript)
- [ ] `T-010` Full lifecycle: create → join (all members) → activate
- [ ] `T-011` Full lifecycle: N rounds of payment → selection → distribution
- [ ] `T-012` Default scenario: member misses payment, gets slashed, group continues
- [ ] `T-013` Early withdrawal scenario
- [ ] `T-014` VRF integration test on devnet
- **Target**: Week 3-4
- **Depends on**: B-050, B-042

### 2.3 Stress & Edge Case Tests
- [ ] `T-020` Maximum group size (50 members)
- [ ] `T-021` Minimum group size (3 members)
- [ ] `T-022` Simultaneous payments from all members
- [ ] `T-023` Default cascade (multiple defaults in sequence)
- **Target**: Week 4
- **Depends on**: T-010 through T-014

---

## Track 3: Frontend

### 3.1 Project Setup
- [ ] `F-001` Initialize Next.js/React project with TypeScript
- [ ] `F-002` Configure Solana wallet adapter (@solana/wallet-adapter)
- [ ] `F-003` Set up Tailwind CSS + base theme (colors, typography)
- [ ] `F-004` Import program IDL + generate TypeScript client
- [ ] `F-005` Create base layout (navbar, wallet connect, footer)
- **Target**: Start of Week 3
- **Depends on**: B-001 (for IDL)

### 3.2 Core Pages
- [ ] `F-010` **Home/Explore** — Browse open groups, key stats, CTA to create
- [ ] `F-011` **Create Group** — Form to configure and deploy a new consórcio
- [ ] `F-012` **Group Detail** — Members list, round timeline, current status, actions
- [ ] `F-013` **Dashboard** — User's active groups, payment schedule, history
- [ ] `F-014` **Profile** — Wallet reputation, completed consórcios, stats
- **Target**: End of Week 3
- **Depends on**: F-001 through F-005

### 3.3 Interactive Components
- [ ] `F-020` `GroupCard` — Pool summary (members, amount, progress, status)
- [ ] `F-021` `RoundTimeline` — Visual progress of all rounds (who received, current)
- [ ] `F-022` `PaymentModal` — Submit monthly payment with confirmation
- [ ] `F-023` `MemberList` — Members with status indicators (paid, pending, defaulted)
- [ ] `F-024` `CountdownTimer` — Payment window / selection countdown
- [ ] `F-025` `LotteryAnimation` — VRF selection visualization (spinning wheel / card reveal)
- **Target**: End of Week 3 / Early Week 4
- **Depends on**: F-010 through F-014

### 3.4 Program Integration (Hooks)
- [ ] `F-030` `useConsol` — Core hook: create, join, pay, claim instructions
- [ ] `F-031` `useGroup` — Fetch + subscribe to group account state
- [ ] `F-032` `useRound` — Fetch + subscribe to current round state
- [ ] `F-033` `useMember` — Fetch member PDA for connected wallet
- [ ] `F-034` `useReputation` — Fetch global reputation for wallet
- **Target**: Week 3-4 (parallel with pages)
- **Depends on**: F-004, B-020+

### 3.5 UX Polish
- [ ] `F-040` Toast notifications (payment confirmed, selected as winner, etc.)
- [ ] `F-041` Loading states and skeleton screens
- [ ] `F-042` Error handling with human-readable messages
- [ ] `F-043` Mobile responsive layout
- [ ] `F-044` Empty states (no groups, no payments yet)
- **Target**: Week 4
- **Depends on**: F-010 through F-034

---

## Track 4: Infrastructure & DevOps

### 4.1 Deployment
- [ ] `I-001` Deploy program to Solana devnet
- [ ] `I-002` Mint test USDC on devnet for demo
- [ ] `I-003` Deploy frontend (Vercel or similar)
- [ ] `I-004` Configure custom domain (if available)
- **Target**: I-001 end of Week 2, I-003 end of Week 3

### 4.2 Developer Tooling
- [ ] `I-010` Seed script: create demo group + populate with test wallets
- [ ] `I-011` Fast-forward script: simulate N rounds for demo state
- [ ] `I-012` Reset script: clean devnet state for fresh demo
- **Target**: Week 4
- **Depends on**: B-050

### 4.3 Monitoring
- [ ] `I-020` Set up basic program logging (Anchor events)
- [ ] `I-021` Index events for frontend (Helius webhooks or on-chain polling)
- **Target**: Week 4 (nice-to-have)

---

## Track 5: Presentation & Submission

### 5.1 Pitch Deck
- [ ] `P-001` Outline pitch narrative (problem → solution → demo → market → team)
- [ ] `P-002` Design slides (8-12 slides max)
- [ ] `P-003` Add market data (ROSCA $500B, Brazil consórcio stats, crypto adoption)
- [ ] `P-004` Technical architecture diagram (clean, single slide)
- [ ] `P-005` Competitive landscape slide
- [ ] `P-006` Roadmap slide (hackathon MVP → v2 → mainnet)
- **Target**: Week 4

### 5.2 Demo
- [ ] `P-010` Write demo script (2-3 minute walkthrough)
- [ ] `P-011` Seed devnet with realistic demo data
- [ ] `P-012` Practice demo flow end-to-end (no dead clicks)
- [ ] `P-013` Record backup video in case of live issues
- **Target**: Week 5 (May 5-8)

### 5.3 Video Submission
- [ ] `P-020` Record submission video (typically 3-5 min for Colosseum)
- [ ] `P-021` Edit: intro, problem, demo walkthrough, architecture, closing
- [ ] `P-022` Add captions/subtitles
- [ ] `P-023` Upload and test link
- **Target**: May 9-10 (2 days before deadline)

### 5.4 Submission Package
- [ ] `P-030` Write project README.md (for GitHub repo)
- [ ] `P-031` Clean up repo (remove dead code, add comments where needed)
- [ ] `P-032` Fill out Colosseum submission form
- [ ] `P-033` Verify all links work (demo, video, repo, deployed frontend)
- [ ] `P-034` Submit on Colosseum platform
- **Deadline**: May 11, 2026
- **Depends on**: Everything

---

## Track 6: Stretch Goals (If Time Permits)

Ordered by impact-to-effort ratio for hackathon judging:

- [ ] `S-001` **Solana Blinks** — Shareable "Join this consórcio" link that works in any Blink-compatible wallet. High wow factor for demo.
- [ ] `S-002` **Lottery animation** — Satisfying VRF reveal animation (wheel spin, card flip). Makes the demo memorable.
- [ ] `S-003` **Bid mechanism (Lance)** — Track B selection via sealed bids. Adds depth to the protocol.
- [ ] `S-004` **Tranche disbursement** — 50/25/25 release schedule. Shows we thought about default risk seriously.
- [ ] `S-005` **Notification integration** — Dialect or Notifi for payment reminders and selection alerts.
- [ ] `S-006` **Yield on idle funds** — Deposit insurance pool into Marinade/Kamino. Shows composability.
- [ ] `S-007` **Basic reputation display** — Show on-chain track record on profile page.

---

## Dependency Graph (Critical Path)

```
B-001 (scaffold)
  │
  ├── B-010/011/012 (state accounts)
  │     │
  │     ├── B-020/021/022/023 (create/join/leave/activate)
  │     │     │
  │     │     ├── B-030/031/032/033 (payment & round logic)
  │     │     │     │
  │     │     │     ├── B-040/041/042/043 (VRF integration)  ← HIGHEST RISK
  │     │     │     │     │
  │     │     │     │     └── B-034/035 (distribute/claim)
  │     │     │     │           │
  │     │     │     │           └── B-050/051/052/053 (completion)
  │     │     │     │                 │
  │     │     │     │                 └── T-010/011 (integration tests)
  │     │     │     │                       │
  │     │     │     │                       └── I-010/011 (seed scripts)
  │     │     │     │                             │
  │     │     │     │                             └── P-010/011 (demo prep)
  │     │     │     │                                   │
  │     │     │     │                                   └── P-020 (video) → P-034 (submit)
  │     │     │     │
  │     │     │     └── B-033 (defaults) → B-063/064 (edge cases)
  │     │     │
  │     │     └── F-004 (IDL client) → F-030/031 (hooks) → F-010..014 (pages)
  │     │
  │     └── T-001..006 (unit tests, parallel with instructions)
  │
  └── F-001..003 (frontend scaffold, parallel with backend)

CRITICAL PATH: B-001 → B-010 → B-020 → B-030 → B-041 → B-034 → B-050 → T-011 → I-010 → P-010 → P-020 → P-034
```

### Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| R1 | VRF integration harder than expected | High | High | Start VRF research Day 1. If Switchboard is too complex, fall back to commit-reveal scheme using block hashes (less secure but functional for demo). |
| R2 | Account size limits (Solana 10KB max) | Medium | Medium | Calculate space early (B-010). If group size exceeds limits, use realloc or separate accounts. |
| R3 | Frontend-program integration bugs | High | Medium | Generate IDL client early. Test with simple calls before building full UI. |
| R4 | Devnet instability during demo | Medium | High | Record backup demo video (P-013). Have seed scripts ready to quickly recreate state. |
| R5 | Scope creep (adding stretch goals too early) | High | High | Strictly follow MVP first. No stretch goals until all MVP tasks are complete. |
| R6 | Solo dev burnout | Medium | High | Plan rest days. Stick to WBS priorities. Cut scope rather than crunch. |

---

## Daily Cadence

```
Each day:
  1. Check WBS — what's the next unchecked item on the critical path?
  2. Work on critical path items first, then parallel track items
  3. Mark completed items as [x]
  4. If blocked, note the blocker and switch to a parallel task
  5. Commit working code at end of day — never go to bed with uncommitted work
```

---

## Week-by-Week Milestones

### Week 1 (Apr 6-13) — "It compiles"
**Goal**: Program scaffold + all state accounts + create/join/activate instructions + first unit tests.
- Milestone: Can create a group and have members join on devnet.

### Week 2 (Apr 14-20) — "It works"
**Goal**: Payment flow + VRF lottery + distribution + default handling.
- Milestone: Can run a complete round (pay → select → distribute) on devnet.

### Week 3 (Apr 21-27) — "It looks good"
**Goal**: Frontend scaffold + all core pages + program integration.
- Milestone: Can do the full flow from the browser with a wallet.

### Week 4 (Apr 28 - May 4) — "It's solid"
**Goal**: Integration tests + seed scripts + UX polish + edge case handling.
- Milestone: Demo-ready product with realistic data.

### Week 5 (May 5-11) — "Ship it"
**Goal**: Pitch deck + demo recording + video + submission.
- Milestone: Submitted on Colosseum before May 11.
