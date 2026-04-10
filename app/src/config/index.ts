import { solana, solanaDevnet } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "";

export const networks = [solanaDevnet, solana] as [
  AppKitNetwork,
  ...AppKitNetwork[],
];

export const solanaAdapter = new SolanaAdapter();
