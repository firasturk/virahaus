import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AnnouncementBar from "@/components/announcement-bar";
import ShopPage from "@/components/shop-page";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { categories, type CategorySlug } from "@/data/products";

type Params = Promise<{ category: string }>;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const slug = (await params).category;
  const c = categories.find((x) => x.slug === slug);
  return c ? { title: c.name } : {};
}

export default async function Page({ params }: { params: Params }) {
  const slug = (await params).category;
  if (!categories.some((c) => c.slug === slug)) notFound();
  return (
    <main className="flex-1 bg-white">
      <AnnouncementBar lang="en" />
      <SiteHeader lang="en" />
      <ShopPage lang="en" category={slug as CategorySlug} />
      <SiteFooter lang="en" />
    </main>
  );
}
