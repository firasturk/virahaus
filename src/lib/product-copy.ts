/* Product-page copy that depends on the kind of product: care, light, delivery, gift-ready. Both languages. */
import type { CategorySlug } from "@/data/products";
import type { Lang } from "./i18n";

export const LED_PRICE = 20; // JD
export const FREE_DELIVERY_FROM = 50; // JD — PLACEHOLDER policy
export const DELIVERY_FEE = 2; // JD in Amman — PLACEHOLDER policy

type Care = { icons: { label: string; value: string; icon: "sun" | "drop" | "temp" | "hand" | "timer" }[]; steps: string[] };

const CARE: Record<Lang, Record<CategorySlug, Care>> = {
  en: {
    terrarium: {
      icons: [
        { label: "Light", value: "Bright, indirect", icon: "sun" },
        { label: "Water", value: "Never", icon: "drop" },
        { label: "Temperature", value: "18–26 °C", icon: "temp" },
        { label: "Effort", value: "None", icon: "hand" },
      ],
      steps: [
        "Unbox it and set it somewhere bright, out of direct sun.",
        "Keep the lid on. Mist on the glass in the morning is the rain cycle working.",
        "If it stays very foggy for days, lift the lid for an hour, then close it.",
        "Every few months, trim any leaf that touches the glass.",
      ],
    },
    vivarium: {
      icons: [
        { label: "Light", value: "Built-in, on a timer", icon: "timer" },
        { label: "Water", value: "Automatic misting", icon: "drop" },
        { label: "Temperature", value: "20–28 °C", icon: "temp" },
        { label: "Effort", value: "10 min a week", icon: "hand" },
      ],
      steps: [
        "We deliver, place and set it up, lights and misting included.",
        "Top up the misting reservoir once a week.",
        "Wipe the front glass when you like the view clearer.",
        "Trim fast growers once a month; ask us on WhatsApp any time.",
      ],
    },
    plants: {
      icons: [
        { label: "Light", value: "Bright, indirect", icon: "sun" },
        { label: "Water", value: "Keep lightly moist", icon: "drop" },
        { label: "Temperature", value: "18–28 °C", icon: "temp" },
        { label: "Effort", value: "Easy", icon: "hand" },
      ],
      steps: [
        "Give it bright light without direct midday sun.",
        "Water when the top of the soil feels dry; never leave it standing in water.",
        "These love humidity: mist the leaves, or plant it in a terrarium.",
        "Turn the pot now and then so it grows evenly.",
      ],
    },
  },
  ar: {
    terrarium: {
      icons: [
        { label: "الضوء", value: "ساطع وغير مباشر", icon: "sun" },
        { label: "الري", value: "أبداً", icon: "drop" },
        { label: "الحرارة", value: "١٨–٢٦ °م", icon: "temp" },
        { label: "الجهد", value: "لا شيء", icon: "hand" },
      ],
      steps: [
        "أخرجها من العلبة وضعها في مكان مضيء بعيداً عن الشمس المباشرة.",
        "أبقِ الغطاء مغلقاً. الضباب على الزجاج صباحاً يعني أن دورة المطر تعمل.",
        "إذا بقي الضباب كثيفاً لأيام، ارفع الغطاء ساعة ثم أغلقه.",
        "كل بضعة أشهر، قصّ أي ورقة تلامس الزجاج.",
      ],
    },
    vivarium: {
      icons: [
        { label: "الضوء", value: "مدمج بمؤقت", icon: "timer" },
        { label: "الري", value: "رذاذ تلقائي", icon: "drop" },
        { label: "الحرارة", value: "٢٠–٢٨ °م", icon: "temp" },
        { label: "الجهد", value: "١٠ دقائق أسبوعياً", icon: "hand" },
      ],
      steps: [
        "نوصله ونضعه ونجهزه، مع الإضاءة والرذاذ.",
        "املأ خزان الرذاذ مرة في الأسبوع.",
        "امسح الزجاج الأمامي متى أردت رؤية أوضح.",
        "قصّ النباتات سريعة النمو مرة في الشهر، واسألنا على واتساب في أي وقت.",
      ],
    },
    plants: {
      icons: [
        { label: "الضوء", value: "ساطع وغير مباشر", icon: "sun" },
        { label: "الري", value: "رطوبة خفيفة", icon: "drop" },
        { label: "الحرارة", value: "١٨–٢٨ °م", icon: "temp" },
        { label: "الجهد", value: "سهل", icon: "hand" },
      ],
      steps: [
        "ضعها في ضوء ساطع بلا شمس الظهيرة المباشرة.",
        "اسقها عندما يجف سطح التربة، ولا تتركها واقفة في الماء.",
        "تحب الرطوبة: رشّ أوراقها، أو ازرعها في تيراريوم.",
        "أدر الأصيص من وقت لآخر لتنمو بشكل متساوٍ.",
      ],
    },
  },
};

