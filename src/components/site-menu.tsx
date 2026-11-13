"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

import { categories } from "@/data/products";
import { CATEGORY_AR_PLURAL } from "@/data/products-extra";
import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/contact";
import { XC } from "@/lib/extras-copy";
import { DICT, href } from "@/lib/dict";
import type { Lang } from "@/lib/i18n";
import { DUR_COPY, figSpring } from "./motion";

/* The menu's open flag is a tiny external store so any burger on the page can toggle it. */
let open = false;
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
export function setMenuOpen(v: boolean) { open = v; listeners.forEach((l) => l()); }
export function useMenuOpen() { return useSyncExternalStore(subscribe, () => open, () => false); }

export function MenuButton({ className, children, label = "Open menu" }: { className?: string; children: ReactNode; label?: string }) {
  return (
    <button type="button" className={className} aria-label={label} aria-haspopup="dialog" onClick={() => setMenuOpen(true)}>
      {children}
    </button>
  );
}

export function MenuOverlay({ lang = "en" }: { lang?: Lang }) {
  const isOpen = useMenuOpen();
  const t = DICT[lang];
  const links = [
    { label: t.nav.home, to: "/" },
    { label: t.nav.shop, to: "/shop" },
    ...categories.map((c) => ({ label: lang === "ar" ? CATEGORY_AR_PLURAL[c.slug] : c.name, to: `/shop/${c.slug}` })),
    { label: t.nav.customize, to: "/customize" },
    { label: XC[lang].nav.corporate, to: "/corporate" },
    { label: XC[lang].nav.giftCard, to: "/gift-card" },
    { label: t.nav.how, to: "/#how" },
    { label: t.nav.faq, to: "/#faq" },
    { label: t.nav.contact, to: "/#contact" },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div key="menu" role="dialog" aria-label={t.nav.menu} className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-white text-ink" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }} transition={{ duration: 0.4 }}>
          <header className="flex items-center justify-between px-6 py-6 sm:px-10">
            <span className="kicker">{t.nav.menu}</span>
            <button type="button" onClick={() => setMenuOpen(false)} className="h-11 rounded-full border border-ink/35 px-5 text-sm transition hover:border-ink">{t.nav.close}</button>
          </header>
          <nav className="flex flex-1 flex-col justify-center px-6 py-6 sm:px-10">
            <ul className="space-y-1">
              {links.map((l, i) => (
                <li key={l.to + l.label} className="overflow-hidden">
                  <motion.div initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: DUR_COPY, ease: figSpring, delay: 0.04 + i * 0.04 }}>
                    <Link href={href(lang, l.to)} onClick={() => setMenuOpen(false)} className="display block py-1 text-[clamp(1.9rem,5.4vw,4.2rem)] leading-[1.1] transition-colors hover:text-rust">
                      {l.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>
          <footer className="flex flex-col gap-2 border-t border-[var(--hair-dark)] px-6 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <a href={whatsappUrl()} target="_blank" rel="noopener" className="text-rust hover:text-ink" dir="ltr">WhatsApp {WHATSAPP_DISPLAY}</a>
            <span className="text-ink/55">{t.footer.city}</span>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
