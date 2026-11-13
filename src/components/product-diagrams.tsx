import type { Shape, Size } from "@/data/products-extra";
import { num, T, type Lang } from "@/lib/i18n";

const INK = "#16140f";
const RUST = "#753319";
const GLASS = "rgba(255,255,255,0.45)";
const GREEN = "#5f7d3c";

/*
 * The piece drawn to scale beside something everyone knows: a mug for anything
 * up to 70 cm, a standing person for the large tanks. Measurements are drawn as
 * dimension lines so the size reads without a ruler.
 */
export function SizeDiagram({ shape, size, lang }: { shape: Shape; size: Size; lang: Lang }) {
  const t = T[lang];
  const big = size.h > 70;
  const ref = big ? { h: 170, w: 45 } : { h: 10, w: 8 };
  const ground = 300;
  const scale = 230 / Math.max(size.h, ref.h);
  const w = size.w * scale;
  const h = size.h * scale;
  const cx = 230;
  const x0 = cx - w / 2;
  const y0 = ground - h;
  const rw = ref.w * scale;
  const rh = ref.h * scale;
  const rx = 430;
  const round = shape === "jar" || shape === "cylinder" || shape === "pot" || shape === "air";

  return (
    <svg viewBox="0 0 560 350" className="h-auto w-full" role="img" aria-label={`${t.height} ${size.h} ${t.cm}, ${round ? t.diameter : t.width} ${size.w} ${t.cm}`}>
      {/* ground */}
      <line x1="40" y1={ground} x2="520" y2={ground} stroke={INK} strokeOpacity="0.25" />

      <Piece shape={shape} x0={x0} y0={y0} w={w} h={h} />

      {/* height */}
      <g stroke={RUST} strokeWidth="1.2">
        <line x1={x0 - 26} y1={y0} x2={x0 - 26} y2={ground} />
        <line x1={x0 - 32} y1={y0} x2={x0 - 20} y2={y0} />
        <line x1={x0 - 32} y1={ground} x2={x0 - 20} y2={ground} />
      </g>
      <text x={x0 - 38} y={y0 + h / 2} textAnchor="end" dominantBaseline="middle" fontSize="15" fill={INK}>
        {num(size.h, lang)} {t.cm}
      </text>

      {/* width */}
      <g stroke={RUST} strokeWidth="1.2">
        <line x1={x0} y1={ground + 20} x2={x0 + w} y2={ground + 20} />
        <line x1={x0} y1={ground + 14} x2={x0} y2={ground + 26} />
        <line x1={x0 + w} y1={ground + 14} x2={x0 + w} y2={ground + 26} />
      </g>
      <text x={cx} y={ground + 42} textAnchor="middle" fontSize="15" fill={INK}>
        {round ? "Ø " : ""}{num(size.w, lang)} {t.cm}
      </text>

      {/* reference object */}
      {big ? <Person x={rx} ground={ground} w={rw} h={rh} /> : <Mug x={rx} ground={ground} w={rw} h={rh} />}
      <text x={rx} y={ground + 42} textAnchor="middle" fontSize="13" fill={INK} fillOpacity="0.55">
        {big ? t.person : t.mug}
      </text>
    </svg>
  );
}

