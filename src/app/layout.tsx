import type { Metadata } from "next";
import { Lexend, Lexend_Exa, Readex_Pro } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/components/cart";
import { MenuOverlay } from "@/components/site-menu";
import AutoplayVideos from "@/components/autoplay-videos";

const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"] });
const lexendExa = Lexend_Exa({ variable: "--font-lexend-exa", subsets: ["latin"] });
/* Readex Pro is Lexend carried into Arabic, so the Arabic pages keep the hero's voice. */
const readex = Readex_Pro({ variable: "--font-readex", subsets: ["arabic", "latin"] });
const DESCRIPTION = "Sealed terrariums, misted vivariums and the plants that love glass. Nurturing green spaces, cultivating sustainable solutions, and inspiring a greener tomorrow for all.";

export const metadata: Metadata = {
  title: { default: "ViraHaus — Find your inner green", template: "%s — ViraHaus" },
  description: DESCRIPTION,
  openGraph: {
    title: "ViraHaus — Find your inner green",
    description: DESCRIPTION,
    siteName: "ViraHaus",
    type: "website",
    images: [{ url: "/media/hero-alive-poster.jpg", width: 1670, height: 941, alt: "A mossy driftwood branch, alive." }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${lexendExa.variable} ${readex.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <MenuOverlay />
          <AutoplayVideos />
        </CartProvider>
      </body>
    </html>
  );
}
