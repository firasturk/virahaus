"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { categories, products, type CategorySlug } from "@/data/products";
import { figSpring } from "./motion";

/*
 * Pinned parallax stage after the "Motion 01" template (GRIGOLETTO), rebuilt on
 * the hero's system. One section holds three states — Terrarium, Vivarium,
 * Plants — and scrolling inside it switches them.
 *
 * Timings are the template's own keyframes (11.4s timeline, read from Figma):
 *   intro   background 1.36 -> 1 (spring), letters rise 100 -> -40 and fade in, 60ms apart (expo-out),
 *           title drops from -104 and copy rises from 64 (spring)
 *   exit    letters fall to +360 on [1,0,0,1], copy leaves the same way
 *   enter   next word rises as in the intro; cards pop 0.6 -> 1 on
 *           [0.15,0.52,0.5,1] and rise 100 -> 0 on [0.3,-1.2,0.45,1] (overshoot),
 *           100ms apart
 *
 * Layer order: video, haze, category word, copy, cards.
 */

const EXPO = [0.16, 1, 0.3, 1] as const;
const SNAP = [1, 0, 0, 1] as const;
const POP_OPACITY = [0.09, 0.55, 0.5, 1] as const;
const POP_SCALE = [0.15, 0.52, 0.5, 1] as const;
const POP_Y = [0.3, -1.2, 0.45, 1] as const;

const STATES: { slug: CategorySlug; word: string; title: [string, string]; copy: string }[] = [
  {
    slug: "terrarium", word: "Terrarium",
    title: ["Sealed worlds", "that keep their own weather."],
    copy: "Glass, stone and moss, closed for good. It rains inside on its own, feeds on its own light, and asks for a mist once a month.",
  },
  {
    slug: "vivarium", word: "Vivarium",
    title: ["Open, misted,", "alive."],
    copy: "A planted cork wall, a shallow pool, a bar of light and a fine mist on a timer. Built for the plants that need weather.",
  },
  {
    slug: "plants", word: "Plants",
    title: ["Grown for glass,", "happy in humidity."],
    copy: "Small, patterned and slow — caladium, begonia, bromeliad, earth star — chosen because they thrive where the air stays wet.",
  },
];

