"use client";

import { useRef, useState } from "react";

import { whatsappUrl } from "@/lib/contact";
import { CARD_AMOUNTS, XC } from "@/lib/extras-copy";
import { price as fmt, type Lang } from "@/lib/i18n";
import { useCart } from "./cart";

export default function GiftCardPage({ lang }: { lang: Lang }) {
  const t = XC[lang].card;
  const { add } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState(50);
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");
  const [printed, setPrinted] = useState(false);
  const [date, setDate] = useState("");

  const how = printed ? t.printed : t.digital;
  const details = [`${t.amount}: ${fmt(amount, lang)}`, to && `${t.to}: ${to}`, from && `${t.from}: ${from}`, msg && `${t.message}: "${msg}"`, `${t.delivery} ${how}`, date && `${t.sendOn}: ${date}`].filter(Boolean) as string[];

  const addToJar = () =>
    add(
      {
        slug: `custom-giftcard-${Date.now()}`,
        name: XC.en.card.name,
        nameAr: XC.ar.card.name,
        variant: [`${amount} JD`, to && `to ${to}`, printed ? XC.en.card.printed : XC.en.card.digital].filter(Boolean).join(" · "),
        variantAr: [fmt(amount, "ar"), to && `إلى ${to}`, printed ? XC.ar.card.printed : XC.ar.card.digital].filter(Boolean).join(" – "),
        price: amount,
        image: "/media/gift-card.jpg",
      },
      1,
      cardRef.current,
    );

  const field = "h-12 w-full rounded-full border border-ink/25 bg-white px-5 text-[0.95rem] outline-none transition focus:border-ink";
  const label = "mb-1.5 block text-sm text-ink/70";
  const chip = (on: boolean) => `min-h-12 rounded-full border py-2 leading-tight text-[0.95rem] tabular-nums transition ${on ? "border-ink bg-ink text-white" : "border-ink/20 hover:border-ink/60"}`;

  return (
    <div className="bg-white text-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-10 pb-28 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-14 lg:pb-24">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="kicker">{t.kicker}</p>
          <h1 className="display mt-3 text-[clamp(2.2rem,4.6vw,3.6rem)]">{t.title}</h1>
          <p className="mt-4 max-w-lg text-[1.02rem] leading-relaxed text-ink/70">{t.lede}</p>

          {/* The card, as it will look */}
          <div ref={cardRef} className="relative mt-8 aspect-[1.6] w-full max-w-lg overflow-hidden rounded-[1.75rem] bg-ink p-6 text-sand shadow-[0_30px_60px_-30px_rgba(22,20,15,0.6)] sm:p-8">
            <svg viewBox="0 0 200 200" className="absolute -end-10 -bottom-12 h-56 w-56 text-sand/10" aria-hidden>
              <path d="M70 20 h60 v24 c0 10 12 16 26 26 c22 16 28 36 28 60 v40 c0 14 -10 24 -24 24 h-120 c-14 0 -24 -10 -24 -24 v-40 c0 -24 6 -44 28 -60 c14 -10 26 -16 26 -26 z" fill="currentColor" />
            </svg>
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <span className="display text-lg tracking-wide" dir="ltr">ViraHaus</span>
                <span className="text-xs text-sand/60">{t.cardLabel}</span>
              </div>
              <div>
                <p className="display text-[clamp(2.4rem,7vw,3.6rem)] leading-none tabular-nums">{fmt(amount, lang)}</p>
                <p className="mt-3 line-clamp-2 min-h-[2.5em] text-sm text-sand/75">{msg || t.messagePh}</p>
                <p className="mt-2 truncate text-xs text-sand/55">{[to && `${t.to} ${to}`, from && `${t.from} ${from}`].filter(Boolean).join(lang === "ar" ? "  –  " : "  ·  ") || " "}</p>
              </div>
            </div>
          </div>

          <ul className="mt-6 grid gap-2 text-sm text-ink/65">
            {t.terms.map((x) => <li key={x} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rust" aria-hidden />{x}</li>)}
          </ul>
        </div>

        <div className="grid content-start gap-6">
          <fieldset>
            <legend className={label}>{t.amount}</legend>
            <div className="grid grid-cols-4 gap-2">
              {CARD_AMOUNTS.map((a) => <button key={a} type="button" aria-pressed={amount === a} onClick={() => setAmount(a)} className={chip(amount === a)}>{fmt(a, lang)}</button>)}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={label} htmlFor="g-to">{t.to}</label><input id="g-to" className={field} value={to} maxLength={30} onChange={(e) => setTo(e.target.value)} /></div>
            <div><label className={label} htmlFor="g-from">{t.from}</label><input id="g-from" className={field} value={from} maxLength={30} onChange={(e) => setFrom(e.target.value)} /></div>
          </div>
          <div><label className={label} htmlFor="g-msg">{t.message}</label><textarea id="g-msg" rows={3} maxLength={140} placeholder={t.messagePh} className="w-full resize-none rounded-[1.5rem] border border-ink/25 bg-white px-5 py-3 text-[0.95rem] outline-none placeholder:text-ink/40 focus:border-ink" value={msg} onChange={(e) => setMsg(e.target.value)} /></div>
          <fieldset>
            <legend className={label}>{t.delivery}</legend>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" aria-pressed={!printed} onClick={() => setPrinted(false)} className={`${chip(!printed)} px-3 text-sm`}>{t.digital}</button>
              <button type="button" aria-pressed={printed} onClick={() => setPrinted(true)} className={`${chip(printed)} px-3 text-sm`}>{t.printed}</button>
            </div>
          </fieldset>
          <div className="sm:max-w-xs"><label className={label} htmlFor="g-date">{t.sendOn}</label><input id="g-date" type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="grid gap-3 border-t border-[var(--hair-dark)] pt-6 sm:grid-cols-2">
            <button type="button" onClick={addToJar} className="h-14 rounded-full bg-ink text-[0.95rem] text-white transition hover:bg-black">{t.add}{lang === "ar" ? " – " : " · "}{fmt(amount, lang)}</button>
            <a href={whatsappUrl([t.msgHello, "", ...details].join("\n"))} target="_blank" rel="noopener" className="flex h-14 items-center justify-center rounded-full border border-ink/25 text-[0.95rem] transition hover:border-ink">{t.order}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
