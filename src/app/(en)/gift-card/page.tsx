import type { Metadata } from "next";

import AnnouncementBar from "@/components/announcement-bar";
import GiftCardPage from "@/components/gift-card-page";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = { title: "Gift cards", alternates: { languages: { en: "/gift-card", ar: "/ar/gift-card" } } };

export default function Page() {
  return (
    <main className="flex-1 bg-white">
      <AnnouncementBar lang="en" />
      <SiteHeader lang="en" />
      <GiftCardPage lang="en" />
      <SiteFooter lang="en" />
    </main>
  );
}