function Piece({ shape, x0, y0, w, h }: { shape: Shape; x0: number; y0: number; w: number; h: number }) {
  const cx = x0 + w / 2;
  const ground = y0 + h;
  const stroke = { stroke: INK, strokeWidth: 1.5 };

  if (shape === "jar") {
    const capH = h * 0.08;
    const neckW = w * 0.42;
    const shoulder = y0 + h * 0.24;
    const r = w * 0.2;
    return (
      <g>
        <path
          d={`M${cx - neckW / 2} ${y0 + capH} L${cx - neckW / 2} ${y0 + h * 0.14} L${x0} ${shoulder} L${x0} ${ground - r} Q${x0} ${ground} ${x0 + r} ${ground} L${x0 + w - r} ${ground} Q${x0 + w} ${ground} ${x0 + w} ${ground - r} L${x0 + w} ${shoulder} L${cx + neckW / 2} ${y0 + h * 0.14} L${cx + neckW / 2} ${y0 + capH} Z`}
          fill={GLASS}
          {...stroke}
        />
        <path d={`M${x0 + 3} ${ground - h * 0.42} Q${cx - w * 0.15} ${ground - h * 0.62} ${cx} ${ground - h * 0.5} T${x0 + w - 3} ${ground - h * 0.46} L${x0 + w - 3} ${ground - r} Q${x0 + w - 3} ${ground - 3} ${x0 + w - r} ${ground - 3} L${x0 + r} ${ground - 3} Q${x0 + 3} ${ground - 3} ${x0 + 3} ${ground - r} Z`} fill={GREEN} fillOpacity="0.55" />
        <rect x={cx - neckW / 2 - 4} y={y0} width={neckW + 8} height={capH} rx="3" fill={INK} />
      </g>
    );
  }

  if (shape === "cylinder") {
    const e = Math.min(10, w * 0.12);
    return (
      <g>
        <rect x={x0} y={y0} width={w} height={h} rx="4" fill={GLASS} {...stroke} />
        <ellipse cx={cx} cy={y0} rx={w / 2} ry={e} fill={GLASS} {...stroke} />
        <rect x={x0 + 3} y={ground - h * 0.45} width={w - 6} height={h * 0.45 - 3} rx="3" fill={GREEN} fillOpacity="0.55" />
      </g>
    );
  }

  if (shape === "tank") {
    return (
      <g>
        <rect x={x0} y={y0} width={w} height={h} rx="3" fill={GLASS} {...stroke} />
        <rect x={x0} y={y0} width={w} height={h * 0.05} fill={INK} />
        <rect x={x0 + 3} y={y0 + h * 0.22} width={w - 6} height={h * 0.78 - 3} rx="2" fill={GREEN} fillOpacity="0.55" />
      </g>
    );
  }

  if (shape === "cabinet") {
    const tank = h * 0.55;
    return (
      <g>
        <rect x={x0} y={y0} width={w} height={tank} rx="3" fill={GLASS} {...stroke} />
        <rect x={x0 + 3} y={y0 + tank * 0.12} width={w - 6} height={tank * 0.88 - 3} rx="2" fill={GREEN} fillOpacity="0.55" />
        <rect x={x0} y={y0 + tank} width={w} height={h - tank} rx="3" fill={INK} />
      </g>
    );
  }

  if (shape === "air") {
    const leaves = Array.from({ length: 9 }, (_, i) => {
      const a = -Math.PI / 2 + (i - 4) * 0.32;
      return `M${cx} ${ground} L${cx + Math.cos(a) * w * 0.55} ${ground + Math.sin(a) * h}`;
    });
    return <path d={leaves.join(" ")} stroke={GREEN} strokeWidth="3" strokeLinecap="round" fill="none" />;
  }

  /* pot with foliage */
  const potH = Math.min(w * 0.95, h * 0.42);
  const top = ground - potH;
  return (
    <g>
      <ellipse cx={cx - w * 0.28} cy={top - (h - potH) * 0.45} rx={w * 0.38} ry={(h - potH) * 0.32} fill={GREEN} fillOpacity="0.7" />
      <ellipse cx={cx + w * 0.3} cy={top - (h - potH) * 0.5} rx={w * 0.36} ry={(h - potH) * 0.34} fill={GREEN} fillOpacity="0.7" />
      <ellipse cx={cx} cy={top - (h - potH) * 0.62} rx={w * 0.34} ry={(h - potH) * 0.38} fill={GREEN} fillOpacity="0.85" />
      <path d={`M${x0} ${top} L${x0 + w} ${top} L${x0 + w * 0.88} ${ground} L${x0 + w * 0.12} ${ground} Z`} fill="#f4f3f0" {...stroke} />
    </g>
  );
}

