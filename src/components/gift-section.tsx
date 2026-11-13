"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import GlyphRise from "./glyph-rise";
import Reveal from "./reveal";
import { ShopLink } from "./shop-filter";

/* Eight short lines that answer a gift-giver's doubts; one shows at a time. */
export const GIFT_MICROCOPY = [
  "No watering, ever. It only needs light.",
  "Handmade, one at a time.",
  "A handwritten note, included at no cost.",
  "Jars and plants are ready now.",
  "Tell us the day. We'll deliver it then.",
  "No account needed — order on WhatsApp in a minute.",
  "Not sure what to pick? Ask us on WhatsApp.",
  "Nothing to pay until we've confirmed it with you.",
];

export default function GiftSection() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % GIFT_MICROCOPY.length), 2800);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section id="gift" className="relative flex min-h-[80svh] items-center overflow-hidden px-5 py-24 text-white sm:px-10">
      <video className="absolute inset-0 h-full w-full object-cover" poster="/media/gift-micro.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden>
        <source src="/media/gift-micro.mp4" type="video/mp4" />
        <source src="/media/gift-micro.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/30 to-ink/60" />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal><p className="kicker !text-white/75">Gifting</p></Reveal>
        <h2 className="display mt-6 text-[clamp(2.3rem,5.4vw,4.4rem)]">
          <GlyphRise text="Send a lifetime" />
          <br />
          <GlyphRise text="for your loved ones." offset={15} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/85">
            Flowers last a week. A handmade sealed jar keeps living for years with nothing but light — and every time it rains inside the glass, they&apos;ll think of you.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-9 flex flex-col items-center">
          <ShopLink to="terrarium" className="pill-light">
            <span className="dot"><span className="h-1.5 w-1.5 rounded-full bg-white" /></span>
            Choose a no-care gift
          </ShopLink>
          <div className="relative mt-5 h-6 w-full max-w-md" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={i}
                className="absolute inset-0 text-center text-sm text-white/80"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45 }}
              >
                {GIFT_MICROCOPY[i]}
              </motion.p>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
