# Poolver - Decentralized Consorcio Protocol on Solana

## Design Document v0.1 — Global Solana Hackathon

---

## 1. What Is a Consorcio?

A **consorcio** (consórcio) is a Brazilian financial mechanism where a group of N participants pool monthly contributions to collectively fund high-value purchases (cars, houses, motorcycles, etc.). Each month, one member is selected to receive the full pool amount, enabling them to make the purchase immediately rather than saving for years. The selected member continues paying monthly until the consorcio ends.

Globally, this model is known as a **ROSCA** (Rotating Savings and Credit Association) and represents a **$500B+** market across Latin America, Africa, South/Southeast Asia, and the Middle East.

### Traditional Flow

```
Month 1:  [A, B, C, D, E] each pay $1000 → Pool = $5000 → A is selected → A receives $5000
Month 2:  [A, B, C, D, E] each pay $1000 → Pool = $5000 → D is selected → D receives $5000
Month 3:  [A, B, C, D, E] each pay $1000 → Pool = $5000 → B is selected → B receives $5000
...
Month 5:  [A, B, C, D, E] each pay $1000 → Pool = $5000 → last remaining → done
```

Everyone pays N * monthly_amount total. Everyone receives N * monthly_amount once. The value proposition is **time** — you get the full amount before finishing all payments.

### Brazilian Consorcio Has Two Selection Mechanisms

1. **Sorteio (Lottery)** — Random selection among eligible members who haven't received yet.
2. **Lance (Bid)** — Members can bid a percentage of the remaining balance they're willing to pay upfront. Highest bidder wins. This creates a natural auction/market mechanism.

> In traditional consórcios, both happen each month: one winner by lottery, one by bid.

---

## 2. Why Decentralize This?

### Problems with Traditional Consórcios

| Problem | Description |
|---------|-------------|
| **Intermediary fees** | Traditional consórcio companies (administradoras) charge 10-20% admin fees over the total value |
| **Opaque selection** | Members trust the company to run a fair lottery — but have no way to verify |
| **Geographic lock** | Only available in Brazil, regulated by BACEN, requires CPF (Brazilian tax ID) |
| **Slow processes** | Paper-heavy, bureaucratic, months to set up |
| **Limited asset types** | Typically restricted to cars, houses, motorcycles — predefined categories |
| **No composability** | Can't combine with other financial tools (yield, insurance, credit scoring) |

### What Blockchain Solves

| Benefit | How |
|---------|-----|
| **Verifiable fairness** | On-chain VRF (Verifiable Random Function) makes lottery provably fair |
| **Transparent pools** | Anyone can audit the pool balance, payment history, and selection history |
| **Global access** | Anyone with a wallet can join — no CPF, no geographic restriction |
| **Programmable rules** | Smart contract enforces all rules — no admin discretion |
| **Composable** | Pool funds can earn yield while idle; integrate with DeFi primitives |
| **Lower fees** | No admin company needed — just protocol fees (1-3% vs 10-20%) |
| **Instant settlement** | Solana finality means winners receive funds in seconds, not days |

### Why Solana Specifically

- **Sub-cent transaction fees** — critical for monthly recurring payments
- **400ms finality** — instant pool distribution
- **Switchboard / Pyth VRF** — native verifiable randomness for fair selection
- **SPL Token standard** — easy stablecoin (USDC) integration
- **Blinks / Actions** — shareable links to join a consórcio from any interface
- **Mobile-first ecosystem** — Solana Mobile, Saga phone, aligned with target demographic

---

## 3. Protocol Design

### 3.1 Core Concepts

```
ConsorcioGroup {
    id: PublicKey,
    creator: PublicKey,
    asset_description: String,       // "Car", "House", "General savings"
    monthly_contribution: u64,       // in USDC (6 decimals)
    total_members: u8,               // N (e.g., 10, 20, 50)
    current_members: u8,
    duration_months: u8,             // = total_members
    current_month: u8,
    status: enum { Forming, Active, Completed, Cancelled },
    collateral_bps: u16,             // required collateral in basis points
    insurance_pool_bps: u16,         // % of contribution going to insurance
    bid_enabled: bool,               // whether lance/bid mechanism is active
    payment_window_days: u8,         // days to make monthly payment
    vault: PublicKey,                 // PDA holding pool funds
    insurance_vault: PublicKey,      // PDA holding insurance funds
}

Member {
    wallet: PublicKey,
    group: PublicKey,
    collateral_deposited: u64,
    payments_made: u8,
    payments_missed: u8,
    has_received: bool,
    received_month: Option<u8>,
    status: enum { Active, Defaulted, Withdrawn },
    reputation_score: u16,
}

Round {
    group: PublicKey,
    month: u8,
    total_collected: u64,
    lottery_winner: Option<PublicKey>,
    bid_winner: Option<PublicKey>,
    bid_amount: Option<u64>,
    vrf_proof: [u8; 64],
    status: enum { Collecting, Selecting, Distributing, Completed },
}
```

