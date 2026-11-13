"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { DICT, href } from "@/lib/dict";
import type { Lang } from "@/lib/i18n";
import GlyphRise from "./glyph-rise";
import Reveal from "./reveal";

export default function GiftSection({ lang }: { lang: Lang }) {
  const t = DICT[lang].gifting;
  const ar = lang === "ar";
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % t.lines.length), 2800);
    return () => window.clearInterval(id);
  }, [t.lines.length]);

  return (
    <section id="gift" className="relative flex min-h-[80svh] items-center overflow-hidden px-5 py-24 text-white sm:px-10">
      <video className="absolute inset-0 h-full w-full object-cover" poster="/media/gift-micro.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden>
        <source src="/media/gift-micro.mp4" type="video/mp4" />
        <source src="/media/gift-micro.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/35 to-ink/65" />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal><p className="kicker !text-white/80">{t.kicker}</p></Reveal>
        <h2 className="display mt-6 text-[clamp(2.3rem,5.4vw,4.4rem)]">
          {ar ? (
            <Reveal>{t.line1}<br />{t.line2}</Reveal>
          ) : (
            <>
              <GlyphRise text={t.line1} />
              <br />
              <GlyphRise text={t.line2} offset={15} />
            </>
          )}
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/85">{t.text}</p>
        </Reveal>

        <Reveal delay={0.3} className="mt-9 flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-2">
            {t.bands.map((b) => (
              <Link key={b.band} href={href(lang, `/shop#price-${b.band}`)} className="rounded-full border border-white/40 bg-white/5 px-5 py-2.5 text-sm backdrop-blur transition hover:border-white hover:bg-white/15">
                {b.label}
              </Link>
            ))}
          </div>
          <Link href={href(lang, "/shop")} className="pill-light mt-5">
            <span className="dot"><span className="h-1.5 w-1.5 rounded-full bg-white" /></span>
            {t.cta}
          </Link>
          <p className="mt-6 text-xs text-white/65">{t.occasions}</p>
          <div className="relative mt-3 h-6 w-full max-w-md" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p key={i} className="absolute inset-0 text-center text-sm text-white/85" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.45 }}>
                {t.lines[i]}
              </motion.p>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
