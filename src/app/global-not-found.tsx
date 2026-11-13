import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

import { lexend, lexendExa } from "./fonts";

export const metadata: Metadata = { title: "Not found — ViraHaus" };

/* Unmatched URLs, in both languages, outside either layout. */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${lexend.variable} ${lexendExa.variable}`}>
      <body className="grid min-h-svh place-items-center bg-sand px-6 text-center text-ink">
        <div>
          <p className="kicker">404</p>
          <h1 className="display mt-4 text-5xl">This page is not here.</h1>
          <p className="mt-3 text-ink/70" dir="rtl" lang="ar">هذه الصفحة غير موجودة.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/" className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm text-sand">Home</Link>
            <Link href="/ar" className="inline-flex h-12 items-center rounded-full border border-ink/35 px-6 text-sm">الرئيسية</Link>
          </div>
        </div>
      </body>
    </html>
  );
}
