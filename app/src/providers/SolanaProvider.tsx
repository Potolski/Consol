"use client";

import { type ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { solanaAdapter, projectId, networks } from "@/config";

const metadata = {
  name: "Poolver",
  description: "Decentralized Savings Pools on Solana",
  url: "https://poolver.com",
  icons: ["/poolver-logo.svg"],
};

createAppKit({
  adapters: [solanaAdapter],
  projectId,
  networks,
  metadata,
  features: {
    analytics: false,
    email: true,
    socials: ["google", "github", "discord", "x"],
  },
  themeMode: "light",
  themeVariables: {
    "--w3m-color-mix": "#006c4a",
    "--w3m-color-mix-strength": 15,
    "--w3m-accent": "#006c4a",
    "--w3m-border-radius-master": "2px",
    "--w3m-font-family": "Inter, system-ui, sans-serif",
  },
});

export function SolanaProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
