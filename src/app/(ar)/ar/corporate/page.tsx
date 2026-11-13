import type { Metadata } from "next";

import AnnouncementBar from "@/components/announcement-bar";
import CorporatePage from "@/components/corporate-page";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = { title: "هدايا الشركات", alternates: { languages: { en: "/corporate", ar: "/ar/corporate" } } };

export default function Page() {
  return (
    <main className="flex-1 bg-white">
      <AnnouncementBar lang="ar" />
      <SiteHeader lang="ar" />
      <CorporatePage lang="ar" />
      <SiteFooter lang="ar" />
    </main>
  );
}
