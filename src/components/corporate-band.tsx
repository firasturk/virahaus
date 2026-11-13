import Image from "next/image";
import Link from "next/link";

import { href } from "@/lib/dict";
import { XC } from "@/lib/extras-copy";
import type { Lang } from "@/lib/i18n";
import Reveal from "./reveal";

/* Home: corporate gifts and gift cards, side by side. */
export default function CorporateBand({ lang }: { lang: Lang }) {
  const c = XC[lang].corpBand;
  const g = XC[lang].cardBand;
  return (
    <section className="bg-white px-5 pb-20 text-ink sm:px-10 lg:pb-28">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Reveal className="grid overflow-hidden rounded-[2rem] bg-ink text-sand sm:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col justify-between gap-8 p-7 sm:p-10">
            <div>
              <p className="kicker text-sand/60">{c.kicker}</p>
              <h2 className="display mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)]">{c.title}</h2>
              <p className="mt-3 max-w-sm text-[0.98rem] leading-relaxed text-sand/70">{c.text}</p>
            </div>
            <Link href={href(lang, "/corporate")} className="inline-flex h-12 w-fit items-center rounded-full bg-sand px-6 text-sm text-ink transition hover:bg-white">{c.cta}</Link>
          </div>
          <div className="relative min-h-56">
            <Image src="/media/gift-box.jpg" alt="" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.08} className="flex flex-col justify-between gap-8 rounded-[2rem] bg-sand p-7 sm:p-10">
          <div>
            <h2 className="display text-[clamp(1.8rem,3.4vw,2.6rem)]">{g.title}</h2>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-ink/70">{g.text}</p>
          </div>
          <div className="relative aspect-[1.6] w-full max-w-xs rounded-2xl bg-ink p-5 text-sand">
            <span className="display text-sm" dir="ltr">ViraHaus</span>
            <p className="display absolute start-5 bottom-5 text-3xl">{lang === "ar" ? "٥٠ د.أ" : "50 JD"}</p>
          </div>
          <Link href={href(lang, "/gift-card")} className="inline-flex h-12 w-fit items-center rounded-full bg-ink px-6 text-sm text-sand transition hover:bg-black">{g.cta}</Link>
        </Reveal>
      </div>
    </section>
  );
}
