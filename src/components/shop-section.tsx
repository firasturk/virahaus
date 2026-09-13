"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { categories, formatPrice, products, type CategorySlug } from "@/data/products";
import GlyphRise from "./glyph-rise";
import { DUR_COPY, figSpring } from "./motion";
import Reveal from "./reveal";

export default function ShopSection() {
  const [active, setActive] = useState<CategorySlug>("terrarium");
  const current = categories.find((c) => c.slug === active)!;
  const list = products.filter((p) => p.category === active);

  return (
    <section id="shop" className="relative overflow-hidden bg-sand-2 px-6 py-24 text-ink sm:px-10 lg:py-36">
      <div className="rails" aria-hidden><span style={{ left: "25%" }} /><span style={{ left: "50%" }} /><span style={{ left: "75%" }} /></div>

      <div className="relative mx-auto max-w-7xl">
        <Reveal><p className="kicker">Shop</p></Reveal>
        <h2 className="display mt-6 text-[clamp(2.4rem,4.6vw,3.9rem)]">
          <GlyphRise text="Three ways to keep" />
          <br />
          <GlyphRise text="something alive." offset={18} />
        </h2>

        {/* Category tiles double as the tabs, drawn like the EcoStove card. */}
        <Reveal delay={0.2}>
          <div role="tablist" aria-label="Categories" className="mt-12 grid gap-4 sm:grid-cols-3">
            {categories.map((c) => {
              const on = c.slug === active;
              return (
                <button
                  key={c.slug}
                  role="tab"
                  aria-selected={on}
                  type="button"
                  onClick={() => setActive(c.slug)}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-card text-left transition ${on ? "ring-2 ring-rust" : "ring-1 ring-ink/10 hover:ring-ink/30"}`}
                >
                  <Image src={c.image} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className={`object-cover transition duration-[1200ms] ${on ? "scale-105" : "group-hover:scale-105"}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="display text-2xl tracking-[-0.08em]">{c.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/75">{c.blurb}</p>
                  </div>
                  {on && <motion.span layoutId="shop-tab" className="absolute top-5 right-5 h-3 w-3 rounded-full bg-white" />}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-14 flex items-baseline justify-between border-b border-[var(--hair-dark)] pb-4">
          <h3 className="display text-2xl tracking-[-0.08em]">{current.name}</h3>
          <span className="kicker">{list.length} pieces</span>
        </div>

        <motion.ul layout className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: DUR_COPY, delay: i * 0.05, ease: figSpring }}
              >
                <Link href={`/product/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-card">
                    <Image src={p.images[0]} alt={p.name} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <div>
                      <p className="display text-[1.35rem] tracking-[-0.07em]">{p.name}</p>
                      {p.latin && <p className="text-xs text-rust">{p.latin}</p>}
                    </div>
                    <span className="text-sm tabular-nums">{formatPrice(p.price)}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink/60">{p.tagline}</p>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
