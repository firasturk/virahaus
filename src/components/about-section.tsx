"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import FilmGrain from "./film-grain";
import Reveal from "./reveal";

const PRINCIPLES = [
  ["Sealed ecosystems", "Each piece runs its own weather. Water cycles; nothing is wasted."],
  ["Built by hand", "Stone placed, moss pinned, glass closed — one at a time, in the studio."],
  ["Made to outlast you", "A terrarium at Kew has been shut since 1960. Ours are built the same way."],
];

export default function AboutSection() {
  const reduced = useReducedMotion();

  return (
    <section id="about" className="relative overflow-hidden bg-ink px-6 py-24 text-bone sm:px-10 lg:py-36">
      <FilmGrain />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="text-[0.7rem] tracking-[0.32em] uppercase text-moss">About the studio</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-serif text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[0.98] tracking-[-0.01em]">
              We build small worlds
              <br />
              <em className="text-rust-soft">and seal them shut.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-bone/75">
              ViraHaus makes terrariums, vivariums and the plants that live inside them. A closed jar of moss and stone
              becomes a working ecosystem: it rains on its own, feeds on its own light, and asks for almost nothing back.
            </p>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-bone/75">
              Every piece is planted by hand in the studio, photographed, and delivered with a care guide short enough to
              actually read. Nothing here is as dead as it looks.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="mt-10 grid gap-3 sm:grid-cols-3">
              {PRINCIPLES.map(([title, body]) => (
                <li key={title} className="glass rounded-2xl p-5">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-bone/60">{body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={40}>
          {/* Floats slowly, so the render reads as weightless rather than placed. */}
          <motion.div
            className="relative aspect-[16/10] overflow-hidden rounded-[2rem] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
            animate={reduced ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/media/about-terrarium.jpg"
              alt="An abstract glass terrarium floating in darkness, lit from the side."
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
