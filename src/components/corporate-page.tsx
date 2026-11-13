"use client";

import { useRef, useState, type FormEvent } from "react";

import { whatsappUrl } from "@/lib/contact";
import { CORP_TIERS, XC } from "@/lib/extras-copy";
import { num, type Lang } from "@/lib/i18n";
import Reveal from "./reveal";

/* A flat drawing of the gift: the box with your logo on its sleeve, the jar, and the engraved lid seen from above. */
function Mockup({ logo, label }: { logo: string | null; label: string }) {
  const mark = (x: number, y: number, w: number, h: number, mode: "engrave" | "light", size: number) =>
    logo ? (
      <image href={logo} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid meet" filter={`url(#${mode})`} style={{ mixBlendMode: mode === "engrave" ? "multiply" : "screen" }} />
    ) : (
      <text x={x + w / 2} y={y + h / 2 + size / 3} textAnchor="middle" fontSize={size} fontWeight={600} fill={mode === "engrave" ? "#4a3523" : "#e9e3d9"} style={{ letterSpacing: "0.12em" }}>
        {label}
      </text>
    );

  return (
    <svg viewBox="0 0 600 460" className="h-auto w-full" role="img" aria-label={label}>
      <defs>
        <filter id="engrave"><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncR type="linear" slope="0.55" /><feFuncG type="linear" slope="0.45" /><feFuncB type="linear" slope="0.35" /></feComponentTransfer></filter>
        <filter id="light"><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncR type="table" tableValues="1 0" /><feFuncG type="table" tableValues="1 0" /><feFuncB type="table" tableValues="1 0" /></feComponentTransfer></filter>
        <clipPath id="lid-top"><circle cx="478" cy="78" r="58" /></clipPath>
      </defs>

      {/* box */}
      <rect x="40" y="214" width="270" height="206" rx="6" fill="#c9a274" stroke="#16140f" strokeWidth="2.5" />
      <rect x="28" y="190" width="294" height="40" rx="6" fill="#bb9163" stroke="#16140f" strokeWidth="2.5" />
      <rect x="40" y="272" width="270" height="92" fill="#16140f" />
      {mark(95, 286, 160, 64, "light", 20)}
      <path d="M175 190 C150 150 120 150 128 176 C134 192 160 190 175 190 C190 190 216 192 222 176 C230 150 200 150 175 190 Z" fill="#753319" stroke="#16140f" strokeWidth="2" />

      {/* jar */}
      <rect x="372" y="196" width="172" height="224" rx="22" fill="#eef1ea" stroke="#16140f" strokeWidth="2.5" />
      <path d="M372 360 C420 344 490 368 544 352 V398 C544 410 534 420 522 420 H394 C382 420 372 410 372 398 Z" fill="#5a4332" />
      {[[400, 346, 22], [436, 338, 26], [474, 344, 20], [510, 336, 24]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? "#6f8f3f" : "#5b7a33"} />
      ))}
      <path d="M452 330 C452 290 446 262 432 236 M452 320 C462 290 476 270 494 254 M452 326 C440 300 420 286 404 280" stroke="#4c7a33" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <rect x="384" y="206" width="10" height="150" rx="5" fill="#fff" opacity="0.6" />
      <rect x="362" y="172" width="192" height="30" rx="8" fill="#b08a62" stroke="#16140f" strokeWidth="2.5" />

      {/* lid seen from above */}
      <path d="M458 172 L470 136" stroke="#16140f" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="478" cy="78" r="58" fill="#b8915f" stroke="#16140f" strokeWidth="2.5" />
      <g clipPath="url(#lid-top)">
        {[20, 34, 48].map((r) => <circle key={r} cx="478" cy="78" r={r} fill="none" stroke="#a37d4e" strokeWidth="1.2" />)}
        {mark(438, 52, 80, 52, "engrave", 11)}
      </g>
    </svg>
  );
}

