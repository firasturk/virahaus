import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink px-6 py-12 text-bone sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Image src="/media/VIRA-HAUS-logo.png" alt="ViraHaus" width={561} height={120} className="h-6 w-auto" />
          <p className="mt-4 max-w-xs text-sm opacity-60">Nurturing green spaces, cultivating sustainable solutions, and inspiring a greener tomorrow for all.</p>
        </div>
        <nav className="flex gap-8 text-[0.72rem] tracking-[0.18em] uppercase opacity-70">
          <Link href="/#shop">Shop</Link>
          <Link href="/#about">About</Link>
          <Link href="/#gift">Gifting</Link>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-7xl text-[0.68rem] tracking-[0.14em] uppercase opacity-40">© {new Date().getFullYear()} ViraHaus</p>
    </footer>
  );
}
