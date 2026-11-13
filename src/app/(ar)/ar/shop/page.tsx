import type { Metadata } from "next";

import AnnouncementBar from "@/components/announcement-bar";
import ShopPage from "@/components/shop-page";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = { title: "المتجر" };

export default function Page() {
  return (
    <main className="flex-1 bg-white">
      <AnnouncementBar lang="ar" />
      <SiteHeader lang="ar" />
      <ShopPage lang="ar" />
      <SiteFooter lang="ar" />
    </main>
  );
}
