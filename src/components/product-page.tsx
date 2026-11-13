"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

import { categories, isPreorder, PREORDER_WEEKS, type Product } from "@/data/products";
import { CATEGORY_AR_PLURAL, EXTRA } from "@/data/products-extra";
import { whatsappUrl } from "@/lib/contact";
import { DICT, href } from "@/lib/dict";
import { num, price as fmt, T, type Lang } from "@/lib/i18n";
import { careFor, COPY, DELIVERY_FEE, FREE_DELIVERY_FROM, LED_PRICE } from "@/lib/product-copy";
import { useCart } from "./cart";
import OrderForm from "./order-form";
import ProductCard from "./product-card";
import ProductOutline, { OutlineLegend } from "./product-outline";
import Reveal from "./reveal";
import Reviews from "./reviews";

const CARE_ICONS = {
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></>,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  temp: <path d="M10 14V5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0Zm2-4v6" />,
  hand: <path d="M7 12V6a1.5 1.5 0 0 1 3 0v5M10 11V4.5a1.5 1.5 0 0 1 3 0V11m0-5a1.5 1.5 0 0 1 3 0v5m0-3a1.5 1.5 0 0 1 3 0v6a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4 13.5a1.6 1.6 0 0 1 2.6-1.8L7 12" />,
  timer: <><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9 2h6" /></>,
};

/*
 * One page per product, in the order the best shops use, written to work as an
 * ad landing page: photos and the buy box, the drawing, care, gift-ready
 * packaging, details, related pieces, and an order form at the foot.
 */
