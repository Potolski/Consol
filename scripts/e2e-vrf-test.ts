/**
 * End-to-End VRF Test on Devnet
 *
 * Full lifecycle: create_group → join (3 members) → activate → start_round
 *   → make_payment (×3) → close_collection → commit_round (VRF) → resolve_round → distribute
 *
 * Usage:  npx tsx scripts/e2e-vrf-test.ts
 * Requires: deploy-keypair.json (mint authority + deployer)
 */

import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, BN, web3 } from "@coral-xyz/anchor";
import {
  PublicKey,
  Keypair,
  Connection,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";

// ─── Config ──────────────────────────────────────────────────────
const PROGRAM_ID = new PublicKey("Fz4KqVayYMmRyToZxJzErd9qRsnh8Bdq84yicvhv4114");
const USDC_MINT = new PublicKey("27GAbtwSgLHi53dhfTfika5jKjjSn38uEVpP29ki9nDw");
const RPC_URL = "https://api.devnet.solana.com";
const SWITCHBOARD_QUEUE = new PublicKey("FfD96yeXs4cxZshoPPSKhSPgVQxLAJUT3gefgh84m1Di");

// Seeds (must match program constants)
const GROUP_SEED = Buffer.from("group");
const MEMBER_SEED = Buffer.from("member");
const ROUND_SEED = Buffer.from("round");
const VAULT_SEED = Buffer.from("vault");
const INSURANCE_SEED = Buffer.from("insurance");
const TREASURY_SEED = Buffer.from("treasury");

// Group params
const MONTHLY_CONTRIBUTION = 10_000_000; // 10 USDC
const TOTAL_MEMBERS = 3;
const COLLATERAL_BPS = 2000; // 20%
const INSURANCE_BPS = 300; // 3%

// ─── Helpers ─────────────────────────────────────────────────────
function loadKeypair(filePath: string): Keypair {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return Keypair.fromSecretKey(Uint8Array.from(raw));
}

function findPDA(seeds: Buffer[], programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(seeds, programId);
}

async function airdropSol(connection: Connection, pubkey: PublicKey, sol: number) {
  try {
    const sig = await connection.requestAirdrop(pubkey, sol * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(sig, "confirmed");
    console.log(`  Airdropped ${sol} SOL to ${pubkey.toBase58().slice(0, 8)}...`);
  } catch {
    console.log(`  Airdrop failed for ${pubkey.toBase58().slice(0, 8)}... (rate limited, continuing)`);
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(step: string, detail?: string) {
  const prefix = `[${new Date().toISOString().slice(11, 19)}]`;
  console.log(`${prefix} ${step}${detail ? ` — ${detail}` : ""}`);
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  console.log("\n═══════════════════════════════════════════");
  console.log("  Consol E2E VRF Test — Devnet");
  console.log("═══════════════════════════════════════════\n");

  // Setup connection + deployer wallet
  const connection = new Connection(RPC_URL, "confirmed");
  const deployerKp = loadKeypair(path.resolve(__dirname, "../deploy-keypair.json"));
  const deployer = deployerKp;
  log("Setup", `Deployer: ${deployer.publicKey.toBase58()}`);

  // Load IDL
  const idlPath = path.resolve(__dirname, "../target/idl/consol.json");
  const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));

  // Create provider + program
  const wallet = new anchor.Wallet(deployer);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });
  const program = new Program(idl, provider);

  // Generate 3 member keypairs (deployer is member 0)
  const member1 = Keypair.generate();
  const member2 = Keypair.generate();
  const members = [deployer, member1, member2];
  log("Members", members.map((m, i) => `M${i}: ${m.publicKey.toBase58().slice(0, 8)}...`).join(", "));

  // ─── Step 1: Fund member wallets ───────────────────────────────
  log("Step 1", "Funding member wallets with SOL + USDC");

  for (const m of [member1, member2]) {
    // Transfer SOL from deployer instead of airdrop (devnet faucet is rate-limited)
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: deployer.publicKey,
        toPubkey: m.publicKey,
        lamports: 0.05 * LAMPORTS_PER_SOL,
      })
    );
    await sendAndConfirmTransaction(connection, tx, [deployer]);
    log(`  Funded`, `${m.publicKey.toBase58().slice(0, 8)}... with 0.05 SOL`);
  }

  // Mint USDC to all members (deployer is mint authority)
  const usdcPerMember = 100_000_000; // 100 USDC each
  const memberTokenAccounts: PublicKey[] = [];

  for (let i = 0; i < members.length; i++) {
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      deployer,
      USDC_MINT,
      members[i].publicKey,
    );
    await mintTo(connection, deployer, USDC_MINT, ata.address, deployer, usdcPerMember);
    memberTokenAccounts.push(ata.address);
    log(`  M${i}`, `USDC ATA: ${ata.address.toBase58().slice(0, 8)}... (minted 100 USDC)`);
  }

  // ─── Step 2: Create Group ──────────────────────────────────────
  log("Step 2", "Creating group");

  const groupId = new BN(Date.now());
  const [groupPDA] = findPDA(
    [GROUP_SEED, deployer.publicKey.toBuffer(), groupId.toArrayLike(Buffer, "le", 8)],
    PROGRAM_ID
  );
  const [vaultPDA] = findPDA([VAULT_SEED, groupPDA.toBuffer()], PROGRAM_ID);
  const [insurancePDA] = findPDA([INSURANCE_SEED, groupPDA.toBuffer()], PROGRAM_ID);
  const [treasuryPDA] = findPDA([TREASURY_SEED, groupPDA.toBuffer()], PROGRAM_ID);

  const txCreate = await program.methods
    .createGroup({
      monthlyContribution: new BN(MONTHLY_CONTRIBUTION),
      totalMembers: TOTAL_MEMBERS,
      collateralBps: COLLATERAL_BPS,
      insuranceBps: INSURANCE_BPS,
      description: "E2E VRF Test Group",
      groupId: groupId,
    })
    .accounts({
      creator: deployer.publicKey,
      group: groupPDA,
      mint: USDC_MINT,
      vault: vaultPDA,
      insuranceVault: insurancePDA,
      treasuryVault: treasuryPDA,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([deployer])
    .rpc();

  log("  Created", `Group: ${groupPDA.toBase58().slice(0, 8)}... tx: ${txCreate.slice(0, 16)}...`);

  // ─── Step 3: Members Join ──────────────────────────────────────
  log("Step 3", "Members joining group");

  for (let i = 0; i < members.length; i++) {
    const [memberPDA] = findPDA(
      [MEMBER_SEED, groupPDA.toBuffer(), members[i].publicKey.toBuffer()],
      PROGRAM_ID
    );

    const txJoin = await program.methods
      .joinGroup()
      .accounts({
        user: members[i].publicKey,
        group: groupPDA,
        member: memberPDA,
        mint: USDC_MINT,
        userTokenAccount: memberTokenAccounts[i],
        vault: vaultPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([members[i]])
      .rpc();

    log(`  M${i} joined`, `tx: ${txJoin.slice(0, 16)}...`);
  }

  // ─── Step 4: Activate Group ────────────────────────────────────
  log("Step 4", "Activating group (creator only)");

  const txActivate = await program.methods
    .activateGroup()
    .accounts({
      caller: deployer.publicKey,
      group: groupPDA,
    })
    .signers([deployer])
    .rpc();

  log("  Activated", `tx: ${txActivate.slice(0, 16)}...`);

  // ─── Step 5: Start Round 0 ────────────────────────────────────
  log("Step 5", "Starting round 0");

  const [roundPDA] = findPDA(
    [ROUND_SEED, groupPDA.toBuffer(), Buffer.from([0])],
    PROGRAM_ID
  );

  const txStart = await program.methods
    .startRound()
    .accounts({
      caller: deployer.publicKey,
      group: groupPDA,
      round: roundPDA,
      systemProgram: SystemProgram.programId,
    })
    .signers([deployer])
    .rpc();

  log("  Round started", `tx: ${txStart.slice(0, 16)}...`);

  // ─── Step 6: Make Payments ─────────────────────────────────────
  log("Step 6", "All members making payments");

  for (let i = 0; i < members.length; i++) {
    const [memberPDA] = findPDA(
      [MEMBER_SEED, groupPDA.toBuffer(), members[i].publicKey.toBuffer()],
      PROGRAM_ID
    );

    const txPay = await program.methods
      .makePayment()
      .accounts({
        user: members[i].publicKey,
        group: groupPDA,
        member: memberPDA,
        round: roundPDA,
        mint: USDC_MINT,
        userTokenAccount: memberTokenAccounts[i],
        vault: vaultPDA,
        insuranceVault: insurancePDA,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([members[i]])
      .rpc();

    log(`  M${i} paid`, `tx: ${txPay.slice(0, 16)}...`);
  }

  // ─── Step 7: Close Collection ──────────────────────────────────
  // close_collection requires payment window + grace period to have elapsed.
  // On devnet we can't warp time, so we need to wait or adjust.
  // For testing: the program checks elapsed >= (7 + 3) * 86400 = 864000 seconds.
  // We can't wait 10 days, so we'll use a workaround:
  // → Skip directly to VRF using skip_round or accept this step will fail.
  //
  // WORKAROUND: We'll use solana program test with warp, but for a quick devnet test
  // we need to check if the clock constraint is enforced.

  log("Step 7", "Close collection (time-gated — checking if we can proceed)");

  try {
    const txClose = await program.methods
      .closeCollection()
      .accounts({
        caller: deployer.publicKey,
        group: groupPDA,
        round: roundPDA,
      })
      .signers([deployer])
      .rpc();

    log("  Collection closed", `tx: ${txClose.slice(0, 16)}...`);
  } catch (err: any) {
    const errMsg = err?.message || err?.toString() || "";
    if (errMsg.includes("GracePeriodActive") || errMsg.includes("0x177b")) {
      log("  ⏰ EXPECTED", "close_collection requires 10-day wait (payment window + grace)");
      log("  ℹ️  INFO", "On devnet, the 10-day timer makes real-time E2E VRF impossible.");
      log("  ℹ️  INFO", "The VRF flow (commit→resolve→distribute) is validated by unit tests.");
      log("  ℹ️  INFO", "To test end-to-end: revisit this group in 10 days or use localnet with clock warp.");

      // Print group state for verification
      const groupState = await program.account.consorcioGroup.fetch(groupPDA);
      const roundState = await program.account.round.fetch(roundPDA);
      log("\n📊 GROUP STATE:");
      log(`  Address: ${groupPDA.toBase58()}`);
      log(`  Status: Active`);
      log(`  Members: ${groupState.currentMembers}/${groupState.totalMembers}`);
      log(`  Round: ${groupState.currentRound}`);
      log(`  Contribution: ${(groupState.monthlyContribution as any).toNumber() / 1e6} USDC`);
      log("\n📊 ROUND STATE:");
      log(`  Address: ${roundPDA.toBase58()}`);
      log(`  Status: Collecting`);
      log(`  Payments: ${roundState.paymentsReceived}/${groupState.totalMembers}`);
      log(`  Total Collected: ${(roundState.totalCollected as any).toNumber() / 1e6} USDC`);

      console.log("\n═══════════════════════════════════════════");
      console.log("  ✅ All non-time-gated steps PASSED");
      console.log("  ⏰ VRF steps blocked by 10-day timer");
      console.log("  📝 Group is LIVE on devnet for manual testing");
      console.log("═══════════════════════════════════════════\n");

      // Print all accounts for manual follow-up
      console.log("Accounts for manual VRF test (after 10 days):");
      console.log(`  Group:     ${groupPDA.toBase58()}`);
      console.log(`  Round:     ${roundPDA.toBase58()}`);
      console.log(`  Vault:     ${vaultPDA.toBase58()}`);
      console.log(`  Insurance: ${insurancePDA.toBase58()}`);
      console.log(`  Treasury:  ${treasuryPDA.toBase58()}`);
      for (let i = 0; i < members.length; i++) {
        const [mPDA] = findPDA(
          [MEMBER_SEED, groupPDA.toBuffer(), members[i].publicKey.toBuffer()],
          PROGRAM_ID
        );
        console.log(`  Member${i}:  ${mPDA.toBase58()} (wallet: ${members[i].publicKey.toBase58().slice(0, 12)}...)`);
      }
      console.log(`\nRe-run VRF steps after: ${new Date(Date.now() + 10 * 86400 * 1000).toISOString().slice(0, 10)}`);

      return;
    }
    throw err;
  }

  // ─── Steps 8-10: VRF Flow (only reachable after time gate) ─────
  log("Step 8", "VRF Commit");

  // Load Switchboard SDK dynamically
  const sb = await import("@switchboard-xyz/on-demand");
  const randomnessKeypair = Keypair.generate();

  const [, commitIx] = await (sb as any).Randomness.create(
    connection,
    { queue: SWITCHBOARD_QUEUE, authority: deployer.publicKey },
    randomnessKeypair
  );

  const txCommit = await program.methods
    .commitRound()
    .accounts({
      caller: deployer.publicKey,
      group: groupPDA,
      round: roundPDA,
      randomnessAccountData: randomnessKeypair.publicKey,
    })
    .signers([deployer, randomnessKeypair])
    .preInstructions([commitIx])
    .rpc();

  log("  Committed", `randomness: ${randomnessKeypair.publicKey.toBase58().slice(0, 12)}... tx: ${txCommit.slice(0, 16)}...`);

  // Wait for oracle to reveal
  log("Step 9", "Waiting for oracle reveal...");
  let revealed = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    await sleep(2000);
    const randomnessAcct = await connection.getAccountInfo(randomnessKeypair.publicKey);
    if (randomnessAcct) {
      // Check if reveal_slot > 0 (offset: 8 disc + 32 authority + 32 queue + 32 seedhash + 8 seedslot + 32 oracle = 144, then 8 bytes reveal_slot)
      const revealSlot = randomnessAcct.data.readBigUInt64LE(8 + 32 + 32 + 32 + 8 + 32);
      if (revealSlot > 0n) {
        revealed = true;
        log("  Revealed!", `reveal_slot: ${revealSlot}, attempt: ${attempt + 1}`);
        break;
      }
    }
    if (attempt % 5 === 4) log(`  Waiting...`, `attempt ${attempt + 1}/30`);
  }

  if (!revealed) {
    log("  ⚠️  Oracle did not reveal within 60s. You may need to retry later.");
    return;
  }

  // Build reveal IX and resolve_round
  const randomness = new (sb as any).Randomness(connection, randomnessKeypair.publicKey);
  const revealIx = await randomness.revealIx();

  // Collect eligible member accounts for remaining_accounts
  const eligibleAccounts: web3.AccountMeta[] = [];
  for (const m of members) {
    const [memberPDA] = findPDA(
      [MEMBER_SEED, groupPDA.toBuffer(), m.publicKey.toBuffer()],
      PROGRAM_ID
    );
    eligibleAccounts.push({
      pubkey: memberPDA,
      isSigner: false,
      isWritable: false,
    });
  }

  const txResolve = await program.methods
    .resolveRound()
    .accounts({
      caller: deployer.publicKey,
      group: groupPDA,
      round: roundPDA,
      randomnessAccountData: randomnessKeypair.publicKey,
    })
    .remainingAccounts(eligibleAccounts)
    .signers([deployer])
    .preInstructions([revealIx])
    .rpc();

  log("  Resolved", `tx: ${txResolve.slice(0, 16)}...`);

  // Read winner
  const roundAfterResolve = await program.account.round.fetch(roundPDA);
  const winnerWallet = roundAfterResolve.lotteryWinner;
  const winnerIndex = members.findIndex((m) => m.publicKey.equals(winnerWallet));
  log(`  🎉 Winner: M${winnerIndex}`, winnerWallet.toBase58());

  // ─── Step 10: Distribute ───────────────────────────────────────
  log("Step 10", "Distributing pool to winner");

  const [winnerMemberPDA] = findPDA(
    [MEMBER_SEED, groupPDA.toBuffer(), winnerWallet.toBuffer()],
    PROGRAM_ID
  );
  const winnerTokenAccount = memberTokenAccounts[winnerIndex];

  const txDistribute = await program.methods
    .distribute()
    .accounts({
      caller: deployer.publicKey,
      group: groupPDA,
      round: roundPDA,
      winner: winnerMemberPDA,
      mint: USDC_MINT,
      winnerTokenAccount: winnerTokenAccount,
      vault: vaultPDA,
      treasuryVault: treasuryPDA,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .signers([deployer])
    .rpc();

  log("  Distributed!", `tx: ${txDistribute.slice(0, 16)}...`);

  // Final state
  const finalGroup = await program.account.consorcioGroup.fetch(groupPDA);
  const finalRound = await program.account.round.fetch(roundPDA);

  console.log("\n═══════════════════════════════════════════");
  console.log("  ✅ FULL E2E VRF TEST PASSED");
  console.log("═══════════════════════════════════════════");
  console.log(`  Round 0 completed`);
  console.log(`  Winner: M${winnerIndex} (${winnerWallet.toBase58().slice(0, 12)}...)`);
  console.log(`  Distribution: ${(finalRound.distributionAmount as any).toNumber() / 1e6} USDC`);
  console.log(`  Group now on round: ${finalGroup.currentRound}`);
  console.log("═══════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("\n❌ E2E Test Failed:");
  console.error(err);
  process.exit(1);
});
