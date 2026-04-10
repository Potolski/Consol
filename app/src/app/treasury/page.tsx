import { Vault, Lock } from "lucide-react";

export default function TreasuryPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#eff4ff]">
        <Vault className="h-8 w-8 text-[#26619d]" />
      </div>
      <div>
        <h1 className="font-headline text-2xl font-bold text-[#00345e]">Treasury</h1>
        <p className="mt-2 text-sm text-[#526075]">
          Protocol treasury and fee distribution — coming soon.
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-[#eff4ff] px-4 py-2 text-xs text-[#26619d]">
        <Lock className="h-3.5 w-3.5" />
        Under Development
      </div>
    </div>
  );
}
