import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

import AnnouncementBar from "@/components/announcement-bar";
import Customizer from "@/components/customizer";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { PIECES } from "@/lib/customize-data";

export const metadata: Metadata = { title: "صمّم جرّتك", alternates: { languages: { en: "/customize", ar: "/ar/customize" } } };

/* Pieces that have a photo use it; the rest are drawn until we photograph them. */
const photos = PIECES.filter((p) => fs.existsSync(path.join(process.cwd(), "public", p.src))).map((p) => p.id);

export default function Page() {
  return (
    <main className="flex-1 bg-white">
      <AnnouncementBar lang="ar" />
      <SiteHeader lang="ar" />
      <Customizer lang="ar" photos={photos} />
      <SiteFooter lang="ar" />
    </main>
  );
}
