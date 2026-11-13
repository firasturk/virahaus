"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import { whatsappUrl } from "@/lib/contact";
import { DICT, href } from "@/lib/dict";
import { price, type Lang } from "@/lib/i18n";

/*
 * The cart is a jar. Products fly into it when added, it fills as it gets
 * fuller, and opening it shows what is inside. The order leaves as a WhatsApp
 * message in the page's language.
 */
export interface CartLine {
  key: string;
  slug: string;
  name: string;
  nameAr?: string;
  variant: string;
  variantAr?: string;
  price: number;
  image: string;
  qty: number;
  preorder?: boolean;
}

type NewLine = Omit<CartLine, "key" | "qty">;

interface CartContextValue {
  lang: Lang;
  lines: CartLine[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: NewLine, qty?: number, from?: Element | null) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE = "virahaus-cart-v2";
const EMPTY: CartLine[] = [];

/*
 * A tiny external store backed by localStorage. Reading it through
 * useSyncExternalStore means the server renders an empty jar and the client
 * swaps in the stored one after hydration, with no state set from an effect.
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

/* Send a copy of the product's picture from where it was clicked into the jar. */
function flyIntoJar(image: string, from: Element | null | undefined) {
  if (!from || typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = document.querySelector("[data-jar-target]");
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const size = Math.min(140, Math.max(64, a.width * 0.5));
  const img = document.createElement("img");
  img.src = image;
  img.alt = "";
  Object.assign(img.style, {
    position: "fixed", left: `${a.left + a.width / 2 - size / 2}px`, top: `${a.top + a.height / 2 - size / 2}px`,
    width: `${size}px`, height: `${size}px`, objectFit: "cover", borderRadius: "999px", zIndex: "90", pointerEvents: "none",
    boxShadow: "0 12px 30px -10px rgba(22,20,15,.5)",
  });
  document.body.appendChild(img);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = img.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.35 - 80}px) scale(0.6)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.12)`, opacity: 0.2 },
    ],
    { duration: 820, easing: "cubic-bezier(.5,0,.3,1)" },
  );
  anim.onfinish = () => {
    img.remove();
    target.animate([{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }], { duration: 380, easing: "ease-out" });
  };
}

export function CartProvider({ children, lang = "en" }: { children: ReactNode; lang?: Lang }) {
  const current = useSyncExternalStore(subscribe, read, () => EMPTY);
  const [open, setOpen] = useState(false);
  const [toastOn, setToastOn] = useState(false);
  const toastTimer = useRef(0);

  const add = useCallback((line: NewLine, qty = 1, from?: Element | null) => {
    const key = `${line.slug}::${line.variant}`;
    const prev = read();
    const hit = prev.find((l) => l.key === key);
    write(hit ? prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l)) : [...prev, { ...line, key, qty }]);
    flyIntoJar(line.image, from);
    setToastOn(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastOn(false), 2800);
  }, []);

  const remove = useCallback((key: string) => write(read().filter((l) => l.key !== key)), []);
  const setQty = useCallback(
    (key: string, qty: number) => write(qty <= 0 ? read().filter((l) => l.key !== key) : read().map((l) => (l.key === key ? { ...l, qty } : l))),
    [],
  );

  const value = useMemo<CartContextValue>(() => {
    const count = current.reduce((n, l) => n + l.qty, 0);
    const total = current.reduce((n, l) => n + l.qty * l.price, 0);
    return { lang, lines: current, count, total, open, setOpen, add, remove, setQty };
  }, [lang, current, open, add, remove, setQty]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <FloatingJar toastOn={toastOn} onToast={() => setToastOn(false)} />
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

/* A jar drawn in outline that fills with green as it holds more. */
export function JarGlyph({ fill = 0, className = "h-5 w-5" }: { fill?: number; className?: string }) {
  const f = Math.max(0, Math.min(1, fill));
  const top = 21 - 12 * f;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <defs>
        <clipPath id="jar-in">
          <path d="M9.2 5.5v1.8L5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9l-4.2-2.7V5.5Z" />
        </clipPath>
      </defs>
      {f > 0 && <rect x="4" y={top} width="16" height={22 - top} fill="#5f7d3c" stroke="none" clipPath="url(#jar-in)" />}
      <path d="M9.2 5.5v1.8L5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9l-4.2-2.7V5.5" />
      <rect x="8.2" y="2.5" width="7.6" height="3" rx="1" />
    </svg>
  );
}

export function CartButton({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const { count, setOpen, lang } = useCart();
  const t = DICT[lang].cart;
  const light = tone === "light";
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={t.open(count)}
      className={`relative inline-flex h-9 items-center gap-2 rounded-full border ps-2.5 pe-2 text-[0.8rem] transition ${light ? "border-white/40 text-white hover:border-white/75" : "border-ink/35 text-ink hover:border-ink/80"} ${className}`}
    >
      <JarGlyph fill={count / 6} className="h-[18px] w-[18px]" />
      {t.label}
      <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.65rem] font-semibold tabular-nums ${light ? "bg-white text-ink" : "bg-ink text-sand"}`}>{count}</span>
    </button>
  );
}

