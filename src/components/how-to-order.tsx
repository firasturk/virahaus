import { whatsappUrl } from "@/lib/contact";
import Reveal from "./reveal";
import SectionHead from "./section-head";
import { ShopLink } from "./shop-filter";

const STEPS = [
  { title: "Pick your piece", text: "Browse the shop, choose a size and add it to your cart. No account needed." },
  { title: "Send it on WhatsApp", text: "Your cart turns into a ready-written message. Add a note if it's a gift." },
  { title: "We confirm and deliver", text: "We reply to agree the details and the day. Jars and plants go out right away; large tanks are ready two weeks later." },
];

/* How buying works here, in three plain steps. Anchored as #about until the brand story arrives. */
export default function HowToOrder() {
  return (
    <section id="about" className="relative bg-sand-2 px-5 py-20 text-ink sm:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead kicker="How to order" title="Three steps. No checkout forms." />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={0.08 * i}>
              <div className="flex h-full flex-col rounded-[2rem] bg-card p-7">
                <span className="display text-[2.6rem] text-rust">0{i + 1}</span>
                <p className="display mt-8 text-[1.45rem] tracking-[-0.08em]">{s.title}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/65">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* What is on the shelf, and what is built for you. */}
        <Reveal delay={0.15} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex gap-4 rounded-[2rem] border border-[var(--hair-dark)] p-7">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#3f7a3a]" aria-hidden />
            <div>
              <p className="display text-[1.3rem] tracking-[-0.08em]">Ready now</p>
              <p className="mt-1 text-[0.95rem] leading-relaxed text-ink/65">Terrarium jars and plants. Delivered as soon as we confirm your order.</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-[2rem] bg-ink p-7 text-sand">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-sand" aria-hidden />
            <div>
              <p className="display text-[1.3rem] tracking-[-0.08em]">Pre-order · 2 weeks</p>
              <p className="mt-1 text-[0.95rem] leading-relaxed text-sand/70">Vivariums and large tanks are built by hand for each order, ready two weeks after we confirm.</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
          <ShopLink to="all" className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm text-sand transition hover:bg-black">
            Start shopping
          </ShopLink>
          <a href={whatsappUrl("Hi ViraHaus, I have a question before ordering.")} target="_blank" rel="noopener" className="inline-flex h-12 items-center rounded-full border border-ink/35 px-7 text-sm transition hover:border-ink">
            Ask us first
          </a>
        </Reveal>
      </div>
    </section>
  );
}
