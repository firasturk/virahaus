"use client";

import { motion } from "framer-motion";

import type { Shape, Size } from "@/data/products-extra";
import { num, type Lang } from "@/lib/i18n";

/*
 * Each product drawn as a single-weight line drawing, the way a technical
 * sheet would show it: the outline, what is inside, its measurements, a mug or
 * a person for scale, and numbered parts that a legend beside it explains.
 * Every line draws itself in when the drawing scrolls into view.
 */

const INK = "#16140f";
const RUST = "#753319";
const GLOW = "#e3b23c";

type Part = { en: string; ar: string; enText: string; arText: string };

export const PARTS: Record<Shape, Part[]> = {
  jar: [
    { en: "Lid", ar: "الغطاء", enText: "Seals the jar. Choose the LED lid to add light.", arText: "بيسكّر الجرّة. خذ غطاء LED إذا بدك ضو." },
    { en: "Hand-blown glass", ar: "زجاج منفوخ يدوياً", enText: "Keeps the water inside, so it rains on its own.", arText: "بيحفظ الماء جوّا، فبتشتي لحالها." },
    { en: "Moss and fern", ar: "طحلب وسرخس", enText: "Turn light into growth and breathe out moisture.", arText: "بتحوّل الضو لنمو وبتطلّع رطوبة." },
    { en: "Stone", ar: "حجر", enText: "Shapes the landscape and holds the slope.", arText: "بيشكّل المنظر وبيثبّت الميلان." },
    { en: "Living soil", ar: "تربة حية", enText: "Feeds the plants and recycles what falls.", arText: "بتغذي النباتات وبتعيد تدوير اللي بيوقع." },
    { en: "Drainage layer", ar: "طبقة تصريف", enText: "Keeps the roots out of standing water.", arText: "بتبعد الجذور عن الماء الواقف." },
  ],
  cylinder: [
    { en: "Lid", ar: "الغطاء", enText: "Seals the cylinder. LED lid optional.", arText: "بيسكّر الأسطوانة. غطاء LED اختياري." },
    { en: "Glass cylinder", ar: "أسطوانة زجاجية", enText: "Holds the moisture in.", arText: "بتحفظ الرطوبة جوّا." },
    { en: "Moss and fern", ar: "طحلب وسرخس", enText: "The living layer.", arText: "الطبقة العايشة." },
    { en: "Wood", ar: "خشب", enText: "A natural spine for the planting.", arText: "عمود طبيعي للنباتات." },
    { en: "Living soil", ar: "تربة حية", enText: "Feeds and recycles.", arText: "بتغذي وبتعيد التدوير." },
    { en: "Drainage layer", ar: "طبقة تصريف", enText: "Keeps roots dry.", arText: "بتحمي الجذور." },
  ],
  tank: [
    { en: "LED light bar", ar: "إضاءة LED", enText: "Full-spectrum light, dimmable.", arText: "ضو كامل الطيف، وبتقدر تخففه." },
    { en: "Glass canopy", ar: "غطاء زجاجي", enText: "Hinged, so the front opens.", arText: "بيفتح من قدّام." },
    { en: "Misting nozzle", ar: "فوهة رذاذ", enText: "Rain on a timer.", arText: "مطر بمؤقت." },
    { en: "Planted cork wall", ar: "جدار فلين مزروع", enText: "The jungle's back wall.", arText: "الجدار الخلفي للغابة." },
    { en: "Bromeliads", ar: "بروميليا", enText: "Colour and water cups.", arText: "ألوان وكاسات ماء." },
    { en: "Water table", ar: "طبقة ماء", enText: "Keeps the air humid.", arText: "بتخلّي الجو رطب." },
  ],
  cabinet: [
    { en: "Spotlights", ar: "أضواء علوية", enText: "Programmed dawn and dusk.", arText: "شروق وغروب مبرمج." },
    { en: "Glass doors", ar: "أبواب زجاجية", enText: "Open from the front.", arText: "بتفتح من قدّام." },
    { en: "Planted wall", ar: "جدار مزروع", enText: "Sculpted and planted by hand.", arText: "منحوت ومزروع بإيدينا." },
    { en: "Rain system", ar: "نظام مطر", enText: "Misting with a reservoir.", arText: "رذاذ مع خزان." },
    { en: "Water section", ar: "قسم الماء", enText: "A shallow pool.", arText: "بركة خفيفة." },
    { en: "Cabinet", ar: "خزانة", enText: "Hides the equipment.", arText: "بتخبّي المعدات." },
  ],
  pot: [
    { en: "Leaves", ar: "الأوراق", enText: "The pattern you buy it for.", arText: "النقش اللي بتشتريها عشانه." },
    { en: "Stems", ar: "السيقان", enText: "New leaves grow from here.", arText: "منها بيطلع الورق الجديد." },
    { en: "Soil", ar: "التربة", enText: "Airy mix for tropical roots.", arText: "خلطة خفيفة للجذور الاستوائية." },
    { en: "Nursery pot", ar: "الأصيص", enText: "Ready to plant or to gift.", arText: "جاهز للزراعة أو للهدية." },
  ],
  air: [
    { en: "Leaves", ar: "الأوراق", enText: "Drink from mist and air.", arText: "بتشرب من الرذاذ والهوا." },
    { en: "Base", ar: "القاعدة", enText: "No soil needed.", arText: "ما بدها تربة." },
  ],
};

