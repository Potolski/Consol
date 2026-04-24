"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PoolverMark } from "@/components/brand/PoolverLogo";
import { WalletButton } from "@/components/wallet/WalletButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const NAV = [
  { href: "/", key: "landing", label: "Home" },
  { href: "/pools", key: "pools", label: "Pools" },
  { href: "/create", key: "create", label: "Create" },
  { href: "/docs", key: "docs", label: "Docs" },
] as const;

export function TopBar() {
  const pathname = usePathname();

  function isActive(href: string, key: string): boolean {
    if (key === "landing") return pathname === "/";
    if (key === "pools") return pathname === "/pools" || pathname.startsWith("/group");
    return pathname.startsWith(href);
  }

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <PoolverMark size={22} />
        <b>Poolver</b>
        <span className="dim2 topbar-tag">v0.1</span>
      </Link>
      <nav>
        {NAV.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={cn(isActive(item.href, item.key) && "on")}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="right">
        <span className="pill live">
          <span className="dot" />
          Solana · Devnet
        </span>
        <ThemeToggle />
        <WalletButton />
      </div>
    </header>
  );
}
