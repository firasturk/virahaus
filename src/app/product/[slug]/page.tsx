import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  return product ? { title: product.name, description: product.tagline } : {};
}

export default async function Page({ params }: { params: Params }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  return (
    <main className="relative flex-1 bg-sand pb-[72px] lg:pb-0">
      <SiteHeader />
      <ProductPage product={product} related={getRelated(product, 4)} />
      <SiteFooter />
    </main>
  );
}
