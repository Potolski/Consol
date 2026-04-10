import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SolanaProvider } from "@/providers/SolanaProvider";
import { ConsolProvider } from "@/providers/ConsolProvider";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-headline",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consol — Decentralized Consorcio Protocol",
  description:
    "Transparent pools, verifiable fair selection, minimal fees. The Brazilian consorcio model, on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${manrope.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#00345e] antialiased">
        <SolanaProvider>
          <ConsolProvider>
            <TooltipProvider>
              <AppShell>{children}</AppShell>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: "#ffffff",
                    border: "none",
                    boxShadow: "0 4px 24px rgba(0, 52, 94, 0.08)",
                    color: "#00345e",
                  },
                }}
              />
            </TooltipProvider>
          </ConsolProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
