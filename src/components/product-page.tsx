"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { formatPrice, type Product } from "@/data/products";
import { useCart } from "./cart";
import GlyphRise from "./glyph-rise";
import Magnetic from "./magnetic";
import { figSpring } from "./motion";
import Reveal from "./reveal";

export default function ProductPage({ product, related }: { product: Product; related: Product[] }) {
  const { add } = useCart();
  const [shot, setShot] = useState(0);
  const [variant, setVariant] = useState(0);
  const price = product.price + product.variants.options[variant].delta;

  return (
    <div className="relative overflow-hidden bg-sand text-ink">
      <div className="rails" aria-hidden><span style={{ left: "25%" }} /><span style={{ left: "50%" }} /><span style={{ left: "75%" }} /></div>

      <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-24 sm:px-10 lg:pt-36">
        <nav className="kicker mb-8">
          <Link href="/#shop" className="hover:text-ink">Shop</Link>
          <span className="mx-2 text-ink/40">/</span>
          <span>{product.category}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          {/* Gallery: sticky, zoom follows the cursor, thumbnails crossfade. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Zoomable>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={product.images[shot]} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: figSpring }}>
                  <Image src={product.images[shot]} alt={product.name} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </Zoomable>
            {product.images.length > 1 && (
              <ul className="mt-4 flex gap-3">
                {product.images.map((src, i) => (
                  <li key={src + i}>
                    <button type="button" onClick={() => setShot(i)} aria-label={`View image ${i + 1}`} aria-current={i === shot}
                      className={`relative h-20 w-16 overflow-hidden rounded-[1.25rem] bg-card transition ${i === shot ? "ring-2 ring-rust" : "ring-1 ring-ink/10 opacity-75 hover:opacity-100"}`}>
                      <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Details */}
          <div>
            <Reveal><p className="kicker">{product.category}</p></Reveal>
            <h1 className="display mt-5 text-[clamp(2.6rem,5vw,4.6rem)]">
              <GlyphRise text={product.name} />
            </h1>
            {product.latin && <Reveal delay={0.15}><p className="mt-2 text-sm text-rust">{product.latin}</p></Reveal>}

            <Reveal delay={0.2}>
              <p className="display mt-6 text-3xl tracking-[-0.08em] tabular-nums">{formatPrice(price)}</p>
              <p className="mt-3 text-[1.05rem] text-rust">{product.tagline}</p>
            </Reveal>

            <Reveal delay={0.25}>
              <fieldset className="mt-9">
                <legend className="kicker">{product.variants.name}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.options.map((o, i) => (
                    <button key={o.label} type="button" onClick={() => setVariant(i)} aria-pressed={i === variant}
                      className={`rounded-full border px-4 py-2 text-sm transition ${i === variant ? "border-ink bg-ink text-sand" : "border-ink/30 text-ink hover:border-ink/70"}`}>
                      {o.label}
                      {o.delta > 0 && <span className="ml-2 text-xs opacity-60">+{formatPrice(o.delta)}</span>}
                    </button>
                  ))}
                </div>
              </fieldset>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-9">
                <Magnetic strength={0.3}>
                  <button type="button" className="pill-dark"
                    onClick={() => add({ slug: product.slug, name: product.name, variant: product.variants.options[variant].label, price, image: product.images[0] })}>
                    <span className="dot"><span className="h-1.5 w-1.5 rounded-full bg-ink" /></span>
                    Add to cart
                  </button>
                </Magnetic>
                <p className="mt-3 text-xs text-rust">Nothing charged until it ships · Free replacement if it arrives damaged</p>
              </div>
            </Reveal>

            <Reveal delay={0.35}>
              <p className="mt-10 max-w-prose text-[1.02rem] leading-relaxed text-ink/75">{product.description}</p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Full-bleed lifestyle, type on imagery in white like the hero. */}
      <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
        <Image src={product.images[1] ?? product.images[0]} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-14 sm:px-10">
          <p className="display mx-auto max-w-7xl text-[clamp(1.8rem,3.4vw,3rem)] text-white">
            <GlyphRise text="It rains on its own." />
          </p>
        </div>
      </section>

      {/* Specs as EcoStove-style tiles. */}
      <section className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <Reveal><h2 className="kicker">Specifications</h2></Reveal>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.specs.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <li className="tile h-full p-6">
                <p className="text-xs text-card-ink/70">{s.label}</p>
                <p className="display mt-3 text-[1.35rem] tracking-[-0.07em]">{s.value}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <Carousel items={related} />
    </div>
  );
}

/* Cursor position becomes the transform origin via a CSS variable — no re-render. */
function Zoomable({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[2.5rem] bg-card"
      onPointerMove={(e) => {
        const el = ref.current; if (!el || e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--zx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        el.style.setProperty("--zy", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      }}>
      <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[2.1]" style={{ transformOrigin: "var(--zx, 50%) var(--zy, 50%)" }}>
        {children}
      </div>
    </div>
  );
}

function Carousel({ items }: { items: Product[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [bound, setBound] = useState(0);
  useEffect(() => {
    const el = track.current; if (!el) return;
    const measure = () => setBound(Math.max(0, el.scrollWidth - el.offsetWidth));
    measure(); const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect();
  }, [items]);

  return (
    <section className="relative border-t border-[var(--hair-dark)] py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal>
          <div className="flex items-baseline justify-between">
            <h2 className="display text-3xl tracking-[-0.08em]">You may also like</h2>
            <span className="kicker hidden sm:inline">Drag</span>
          </div>
        </Reveal>
      </div>
      <div className="mt-8 overflow-hidden pl-6 sm:pl-10">
        <motion.ul ref={track} drag="x" dragConstraints={{ left: -bound, right: 0 }} dragElastic={0.08} className="flex w-max cursor-grab gap-5 pr-10 active:cursor-grabbing">
          {items.map((p) => (
            <li key={p.slug} className="w-[68vw] shrink-0 sm:w-[300px]">
              <Link href={`/product/${p.slug}`} draggable={false} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-card">
                  <Image src={p.images[0]} alt={p.name} fill sizes="300px" draggable={false} className="object-cover transition duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="display text-[1.2rem] tracking-[-0.07em]">{p.name}</p>
                  <span className="text-sm tabular-nums">{formatPrice(p.price)}</span>
                </div>
              </Link>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
