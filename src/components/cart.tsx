"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

import { formatPrice } from "@/data/products";
import { whatsappUrl } from "@/lib/contact";

export interface CartLine {
  key: string;
  slug: string;
  name: string;
  variant: string;
  price: number;
  image: string;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: Omit<CartLine, "key" | "qty">) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE = "virahaus-cart";
const EMPTY: CartLine[] = [];

/*
 * The cart lives in a tiny external store backed by localStorage. Reading it
 * through useSyncExternalStore means the server renders an empty cart, the
 * client swaps in the stored one after hydration, and no state is set from an
 * effect. Every write notifies subscribers and persists in one place.
 */
let lines: CartLine[] | null = null;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  if (lines) return lines;
  try {
    const raw = window.localStorage.getItem(STORAGE);
    lines = raw ? (JSON.parse(raw) as CartLine[]) : EMPTY;
  } catch {
    lines = EMPTY;
  }
  return lines;
}

function write(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function CartProvider({ children }: { children: ReactNode }) {
  const current = useSyncExternalStore(subscribe, read, () => EMPTY);
  const [open, setOpen] = useState(false);

  const add = useCallback((line: Omit<CartLine, "key" | "qty">) => {
    const key = `${line.slug}::${line.variant}`;
    const prev = read();
    const hit = prev.find((l) => l.key === key);
    write(hit ? prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) : [...prev, { ...line, key, qty: 1 }]);
    setOpen(true);
  }, []);

  const remove = useCallback((key: string) => write(read().filter((l) => l.key !== key)), []);
  const setQty = useCallback(
    (key: string, qty: number) => write(qty <= 0 ? read().filter((l) => l.key !== key) : read().map((l) => (l.key === key ? { ...l, qty } : l))),
    [],
  );

  const value = useMemo<CartContextValue>(() => {
    const count = current.reduce((n, l) => n + l.qty, 0);
    const total = current.reduce((n, l) => n + l.qty * l.price, 0);
    return { lines: current, count, total, open, setOpen, add, remove, setQty };
  }, [current, open, add, remove, setQty]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.3 4.4c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-2-.9c-.3-.1-.5-.2-.7.1l-.9 1.1c-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.4 0-.5l-.9-2.1c-.2-.6-.4-.5-.6-.5Z" />
    </svg>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function CartButton({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const { count, setOpen } = useCart();
  const light = tone === "light";
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      className={`relative inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[0.8rem] transition ${light ? "border-white/40 text-white hover:border-white/75" : "border-ink/35 text-ink hover:border-ink/80"} ${className}`}
    >
      Cart
      <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.65rem] font-semibold tabular-nums ${light ? "bg-white text-ink" : "bg-ink text-sand"}`}>
        {count}
      </span>
    </button>
  );
}

/* The order goes out as a WhatsApp message: every line, the total, and the gift note if any. */
function orderText(lines: CartLine[], total: number, gift: { on: boolean; to: string; note: string }) {
  const rows = lines.map((l) => `• ${l.name} (${l.variant}) ×${l.qty} — ${formatPrice(l.price * l.qty)}`);
  const parts = ["Hi ViraHaus, I'd like to order:", "", ...rows, "", `Total: ${formatPrice(total)}`];
  if (gift.on) {
    parts.push("", "This is a gift.");
    if (gift.to.trim()) parts.push(`For: ${gift.to.trim()}`);
    if (gift.note.trim()) parts.push(`Handwritten note: "${gift.note.trim()}"`);
  }
  return parts.join("\n");
}

function CartDrawer() {
  const { lines, total, open, setOpen, remove, setQty } = useCart();
  const [gift, setGift] = useState({ on: false, to: "", note: "" });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            key="scrim"
            type="button"
            aria-label="Close cart"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-label="Cart"
            className="fixed top-0 right-0 z-[61] flex h-full w-full max-w-md flex-col bg-sand text-ink shadow-[-30px_0_80px_-20px_rgba(0,0,0,0.35)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <header className="flex items-center justify-between border-b border-[var(--hair-dark)] px-6 py-5">
              <h2 className="display text-2xl">Your cart</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-rust hover:text-ink">
                Close
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <p className="mt-10 text-center text-sm text-ink/60">Nothing here yet. Everything grows.</p>
              ) : (
                <ul className="space-y-5">
                  {lines.map((l) => (
                    <li key={l.key} className="flex gap-4">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-card">
                        <Image src={l.image} alt="" fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <Link href={`/product/${l.slug}`} onClick={() => setOpen(false)} className="display text-lg leading-tight">
                          {l.name}
                        </Link>
                        <span className="text-xs text-rust">{l.variant}</span>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-ink/25">
                            <button type="button" onClick={() => setQty(l.key, l.qty - 1)} className="h-7 w-7 opacity-70 hover:opacity-100" aria-label="Decrease">−</button>
                            <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                            <button type="button" onClick={() => setQty(l.key, l.qty + 1)} className="h-7 w-7 opacity-70 hover:opacity-100" aria-label="Increase">+</button>
                          </div>
                          <span className="text-sm tabular-nums">{formatPrice(l.price * l.qty)}</span>
                        </div>
                      </div>
                      <button type="button" onClick={() => remove(l.key)} aria-label="Remove" className="self-start text-xs text-ink/50 hover:text-ink">✕</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-[var(--hair-dark)] px-6 py-5">
              {lines.length > 0 && (
                <div className="mb-5">
                  <label className="flex cursor-pointer items-center gap-3 text-sm">
                    <input type="checkbox" checked={gift.on} onChange={(e) => setGift({ ...gift, on: e.target.checked })} className="h-4 w-4 accent-[#753319]" />
                    This is a gift
                  </label>
                  {gift.on && (
                    <div className="mt-3 space-y-2">
                      <input value={gift.to} onChange={(e) => setGift({ ...gift, to: e.target.value })} placeholder="Who is it for?" className="h-10 w-full rounded-full border border-ink/25 bg-transparent px-4 text-sm outline-none placeholder:text-ink/40 focus:border-ink" />
                      <textarea value={gift.note} onChange={(e) => setGift({ ...gift, note: e.target.value })} placeholder="A short note — we write it by hand and tuck it in." rows={2} className="w-full resize-none rounded-2xl border border-ink/25 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-ink/40 focus:border-ink" />
                    </div>
                  )}
                </div>
              )}
              <div className="mb-4 flex items-baseline justify-between">
                <span className="kicker">Subtotal</span>
                <span className="display text-2xl tabular-nums">{formatPrice(total)}</span>
              </div>
              <a
                href={lines.length ? whatsappUrl(orderText(lines, total, gift)) : undefined}
                target="_blank"
                rel="noopener"
                aria-disabled={lines.length === 0}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm text-sand transition hover:bg-black aria-disabled:pointer-events-none aria-disabled:opacity-40"
              >
                <WhatsAppGlyph />
                Order on WhatsApp
              </a>
              <p className="mt-3 text-center text-[0.7rem] text-rust">We confirm on WhatsApp. Nothing charged until it ships.</p>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
