/* The pieces and prices for "Customize your jar". Prices are PLACEHOLDERS in JD. */
import type { Lang } from "./i18n";

export type JarShape = "bottle" | "cylinder" | "dome";
export type JarSize = "s" | "m" | "l";
export type Group = "plants" | "rock" | "wood" | "extras";
export type Mode = "rock" | "wood" | "mix";

export const JAR_PRICE: Record<JarShape, Record<JarSize, number>> = {
  bottle: { s: 45, m: 65, l: 90 },
  cylinder: { s: 40, m: 60, l: 85 },
  dome: { s: 50, m: 75, l: 105 },
};

/* Real sizes of each jar in cm (Ø × H). */
export const JAR_DIMS: Record<JarShape, Record<JarSize, [number, number]>> = {
  bottle: { s: [14, 22], m: [18, 30], l: [24, 40] },
  cylinder: { s: [12, 20], m: [16, 28], l: [20, 38] },
  dome: { s: [16, 20], m: [22, 26], l: [28, 34] },
};

export const ENGRAVE_PRICE = 5;

export interface Piece {
  id: string;
  group: Group;
  price: number;
  /* Size in the jar drawing (viewBox 400 × 520). */
  w: number;
  h: number;
  src: string;
  en: string;
  ar: string;
  noteEn: string;
  noteAr: string;
}

export const PIECES: Piece[] = [
  { id: "moss", group: "plants", price: 3, w: 150, h: 70, src: "/media/customize/moss.png", en: "Cushion moss", ar: "طحلب وسادي", noteEn: "Soft green carpet", noteAr: "سجادة خضراء ناعمة" },
  { id: "fern", group: "plants", price: 4, w: 130, h: 160, src: "/media/customize/fern.png", en: "Mini fern", ar: "سرخس صغير", noteEn: "Feathery height", noteAr: "ارتفاع ريشي" },
  { id: "fittonia", group: "plants", price: 4, w: 110, h: 95, src: "/media/customize/fittonia.png", en: "Fittonia", ar: "فيتونيا", noteEn: "Pink or white veins", noteAr: "عروق وردية أو بيضاء" },
  { id: "dragon-stone", group: "rock", price: 3, w: 130, h: 105, src: "/media/customize/dragon-stone.png", en: "Dragon stone", ar: "حجر التنين", noteEn: "Clay, full of holes", noteAr: "طيني مليء بالثقوب" },
  { id: "seiryu-stone", group: "rock", price: 3, w: 125, h: 110, src: "/media/customize/seiryu-stone.png", en: "Seiryu stone", ar: "حجر سيريو", noteEn: "Blue-grey, sharp ridges", noteAr: "رمادي مزرق بحواف حادة" },
  { id: "lava-rock", group: "rock", price: 2, w: 95, h: 75, src: "/media/customize/lava-rock.png", en: "Lava rock", ar: "حجر بركاني", noteEn: "Black, light, porous", noteAr: "أسود خفيف ومسامي" },
  { id: "driftwood", group: "wood", price: 4, w: 190, h: 110, src: "/media/customize/driftwood.png", en: "Driftwood", ar: "خشب الطفو", noteEn: "Smooth, sun-bleached", noteAr: "ناعم وباهت بالشمس" },
  { id: "dragon-wood", group: "wood", price: 5, w: 170, h: 150, src: "/media/customize/dragon-wood.png", en: "Dragon wood", ar: "خشب التنين", noteEn: "Twisted, many branches", noteAr: "ملتوٍ كثير الأغصان" },
  { id: "pebbles", group: "extras", price: 2, w: 120, h: 40, src: "/media/customize/pebbles.png", en: "White pebbles", ar: "حصى أبيض", noteEn: "A little path", noteAr: "ممر صغير" },
  { id: "mushroom", group: "extras", price: 2, w: 45, h: 55, src: "/media/customize/mushroom.png", en: "Tiny mushroom", ar: "فطر صغير", noteEn: "Ceramic, handmade", noteAr: "سيراميك يدوي" },
];

export const piece = (id: string) => PIECES.find((p) => p.id === id)!;

export const CZ = {
  en: {
    hardscape: "Hardscape",
    modes: { rock: "Rock", wood: "Wood", mix: "Mix" },
    modeText: { rock: "Stones only: a mountain feel.", wood: "Branches only: a forest floor.", mix: "Stones and wood together, the classic." },
    mixPreset: "Place a ready mix",
    layers: "Drainage, charcoal and soil are included.",
    dims: (w: number, h: number) => `Ø ${w} × ${h} cm`,
    tapHint: "Tap a piece to add it, then drag it inside the jar.",
    engraveCost: "+5 JD",
    customName: "Custom jar",
    added: "Added to your jar",
    each: "each",
  },
  ar: {
    hardscape: "صخور وخشب",
    modes: { rock: "صخور", wood: "خشب", mix: "مزيج" },
    modeText: { rock: "حجارة فقط: إحساس الجبل.", wood: "أغصان فقط: أرض الغابة.", mix: "حجارة وخشب معاً، التصميم الكلاسيكي." },
    mixPreset: "ضع مزيجاً جاهزاً",
    layers: "طبقة التصريف والفحم والتربة مشمولة.",
    dims: (w: number, h: number) => `Ø ${w} × ${h} سم`,
    tapHint: "اضغط على القطعة لإضافتها، ثم اسحبها داخل الجرّة.",
    engraveCost: "+٥ د.أ",
    customName: "جرّة مخصصة",
    added: "أُضيفت إلى جرّتك",
    each: "للقطعة",
  },
} satisfies Record<Lang, unknown>;
