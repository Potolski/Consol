"use client";

import { useCallback } from "react";
import { toast } from "sonner";

const EXPLORER_URL = "https://explorer.solana.com";
const CLUSTER = "devnet";

export function useTransactionToast() {
  const showSuccess = useCallback(
    (signature: string, message = "Transaction confirmed") => {
      const url = `${EXPLORER_URL}/tx/${signature}?cluster=${CLUSTER}`;
      toast.success(message, {
        description: "View on Solana Explorer",
        action: {
          label: "View",
          onClick: () => window.open(url, "_blank"),
        },
        duration: 5000,
      });
    },
    []
  );

  const showError = useCallback(
    (error: unknown, fallbackMessage = "Transaction failed") => {
      const message =
        error instanceof Error ? error.message : fallbackMessage;
      toast.error("Transaction Failed", {
        description: message.slice(0, 200),
        duration: 8000,
      });
    },
    []
  );

  const showLoading = useCallback((message = "Confirming transaction...") => {
    return toast.loading(message);
  }, []);

  const dismiss = useCallback((id: string | number) => {
    toast.dismiss(id);
  }, []);

  return { showSuccess, showError, showLoading, dismiss };
}
