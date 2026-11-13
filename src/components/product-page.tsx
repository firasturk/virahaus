"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { categories, formatPrice, type Product } from "@/data/products";
import { whatsappUrl } from "@/lib/contact";
import { useCart } from "./cart";
import ProductCard from "./product-card";
import Reveal from "./reveal";
import { ShopLink } from "./shop-filter";

const PROMISES = [
  "Ordered on WhatsApp — confirmed with you before anything is charged",
  "Care guide included in the box",
  "Gift note available at checkout",
];

export default function ProductPage({ product, related }: { product: Product; related: Product[] }) {
  const { add } = useCart();
  const [shot, setShot] = useState(0);
  const [variant, setVariant] = useState(0);
  const [qty, setQty] = useState(1);

  const category = categories.find((c) => c.slug === product.category)!;
  const option = product.variants.options[variant];
  const price = product.price + option.delta;

  const addToCart = () => add({ slug: product.slug, name: product.name, variant: option.label, price, image: product.images[0] }, qty);
  const orderNow = whatsappUrl(`Hi ViraHaus, I'd like to order:\n\n• ${product.name} (${option.label}) ×${qty} — ${formatPrice(price * qty)}`);

  return (
    <div className="bg-sand text-ink">
      <div className="mx-auto max-w-7xl px-5 pt-28 sm:px-10 lg:pt-32">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-ink/55">
          <ShopLink to="all" className="hover:text-ink">Shop</ShopLink>
          <span aria-hidden>/</span>
          <ShopLink to={product.category} className="hover:text-ink">{category.name}</ShopLink>
          <span aria-hidden>/</span>
          <span className="truncate text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-card">
              <AnimatePresence initial={false}>
                <motion.div key={shot} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                  <Image src={product.images[shot]} alt={product.name} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-3">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setShot(i)}
                    aria-label={`Photo ${i + 1}`}
                    aria-pressed={i === shot}
                    className={`relative h-20 w-16 overflow-hidden rounded-2xl bg-card transition ${i === shot ? "ring-2 ring-ink" : "opacity-70 hover:opacity-100"}`}
                  >
                    <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy box */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="kicker">{category.name}</p>
            <h1 className="display mt-3 text-[clamp(2.2rem,4.2vw,3.4rem)]">{product.name}</h1>
            {product.latin && <p className="mt-1 text-sm text-ink/55 italic">{product.latin}</p>}
            <p className="mt-5 text-[1.05rem] leading-relaxed text-ink/70">{product.tagline}</p>
            <p className="display mt-6 text-[2rem] tracking-[-0.08em] tabular-nums">{formatPrice(price)}</p>

            {product.variants.options.length > 1 && (
              <fieldset className="mt-8">
                <legend className="kicker">{product.variants.name}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.options.map((o, i) => (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() => setVariant(i)}
                      aria-pressed={i === variant}
                      className={`rounded-full border px-4 py-2.5 text-sm transition ${i === variant ? "border-ink bg-ink text-sand" : "border-ink/30 hover:border-ink/70"}`}
                    >
                      {o.label}
                      {o.delta > 0 && <span className="ml-2 text-xs opacity-60">+{formatPrice(o.delta)}</span>}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="mt-8 flex gap-3">
              <div className="inline-flex h-14 items-center rounded-full border border-ink/30">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-14 w-12 text-lg opacity-70 hover:opacity-100" aria-label="Decrease quantity">−</button>
                <span className="w-6 text-center tabular-nums" aria-live="polite">{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} className="h-14 w-12 text-lg opacity-70 hover:opacity-100" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" onClick={addToCart} className="h-14 flex-1 rounded-full bg-ink text-[0.95rem] text-sand transition hover:bg-black">
                Add to cart · {formatPrice(price * qty)}
              </button>
            </div>
            <a href={orderNow} target="_blank" rel="noopener" className="mt-3 flex h-14 items-center justify-center rounded-full border border-ink/30 text-[0.95rem] transition hover:border-ink">
              Order this now on WhatsApp
            </a>

            <ul className="mt-8 space-y-3 border-t border-[var(--hair-dark)] pt-6 text-sm text-ink/70">
              {PROMISES.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rust" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Details */}
        <Reveal className="mt-20 grid gap-10 border-t border-[var(--hair-dark)] pt-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="display text-[1.8rem]">About this piece</h2>
            <p className="mt-4 max-w-prose text-[1.02rem] leading-relaxed text-ink/75">{product.description}</p>
          </div>
          <div>
            <h2 className="display text-[1.8rem]">Details</h2>
            <dl className="mt-4">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-6 border-b border-[var(--hair-dark)] py-3.5 text-sm">
                  <dt className="text-ink/55">{s.label}</dt>
                  <dd className="text-right">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        {/* The rainforest film, for the pieces built to live in one. */}
        {product.category === "vivarium" && (
          <Reveal className="relative mt-16 aspect-[4/5] overflow-hidden rounded-[2rem] bg-card sm:aspect-[16/9]">
            <video className="absolute inset-0 h-full w-full object-cover" poster="/media/vivarium-forest.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden>
              <source src="/media/vivarium-forest.mp4" type="video/mp4" />
              <source src="/media/vivarium-forest.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            <p className="display absolute bottom-6 left-6 text-[clamp(1.6rem,3vw,2.6rem)] text-white sm:bottom-10 sm:left-10">A piece of the rainforest, at home.</p>
          </Reveal>
        )}

        {/* More */}
        <section className="mt-20 pb-24">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display text-[clamp(1.8rem,3vw,2.4rem)]">You may also like</h2>
            <ShopLink to="all" className="shrink-0 text-sm text-rust hover:text-ink">See all →</ShopLink>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      </div>

      {/* Phones: the price and the button stay in reach. */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-[var(--hair-dark)] bg-sand/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">{product.name}</p>
          <p className="text-sm tabular-nums text-ink/60">{formatPrice(price)}</p>
        </div>
        <button type="button" onClick={addToCart} className="h-12 rounded-full bg-ink px-6 text-sm text-sand">Add to cart</button>
      </div>
    </div>
  );
}
