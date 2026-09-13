"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { formatPrice, getProduct } from "@/data/products";
import FilmGrain from "./film-grain";
import Magnetic from "./magnetic";
import Reveal from "./reveal";

/*
 * Eight friction-reducing lines for under the CTA. One shows at a time and
 * they rotate, so every line gets its moment without a wall of fine print.
 */
export const GIFT_MICROCOPY = [
  "No account needed — check out as a guest.",
  "Free replacement if it arrives damaged.",
  "Pick the delivery date. We'll hold it until then.",
  "A handwritten note, included at no cost.",
  "Ships in 48 hours, packed to travel.",
  "30-day thriving guarantee, or we replant it.",
  "Care guide in the box. No green thumb required.",
  "Secure checkout. Nothing charged until it ships.",
];

const PICKS = ["ember-jar", "canopy-tank", "tillandsia"].map((s) => getProduct(s)!);

export default function GiftSection() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % GIFT_MICROCOPY.length), 2800);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section id="gift" className="relative overflow-hidden bg-ink px-6 py-28 text-bone sm:px-10 lg:py-40">
      <Image src="/media/products/lifestyle-desk.jpg" alt="" fill sizes="100vw" className="object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      <FilmGrain />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-[0.7rem] tracking-[0.32em] uppercase text-moss">Gifting</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-serif text-[clamp(2.8rem,6.4vw,5.6rem)] leading-[0.95] tracking-[-0.01em]">
              Send a lifetime
              <br />
              <em className="text-rust-soft">for your loved ones.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-7 max-w-lg text-[1.05rem] leading-relaxed text-bone/70">
              Flowers last a week. A sealed world keeps going for years — and every time it rains inside the glass,
              they&apos;ll think of you.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-col items-center">
              <Magnetic>
                <Link
                  href="/#shop"
                  className="inline-flex h-14 items-center gap-3 rounded-full bg-bone px-8 text-sm font-medium tracking-wide text-ink transition hover:bg-white"
                >
                  Send a gift
                  <span aria-hidden>→</span>
                </Link>
              </Magnetic>

              <div className="relative mt-4 h-6 w-full max-w-md" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={i}
                    className="absolute inset-0 text-center text-xs text-bone/55"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {GIFT_MICROCOPY[i]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.3}>
          <ul className="mt-20 grid gap-4 sm:grid-cols-3">
            {PICKS.map((p) => (
              <li key={p.slug}>
                <Link href={`/product/${p.slug}`} className="glass group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white/[0.08]">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl">
                    <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-serif text-lg">{p.name}</p>
                    <p className="text-xs text-bone/55">{formatPrice(p.price)} · {p.tagline}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