function Mug({ x, ground, w, h }: { x: number; ground: number; w: number; h: number }) {
  return (
    <g stroke={INK} strokeWidth="1.5" fill="#f4f3f0">
      <path d={`M${x + w / 2} ${ground - h * 0.75} q${w * 0.45} 0 ${w * 0.45} ${h * 0.3} t${-w * 0.45} ${h * 0.3}`} fill="none" />
      <rect x={x - w / 2} y={ground - h} width={w} height={h} rx={w * 0.12} />
    </g>
  );
}

function Person({ x, ground, w, h }: { x: number; ground: number; w: number; h: number }) {
  const head = h * 0.065;
  return (
    <g fill={INK} fillOpacity="0.18" stroke={INK} strokeOpacity="0.5">
      <circle cx={x} cy={ground - h + head} r={head} />
      <path d={`M${x - w / 2} ${ground - h * 0.48} Q${x - w / 2} ${ground - h * 0.82} ${x} ${ground - h * 0.83} Q${x + w / 2} ${ground - h * 0.82} ${x + w / 2} ${ground - h * 0.48} L${x + w * 0.28} ${ground} L${x - w * 0.28} ${ground} Z`} />
    </g>
  );
}

/* A cross-section of a sealed jar with its six layers numbered; the legend sits beside it as text, so it reads in either language. */
export function JarAnatomy({ lang }: { lang: Lang }) {
  const t = T[lang];
  const marks = [
    { n: 1, x: 150, y: 34 },
    { n: 2, x: 228, y: 120 },
    { n: 3, x: 120, y: 190 },
    { n: 4, x: 185, y: 232 },
    { n: 5, x: 120, y: 278 },
    { n: 6, x: 175, y: 306 },
  ];
  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
      <svg viewBox="0 0 300 340" className="mx-auto h-auto w-full max-w-[320px]" role="img" aria-label={t.insideTitle}>
        <defs>
          <pattern id="drain" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="3.2" fill="#8c8278" />
          </pattern>
          <clipPath id="jarclip">
            <path d="M115 40 L115 70 L40 112 L40 290 Q40 324 74 324 L226 324 Q260 324 260 290 L260 112 L185 70 L185 40 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#jarclip)">
          <rect x="0" y="0" width="300" height="340" fill="rgba(255,255,255,0.45)" />
          <rect x="0" y="296" width="300" height="40" fill="url(#drain)" />
          <rect x="0" y="262" width="300" height="36" fill="#3b2d22" />
          <path d="M70 264 L120 196 L150 214 L178 168 L230 264 Z" fill="#4b4a46" />
          <path d="M40 258 Q80 232 110 248 Q140 224 168 246 Q200 222 236 240 Q252 232 262 244 L262 270 L40 270 Z" fill={GREEN} />
          <path d="M96 246 q-6 -40 -26 -64 M100 244 q10 -36 30 -52 M200 236 q4 -34 22 -52" stroke={GREEN} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M60 150 q8 4 6 10 M236 176 q-6 6 -4 12 M210 132 q6 4 4 10" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        <path d="M115 40 L115 70 L40 112 L40 290 Q40 324 74 324 L226 324 Q260 324 260 290 L260 112 L185 70 L185 40" fill="none" stroke={INK} strokeWidth="1.6" />
        <rect x="108" y="20" width="84" height="22" rx="5" fill={INK} />
        <rect x="120" y="40" width="60" height="5" fill="#fffbe8" />
        {marks.map((m) => (
          <g key={m.n}>
            <circle cx={m.x} cy={m.y} r="11" fill={RUST} />
            <text x={m.x} y={m.y + 0.5} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#fff">
              {num(m.n, lang)}
            </text>
          </g>
        ))}
      </svg>
      <ol className="space-y-4">
        {t.layers.map((l, i) => (
          <li key={l.name} className="flex gap-4">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rust text-xs text-white">{num(i + 1, lang)}</span>
            <div>
              <p className="font-medium">{l.name}</p>
              <p className="text-sm leading-relaxed text-ink/65">{l.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
