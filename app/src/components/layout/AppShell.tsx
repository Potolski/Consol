"use client";

import { TopBar } from "./TopBar";
import { Footer } from "./Footer";
import { WalletRedirect } from "@/components/wallet/WalletRedirect";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <WalletRedirect />
      <main>{children}</main>
      <Footer />
    </>
  );
}
