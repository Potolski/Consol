export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p className="text-xs text-white/30">
          Consol Protocol &middot; v0.1.0
        </p>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9945FF]/20 bg-[#9945FF]/10 px-3 py-1 text-[11px] font-medium text-[#9945FF]">
            <svg
              width="10"
              height="10"
              viewBox="0 0 128 128"
              fill="currentColor"
              className="shrink-0"
            >
              <path d="M109.5 28.2c-1.4-1.4-3.3-2.2-5.3-2.2H23.8c-0.7 0-1.1 0.8-0.7 1.4l12.4 12.4c1.4 1.4 3.3 2.2 5.3 2.2h80.4c0.7 0 1.1-0.8 0.7-1.4L109.5 28.2z" />
              <path d="M109.5 86.2c-1.4-1.4-3.3-2.2-5.3-2.2H23.8c-0.7 0-1.1 0.8-0.7 1.4l12.4 12.4c1.4 1.4 3.3 2.2 5.3 2.2h80.4c0.7 0 1.1-0.8 0.7-1.4L109.5 86.2z" />
              <path d="M18.5 57.2c1.4-1.4 3.3-2.2 5.3-2.2h80.4c0.7 0 1.1 0.8 0.7 1.4l-12.4 12.4c-1.4 1.4-3.3 2.2-5.3 2.2H6.8c-0.7 0-1.1-0.8-0.7-1.4L18.5 57.2z" />
            </svg>
            Solana
          </span>
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
            Frontier Hackathon 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