### 3.2 Lifecycle

```
┌─────────────┐     all slots filled      ┌──────────┐
│   FORMING   │ ────────────────────────►  │  ACTIVE  │
│  (join pool) │                           │ (monthly  │
└─────────────┘                            │  rounds)  │
                                           └────┬─────┘
                                                │
                              all members received
                                                │
                                           ┌────▼─────┐
                                           │ COMPLETED │
                                           └──────────┘
```

**Phase 1: Formation**
- Creator defines parameters (contribution amount, group size, collateral %, etc.)
- Members join by depositing collateral + first month's payment
- Group activates when all slots are filled (or min threshold reached)

**Phase 2: Monthly Rounds**
1. **Collection window** (days 1-7): Members submit monthly payments
2. **Grace period** (days 8-10): Late payment window with penalty fee
3. **Default marking** (day 11): Non-payers flagged, collateral partially slashed
4. **Selection** (day 12): VRF lottery + bid resolution
5. **Distribution** (day 12): Winner receives pool minus insurance allocation

**Phase 3: Completion**
- Final round distributes to last remaining member
- Collateral returned to all non-defaulted members
- Insurance pool surplus distributed proportionally

### 3.3 Selection Mechanism — Dual Track

Each round has TWO potential disbursements (configurable):

**Track A — Lottery (Sorteio)**
- Switchboard VRF generates verifiable random number
- Eligible set = members who haven't received AND are not in default
- Random selection weighted equally among eligible members
- Winner receives: `(active_members * monthly_contribution) - insurance_allocation`

**Track B — Bid (Lance)**
- During collection window, members can submit sealed bids
- Bid = amount they're willing to pay ON TOP of their regular contribution
- Highest bidder wins Track B disbursement
- Bid amount is deducted from their remaining balance (they owe less in future months)
- If no bids, Track B amount rolls into next month or goes to insurance

> **Hackathon MVP**: Start with lottery only (Track A). Add bidding in v2.

### 3.4 Collateral & Default Protection

This is THE critical design challenge. The whole value of a consórcio is that participants DON'T have the full amount. Over-collateralization defeats the purpose.

#### Layered Defense Model

```
Layer 1: Upfront Collateral (10-25% of total obligation)
    └── Deposited on join
    └── Slashed on default
    └── Returned on completion

Layer 2: Insurance Pool (2-5% of each monthly payment)
    └── Funded by all members every month
    └── Covers shortfall from defaults
    └── Surplus returned at end

Layer 3: Progressive Lockup (post-receipt)
    └── After receiving the pool, member's collateral requirement INCREASES
    └── Additional collateral locked from future payment obligations
    └── Creates stronger incentive to continue paying

Layer 4: Reputation System (cross-consorcio)
    └── On-chain history of completed/defaulted consórcios
    └── Higher reputation = lower collateral requirements
    └── Lower reputation = higher collateral or exclusion

Layer 5: Social Staking (optional)
    └── Other members can vouch/stake for a participant
    └── Voucher's stake is slashed if the participant defaults
    └── Creates social accountability layer
```

#### What Happens on Default

```
Member misses payment
    │
    ├── Grace period (3 days, 5% late fee)
    │
    ├── If still unpaid after grace:
    │   ├── 1st offense: Warning + 10% collateral slash
    │   ├── 2nd offense: 25% collateral slash + reputation hit
    │   └── 3rd offense: Full default
    │       ├── All remaining collateral seized
    │       ├── Removed from eligible pool
    │       ├── Insurance pool covers their obligation
    │       ├── Reputation score zeroed
    │       └── If post-receipt: legal/recovery process (off-chain)
    │
    └── If member has NOT received pool yet:
        └── Can voluntarily withdraw
            ├── Receives: payments made - penalties - insurance contribution
            └── Forfeits: collateral (partial or full based on timing)
```

#### The "Receive and Run" Problem

The single biggest risk: Member A receives the pool in Month 1 ($50,000), then stops paying the remaining 49 months.

**Mitigations:**

