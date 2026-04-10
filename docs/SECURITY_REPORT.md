# Security Audit Report — Consol (Solana Consorcio Protocol)

**Date**: 2026-04-10
**Auditor**: Claude (AI-assisted review)
**Scope**: Full program source (`programs/consol/src/`) + frontend providers

---

## Priority-Ordered Findings

### 1. [HIGH] Distribute Round State Mismatch — Funds-Locking Bug
**File**: `distribute.rs:22`
`distribute` requires `round.status == RoundStatus::Selecting`, but `resolve_round` sets status to `RoundStatus::Distributing`. After a winner is selected, `distribute` can never execute — the pool is permanently locked.
**Fix**: Change constraint to `round.status == RoundStatus::Distributing`.

### 2. [HIGH] Caller-Controlled Eligible Member List in `resolve_round`
**File**: `resolve_round.rs:63-84`
The caller chooses which members to pass via `remaining_accounts`. A malicious caller can omit eligible members to guarantee they win the lottery (pass only themselves = 100% win).
**Fix**: Verify the count of eligible members passed matches `group.active_members - group.members_received`.

### 3. [HIGH] Mark Default: No Guard Against Double-Marking Per Round
**File**: `mark_default.rs:65-67`
No check prevents `mark_default` from being called multiple times for the same member in the same round. A crank caller can default a member in one round by calling 3 times, slashing all collateral.
**Fix**: Add `last_default_round: u8` to `Member` and check it.

### 4. [HIGH] VRF Randomness Timing Check Too Strict
**File**: `switchboard.rs:63-66`
`get_value()` requires `reveal_slot == clock_slot` (exact slot match). If reveal and resolve land in different slots (very common), this always fails.
**Fix**: Change to `self.reveal_slot > 0` or `self.reveal_slot <= clock_slot`.

### 5. [HIGH] Protocol Fee Retained in Vault — No Withdrawal Mechanism
**File**: `distribute.rs:67-76`
Protocol fee is subtracted from distribution but stays in vault forever. No instruction exists to withdraw it. Fees accumulate and leak into collateral returns.
**Fix**: Add `protocol_treasury` account and transfer fees during distribution.

### 6. [HIGH] Double-Pay Prevention Logic is Fragile
**File**: `make_payment.rs:73-81`
The `last_paid_round` / `current_round + 1` marker system is confusing and error-prone. While it technically works for most cases, the logic is brittle.
**Fix**: Simplify to a clean boolean check pattern.

### 7. [MEDIUM] Insurance Distribution: Same Member Can Drain Vault
**File**: `distribute_insurance.rs`
No flag prevents the same member from calling multiple times. Each call decrements `active_members` and gives progressively larger shares. One member can drain the entire insurance vault.
**Fix**: Add `insurance_claimed: bool` to `Member`.

### 8. [MEDIUM] Insurance Distribution Rounding — Dust Lockup
**File**: `distribute_insurance.rs:58-61`
Integer division truncation means dust tokens can be permanently locked.
**Fix**: Give last claimant the remaining balance instead of `balance / 1`.

### 9. [MEDIUM] `skip_round` Weak Eligibility Check
**File**: `skip_round.rs:41`
`total_collected == 0` conflates "nobody can pay" with "nobody has paid yet." Round can be skipped prematurely.
**Fix**: Require round to be in `Selecting` status (already enforced) AND verify no eligible unreceived active members exist.

### 10. [MEDIUM] `ActivateGroup` Has No Creator-Only Access Control
**File**: `activate_group.rs:9`
Any wallet can activate the group. Could race the creator.
**Fix**: Add `constraint = caller.key() == group.creator`.

### 11. [LOW] `token_program` Passed as `key()` Instead of `to_account_info()`
**Files**: `join_group.rs:75`, `leave_group.rs:67`, `make_payment.rs:127`
CPI context receives wrong type for token_program.
**Fix**: Change `.key()` to `.to_account_info()`.

### 12. [LOW] No Mint Decimals Validation
**File**: `create_group.rs`
Any SPL token mint is accepted. Non-6-decimal tokens break the `MIN_CONTRIBUTION` semantics.
**Fix**: Validate `mint.decimals == 6` or make minimum dynamic.

### 13. [LOW] `received_round` Ambiguity
**File**: `member.rs:19`
`received_round: u8` with `0 = hasn't received` collides with 0-indexed rounds.
**Fix**: Rely solely on `has_received` bool, or use `Option<u8>`.

### 14. [LOW] Integer Truncation in Collateral Calculation
**File**: `join_group.rs:64-71`
`as u64` cast from `u128` can silently truncate.
**Fix**: Use `.try_into().map_err(...)`.

### 15. [INFO] No Event for Insurance Distribution
**File**: `distribute_insurance.rs`
No event emitted, harder to audit on-chain.

### 16. [INFO] No Program Upgrade Authority Management
No discussion of upgrade authority. Consider multisig or immutable after audit.

### 17. [INFO] `description` Field — No Runtime Length Check
**File**: `create_group.rs`
`#[max_len(64)]` is for space only; no runtime validation of string length.

---

## Fix Status Tracker

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | HIGH | Distribute state mismatch | FIXED |
| 2 | HIGH | Manipulable lottery | FIXED |
| 3 | HIGH | Double-default per round | FIXED |
| 4 | HIGH | VRF timing too strict | FIXED |
| 5 | HIGH | Protocol fee black hole | FIXED |
| 6 | HIGH | Fragile double-pay logic | FIXED |
| 7 | MEDIUM | Insurance drain | FIXED |
| 8 | MEDIUM | Insurance rounding dust | FIXED |
| 9 | MEDIUM | skip_round weak check | FIXED |
| 10 | MEDIUM | activate_group no ACL | FIXED |
| 11 | LOW | token_program wrong type | FIXED |
| 12 | LOW | No mint decimals check | FIXED |
| 13 | LOW | received_round ambiguity | FIXED |
| 14 | LOW | Collateral truncation | FIXED |
| 15 | INFO | No insurance event | FIXED |
| 16 | INFO | Upgrade authority | N/A (operational) |
| 17 | INFO | Description length | FIXED |
