"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

import { formatPrice, getProduct } from "@/data/products";
import GlyphRise from "./glyph-rise";
import Magnetic from "./magnetic";
import Reveal from "./reveal";

const PRINCIPLES = [
  ["Sealed ecosystems", "Each piece runs its own weather. Water cycles; nothing is wasted."],
  ["Built by hand", "Stone placed, moss pinned, glass closed — one at a time, in the studio."],
  ["Made to outlast you", "A terrarium at Kew has been shut since 1960. Ours are built the same way."],
];

const FEATURE = getProduct("ember-jar")!;

/*
 * A floating product with layered parallax. Everything is driven by the
 * section's scroll progress (0 = its top enters the viewport, 1 = its bottom
 * leaves), each layer at its own rate so the stack reads as depth:
 *
 *   ghost name  slowest, behind
 *   panel       slow
 *   chips       medium, drifting up past the jar
 *   jar         fastest, plus a scale swell through the middle and an idle bob
 *   shadow      breathes against the bob so the jar reads as airborne
 *
 * The jar photo sits on near-black; the panel is the same tone and the photo
 * is edge-masked, so the rectangle disappears and only the jar remains.
 */
export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const soft = { stiffness: 70, damping: 22, mass: 0.6 };
  const yPanel = useSpring(useTransform(scrollYProgress, [0, 1], [90, -90]), soft);
  const yJar = useSpring(useTransform(scrollYProgress, [0, 1], [170, -190]), soft);
  const sJar = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0.86, 1.04, 0.94]), soft);
  const rJar = useSpring(useTransform(scrollYProgress, [0, 1], [-2.5, 2.5]), soft);
  const yChips = useSpring(useTransform(scrollYProgress, [0, 1], [140, -260]), soft);
  const yGhost = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]), soft);
  const oGhost = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [0, 1, 0]);

  const still = { y: 0, scale: 1, rotate: 0 };

  return (
    <section ref={ref} id="about" className="relative overflow-hidden bg-sand px-6 py-24 text-ink sm:px-10 lg:py-36">
      <div className="rails" aria-hidden><span style={{ left: "25%" }} /><span style={{ left: "50%" }} /><span style={{ left: "75%" }} /></div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* ── Copy ── */}
        <div className="order-2 lg:order-1">
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

        {/* ── Floating product ── */}
        <div className="order-1 lg:order-2">
          <motion.div
            style={reduced ? undefined : { y: yPanel }}
            className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#151513] shadow-[0_60px_120px_-50px_rgba(22,20,15,0.7)] sm:aspect-[5/6]"
          >
            {/* Studio light from above, so the panel is not a flat black. */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,255,255,0.13),transparent_70%)]" />

            <motion.p
              aria-hidden
              style={reduced ? undefined : { y: yGhost, opacity: oGhost }}
              className="display pointer-events-none absolute inset-x-0 top-[8%] text-center text-[clamp(4rem,11vw,9rem)] text-white/[0.06]"
            >
              Ember
            </motion.p>

            <motion.div style={reduced ? still : { y: yJar, scale: sJar, rotate: rJar }} className="absolute inset-0">
              {/* Idle bob rides on top of the scroll-driven transform. */}
              <motion.div
                animate={reduced ? undefined : { y: [0, -16, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Link href={`/product/${FEATURE.slug}`} aria-label={FEATURE.name} className="absolute inset-0">
                  <Image
                    src={FEATURE.images[0]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-contain [mask-image:radial-gradient(ellipse_56%_66%_at_50%_52%,#000_48%,transparent_96%)]"
                  />
                </Link>
              </motion.div>
              <motion.div
                aria-hidden
                animate={reduced ? undefined : { scaleX: [1, 0.82, 1], opacity: [0.55, 0.3, 0.55] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[9%] left-1/2 h-8 w-[46%] -translate-x-1/2 rounded-full bg-black/80 blur-xl"
              />
            </motion.div>

            {/* Spec chips drift up past the jar at their own rate. */}
            <motion.ul style={reduced ? undefined : { y: yChips }} className="pointer-events-none absolute inset-0 text-[0.72rem]">
              <li className="tile absolute top-[22%] left-[6%] px-3 py-2">{FEATURE.specs[0].value}</li>
              <li className="tile absolute top-[48%] right-[5%] px-3 py-2">Runs its own weather</li>
              <li className="tile absolute bottom-[26%] left-[9%] px-3 py-2">Mist once a month</li>
            </motion.ul>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white sm:p-8">
              <div>
                <p className="kicker !text-white/60">{FEATURE.category}</p>
                <p className="display mt-1 text-2xl tracking-[-0.08em]">{FEATURE.name}</p>
              </div>
              <Magnetic strength={0.25}>
                <Link href={`/product/${FEATURE.slug}`} className="pill-light !h-12 text-sm">
                  <span className="dot !h-8 !w-8"><span className="h-1.5 w-1.5 rounded-full bg-white" /></span>
                  {formatPrice(FEATURE.price)}
                </Link>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
