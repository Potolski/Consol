"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { truncateAddress } from "@/lib/utils";

export function WalletButton() {
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <button className="wallet" onClick={() => open()}>
        Connect Wallet
      </button>
    );
  }

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button className="wallet connected" onClick={() => setMenuOpen((v) => !v)}>
        ● {truncateAddress(address)}
      </button>
      {menuOpen && (
        <div className="wallet-menu">
          <div className="wallet-menu-head">
            <div className="k">Connected</div>
            <div className="v">{truncateAddress(address, 6)}</div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(address);
              toast.success("Address copied");
              setMenuOpen(false);
            }}
          >
            Copy address
          </button>
          <a
            href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            View on Explorer ↗
          </a>
          <button
            onClick={() => {
              open({ view: "Account" });
              setMenuOpen(false);
            }}
            className="danger"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
