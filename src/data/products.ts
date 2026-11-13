export type CategorySlug = "terrarium" | "vivarium" | "plants";

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
  image: string;
}

export interface Product {
  slug: string;
  name: string;
  latin?: string;
  category: CategorySlug;
  price: number;
  tagline: string;
  description: string;
  images: string[];
  variants: { name: string; options: { label: string; delta: number }[] };
  specs: { label: string; value: string }[];
  /** Built after the order is confirmed. Defaults to true for vivariums (the large tanks). */
  preorder?: boolean;
}

/* Jars and plants are on the shelf; the large tanks are built for each order. */
export const PREORDER_WEEKS = 2;
export const isPreorder = (p: Product) => p.preorder ?? p.category === "vivarium";
export const availabilityLabel = (p: Product) => (isPreorder(p) ? `Pre-order · ${PREORDER_WEEKS} weeks` : "Ready now");
export const availabilityLine = (p: Product) =>
  isPreorder(p)
    ? `Pre-order — built by hand for you, ready ${PREORDER_WEEKS} weeks after we confirm your order.`
    : "Ready now — delivered as soon as we confirm your order.";

const P = "/media/products";

export const categories: Category[] = [
  {
    slug: "terrarium",
    name: "Terrariums",
    blurb: "Handmade and sealed. No watering — just light. Ready now.",
    image: `${P}/terrarium-jar.jpg`,
  },
  {
    slug: "vivarium",
    name: "Vivariums",
    blurb: "Planted tanks with their own rain. Pre-order, ready in 2 weeks.",
    image: `${P}/vivarium-tank.jpg`,
  },
  {
    slug: "plants",
    name: "Plants",
    blurb: "Small, patterned, happy in humidity. Ready now.",
    image: `${P}/caladium.jpg`,
  },
];

