import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SolanaProvider } from "@/providers/SolanaProvider";
import { PoolverProvider } from "@/providers/PoolverProvider";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poolver",
  description:
    "Transparent pools, verifiable fair selection, minimal fees. Inspired by traditional rotating savings, powered by Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-accent="electric"
      className={`${geist.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('poolver-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <div className="glow-orb a" />
        <div className="glow-orb b" />
        <div className="glow-orb c" />
        <SolanaProvider>
          <PoolverProvider>
            <AppShell>{children}</AppShell>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "oklch(0.17 0.018 260)",
                  border: "1px solid oklch(0.28 0.02 260)",
                  color: "oklch(0.96 0.012 240)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                },
              }}
            />
          </PoolverProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
