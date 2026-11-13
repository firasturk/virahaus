"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import { categories, products } from "@/data/products";
import { DUR_COPY, figSpring } from "./motion";
import ProductCard from "./product-card";
import SectionHead from "./section-head";
import { setShopFilter, useShopFilter, type ShopFilter } from "./shop-filter";

const TABS: { slug: ShopFilter; name: string }[] = [{ slug: "all", name: "All" }, ...categories.map((c) => ({ slug: c.slug as ShopFilter, name: c.name }))];

function GridGlyph() {
  return (
    <svg viewBox="0 0 11 11" className="h-3 w-3" fill="currentColor" aria-hidden>
      <circle cx="2.2" cy="2.2" r="1.6" /><circle cx="8.8" cy="2.2" r="1.6" /><circle cx="2.2" cy="8.8" r="1.6" /><circle cx="8.8" cy="8.8" r="1.6" />
    </svg>
  );
}

export default function ShopSection() {
  const active = useShopFilter();
  const list = active === "all" ? products : products.filter((p) => p.category === active);

  /* Arriving from /#shop-<slug> on another page: bring the grid into view once it has mounted. */
  useEffect(() => {
    if (window.location.hash.startsWith("#shop")) document.getElementById("shop")?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <section id="shop" className="relative scroll-mt-4 bg-sand-2 px-5 py-20 text-ink sm:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead kicker="Shop" title="Everything we grow." lede="Tap + to add the standard size, or open a piece to choose another." />

        {/* The hero's "Our Products" pill, one per category. */}
        <div role="tablist" aria-label="Filter by category" className="-mx-5 mt-10 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {TABS.map((t) => {
            const on = t.slug === active;
            const count = t.slug === "all" ? products.length : products.filter((p) => p.category === t.slug).length;
            return (
              <button
                key={t.slug}
                role="tab"
                aria-selected={on}
                type="button"
                onClick={() => setShopFilter(t.slug)}
                className={`pill-dark shrink-0 !h-12 text-[0.95rem] transition ${on ? "!border-ink bg-ink !text-sand" : ""}`}
              >
                <span className={`dot !h-8 !w-8 ${on ? "!bg-white/15" : ""}`}><GridGlyph /></span>
                {t.name}
                <span className={`text-xs tabular-nums ${on ? "text-sand/60" : "text-ink/45"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <motion.ul layout className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: DUR_COPY, delay: Math.min(i, 8) * 0.04, ease: figSpring }}
              >
                <ProductCard product={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
