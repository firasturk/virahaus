"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

import { categories } from "@/data/products";
import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/contact";
import { DUR_COPY, figSpring } from "./motion";

/* The menu's open flag is a tiny external store so any burger on the page can toggle it. */
let open = false;
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
export function setMenuOpen(v: boolean) { open = v; listeners.forEach((l) => l()); }
export function useMenuOpen() { return useSyncExternalStore(subscribe, () => open, () => false); }

const LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/#shop" },
  ...categories.map((c) => ({ label: c.name, href: "/#shop" })),
  { label: "Gifting", href: "/#gift" },
];

export function MenuButton({ className, children, label = "Open menu" }: { className?: string; children: ReactNode; label?: string }) {
  return (
    <button type="button" className={className} aria-label={label} aria-haspopup="dialog" onClick={() => setMenuOpen(true)}>
      {children}
    </button>
  );
}

export function MenuOverlay() {
  const isOpen = useMenuOpen();

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
        <motion.div
          key="menu"
          role="dialog"
          aria-label="Menu"
          className="fixed inset-0 z-[70] flex flex-col bg-sand text-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          transition={{ duration: 0.5 }}
        >
          <div className="rails" aria-hidden><span style={{ left: "25%" }} /><span style={{ left: "50%" }} /><span style={{ left: "75%" }} /></div>

          <header className="relative flex items-center justify-between px-6 py-7 sm:px-10">
            <span className="kicker">Menu</span>
            <button type="button" onClick={() => setMenuOpen(false)} className="pill-dark !h-11 !pl-4 text-sm" aria-label="Close menu">
              Close
            </button>
          </header>

          <nav className="relative flex flex-1 flex-col justify-center px-6 sm:px-10">
            <ul className="space-y-1">
              {LINKS.map((l, i) => (
                <li key={l.label} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: DUR_COPY, ease: figSpring, delay: 0.05 + i * 0.05 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className="display block text-[clamp(2.2rem,7vw,5.6rem)] leading-[1.02] transition-colors hover:text-rust"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>

          <motion.footer
            className="relative flex flex-col gap-3 border-t border-[var(--hair-dark)] px-6 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <a href={whatsappUrl()} target="_blank" rel="noopener" className="text-rust hover:text-ink">
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <span className="kicker !text-ink/50">Amman · ships everywhere</span>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
