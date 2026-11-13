"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { categories, isPreorder, PREORDER_WEEKS, type Product } from "@/data/products";
import { CATEGORY_AR, EXTRA } from "@/data/products-extra";
import { price, productPath, T, type Lang } from "@/lib/i18n";
import { useCart } from "./cart";

/*
 * One product in a grid: photo, availability, name, kind, price. The round +
 * drops the standard size into the jar (the cart) with one tap, and the photo
 * flies there so it is clear where it went.
 */
export default function ProductCard({ product, lang = "en", sizes = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" }: { product: Product; lang?: Lang; sizes?: string }) {
  const { add } = useCart();
  const photo = useRef<HTMLAnchorElement>(null);
  const t = T[lang];
  const ar = lang === "ar";
  const extra = EXTRA[product.slug];
  const link = productPath(product.slug, lang);
  const name = ar ? extra.ar.name : product.name;
  const kind = ar ? CATEGORY_AR[product.category] : categories.find((c) => c.slug === product.category)!.name.replace(/s$/, "");
  const preorder = isPreorder(product);
  const hasRange = product.variants.options.some((o) => o.delta > 0);
  const first = product.variants.options[0];
  const s0 = extra.sizes[0];
  const dims = ["jar", "cylinder", "pot", "air"].includes(extra.shape) ? `Ø${s0.w}×${s0.h}` : `${s0.w}×${s0.d ?? s0.w}×${s0.h}`;

  const quickAdd = () =>
    add(
      {
        slug: product.slug,
        name: product.name,
        nameAr: extra.ar.name,
        variant: first.label,
        variantAr: extra.ar.options[0],
        price: product.price + first.delta,
        image: product.images[0],
        preorder,
      },
      1,
      photo.current,
    );

  return (
    <article className="group">
      <div className="relative">
        <Link ref={photo} href={link} className="relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand">
          <Image src={product.images[0]} alt={name} fill sizes={sizes} className="object-cover transition duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
        </Link>
        <span className={`pointer-events-none absolute start-3 top-3 rounded-full px-3 py-1 text-[0.7rem] ${preorder ? "bg-ink text-sand" : "bg-white/90 text-ink"}`}>
          {preorder ? t.preorder(PREORDER_WEEKS) : t.readyNow}
        </span>
        <button
          type="button"
          onClick={quickAdd}
          aria-label={`${t.addToCart}: ${name}`}
          title={t.addToCart}
          className="absolute end-3 bottom-3 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-[0_6px_20px_-6px_rgba(22,20,15,0.45)] transition hover:scale-105 hover:bg-ink hover:text-white"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M8 3v10M3 8h10" /></svg>
        </button>
      </div>

      <Link href={link} className="mt-3 block">
        <span className="display block text-[1.05rem] leading-tight tracking-[-0.06em] sm:text-[1.15rem]">{name}</span>
        <span className="mt-1.5 flex items-end justify-between gap-2 text-sm">
          <span className="min-w-0 text-xs leading-snug text-ink/55">{kind}<span className="block"><bdi>{dims}</bdi> {ar ? "سم" : "cm"}</span></span>
          <span className="shrink-0 tabular-nums">
            {hasRange && <span className="text-xs text-ink/55">{t.from} </span>}
            {price(product.price, lang)}
          </span>
        </span>
      </Link>
    </article>
  );
}
