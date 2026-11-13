"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useRef, useState, type PointerEvent as RPointerEvent } from "react";

import { whatsappUrl } from "@/lib/contact";
import { CZ, ENGRAVE_PRICE, JAR_DIMS, JAR_PRICE, piece, PIECES, type Group, type JarShape, type JarSize, type Mode, type Piece } from "@/lib/customize-data";
import { DICT } from "@/lib/dict";
import { num, price as fmt, type Lang } from "@/lib/i18n";
import { LED_PRICE } from "@/lib/product-copy";
import { useCart } from "./cart";

/* ------------------------------------------------------------------ */
/* Jar geometry, viewBox 0 0 400 520                                   */
/* ------------------------------------------------------------------ */
const GLASS: Record<JarShape, string> = {
  bottle: "M160 34 H240 V80 C240 100 262 110 290 126 C336 152 350 192 350 242 V444 C350 472 330 490 302 490 H98 C70 490 50 472 50 444 V242 C50 192 64 152 110 126 C138 110 160 100 160 80 Z",
  cylinder: "M70 72 H330 V462 C330 478 316 490 300 490 H100 C84 490 70 478 70 462 Z",
  dome: "M82 462 V252 C82 160 140 98 200 98 C260 98 318 160 318 252 V462 Z",
};
const FLOOR: Record<JarShape, number> = { bottle: 400, cylinder: 400, dome: 418 };
const BOTTOM: Record<JarShape, number> = { bottle: 490, cylinder: 490, dome: 462 };
const SCALE: Record<JarSize, number> = { s: 0.84, m: 0.92, l: 1 };

type Item = { uid: number; id: string; x: number; y: number; s: number; flip: boolean };

