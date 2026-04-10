import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";

// Switchboard devnet queue — standard Switchboard on-demand queue
const SWITCHBOARD_QUEUE = new PublicKey(
  "FfD96yeXs4cxZshoPPSKhSPgVQxLAJUT3gefgh84m1Di"
);

export interface CommitResult {
  randomnessKeypair: Keypair;
  randomnessAccount: PublicKey;
  commitIx: TransactionInstruction;
}

export interface RevealResult {
  revealIx: TransactionInstruction;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Dynamically load the Switchboard SDK at runtime only.
 * Uses Function constructor to prevent Turbopack/Webpack from statically analyzing the import.
 */
async function loadSwitchboardSDK(): Promise<any> {
  try {
    // Trick bundler: use indirect eval so Turbopack doesn't trace the import
    const mod = "@switchboard-xyz/on-demand";
    const loader = new Function("m", "return import(m)");
    return await loader(mod);
  } catch {
    return null;
  }
}

/**
 * Create a new randomness account and build the Switchboard commit instruction.
 * Bundle this in the same transaction as the program's `commit_round`.
 */
export async function buildCommitIx(
  connection: Connection,
  payer: PublicKey
): Promise<CommitResult> {
  const sb = await loadSwitchboardSDK();
  if (!sb?.Randomness) {
    throw new Error(
      "Switchboard SDK not available. Install @switchboard-xyz/on-demand and ensure devnet deployment."
    );
  }

  const randomnessKeypair = Keypair.generate();

  const [, commitIx] = await sb.Randomness.create(
    connection,
    {
      queue: SWITCHBOARD_QUEUE,
      authority: payer,
    },
    randomnessKeypair
  );

  return {
    randomnessKeypair,
    randomnessAccount: randomnessKeypair.publicKey,
    commitIx,
  };
}

/**
 * Build the Switchboard reveal instruction.
 * Bundle this in the same transaction as the program's `resolve_round`.
 */
export async function buildRevealIx(
  connection: Connection,
  randomnessAccount: PublicKey
): Promise<RevealResult> {
  const sb = await loadSwitchboardSDK();
  if (!sb?.Randomness) {
    throw new Error("Switchboard SDK not available.");
  }

  const randomness = new sb.Randomness(connection, randomnessAccount);
  const revealIx = await randomness.revealIx();

  return { revealIx };
}
