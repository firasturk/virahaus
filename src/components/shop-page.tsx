"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useSyncExternalStore } from "react";

import { categories, isPreorder, products, type CategorySlug } from "@/data/products";
import { CATEGORY_AR_PLURAL } from "@/data/products-extra";
import { DICT, href } from "@/lib/dict";
import type { Lang } from "@/lib/i18n";
import { JarGlyph } from "./cart";
import { DUR_COPY, figSpring } from "./motion";
import ProductCard from "./product-card";

type Avail = "any" | "ready" | "pre";
type Band = "any" | "under-30" | "30-100" | "over-100";
const BANDS: Band[] = ["any", "under-30", "30-100", "over-100"];

/* A gift link can open the shop on a price band: /shop#price-under-30. */
function subscribeHash(l: () => void) {
  window.addEventListener("hashchange", l);
  return () => window.removeEventListener("hashchange", l);
}
function hashBand(): Band {
  const m = window.location.hash.match(/^#price-(.+)$/);
  return m && BANDS.includes(m[1] as Band) ? (m[1] as Band) : "any";
}

const inBand = (p: number, b: Band) => b === "any" || (b === "under-30" ? p < 30 : b === "30-100" ? p >= 30 && p <= 100 : p > 100);

export default function ShopPage({ lang, category }: { lang: Lang; category?: CategorySlug }) {
  const t = DICT[lang].shop;
  const g = DICT[lang].gifting;
  const ar = lang === "ar";
  const fromHash = useSyncExternalStore(subscribeHash, hashBand, () => "any" as Band);
  const [bandSel, setBand] = useState<Band | null>(null);
  const [avail, setAvail] = useState<Avail>("any");
  const band = bandSel ?? fromHash;

  const list = products.filter(
    (p) =>
      (!category || p.category === category) &&
      (avail === "any" || (avail === "pre" ? isPreorder(p) : !isPreorder(p))) &&
      inBand(p.price, band),
  );
  const title = category ? (ar ? CATEGORY_AR_PLURAL[category] : categories.find((c) => c.slug === category)!.name) : t.title;
  const showCustom = (!category || category === "terrarium") && avail !== "pre" && (band === "any" || band === "30-100" || band === "over-100");

  const tabs: { label: string; to: string; on: boolean }[] = [
    { label: t.all, to: "/shop", on: !category },
    ...categories.map((c) => ({ label: ar ? CATEGORY_AR_PLURAL[c.slug] : c.name, to: `/shop/${c.slug}`, on: c.slug === category })),
  ];
  const chip = (on: boolean) => `shrink-0 rounded-full border px-4 py-2 text-sm transition ${on ? "border-ink bg-ink text-white" : "border-ink/20 bg-white hover:border-ink/60"}`;

  return (
    <div className="bg-white text-ink">
      <div className="mx-auto max-w-7xl px-5 pt-10 pb-24 sm:px-10 lg:pt-14">
        <p className="kicker">{DICT[lang].nav.shop}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="display text-[clamp(2.4rem,5vw,4rem)]">{title}</h1>
          <p className="pb-2 text-sm text-ink/55">{t.count(list.length + (showCustom ? 1 : 0))}</p>
        </div>
        <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-ink/65">{t.lede}</p>

        {/* Category tabs */}
        <nav aria-label={t.title} className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
          {tabs.map((tab) => (
            <Link key={tab.to} href={href(lang, tab.to)} aria-current={tab.on ? "page" : undefined} className={`shrink-0 rounded-full px-5 py-2.5 text-[0.95rem] transition ${tab.on ? "bg-ink text-white" : "bg-sand hover:bg-sand-2"}`}>
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Filters */}
        <div className="mt-5 flex flex-col gap-3 border-y border-[var(--hair-dark)] py-4 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs text-ink/50 lg:w-auto">{t.availability}</span>
            <div className="-me-5 flex gap-2 overflow-x-auto pe-5 [scrollbar-width:none] lg:me-0 lg:pe-0">
              {([["any", t.any], ["ready", t.readyNow], ["pre", t.preorder]] as const).map(([k, label]) => (
                <button key={k} type="button" onClick={() => setAvail(k)} aria-pressed={avail === k} className={chip(avail === k)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs text-ink/50 lg:w-auto">{t.price}</span>
            <div className="-me-5 flex gap-2 overflow-x-auto pe-5 [scrollbar-width:none] lg:me-0 lg:pe-0">
              <button type="button" onClick={() => setBand("any")} aria-pressed={band === "any"} className={chip(band === "any")}>{t.anyPrice}</button>
              {g.bands.map((b) => (
                <button key={b.band} type="button" onClick={() => setBand(b.band as Band)} aria-pressed={band === b.band} className={chip(band === b.band)}>{b.label}</button>
              ))}
            </div>
          </div>
        </div>

        {list.length === 0 && !showCustom ? (
          <div className="py-24 text-center">
            <p className="text-ink/60">{t.empty}</p>
            <button type="button" onClick={() => { setAvail("any"); setBand("any"); }} className="mt-5 rounded-full border border-ink/30 px-6 py-2.5 text-sm hover:border-ink">{t.reset}</button>
          </div>
        ) : (
          <motion.ul layout className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
            {showCustom && (
              <li>
                <Link href={href(lang, "/customize")} className="group flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-ink p-5 text-sand">
                  <span className="text-xs text-sand/60">{DICT[lang].nav.customize}</span>
                  <JarGlyph className="mx-auto h-24 w-24 text-sand/80 transition duration-700 group-hover:scale-110" fill={0.35} />
                  <span>
                    <span className="display block text-[1.25rem] leading-tight">{t.customTitle}</span>
                    <span className="mt-1 block text-xs text-sand/65">{t.customText}</span>
                  </span>
                </Link>
                <p className="mt-3 text-sm text-rust">{t.customCta} {ar ? "←" : "→"}</p>
              </li>
            )}
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((p, i) => (
                <motion.li key={p.slug} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: DUR_COPY, delay: Math.min(i, 8) * 0.04, ease: figSpring }}>
                  <ProductCard product={p} lang={lang} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </div>
  );
}
