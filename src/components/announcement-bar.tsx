import type { Lang } from "@/lib/i18n";

/* PLACEHOLDER policy: the one line every leading shop opens with — threshold, cut-off, payment. */
export default function AnnouncementBar({ lang }: { lang: Lang }) {
  const text =
    lang === "ar"
      ? ["خصم ١٠٪ على طلبك الأول: WELCOME10", "توصيل مجاني فوق ٥٠ د.أ", "نفس اليوم في عمّان قبل الساعة ٤", "الدفع عند الاستلام"]
      : ["10% off your first order: WELCOME10", "Free delivery over 50 JD", "Same-day in Amman before 4 pm", "Pay on delivery"];
  return (
    <div className="relative z-50 bg-ink px-4 py-2 text-center text-[0.75rem] text-sand/90">
      <p className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
        {text.map((t, i) => (
          <span key={t} className={`items-center gap-3 ${i === 0 ? "flex" : i === 1 ? "hidden sm:flex" : "hidden lg:flex"}`}>
            {i > 0 && <span className="h-1 w-1 rounded-full bg-sand/40" aria-hidden />}
            {t}
          </span>
        ))}
      </p>
    </div>
  );
}
