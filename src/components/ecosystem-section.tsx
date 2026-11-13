import Reveal from "./reveal";
import SectionHead from "./section-head";
import { ShopLink } from "./shop-filter";

/* How a sealed jar keeps itself alive, in four plain steps. */
const CYCLE = [
  {
    title: "Light",
    text: "A bright room or a small lamp. That is the only thing it asks for.",
    icon: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></>,
  },
  {
    title: "The plants breathe",
    text: "Moss and ferns turn light into growth and breathe out moisture.",
    icon: <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Zm0 0 8-8" />,
  },
  {
    title: "It rains inside",
    text: "The moisture beads on the glass and runs back down to the soil.",
    icon: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  },
  {
    title: "Nothing is wasted",
    text: "The soil and its tiny helpers recycle what falls. The cycle starts again.",
    icon: <><path d="M20 12a8 8 0 0 1-14.3 4.9M4 12a8 8 0 0 1 14.3-4.9" /><path d="M18.5 3v4.2h-4.2M5.5 21v-4.2h4.2" /></>,
  },
];

export default function EcosystemSection() {
  return (
    <section id="ecosystem" className="relative bg-sand-2 px-5 py-20 text-ink sm:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
        <div>
          <SectionHead
            kicker="Handmade · No care"
            title={<>A gift that needs<br className="hidden sm:block" /> nothing but light.</>}
            lede="Every jar is planted and sealed by hand, and from that moment it is its own small ecosystem. No watering, no feeding, no green thumb. Put it where there is light and it keeps on living."
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {CYCLE.map((s, i) => (
              <Reveal key={s.title} delay={0.06 * i}>
                <div className="flex h-full gap-4 rounded-[1.75rem] bg-card p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sand text-rust">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{s.icon}</svg>
                  </span>
                  <div>
                    <p className="text-xs tracking-[0.2em] text-ink/45 uppercase">0{i + 1}</p>
                    <p className="display mt-1 text-[1.2rem] tracking-[-0.08em]">{s.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink/65">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ShopLink to="terrarium" className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm text-sand transition hover:bg-black">
              Shop no-care jars
            </ShopLink>
            <p className="max-w-sm text-sm leading-relaxed text-ink/60">The oldest known bottle garden was last watered in 1972, and it is still growing.</p>
          </Reveal>
        </div>

        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-card">
          <video className="absolute inset-0 h-full w-full object-cover" poster="/media/bg-terrarium.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden>
            <source src="/media/bg-terrarium.mp4" type="video/mp4" />
            <source src="/media/bg-terrarium.webm" type="video/webm" />
          </video>
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-5">
            {["Handmade", "Sealed ecosystem", "Just light"].map((t) => (
              <span key={t} className="rounded-full bg-white/90 px-3.5 py-1.5 text-xs text-ink backdrop-blur">{t}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
