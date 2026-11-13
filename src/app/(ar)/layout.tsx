import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";

import SiteShell from "@/components/site-shell";
import { readexBody, readexDisplay } from "../fonts";

const DESCRIPTION = "تيراريوم مصنوع يدوياً لا يحتاج إلا الضوء، وفيفاريوم حسب الطلب، ونباتات تحب الزجاج. توصيل لكل الأردن.";

export const metadata: Metadata = {
  metadataBase: new URL("https://virahaus.vercel.app"),
  title: { default: "ViraHaus — اكتشف الأخضر بداخلك", template: "%s — ViraHaus" },
  description: DESCRIPTION,
  alternates: { languages: { en: "/", ar: "/ar" } },
  openGraph: {
    title: "ViraHaus — اكتشف الأخضر بداخلك",
    description: DESCRIPTION,
    siteName: "ViraHaus",
    type: "website",
    locale: "ar_JO",
    images: [{ url: "/media/hero-alive-poster.jpg", width: 1670, height: 941 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function ArabicLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${readexBody.variable} ${readexDisplay.variable} h-full antialiased`}>
      <SiteShell lang="ar">{children}</SiteShell>
    </html>
  );
}
