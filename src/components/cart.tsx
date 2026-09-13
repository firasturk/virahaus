"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

import { formatPrice } from "@/data/products";

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

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function CartButton({ className = "" }: { className?: string }) {
  const { count, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      className={`relative inline-flex h-9 items-center gap-2 rounded-full border border-white/25 px-3 text-[0.72rem] tracking-[0.18em] uppercase text-white transition hover:border-white/60 ${className}`}
    >
      Cart
      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[0.65rem] font-semibold text-ink tabular-nums">
        {count}
      </span>
    </button>
  );
}

function CartDrawer() {
  const { lines, total, open, setOpen, remove, setQty } = useCart();

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
            className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-label="Cart"
            className="glass fixed top-0 right-0 z-[61] flex h-full w-full max-w-md flex-col bg-ink/85 text-bone"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="font-serif text-2xl">Your cart</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-xs tracking-[0.2em] uppercase opacity-70 hover:opacity-100">
                Close
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <p className="mt-10 text-center text-sm opacity-60">Nothing here yet. Everything grows.</p>
              ) : (
                <ul className="space-y-5">
                  {lines.map((l) => (
                    <li key={l.key} className="flex gap-4">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5">
                        <Image src={l.image} alt="" fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <Link href={`/product/${l.slug}`} onClick={() => setOpen(false)} className="font-serif text-lg leading-tight">
                          {l.name}
                        </Link>
                        <span className="text-xs opacity-60">{l.variant}</span>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-white/15">
                            <button type="button" onClick={() => setQty(l.key, l.qty - 1)} className="h-7 w-7 opacity-70 hover:opacity-100" aria-label="Decrease">−</button>
                            <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                            <button type="button" onClick={() => setQty(l.key, l.qty + 1)} className="h-7 w-7 opacity-70 hover:opacity-100" aria-label="Increase">+</button>
                          </div>
                          <span className="text-sm tabular-nums">{formatPrice(l.price * l.qty)}</span>
                        </div>
                      </div>
                      <button type="button" onClick={() => remove(l.key)} aria-label="Remove" className="self-start text-xs opacity-50 hover:opacity-100">✕</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-white/10 px-6 py-5">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-xs tracking-[0.2em] uppercase opacity-60">Subtotal</span>
                <span className="font-serif text-2xl tabular-nums">{formatPrice(total)}</span>
              </div>
              <button type="button" disabled={lines.length === 0} className="h-12 w-full rounded-full bg-bone text-sm font-medium tracking-wide text-ink transition hover:bg-white disabled:opacity-40">
                Checkout
              </button>
              <p className="mt-3 text-center text-[0.7rem] opacity-50">Nothing charged until it ships.</p>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
