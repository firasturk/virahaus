import { categories, products } from "@/data/products";
import Reveal from "./reveal";
import SectionHead from "./section-head";
import { ShopLink } from "./shop-filter";

/* Each collection has its own studio film; tapping one opens the shop on it. */
const FILM: Record<string, string> = { terrarium: "bg-terrarium", vivarium: "bg-vivarium", plants: "bg-plants" };

export default function CollectionsSection() {
  return (
    <section id="collections" className="relative bg-sand px-5 py-20 text-ink sm:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          kicker="Collections"
          title={<>Three ways to keep<br className="hidden sm:block" /> something alive.</>}
          lede="Handmade sealed jars that need no care, planted tanks with their own rain, and the small plants that love both."
        />

        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          {categories.map((c, i) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <Reveal key={c.slug} delay={0.08 * i} className="w-[78%] shrink-0 snap-start md:w-auto">
                <ShopLink to={c.slug} className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] bg-card">
                  <video
                    className="absolute inset-0 h-full w-full object-cover transition duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    poster={`/media/${FILM[c.slug]}.jpg`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden
                  >
                    <source src={`/media/${FILM[c.slug]}.mp4`} type="video/mp4" />
                    <source src={`/media/${FILM[c.slug]}.webm`} type="video/webm" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white">
                    <div>
                      <p className="text-xs tracking-[0.2em] text-white/70 uppercase">{count} pieces</p>
                      <p className="display mt-2 text-[1.9rem]">{c.name}</p>
                      <p className="mt-1 max-w-[16rem] text-sm leading-snug text-white/80">{c.blurb}</p>
                    </div>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-ink transition group-hover:translate-x-1">
                      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                    </span>
                  </div>
                </ShopLink>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
