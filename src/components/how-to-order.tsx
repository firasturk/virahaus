import { whatsappUrl } from "@/lib/contact";
import Reveal from "./reveal";
import SectionHead from "./section-head";
import { ShopLink } from "./shop-filter";

const STEPS = [
  { title: "Pick your piece", text: "Browse the shop, choose a size and add it to your cart. No account needed." },
  { title: "Send it on WhatsApp", text: "Your cart turns into a ready-written message. Add a note if it's a gift." },
  { title: "We confirm and deliver", text: "We reply to agree the details and the delivery day. Nothing is charged before that." },
];

/* How buying works here, in three plain steps. Anchored as #about until the brand story arrives. */
export default function HowToOrder() {
  return (
    <section id="about" className="relative bg-sand px-5 py-20 text-ink sm:px-10 lg:py-28">
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
