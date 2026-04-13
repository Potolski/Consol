"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, Settings } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { WalletButton } from "@/components/wallet/WalletButton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pools", label: "Pools" },
  { href: "/activity", label: "Activity" },
  { href: "/treasury", label: "Treasury" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/pools")
      return pathname === "/pools" || pathname.startsWith("/group");
    if (href === "/activity") return pathname === "/activity";
    if (href === "/treasury") return pathname === "/treasury";
    return false;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#006c4a] shadow-lg shadow-[#006c4a]/15 transition-shadow group-hover:shadow-[#006c4a]/25">
            <span className="text-base font-extrabold text-[#e0ffec]">P</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-[#006c4a]">
            Poolver
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-[#006c4a]"
                  : "text-[#526075] hover:text-[#00345e]"
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute inset-x-1 -bottom-[17px] h-[2px] rounded-full bg-[#006c4a]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => toast.info("Notifications coming soon")}
              className="p-2 text-[#526075] hover:bg-[#eff4ff] rounded-full transition-colors"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              onClick={() => toast.info("Settings coming soon")}
              className="p-2 text-[#526075] hover:bg-[#eff4ff] rounded-full transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>

          <WalletButton />

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white border-none">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-[#eff4ff] text-[#006c4a]"
                        : "text-[#526075] hover:bg-[#eff4ff] hover:text-[#00345e]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
