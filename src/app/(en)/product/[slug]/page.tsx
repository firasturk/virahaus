import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AnnouncementBar from "@/components/announcement-bar";
import ProductPage from "@/components/product-page";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getProduct, getRelated, products } from "@/data/products";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product
    ? {
        title: product.name,
        description: product.tagline,
        alternates: { languages: { en: `/product/${product.slug}`, ar: `/ar/product/${product.slug}` } },
        openGraph: { title: `${product.name} — ViraHaus`, description: product.tagline, images: [{ url: product.images[0] }] },
      }
    : {};
}

export default async function Page({ params }: { params: Params }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  return (
    <main className="relative flex-1 bg-white">
      <AnnouncementBar lang="en" />
      <SiteHeader lang="en" />
      <ProductPage product={product} related={getRelated(product, 4)} lang="en" />
      <SiteFooter lang="en" />
    </main>
  );
}