export const products: Product[] = [
  {
    slug: "ember-jar",
    name: "Ember Jar",
    category: "terrarium",
    price: 170,
    tagline: "A lava-rock ridge under a single cold light.",
    description:
      "Black volcanic stone stacked into a ridge, dressed in cushion moss and a maidenhair fern, sealed inside a hand-blown vessel. Add the LED lid and it lights itself every day on a timer. Planted and sealed by hand, it runs its own weather: no watering, no feeding. Give it light and leave it alone.",
    images: [`${P}/terrarium-jar.jpg`, `${P}/lifestyle-desk.jpg`, `${P}/vivarium-tank.jpg`],
    variants: {
      name: "Size",
      options: [
        { label: "Compact · 28 cm", delta: 0 },
        { label: "Studio · 42 cm", delta: 65 },
        { label: "Grand · 60 cm", delta: 155 },
      ],
    },
    specs: [
      { label: "Vessel", value: "Hand-blown borosilicate, 42 cm" },
      { label: "Light", value: "Optional LED lid with a daily timer (+20 JD)" },
      { label: "Substrate", value: "Lava rock, sphagnum, drainage layer" },
      { label: "Care", value: "None. Sealed — it only needs light." },
      { label: "Made", value: "By hand, one at a time" },
    ],
  },
  {
    slug: "cascade-vessel",
    name: "Cascade Vessel",
    category: "terrarium",
    price: 130,
    tagline: "A cylinder of rain that never quite stops.",
    description:
      "Tall glass, condensation on the walls, a column of moss and creeping fig climbing a spine of cork. With the LED lid it glows like a lantern on a desk after dark. Sealed by hand; it waters itself.",
    images: [`${P}/cascade-vessel.jpg`, `${P}/lifestyle-desk.jpg`],
    variants: {
      name: "Height",
      options: [
        { label: "30 cm", delta: 0 },
        { label: "45 cm", delta: 50 },
      ],
    },
    specs: [
      { label: "Vessel", value: "Seeded glass cylinder, 30 cm" },
      { label: "Light", value: "Optional LED lid with a daily timer (+20 JD)" },
      { label: "Planting", value: "Creeping fig, pillow moss, cork spine" },
      { label: "Care", value: "None. Sealed — it only needs light." },
      { label: "Made", value: "By hand, one at a time" },
    ],
  },
  {
    slug: "nimbus-cylinder",
    name: "Nimbus Cylinder",
    category: "terrarium",
    price: 115,
    tagline: "Fog in a jar.",
    description:
      "A low, wide cylinder built around a single piece of driftwood, carpeted in moss and lit from above. The quietest thing in the range, and the easiest: sealed by hand, it needs nothing but light.",
    images: [`${P}/nimbus-cylinder.jpg`, `${P}/lifestyle-desk.jpg`],
    variants: { name: "Finish", options: [{ label: "Clear", delta: 0 }, { label: "Seeded", delta: 14 }] },
    specs: [
      { label: "Vessel", value: "Cylinder, 24 cm" },
      { label: "Planting", value: "Driftwood, sheet moss, ferns" },
      { label: "Care", value: "None. Sealed — it only needs light." },
      { label: "Made", value: "By hand, one at a time" },
    ],
  },
  {
    slug: "canopy-tank",
    name: "Canopy Tank",
    category: "vivarium",
    price: 370,
    tagline: "Rainforest, front-opening, with weather built in.",
    description:
      "A low-iron glass tank with a hinged canopy, misting nozzle, and a full-spectrum bar light. Cork background planted with bromeliads, fittonia and moss; a shallow water table along the base for humidity. Everything a dart frog would want, and nothing it wouldn't.",
    images: ["/media/studio/vivarium-dark.jpg", "/media/studio/vivarium-frog.jpg", `${P}/vivarium-tank.jpg`],
    variants: {
      name: "Size",
      options: [
        { label: "40 · 40×40×60 cm", delta: 0 },
        { label: "60 · 60×45×60 cm", delta: 185 },
      ],
    },
    specs: [
      { label: "Glass", value: "Low-iron, 6 mm, hinged canopy" },
      { label: "Light", value: "Full-spectrum LED bar, dimmable" },
      { label: "Misting", value: "Single nozzle, timer-ready" },
      { label: "Background", value: "Cork bark, planted" },
      { label: "Care", value: "Mist daily. Top up water table weekly." },
    ],
  },
  {
    slug: "atrium-cabinet",
    name: "Atrium Cabinet",
    category: "vivarium",
    price: 1705,
    tagline: "A wall of jungle behind two doors.",
    description:
      "Double-door display vivarium on a matte black cabinet. Anthurium, calathea, bromeliads and vines on a sculpted background, under four spotlights. Built to order; planted by hand; delivered and installed.",
    images: ["/media/studio/vivarium-cabinet.jpg", "/media/studio/vivarium-open.jpg", "/media/studio/closeup-begonias.jpg"],
    variants: {
      name: "Width",
      options: [
        { label: "120 cm", delta: 0 },
        { label: "160 cm", delta: 640 },
      ],
    },
    specs: [
      { label: "Glass", value: "Low-iron, double door, 8 mm" },
      { label: "Cabinet", value: "Matte black, ventilated" },
      { label: "Light", value: "4 × spot, programmable dawn/dusk" },
      { label: "Misting", value: "Rain bar, reservoir in base" },
      { label: "Lead time", value: "Pre-order · ready 2 weeks after confirmation" },
    ],
  },
  {
    slug: "tidepool",
    name: "Tidepool Paludarium",
    category: "vivarium",
    price: 485,
    tagline: "Half land, half water. Both alive.",
    description:
      "A planted shoreline over a shallow pool with floating duckweed and a driftwood bridge. Made for the plants that want wet feet.",
    images: ["/media/ref-vivarium-3.png", `${P}/vivarium-tank.jpg`],
    variants: { name: "Size", options: [{ label: "45 cm", delta: 0 }, { label: "60 cm", delta: 155 }] },
    specs: [
      { label: "Glass", value: "Low-iron, open top" },
      { label: "Water", value: "8 cm pool, filtered" },
      { label: "Light", value: "Full-spectrum bar" },
    ],
  },
  {
    slug: "caladium",
    name: "Caladium",
    latin: "Caladium bicolor",
    category: "plants",
    price: 20,
    tagline: "Pink veins on green. Loud, in a good way.",
    description: "Heart-shaped leaves splashed pink and white. Wants warmth, humidity and bright shade — which is to say, a vivarium.",
    images: [`${P}/caladium.jpg`, `${P}/lifestyle-desk.jpg`],
    variants: { name: "Pot", options: [{ label: "9 cm", delta: 0 }, { label: "12 cm", delta: 7 }] },
    specs: [
      { label: "Light", value: "Bright, indirect" },
      { label: "Humidity", value: "High" },
      { label: "Water", value: "Keep evenly moist" },
    ],
  },
  {
    slug: "begonia-maculata",
    name: "Polka Dot Begonia",
    latin: "Begonia maculata",
    category: "plants",
    price: 24,
    tagline: "Angel-wing leaves, silver dots, red underneath.",
    description: "Long pointed leaves stippled with silver, wine-red on the reverse. Grows upright on cane stems. Happiest in humid, filtered light.",
    images: [`${P}/begonia-maculata.jpg`, `${P}/lifestyle-desk.jpg`],
    variants: { name: "Pot", options: [{ label: "9 cm", delta: 0 }, { label: "12 cm", delta: 9 }] },
    specs: [
      { label: "Light", value: "Filtered" },
      { label: "Humidity", value: "Medium–high" },
      { label: "Water", value: "Let the top dry between waterings" },
    ],
  },
  {
    slug: "bromeliad-variegated",
    name: "Variegated Bromeliad",
    latin: "Neoregelia",
    category: "plants",
    price: 30,
    tagline: "A green rosette edged in cream.",
    description: "A tank bromeliad: water sits in the central cup, not the soil. Striped leaves fan out flat. Slow, tough, and long-lived under glass.",
    images: [`${P}/bromeliad-variegated.jpg`, `${P}/lifestyle-desk.jpg`],
    variants: { name: "Pot", options: [{ label: "12 cm", delta: 0 }, { label: "15 cm", delta: 10 }] },
    specs: [
      { label: "Light", value: "Bright" },
      { label: "Water", value: "Fill the cup, flush monthly" },
      { label: "Humidity", value: "High" },
    ],
  },
  {
    slug: "begonia-wightii",
    name: "Begonia 'Wightii'",
    latin: "Begonia maculata 'Wightii'",
    category: "plants",
    price: 26,
    tagline: "Bigger dots, darker leaf.",
    description: "The bolder cousin of the polka dot begonia: larger silver spots on olive leaves that flush burgundy beneath.",
    images: [`${P}/begonia-wightii.jpg`, `${P}/lifestyle-desk.jpg`],
    variants: { name: "Pot", options: [{ label: "9 cm", delta: 0 }, { label: "12 cm", delta: 9 }] },
    specs: [
      { label: "Light", value: "Filtered" },
      { label: "Humidity", value: "Medium–high" },
    ],
  },
  {
    slug: "tillandsia",
    name: "Air Plant",
    latin: "Tillandsia ionantha",
    category: "plants",
    price: 13,
    tagline: "No soil. Blushes red before it flowers.",
    description: "Lives on air and mist. The whole plant flushes scarlet and sends up a violet bloom once a year. Wedge it into bark or wire, and forget about pots.",
    images: [`${P}/tillandsia.jpg`, `${P}/lifestyle-desk.jpg`],
    variants: { name: "Size", options: [{ label: "Single", delta: 0 }, { label: "Cluster of three", delta: 17 }] },
    specs: [
      { label: "Light", value: "Bright, indirect" },
      { label: "Water", value: "Mist 3× weekly, soak monthly" },
      { label: "Soil", value: "None" },
    ],
  },
  {
    slug: "cryptanthus",
    name: "Earth Star",
    latin: "Cryptanthus 'Pink Star'",
    category: "plants",
    price: 16,
    tagline: "A flat pink star for the forest floor.",
    description: "Ground-hugging rosette striped pink, cream and green. Stays small, sits low, and loves the damp corner of a terrarium.",
    images: [`${P}/cryptanthus.jpg`, `${P}/lifestyle-desk.jpg`],
    variants: { name: "Pot", options: [{ label: "9 cm", delta: 0 }] },
    specs: [
      { label: "Light", value: "Medium" },
      { label: "Humidity", value: "High" },
      { label: "Water", value: "Keep moist" },
    ],
  },
  {
    slug: "begonia-rex",
    name: "Rex Begonia",
    latin: "Begonia rex-cultorum",
    category: "plants",
    price: 23,
    tagline: "Painted leaves — pink, green and silver.",
    description: "Grown for the foliage alone: broad, textured leaves washed in pink and edged in green. Slow, showy, and happiest in the still humidity of a closed case.",
    images: [`${P}/begonia-rex.jpg`, `${P}/lifestyle-desk.jpg`],
    variants: { name: "Pot", options: [{ label: "9 cm", delta: 0 }, { label: "12 cm", delta: 9 }] },
    specs: [
      { label: "Light", value: "Bright, indirect" },
      { label: "Humidity", value: "High" },
      { label: "Water", value: "Keep lightly moist; never soggy" },
    ],
  },
  {
    slug: "pilea-aluminum",
    name: "Aluminum Plant",
    latin: "Pilea cadierei",
    category: "plants",
    price: 17,
    tagline: "Silver brushstrokes on deep green.",
    description: "Quilted leaves marked with metallic silver, as if painted on. Compact and quick, it fills the mid-ground of a vivarium in a season.",
    images: [`${P}/pilea-aluminum.jpg`, `${P}/lifestyle-desk.jpg`],
    variants: { name: "Pot", options: [{ label: "9 cm", delta: 0 }, { label: "12 cm", delta: 7 }] },
    specs: [
      { label: "Light", value: "Medium–bright" },
      { label: "Humidity", value: "Medium–high" },
      { label: "Water", value: "Let the top dry between waterings" },
    ],
  },
  {
    slug: "pilea-moon-valley",
    name: "Moon Valley Pilea",
    latin: "Pilea involucrata 'Moon Valley'",
    category: "plants",
    price: 16,
    tagline: "Crinkled like a moon's surface, lime on bronze.",
    description: "Deeply puckered leaves in acid green over bronze veins. Stays low and dense — a favourite for carpeting the floor of a terrarium.",
    images: [`${P}/pilea-moon-valley.jpg`, `${P}/lifestyle-desk.jpg`],
    variants: { name: "Pot", options: [{ label: "9 cm", delta: 0 }] },
    specs: [
      { label: "Light", value: "Medium" },
      { label: "Humidity", value: "High" },
      { label: "Water", value: "Keep evenly moist" },
    ],
  },
  {
    slug: "anthurium-clarinervium",
    name: "Velvet Anthurium",
    latin: "Anthurium clarinervium",
    category: "plants",
    price: 48,
    tagline: "A dark velvet heart, veined in white.",
    description: "Thick, velvety heart-shaped leaves with chalk-white veins. Slow-growing and sculptural; one leaf is enough to anchor a cabinet planting.",
    images: [`${P}/anthurium-clarinervium.jpg`, `${P}/lifestyle-desk.jpg`],
    variants: { name: "Pot", options: [{ label: "12 cm", delta: 0 }, { label: "15 cm", delta: 16 }] },
    specs: [
      { label: "Light", value: "Bright, indirect" },
      { label: "Humidity", value: "High" },
      { label: "Water", value: "Let the top dry between waterings" },
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const getRelated = (product: Product, n = 6) =>
  products.filter((p) => p.slug !== product.slug).sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category)).slice(0, n);

/* Jordanian dinar, written the way shops in Amman write it. */
export const formatPrice = (n: number) => `${n.toLocaleString("en-US")} JD`;
