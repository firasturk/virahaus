import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/contact";
import Reveal from "./reveal";

export default function ContactBand() {
  return (
    <section id="contact" className="relative bg-sand px-5 py-20 text-ink sm:px-10 lg:py-24">
      <Reveal className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[2.5rem] bg-card p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="kicker">Contact</p>
          <h2 className="display mt-4 text-[clamp(1.9rem,3.6vw,3rem)]">Questions before you order?</h2>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-ink/70">Sizes, care, delivery, a custom build — ask us on WhatsApp and we&apos;ll answer.</p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <a href={whatsappUrl("Hi ViraHaus, I have a question.")} target="_blank" rel="noopener" className="inline-flex h-14 items-center gap-3 rounded-full bg-ink px-8 text-[0.95rem] text-sand transition hover:bg-black">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.3 4.4c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-2-.9c-.3-.1-.5-.2-.7.1l-.9 1.1c-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.4 0-.5l-.9-2.1c-.2-.6-.4-.5-.6-.5Z" />
            </svg>
            Chat on WhatsApp
          </a>
          <span className="text-sm tabular-nums text-ink/60">{WHATSAPP_DISPLAY}</span>
        </div>
      </Reveal>
    </section>
  );
}
