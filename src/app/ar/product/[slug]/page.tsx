import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductPage from "@/components/product-page";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getProduct, getRelated, products } from "@/data/products";
import { EXTRA } from "@/data/products-extra";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const ar = EXTRA[product.slug].ar;
  return {
    title: ar.name,
    description: ar.tagline,
    alternates: { languages: { en: `/product/${product.slug}`, ar: `/ar/product/${product.slug}` } },
    openGraph: { title: `${ar.name} — ViraHaus`, description: ar.tagline, locale: "ar_JO", images: [{ url: product.images[0] }] },
  };
}

/* The Arabic edition of each product page, for ads that run in Arabic. */
export default async function Page({ params }: { params: Params }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  return (
    <main className="relative flex-1 bg-sand pb-[72px] lg:pb-0">
      <SiteHeader switchHref={`/product/${product.slug}`} switchLabel="English" lang="ar" />
      <ProductPage product={product} related={getRelated(product, 4)} lang="ar" />
      <SiteFooter />
    </main>
  );
}