const defaults = (shape: JarShape): Item[] => [
  { uid: 1, id: "moss", x: 150, y: FLOOR[shape] + 8, s: 1, flip: false },
  { uid: 2, id: "moss", x: 262, y: FLOOR[shape] + 8, s: 0.8, flip: true },
  { uid: 3, id: "fern", x: 215, y: FLOOR[shape] + 4, s: 1, flip: false },
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* ------------------------------------------------------------------ */
/* Drawn stand-ins, used until a photo of the piece exists.            */
/* ------------------------------------------------------------------ */
function Art({ id }: { id: string }) {
  switch (id) {
    case "moss":
      return (
        <g>
          {[[18, 72, 20], [38, 62, 24], [62, 64, 22], [82, 74, 18], [50, 78, 26]].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? "#6f8f3f" : "#5b7a33"} />
          ))}
          {[[30, 58], [48, 54], [66, 58], [24, 70], [76, 66], [56, 70]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="2.4" fill="#a9c46c" />)}
        </g>
      );
    case "fern":
      return (
        <g stroke="#4c7a33" strokeWidth="2.4" strokeLinecap="round" fill="none">
          {[-38, -18, 0, 18, 38].map((a, i) => (
            <g key={i} transform={`rotate(${a} 50 98)`}>
              <path d="M50 98 C50 70 50 40 50 8" />
              {Array.from({ length: 9 }, (_, k) => (
                <path key={k} d={`M50 ${88 - k * 9} l-${10 - k} -6 M50 ${88 - k * 9} l${10 - k} -6`} />
              ))}
            </g>
          ))}
        </g>
      );
    case "fittonia":
      return (
        <g>
          {[[30, 60, -30], [70, 60, 30], [50, 48, 0], [38, 78, -60], [62, 78, 60]].map(([cx, cy, r], i) => (
            <g key={i} transform={`rotate(${r} ${cx} ${cy})`}>
              <ellipse cx={cx} cy={cy} rx="13" ry="20" fill="#3e6a3a" />
              <path d={`M${cx} ${cy - 18} V${cy + 18} M${cx} ${cy - 6} l-8 -5 M${cx} ${cy - 6} l8 -5 M${cx} ${cy + 6} l-8 -5 M${cx} ${cy + 6} l8 -5`} stroke="#f2a7b8" strokeWidth="1.4" fill="none" />
            </g>
          ))}
        </g>
      );
    case "dragon-stone":
      return (
        <g>
          <path d="M6 96 L14 44 L34 18 L60 10 L82 30 L94 62 L92 96 Z" fill="#a76d47" />
          <path d="M34 18 L44 52 L14 44 M60 10 L62 50 L82 30 M44 52 L62 50 L72 96" stroke="#7d4f31" strokeWidth="2" fill="none" />
          {[[26, 66], [52, 70], [70, 60], [40, 84], [80, 80], [24, 50]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="3.4" fill="#6b4029" />)}
        </g>
      );
    case "seiryu-stone":
      return (
        <g>
          <path d="M6 96 L18 50 L30 30 L44 6 L58 26 L74 20 L94 70 L96 96 Z" fill="#878e94" />
          <path d="M44 6 L40 46 L18 50 M58 26 L56 60 L40 46 M74 20 L70 64 L56 60 M70 64 L82 96" stroke="#e6e9ea" strokeWidth="1.6" fill="none" />
        </g>
      );
    case "lava-rock":
      return (
        <g>
          <path d="M8 92 C4 64 18 34 44 26 C70 18 94 44 92 72 C91 86 84 94 70 96 H20 C14 96 9 95 8 92 Z" fill="#2c2826" />
          {[[30, 50], [56, 40], [72, 62], [40, 72], [60, 82], [22, 76]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="2.6" fill="#55504c" />)}
        </g>
      );
    case "driftwood":
      return (
        <g stroke="#b59a7b" strokeLinecap="round" fill="none">
          <path d="M4 92 C24 80 44 74 60 58 C72 46 84 28 96 12" strokeWidth="10" />
          <path d="M44 70 C38 54 36 40 28 24" strokeWidth="6" />
          <path d="M70 46 C78 48 88 50 96 46" strokeWidth="5" />
          <path d="M12 88 C26 80 44 76 58 62" stroke="#d6c3a8" strokeWidth="2" />
        </g>
      );
    case "dragon-wood":
      return (
        <g stroke="#6f4f36" strokeLinecap="round" fill="none">
          <path d="M44 98 C40 80 50 70 46 54 C42 40 30 30 22 8" strokeWidth="8" />
          <path d="M46 60 C58 50 66 36 80 22 C86 16 92 12 96 4" strokeWidth="6" />
          <path d="M44 76 C30 70 18 64 6 50" strokeWidth="5" />
          <path d="M66 40 C72 44 80 46 90 44" strokeWidth="3.5" />
          <path d="M30 26 C24 24 16 24 10 20" strokeWidth="3" />
        </g>
      );
    case "pebbles":
      return (
        <g>
          {[[14, 70, 12, 8], [36, 74, 11, 7], [58, 70, 13, 8], [80, 74, 12, 7], [26, 86, 10, 6], [50, 88, 12, 7], [72, 88, 10, 6]].map(([cx, cy, rx, ry], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#f1eee8" stroke="#cfc9bf" strokeWidth="1" />
          ))}
        </g>
      );
    case "mushroom":
      return (
        <g>
          <path d="M42 96 C42 76 44 60 50 52 C56 60 58 76 58 96 Z" fill="#efe6d6" stroke="#cbbfa9" />
          <path d="M14 56 C14 30 32 16 50 16 C68 16 86 30 86 56 Z" fill="#b8432c" />
          {[[34, 34], [52, 26], [68, 38], [44, 46], [60, 48]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="3.6" fill="#f6efe2" />)}
        </g>
      );
    default:
      return null;
  }
}

function PieceArt({ p, photo, className }: { p: Piece; photo: boolean; className?: string }) {
  return photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={p.src} alt="" draggable={false} className={`${className} object-contain`} />
  ) : (
    <svg viewBox="0 0 100 100" className={className} aria-hidden><Art id={p.id} /></svg>
  );
}

/* ------------------------------------------------------------------ */