export default function ProductPage({ product, related, lang = "en" }: { product: Product; related: Product[]; lang?: Lang }) {
  const { add } = useCart();
  const t = T[lang];
  const c = COPY[lang];
  const d = DICT[lang];
  const ar = lang === "ar";
  const extra = EXTRA[product.slug];
  const gallery = useRef<HTMLDivElement>(null);

  const [shot, setShot] = useState(0);
  const [variant, setVariant] = useState(0);
  const [qty, setQty] = useState(1);
  const [led, setLed] = useState(false);

  const preorder = isPreorder(product);
  const ledAllowed = product.category === "terrarium";
  const option = product.variants.options[variant];
  const unit = product.price + option.delta + (led ? LED_PRICE : 0);
  const subtotal = unit * qty;
  const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const size = extra.sizes[Math.min(variant, extra.sizes.length - 1)];
  const round = ["jar", "cylinder", "pot", "air"].includes(extra.shape);
  const care = careFor(lang, product.category);

  const name = ar ? extra.ar.name : product.name;
  const tagline = ar ? extra.ar.tagline : product.tagline;
  const description = ar ? extra.ar.description : product.description;
  const specs = ar ? extra.ar.specs : product.specs;
  const variantName = ar ? extra.ar.variantName : product.variants.name;
  const optionLabels = ar ? extra.ar.options : product.variants.options.map((o) => o.label);
  const categoryName = ar ? CATEGORY_AR_PLURAL[product.category] : categories.find((x) => x.slug === product.category)!.name;
  const variantText = led ? `${option.label} + LED` : option.label;
  const variantTextAr = led ? `${extra.ar.options[variant]} + LED` : extra.ar.options[variant];

  const readyDate = (() => {
    const dt = new Date();
    dt.setDate(dt.getDate() + PREORDER_WEEKS * 7);
    return dt.toLocaleDateString(ar ? "ar-JO" : "en-GB", { day: "numeric", month: "long" });
  })();

  const addToJar = () =>
    add({ slug: product.slug, name: product.name, nameAr: extra.ar.name, variant: variantText, variantAr: variantTextAr, price: unit, image: product.images[0], preorder }, qty, gallery.current);
  const orderNow = whatsappUrl(`${t.msgHello}\n\n• ${name} (${ar ? variantTextAr : variantText}) ×${qty} — ${fmt(subtotal, lang)} — ${preorder ? t.msgPre(PREORDER_WEEKS) : t.msgReady}`);

  return (
    <div className="bg-white text-ink">
      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-10 lg:pt-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 overflow-hidden text-sm whitespace-nowrap text-ink/55">
          <Link href={href(lang, "/shop")} className="hover:text-ink">{d.nav.shop}</Link>
          <span aria-hidden>/</span>
          <Link href={href(lang, `/shop/${product.category}`)} className="hover:text-ink">{categoryName}</Link>
          <span aria-hidden>/</span>
          <span className="truncate text-ink">{name}</span>
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Gallery */}
          <div ref={gallery}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand">
              <AnimatePresence initial={false}>
                <motion.div key={shot} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
                  <Image src={product.images[shot]} alt={name} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
              <span className={`absolute start-4 top-4 rounded-full px-3 py-1 text-xs ${preorder ? "bg-ink text-sand" : "bg-white/90 text-ink"}`}>{preorder ? t.preorder(PREORDER_WEEKS) : t.readyNow}</span>
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto [scrollbar-width:none]">
                {product.images.map((src, i) => (
                  <button key={src} type="button" onClick={() => setShot(i)} aria-label={`${num(i + 1, lang)}`} aria-pressed={i === shot} className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-sand transition ${i === shot ? "ring-2 ring-ink" : "opacity-70 hover:opacity-100"}`}>
                    <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy box */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="kicker">{categoryName}</p>
            <h1 className="display mt-3 text-[clamp(2.1rem,4.2vw,3.3rem)]">{name}</h1>
            <p className="mt-2 text-sm text-ink/55">
              {ar ? <span className="me-2">{product.name} –</span> : product.latin && <span className="me-2 italic">{product.latin} ·</span>}
              <span dir="ltr">{c.dimsLine(round, size.w, size.h, size.d)}</span>
            </p>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-ink/70">{tagline}</p>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="display text-[2rem] tabular-nums">{fmt(unit, lang)}</p>
              <p className="text-sm text-ink/60" suppressHydrationWarning>{preorder ? c.readyBy(readyDate) : c.deliveryReady}</p>
            </div>

            {optionLabels.length > 1 && (
              <fieldset className="mt-7">
                <legend className="kicker">{variantName}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {optionLabels.map((label, i) => (
                    <button key={label} type="button" onClick={() => setVariant(i)} aria-pressed={i === variant} className={`rounded-full border px-4 py-2.5 text-sm transition ${i === variant ? "border-ink bg-ink text-white" : "border-ink/25 hover:border-ink/70"}`}>
                      {label}
                      {product.variants.options[i].delta > 0 && <span className="ms-2 text-xs opacity-60">+{fmt(product.variants.options[i].delta, lang)}</span>}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {ledAllowed && (
              <label className={`mt-5 flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${led ? "border-ink bg-sand" : "border-ink/20 hover:border-ink/50"}`}>
                <input type="checkbox" checked={led} onChange={(e) => setLed(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#16140f]" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-medium">{c.ledTitle}</span>
                    <span className="shrink-0 text-sm tabular-nums">+{fmt(LED_PRICE, lang)}</span>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink/60">{c.ledText}</span>
                </span>
              </label>
            )}

            <div className="mt-6 flex gap-3">
              <div className="inline-flex h-14 shrink-0 items-center rounded-full border border-ink/25" dir="ltr">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-14 w-11 text-lg opacity-70 hover:opacity-100" aria-label="−">−</button>
                <span className="w-6 text-center tabular-nums" aria-live="polite">{num(qty, lang)}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} className="h-14 w-11 text-lg opacity-70 hover:opacity-100" aria-label="+">+</button>
              </div>
              <button type="button" onClick={addToJar} className="h-14 min-w-0 flex-1 rounded-full bg-ink px-4 text-[0.95rem] text-white transition hover:bg-black">
                {preorder ? c.preorderToJar : c.addToJar}{t.sep}{fmt(subtotal, lang)}
              </button>
            </div>
            <a href={orderNow} target="_blank" rel="noopener" className="mt-3 flex h-12 items-center justify-center rounded-full border border-ink/25 text-[0.95rem] transition hover:border-ink">
              {preorder ? t.preorderOnWhatsApp : t.orderOnWhatsApp}
            </a>

            {/* Running total with delivery */}
            <dl className="mt-6 space-y-2 rounded-2xl bg-sand p-4 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-ink/60">{c.totalItem} ×{num(qty, lang)}</dt><dd className="tabular-nums">{fmt((unit - (led ? LED_PRICE : 0)) * qty, lang)}</dd></div>
              {led && <div className="flex justify-between gap-4"><dt className="text-ink/60">{c.totalLed}</dt><dd className="tabular-nums">{fmt(LED_PRICE * qty, lang)}</dd></div>}
              <div className="flex justify-between gap-4"><dt className="text-ink/60">{c.totalDelivery}</dt><dd className="tabular-nums">{delivery ? fmt(delivery, lang) : c.totalFree}</dd></div>
              <div className="flex justify-between gap-4 border-t border-[var(--hair-dark)] pt-2 font-medium"><dt>{c.totalSum}</dt><dd className="tabular-nums">{fmt(subtotal + delivery, lang)}</dd></div>
              <p className="text-xs text-rust">{delivery ? c.freeGap(fmt(FREE_DELIVERY_FROM - subtotal, lang)) : c.freeYes}</p>
            </dl>

            <ul className="mt-6 grid gap-2.5 text-sm text-ink/70">
              {[t.handmade, product.category === "terrarium" ? t.noCare : null, t.confirmFirst, d.how.service[2].text].filter(Boolean).map((p) => (
                <li key={p as string} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rust" aria-hidden />{p}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* The drawing */}
        <Reveal className="mt-20 grid gap-8 rounded-[2rem] bg-sand p-5 sm:p-10 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-12">
          <div>
            <h2 className="display text-[1.8rem]">{c.outlineTitle}</h2>
            <p className="mt-2 max-w-sm text-[0.98rem] leading-relaxed text-ink/65">{c.outlineLede}</p>
            {optionLabels.length > 1 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {optionLabels.map((label, i) => (
                  <button key={label} type="button" onClick={() => setVariant(i)} aria-pressed={i === variant} className={`rounded-full border px-3.5 py-1.5 text-xs transition ${i === variant ? "border-ink bg-ink text-white" : "border-ink/25 bg-white hover:border-ink/70"}`}>{label}</button>
                ))}
              </div>
            )}
            <div className="mt-8"><OutlineLegend shape={extra.shape} lang={lang} /></div>
          </div>
          <div className="rounded-[1.5rem] bg-white p-3 sm:p-6" dir="ltr">
            <ProductOutline key={`${variant}-${led}`} shape={extra.shape} size={size} lang={lang} light={led || product.category !== "terrarium"} />
          </div>
        </Reveal>

        {/* Care */}
        <Reveal className="mt-20">
          <h2 className="display text-[1.8rem]">{c.careTitle}</h2>
          <p className="mt-2 text-[0.98rem] text-ink/65">{c.careLede}</p>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {care.icons.map((ic) => (
              <div key={ic.label} className="flex items-center gap-3 rounded-2xl bg-sand p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-rust">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{CARE_ICONS[ic.icon]}</svg>
                </span>
                <span className="min-w-0"><span className="block text-xs text-ink/55">{ic.label}</span><span className="block text-sm font-medium">{ic.value}</span></span>
              </div>
            ))}
          </div>
          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {care.steps.map((s, i) => (
              <li key={s} className="flex gap-4 rounded-2xl border border-[var(--hair-dark)] p-5">
                <span className="display text-[1.6rem] leading-none text-rust">{num(i + 1, lang)}</span>
                <span className="text-[0.95rem] leading-relaxed text-ink/75">{s}</span>
              </li>
            ))}
            {ledAllowed && <li className="flex gap-4 rounded-2xl bg-ink p-5 text-sand md:col-span-2"><span className="text-[0.95rem] leading-relaxed">{c.ledText}</span></li>}
          </ol>
        </Reveal>

        {/* Gift-ready */}
        <Reveal className="mt-20 grid gap-6 overflow-hidden rounded-[2rem] bg-sand-2 p-5 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <h2 className="display text-[1.8rem]">{c.giftTitle}</h2>
            <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-ink/70">{c.giftText}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{ src: "/media/gift-box.jpg", label: c.giftBox }, { src: "/media/gift-card.jpg", label: c.giftCard }].map((g) => (
              <figure key={g.src}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white"><Image src={g.src} alt={g.label} fill sizes="(min-width: 1024px) 25vw, 45vw" className="object-cover" /></div>
                <figcaption className="mt-2 text-xs text-ink/60">{g.label}</figcaption>
              </figure>
            ))}
          </div>
        </Reveal>

        {/* Details as accordions */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <h2 className="display text-[1.8rem]">{t.about}</h2>
            <p className="mt-4 max-w-prose text-[1.02rem] leading-relaxed text-ink/75">{description}</p>
          </div>
          <div className="border-t border-[var(--hair-dark)]">
            <details open className="group border-b border-[var(--hair-dark)]">
              <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-medium [&::-webkit-details-marker]:hidden">{c.accDetails}<span className="text-xl transition group-open:rotate-45" aria-hidden>+</span></summary>
              <dl className="pb-5">
                {specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-6 border-b border-[var(--hair-dark)] py-3 text-sm last:border-0">
                    <dt className="text-ink/55">{s.label}</dt><dd className="text-end">{s.value}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-6 py-3 text-sm"><dt className="text-ink/55">{t.sizeTitle}</dt><dd dir="ltr">{c.dimsLine(round, size.w, size.h, size.d)}</dd></div>
              </dl>
            </details>
            {[{ q: c.accDelivery, a: c.accDeliveryText }, { q: c.accGuarantee, a: c.accGuaranteeText }].map((it) => (
              <details key={it.q} className="group border-b border-[var(--hair-dark)]">
                <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-medium [&::-webkit-details-marker]:hidden">{it.q}<span className="text-xl transition group-open:rotate-45" aria-hidden>+</span></summary>
                <p className="pb-5 text-[0.95rem] leading-relaxed text-ink/70">{it.a}</p>
              </details>
            ))}
          </div>
        </div>

        {product.category === "vivarium" && (
          <Reveal className="relative mt-20 aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand sm:aspect-[16/9]">
            <video className="absolute inset-0 h-full w-full object-cover" poster="/media/vivarium-forest.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden>
              <source src="/media/vivarium-forest.mp4" type="video/mp4" />
              <source src="/media/vivarium-forest.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            <p className="display absolute start-6 bottom-6 max-w-[80%] text-[clamp(1.5rem,3vw,2.6rem)] text-white sm:start-10 sm:bottom-10">{t.filmCaption}</p>
          </Reveal>
        )}

        <Reviews lang={lang} bare />

        <section className="mt-20">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display text-[clamp(1.8rem,3vw,2.4rem)]">{t.related}</h2>
            <Link href={href(lang, "/shop")} className="shrink-0 text-sm text-rust hover:text-ink">{t.seeAll}</Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} lang={lang} />)}
          </div>
        </section>

        <section id="order" className="mt-20 scroll-mt-24 pb-28 lg:pb-24">
          <div className="rounded-[2.5rem] bg-sand p-5 sm:p-10 lg:p-14">
            <p className="kicker">{t.formKicker}</p>
            <h2 className="display mt-3 text-[clamp(1.9rem,3.6vw,3rem)]">{t.formTitle}</h2>
            <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-ink/70">{t.formLede}</p>
            <div className="mt-8">
              <OrderForm product={product} lang={lang} variant={variant} onVariant={setVariant} led={led} />
            </div>
          </div>
        </section>
      </div>

      {/* Phones: name, price and the add button stay in reach. */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-[var(--hair-dark)] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">{name}</p>
          <p className="truncate text-xs tabular-nums text-ink/60">{fmt(unit, lang)}{t.sep}{preorder ? t.preorder(PREORDER_WEEKS) : t.readyNow}</p>
        </div>
        <button type="button" onClick={addToJar} className="h-12 shrink-0 rounded-full bg-ink px-6 text-sm text-white">{preorder ? c.preorderToJar : c.addToJar}</button>
      </div>
    </div>
  );
}
