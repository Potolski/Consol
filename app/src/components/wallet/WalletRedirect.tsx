"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppKitAccount } from "@reown/appkit/react";

export function WalletRedirect() {
  const { isConnected } = useAppKitAccount();
  const pathname = usePathname();
  const router = useRouter();
  const wasConnected = useRef(false);

  useEffect(() => {
    // Only redirect when connection state changes from disconnected to connected
    // AND user is on the landing page
    if (isConnected && !wasConnected.current && pathname === "/") {
      router.push("/pools");
    }
    wasConnected.current = isConnected;
  }, [isConnected, pathname, router]);

  return null;
}
