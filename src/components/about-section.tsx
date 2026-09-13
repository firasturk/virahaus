"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import GlyphRise from "./glyph-rise";
import Reveal from "./reveal";

const PRINCIPLES = [
  ["Sealed ecosystems", "Each piece runs its own weather. Water cycles; nothing is wasted."],
  ["Built by hand", "Stone placed, moss pinned, glass closed — one at a time, in the studio."],
  ["Made to outlast you", "A terrarium at Kew has been shut since 1960. Ours are built the same way."],
];

export default function AboutSection() {
  const reduced = useReducedMotion();

  return (
    <section id="about" className="relative overflow-hidden bg-sand px-6 py-24 text-ink sm:px-10 lg:py-36">
      <div className="rails" aria-hidden><span style={{ left: "25%" }} /><span style={{ left: "50%" }} /><span style={{ left: "75%" }} /></div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div>
          <Reveal><p className="kicker">About the studio</p></Reveal>
          <h2 className="display mt-6 text-[clamp(2.4rem,4.6vw,3.9rem)]">
            <GlyphRise text="We build small" />
            <br />
            <GlyphRise text="worlds, sealed." offset={14} />
          </h2>
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-rust">
              ViraHaus makes terrariums, vivariums and the plants that live inside them. A closed jar of moss and stone
              becomes a working ecosystem: it rains on its own, feeds on its own light, and asks for almost nothing back.
            </p>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink/75">
              Every piece is planted by hand in the studio, photographed, and delivered with a care guide short enough to
              actually read. Nothing here is as dead as it looks.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <ul className="mt-10 grid gap-3 sm:grid-cols-3">
              {PRINCIPLES.map(([title, body]) => (
                <li key={title} className="tile p-5">
                  <p className="display text-[1.15rem] tracking-[-0.06em]">{title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-card-ink/70">{body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15} y={40}>
          <motion.div
            className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] shadow-[0_40px_90px_-40px_rgba(22,20,15,0.6)]"
            animate={reduced ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src="/media/about-terrarium.jpg" alt="A sealed glass terrarium lit from above." fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
