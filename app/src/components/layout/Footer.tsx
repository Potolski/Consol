export function Footer() {
  return (
    <footer className="mt-auto py-6 px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#526075]">
      <p>Poolver Protocol &copy; 2026</p>
      <div className="flex items-center gap-4 mt-2 sm:mt-0">
        <span className="hover:text-[#00345e] cursor-pointer">Privacy Policy</span>
        <span className="hover:text-[#00345e] cursor-pointer">Risk Disclosure</span>
        <span className="hover:text-[#00345e] cursor-pointer">Status</span>
      </div>
    </footer>
  );
}