const draw = (i: number, animate: boolean) =>
  animate
    ? {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true, amount: 0.3 },
        transition: { pathLength: { duration: 1.4, delay: 0.08 * i, ease: [0.65, 0, 0.35, 1] as const }, opacity: { duration: 0.2, delay: 0.08 * i } },
      }
    : {};

function L({ d, i = 0, animate, w = 1.6, color = INK, dash }: { d: string; i?: number; animate: boolean; w?: number; color?: string; dash?: string }) {
  return <motion.path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} {...draw(i, animate)} />;
}

/* Fern frond: a curved stem with leaflets on alternating sides. */
function fern(x: number, y: number, h: number, lean = 0.2) {
  const parts = [`M${x} ${y} q${h * lean} ${-h * 0.5} ${h * lean * 0.6} ${-h}`];
  for (let k = 1; k <= 6; k++) {
    const t = k / 7;
    const px = x + h * lean * 0.9 * t;
    const py = y - h * t;
    const len = h * 0.22 * (1 - t * 0.6);
    parts.push(`M${px} ${py} q${-len * 0.6} ${-len * 0.1} ${-len} ${-len * 0.5}`);
    parts.push(`M${px} ${py} q${len * 0.6} ${-len * 0.1} ${len} ${-len * 0.5}`);
  }
  return parts.join(" ");
}

/* Moss: a row of soft bumps between two x positions. */
function moss(x1: number, x2: number, y: number, bump: number) {
  const n = Math.max(3, Math.round((x2 - x1) / (bump * 2.2)));
  const step = (x2 - x1) / n;
  let d = `M${x1} ${y}`;
  for (let k = 0; k < n; k++) d += ` q${step / 2} ${-bump * (0.8 + (k % 3) * 0.25)} ${step} 0`;
  return d;
}

function dots(x1: number, x2: number, y1: number, y2: number, r = 2.4) {
  const out: string[] = [];
  for (let y = y1 + r * 2; y < y2 - r; y += r * 3.2) for (let x = x1 + r * 2 + ((y / (r * 3.2)) % 2) * r * 1.5; x < x2 - r; x += r * 3.4) out.push(`M${x - r} ${y} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`);
  return out.join(" ");
}

function heart(cx: number, cy: number, s: number, rot: number) {
  const r = (rot * Math.PI) / 180;
  const pt = (x: number, y: number) => `${cx + x * Math.cos(r) - y * Math.sin(r)} ${cy + x * Math.sin(r) + y * Math.cos(r)}`;
  return `M${pt(0, s)} C${pt(-s * 1.2, s * 0.2)} ${pt(-s * 0.6, -s * 0.9)} ${pt(0, -s * 0.4)} C${pt(s * 0.6, -s * 0.9)} ${pt(s * 1.2, s * 0.2)} ${pt(0, s)} M${pt(0, s)} L${pt(0, -s * 0.4)}`;
}

