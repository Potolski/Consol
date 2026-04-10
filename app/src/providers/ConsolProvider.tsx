"use client";

import { createContext, useContext, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

// TODO: Import real IDL after anchor build
// import idl from "@/lib/idl/consol.json";

const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || "Fz4KqVayYMmRyToZxJzErd9qRsnh8Bdq84yicvhv4114"
);

interface ConsolContextType {
  program: Program | null;
  programId: PublicKey;
  provider: AnchorProvider | null;
}

const ConsolContext = createContext<ConsolContextType>({
  program: null,
  programId: PROGRAM_ID,
  provider: null,
});

export function ConsolProvider({ children }: { children: React.ReactNode }) {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
      return null;
    }
    return new AnchorProvider(
      connection,
      {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      },
      { commitment: "confirmed" }
    );
  }, [connection, wallet]);

  // Program will be initialized once we have the IDL from anchor build
  const program = useMemo(() => {
    if (!provider) return null;
    // TODO: Uncomment when IDL is available
    // return new Program(idl as any, provider);
    return null;
  }, [provider]);

  return (
    <ConsolContext.Provider value={{ program, programId: PROGRAM_ID, provider }}>
      {children}
    </ConsolContext.Provider>
  );
}

export function useConsol() {
  return useContext(ConsolContext);
}
