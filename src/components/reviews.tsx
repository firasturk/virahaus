import { whatsappUrl } from "@/lib/contact";
import { XC } from "@/lib/extras-copy";
import type { Lang } from "@/lib/i18n";
import Reveal from "./reveal";

/* PLACEHOLDER: sample reviews, labelled as such on the page. Replace with real ones as they arrive. */
export default function Reviews({ lang, tone = "white", bare = false }: { lang: Lang; tone?: "white" | "sand"; bare?: boolean }) {
  const t = XC[lang].reviews;
  return (
    <section className={bare ? "mt-20 text-ink" : `px-5 py-20 text-ink sm:px-10 lg:py-24 ${tone === "sand" ? "bg-sand" : "bg-white"}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">{t.kicker}</p>
            <h2 className="display mt-3 text-[clamp(2rem,4vw,3rem)]">{t.title}</h2>
          </div>
          <a href={whatsappUrl()} target="_blank" rel="noopener" className="text-sm text-rust hover:text-ink">{t.cta}</a>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {t.items.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.06} className={`flex flex-col rounded-[1.5rem] p-6 ${tone === "sand" ? "bg-white" : "bg-sand"}`}>
              <p className="text-rust" aria-label="5/5">★★★★★</p>
              <p className="mt-4 flex-1 text-[1.02rem] leading-relaxed">“{r.text}”</p>
              <p className="mt-6 text-sm">
                <span className="font-medium">{r.name}</span>
                <span className="text-ink/55">{lang === "ar" ? "، " : ", "}{r.city}</span>
              </p>
              <p className="text-xs text-ink/50">{r.product}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-5 text-xs text-ink/45">{t.sample}</p>
      </div>
    </section>
  );
}
