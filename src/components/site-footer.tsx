import Image from "next/image";
import Link from "next/link";

import { categories } from "@/data/products";
import { CATEGORY_AR_PLURAL } from "@/data/products-extra";
import { INSTAGRAM_URL, TIKTOK_URL, WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/contact";
import { XC } from "@/lib/extras-copy";
import { DICT, href } from "@/lib/dict";
import type { Lang } from "@/lib/i18n";

export default function SiteFooter({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  const link = "text-sand/80 transition hover:text-white";
  return (
    <footer className="relative bg-ink px-5 pt-16 pb-10 text-sand sm:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Image src="/media/VIRA-HAUS-logo.png" alt="ViraHaus" width={561} height={120} className="h-6 w-auto" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-sand/70">{t.footer.tagline}</p>
          <p className="mt-6 text-xs text-sand/50">{lang === "ar" ? "كاش · كليك · بطاقة عند الاستلام" : "Cash · CliQ · Card on delivery"}</p>
        </div>

        <nav className="flex flex-col gap-2.5 text-sm">
          <span className="mb-1 text-xs tracking-[0.2em] text-sand/50 uppercase">{t.footer.shop}</span>
          {categories.map((c) => (
            <Link key={c.slug} href={href(lang, `/shop/${c.slug}`)} className={link}>{lang === "ar" ? CATEGORY_AR_PLURAL[c.slug] : c.name}</Link>
          ))}
          <Link href={href(lang, "/customize")} className={link}>{t.nav.customize}</Link>
          <Link href={href(lang, "/corporate")} className={link}>{XC[lang].nav.corporate}</Link>
          <Link href={href(lang, "/gift-card")} className={link}>{XC[lang].nav.giftCard}</Link>
        </nav>

        <nav className="flex flex-col gap-2.5 text-sm">
          <span className="mb-1 text-xs tracking-[0.2em] text-sand/50 uppercase">{t.footer.help}</span>
          <Link href={href(lang, "/#how")} className={link}>{t.nav.how}</Link>
          <Link href={href(lang, "/#faq")} className={link}>{t.nav.faq}</Link>
          <Link href={href(lang, "/#gift")} className={link}>{t.nav.gifts}</Link>
          <Link href={href(lang, "/#aquariums")} className={link}>{t.nav.aquariums}</Link>
        </nav>

        <nav className="flex flex-col gap-2.5 text-sm">
          <span className="mb-1 text-xs tracking-[0.2em] text-sand/50 uppercase">{t.footer.follow}</span>
          <a href={whatsappUrl()} target="_blank" rel="noopener" className="text-sand/80 hover:text-white">{t.footer.whatsapp} <span dir="ltr">{WHATSAPP_DISPLAY}</span></a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="text-sand/80 hover:text-white">{t.footer.instagram}</a>
          <a href={TIKTOK_URL} target="_blank" rel="noopener" className="text-sand/80 hover:text-white">{t.footer.tiktok}</a>
          <span className="text-sand/50">{t.footer.city}</span>
        </nav>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-xs text-sand/50 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} ViraHaus. {t.footer.rights}</span>
        <Link href={lang === "en" ? "/ar" : "/"} hrefLang={lang === "en" ? "ar" : "en"} className="text-sand/80 hover:text-white">{t.nav.language}</Link>
      </div>
    </footer>
  );
}
