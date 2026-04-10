"use client";

import { useState, useEffect } from "react";

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  phase: "payment" | "grace" | "closed";
}

export function useCountdown(
  startTimestamp: number | undefined,
  paymentWindowDays = 7,
  gracePeriodDays = 3
): CountdownState {
  const [state, setState] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: true,
    phase: "closed",
  });

  useEffect(() => {
    if (!startTimestamp) return;

    const paymentEndMs =
      (startTimestamp + paymentWindowDays * 86400) * 1000;
    const graceEndMs =
      (startTimestamp + (paymentWindowDays + gracePeriodDays) * 86400) * 1000;

    function tick() {
      const now = Date.now();
      let targetMs: number;
      let phase: CountdownState["phase"];

      if (now < paymentEndMs) {
        targetMs = paymentEndMs;
        phase = "payment";
      } else if (now < graceEndMs) {
        targetMs = graceEndMs;
        phase = "grace";
      } else {
        setState({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          phase: "closed",
        });
        return;
      }

      const diff = targetMs - now;
      setState({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        isExpired: false,
        phase,
      });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startTimestamp, paymentWindowDays, gracePeriodDays]);

  return state;
}