/* Always in reach, and the place products fly to. Lifts above the phone buy bar on product pages. */
function FloatingJar({ toastOn, onToast }: { toastOn: boolean; onToast: () => void }) {
  const { count, setOpen, lang } = useCart();
  const t = DICT[lang].cart;
  const path = usePathname();
  const onProduct = /\/(product|customize)(\/|$)/.test(path ?? "");

  return (
    <div className={`fixed end-4 z-50 flex items-center gap-3 sm:end-6 ${onProduct ? "bottom-[88px] lg:bottom-6" : "bottom-5 sm:bottom-6"}`}>
      <AnimatePresence>
        {toastOn && (
          <motion.button
            key="toast"
            type="button"
            onClick={() => { onToast(); setOpen(true); }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-full bg-ink px-4 py-2.5 text-xs text-sand shadow-lg"
          >
            {t.added}
          </motion.button>
        )}
      </AnimatePresence>
      <button
        type="button"
        data-jar-target
        onClick={() => setOpen(true)}
        aria-label={t.open(count)}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-white text-ink shadow-[0_10px_30px_-10px_rgba(22,20,15,0.45)] ring-1 ring-ink/10 transition hover:scale-105"
      >
        <JarGlyph fill={count / 6} className="h-7 w-7" />
        {count > 0 && (
          <span className="absolute -top-1 -end-1 grid h-6 min-w-6 place-items-center rounded-full bg-rust px-1 text-[0.7rem] font-semibold tabular-nums text-white">{count}</span>
        )}
      </button>
    </div>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.3 4.4c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-2-.9c-.3-.1-.5-.2-.7.1l-.9 1.1c-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.4 0-.5l-.9-2.1c-.2-.6-.4-.5-.6-.5Z" />
    </svg>
  );
}

/* The order as a WhatsApp message: every line, the total, and the gift note if any. */
export const PROMO_CODE = "WELCOME10"; // PLACEHOLDER first-order offer
export const PROMO_RATE = 0.1;

function orderText(lang: Lang, items: CartLine[], total: number, gift: { on: boolean; to: string; note: string }, extra: { date: string; code: string; discount: number }) {
  const t = DICT[lang].cart;
  const ar = lang === "ar";
  const rows = items.map((l) => `• ${ar && l.nameAr ? l.nameAr : l.name} (${ar && l.variantAr ? l.variantAr : l.variant}) ×${l.qty} — ${price(l.price * l.qty, lang)} — ${l.preorder ? t.msgPre : t.msgReady}`);
  const parts = [t.msgHello, "", ...rows, ""];
  if (extra.discount) parts.push(`${t.msgCode}: ${extra.code} (−${price(extra.discount, lang)})`);
  parts.push(`${t.msgTotal}: ${price(total - extra.discount, lang)}`);
  if (extra.date) parts.push(`${t.msgDate}: ${extra.date}`);
  if (gift.on) {
    parts.push("", t.msgGift);
    if (gift.to.trim()) parts.push(`${t.msgFor}: ${gift.to.trim()}`);
    if (gift.note.trim()) parts.push(`${t.msgNote}: "${gift.note.trim()}"`);
  }
  return parts.join("\n");
}

function CartDrawer() {
  const { lang, lines: items, total, open, setOpen, remove, setQty } = useCart();
  const t = DICT[lang].cart;
  const ar = lang === "ar";
  const [gift, setGift] = useState({ on: false, to: "", note: "" });
  const [date, setDate] = useState("");
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<"" | "ok" | "bad">("");
  const discount = applied === "ok" ? Math.round(total * PROMO_RATE * 100) / 100 : 0;
  const tomorrow = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  })();
  const field = "h-10 w-full rounded-full border border-ink/25 bg-transparent px-4 text-sm outline-none placeholder:text-ink/40 focus:border-ink";

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
          <motion.button key="scrim" type="button" aria-label={t.close} onClick={() => setOpen(false)} className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            key="panel"
            role="dialog"
            aria-label={t.title}
            className="fixed top-0 end-0 z-[61] flex h-full w-full max-w-md flex-col bg-white text-ink shadow-[-30px_0_80px_-20px_rgba(0,0,0,0.35)]"
            initial={{ x: ar ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: ar ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <header className="flex items-center justify-between border-b border-[var(--hair-dark)] px-6 py-5">
              <h2 className="display flex items-center gap-3 text-2xl"><JarGlyph fill={items.length / 6} className="h-7 w-7" />{t.title}</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-rust hover:text-ink">{t.close}</button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="mt-16 flex flex-col items-center text-center">
                  <JarGlyph className="h-16 w-16 text-ink/30" />
                  <p className="display mt-4 text-xl">{t.emptyTitle}</p>
                  <p className="mt-2 max-w-xs text-sm text-ink/60">{t.emptyText}</p>
                  <Link href={href(lang, "/shop")} onClick={() => setOpen(false)} className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm text-sand transition hover:bg-black">{t.browse}</Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((l) => (
                    <li key={l.key} className="flex gap-4">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-sand">
                        <Image src={l.image} alt="" fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        {l.slug.startsWith("custom-") ? (
                          <span className="display text-lg leading-tight">{ar && l.nameAr ? l.nameAr : l.name}</span>
                        ) : (
                          <Link href={href(lang, `/product/${l.slug}`)} onClick={() => setOpen(false)} className="display text-lg leading-tight">{ar && l.nameAr ? l.nameAr : l.name}</Link>
                        )}
                        <span className="text-xs text-rust">{ar && l.variantAr ? l.variantAr : l.variant}</span>
                        <span className="text-[0.7rem] text-ink/55">{l.preorder ? t.pre : t.ready}</span>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="inline-flex items-center rounded-full border border-ink/25" dir="ltr">
                            <button type="button" onClick={() => setQty(l.key, l.qty - 1)} className="h-7 w-7 opacity-70 hover:opacity-100" aria-label={t.less}>−</button>
                            <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                            <button type="button" onClick={() => setQty(l.key, l.qty + 1)} className="h-7 w-7 opacity-70 hover:opacity-100" aria-label={t.more}>+</button>
                          </div>
                          <span className="text-sm tabular-nums">{price(l.price * l.qty, lang)}</span>
                        </div>
                      </div>
                      <button type="button" onClick={() => remove(l.key)} aria-label={t.remove} className="self-start text-xs text-ink/50 hover:text-ink">✕</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-[var(--hair-dark)] px-6 py-5">
              {items.length > 0 && (
                <div className="mb-5">
                  <label className="flex cursor-pointer items-center gap-3 text-sm">
                    <input type="checkbox" checked={gift.on} onChange={(e) => setGift({ ...gift, on: e.target.checked })} className="h-4 w-4 accent-[#753319]" />
                    {t.gift}
                  </label>
                  {gift.on && (
                    <div className="mt-3 space-y-2">
                      <input value={gift.to} onChange={(e) => setGift({ ...gift, to: e.target.value })} placeholder={t.giftFor} className="h-10 w-full rounded-full border border-ink/25 bg-transparent px-4 text-sm outline-none placeholder:text-ink/40 focus:border-ink" />
                      <textarea value={gift.note} onChange={(e) => setGift({ ...gift, note: e.target.value })} placeholder={t.giftNote} rows={2} className="w-full resize-none rounded-2xl border border-ink/25 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-ink/40 focus:border-ink" />
                    </div>
                  )}
                </div>
              )}
              {items.length > 0 && (
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <label className="text-xs text-ink/60">
                    {t.date}
                    <input type="date" min={tomorrow} value={date} onChange={(e) => setDate(e.target.value)} className={`${field} mt-1`} suppressHydrationWarning />
                  </label>
                  <form
                    className="text-xs text-ink/60"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setApplied(code.trim().toUpperCase() === PROMO_CODE ? "ok" : code.trim() ? "bad" : "");
                    }}
                  >
                    <label htmlFor="cart-code">{t.promo}</label>
                    <div className="relative mt-1">
                      <input id="cart-code" value={code} onChange={(e) => { setCode(e.target.value); setApplied(""); }} placeholder={t.promoPh} className={`${field} pe-16 uppercase`} dir="ltr" />
                      <button type="submit" className="absolute inset-y-1 end-1 rounded-full bg-ink px-3 text-[0.7rem] text-sand">{t.promoApply}</button>
                    </div>
                    {applied && <span className={`mt-1 block ${applied === "ok" ? "text-rust" : "text-ink/60"}`}>{applied === "ok" ? t.promoOk : t.promoBad}</span>}
                  </form>
                </div>
              )}
              {discount > 0 && (
                <div className="mb-1 flex items-baseline justify-between text-sm text-rust">
                  <span>{t.discount}</span>
                  <span className="tabular-nums">−{price(discount, lang)}</span>
                </div>
              )}
              <div className="mb-4 flex items-baseline justify-between">
                <span className="kicker">{t.subtotal}</span>
                <span className="display text-2xl tabular-nums">{price(total - discount, lang)}</span>
              </div>
              <a
                href={items.length ? whatsappUrl(orderText(lang, items, total, gift, { date, code: code.trim().toUpperCase(), discount })) : undefined}
                target="_blank"
                rel="noopener"
                aria-disabled={items.length === 0}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm text-sand transition hover:bg-black aria-disabled:pointer-events-none aria-disabled:opacity-40"
              >
                <WhatsAppGlyph />
                {t.order}
              </a>
              <p className="mt-3 text-center text-[0.7rem] text-rust">{t.foot}</p>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
