"use client";

import { useState, type FormEvent } from "react";

import { isPreorder, PREORDER_WEEKS, type Product } from "@/data/products";
import { EXTRA } from "@/data/products-extra";
import { whatsappUrl } from "@/lib/contact";
import { price, T, type Lang } from "@/lib/i18n";

/*
 * The form at the foot of each product page, for visitors arriving from an ad.
 * It builds the order as a WhatsApp message in the page's language and opens it;
 * the business confirms from there.
 */
export default function OrderForm({ product, lang, variant, onVariant }: { product: Product; lang: Lang; variant: number; onVariant: (i: number) => void }) {
  const t = T[lang];
  const preorder = isPreorder(product);
  const labels = lang === "ar" ? EXTRA[product.slug].ar.options : product.variants.options.map((o) => o.label);
  const name = lang === "ar" ? EXTRA[product.slug].ar.name : product.name;

  const [form, setForm] = useState({ name: "", phone: "", city: "", qty: 1, gift: false, recipient: "", note: "", date: "", notes: "" });
  const [state, setState] = useState<"idle" | "error" | "sent">("idle");
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const unit = product.price + product.variants.options[variant].delta;
  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + (preorder ? PREORDER_WEEKS * 7 : 1));
    return d.toISOString().slice(0, 10);
  })();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.phone.replace(/\D/g, "").length < 7) {
      setState("error");
      return;
    }
    const details = [
      [t.msgName, form.name.trim()],
      [t.msgPhone, form.phone.trim()],
      [t.msgCity, form.city.trim()],
      [t.msgDate, form.date],
      [t.msgGift, form.gift ? form.recipient.trim() : ""],
      [t.msgNote, form.gift && form.note.trim() ? `"${form.note.trim()}"` : ""],
      [t.msgNotes, form.notes.trim()],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`);
    const item = `• ${name} (${labels[variant]}) ×${form.qty} — ${price(unit * form.qty, lang)} — ${preorder ? t.msgPre(PREORDER_WEEKS) : t.msgReady}`;
    window.open(whatsappUrl([t.msgHello, "", item, "", ...details].join("\n")), "_blank", "noopener");
    setState("sent");
  };

  const field = "h-12 w-full rounded-full border border-ink/25 bg-sand px-5 text-[0.95rem] outline-none transition placeholder:text-ink/40 focus:border-ink";
  const label = "mb-1.5 block text-sm text-ink/70";

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <div>
        <label className={label} htmlFor="f-name">{t.name} *</label>
        <input id="f-name" className={field} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" required />
      </div>
      <div>
        <label className={label} htmlFor="f-phone">{t.phone} *</label>
        <input id="f-phone" className={field} value={form.phone} onChange={(e) => set("phone", e.target.value)} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="07XXXXXXXX" required />
      </div>
      <div>
        <label className={label} htmlFor="f-city">{t.city}</label>
        <input id="f-city" className={field} value={form.city} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" />
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div>
          <label className={label} htmlFor="f-size">{t.size}</label>
          <select id="f-size" className={field} value={variant} onChange={(e) => onVariant(+e.target.value)}>
            {labels.map((l, i) => <option key={l} value={i}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="f-qty">{t.quantity}</label>
          <input id="f-qty" className={`${field} w-24 text-center`} type="number" min={1} value={form.qty} onChange={(e) => set("qty", Math.max(1, +e.target.value || 1))} />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="f-date">{t.date}</label>
        <input id="f-date" className={field} type="date" min={minDate} value={form.date} onChange={(e) => set("date", e.target.value)} suppressHydrationWarning />
      </div>
      <div className="flex items-end">
        <label className="flex h-12 cursor-pointer items-center gap-3 text-[0.95rem]">
          <input type="checkbox" checked={form.gift} onChange={(e) => set("gift", e.target.checked)} className="h-5 w-5 accent-[#753319]" />
          {t.isGift}
        </label>
      </div>
      {form.gift && (
        <>
          <div>
            <label className={label} htmlFor="f-rec">{t.recipient}</label>
            <input id="f-rec" className={field} value={form.recipient} onChange={(e) => set("recipient", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="f-note">{t.note}</label>
            <input id="f-note" className={field} value={form.note} onChange={(e) => set("note", e.target.value)} />
          </div>
        </>
      )}
      <div className="sm:col-span-2">
        <label className={label} htmlFor="f-notes">{t.notes}</label>
        <textarea id="f-notes" rows={3} className="w-full resize-none rounded-[1.5rem] border border-ink/25 bg-sand px-5 py-3 text-[0.95rem] outline-none transition focus:border-ink" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/60" aria-live="polite">
          {state === "error" ? <span className="text-rust">{t.required}</span> : state === "sent" ? t.sent : `${price(unit * form.qty, lang)}${t.sep}${preorder ? t.preorder(PREORDER_WEEKS) : t.readyNow}`}
        </p>
        <button type="submit" className="h-14 rounded-full bg-ink px-8 text-[0.95rem] text-sand transition hover:bg-black">{t.send}</button>
      </div>
    </form>
  );
}
