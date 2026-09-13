"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { categories, formatPrice, products, type CategorySlug } from "@/data/products";
import FilmGrain from "./film-grain";
import Reveal from "./reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ShopSection() {
  const [active, setActive] = useState<CategorySlug>("terrarium");
  const current = categories.find((c) => c.slug === active)!;
  const list = products.filter((p) => p.category === active);

  return (
    <section id="shop" className="relative overflow-hidden bg-ink-2 px-6 py-24 text-bone sm:px-10 lg:py-36">
      <FilmGrain />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.32em] uppercase text-moss">Shop</p>
          <h2 className="mt-4 font-serif text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.98]">
            Three ways to keep something alive.
          </h2>
        </Reveal>

        {/* Category tiles double as the tabs. */}
        <Reveal delay={0.1}>
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
                  className={`group relative aspect-[4/3] overflow-hidden rounded-3xl text-left transition ${on ? "ring-2 ring-moss" : "ring-1 ring-white/10 hover:ring-white/30"}`}
                >
                  <Image src={c.image} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className={`object-cover transition duration-700 ${on ? "scale-105" : "scale-100 group-hover:scale-105"}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-serif text-2xl">{c.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-bone/70">{c.blurb}</p>
                  </div>
                  {on && <motion.span layoutId="shop-tab" className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-moss" />}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-14 flex items-baseline justify-between border-b border-white/10 pb-4">
          <h3 className="font-serif text-2xl">{current.name}</h3>
          <span className="text-xs tracking-[0.2em] uppercase text-bone/50">{list.length} pieces</span>
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
                transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
              >
                <Link href={`/product/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/5">
                    <Image src={p.images[0]} alt={p.name} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <div>
                      <p className="font-serif text-xl leading-tight">{p.name}</p>
                      {p.latin && <p className="font-serif text-sm italic text-bone/55">{p.latin}</p>}
                    </div>
                    <span className="text-sm tabular-nums text-bone/80">{formatPrice(p.price)}</span>
                  </div>
                  <p className="mt-1 text-xs text-bone/55">{p.tagline}</p>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
