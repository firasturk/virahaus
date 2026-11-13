import Image from "next/image";
import Link from "next/link";

import { href } from "@/lib/dict";
import type { Lang } from "@/lib/i18n";
import Reveal from "./reveal";

const COPY = {
  en: {
    kicker: "From our studio",
    title: "Real jars. Real rainforests. Made in Amman.",
    text: "No renders here. These are the vivariums and plants we grow ourselves, a few streets away from you.",
    cta: "See vivariums",
    alts: ["Tending the vivariums in the ViraHaus studio", "Selaginella and begonia with water droplets", "Begonias under the vivarium light", "Inside a planted vivarium"],
  },
  ar: {
    kicker: "من الاستوديو تبعنا",
    title: "جرار حقيقية وغابات حقيقية. معمولة بعمّان.",
    text: "هاي مش صور مولّدة. هاي الفيفاريومات والنباتات اللي بنربيها بإيدينا، قريب منك.",
    cta: "شوف الفيفاريوم",
    alts: ["نعتني بالفيفاريوم في استوديو ViraHaus", "سيلاجينيلا وبيغونيا مع قطرات الماء", "بيغونيا تحت ضو الفيفاريوم", "من جوّا فيفاريوم مزروع"],
  },
};

const SHOTS = ["/media/studio/maker.jpg", "/media/studio/closeup-selaginella.jpg", "/media/studio/closeup-begonias.jpg", "/media/studio/vivarium-frog.jpg"];

/* Home: the owner's own photos, so visitors see the real work next to the shop. */
export default function StudioSection({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section className="bg-ink px-5 py-20 text-sand sm:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className="kicker text-sand/60">{t.kicker}</p>
          <h2 className="display mt-3 text-[clamp(2rem,4vw,3.2rem)]">{t.title}</h2>
          <p className="mt-4 max-w-md text-[1.02rem] leading-relaxed text-sand/70">{t.text}</p>
          <Link href={href(lang, "/shop/vivarium")} className="mt-8 inline-flex h-12 items-center rounded-full bg-sand px-6 text-sm text-ink transition hover:bg-white">{t.cta}</Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1.2fr_1fr_1fr] sm:grid-rows-2">
          {SHOTS.map((src, i) => (
            <Reveal key={src} delay={i * 0.06} className={`relative overflow-hidden rounded-[1.5rem] bg-black ${i === 0 ? "col-span-2 aspect-[4/3] sm:col-span-1 sm:row-span-2 sm:aspect-auto" : i === 3 ? "" : "aspect-[3/4]"} ${i === 3 ? "col-span-2 aspect-[16/9]" : ""}`}>
              <Image src={src} alt={t.alts[i]} fill sizes="(min-width: 1024px) 30vw, 50vw" className={`object-cover ${i === 0 ? "object-[72%_center]" : ""}`} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
