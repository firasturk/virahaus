"use client";

import Image from "next/image";
import Link from "next/link";

import { categories, formatPrice, type Product } from "@/data/products";
import { useCart } from "./cart";

/*
 * One product in a grid: photo, name, what it is, price. The round button adds
 * the first size straight to the cart, so the common case is one tap.
 */
export default function ProductCard({ product, sizes = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" }: { product: Product; sizes?: string }) {
  const { add } = useCart();
  const category = categories.find((c) => c.slug === product.category)!;
  const hasRange = product.variants.options.some((o) => o.delta > 0);
  const first = product.variants.options[0];

  return (
    <article className="group">
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-card">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes={sizes}
            className="object-cover transition duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </Link>
        <button
          type="button"
          onClick={() => add({ slug: product.slug, name: product.name, variant: first.label, price: product.price + first.delta, image: product.images[0] })}
          aria-label={`Add ${product.name} to cart`}
          title="Add to cart"
          className="absolute right-3 bottom-3 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-[0_6px_20px_-6px_rgba(22,20,15,0.45)] transition hover:scale-105 hover:bg-ink hover:text-white"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M8 3v10M3 8h10" /></svg>
        </button>
      </div>

      <Link href={`/product/${product.slug}`} className="mt-3 block">
        <span className="display block text-[1.05rem] leading-tight tracking-[-0.06em] sm:text-[1.15rem]">{product.name}</span>
        <span className="mt-1.5 flex items-baseline justify-between gap-2 text-sm">
          <span className="truncate text-xs text-ink/55">{category.name.replace(/s$/, "")}</span>
          <span className="shrink-0 tabular-nums">
            {hasRange && <span className="text-xs text-ink/55">from </span>}
            {formatPrice(product.price)}
          </span>
        </span>
      </Link>
    </article>
  );
}
