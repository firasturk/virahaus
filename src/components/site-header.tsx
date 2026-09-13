import Image from "next/image";
import Link from "next/link";

import { CartButton } from "./cart";

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
      </nav>
    </header>
  );
}
