import Image from "next/image";
import Link from "next/link";

import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/contact";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--hair-dark)] bg-sand-2 px-6 py-12 text-ink sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Image src="/media/VIRA-HAUS-logo.png" alt="ViraHaus" width={561} height={120} className="h-6 w-auto [filter:brightness(0.09)]" />
          <p className="mt-4 max-w-xs text-sm text-rust">Nurturing green spaces, cultivating sustainable solutions, and inspiring a greener tomorrow for all.</p>
        </div>
        <nav className="flex flex-wrap gap-x-10 gap-y-6 text-sm">
          <div className="flex flex-col gap-2">
            <span className="kicker">Shop</span>
            <Link href="/#shop" className="text-rust hover:text-ink">Terrariums</Link>
            <Link href="/#shop" className="text-rust hover:text-ink">Vivariums</Link>
            <Link href="/#shop" className="text-rust hover:text-ink">Plants</Link>
            <Link href="/#gift" className="text-rust hover:text-ink">Gifting</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="kicker">Contact</span>
            <a href={whatsappUrl()} target="_blank" rel="noopener" className="text-rust hover:text-ink">WhatsApp {WHATSAPP_DISPLAY}</a>
            <a href={whatsappUrl("Hi ViraHaus, I have a question.")} target="_blank" rel="noopener" className="text-rust hover:text-ink">Ask us anything</a>
            <span className="text-ink/60">Amman · ships everywhere</span>
          </div>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-7xl text-[0.68rem] tracking-[0.24em] uppercase text-ink/45">© {new Date().getFullYear()} ViraHaus</p>
    </footer>
  );
}
