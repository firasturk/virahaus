import { whatsappUrl } from "@/lib/contact";
import Reveal from "./reveal";

/* A side line, kept small on purpose: custom aquariums are built on request, not sold from the shop. */
export default function AquariumBand() {
  return (
    <section id="aquariums" className="relative bg-sand px-5 pt-4 text-ink sm:px-10">
      <Reveal className="mx-auto flex max-w-7xl flex-col gap-6 border-y border-[var(--hair-dark)] py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-card text-rust">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 13c3-4 7-4 10 0-3 4-7 4-10 0Zm10 0 4-3v6l-4-3Z" /><circle cx="7" cy="12.5" r="0.6" fill="currentColor" />
            </svg>
          </span>
          <div>
            <p className="kicker">Also from our workshop</p>
            <h2 className="display mt-2 text-[1.6rem] sm:text-[1.9rem]">Aquariums, reef and freshwater.</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/65">
              We design and build custom marine and freshwater tanks on request. Tell us the space and what you would like to keep, and we will plan it with you.
            </p>
          </div>
        </div>
        <a
          href={whatsappUrl("Hi ViraHaus, I'd like to ask about a custom aquarium.")}
          target="_blank"
          rel="noopener"
          className="inline-flex h-12 shrink-0 items-center self-start rounded-full border border-ink/35 px-6 text-sm transition hover:border-ink md:self-auto"
        >
          Ask about an aquarium
        </a>
      </Reveal>
    </section>
  );
}
