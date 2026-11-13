"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { categories, isPreorder, PREORDER_WEEKS, type Product } from "@/data/products";
import { CATEGORY_AR, EXTRA } from "@/data/products-extra";
import { whatsappUrl } from "@/lib/contact";
import { num, price as fmt, T, type Lang } from "@/lib/i18n";
import { useCart } from "./cart";
import OrderForm from "./order-form";
import { JarAnatomy, SizeDiagram } from "./product-diagrams";
import ProductCard from "./product-card";
import Reveal from "./reveal";
import { ShopLink } from "./shop-filter";

/*
 * One page per product, written to work as an ad landing page in English or
 * Arabic: photos, price and availability, what it is, its size drawn to scale,
 * for jars what is inside, and an order form at the foot.
 */
export default function ProductPage({ product, related, lang = "en" }: { product: Product; related: Product[]; lang?: Lang }) {
  const { add } = useCart();
  const t = T[lang];
  const extra = EXTRA[product.slug];
  const ar = lang === "ar";

  const [shot, setShot] = useState(0);
  const [variant, setVariant] = useState(0);
  const [qty, setQty] = useState(1);

  const preorder = isPreorder(product);
  const option = product.variants.options[variant];
  const unit = product.price + option.delta;
  const size = extra.sizes[Math.min(variant, extra.sizes.length - 1)];
  const round = ["jar", "cylinder", "pot", "air"].includes(extra.shape);

  const name = ar ? extra.ar.name : product.name;
  const tagline = ar ? extra.ar.tagline : product.tagline;
  const description = ar ? extra.ar.description : product.description;
  const specs = ar ? extra.ar.specs : product.specs;
  const variantName = ar ? extra.ar.variantName : product.variants.name;
  const optionLabels = ar ? extra.ar.options : product.variants.options.map((o) => o.label);
  const categoryName = ar ? CATEGORY_AR[product.category] : categories.find((c) => c.slug === product.category)!.name;

  const promises = [t.handmade, product.category === "terrarium" ? t.noCare : null, t.confirmFirst, t.giftNote].filter(Boolean) as string[];

  const addToCart = () => add({ slug: product.slug, name: product.name, variant: option.label, price: unit, image: product.images[0] }, qty);
  const orderNow = whatsappUrl(`${t.msgHello}\n\n• ${name} (${optionLabels[variant]}) ×${qty} — ${fmt(unit * qty, lang)} — ${preorder ? t.msgPre(PREORDER_WEEKS) : t.msgReady}`);

  return (
    <div lang={lang} dir={ar ? "rtl" : "ltr"} className={`bg-sand text-ink ${ar ? "font-ar" : ""}`}>
      <div className="mx-auto max-w-7xl px-5 pt-28 sm:px-10 lg:pt-32">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-ink/55">
          <ShopLink to="all" className="hover:text-ink">{t.shop}</ShopLink>
          <span aria-hidden>/</span>
          <ShopLink to={product.category} className="hover:text-ink">{categoryName}</ShopLink>
          <span aria-hidden>/</span>
          <span className="truncate text-ink">{name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-card">
              <AnimatePresence initial={false}>
                <motion.div key={shot} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                  <Image src={product.images[shot]} alt={name} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
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
                    aria-label={`${i + 1}`}
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
            <p className="kicker">{categoryName}</p>
            <h1 className="display mt-3 text-[clamp(2.2rem,4.2vw,3.4rem)]">{name}</h1>
            {ar ? <p className="mt-1 text-right text-sm text-ink/55">{product.name}</p> : product.latin && <p className="mt-1 text-sm text-ink/55 italic">{product.latin}</p>}
            <p className="mt-5 text-[1.05rem] leading-relaxed text-ink/70">{tagline}</p>
            <p className="display mt-6 text-[2rem] tabular-nums">{fmt(unit, lang)}</p>
            <p className={`mt-3 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm ${preorder ? "bg-ink text-sand" : "bg-card text-ink"}`}>
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${preorder ? "bg-sand" : "bg-[#3f7a3a]"}`} aria-hidden />
              {preorder ? t.preorderLine(PREORDER_WEEKS) : t.readyLine}
            </p>

            {optionLabels.length > 1 && (
              <fieldset className="mt-8">
                <legend className="kicker">{variantName}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {optionLabels.map((label, i) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setVariant(i)}
                      aria-pressed={i === variant}
                      className={`rounded-full border px-4 py-2.5 text-sm transition ${i === variant ? "border-ink bg-ink text-sand" : "border-ink/30 hover:border-ink/70"}`}
                    >
                      {label}
                      {product.variants.options[i].delta > 0 && <span className="ms-2 text-xs opacity-60">+{fmt(product.variants.options[i].delta, lang)}</span>}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="mt-8 flex gap-3">
              <div className="inline-flex h-14 items-center rounded-full border border-ink/30" dir="ltr">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-14 w-12 text-lg opacity-70 hover:opacity-100" aria-label="−">−</button>
                <span className="w-6 text-center tabular-nums" aria-live="polite">{num(qty, lang)}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} className="h-14 w-12 text-lg opacity-70 hover:opacity-100" aria-label="+">+</button>
              </div>
              <button type="button" onClick={addToCart} className="h-14 flex-1 rounded-full bg-ink text-[0.95rem] text-sand transition hover:bg-black">
                {preorder ? t.preorderCta : t.addToCart}{t.sep}{fmt(unit * qty, lang)}
              </button>
            </div>
            <a href={orderNow} target="_blank" rel="noopener" className="mt-3 flex h-14 items-center justify-center rounded-full border border-ink/30 text-[0.95rem] transition hover:border-ink">
              {preorder ? t.preorderOnWhatsApp : t.orderOnWhatsApp}
            </a>

            <ul className="mt-8 space-y-3 border-t border-[var(--hair-dark)] pt-6 text-sm text-ink/70">
              {promises.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rust" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* About + details */}
        <Reveal className="mt-20 grid gap-10 border-t border-[var(--hair-dark)] pt-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="display text-[1.8rem]">{t.about}</h2>
            <p className="mt-4 max-w-prose text-[1.02rem] leading-relaxed text-ink/75">{description}</p>
          </div>
          <div>
            <h2 className="display text-[1.8rem]">{t.details}</h2>
            <dl className="mt-4">
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-6 border-b border-[var(--hair-dark)] py-3.5 text-sm">
                  <dt className="text-ink/55">{s.label}</dt>
                  <dd className="text-end">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        {/* Size, to scale */}
        <Reveal className="mt-16 grid gap-8 rounded-[2rem] bg-card p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <h2 className="display text-[1.8rem]">{t.sizeTitle}</h2>
            <p className="mt-3 max-w-sm text-[0.98rem] leading-relaxed text-ink/65">{t.sizeLede}</p>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {[
                { k: t.height, v: size.h },
                { k: round ? t.diameter : t.width, v: size.w },
                ...(size.d ? [{ k: t.depth, v: size.d }] : []),
              ].map((d) => (
                <div key={d.k} className="rounded-2xl bg-sand px-4 py-3">
                  <dt className="text-xs text-ink/55">{d.k}</dt>
                  <dd className="display mt-1 text-[1.4rem] tabular-nums">{num(d.v, lang)} <span className="text-sm">{t.cm}</span></dd>
                </div>
              ))}
            </dl>
            {optionLabels.length > 1 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {optionLabels.map((label, i) => (
                  <button key={label} type="button" onClick={() => setVariant(i)} aria-pressed={i === variant} className={`rounded-full border px-3.5 py-1.5 text-xs transition ${i === variant ? "border-ink bg-ink text-sand" : "border-ink/30 hover:border-ink/70"}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div dir="ltr">
            <SizeDiagram shape={extra.shape} size={size} lang={lang} />
          </div>
        </Reveal>

        {/* What is inside a sealed jar */}
        {product.category === "terrarium" && (
          <Reveal className="mt-16">
            <h2 className="display text-[1.8rem]">{t.insideTitle}</h2>
            <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-ink/65">{t.insideLede}</p>
            <div className="mt-8">
              <JarAnatomy lang={lang} />
            </div>
          </Reveal>
        )}

        {/* The rainforest film, for the pieces built to live in one. */}
        {product.category === "vivarium" && (
          <Reveal className="relative mt-16 aspect-[4/5] overflow-hidden rounded-[2rem] bg-card sm:aspect-[16/9]">
            <video className="absolute inset-0 h-full w-full object-cover" poster="/media/vivarium-forest.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden>
              <source src="/media/vivarium-forest.mp4" type="video/mp4" />
              <source src="/media/vivarium-forest.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            <p className="display absolute start-6 bottom-6 text-[clamp(1.6rem,3vw,2.6rem)] text-white sm:start-10 sm:bottom-10">{t.filmCaption}</p>
          </Reveal>
        )}

        {/* Related */}
        <section className="mt-20">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display text-[clamp(1.8rem,3vw,2.4rem)]">{t.related}</h2>
            <ShopLink to="all" className="shrink-0 text-sm text-rust hover:text-ink">{t.seeAll}</ShopLink>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} lang={lang} />)}
          </div>
        </section>

        {/* Order form */}
        <section id="order" className="mt-20 scroll-mt-24 pb-24">
          <div className="rounded-[2.5rem] bg-card p-6 sm:p-10 lg:p-14">
            <p className="kicker">{t.formKicker}</p>
            <h2 className="display mt-3 text-[clamp(1.9rem,3.6vw,3rem)]">{t.formTitle}</h2>
            <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-ink/70">{t.formLede}</p>
            <div className="mt-8">
              <OrderForm product={product} lang={lang} variant={variant} onVariant={setVariant} />
            </div>
          </div>
        </section>
      </div>

      {/* Phones: the price and a jump to the form stay in reach. */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-[var(--hair-dark)] bg-sand/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">{name}</p>
          <p className="text-sm tabular-nums text-ink/60">{fmt(unit, lang)}{t.sep}{preorder ? t.preorder(PREORDER_WEEKS) : t.readyNow}</p>
        </div>
        <a href="#order" className="grid h-12 place-items-center rounded-full bg-ink px-6 text-sm text-sand">{preorder ? t.preorderCta : t.formKicker}</a>
      </div>
    </div>
  );
}
