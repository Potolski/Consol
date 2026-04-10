"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
} from "lucide-react";

const mockActivity = [
  { type: "contribution", title: "Contribution to Car Fund Circle", time: "2 hours ago", amount: "+$500.00", color: "text-[#006c4a]", icon: ArrowUpRight, iconBg: "bg-[#006c4a]/10" },
  { type: "payout", title: "Lottery Winner — Tech Gadgets Pool", time: "5 hours ago", amount: "+$1,000.00", color: "text-[#006c4a]", icon: ArrowDownRight, iconBg: "bg-[#006c4a]/10" },
  { type: "join", title: "New member joined Home Savings Group", time: "1 day ago", amount: "", color: "text-[#26619d]", icon: ArrowUpRight, iconBg: "bg-[#26619d]/10" },
  { type: "system", title: "Round 4 collection opened — Car Fund", time: "2 days ago", amount: "", color: "text-[#526075]", icon: RefreshCw, iconBg: "bg-[#eff4ff]" },
  { type: "contribution", title: "Contribution to Emergency Fund Co-op", time: "3 days ago", amount: "+$100.00", color: "text-[#006c4a]", icon: ArrowUpRight, iconBg: "bg-[#006c4a]/10" },
];

export default function ActivityPage() {
  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/dashboard"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#26619d] hover:text-[#006c4a]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-[#00345e]">Activity</h1>
          <p className="mt-1 text-[#526075]">Recent protocol events and transactions</p>
        </div>
      </div>

      <div className="rounded-xl bg-[#eff4ff] p-8">
        <div className="space-y-4">
          {mockActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-[0_4px_24px_rgba(0,52,94,0.06)]">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.iconBg}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#00345e]">{item.title}</p>
                  <p className="flex items-center gap-1 text-xs text-[#526075]">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </p>
                </div>
              </div>
              {item.amount && (
                <span className={`font-mono text-sm font-bold ${item.color}`}>
                  {item.amount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
