import Image from "next/image";
import Link from "next/link";

import { T, type Lang } from "@/lib/i18n";
import { CartButton } from "./cart";
import { MenuButton } from "./site-menu";

/* The wordmark is white-on-transparent; brightness(0.09) turns it ink for light pages. */
export default function SiteHeader({ switchHref, switchLabel, lang = "en" }: { switchHref?: string; switchLabel?: string; lang?: Lang } = {}) {
  const nav = T[lang].nav;
  return (
    <header lang={lang} className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-7 sm:px-10 ${lang === "ar" ? "font-ar" : ""}`}>
      <Link href="/" className="pointer-events-auto">
        <Image src="/media/VIRA-HAUS-logo.png" alt="ViraHaus" width={561} height={120} className="h-6 w-auto [filter:brightness(0.09)]" priority />
      </Link>
      <nav className="pointer-events-auto flex items-center gap-3 text-[0.875rem] text-ink md:gap-7">
        <Link href="/#shop" className="hidden text-rust hover:text-ink md:inline">{nav.shop}</Link>
        <Link href="/#about" className="hidden text-rust hover:text-ink md:inline">{nav.how}</Link>
        <Link href="/#contact" className="hidden text-rust hover:text-ink md:inline">{nav.contact}</Link>
        {switchHref && (
          <Link href={switchHref} className="rounded-full border border-ink/35 px-3 py-1.5 text-[0.8rem] transition hover:border-ink" hrefLang={switchLabel === "English" ? "en" : "ar"}>
            {switchLabel}
          </Link>
        )}
        <CartButton tone="dark" />
        <MenuButton className="grid h-9 w-9 place-items-center rounded-full border border-ink/35 transition hover:border-ink/80">
          <svg viewBox="0 0 16 8" className="h-2 w-4" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden><path d="M0 1h16M0 7h16" /></svg>
        </MenuButton>
      </nav>
    </header>
  );
}
