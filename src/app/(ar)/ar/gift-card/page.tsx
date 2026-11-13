import type { Metadata } from "next";

import AnnouncementBar from "@/components/announcement-bar";
import GiftCardPage from "@/components/gift-card-page";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = { title: "بطاقات الهدايا", alternates: { languages: { en: "/gift-card", ar: "/ar/gift-card" } } };

export default function Page() {
  return (
    <main className="flex-1 bg-white">
      <AnnouncementBar lang="ar" />
      <SiteHeader lang="ar" />
      <GiftCardPage lang="ar" />
      <SiteFooter lang="ar" />
    </main>
  );
}