export const careFor = (lang: Lang, c: CategorySlug) => CARE[lang][c];

export const COPY = {
  en: {
    dimsLine: (round: boolean, w: number, h: number, d?: number) => (round ? `Ø ${w} × ${h} cm` : `${w} × ${d ?? w} × ${h} cm`),
    deliveryReady: "Order before 4 pm for same-day delivery in Amman.",
    readyBy: (date: string) => `Order today, ready by ${date}.`,
    ledTitle: "Add the LED light lid",
    ledText: "A soft light in the lid that switches on and off by itself every day, on a built-in timer. Lets it live in darker corners.",
    ledAdded: "with LED light lid",
    outlineTitle: "The drawing",
    outlineLede: "Every part, its size, and a mug or a person beside it for scale.",
    careTitle: "How to look after it",
    careLede: "Short, because there is not much to do.",
    giftTitle: "Arrives gift-ready",
    giftText: "Every piece leaves in a ViraHaus box with a handwritten card. No prices inside, and the card says whatever you tell us.",
    giftBox: "The box",
    giftCard: "The card",
    accDetails: "Details and measurements",
    accDelivery: "Delivery and payment",
    accDeliveryText: "Amman 2 JD, same day for ready pieces ordered before 4 pm. Other governorates 3.5 JD, next day. Free over 50 JD. Pay on delivery in cash, by CliQ or by card. Pre-orders are ready two weeks after we confirm.",
    accGuarantee: "Guarantee",
    accGuaranteeText: "It arrives alive, or we replace it free. Send us a photo on WhatsApp within 30 days if anything is wrong.",
    totalTitle: "Your total",
    totalItem: "This piece",
    totalLed: "LED light lid",
    totalDelivery: "Delivery in Amman",
    totalFree: "Free",
    totalSum: "Total",
    freeGap: (n: string) => `Add ${n} for free delivery.`,
    freeYes: "Delivery is free.",
    addToJar: "Add to jar",
    preorderToJar: "Pre-order",
    sticky: "Add",
  },
  ar: {
    dimsLine: (round: boolean, w: number, h: number, d?: number) => (round ? `Ø ${w} × ${h} سم` : `${w} × ${d ?? w} × ${h} سم`),
    deliveryReady: "اطلب قبل الساعة ٤ عصراً للتوصيل بنفس اليوم في عمّان.",
    readyBy: (date: string) => `اطلب اليوم، وتكون جاهزة بتاريخ ${date}.`,
    ledTitle: "أضف غطاء الإضاءة LED",
    ledText: "ضوء ناعم في الغطاء يعمل وينطفئ وحده كل يوم بمؤقت مدمج. يسمح لها بالعيش في الزوايا الأغمق.",
    ledAdded: "مع غطاء إضاءة LED",
    outlineTitle: "الرسم",
    outlineLede: "كل جزء، وحجمه، وبجانبه كوب أو شخص للمقارنة.",
    careTitle: "كيف تعتني بها",
    careLede: "قصيرة، لأنه لا يوجد الكثير لتفعله.",
    giftTitle: "تصل جاهزة للإهداء",
    giftText: "كل قطعة تخرج في علبة ViraHaus مع بطاقة بخط اليد. بلا أسعار في الداخل، والبطاقة تقول ما تريد.",
    giftBox: "العلبة",
    giftCard: "البطاقة",
    accDetails: "التفاصيل والقياسات",
    accDelivery: "التوصيل والدفع",
    accDeliveryText: "عمّان ٢ د.أ، بنفس اليوم للقطع الجاهزة قبل الساعة ٤. باقي المحافظات ٣٫٥ د.أ في اليوم التالي. مجاني فوق ٥٠ د.أ. الدفع عند الاستلام كاش أو كليك أو بطاقة. الطلب المسبق جاهز بعد أسبوعين من التأكيد.",
    accGuarantee: "الضمان",
    accGuaranteeText: "تصل حيّة أو نستبدلها مجاناً. أرسل لنا صورة على واتساب خلال ٣٠ يوماً إذا كان هناك أي خلل.",
    totalTitle: "المجموع",
    totalItem: "هذه القطعة",
    totalLed: "غطاء إضاءة LED",
    totalDelivery: "التوصيل في عمّان",
    totalFree: "مجاني",
    totalSum: "المجموع",
    freeGap: (n: string) => `أضف ${n} ليصبح التوصيل مجانياً.`,
    freeYes: "التوصيل مجاني.",
    addToJar: "أضف إلى الجرّة",
    preorderToJar: "اطلب مسبقاً",
    sticky: "أضف",
  },
};
