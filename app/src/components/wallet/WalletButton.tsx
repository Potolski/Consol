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
        className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#006c4a] px-4 text-sm font-medium text-[#e0ffec] transition-all hover:bg-[#005a3d] hover:shadow-lg hover:shadow-[#006c4a]/15"
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
        className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#eff4ff] px-3 text-sm font-medium font-mono text-[#00345e] transition-all hover:bg-[#dce9ff]"
      >
        <span className="h-2 w-2 rounded-full bg-[#006c4a]" />
        {truncateAddress(address)}
        <ChevronDown className="h-3 w-3 text-[#26619d]" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl bg-white shadow-lg shadow-[#00345e]/10">
          <div className="bg-[#eff4ff] px-3 py-2.5">
            <p className="font-mono text-xs text-[#26619d]">Connected</p>
            <p className="mt-0.5 font-mono text-xs text-[#00345e]">
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
              className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-[#526075] transition-colors hover:bg-[#dce9ff] hover:text-[#00345e]"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Address
            </button>
            <a
              href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-[#526075] transition-colors hover:bg-[#dce9ff] hover:text-[#00345e]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View on Explorer
            </a>
            <button
              onClick={() => {
                open({ view: "Account" });
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-[#9f403d] transition-colors hover:bg-[#dce9ff] hover:text-[#9f403d]"
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
