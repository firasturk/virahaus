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
        { label: "الضوء", value: "قوي وغير مباشر", icon: "sun" },
        { label: "السقاية", value: "ولا مرة", icon: "drop" },
        { label: "الحرارة", value: "١٨–٢٦ °م", icon: "temp" },
        { label: "المجهود", value: "ولا إشي", icon: "hand" },
      ],
      steps: [
        "طلّعها من العلبة وحطها بمكان فيه ضو، بعيد عن الشمس المباشرة.",
        "خلّي الغطاء مسكّر. الضباب على الزجاج الصبح معناه إن دورة المطر شغّالة.",
        "إذا ضل الضباب كثيف كم يوم، افتح الغطاء ساعة وبعدين سكّره.",
        "كل كم شهر، قصّ أي ورقة بتلمس الزجاج.",
      ],
    },
    vivarium: {
      icons: [
        { label: "الضوء", value: "مدمج مع مؤقت", icon: "timer" },
        { label: "السقاية", value: "رذاذ أوتوماتيك", icon: "drop" },
        { label: "الحرارة", value: "٢٠–٢٨ °م", icon: "temp" },
        { label: "المجهود", value: "١٠ دقايق بالأسبوع", icon: "hand" },
      ],
      steps: [
        "بنوصله وبنركّبه وبنجهزه، مع الإضاءة والرذاذ.",
        "عبّي خزان الرذاذ مرة بالأسبوع.",
        "امسح الزجاج من قدّام وقت ما بدك تشوف أوضح.",
        "قصّ النباتات اللي بتكبر بسرعة مرة بالشهر، واسألنا على واتساب بأي وقت.",
      ],
    },
    plants: {
      icons: [
        { label: "الضوء", value: "قوي وغير مباشر", icon: "sun" },
        { label: "السقاية", value: "رطوبة خفيفة", icon: "drop" },
        { label: "الحرارة", value: "١٨–٢٨ °م", icon: "temp" },
        { label: "المجهود", value: "سهل", icon: "hand" },
      ],
      steps: [
        "حطها بضو قوي، بس بعيد عن شمس الظهر المباشرة.",
        "اسقيها لما ينشف وجه التربة، ولا تخليها قاعدة بالماء.",
        "بتحب الرطوبة: رشّ ورقها، أو ازرعها بتيراريوم.",
        "لفّ الأصيص كل فترة عشان تكبر بشكل متساوي.",
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
    deliveryReady: "اطلب قبل ٤ العصر وبتوصلك بنفس اليوم بعمّان.",
    readyBy: (date: string) => `اطلب اليوم، وبتكون جاهزة يوم ${date}.`,
    ledTitle: "ضيف غطاء الإضاءة LED",
    ledText: "ضو ناعم بالغطاء بيشتغل وبيطفي لحاله كل يوم بمؤقت مدمج. بيخليها تعيش حتى بالزوايا العتمة.",
    ledAdded: "مع غطاء إضاءة LED",
    outlineTitle: "الرسمة",
    outlineLede: "كل جزء وقياسه، وجنبه كوب أو شخص عشان تقارن.",
    careTitle: "كيف تعتني فيها",
    careLede: "قصيرة، لأنه ما في إشي كتير تعمله.",
    giftTitle: "بتوصل جاهزة للهدية",
    giftText: "كل قطعة بتطلع بعلبة ViraHaus مع بطاقة بخط اليد. ما في أسعار جوّا، والبطاقة بتحكي اللي بدك إياه.",
    giftBox: "العلبة",
    giftCard: "البطاقة",
    accDetails: "التفاصيل والقياسات",
    accDelivery: "التوصيل والدفع",
    accDeliveryText: "عمّان ٢ د.أ، بنفس اليوم للقطع الجاهزة إذا طلبت قبل ٤. باقي المحافظات ٣٫٥ د.أ باليوم اللي بعده. مجاني فوق ٥٠ د.أ. الدفع عند الاستلام كاش أو كليك أو بطاقة. الطلب المسبق بيجهز بعد أسبوعين من التأكيد.",
    accGuarantee: "الضمان",
    accGuaranteeText: "بتوصل عايشة أو بنبدّلها مجاناً. إذا في أي مشكلة، ابعتلنا صورة على واتساب خلال ٣٠ يوم.",
    totalTitle: "المجموع",
    totalItem: "القطعة",
    totalLed: "غطاء إضاءة LED",
    totalDelivery: "التوصيل بعمّان",
    totalFree: "مجاني",
    totalSum: "المجموع",
    freeGap: (n: string) => `ضيف ${n} وبيصير التوصيل مجاني.`,
    freeYes: "التوصيل مجاني.",
    addToJar: "ضيف للجرّة",
    preorderToJar: "اطلب مسبقاً",
    sticky: "ضيف",
  },
};
