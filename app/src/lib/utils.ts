import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { USDC_DECIMALS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format raw USDC amount (6 decimals) to display string
export function formatUSDC(amount: number | bigint): string {
  const value = Number(amount) / Math.pow(10, USDC_DECIMALS);
  if (Number.isInteger(value)) {
    return "$" + value.toLocaleString("en-US");
  }
  return "$" + value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Truncate a Solana address for display
export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

// Convert basis points to percentage string
export function bpsToPercent(bps: number): string {
  return `${bps / 100}%`;
}

// Format a Unix timestamp to relative time or date
export function formatDate(timestamp: number | bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Calculate time remaining from a start timestamp + duration in days
export function getTimeRemaining(startTimestamp: number, durationDays: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalMs: number;
} {
  const endMs = (startTimestamp + durationDays * 86400) * 1000;
  const nowMs = Date.now();
  const totalMs = endMs - nowMs;

  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalMs: 0 };
  }

  const days = Math.floor(totalMs / 86400000);
  const hours = Math.floor((totalMs % 86400000) / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);

  return { days, hours, minutes, seconds, isExpired: false, totalMs };
}
