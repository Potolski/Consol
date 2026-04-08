<div align="center">

# Consol

### Decentralized Consórcio Protocol on Solana

[![Built on Solana](https://img.shields.io/badge/Built%20on-Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com)
[![Anchor Framework](https://img.shields.io/badge/Anchor-Framework-1E88E5?style=for-the-badge)](https://www.anchor-lang.com)
[![USDC](https://img.shields.io/badge/Payments-USDC-2775CA?style=for-the-badge)](https://www.circle.com/usdc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Solana Frontier Hackathon](https://img.shields.io/badge/Solana-Frontier%20Hackathon%202026-14F195?style=for-the-badge&logo=solana&logoColor=black)](https://colosseum.com/frontier)

<br />

**Consol** brings the Brazilian *consórcio* — a proven collective purchasing model used by millions — to the Solana blockchain. Transparent pools, verifiable fair selection, minimal fees.

[Explore the Docs](docs/DESIGN.md) · [View Demo](#demo) · [Hackathon Submission](https://colosseum.com/frontier)

</div>

---

## The Problem

A **consórcio** is a group purchasing system where members pool monthly payments and each month one member receives the full amount to buy a high-value asset (car, house, etc.). Globally known as a **ROSCA** (Rotating Savings and Credit Association), this model moves **$500B+ annually** across Latin America, Africa, and Asia.

Traditional consórcios suffer from:

- **10-20% administrative fees** charged by intermediary companies
- **Opaque lottery selection** — members trust the company blindly
- **Geographic restrictions** — only available in specific countries
- **Slow, bureaucratic processes** — weeks to set up, paper-heavy

## The Solution

Consol is a decentralized protocol that replaces the intermediary with a Solana smart contract:

- **Verifiable fairness** — VRF-powered lottery that anyone can audit
- **Transparent pools** — all funds, payments, and selections are on-chain
- **Global access** — anyone with a Solana wallet can participate
- **Low fees** — protocol fees of 1-2% vs. the traditional 10-20%
- **Instant settlement** — winners receive funds in seconds, not days

## How It Works

```
1. CREATE   →  A group is created with defined contribution amount and size
2. JOIN     →  Members join by depositing collateral + first payment (USDC)
3. PAY      →  Every round, members contribute to the pool
4. SELECT   →  VRF lottery picks a winner from eligible members
5. RECEIVE  →  Winner gets the full pool to make their purchase
6. REPEAT   →  Until every member has received — then collateral is returned
```

## Architecture

```
┌──────────────────────────────────────────────┐
│                   Frontend                    │
│          Next.js · Wallet Adapter             │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│              Consol Program                   │
│   Anchor · Solana · SPL Token · VRF          │
├───────────────────────────────────────────────┤
│  create_group · join_group · make_payment     │
│  request_randomness · distribute · defaults   │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│             Solana Devnet                     │
│         USDC · Switchboard VRF               │
└──────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Solana (Devnet) |
| Smart Contract | Anchor Framework (Rust) |
| Randomness | Switchboard VRF |
| Payments | USDC (SPL Token) |
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Wallet | Solana Wallet Adapter |

## Getting Started

### Prerequisites

- [Rust](https://rustup.rs/) (1.75+)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (1.18+)
- [Anchor](https://www.anchor-lang.com/docs/installation) (0.30+)
- [Node.js](https://nodejs.org/) (18+)

### Build & Test

```bash
# Clone the repo
git clone https://github.com/your-username/consol.git
cd consol

# Build the program
anchor build

# Run tests
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

### Frontend

```bash
cd app
npm install
npm run dev
```

## Documentation

- [Protocol Design](docs/DESIGN.md) — Full protocol specification, economic model, and edge case analysis
- [Work Breakdown Structure](docs/WBS.md) — Hackathon development plan and task tracking

## Roadmap

- [x] Protocol design & architecture
- [ ] Core smart contract (create, join, pay, select, distribute)
- [ ] VRF integration for verifiable lottery
- [ ] Default protection & collateral system
- [ ] Frontend with wallet integration
- [ ] Devnet deployment & demo
- [ ] Bid mechanism (lance)
- [ ] Yield generation on idle funds
- [ ] Reputation system
- [ ] Mainnet launch

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built for the [Solana Frontier Hackathon 2026](https://colosseum.com/frontier) by the Consol team.

</div>
