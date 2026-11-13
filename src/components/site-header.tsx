"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DICT, href } from "@/lib/dict";
import type { Lang } from "@/lib/i18n";
import { CartButton } from "./cart";
import { MenuButton } from "./site-menu";

/* The address of this page in the other language. */
export function useOtherLangPath(lang: Lang) {
  const path = usePathname() || "/";
  if (lang === "en") return path === "/" ? "/ar" : `/ar${path}`;
  const rest = path.replace(/^\/ar/, "");
  return rest || "/";
}

/* The bar on every page but the home hero: logo, the main links, language, jar, menu. Sticks to the top. */
export default function SiteHeader({ lang }: { lang: Lang }) {
  const t = DICT[lang].nav;
  const other = useOtherLangPath(lang);
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--hair-dark)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-10">
        <Link href={href(lang, "/")} className="shrink-0" aria-label="ViraHaus">
          <Image src="/media/VIRA-HAUS-logo.png" alt="ViraHaus" width={561} height={120} className="h-6 w-auto [filter:brightness(0.09)]" priority />
        </Link>
        <nav className="hidden items-center gap-7 text-[0.9rem] text-ink lg:flex">
          <Link href={href(lang, "/shop")} className="hover:text-rust">{t.shop}</Link>
          <Link href={href(lang, "/customize")} className="hover:text-rust">{t.customize}</Link>
          <Link href={href(lang, "/#how")} className="hover:text-rust">{t.how}</Link>
          <Link href={href(lang, "/#faq")} className="hover:text-rust">{t.faq}</Link>
          <Link href={href(lang, "/#contact")} className="hover:text-rust">{t.contact}</Link>
        </nav>
        <div className="flex items-center gap-2.5">
          <Link href={other} hrefLang={lang === "en" ? "ar" : "en"} className="grid h-9 place-items-center rounded-full border border-ink/35 px-3 text-[0.8rem] transition hover:border-ink">
            {t.language}
          </Link>
          <CartButton tone="dark" className="hidden sm:inline-flex" />
          <MenuButton label={t.menu} className="grid h-9 w-9 place-items-center rounded-full border border-ink/35 transition hover:border-ink">
            <svg viewBox="0 0 16 8" className="h-2 w-4" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden><path d="M0 1h16M0 7h16" /></svg>
          </MenuButton>
        </div>
      </div>
    </header>
  );
}
