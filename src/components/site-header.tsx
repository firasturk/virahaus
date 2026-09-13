import Image from "next/image";
import Link from "next/link";

import { CartButton } from "./cart";

export default function SiteHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 sm:px-10">
      <Link href="/" className="pointer-events-auto">
        <Image src="/media/VIRA-HAUS-logo.png" alt="ViraHaus" width={561} height={120} className="h-6 w-auto" priority />
      </Link>
      <nav className="pointer-events-auto flex items-center gap-6 text-[0.72rem] tracking-[0.18em] uppercase text-white">
        <Link href="/#shop" className="opacity-80 hover:opacity-100">Shop</Link>
        <Link href="/#about" className="hidden opacity-80 hover:opacity-100 sm:inline">About</Link>
        <CartButton />
      </nav>
    </header>
  );
}
