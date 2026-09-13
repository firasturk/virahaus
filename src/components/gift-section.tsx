"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { formatPrice, getProduct } from "@/data/products";
import GlyphRise from "./glyph-rise";
import Magnetic from "./magnetic";
import { figSpring } from "./motion";
import Reveal from "./reveal";

/* Eight friction-reducing lines for under the CTA; one shows at a time. */
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
    <section id="gift" className="relative overflow-hidden px-6 py-28 text-white sm:px-10 lg:py-40">
      {/* The desk photo carries the section, as the driftwood carries the hero. */}
      <Image src="/media/products/lifestyle-desk.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/70" />
      <div className="rails" aria-hidden>
        <span style={{ left: "25%", background: "var(--hair-light)" }} /><span style={{ left: "50%", background: "var(--hair-light)" }} /><span style={{ left: "75%", background: "var(--hair-light)" }} />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal><p className="kicker !text-white/70">Gifting</p></Reveal>
          <h2 className="display mt-6 text-[clamp(2.6rem,5.6vw,4.8rem)]">
            <GlyphRise text="Send a lifetime" />
            <br />
            <GlyphRise text="for your loved ones." offset={15} />
          </h2>
          <Reveal delay={0.25}>
            <p className="mx-auto mt-7 max-w-lg text-[1.05rem] leading-relaxed text-white/80">
              Flowers last a week. A sealed world keeps going for years — and every time it rains inside the glass,
              they&apos;ll think of you.
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="mt-10 flex flex-col items-center">
              <Magnetic>
                <Link href="/#shop" className="pill-light">
                  <span className="dot"><span className="h-1.5 w-1.5 rounded-full bg-white" /></span>
                  Send a gift
                </Link>
              </Magnetic>
              <div className="relative mt-4 h-6 w-full max-w-md" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={i}
                    className="absolute inset-0 text-center text-xs text-white/70"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.6, ease: figSpring }}
                  >
                    {GIFT_MICROCOPY[i]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.4}>
          <ul className="mt-20 grid gap-4 sm:grid-cols-3">
            {PICKS.map((p) => (
              <li key={p.slug}>
                <Link href={`/product/${p.slug}`} className="tile group flex items-center gap-4 p-3 transition hover:bg-white">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[1.25rem]">
                    <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="min-w-0">
                    <p className="display truncate text-lg tracking-[-0.07em]">{p.name}</p>
                    <p className="text-xs text-card-ink/70">{formatPrice(p.price)} · {p.tagline}</p>
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