export default function ProductOutline({ shape, size, lang, light = false, animate = true, dims = true, numbers = true, scaleRef = true }: { shape: Shape; size: Size; lang: Lang; light?: boolean; animate?: boolean; dims?: boolean; numbers?: boolean; scaleRef?: boolean }) {
  const ground = 390;
  const big = size.h > 70;
  const ref = big ? { h: 170, w: 45 } : { h: 10, w: 8 };
  const maxH = 300;
  const scale = maxH / Math.max(size.h, scaleRef ? ref.h : 0, 1);
  const w = Math.max(size.w * scale, 40);
  const h = size.h * scale;
  const cx = scaleRef ? 250 : 300;
  const x0 = cx - w / 2;
  const y0 = ground - h;
  const marks: { x: number; y: number }[] = [];
  const lines: { d: string; w?: number; color?: string; dash?: string }[] = [];
  const add = (d: string, o: { w?: number; color?: string; dash?: string } = {}) => lines.push({ d, ...o });

  if (shape === "jar" || shape === "cylinder") {
    const capH = h * 0.075;
    const isJar = shape === "jar";
    const neckW = isJar ? w * 0.42 : w;
    const shoulder = y0 + h * 0.24;
    const r = w * (isJar ? 0.2 : 0.08);
    const neckTop = y0 + capH;
    const neckBot = isJar ? y0 + h * 0.14 : neckTop;
    // glass
    if (isJar) add(`M${cx - neckW / 2} ${neckTop} L${cx - neckW / 2} ${neckBot} L${x0} ${shoulder} L${x0} ${ground - r} Q${x0} ${ground} ${x0 + r} ${ground} L${x0 + w - r} ${ground} Q${x0 + w} ${ground} ${x0 + w} ${ground - r} L${x0 + w} ${shoulder} L${cx + neckW / 2} ${neckBot} L${cx + neckW / 2} ${neckTop}`, { w: 2 });
    else add(`M${x0} ${neckTop} L${x0} ${ground - r} Q${x0} ${ground} ${x0 + r} ${ground} L${x0 + w - r} ${ground} Q${x0 + w} ${ground} ${x0 + w} ${ground - r} L${x0 + w} ${neckTop}`, { w: 2 });
    // glass highlight
    add(`M${x0 + w * 0.12} ${shoulder + h * 0.06} L${x0 + w * 0.12} ${shoulder + h * 0.3}`, { w: 1.2, color: "#9a958d" });
    // lid
    const lidW = neckW + 10;
    add(`M${cx - lidW / 2} ${neckTop} L${cx - lidW / 2} ${y0 + 3} Q${cx - lidW / 2} ${y0} ${cx - lidW / 2 + 3} ${y0} L${cx + lidW / 2 - 3} ${y0} Q${cx + lidW / 2} ${y0} ${cx + lidW / 2} ${y0 + 3} L${cx + lidW / 2} ${neckTop} Z`, { w: 2 });
    if (light) {
      add(`M${cx - neckW / 2 + 6} ${neckTop + 3} L${cx + neckW / 2 - 6} ${neckTop + 3}`, { w: 3, color: GLOW });
      for (let k = -2; k <= 2; k++) add(`M${cx + k * neckW * 0.16} ${neckTop + 10} l${k * 10} ${h * 0.16}`, { w: 1.2, color: GLOW, dash: "3 5" });
    }
    marks.push({ x: cx + lidW / 2 - 6, y: y0 + capH / 2 });
    marks.push({ x: x0 + w - 2, y: shoulder + (ground - shoulder) * 0.25 });
    // drainage, soil, moss
    const drainTop = ground - h * 0.08;
    const soilTop = ground - h * 0.17;
    add(`M${x0 + 2} ${drainTop} L${x0 + w - 2} ${drainTop}`, { w: 1.2 });
    add(dots(x0 + 4, x0 + w - 4, drainTop, ground - 4, Math.max(1.6, w * 0.012)), { w: 1 });
    add(`M${x0 + 2} ${soilTop} L${x0 + w - 2} ${soilTop}`, { w: 1.2 });
    // stone ridge
    add(`M${x0 + w * 0.18} ${soilTop} L${x0 + w * 0.36} ${soilTop - h * 0.2} L${x0 + w * 0.46} ${soilTop - h * 0.14} L${x0 + w * 0.58} ${soilTop - h * 0.3} L${x0 + w * 0.76} ${soilTop}`, { w: 1.6 });
    add(`M${x0 + w * 0.36} ${soilTop - h * 0.2} L${x0 + w * 0.42} ${soilTop - h * 0.05} M${x0 + w * 0.58} ${soilTop - h * 0.3} L${x0 + w * 0.62} ${soilTop - h * 0.12}`, { w: 1 });
    add(moss(x0 + 3, x0 + w - 3, soilTop - 1, Math.max(4, w * 0.04)), { w: 1.6, color: "#4f6a33" });
    add(fern(x0 + w * 0.25, soilTop - 2, h * 0.32, 0.15), { w: 1.3, color: "#4f6a33" });
    add(fern(x0 + w * 0.8, soilTop - 2, h * 0.26, -0.25), { w: 1.3, color: "#4f6a33" });
    // condensation
    for (let k = 0; k < 4; k++) add(`M${x0 + w * (0.2 + k * 0.18)} ${shoulder + h * (0.04 + (k % 2) * 0.05)} a2 2 0 1 0 0.1 0`, { w: 1.4, color: "#9a958d" });
    marks.push({ x: x0 + w * 0.27, y: soilTop - h * 0.2 });
    marks.push({ x: x0 + w * 0.56, y: soilTop - h * 0.18 });
    marks.push({ x: x0 + w * 0.5, y: (soilTop + drainTop) / 2 });
    marks.push({ x: x0 + w * 0.7, y: (drainTop + ground) / 2 });
  } else if (shape === "tank" || shape === "cabinet") {
    const isCab = shape === "cabinet";
    const tankH = isCab ? h * 0.55 : h;
    const tb = y0 + tankH;
    add(`M${x0} ${y0 + tankH * 0.06} L${x0} ${tb} L${x0 + w} ${tb} L${x0 + w} ${y0 + tankH * 0.06}`, { w: 2 });
    // light
    if (isCab) {
      add(`M${x0} ${y0} L${x0 + w} ${y0} L${x0 + w} ${y0 + tankH * 0.06} L${x0} ${y0 + tankH * 0.06} Z`, { w: 2 });
      for (let k = 1; k <= 4; k++) add(`M${x0 + (w * k) / 5} ${y0 + tankH * 0.06} l-6 ${tankH * 0.14} M${x0 + (w * k) / 5} ${y0 + tankH * 0.06} l6 ${tankH * 0.14}`, { w: 1, color: GLOW, dash: "3 5" });
      add(`M${cx} ${y0 + tankH * 0.06} L${cx} ${tb}`, { w: 1.4 });
    } else {
      add(`M${x0 - 6} ${y0} L${x0 + w + 6} ${y0} L${x0 + w + 6} ${y0 + 8} L${x0 - 6} ${y0 + 8} Z`, { w: 2 });
      add(`M${x0 + w * 0.12} ${y0 + 8} L${x0 + w * 0.12} ${y0 + tankH * 0.06}`, { w: 2 });
      add(`M${x0} ${y0 + tankH * 0.06} L${x0 + w} ${y0 + tankH * 0.06}`, { w: 1.4 });
      add(`M${x0 + 4} ${y0 + tankH * 0.18} L${x0 + w - 4} ${y0 + tankH * 0.18}`, { w: 1, dash: "6 6" });
      for (let k = -2; k <= 2; k++) add(`M${cx + k * 18} ${y0 + 12} l${k * 6} ${tankH * 0.1}`, { w: 1, color: GLOW, dash: "3 5" });
    }
    // nozzle
    add(`M${x0 + w * 0.7} ${y0 + tankH * 0.06} l0 ${tankH * 0.05} l${w * 0.05} 0`, { w: 1.6 });
    // cork wall texture
    for (let k = 0; k < 5; k++) add(`M${x0 + w * 0.06} ${y0 + tankH * (0.25 + k * 0.12)} q${w * 0.2} ${-tankH * 0.03} ${w * 0.44} 0 t${w * 0.44} 0`, { w: 1, color: "#9a958d" });
    // water table
    const water = tb - tankH * 0.12;
    add(`M${x0 + 2} ${water} q${w / 8} -5 ${w / 4} 0 t${w / 4} 0 t${w / 4} 0 t${w / 4 - 4} 0`, { w: 1.4, color: "#4b7a8c" });
    add(`M${x0 + 2} ${water - tankH * 0.05} L${x0 + w - 2} ${water - tankH * 0.05}`, { w: 1.2 });
    // bromeliads
    for (const [px, s] of [[0.22, 0.16], [0.55, 0.2], [0.82, 0.13]] as const) {
      const bx = x0 + w * px;
      const by = water - tankH * 0.05;
      const sz = tankH * s;
      add(`M${bx} ${by} q${-sz * 0.6} ${-sz * 0.3} ${-sz * 0.8} ${-sz} M${bx} ${by} q${sz * 0.6} ${-sz * 0.3} ${sz * 0.8} ${-sz} M${bx} ${by} q${-sz * 0.2} ${-sz * 0.6} ${-sz * 0.1} ${-sz * 1.2} M${bx} ${by} q${sz * 0.2} ${-sz * 0.6} ${sz * 0.1} ${-sz * 1.2}`, { w: 1.3, color: "#4f6a33" });
    }
    add(fern(x0 + w * 0.38, water - tankH * 0.05, tankH * 0.32, 0.1), { w: 1.2, color: "#4f6a33" });
    if (isCab) {
      const cb = ground;
      add(`M${x0} ${tb} L${x0} ${cb} L${x0 + w} ${cb} L${x0 + w} ${tb}`, { w: 2 });
      add(`M${cx} ${tb} L${cx} ${cb} M${cx - 10} ${tb + (cb - tb) * 0.45} l0 ${(cb - tb) * 0.1} M${cx + 10} ${tb + (cb - tb) * 0.45} l0 ${(cb - tb) * 0.1}`, { w: 1.4 });
      marks.push({ x: x0 + w * 0.2, y: y0 + tankH * 0.03 }, { x: cx + 14, y: y0 + tankH * 0.45 }, { x: x0 + w * 0.15, y: y0 + tankH * 0.32 }, { x: x0 + w * 0.75, y: y0 + tankH * 0.13 }, { x: x0 + w * 0.88, y: water + 6 }, { x: x0 + w * 0.25, y: (tb + cb) / 2 });
    } else {
      marks.push({ x: x0 + w * 0.88, y: y0 + 4 }, { x: x0 + w * 0.06, y: y0 + tankH * 0.12 }, { x: x0 + w * 0.78, y: y0 + tankH * 0.13 }, { x: x0 + w * 0.15, y: y0 + tankH * 0.4 }, { x: x0 + w * 0.55, y: water - tankH * 0.25 }, { x: x0 + w * 0.9, y: water + 6 });
    }
  } else if (shape === "pot") {
    const potH = Math.min(w * 0.95, h * 0.42);
    const top = ground - potH;
    add(`M${x0} ${top} L${x0 + w} ${top} L${x0 + w * 0.88} ${ground} L${x0 + w * 0.12} ${ground} Z`, { w: 2 });
    add(`M${x0 + w * 0.03} ${top + potH * 0.14} L${x0 + w * 0.97} ${top + potH * 0.14}`, { w: 1.2 });
    add(moss(x0 + w * 0.06, x0 + w * 0.94, top + 1, w * 0.04), { w: 1.2, color: "#6b5a48" });
    const lh = h - potH;
    const leaves = [
      { x: cx - w * 0.4, y: top - lh * 0.45, s: lh * 0.2, r: -35 },
      { x: cx + w * 0.42, y: top - lh * 0.5, s: lh * 0.22, r: 35 },
      { x: cx - w * 0.05, y: top - lh * 0.78, s: lh * 0.2, r: -5 },
      { x: cx + w * 0.15, y: top - lh * 0.3, s: lh * 0.14, r: 20 },
    ];
    for (const lf of leaves) {
      add(`M${cx} ${top} Q${(cx + lf.x) / 2} ${top - lh * 0.1} ${lf.x} ${lf.y + lf.s}`, { w: 1.3, color: "#4f6a33" });
      add(heart(lf.x, lf.y, lf.s, lf.r + 180), { w: 1.4, color: "#4f6a33" });
    }
    marks.push({ x: leaves[1].x + lh * 0.15, y: leaves[1].y }, { x: cx - w * 0.15, y: top - lh * 0.15 }, { x: cx, y: top + potH * 0.07 }, { x: x0 + w * 0.5, y: ground - potH * 0.4 });
  } else {
    // air plant
    for (let k = 0; k < 11; k++) {
      const a = -Math.PI / 2 + (k - 5) * 0.27;
      const len = h * (0.75 + (k % 3) * 0.12);
      add(`M${cx} ${ground - 4} q${Math.cos(a) * len * 0.2} ${Math.sin(a) * len * 0.6} ${Math.cos(a) * len * 0.75} ${Math.sin(a) * len}`, { w: 1.4, color: "#4f6a33" });
    }
    add(`M${cx - w * 0.2} ${ground - 4} q${w * 0.2} 6 ${w * 0.4} 0`, { w: 1.6 });
    marks.push({ x: cx + w * 0.35, y: ground - h * 0.7 }, { x: cx, y: ground - 2 });
  }

  const round = shape === "jar" || shape === "cylinder" || shape === "pot" || shape === "air";
  const rw = ref.w * scale;
  const rh = ref.h * scale;
  const rx = 470;
  const cm = lang === "ar" ? "سم" : "cm";
  let i = 0;

  return (
    <svg viewBox="0 0 600 450" className="h-auto w-full" role="img" aria-label={`${num(size.h, lang)} × ${num(size.w, lang)} ${cm}`}>
      <line x1="40" y1={ground} x2="560" y2={ground} stroke={INK} strokeOpacity="0.2" />
      {lines.map((l) => <L key={i} i={i++} d={l.d} animate={animate} w={l.w} color={l.color} dash={l.dash} />)}

      {dims && (
        <g>
          <L d={`M${x0 - 30} ${y0} L${x0 - 30} ${ground} M${x0 - 37} ${y0} L${x0 - 23} ${y0} M${x0 - 37} ${ground} L${x0 - 23} ${ground}`} color={RUST} w={1.2} animate={animate} i={i++} />
          <text x={x0 - 42} y={y0 + h / 2} textAnchor="end" dominantBaseline="middle" fontSize="16" fill={INK}>{num(size.h, lang)} {cm}</text>
          <L d={`M${x0} ${ground + 22} L${x0 + w} ${ground + 22} M${x0} ${ground + 15} L${x0} ${ground + 29} M${x0 + w} ${ground + 15} L${x0 + w} ${ground + 29}`} color={RUST} w={1.2} animate={animate} i={i++} />
          <text x={cx} y={ground + 46} textAnchor="middle" fontSize="16" fill={INK}>{round ? "Ø " : ""}{num(size.w, lang)} {cm}{size.d ? ` × ${num(size.d, lang)}` : ""}</text>
        </g>
      )}

      {scaleRef && (
        <g>
          {big ? (
            <L d={`M${rx} ${ground - rh + rh * 0.13} m${-rh * 0.065} 0 a${rh * 0.065} ${rh * 0.065} 0 1 0 ${rh * 0.13} 0 a${rh * 0.065} ${rh * 0.065} 0 1 0 ${-rh * 0.13} 0 M${rx - rw / 2} ${ground - rh * 0.48} Q${rx - rw / 2} ${ground - rh * 0.82} ${rx} ${ground - rh * 0.83} Q${rx + rw / 2} ${ground - rh * 0.82} ${rx + rw / 2} ${ground - rh * 0.48} L${rx + rw * 0.28} ${ground} L${rx - rw * 0.28} ${ground} Z`} color="#9a958d" w={1.4} animate={animate} i={i++} />
          ) : (
            <L d={`M${rx - rw / 2} ${ground - rh} L${rx - rw / 2} ${ground - rw * 0.12} Q${rx - rw / 2} ${ground} ${rx - rw / 2 + rw * 0.12} ${ground} L${rx + rw / 2 - rw * 0.12} ${ground} Q${rx + rw / 2} ${ground} ${rx + rw / 2} ${ground - rw * 0.12} L${rx + rw / 2} ${ground - rh} Z M${rx + rw / 2} ${ground - rh * 0.75} q${rw * 0.45} 0 ${rw * 0.45} ${rh * 0.3} t${-rw * 0.45} ${rh * 0.3}`} color="#9a958d" w={1.4} animate={animate} i={i++} />
          )}
          <text x={rx} y={ground + 46} textAnchor="middle" fontSize="13" fill={INK} fillOpacity="0.5">{big ? (lang === "ar" ? "شخص ١٧٠ سم" : "Person 170 cm") : lang === "ar" ? "كوب ١٠ سم" : "Mug 10 cm"}</text>
        </g>
      )}

      {numbers &&
        marks.map((m, k) => (
          <motion.g key={k} initial={animate ? { opacity: 0, scale: 0.4 } : undefined} whileInView={animate ? { opacity: 1, scale: 1 } : undefined} viewport={{ once: true }} transition={{ delay: 1.2 + k * 0.08 }} style={{ transformOrigin: `${m.x}px ${m.y}px` }}>
            <circle cx={m.x} cy={m.y} r="11" fill={RUST} />
            <text x={m.x} y={m.y + 0.5} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#fff">{num(k + 1, lang)}</text>
          </motion.g>
        ))}
    </svg>
  );
}

/* The numbered legend that goes beside a drawing. */
export function OutlineLegend({ shape, lang }: { shape: Shape; lang: Lang }) {
  return (
    <ol className="space-y-4">
      {PARTS[shape].map((p, i) => (
        <li key={p.en} className="flex gap-4">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rust text-xs text-white">{num(i + 1, lang)}</span>
          <div>
            <p className="font-medium">{lang === "ar" ? p.ar : p.en}</p>
            <p className="text-sm leading-relaxed text-ink/65">{lang === "ar" ? p.arText : p.enText}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
