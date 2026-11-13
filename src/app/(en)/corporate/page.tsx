import type { Metadata } from "next";

import AnnouncementBar from "@/components/announcement-bar";
import CorporatePage from "@/components/corporate-page";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = { title: "Corporate gifts", alternates: { languages: { en: "/corporate", ar: "/ar/corporate" } } };

export default function Page() {
  return (
    <main className="flex-1 bg-white">
      <AnnouncementBar lang="en" />
      <SiteHeader lang="en" />
      <CorporatePage lang="en" />
      <SiteFooter lang="en" />
    </main>
  );
}
