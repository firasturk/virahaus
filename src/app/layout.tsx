import type { Metadata } from "next";
import { Lexend, Lexend_Exa } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/components/cart";
import { MenuOverlay } from "@/components/site-menu";

const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"] });
const lexendExa = Lexend_Exa({ variable: "--font-lexend-exa", subsets: ["latin"] });
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
      className={`${lexend.variable} ${lexendExa.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <MenuOverlay />
        </CartProvider>
      </body>
    </html>
  );
}