export default function Customizer({ lang, photos }: { lang: Lang; photos: string[] }) {
  const t = DICT[lang].customize;
  const z = CZ[lang];
  const ar = lang === "ar";
  const { add } = useCart();
  const has = (id: string) => photos.includes(id);

  const [shape, setShape] = useState<JarShape>("bottle");
  const [size, setSize] = useState<JarSize>("m");
  const [items, setItems] = useState<Item[]>(() => defaults("bottle"));
  const [sel, setSel] = useState<number | null>(null);
  const [tab, setTab] = useState<"plants" | "hardscape" | "extras">("plants");
  const [mode, setMode] = useState<Mode>("mix");
  const [led, setLed] = useState(false);
  const [engrave, setEngrave] = useState("");
  const [note, setNote] = useState("");
  const [ghost, setGhost] = useState<{ id: string; x: number; y: number } | null>(null);
  const [overJar, setOverJar] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const uidp = useId().replace(/:/g, "");
  const ID = { clip: `cz-clip-${uidp}`, glow: `cz-glow-${uidp}`, shine: `cz-shine-${uidp}`, pebble: `cz-pebble-${uidp}` };
  const stageRef = useRef<HTMLDivElement>(null);
  const uid = useRef(10);
  const drag = useRef<{ uid: number; dx: number; dy: number } | null>(null);

  const floor = FLOOR[shape];
  const [dw, dh] = JAR_DIMS[shape][size];
  const piecesTotal = items.reduce((s, it) => s + piece(it.id).price, 0);
  const total = JAR_PRICE[shape][size] + piecesTotal + (led ? LED_PRICE : 0) + (engrave.trim() ? ENGRAVE_PRICE : 0);

  const toSvg = (cx: number, cy: number) => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return { x: 200, y: floor };
    const pt = new DOMPoint(cx, cy).matrixTransform(m.inverse());
    return { x: pt.x, y: pt.y };
  };

  const place = (id: string, at?: { x: number; y: number }) => {
    const p = piece(id);
    const next: Item = {
      uid: ++uid.current,
      id,
      x: clamp(at?.x ?? 120 + ((uid.current * 53) % 160), 60, 340),
      y: clamp(at ? at.y + (p.h * 0.5) : floor + 8, 140, BOTTOM[shape] + 6),
      s: 1,
      flip: false,
    };
    setItems((l) => [...l, next]);
    setSel(next.uid);
  };

  const changeShape = (s: JarShape) => {
    const dy = FLOOR[s] - floor;
    setShape(s);
    setItems((l) => l.map((it) => ({ ...it, y: it.y + dy })));
  };

  /* Moving pieces inside the jar */
  const onItemDown = (e: RPointerEvent<SVGGElement>, it: Item) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const p = toSvg(e.clientX, e.clientY);
    drag.current = { uid: it.uid, dx: it.x - p.x, dy: it.y - p.y };
    setSel(it.uid);
    setItems((l) => [...l.filter((x) => x.uid !== it.uid), it]); // the one you touch comes to the front
  };
  const onItemMove = (e: RPointerEvent<SVGGElement>) => {
    const d = drag.current;
    if (!d) return;
    const p = toSvg(e.clientX, e.clientY);
    setItems((l) => l.map((it) => (it.uid === d.uid ? { ...it, x: clamp(p.x + d.dx, 40, 360), y: clamp(p.y + d.dy, 120, BOTTOM[shape] + 10) } : it)));
  };
  const onItemUp = () => {
    drag.current = null;
  };

  /* Dragging from the palette (mouse and pen); a tap adds it. */
  const onTileDown = (e: RPointerEvent<HTMLButtonElement>, id: string) => {
    if (e.pointerType === "touch") return; // phones: tap adds, then drag inside the jar
    e.preventDefault(); // no text selection or native image drag while dragging a piece
    const sx = e.clientX;
    const sy = e.clientY;
    let moved = false;
    const over = (x: number, y: number) => {
      const r = stageRef.current?.getBoundingClientRect();
      return !!r && x > r.left && x < r.right && y > r.top && y < r.bottom;
    };
    const move = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 6) moved = true;
      if (moved) {
        setGhost({ id, x: ev.clientX, y: ev.clientY });
        setOverJar(over(ev.clientX, ev.clientY));
      }
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setGhost(null);
      setOverJar(false);
      if (moved && over(ev.clientX, ev.clientY)) place(id, toSvg(ev.clientX, ev.clientY));
      else if (!moved) place(id);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const onTileClick = (e: React.MouseEvent, id: string) => {
    // Keyboard and touch taps arrive here; mouse handled in pointerdown.
    if ((e.nativeEvent as PointerEvent).pointerType === "mouse" || (e.nativeEvent as PointerEvent).pointerType === "pen") return;
    place(id);
  };

  const update = (f: (it: Item) => Item) => setItems((l) => l.map((it) => (it.uid === sel ? f(it) : it)));
  const selected = items.find((it) => it.uid === sel);

  const mixPreset = () => {
    const f = floor + 6;
    const base = items.filter((it) => piece(it.id).group === "plants" || piece(it.id).group === "extras");
    const set: Item[] = [
      { uid: ++uid.current, id: "dragon-wood", x: 160, y: f - 6, s: 1, flip: false },
      { uid: ++uid.current, id: "dragon-stone", x: 110, y: f + 4, s: 0.85, flip: false },
      { uid: ++uid.current, id: "seiryu-stone", x: 285, y: f + 4, s: 0.8, flip: true },
    ];
    setItems([...set, ...base]);
    setSel(null);
  };

  const groups: Record<typeof tab, Group[]> = {
    plants: ["plants"],
    hardscape: mode === "rock" ? ["rock"] : mode === "wood" ? ["wood"] : ["rock", "wood"],
    extras: ["extras"],
  };
  const palette = PIECES.filter((p) => groups[tab].includes(p.group));

  /* Summary */
  const counts = items.reduce<Record<string, number>>((m, it) => ((m[it.id] = (m[it.id] ?? 0) + 1), m), {});
  const pieceLines = Object.entries(counts).map(([id, n]) => `${ar ? piece(id).ar : piece(id).en} ×${num(n, lang)}`);
  const jarLine = `${t.shapes[shape]} ${t.sizes[size]}${ar ? " – " : " · "}${z.dims(dw, dh)}`;

  const addToJar = () => {
    const enCounts = Object.entries(counts).map(([id, n]) => `${piece(id).en} ×${n}`).join(", ");
    const arCounts = Object.entries(counts).map(([id, n]) => `${piece(id).ar} ×${num(n, "ar")}`).join("، ");
    add(
      {
        slug: `custom-${Date.now()}`,
        name: CZ.en.customName,
        nameAr: CZ.ar.customName,
        variant: `${DICT.en.customize.shapes[shape]} ${DICT.en.customize.sizes[size]} · ${enCounts}${led ? " + LED" : ""}${engrave.trim() ? ` · "${engrave.trim()}"` : ""}`,
        variantAr: `${DICT.ar.customize.shapes[shape]} ${DICT.ar.customize.sizes[size]} – ${arCounts}${led ? " + LED" : ""}${engrave.trim() ? ` – "${engrave.trim()}"` : ""}`,
        price: total,
        image: "/media/products/terrarium-jar.jpg",
      },
      1,
      stageRef.current,
    );
  };
  const waText = [
    t.msgHello,
    "",
    `• ${t.base}: ${jarLine}`,
    `• ${t.items}: ${pieceLines.join(ar ? "، " : ", ") || t.none}`,
    led ? `• ${t.light} (+${fmt(LED_PRICE, lang)})` : "",
    engrave.trim() ? `• ${t.engrave}: "${engrave.trim()}"` : "",
    note.trim() ? `• ${t.giftNote}: "${note.trim()}"` : "",
    "",
    `${t.total}: ${fmt(total, lang)}`,
  ].filter((l, i, a) => l || (i > 0 && a[i - 1])).join("\n");

  const chip = (on: boolean) => `rounded-full border px-4 py-2 text-sm transition ${on ? "border-ink bg-ink text-white" : "border-ink/20 bg-white hover:border-ink/60"}`;
  const step = "flex items-center gap-3 text-[0.95rem] font-medium";
  const stepNum = "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-xs text-white";

  return (
    <div className="bg-white text-ink">
      <div className="mx-auto max-w-7xl px-5 pt-8 pb-32 sm:px-10 lg:pt-12 lg:pb-24">
        <p className="kicker">{t.kicker}</p>
        <h1 className="display mt-3 text-[clamp(2.2rem,5vw,3.8rem)]">{t.title}</h1>
        <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-ink/65">{t.lede}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* ---------------- The jar ---------------- */}
          <div className="sticky top-[60px] z-20 -mx-5 bg-white px-5 pt-2 pb-3 sm:-mx-10 sm:px-10 lg:top-24 lg:mx-0 lg:self-start lg:px-0 lg:pt-0">
            <div ref={stageRef} className={`relative overflow-hidden rounded-[2rem] bg-sand transition ${overJar ? "ring-2 ring-rust" : ""}`}>
              <svg ref={svgRef} viewBox="0 0 400 520" className="mx-auto block h-[38svh] w-full touch-none select-none sm:h-[46svh] lg:h-[min(68svh,640px)]" onPointerDown={() => setSel(null)} role="img" aria-label={jarLine}>
                <defs>
                  <clipPath id={ID.clip}><path d={GLASS[shape]} /></clipPath>
                  <radialGradient id={ID.glow} cx="50%" cy="0%" r="90%">
                    <stop offset="0%" stopColor="#fff6d8" stopOpacity="0.95" />
                    <stop offset="60%" stopColor="#fff2c4" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#fff2c4" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id={ID.shine} x1="0" x2="1">
                    <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
                    <stop offset="0.18" stopColor="#fff" stopOpacity="0" />
                    <stop offset="0.82" stopColor="#fff" stopOpacity="0" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0.35" />
                  </linearGradient>
                  <pattern id={ID.pebble} width="22" height="16" patternUnits="userSpaceOnUse">
                    <rect width="22" height="16" fill="#d8d2c8" />
                    <ellipse cx="6" cy="5" rx="5" ry="3.4" fill="#c4bdb2" />
                    <ellipse cx="17" cy="12" rx="4.5" ry="3" fill="#bfb7ab" />
                  </pattern>
                </defs>

                <g transform={`translate(200 ${BOTTOM[shape]}) scale(${SCALE[size]}) translate(-200 -${BOTTOM[shape]})`}>
                  {/* inside */}
                  <g clipPath={`url(#${ID.clip})`}>
                    <rect x="0" y="0" width="400" height="520" fill="#f4f1ec" />
                    {led && <rect x="0" y="0" width="400" height="520" fill={`url(#${ID.glow})`} />}
                    <rect x="0" y={floor + 46} width="400" height="80" fill={`url(#${ID.pebble})`} />
                    <rect x="0" y={floor + 36} width="400" height="10" fill="#34302c" />
                    <path d={`M0 ${floor + 6} C100 ${floor - 8} 300 ${floor + 14} 400 ${floor} V${floor + 36} H0 Z`} fill="#5a4332" />
                    {items.map((it) => {
                      const p = piece(it.id);
                      const w = p.w * it.s;
                      const h = p.h * it.s;
                      return (
                        <g
                          key={it.uid}
                          onPointerDown={(e) => onItemDown(e, it)}
                          onPointerMove={onItemMove}
                          onPointerUp={onItemUp}
                          onPointerCancel={onItemUp}
                          className="cursor-grab active:cursor-grabbing"
                          transform={it.flip ? `translate(${2 * it.x} 0) scale(-1 1)` : undefined}
                        >
                          {has(p.id) ? (
                            <image href={p.src} x={it.x - w / 2} y={it.y - h} width={w} height={h} preserveAspectRatio="xMidYMax meet" />
                          ) : (
                            <svg x={it.x - w / 2} y={it.y - h} width={w} height={h} viewBox="0 0 100 100" preserveAspectRatio="none" overflow="visible"><Art id={p.id} /></svg>
                          )}
                          {sel === it.uid && <rect x={it.x - w / 2 - 6} y={it.y - h - 6} width={w + 12} height={h + 12} rx="10" fill="none" stroke="#753319" strokeWidth="2" strokeDasharray="6 5" />}
                        </g>
                      );
                    })}
                  </g>

                  {/* glass */}
                  <path d={GLASS[shape]} fill={`url(#${ID.shine})`} pointerEvents="none" />
                  <path d={GLASS[shape]} fill="none" stroke="#16140f" strokeWidth="3" strokeLinejoin="round" pointerEvents="none" />
                  {shape === "bottle" && <rect x="148" y="10" width="104" height="30" rx="8" fill="#b08a62" stroke="#16140f" strokeWidth="3" />}
                  {shape === "cylinder" && <rect x="58" y="46" width="284" height="30" rx="9" fill={led ? "#fff6d8" : "#2b2722"} stroke="#16140f" strokeWidth="3" />}
                  {shape === "dome" && (
                    <>
                      <circle cx="200" cy="86" r="13" fill={led ? "#fff6d8" : "#2b2722"} stroke="#16140f" strokeWidth="3" />
                      <rect x="56" y="460" width="288" height="30" rx="9" fill="#b08a62" stroke="#16140f" strokeWidth="3" />
                    </>
                  )}
                  {led && shape === "bottle" && <rect x="160" y="34" width="80" height="6" rx="3" fill="#fff6d8" />}
                  {engrave.trim() && (
                    <text x="200" y={shape === "bottle" ? 30 : shape === "cylinder" ? 66 : 480} textAnchor="middle" fontSize="13" fill={shape === "cylinder" && !led ? "#e9e3d9" : "#16140f"} style={{ letterSpacing: ar ? 0 : "0.12em" }}>
                      {engrave.trim().slice(0, 16)}
                    </text>
                  )}
                </g>
              </svg>

              <span className="pointer-events-none absolute start-3 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs">{jarLine}</span>
              {led && <span className="pointer-events-none absolute end-4 top-4 rounded-full bg-ink px-3 py-1 text-xs text-sand">LED · {ar ? "مؤقت يومي" : "daily timer"}</span>}
            </div>

            {/* Toolbar for the selected piece */}
            <div className="mt-3 flex min-h-11 flex-wrap items-center gap-2">
              {selected ? (
                <>
                  <span className="me-1 text-sm text-ink/60">{ar ? piece(selected.id).ar : piece(selected.id).en}</span>
                  <button type="button" className={chip(false)} onClick={() => update((it) => ({ ...it, s: Math.max(0.5, +(it.s - 0.15).toFixed(2)) }))} aria-label={t.smaller}>−</button>
                  <button type="button" className={chip(false)} onClick={() => update((it) => ({ ...it, s: Math.min(1.8, +(it.s + 0.15).toFixed(2)) }))} aria-label={t.larger}>+</button>
                  <button type="button" className={chip(false)} onClick={() => update((it) => ({ ...it, flip: !it.flip }))} aria-label="Flip">⇋</button>
                  <button type="button" className={`${chip(false)} text-rust`} onClick={() => { setItems((l) => l.filter((x) => x.uid !== sel)); setSel(null); }}>{t.remove}</button>
                </>
              ) : (
                <>
                  <p className="flex-1 text-sm text-ink/55">{z.tapHint}</p>
                  {items.length > 0 && <button type="button" className="text-sm text-ink/60 underline underline-offset-4 hover:text-ink" onClick={() => { setItems([]); setSel(null); }}>{t.clear}</button>}
                </>
              )}
            </div>
          </div>

          {/* ---------------- Choices ---------------- */}
          <div className="grid gap-9">
            <section>
              <h2 className={step}><span className={stepNum}>{num(1, lang)}</span>{t.jar}</h2>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {(["bottle", "cylinder", "dome"] as JarShape[]).map((s) => (
                  <button key={s} type="button" onClick={() => changeShape(s)} aria-pressed={shape === s} className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-sm transition ${shape === s ? "border-ink bg-sand" : "border-ink/15 hover:border-ink/50"}`}>
                    <svg viewBox="0 0 400 520" className="h-14 w-12" aria-hidden><path d={GLASS[s]} fill="none" stroke="currentColor" strokeWidth="14" strokeLinejoin="round" /></svg>
                    {t.shapes[s]}
                  </button>
                ))}
              </div>
              <p className="mt-5 text-xs text-ink/55">{t.size}</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["s", "m", "l"] as JarSize[]).map((s) => (
                  <button key={s} type="button" onClick={() => setSize(s)} aria-pressed={size === s} className={`rounded-2xl border px-2 py-3 text-center transition ${size === s ? "border-ink bg-ink text-white" : "border-ink/15 hover:border-ink/50"}`}>
                    <span className="block text-sm">{t.sizes[s]}</span>
                    <span className="mt-0.5 block text-[0.7rem] opacity-70" dir="ltr">{z.dims(...JAR_DIMS[shape][s])}</span>
                    <span className="mt-1 block text-xs tabular-nums">{fmt(JAR_PRICE[shape][s], lang)}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-ink/50">{z.layers}</p>
            </section>

            <section>
              <h2 className={step}><span className={stepNum}>{num(2, lang)}</span>{t.dragHint}</h2>
              <div className="mt-4 flex gap-1 rounded-full bg-sand p-1" role="tablist">
                {([["plants", t.palette.plants], ["hardscape", z.hardscape], ["extras", t.palette.extras]] as const).map(([k, label]) => (
                  <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-w-0 flex-1 truncate rounded-full px-3 py-2.5 text-sm transition ${tab === k ? "bg-white shadow-sm" : "text-ink/60 hover:text-ink"}`}>{label}</button>
                ))}
              </div>

              {tab === "hardscape" && (
                <div className="mt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {(["rock", "wood", "mix"] as Mode[]).map((m) => (
                      <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m} className={chip(mode === m)}>{z.modes[m]}</button>
                    ))}
                    {mode === "mix" && <button type="button" onClick={mixPreset} className="ms-auto text-sm text-rust underline underline-offset-4 hover:text-ink">{z.mixPreset}</button>}
                  </div>
                  <p className="mt-2 text-xs text-ink/55">{z.modeText[mode]}</p>
                </div>
              )}

              <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                {palette.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onPointerDown={(e) => onTileDown(e, p.id)}
                    onClick={(e) => onTileClick(e, p.id)}
                    className="group flex flex-col rounded-2xl border border-ink/10 bg-white p-2 text-start transition hover:border-ink/40 active:scale-[0.97]"
                  >
                    <span className="grid aspect-square place-items-center rounded-xl bg-sand p-2">
                      <PieceArt p={p} photo={has(p.id)} className="pointer-events-none h-full w-full transition duration-500 group-hover:scale-105" />
                    </span>
                    <span className="mt-2 line-clamp-1 text-[0.8rem] leading-tight">{ar ? p.ar : p.en}</span>
                    <span className="line-clamp-1 text-[0.68rem] text-ink/50">{ar ? p.noteAr : p.noteEn}</span>
                    <span className="mt-1 text-[0.72rem] tabular-nums text-rust">+{fmt(p.price, lang)}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="grid gap-3">
              <h2 className={step}><span className={stepNum}>{num(3, lang)}</span>{ar ? "اللمسات الأخيرة" : "Finishing touches"}</h2>
              <label className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${led ? "border-ink bg-sand" : "border-ink/15 hover:border-ink/50"}`}>
                <input type="checkbox" checked={led} onChange={(e) => setLed(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#16140f]" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3"><span className="font-medium">{t.light}</span><span className="shrink-0 text-sm tabular-nums">+{fmt(LED_PRICE, lang)}</span></span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink/60">{t.lightText}</span>
                </span>
              </label>
              <div className="rounded-2xl border border-ink/15 p-4">
                <label htmlFor="cz-engrave" className="flex items-baseline justify-between gap-3 font-medium">{t.engrave}<span className="shrink-0 text-sm font-normal tabular-nums">{z.engraveCost}</span></label>
                <input id="cz-engrave" maxLength={16} value={engrave} onChange={(e) => setEngrave(e.target.value)} placeholder={t.engravePh} className="mt-3 h-11 w-full rounded-full border border-ink/20 bg-white px-4 text-[0.95rem] outline-none focus:border-ink" />
              </div>
              <div className="rounded-2xl border border-ink/15 p-4">
                <label htmlFor="cz-note" className="font-medium">{t.giftNote}</label>
                <textarea id="cz-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} className="mt-3 w-full resize-none rounded-2xl border border-ink/20 bg-white px-4 py-2.5 text-[0.95rem] outline-none focus:border-ink" />
              </div>
            </section>

            <section className="rounded-[1.75rem] bg-ink p-6 text-sand">
              <h2 className="display text-[1.5rem]">{t.summary}</h2>
              <dl className="mt-4 grid gap-2 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-sand/60">{t.base}</dt><dd className="text-end">{t.shapes[shape]} {t.sizes[size]}<span className="ms-2 tabular-nums">{fmt(JAR_PRICE[shape][size], lang)}</span></dd></div>
                <div className="flex justify-between gap-4"><dt className="shrink-0 text-sand/60">{t.items}</dt><dd className="text-end">{pieceLines.join(ar ? "، " : ", ") || t.none}<span className="ms-2 tabular-nums">{fmt(piecesTotal, lang)}</span></dd></div>
                {led && <div className="flex justify-between gap-4"><dt className="text-sand/60">{t.light}</dt><dd className="tabular-nums">{fmt(LED_PRICE, lang)}</dd></div>}
                {engrave.trim() && <div className="flex justify-between gap-4"><dt className="text-sand/60">{t.engrave}</dt><dd className="tabular-nums">{fmt(ENGRAVE_PRICE, lang)}</dd></div>}
                <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-sand/20 pt-3"><dt>{t.total}</dt><dd className="display text-[1.6rem] tabular-nums">{fmt(total, lang)}</dd></div>
              </dl>
              <p className="mt-1 text-xs text-sand/60">{t.lead}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={addToJar} className="h-13 rounded-full bg-sand py-3.5 text-[0.95rem] text-ink transition hover:bg-white">{t.add}</button>
                <a href={whatsappUrl(waText)} target="_blank" rel="noopener" className="flex items-center justify-center rounded-full border border-sand/35 py-3.5 text-[0.95rem] transition hover:border-sand">{t.whatsapp}</a>
              </div>
              <p className="mt-4 text-[0.7rem] text-sand/45">{t.placeholderNote}</p>
            </section>
          </div>
        </div>
      </div>

      {/* Phones: running total and the add button stay in reach. */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-[var(--hair-dark)] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">{CZ[lang].customName}</p>
          <p className="truncate text-xs tabular-nums text-ink/60">{fmt(total, lang)}{ar ? " – " : " · "}{t.lead}</p>
        </div>
        <button type="button" onClick={addToJar} className="h-12 shrink-0 rounded-full bg-ink px-6 text-sm text-white">{t.add}</button>
      </div>

      {/* The piece following the cursor while dragging */}
      <AnimatePresence>
        {ghost && (
          <motion.div className="pointer-events-none fixed z-[60] h-24 w-24 -translate-x-1/2 -translate-y-1/2" style={{ left: ghost.x, top: ghost.y }} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
            <PieceArt p={piece(ghost.id)} photo={has(ghost.id)} className="h-full w-full drop-shadow-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