1. **Collateral math**: If collateral is 20% of total obligation, and the member defaults immediately, the group loses 80%. This is why collateral alone is insufficient.

2. **Delayed full disbursement**: Instead of giving the full pool at once, release in tranches:
   - 50% immediately on selection
   - 25% after 3 more on-time payments
   - 25% after 6 more on-time payments
   - This reduces max loss exposure significantly

3. **Escrow-to-merchant model** (v2): For specific purchases (cars, etc.), the smart contract pays the merchant directly. The member gets the asset but never touches the cash. This mirrors how traditional consórcios work — the administradora pays the dealership.

4. **Stablecoin yield buffer**: Idle pool funds generate yield (via Marinade, Solend, etc.). This yield builds a buffer that helps absorb default losses.

5. **Insurance pool sizing**: With a 5% insurance allocation on a 20-person pool running 20 months, the insurance pool accumulates significantly — enough to cover 1-2 full defaults.

6. **Late-round priority for new members**: First-time members (no reputation) are weighted toward later rounds in the lottery. They build payment history before becoming eligible for early selection. Reputation holders get equal/early weighting.

---

## 4. Economic Model

### Fee Structure

| Fee | Amount | Recipient |
|-----|--------|-----------|
| Protocol fee | 1-2% of pool distribution | Protocol treasury |
| Late payment penalty | 5% of missed amount | Insurance pool |
| Default slash | 10-100% of collateral | Insurance pool |
| Bid premium | Variable (bid amount) | Reduces bidder's future payments |
| Early withdrawal fee | 5-15% of payments made | Insurance pool |

### Yield Strategy

While funds sit in the pool vault waiting for distribution, they can generate yield:

```
Monthly contributions deposited
    │
    ├── Immediate need (next distribution): kept liquid in USDC
    │
    └── Insurance pool + excess: deposited into
        ├── Marinade Finance (mSOL) — liquid staking
        ├── Solend/Kamino — lending protocols
        └── Or simply held in USDC for safety (hackathon MVP)

Yield distribution:
    ├── 50% → Insurance pool buffer
    ├── 30% → Distributed to members at completion
    └── 20% → Protocol treasury
```

> **Hackathon MVP**: Skip yield. Just hold USDC in vault PDA.

### Token Economics (Future — Post-Hackathon)

A protocol token could serve multiple purposes:
- **Governance**: Vote on protocol parameters (fees, collateral ratios)
- **Staking**: Stake to reduce collateral requirements
- **Insurance backstop**: Token holders can stake as last-resort insurance (earning yield from insurance premiums)
- **Fee discounts**: Pay protocol fees in token at a discount

> **Hackathon**: No token. Focus on the core product. Tokens can come later if traction justifies it.

---

## 5. Edge Cases & Risk Analysis

### 5.1 Pool Formation Edge Cases

| Edge Case | Risk | Mitigation |
|-----------|------|------------|
| Pool never fills | Members stuck with locked collateral | Timeout: if pool doesn't fill in X days, auto-refund all deposits |
| Creator abandons pool | Orphaned group | Creator has no special privileges after creation. Pool is self-executing. |
| Sybil attack (1 person, many wallets) | Manipulate lottery odds | Require minimum collateral per slot. Economic cost makes sybil expensive. Future: add identity layer (Civic, World ID) |
| Whale fills all but one slot | Controls the group | Cap max slots per wallet (e.g., 1 per group). Can be enforced on-chain. |
| Dust amounts | Gas costs exceed pool value | Minimum contribution threshold (e.g., 10 USDC/month minimum) |

### 5.2 Active Round Edge Cases

| Edge Case | Risk | Mitigation |
|-----------|------|------------|
| ALL members default in one month | Pool receives $0 | Insurance pool covers. If insurance exhausted, group enters emergency state — extends duration or reduces future payouts proportionally. |
| Majority default (>50%) | Pool unviable | Trigger dissolution: remaining members receive pro-rata from insurance + remaining collateral. |
| VRF fails / Solana downtime | No selection possible | Retry window (48h). If still failing, manual crank by any member triggers selection when network recovers. |
| Member is selected but wallet is compromised | Funds sent to attacker | Selection notifies member; 24h claim window. If unclaimed, funds roll to next month and member re-enters eligible pool. |
| Stablecoin depeg (USDC loses peg) | Pool value drops | Accept multiple stablecoins, allow group to vote on rebase. For hackathon: accept the USDC risk. |
| Front-running VRF | Attacker predicts/influences randomness | Switchboard VRF is commit-reveal; not front-runnable. Selection in same tx as VRF callback. |
| Bidding wars (Track B) | Overbidding makes it a bad deal | Cap maximum bid at 50% of remaining obligation. Show effective interest rate to bidders. |
| Member wants to transfer slot | Slot trading/selling | Allow slot transfer to another wallet (with group approval or cooldown). Transfer resets reputation for new holder. |

