import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";

import SiteShell from "@/components/site-shell";
import { lexend, lexendExa } from "../fonts";

const DESCRIPTION = "Handmade sealed terrariums that need nothing but light, made-to-order vivariums and the plants that love glass. Delivered across Jordan.";

export const metadata: Metadata = {
  metadataBase: new URL("https://virahaus.vercel.app"),
  title: { default: "ViraHaus — Find your inner green", template: "%s — ViraHaus" },
  description: DESCRIPTION,
  alternates: { languages: { en: "/", ar: "/ar" } },
  openGraph: {
    title: "ViraHaus — Find your inner green",
    description: DESCRIPTION,
    siteName: "ViraHaus",
    type: "website",
    locale: "en",
    images: [{ url: "/media/hero-alive-poster.jpg", width: 1670, height: 941, alt: "A mossy driftwood branch, alive." }],
  },
  twitter: { card: "summary_large_image" },
};

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${lexend.variable} ${lexendExa.variable} h-full antialiased`}>
      <SiteShell lang="en">{children}</SiteShell>
    </html>
  );
}
