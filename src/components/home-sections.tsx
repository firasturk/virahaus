import Image from "next/image";
import Link from "next/link";

import { categories, getProduct, products } from "@/data/products";
import { CATEGORY_AR_PLURAL } from "@/data/products-extra";
import { whatsappUrl, WHATSAPP_DISPLAY } from "@/lib/contact";
import { DICT, href } from "@/lib/dict";
import { num, type Lang } from "@/lib/i18n";
import ProductCard from "./product-card";
import ProductOutline from "./product-outline";
import Reveal from "./reveal";
import SectionHead from "./section-head";

const wrap = "mx-auto max-w-7xl";
const section = "relative px-5 py-20 text-ink sm:px-10 lg:py-28";
const btnDark = "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 text-sm text-sand transition hover:bg-black";
const btnLine = "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/35 px-7 text-sm transition hover:border-ink";

function Arrow() {
  return <svg viewBox="0 0 16 16" className="h-4 w-4 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M3 8h10M9 4l4 4-4 4" /></svg>;
}

/* ---------- USP strip ---------- */
const USP_ICONS = [
  <path key="h" d="M7 13c0-3 2-5 5-6 3 1 5 3 5 6v6H7Zm5-6V4M9 19v-3h6v3" />,
  <path key="w" d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Zm-3 11a3 3 0 0 0 3 3" />,
  <path key="d" d="M3 7h11v9H3Zm11 3h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
  <path key="p" d="M3 7h18v10H3Zm0 3h18M7 14h3" />,
];

