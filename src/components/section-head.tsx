import type { ReactNode } from "react";

import Reveal from "./reveal";

/* The same opening for every section: rust kicker, a display heading, an optional line and action. */
export default function SectionHead({ kicker, title, lede, action, light = false }: { kicker: string; title: ReactNode; lede?: string; action?: ReactNode; light?: boolean }) {
  return (
    <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className={`kicker ${light ? "!text-white/70" : ""}`}>{kicker}</p>
        <h2 className="display mt-4 text-[clamp(2rem,4.2vw,3.5rem)]">{title}</h2>
        {lede && <p className={`mt-4 max-w-xl text-[1.02rem] leading-relaxed ${light ? "text-white/80" : "text-ink/70"}`}>{lede}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
