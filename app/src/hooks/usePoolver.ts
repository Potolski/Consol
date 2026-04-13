"use client";

import { useCallback } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { usePoolverProgram } from "@/providers/PoolverProvider";
import { useTransactionToast } from "./useTransactionToast";
import {
  getGroupPDA,
  getMemberPDA,
  getRoundPDA,
  getVaultPDA,
  getInsuranceVaultPDA,
} from "@/lib/pdas";
import { buildCommitIx, buildRevealIx } from "@/lib/switchboard";

export function usePoolver() {
  const { program, provider } = usePoolverProgram();
  const { showSuccess, showError, showLoading, dismiss } =
    useTransactionToast();

  const createGroup = useCallback(
    async (params: {
      monthlyContribution: number;
      totalMembers: number;
      collateralBps: number;
      insuranceBps: number;
      description: string;
      mint: PublicKey;
    }) => {
      if (!program || !provider) throw new Error("Wallet not connected");

      const groupId = BigInt(
        Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
      );
      const [groupPDA] = getGroupPDA(provider.wallet.publicKey, groupId);
      const [vaultPDA] = getVaultPDA(groupPDA);
      const [insurancePDA] = getInsuranceVaultPDA(groupPDA);

      const loadingId = showLoading("Creating group...");
      try {
        // TODO: method name may change once IDL is finalized
        const tx = await program.methods
          .createGroup({
            monthlyContribution: params.monthlyContribution,
            totalMembers: params.totalMembers,
            collateralBps: params.collateralBps,
            insuranceBps: params.insuranceBps,
            description: params.description,
            groupId,
          })
          .accounts({
            creator: provider.wallet.publicKey,
            group: groupPDA,
            mint: params.mint,
            vault: vaultPDA,
            insuranceVault: insurancePDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        dismiss(loadingId);
        showSuccess(tx, "Group created successfully!");
        return { tx, groupAddress: groupPDA.toBase58() };
      } catch (err) {
        dismiss(loadingId);
        showError(err);
        throw err;
      }
    },
    [program, provider, showSuccess, showError, showLoading, dismiss]
  );

  const joinGroup = useCallback(
    async (
      groupAddress: string,
      mint: PublicKey,
      userTokenAccount: PublicKey
    ) => {
      if (!program || !provider) throw new Error("Wallet not connected");

      const groupPubkey = new PublicKey(groupAddress);
      const [memberPDA] = getMemberPDA(
        groupPubkey,
        provider.wallet.publicKey
      );
      const [vaultPDA] = getVaultPDA(groupPubkey);

      const loadingId = showLoading("Joining group...");
      try {
        const tx = await program.methods
          .joinGroup()
          .accounts({
            user: provider.wallet.publicKey,
            group: groupPubkey,
            member: memberPDA,
            mint,
            userTokenAccount,
            vault: vaultPDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        dismiss(loadingId);
        showSuccess(tx, "Joined group successfully!");
        return tx;
      } catch (err) {
        dismiss(loadingId);
        showError(err);
        throw err;
      }
    },
    [program, provider, showSuccess, showError, showLoading, dismiss]
  );

  const makePayment = useCallback(
    async (
      groupAddress: string,
      roundNumber: number,
      mint: PublicKey,
      userTokenAccount: PublicKey
    ) => {
      if (!program || !provider) throw new Error("Wallet not connected");

      const groupPubkey = new PublicKey(groupAddress);
      const [memberPDA] = getMemberPDA(
        groupPubkey,
        provider.wallet.publicKey
      );
      const [roundPDA] = getRoundPDA(groupPubkey, roundNumber);
      const [vaultPDA] = getVaultPDA(groupPubkey);
      const [insurancePDA] = getInsuranceVaultPDA(groupPubkey);

      const loadingId = showLoading("Processing payment...");
      try {
        const tx = await program.methods
          .makePayment()
          .accounts({
            user: provider.wallet.publicKey,
            group: groupPubkey,
            member: memberPDA,
            round: roundPDA,
            mint,
            userTokenAccount,
            vault: vaultPDA,
            insuranceVault: insurancePDA,
          })
          .rpc();

        dismiss(loadingId);
        showSuccess(tx, "Payment confirmed!");
        return tx;
      } catch (err) {
        dismiss(loadingId);
        showError(err);
        throw err;
      }
    },
    [program, provider, showSuccess, showError, showLoading, dismiss]
  );

  const leaveGroup = useCallback(
    async (
      groupAddress: string,
      mint: PublicKey,
      userTokenAccount: PublicKey
    ) => {
      if (!program || !provider) throw new Error("Wallet not connected");

      const groupPubkey = new PublicKey(groupAddress);
      const [memberPDA] = getMemberPDA(
        groupPubkey,
        provider.wallet.publicKey
      );
      const [vaultPDA] = getVaultPDA(groupPubkey);

      const loadingId = showLoading("Leaving group...");
      try {
        const tx = await program.methods
          .leaveGroup()
          .accounts({
            user: provider.wallet.publicKey,
            group: groupPubkey,
            member: memberPDA,
            mint,
            userTokenAccount,
            vault: vaultPDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        dismiss(loadingId);
        showSuccess(tx, "Left group — collateral refunded");
        return tx;
      } catch (err) {
        dismiss(loadingId);
        showError(err);
        throw err;
      }
    },
    [program, provider, showSuccess, showError, showLoading, dismiss]
  );

  const activateGroup = useCallback(
    async (groupAddress: string) => {
      if (!program || !provider) throw new Error("Wallet not connected");

      const groupPubkey = new PublicKey(groupAddress);
      const loadingId = showLoading("Activating group...");
      try {
        const tx = await program.methods
          .activateGroup()
          .accounts({
            caller: provider.wallet.publicKey,
            group: groupPubkey,
          })
          .rpc();

        dismiss(loadingId);
        showSuccess(tx, "Group activated!");
        return tx;
      } catch (err) {
        dismiss(loadingId);
        showError(err);
        throw err;
      }
    },
    [program, provider, showSuccess, showError, showLoading, dismiss]
  );

  const startRound = useCallback(
    async (groupAddress: string, roundNumber: number) => {
      if (!program || !provider) throw new Error("Wallet not connected");

      const groupPubkey = new PublicKey(groupAddress);
      const [roundPDA] = getRoundPDA(groupPubkey, roundNumber);

      const loadingId = showLoading("Starting round...");
      try {
        const tx = await program.methods
          .startRound()
          .accounts({
            caller: provider.wallet.publicKey,
            group: groupPubkey,
            round: roundPDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        dismiss(loadingId);
        showSuccess(tx, "Round started!");
        return tx;
      } catch (err) {
        dismiss(loadingId);
        showError(err);
        throw err;
      }
    },
    [program, provider, showSuccess, showError, showLoading, dismiss]
  );

  const closeCollection = useCallback(
    async (groupAddress: string, roundNumber: number) => {
      if (!program || !provider) throw new Error("Wallet not connected");

      const groupPubkey = new PublicKey(groupAddress);
      const [roundPDA] = getRoundPDA(groupPubkey, roundNumber);

      const loadingId = showLoading("Closing collection...");
      try {
        const tx = await program.methods
          .closeCollection()
          .accounts({
            caller: provider.wallet.publicKey,
            group: groupPubkey,
            round: roundPDA,
          })
          .rpc();

        dismiss(loadingId);
        showSuccess(tx, "Collection closed");
        return tx;
      } catch (err) {
        dismiss(loadingId);
        showError(err);
        throw err;
      }
    },
    [program, provider, showSuccess, showError, showLoading, dismiss]
  );

  const distribute = useCallback(
    async (
      groupAddress: string,
      roundNumber: number,
      winnerWallet: PublicKey,
      mint: PublicKey,
      winnerTokenAccount: PublicKey
    ) => {
      if (!program || !provider) throw new Error("Wallet not connected");

      const groupPubkey = new PublicKey(groupAddress);
      const [roundPDA] = getRoundPDA(groupPubkey, roundNumber);
      const [winnerMemberPDA] = getMemberPDA(groupPubkey, winnerWallet);
      const [vaultPDA] = getVaultPDA(groupPubkey);

      const loadingId = showLoading("Distributing funds...");
      try {
        const tx = await program.methods
          .distribute()
          .accounts({
            caller: provider.wallet.publicKey,
            group: groupPubkey,
            round: roundPDA,
            winner: winnerMemberPDA,
            mint,
            winnerTokenAccount,
            vault: vaultPDA,
          })
          .rpc();

        dismiss(loadingId);
        showSuccess(tx, "Funds distributed to winner!");
        return tx;
      } catch (err) {
        dismiss(loadingId);
        showError(err);
        throw err;
      }
    },
    [program, provider, showSuccess, showError, showLoading, dismiss]
  );

  const commitRound = useCallback(
    async (groupAddress: string, roundNumber: number) => {
      if (!program || !provider) throw new Error("Wallet not connected");

      const groupPubkey = new PublicKey(groupAddress);
      const [roundPDA] = getRoundPDA(groupPubkey, roundNumber);

      const loadingId = showLoading("Committing VRF randomness...");
      try {
        // Build Switchboard commit instruction
        const { randomnessKeypair, randomnessAccount, commitIx } =
          await buildCommitIx(
            provider.connection,
            provider.wallet.publicKey
          );

        // Build program's commit_round instruction, bundled after Switchboard commitIx
        const tx = await program.methods
          .commitRound()
          .accounts({
            caller: provider.wallet.publicKey,
            group: groupPubkey,
            round: roundPDA,
            randomnessAccountData: randomnessAccount,
          })
          .preInstructions([commitIx])
          .signers([randomnessKeypair])
          .rpc();

        dismiss(loadingId);
        showSuccess(tx, "VRF committed! Waiting for reveal...");
        return { tx, randomnessAccount };
      } catch (err) {
        dismiss(loadingId);
        showError(err);
        throw err;
      }
    },
    [program, provider, showSuccess, showError, showLoading, dismiss]
  );

  const resolveRound = useCallback(
    async (
      groupAddress: string,
      roundNumber: number,
      randomnessAccount: PublicKey,
      eligibleMembers: PublicKey[]
    ) => {
      if (!program || !provider) throw new Error("Wallet not connected");

      const groupPubkey = new PublicKey(groupAddress);
      const [roundPDA] = getRoundPDA(groupPubkey, roundNumber);

      const loadingId = showLoading("Revealing VRF and selecting winner...");
      try {
        // Build Switchboard reveal instruction
        const { revealIx } = await buildRevealIx(
          provider.connection,
          randomnessAccount
        );

        // Build program's resolve_round with eligible members as remaining_accounts
        const remainingAccounts = eligibleMembers.map((pubkey) => ({
          pubkey,
          isWritable: false,
          isSigner: false,
        }));

        const tx = await program.methods
          .resolveRound()
          .accounts({
            caller: provider.wallet.publicKey,
            group: groupPubkey,
            round: roundPDA,
            randomnessAccountData: randomnessAccount,
          })
          .remainingAccounts(remainingAccounts)
          .preInstructions([revealIx])
          .rpc();

        dismiss(loadingId);
        showSuccess(tx, "Winner selected!");
        return tx;
      } catch (err) {
        dismiss(loadingId);
        showError(err);
        throw err;
      }
    },
    [program, provider, showSuccess, showError, showLoading, dismiss]
  );

  return {
    createGroup,
    joinGroup,
    leaveGroup,
    activateGroup,
    startRound,
    makePayment,
    closeCollection,
    distribute,
    commitRound,
    resolveRound,
  };
}