### 5.3 Post-Receipt Edge Cases

| Edge Case | Risk | Mitigation |
|-----------|------|------------|
| "Receive and run" (detailed above) | Largest financial risk | Tranche releases + collateral + insurance + reputation |
| Member dies / loses keys | Permanent default | Designate backup wallet on join. After X missed payments with no activity, collateral is seized and insurance covers remainder. |
| Member overpays (sends too much) | Excess funds stuck | Auto-refund excess in same transaction |
| Member pays to wrong group | Funds lost | PDA-derived payment addresses are group-specific. Payments to wrong PDA simply fail (wrong seeds). |

### 5.4 Completion Edge Cases

| Edge Case | Risk | Mitigation |
|-----------|------|------------|
| Insurance pool has large surplus | Who gets it? | Pro-rata distribution to all non-defaulted members |
| Insurance pool is depleted | Shortfall at end | Last member(s) receive less. Protocol could backstop with treasury. |
| Group has odd number after defaults | Math doesn't work out cleanly | Remaining members split any fractional amounts. Dust goes to insurance. |
| Collateral asset (SOL) changed in value | Collateral worth less/more than expected | Collateral denominated in USDC (same as contributions). No price risk. |

### 5.5 Game Theory Concerns

**Rational Default Timing**: A member who receives the pool in month 1 has maximum incentive to default (owes N-1 more payments). A member receiving in the last month has zero incentive to default (already paid everything).

→ This creates an asymmetric risk profile. Mitigations:
- Tranche releases (section 3.4)
- Higher collateral for early-round recipients
- Dynamic collateral: `required_collateral = base_collateral * (remaining_months / total_months)`

**Collusion**: If members collude, they could all join a pool, have one member receive, then all default together.

→ Mitigation: Collateral from ALL members would be seized. Net loss for the group. Only profitable if one member keeps the pool and compensates others off-chain — but then they're just paying for the money with extra steps (and losing collateral).

**Adverse Selection**: High-risk individuals are more attracted to consórcios (they need money now). Low-risk individuals prefer traditional savings.

→ Mitigation: Reputation system creates segmented pools. "Blue chip" pools with experienced members charge lower collateral. New member pools charge higher collateral.

---

## 6. Technical Architecture

### 6.1 Program Structure (Anchor)

```
programs/poolver/
├── src/
│   ├── lib.rs                    // Program entrypoint
│   ├── instructions/
│   │   ├── create_group.rs       // Initialize a new consorcio group
│   │   ├── join_group.rs         // Member joins with collateral
│   │   ├── make_payment.rs       // Monthly contribution
│   │   ├── submit_bid.rs         // Lance/bid submission
│   │   ├── request_randomness.rs // Trigger VRF for lottery
│   │   ├── resolve_round.rs      // Process selection + distribution
│   │   ├── claim_distribution.rs // Winner claims their funds
│   │   ├── mark_default.rs       // Flag non-payer + slash collateral
│   │   ├── withdraw.rs           // Early exit (pre-receipt only)
│   │   └── close_group.rs        // Finalize completed group
│   ├── state/
│   │   ├── group.rs              // ConsorcioGroup account
│   │   ├── member.rs             // Member account (PDA per group+wallet)
│   │   └── round.rs              // Round account (PDA per group+month)
│   ├── errors.rs                 // Custom error codes
│   └── events.rs                 // Anchor events for indexing
```

### 6.2 Key PDAs

```
Group Vault:     seeds = ["vault", group_id]
Insurance Vault: seeds = ["insurance", group_id]
Member Account:  seeds = ["member", group_id, wallet]
Round Account:   seeds = ["round", group_id, month_number]
Reputation:      seeds = ["reputation", wallet]  // global, cross-group
```

### 6.3 External Integrations

| Integration | Purpose | Priority |
|-------------|---------|----------|
| **Switchboard VRF** | Verifiable randomness for lottery | P0 (hackathon) |
| **USDC (SPL Token)** | Stable payment denomination | P0 (hackathon) |
| **Clockwork/Automation** | Trigger round transitions on schedule | P1 (nice-to-have for hackathon) |
| **Civic / World ID** | Sybil resistance via identity | P2 (post-hackathon) |
| **Marinade / Solend** | Yield on idle funds | P2 (post-hackathon) |
| **Dialect / Notifi** | On-chain notifications (payment due, selection) | P1 |
| **Solana Blinks** | Shareable join/pay links | P1 (great for demo) |