export function UspStrip({ lang }: { lang: Lang }) {
  const t = DICT[lang].usp;
  return (
    <section className="border-b border-[var(--hair-dark)] bg-white px-5 py-8 text-ink sm:px-10">
      <ul className={`${wrap} grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4`}>
        {t.map((u, i) => (
          <li key={u.title} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-rust">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{USP_ICONS[i]}</svg>
            </span>
            <div className="min-w-0">
              <p className="text-[0.95rem] font-medium">{u.title}</p>
              <p className="mt-0.5 text-[0.8rem] leading-snug text-ink/60">{u.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Categories ---------- */
const FILM: Record<string, string> = { terrarium: "bg-terrarium", vivarium: "bg-vivarium", plants: "bg-plants" };

export function CategoriesSection({ lang }: { lang: Lang }) {
  const t = DICT[lang].categories;
  return (
    <section id="collections" className={`${section} bg-sand`}>
      <div className={wrap}>
        <SectionHead kicker={t.kicker} title={t.title} action={<Link href={href(lang, "/shop")} className={btnLine}>{t.shopAll}<Arrow /></Link>} />
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          {categories.map((c, i) => {
            const count = products.filter((p) => p.category === c.slug).length;
            const name = lang === "ar" ? CATEGORY_AR_PLURAL[c.slug] : c.name;
            const blurb = lang === "ar" ? CATEGORY_BLURB_AR[c.slug] : c.blurb;
            return (
              <Reveal key={c.slug} delay={0.08 * i} className="w-[80%] shrink-0 snap-start md:w-auto">
                <Link href={href(lang, `/shop/${c.slug}`)} className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] bg-card">
                  <video className="absolute inset-0 h-full w-full object-cover transition duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" poster={`/media/${FILM[c.slug]}.jpg`} autoPlay muted loop playsInline preload="metadata" aria-hidden>
                    <source src={`/media/${FILM[c.slug]}.mp4`} type="video/mp4" />
                    <source src={`/media/${FILM[c.slug]}.webm`} type="video/webm" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white">
                    <div className="min-w-0">
                      <p className="text-xs text-white/70">{num(count, lang)} {t.pieces}</p>
                      <p className="display mt-2 text-[1.9rem]">{name}</p>
                      <p className="mt-1 max-w-[17rem] text-sm leading-snug text-white/80">{blurb}</p>
                    </div>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-ink transition group-hover:scale-105"><Arrow /></span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const CATEGORY_BLURB_AR: Record<string, string> = {
  terrarium: "مصنوعة يدوياً ومغلقة. بلا ري — ضوء فقط. جاهزة الآن.",
  vivarium: "أحواض مزروعة بمطرها الخاص. طلب مسبق، جاهزة خلال أسبوعين.",
  plants: "صغيرة ومنقوشة وتحب الرطوبة. جاهزة الآن.",
};

/* ---------- Ready to gift ---------- */
const BESTSELLERS = ["ember-jar", "cascade-vessel", "caladium", "begonia-maculata"];

export function BestsellersSection({ lang }: { lang: Lang }) {
  const t = DICT[lang].bestsellers;
  return (
    <section className={`${section} bg-white`}>
      <div className={wrap}>
        <SectionHead kicker={t.kicker} title={t.title} lede={t.lede} action={<Link href={href(lang, "/shop")} className={btnLine}>{t.shopAll}<Arrow /></Link>} />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {BESTSELLERS.map((s) => <ProductCard key={s} product={getProduct(s)!} lang={lang} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- Customize band ---------- */
export function CustomizeBand({ lang }: { lang: Lang }) {
  const t = DICT[lang].customizeBand;
  return (
    <section className={`${section} bg-sand-2`}>
      <div className={`${wrap} grid items-center gap-10 overflow-hidden rounded-[2.5rem] bg-white p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14`}>
        <Reveal>
          <p className="kicker">{t.kicker}</p>
          <h2 className="display mt-4 text-[clamp(2rem,4.2vw,3.4rem)]">{t.title}</h2>
          <p className="mt-4 max-w-md text-[1.02rem] leading-relaxed text-ink/70">{t.text}</p>
          <ol className="mt-8 space-y-3">
            {t.steps.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-[0.95rem]">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-sand text-sm text-rust">{num(i + 1, lang)}</span>
                {s}
              </li>
            ))}
          </ol>
          <Link href={href(lang, "/customize")} className={`${btnDark} mt-9`}>{t.cta}<Arrow /></Link>
        </Reveal>
        <div className="mx-auto w-full max-w-md">
          <ProductOutline shape="jar" size={{ h: 30, w: 20 }} lang={lang} dims={false} numbers={false} scaleRef={false} light />
        </div>
      </div>
    </section>
  );
}

/* ---------- Ecosystem ---------- */
const ECO_ICONS = [
  <g key="sun"><circle cx="12" cy="12" r="4" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></g>,
  <path key="leaf" d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Zm0 0 8-8" />,
  <path key="drop" d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  <g key="cycle"><path d="M20 12a8 8 0 0 1-14.3 4.9M4 12a8 8 0 0 1 14.3-4.9" /><path d="M18.5 3v4.2h-4.2M5.5 21v-4.2h4.2" /></g>,
];

export function EcosystemSection({ lang }: { lang: Lang }) {
  const t = DICT[lang].ecosystem;
  return (
    <section id="ecosystem" className={`${section} bg-white`}>
      <div className={`${wrap} grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16`}>
        <div>
          <SectionHead kicker={t.kicker} title={t.title} lede={t.lede} />
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {t.steps.map((s, i) => (
              <Reveal key={s.title} delay={0.06 * i}>
                <div className="flex h-full gap-4 rounded-[1.75rem] bg-sand p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-rust">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{ECO_ICONS[i]}</svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-ink/45">{num(i + 1, lang).padStart(2, lang === "ar" ? "٠" : "0")}</p>
                    <p className="display mt-1 text-[1.2rem] tracking-[-0.08em]">{s.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink/65">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href={href(lang, "/shop/terrarium")} className={btnDark}>{t.cta}<Arrow /></Link>
            <p className="max-w-sm text-sm leading-relaxed text-ink/60">{t.fact}</p>
          </Reveal>
        </div>
        <Reveal className="rounded-[2rem] bg-sand p-6 sm:p-10">
          <ProductOutline shape="jar" size={{ h: 28, w: 18 }} lang={lang} light dims={false} scaleRef={false} />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- How it works, delivery, payment, guarantee ---------- */
const SERVICE_ICONS = [
  <path key="d" d="M3 7h11v9H3Zm11 3h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
  <path key="p" d="M3 7h18v10H3Zm0 3h18M7 14h3" />,
  <path key="g" d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6Zm-3 9 2 2 4-4" />,
];

export function HowSection({ lang }: { lang: Lang }) {
  const t = DICT[lang].how;
  return (
    <section id="how" className={`${section} bg-sand`}>
      <div className={wrap}>
        <SectionHead kicker={t.kicker} title={t.title} />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {t.steps.map((s, i) => (
            <Reveal key={s.title} delay={0.08 * i}>
              <div className="flex h-full flex-col rounded-[2rem] bg-white p-7">
                <span className="display text-[2.6rem] text-rust">{num(i + 1, lang).padStart(2, lang === "ar" ? "٠" : "0")}</span>
                <p className="display mt-6 text-[1.4rem] tracking-[-0.08em]">{s.title}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/65">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex gap-4 rounded-[2rem] border border-[var(--hair-dark)] bg-white/60 p-7">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#3f7a3a]" aria-hidden />
            <div><p className="display text-[1.3rem] tracking-[-0.08em]">{t.readyTitle}</p><p className="mt-1 text-[0.95rem] leading-relaxed text-ink/65">{t.readyText}</p></div>
          </div>
          <div className="flex gap-4 rounded-[2rem] bg-ink p-7 text-sand">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-sand" aria-hidden />
            <div><p className="display text-[1.3rem] tracking-[-0.08em]">{t.preTitle}</p><p className="mt-1 text-[0.95rem] leading-relaxed text-sand/70">{t.preText}</p></div>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 border-t border-[var(--hair-dark)] pt-10 md:grid-cols-3">
          {t.service.map((s, i) => (
            <Reveal key={s.title} delay={0.06 * i} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-rust">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{SERVICE_ICONS[i]}</svg>
              </span>
              <div><p className="font-medium">{s.title}</p><p className="mt-1 text-sm leading-relaxed text-ink/65">{s.text}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export function FaqSection({ lang }: { lang: Lang }) {
  const t = DICT[lang].faq;
  return (
    <section id="faq" className={`${section} bg-white`}>
      <div className={`${wrap} grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16`}>
        <SectionHead kicker={t.kicker} title={t.title} />
        <div className="border-t border-[var(--hair-dark)]">
          {t.items.map((f) => (
            <details key={f.q} className="group border-b border-[var(--hair-dark)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.05rem] font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/25 transition group-open:rotate-45" aria-hidden>
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 3v10M3 8h10" /></svg>
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-[0.98rem] leading-relaxed text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Aquariums (a side line, kept small) ---------- */
export function AquariumBand({ lang }: { lang: Lang }) {
  const t = DICT[lang].aquarium;
  return (
    <section id="aquariums" className={`${section} bg-sand !py-16`}>
      <Reveal className={`${wrap} grid items-center gap-8 overflow-hidden rounded-[2rem] bg-white md:grid-cols-[1fr_1.2fr]`}>
        <div className="relative aspect-[16/10] md:aspect-auto md:h-full md:min-h-[300px]">
          <Image src="/media/aquarium-reef.jpg" alt="" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
        </div>
        <div className="p-7 sm:p-10">
          <p className="kicker">{t.kicker}</p>
          <h2 className="display mt-3 text-[clamp(1.6rem,3vw,2.2rem)]">{t.title}</h2>
          <p className="mt-3 max-w-lg text-[0.98rem] leading-relaxed text-ink/65">{t.text}</p>
          <a href={whatsappUrl(t.msg)} target="_blank" rel="noopener" className={`${btnLine} mt-7`}>{t.cta}</a>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Contact ---------- */
export function ContactBand({ lang }: { lang: Lang }) {
  const t = DICT[lang].contact;
  return (
    <section id="contact" className={`${section} bg-white !py-20`}>
      <Reveal className={`${wrap} flex flex-col gap-8 rounded-[2.5rem] bg-sand p-8 sm:p-12 md:flex-row md:items-center md:justify-between`}>
        <div className="max-w-xl">
          <p className="kicker">{t.kicker}</p>
          <h2 className="display mt-4 text-[clamp(1.9rem,3.6vw,3rem)]">{t.title}</h2>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-ink/70">{t.text}</p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <a href={whatsappUrl(t.msg)} target="_blank" rel="noopener" className="inline-flex h-14 items-center gap-3 rounded-full bg-ink px-8 text-[0.95rem] text-sand transition hover:bg-black">{t.cta}</a>
          <span className="text-sm tabular-nums text-ink/60" dir="ltr">{WHATSAPP_DISPLAY}</span>
        </div>
      </Reveal>
    </section>
  );
}