export default function CorporatePage({ lang }: { lang: Lang }) {
  const t = XC[lang].corp;
  const ar = lang === "ar";
  const [logo, setLogo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [f, setF] = useState({ company: "", name: "", phone: "", qty: 25, product: 0, place: 2, date: "", notes: "" });
  const [err, setErr] = useState(false);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));

  const pickLogo = (file?: File) => {
    if (!file) return;
    if (logo) URL.revokeObjectURL(logo);
    setLogo(URL.createObjectURL(file));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.company.trim() || !f.name.trim() || f.phone.replace(/\D/g, "").length < 7) return setErr(true);
    setErr(false);
    const lines = [
      t.msgHello,
      "",
      `${t.company}: ${f.company.trim()}`,
      `${t.name}: ${f.name.trim()}`,
      `${t.phone}: ${f.phone.trim()}`,
      `${t.qty}: ${f.qty}`,
      `${t.product}: ${t.products[f.product]}`,
      `${t.place}: ${t.placeOpts[f.place]}`,
      f.date ? `${t.date}: ${f.date}` : "",
      f.notes.trim() ? `${t.notes}: ${f.notes.trim()}` : "",
      "",
      t.msgLogo,
    ].filter((l, i, a) => l || a[i - 1]);
    window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener");
  };

  const field = "h-12 w-full rounded-full border border-ink/25 bg-white px-5 text-[0.95rem] outline-none transition focus:border-ink";
  const label = "mb-1.5 block text-sm text-ink/70";
  const wrap = "mx-auto max-w-7xl px-5 sm:px-10";

  return (
    <div className="bg-white text-ink">
      {/* Hero with the live mockup */}
      <section className={`${wrap} grid gap-10 pt-10 pb-16 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16 lg:pt-14`}>
        <div>
          <p className="kicker">{t.kicker}</p>
          <h1 className="display mt-3 text-[clamp(2.3rem,5vw,4rem)]">{t.title}</h1>
          <p className="mt-4 max-w-lg text-[1.05rem] leading-relaxed text-ink/70">{t.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappUrl(`${t.msgHello}\n\n${t.msgLogo}`)} target="_blank" rel="noopener" className="inline-flex h-13 items-center rounded-full bg-ink px-7 py-3.5 text-[0.95rem] text-white transition hover:bg-black">{t.cta}</a>
            <a href="#quote" className="inline-flex h-13 items-center rounded-full border border-ink/25 px-7 py-3.5 text-[0.95rem] transition hover:border-ink">{t.ctaForm}</a>
          </div>
        </div>
        <div className="rounded-[2rem] bg-sand p-5 sm:p-8">
          <Mockup logo={logo} label={t.yourLogo} />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" id="corp-logo" onChange={(e) => pickLogo(e.target.files?.[0])} />
            <label htmlFor="corp-logo" className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-white px-5 text-sm transition hover:bg-ink hover:text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
              {t.tryLogo}
            </label>
            {logo && (
              <button type="button" onClick={() => { URL.revokeObjectURL(logo); setLogo(null); if (fileRef.current) fileRef.current.value = ""; }} className="text-sm text-ink/60 underline underline-offset-4 hover:text-ink">{t.reset}</button>
            )}
            <span className="text-xs text-ink/50">{t.tryHint}</span>
          </div>
        </div>
      </section>

      {/* Where the logo goes */}
      <Reveal className={`${wrap} pb-16`}>
        <h2 className="display text-[clamp(1.7rem,3vw,2.3rem)]">{t.placesTitle}</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {t.places.map((p, i) => (
            <div key={p.title} className="rounded-2xl border border-[var(--hair-dark)] p-6">
              <span className="display text-[1.6rem] text-rust">{num(i + 1, lang)}</span>
              <h3 className="mt-3 font-medium">{p.title}</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink/65">{p.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Tiers and occasions */}
      <Reveal className={`${wrap} pb-16`}>
        <div className="grid gap-6 rounded-[2rem] bg-ink p-6 text-sand sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div>
            <h2 className="display text-[clamp(1.7rem,3vw,2.3rem)]">{t.tiersTitle}</h2>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {CORP_TIERS.map((tier) => (
                <div key={tier.from} className="rounded-2xl bg-sand/10 p-4 text-center">
                  <p className="display text-[clamp(1.4rem,3vw,2rem)]">{t.off(tier.off)}</p>
                  <p className="mt-1 text-xs text-sand/70">{t.tier(tier.from, tier.to)}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-sand/70">{t.tiersNote}</p>
          </div>
          <div>
            <p className="kicker text-sand/60">{t.occasionsTitle}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {t.occasions.map((o) => <li key={o} className="rounded-full border border-sand/25 px-4 py-2 text-sm">{o}</li>)}
            </ul>
          </div>
        </div>
      </Reveal>

      {/* Steps */}
      <Reveal className={`${wrap} pb-16`}>
        <h2 className="display text-[clamp(1.7rem,3vw,2.3rem)]">{t.stepsTitle}</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((s, i) => (
            <li key={s.title} className="border-t border-ink pt-4">
              <span className="text-xs text-ink/50">{num(i + 1, lang).padStart(2, ar ? "٠" : "0")}</span>
              <h3 className="mt-2 font-medium">{s.title}</h3>
              <p className="mt-1 text-[0.95rem] leading-relaxed text-ink/65">{s.text}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* Quote form */}
      <section id="quote" className={`${wrap} scroll-mt-24 pb-24`}>
        <div className="rounded-[2.5rem] bg-sand p-5 sm:p-10 lg:p-14">
          <h2 className="display text-[clamp(1.9rem,3.6vw,3rem)]">{t.formTitle}</h2>
          <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-ink/70">{t.formLede}</p>
          <form onSubmit={submit} noValidate className="mt-8 grid gap-4 sm:grid-cols-2">
            <div><label className={label} htmlFor="c-company">{t.company} *</label><input id="c-company" className={field} value={f.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" /></div>
            <div><label className={label} htmlFor="c-name">{t.name} *</label><input id="c-name" className={field} value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" /></div>
            <div><label className={label} htmlFor="c-phone">{t.phone} *</label><input id="c-phone" className={field} value={f.phone} onChange={(e) => set("phone", e.target.value)} type="tel" inputMode="tel" dir="ltr" placeholder="07XXXXXXXX" autoComplete="tel" /></div>
            <div><label className={label} htmlFor="c-qty">{t.qty}</label><input id="c-qty" className={field} type="number" min={10} value={f.qty} onChange={(e) => set("qty", Math.max(1, +e.target.value || 10))} /></div>
            <div><label className={label} htmlFor="c-product">{t.product}</label><select id="c-product" className={field} value={f.product} onChange={(e) => set("product", +e.target.value)}>{t.products.map((p, i) => <option key={p} value={i}>{p}</option>)}</select></div>
            <div><label className={label} htmlFor="c-place">{t.place}</label><select id="c-place" className={field} value={f.place} onChange={(e) => set("place", +e.target.value)}>{t.placeOpts.map((p, i) => <option key={p} value={i}>{p}</option>)}</select></div>
            <div><label className={label} htmlFor="c-date">{t.date}</label><input id="c-date" className={field} type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></div>
            <div className="sm:col-span-2"><label className={label} htmlFor="c-notes">{t.notes}</label><textarea id="c-notes" rows={3} className="w-full resize-none rounded-[1.5rem] border border-ink/25 bg-white px-5 py-3 text-[0.95rem] outline-none focus:border-ink" value={f.notes} onChange={(e) => set("notes", e.target.value)} /></div>
            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-rust" aria-live="polite">{err ? t.required : ""}</p>
              <button type="submit" className="h-14 rounded-full bg-ink px-8 text-[0.95rem] text-white transition hover:bg-black">{t.send}</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