### 6.4 Frontend

```
app/
├── src/
│   ├── pages/
│   │   ├── Home.tsx              // Browse/create groups
│   │   ├── Group.tsx             // Group detail + round status
│   │   ├── Dashboard.tsx         // Member's active groups
│   │   └── Profile.tsx           // Reputation + history
│   ├── components/
│   │   ├── GroupCard.tsx          // Pool summary card
│   │   ├── RoundTimeline.tsx     // Visual round progress
│   │   ├── PaymentModal.tsx      // Make monthly payment
│   │   ├── BidModal.tsx          // Submit lance/bid
│   │   └── MemberList.tsx        // Group members + status
│   └── hooks/
│       ├── usePoolver.ts          // Program interaction hooks
│       └── useVRF.ts             // VRF integration
```

---

## 7. Hackathon Scope — MVP Definition

### Must Have (Demo Day)

- [ ] Create a consorcio group (set contribution, size, collateral %)
- [ ] Join a group (deposit collateral + first payment in USDC)
- [ ] Make monthly payments
- [ ] VRF-based lottery selection (Switchboard)
- [ ] Distribute pool to winner
- [ ] Basic default handling (miss payment → flag → slash collateral)
- [ ] Simple frontend showing group status, round progress, member list
- [ ] Devnet deployment with test USDC

### Nice to Have

- [ ] Bid/lance mechanism (Track B)
- [ ] Tranche-based disbursement
- [ ] Reputation system (cross-group)
- [ ] Solana Blinks for joining/paying
- [ ] Automated round transitions (Clockwork)
- [ ] Notification system (payment reminders)

### Post-Hackathon

- [ ] Yield generation on idle funds
- [ ] Identity/sybil resistance (Civic, World ID)
- [ ] Escrow-to-merchant model
- [ ] Multi-stablecoin support
- [ ] Protocol token + governance
- [ ] Mobile app (Solana Mobile SDK)
- [ ] Fiat on-ramp integration (Pix → USDC → Poolver)

---

## 8. Differentiators for Judging

1. **Real-world problem, massive TAM**: $500B+ ROSCA market, 10M+ active consórcio participants in Brazil alone. This isn't a toy DeFi primitive — it's a proven financial mechanism being brought on-chain.

2. **Novel on Solana**: No existing consórcio/ROSCA protocol on Solana. First mover.

3. **Verifiable fairness**: VRF-based selection is a tangible, demonstrable improvement over opaque traditional lotteries. Great for live demo.

4. **Cultural bridge**: Brings a Latin American financial innovation to the global crypto audience. Judges love projects that serve underbanked populations.

5. **Composable DeFi primitive**: A consórcio pool is essentially a new DeFi building block — it can plug into yield, insurance, credit scoring, and identity protocols.

6. **Clear path to revenue**: Protocol fee on distributions. Not speculation-dependent.

---

## 9. Naming & Branding

**Poolver** — a portmanteau of **Pool** + **Solver**, decentralized consórcio on Solana.

Tagline ideas:
- "Collective purchasing power, on-chain."
- "The world's savings circle, powered by Solana."
- "Buy together. Verified fair. Trustlessly."

---

## 10. Open Questions

1. **Collateral ratio**: What's the sweet spot? Too high = barrier to entry (defeats purpose). Too low = default risk. Need simulation/modeling.

2. **Minimum group size**: Smaller groups (5-10) are easier to fill but have higher per-member default impact. Larger groups (20-50) spread risk but take longer to fill.

3. **Round timing**: Monthly mirrors traditional consórcios, but on-chain we could do weekly or biweekly. Shorter cycles = faster value delivery but more tx overhead.

4. **Legal wrapper**: Even for hackathon, worth mentioning awareness of regulatory landscape. Consórcios are regulated by BACEN in Brazil. A decentralized version may or may not fall under the same rules. For global launch, each jurisdiction differs.

5. **Tranche release UX**: Receiving 50% immediately is less exciting than 100%. How do we frame this so it feels like a feature (safety) not a limitation?

6. **What if nobody bids?**: Track B produces no winner. Options: roll funds, give second lottery winner, or skip. Need to decide.

7. **Upgradability**: Anchor programs can be upgraded. Should the protocol be immutable or upgradeable with multisig governance?