export default function MotionSection() {
  const wrap = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setMobile(mq.matches);
    apply(); mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* Which of the three states the scroll position selects. */
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const [state, setState] = useState(0);
  const stateRef = useRef(0);
  const [switched, setSwitched] = useState(false);
  useEffect(() => scrollYProgress.on("change", (p) => {
    const next = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
    if (next === stateRef.current) return;
    stateRef.current = next; setState(next); setSwitched(true);
  }), [scrollYProgress]);

  /* The intro plays once, when the stage first comes into view. */
  const inView = useInView(wrap, { once: true, amount: 0.25 });
  const intro = inView || !!reduced;

  /* Slow parallax on the background against the pinned frame. */
  const bgY = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]), { stiffness: 60, damping: 20 });
  
  if (mobile) return <MobileStates />;

  const s = STATES[state];
  /* The template's intro waits on the stage; a scroll switch starts at once. */
  const lead = switched ? 0 : 1;
  const cards = products.filter((p) => p.category === s.slug).slice(0, 3);

  return (
    <section ref={wrap} id="about" className="relative h-[400svh] bg-sand text-ink">
      <div className="sticky top-0 h-svh overflow-hidden [container-type:inline-size]">
        {/* 1 · background video, one per state, crossfading */}
        <AnimatePresence initial={false}>
          <motion.div key={s.slug} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: EXPO }}>
            <motion.div style={{ y: bgY }} className="absolute inset-[-6%_0]" initial={{ scale: 1.36 }} animate={intro ? { scale: 1 } : { scale: 1.36 }} transition={{ duration: 2, ease: figSpring }}>
              <video className="h-full w-full object-cover" poster={`/media/bg-${s.slug}.jpg`} autoPlay muted loop playsInline preload="metadata">
                <source src={`/media/bg-${s.slug}.webm`} type="video/webm" /><source src={`/media/bg-${s.slug}.mp4`} type="video/mp4" />
              </video>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* 2 · haze, as the template's 60% wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-sand/70 via-sand/10 to-sand/40" />
        <div className="rails" aria-hidden><span style={{ left: "25%", background: "var(--hair-dark)" }} /><span style={{ left: "50%", background: "var(--hair-dark)" }} /><span style={{ left: "75%", background: "var(--hair-dark)" }} /></div>

        {/* 3 · giant word */}
        <div className="absolute bottom-[5%] left-[3.6%] z-10 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2 key={s.word} className="display flex whitespace-nowrap leading-none text-white" style={{ fontSize: `${Math.min(11, 95 / s.word.length)}cqw` }} aria-label={s.word}>
              {Array.from(s.word).map((ch, i) => (
                <motion.span key={i} aria-hidden className="inline-block"
                  initial={{ opacity: 0, y: "0.3em" }}
                  animate={intro ? { opacity: 1, y: "-0.06em" } : {}}
                  exit={{ y: "1.1em", transition: { duration: 0.7, ease: SNAP, delay: i * 0.02 } }}
                  transition={{ opacity: { duration: 0.8, ease: "easeOut", delay: 0.6 * lead + i * 0.06 }, y: { duration: 1.2, ease: EXPO, delay: 0.6 * lead + i * 0.06 } }}>
                  {ch}
                </motion.span>
              ))}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* 5 · copy */}
        <div className="absolute top-[19%] left-[3.6%] z-30 w-[26%]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={s.slug} exit={{ opacity: 0, y: -60, transition: { duration: 0.9, ease: SNAP } }}>
              <motion.p className="kicker" initial={{ opacity: 0 }} animate={intro ? { opacity: 1 } : {}} transition={{ delay: 0.5 * lead }}>{categories.find((c) => c.slug === s.slug)!.name}</motion.p>
              <div className="mt-4 overflow-hidden">
                <motion.h3 className="display text-[2.4cqw]" initial={{ y: -104 }} animate={intro ? { y: 0 } : {}} transition={{ duration: 1.5, ease: figSpring, delay: 0.5 * lead }}>
                  {s.title[0]}<br />{s.title[1]}
                </motion.h3>
              </div>
              <div className="mt-5 overflow-hidden">
                <motion.p className="text-[0.98cqw] leading-relaxed text-ink/70" initial={{ y: 64 }} animate={intro ? { y: 0 } : {}} transition={{ duration: 1.5, ease: figSpring, delay: 0.5 * lead }}>{s.copy}</motion.p>
              </div>
              <motion.span aria-hidden className="mt-6 block h-8 w-8 text-ink/70" initial={{ opacity: 0, y: 60 }} animate={intro ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.5, ease: figSpring, delay: 0.6 * lead }}>
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M6 26 26 6M10 6h16v16" /></svg>
              </motion.span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 6 · vertical text, right */}
        <motion.p className="absolute top-[14%] right-[2.6%] z-30 text-[0.7cqw] tracking-[0.3em] text-ink/60 uppercase [writing-mode:vertical-rl]" initial={{ x: 48, opacity: 0 }} animate={intro ? { x: 0, opacity: 1 } : {}} transition={{ duration: 1.4, ease: figSpring, delay: 0.6 }}>
          Find your inner green
        </motion.p>

        {/* 7 · cards, bottom right, stepping smaller like the template */}
        <div className="absolute right-[-2%] bottom-[6%] z-40 flex items-end gap-[1.4cqw]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul key={s.slug} className="flex items-end gap-[1.4cqw]" exit={{ opacity: 0, y: 40, transition: { duration: 0.6, ease: SNAP } }}>
              {cards.map((p, i) => {
                const w = [16.3, 14.1, 10.9][i];
                return (
                  <motion.li key={p.slug} style={{ width: `${w}cqw` }}
                    initial={{ opacity: 0, scale: 0.6, y: 100 }}
                    animate={intro ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{ opacity: { duration: 0.27, ease: POP_OPACITY, delay: 0.6 * lead + 0.4 + i * 0.1 }, scale: { duration: 0.52, ease: POP_SCALE, delay: 0.6 * lead + 0.4 + i * 0.1 }, y: { duration: 0.67, ease: POP_Y, delay: 0.6 * lead + 0.4 + i * 0.1 } }}>
                    <Link href={`/product/${p.slug}`} className="group relative block aspect-[235/280] overflow-hidden rounded-[1.6cqw] bg-card">
                      <Image src={p.images[0]} alt={p.name} fill sizes="20vw" className="object-cover transition duration-[1200ms] group-hover:scale-105" />
                      <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ink/80 to-transparent" />
                      <span className="absolute top-[6%] right-[6%] grid h-[2.6cqw] w-[2.6cqw] place-items-center rounded-full bg-white/90 text-ink"><span className="h-1.5 w-1.5 rounded-full bg-ink" /></span>
                      <p className="display absolute bottom-[7%] left-[7%] text-[1.4cqw] tracking-[-0.06em] text-white">{p.name}</p>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

/* Below 768px the pin is dropped and the three states stack, each with its own video. */
function MobileStates() {
  return (
    <section id="about" className="bg-sand text-ink">
      {STATES.map((s, i) => {
        const cards = products.filter((p) => p.category === s.slug).slice(0, 3);
        return (
          <div key={s.slug} className="relative min-h-[100svh] overflow-hidden">
            <video className="absolute inset-0 h-full w-full object-cover" poster={`/media/bg-${s.slug}.jpg`} autoPlay muted loop playsInline preload="metadata"><source src={`/media/bg-${s.slug}.webm`} type="video/webm" /><source src={`/media/bg-${s.slug}.mp4`} type="video/mp4" /></video>
            <div className="absolute inset-0 bg-gradient-to-t from-sand/70 via-sand/10 to-sand/40" />
            <div className="relative flex min-h-[100svh] flex-col justify-between p-6">
              <div><p className="kicker">0{i + 1}</p><h3 className="display mt-3 text-3xl">{s.title[0]}<br />{s.title[1]}</h3><p className="mt-4 max-w-sm text-sm text-ink/70">{s.copy}</p></div>
              <div><p className="display text-[26vw] leading-none text-white">{s.word}</p>
                <ul className="mt-3 flex gap-3 overflow-x-auto pb-2">{cards.map((p) => (<li key={p.slug} className="w-36 shrink-0"><Link href={`/product/${p.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-card"><Image src={p.images[0]} alt={p.name} fill sizes="144px" className="object-cover" /><p className="display absolute bottom-2 left-3 text-base text-white">{p.name}</p></Link></li>))}</ul>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
