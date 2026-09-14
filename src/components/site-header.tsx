import Image from "next/image";
import Link from "next/link";

import { CartButton } from "./cart";
import { MenuButton } from "./site-menu";

/* The wordmark is white-on-transparent; brightness(0.09) turns it ink for light pages. */
export default function SiteHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-7 sm:px-10">
      <Link href="/" className="pointer-events-auto">
        <Image src="/media/VIRA-HAUS-logo.png" alt="ViraHaus" width={561} height={120} className="h-6 w-auto [filter:brightness(0.09)]" priority />
      </Link>
      <nav className="pointer-events-auto flex items-center gap-7 text-[0.875rem] text-ink">
        <Link href="/" className="font-bold">Home</Link>
        <Link href="/#shop" className="text-rust">shop</Link>
        <Link href="/#about" className="hidden text-rust sm:inline">About</Link>
        <CartButton tone="dark" />
        <MenuButton className="grid h-9 w-9 place-items-center rounded-full border border-ink/35 transition hover:border-ink/80">
          <svg viewBox="0 0 16 8" className="h-2 w-4" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden><path d="M0 1h16M0 7h16" /></svg>
        </MenuButton>
      </nav>
    </header>
  );
}
