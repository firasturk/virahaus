import type { Metadata } from "next";

import AnnouncementBar from "@/components/announcement-bar";
import ShopPage from "@/components/shop-page";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = { title: "Shop" };

export default function Page() {
  return (
    <main className="flex-1 bg-white">
      <AnnouncementBar lang="en" />
      <SiteHeader lang="en" />
      <ShopPage lang="en" />
      <SiteFooter lang="en" />
    </main>
  );
}
