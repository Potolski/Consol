"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { Wallet, LogOut, Copy, ExternalLink, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { truncateAddress } from "@/lib/utils";

export function WalletButton() {
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [menuOpen]);

  if (!isConnected || !address) {
    return (
      <button
        onClick={() => open()}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 text-sm font-medium text-primary transition-all hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/10"
      >
        <Wallet className="h-4 w-4" />
        Connect
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm font-medium font-mono text-white/70 transition-all hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white"
      >
        <span className="h-2 w-2 rounded-full bg-primary" />
        {truncateAddress(address)}
        <ChevronDown className="h-3 w-3 text-white/30" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/[0.08] bg-[#111827] shadow-xl shadow-black/40">
          <div className="border-b border-white/[0.06] px-3 py-2.5">
            <p className="font-mono text-xs text-white/40">Connected</p>
            <p className="mt-0.5 font-mono text-xs text-white/70">
              {truncateAddress(address, 6)}
            </p>
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                navigator.clipboard.writeText(address);
                toast.success("Address copied");
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/80"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Address
            </button>
            <a
              href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/80"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View on Explorer
            </a>
            <button
              onClick={() => {
                open({ view: "Account" });
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-400/70 transition-colors hover:bg-white/[0.04] hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
