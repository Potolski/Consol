"use client";

import { createContext, useContext, useMemo } from "react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import {
  useAppKitProvider,
  useAppKitAccount,
} from "@reown/appkit/react";
import type { Provider } from "@reown/appkit-adapter-solana/react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "@/lib/idl/poolver.json";

const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID ||
    "Fz4KqVayYMmRyToZxJzErd9qRsnh8Bdq84yicvhv4114"
);

interface PoolverContextType {
  program: Program | null;
  programId: PublicKey;
  provider: AnchorProvider | null;
  connected: boolean;
  address: string | undefined;
}

const PoolverContext = createContext<PoolverContextType>({
  program: null,
  programId: PROGRAM_ID,
  provider: null,
  connected: false,
  address: undefined,
});

export function PoolverProvider({ children }: { children: React.ReactNode }) {
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { address, isConnected } = useAppKitAccount();

  const provider = useMemo(() => {
    if (!isConnected || !address || !walletProvider || !connection) {
      return null;
    }
    try {
      return new AnchorProvider(
        connection,
        {
          publicKey: new PublicKey(address),
          signTransaction: walletProvider.signTransaction.bind(walletProvider),
          signAllTransactions:
            walletProvider.signAllTransactions.bind(walletProvider),
        },
        { commitment: "confirmed" }
      );
    } catch {
      return null;
    }
  }, [connection, walletProvider, address, isConnected]);

  const program = useMemo(() => {
    if (!provider) return null;
    try {
      return new Program(idl as never, provider);
    } catch {
      return null;
    }
  }, [provider]);

  return (
    <PoolverContext.Provider
      value={{
        program,
        programId: PROGRAM_ID,
        provider,
        connected: isConnected,
        address,
      }}
    >
      {children}
    </PoolverContext.Provider>
  );
}

export function usePoolverProgram() {
  return useContext(PoolverContext);
}
