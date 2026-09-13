import type { Metadata } from "next";
import { Instrument_Serif, Lexend, Lexend_Exa } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/components/cart";

const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"] });
const lexendExa = Lexend_Exa({ variable: "--font-lexend-exa", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ViraHaus",
  description:
    "Nurturing green spaces, cultivating sustainable solutions, and inspiring a greener tomorrow for all.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${lexendExa.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
