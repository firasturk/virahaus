import type { Metadata } from "next";
import { Lexend, Lexend_Exa, Rozha_One } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const lexendExa = Lexend_Exa({
  variable: "--font-lexend-exa",
  subsets: ["latin"],
});

const rozhaOne = Rozha_One({
  variable: "--font-rozha-one",
  subsets: ["latin"],
  weight: "400",
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
      className={`${lexend.variable} ${lexendExa.variable} ${rozhaOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
