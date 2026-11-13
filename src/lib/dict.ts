/*
 * Every word the site prints outside the product data, in English and Arabic.
 * The Arabic object is typed against the English one, so a missing key fails
 * the build instead of showing an empty label.
 *
 * Business details marked PLACEHOLDER (delivery fees, payment methods,
 * guarantee, lead times, social handles) are stand-ins until the real policy
 * is decided; they live here so they change in one place.
 */
import type { Lang } from "./i18n";

const en = {
  nav: { home: "Home", shop: "Shop", customize: "Customize your jar", how: "How it works", gifts: "Gifts", faq: "FAQ", contact: "Contact", aquariums: "Aquariums", menu: "Menu", close: "Close", language: "العربية" },

  hero: {
    line1: "Find your",
    line2: "inner green",
    copy: "Nurturing green spaces, cultivating sustainable solutions, and inspiring a greener tomorrow for all.",
    cta: "Our Products",
    scroll: "Scroll",
    hint: "Move your mouse to see it come alive",
    featured: "Featured",
    play: "Play the rainforest sound",
    stop: "Turn the rainforest sound off",
  },

  usp: [
    { title: "Handmade in Amman", text: "Planted and sealed by hand, one at a time." },
    { title: "No watering", text: "A sealed ecosystem. It only needs light." },
    { title: "Same-day delivery", text: "In Amman for ready pieces ordered before 4 pm." },
    { title: "Pay on delivery", text: "Cash, CliQ or card. Nothing up front." },
  ],

  categories: { kicker: "Shop by world", title: "Three ways to keep something alive.", pieces: "pieces", shopAll: "Shop all" },

  bestsellers: { kicker: "Ready to gift", title: "On the shelf, ready today.", lede: "Jars and plants we can deliver as soon as you order.", shopAll: "See the whole shop" },

  customizeBand: {
    kicker: "Customize your jar",
    title: "Build a jar that's theirs alone.",
    text: "Start with an empty jar. Drag in moss, ferns, stones and wood, add a light or a name, and we plant it by hand.",
    cta: "Start building",
    steps: ["Pick a jar", "Drag in plants and stones", "Add light or a name"],
  },

  ecosystem: {
    kicker: "Handmade · No care",
    title: "Just light. It lives on.",
    lede: "Every jar is planted and sealed by hand, and from that moment it is its own small ecosystem. No watering, no feeding, no green thumb.",
    steps: [
      { title: "Light", text: "A bright room or a lamp. That is all it asks for." },
      { title: "The plants breathe", text: "Moss and ferns turn light into growth and breathe out moisture." },
      { title: "It rains inside", text: "Moisture beads on the glass and runs back down to the soil." },
      { title: "Nothing is wasted", text: "The soil recycles what falls, and the cycle starts again." },
    ],
    fact: "The oldest known bottle garden was last watered in 1972, and it is still growing.",
    cta: "Shop no-care jars",
  },

  gifting: {
    kicker: "Gifting",
    line1: "Send a lifetime",
    line2: "for your loved ones.",
    text: "Flowers last a week. A handmade sealed jar keeps living for years with nothing but light — and every time it rains inside the glass, they'll think of you.",
    cta: "Choose a gift",
    bands: [
      { label: "Under 30 JD", band: "under-30" },
      { label: "30 – 100 JD", band: "30-100" },
      { label: "Over 100 JD", band: "over-100" },
    ],
    occasions: "Mother's Day · Birthdays · New home · Thank you · Ramadan & Eid",
    lines: [
      "No watering, ever. It only needs light.",
      "Handmade, one at a time.",
      "A handwritten note, included at no cost.",
      "Jars and plants are ready today.",
      "Tell us the day. We'll deliver it then.",
      "Pay on delivery — cash, CliQ or card.",
      "Not sure what to pick? Ask us on WhatsApp.",
      "Arrives alive, or we replace it.",
    ],
  },

  how: {
    kicker: "How it works",
    title: "Three steps. No checkout forms.",
    steps: [
      { title: "Fill your jar", text: "Add pieces to your jar — that's your cart — or build a custom one." },
      { title: "Send it on WhatsApp", text: "Your jar turns into a ready-written message. Add a note if it's a gift." },
      { title: "We confirm and deliver", text: "We reply to agree the details and the day, then deliver to the door." },
    ],
    readyTitle: "Ready now",
    readyText: "Terrarium jars and plants. Same day in Amman before 4 pm, next day elsewhere.",
    preTitle: "Pre-order · 2 weeks",
    preText: "Vivariums and large tanks are built for each order, ready two weeks after we confirm.",
    // PLACEHOLDER policy values
    service: [
      { title: "Delivery", text: "Amman 2 JD, same day before 4 pm. Other governorates 3.5 JD, next day. Free over 50 JD." },
      { title: "Payment", text: "Cash on delivery, CliQ, or card on delivery. Nothing is charged before we confirm." },
      { title: "Guarantee", text: "Arrives alive, or we replace it free. 30 days to tell us if anything is wrong." },
    ],
  },

  faq: {
    kicker: "Questions",
    title: "Good to know.",
    items: [
      { q: "Does a sealed jar really need no care?", a: "It needs no watering and no feeding: the water cycles inside the glass. Keep it in bright, indirect light, away from direct sun, and trim a leaf now and then if it touches the glass." },
      { q: "Where should I put it?", a: "Anywhere bright without direct sun: a shelf, a desk, a bedside table. The LED lid lets it live happily in darker corners too." },
      { q: "How long does it live?", a: "For years. A well-balanced sealed jar keeps renewing itself; the oldest known one has run for more than fifty years." },
      { q: "How does delivery work?", a: "Ready pieces go out the same day in Amman if you order before 4 pm, and next day to other governorates. Vivariums are pre-order and ready two weeks after we confirm." },
      { q: "How do I pay?", a: "On delivery, in cash, by CliQ, or by card. We confirm every order on WhatsApp first, so nothing is charged up front." },
      { q: "Can I add a name or a message?", a: "Yes. Build a custom jar to engrave a name on the lid, and add a handwritten gift note to any order at no cost." },
      { q: "What if it arrives damaged?", a: "Send us a photo on WhatsApp within 30 days and we will replace it free." },
    ],
  },

  aquarium: { kicker: "Also from our workshop", title: "Aquariums, reef and freshwater.", text: "We design and build custom marine and freshwater tanks on request. Tell us the space and what you would like to keep, and we will plan it with you.", cta: "Ask about an aquarium", msg: "Hi ViraHaus, I'd like to ask about a custom aquarium." },

  contact: { kicker: "Contact", title: "Questions before you order?", text: "Sizes, care, delivery, a custom build — ask us on WhatsApp and we'll answer.", cta: "Chat on WhatsApp", msg: "Hi ViraHaus, I have a question." },

  footer: {
    tagline: "Handmade sealed terrariums, vivariums and plants. Amman, Jordan.",
    shop: "Shop",
    help: "Help",
    follow: "Follow",
    contact: "Contact",
    rights: "All rights reserved.",
    // PLACEHOLDER handles
    instagram: "Instagram",
    tiktok: "TikTok",
    whatsapp: "WhatsApp",
    city: "Amman · delivering across Jordan",
  },

  shop: {
    title: "Shop",
    lede: "Jars and plants are ready today. Large tanks are pre-order, ready two weeks after we confirm.",
    all: "All",
    availability: "Availability",
    any: "Any",
    readyNow: "Ready now",
    preorder: "Pre-order",
    price: "Price",
    anyPrice: "Any price",
    count: (n: number) => `${n} ${n === 1 ? "piece" : "pieces"}`,
    empty: "Nothing matches these filters.",
    reset: "Clear filters",
    customTitle: "Customize your jar",
    customText: "Choose the jar, drag in the plants.",
    customCta: "Start building",
  },

  cart: {
    title: "Your jar",
    open: (n: number) => `Open your jar, ${n} item${n === 1 ? "" : "s"}`,
    label: "Jar",
    close: "Close",
    emptyTitle: "Your jar is empty.",
    emptyText: "Add a terrarium, a vivarium or a plant — it drops in here.",
    browse: "Browse the shop",
    gift: "This is a gift",
    giftFor: "Who is it for?",
    giftNote: "A short note — we write it by hand and tuck it in.",
    subtotal: "Subtotal",
    order: "Order on WhatsApp",
    foot: "We confirm on WhatsApp. Pay on delivery.",
    remove: "Remove",
    less: "Decrease",
    more: "Increase",
    ready: "Ready now",
    pre: "Pre-order · ready 2 weeks after confirmation",
    msgHello: "Hi ViraHaus, I'd like to order:",
    msgTotal: "Total",
    msgGift: "This is a gift.",
    msgFor: "For",
    msgNote: "Handwritten note",
    msgPre: "pre-order, ready in 2 weeks",
    msgReady: "ready now",
    added: "Added to your jar",
    date: "Delivery date (optional)",
    promo: "Discount code",
    promoPh: "WELCOME10",
    promoApply: "Apply",
    promoOk: "10% off your first order",
    promoBad: "That code doesn't work",
    discount: "Discount",
    msgDate: "Delivery date",
    msgCode: "Code",
  },

  customize: {
    kicker: "Customize your jar",
    title: "Build it, we plant it.",
    lede: "Drag plants, stones and wood into the jar. Move them around, make them bigger or smaller, and we plant it by hand exactly like this.",
    jar: "Jar",
    size: "Size",
    shapes: { bottle: "Bottle", cylinder: "Cylinder", dome: "Dome" },
    sizes: { s: "Small", m: "Medium", l: "Large" },
    palette: { plants: "Plants", stones: "Stones & wood", extras: "Extras" },
    dragHint: "Drag into the jar, or tap to add",
    selected: "Selected",
    smaller: "Smaller",
    larger: "Larger",
    forward: "Bring forward",
    remove: "Remove",
    clear: "Empty the jar",
    light: "LED light lid",
    lightText: "A soft light in the lid, on a timer. Lets it live in darker corners.",
    engrave: "Engrave a name on the lid",
    engravePh: "Up to 16 letters",
    giftNote: "Gift note (free, handwritten)",
    summary: "Your jar",
    base: "Jar",
    items: "Inside",
    none: "Nothing inside yet",
    total: "Total",
    lead: "Planted by hand, ready in 5 days.",
    add: "Add to my jar",
    whatsapp: "Order on WhatsApp",
    msgHello: "Hi ViraHaus, I'd like a custom jar:",
    placeholderNote: "Photos of each piece coming soon.",
  },

  product: { back: "Back to shop" },
};

export type Dict = typeof en;

const ar: Dict = {
  nav: { home: "الرئيسية", shop: "المتجر", customize: "صمّم جرّتك", how: "كيف تطلب", gifts: "هدايا", faq: "أسئلة", contact: "تواصل", aquariums: "أحواض سمك", menu: "القائمة", close: "إغلاق", language: "English" },

  hero: {
    line1: "اكتشف",
    line2: "الأخضر اللي فيك",
    copy: "نزرع الأخضر بإيدينا وبطريقة بتدوم، عشان يكون بكرا أخضر أكثر للكل.",
    cta: "شوف منتجاتنا",
    scroll: "انزل",
    hint: "حرّك الماوس وشوفها عايشة",
    featured: "اخترنا لك",
    play: "شغّل صوت الغابة",
    stop: "طفّي صوت الغابة",
  },

  usp: [
    { title: "شغل يدوي في عمّان", text: "نزرعها ونسكّرها بإيدينا، وحدة وحدة." },
    { title: "بدون سقاية", text: "نظام بيئي مسكّر، بدها ضو بس." },
    { title: "توصيل بنفس اليوم", text: "بعمّان للقطع الجاهزة إذا طلبت قبل ٤ العصر." },
    { title: "الدفع عند الاستلام", text: "كاش أو كليك أو بطاقة. ما بتدفع إشي قبل ما توصلك." },
  ],

  categories: { kicker: "تسوّق حسب النوع", title: "ثلاث طرق تخلّي إشي عايش عندك.", pieces: "قطع", shopAll: "شوف الكل" },

  bestsellers: { kicker: "جاهزة للهدية", title: "على الرف، وجاهزة اليوم.", lede: "جرار ونباتات بتوصلك أول ما تطلب.", shopAll: "شوف كل المتجر" },

  customizeBand: {
    kicker: "صمّم جرّتك",
    title: "اعمل جرّة ما في زيها.",
    text: "ابدأ بجرّة فاضية، واسحب جواها طحالب وسرخس وحجارة وخشب. ضيف ضو أو اسم، وإحنا بنزرعها بإيدينا.",
    cta: "ابدأ التصميم",
    steps: ["اختر الجرّة", "اسحب النباتات والحجارة", "ضيف ضو أو اسم"],
  },

  ecosystem: {
    kicker: "شغل يدوي – بدون عناية",
    title: "ضو بس. وبتعيش.",
    lede: "كل جرّة بنزرعها ونسكّرها بإيدينا، ومن لحظتها بتصير عالم صغير لحاله. لا ري ولا تسميد، ولا بدها خبرة.",
    steps: [
      { title: "الضو", text: "غرفة فيها ضو أو لمبة. هذا كل اللي بدها إياه." },
      { title: "النباتات بتتنفس", text: "الطحالب والسرخس بتحوّل الضو لنمو وبتطلّع رطوبة." },
      { title: "بتشتي جوّا", text: "الرطوبة بتتجمع على الزجاج وبترجع للتربة." },
      { title: "ولا إشي بيروح", text: "التربة بتعيد تدوير كل اللي بيوقع، والدورة بتبدأ من جديد." },
    ],
    fact: "أقدم حديقة بقنينة معروفة آخر مرة انسقت سنة ١٩٧٢، ولسّا بتكبر.",
    cta: "تسوّق جرار بدون عناية",
  },

  gifting: {
    kicker: "هدايا",
    line1: "هدية بتعيش سنين",
    line2: "للي بتحبهم.",
    text: "الورد بيعيش أسبوع. أما الجرّة المسكّرة اللي بنعملها بإيدينا فبتعيش سنين على الضو بس — وكل ما تشتي جوّا الزجاج، رح يتذكروك.",
    cta: "اختر هدية",
    bands: [
      { label: "تحت ٣٠ د.أ", band: "under-30" },
      { label: "٣٠ – ١٠٠ د.أ", band: "30-100" },
      { label: "فوق ١٠٠ د.أ", band: "over-100" },
    ],
    occasions: "عيد الأم – أعياد الميلاد – بيت جديد – شكراً – رمضان والعيد",
    lines: [
      "بدون سقاية أبداً. بدها ضو بس.",
      "شغل يدوي، قطعة قطعة.",
      "بطاقة بخط اليد، مجاناً.",
      "الجرار والنباتات جاهزة اليوم.",
      "احكيلنا اليوم، وبتوصل اليوم.",
      "الدفع عند الاستلام — كاش أو كليك أو بطاقة.",
      "محتار؟ اسألنا على واتساب.",
      "بتوصل عايشة، أو بنبدّلها.",
    ],
  },

  how: {
    kicker: "كيف تطلب",
    title: "ثلاث خطوات بس. بدون تعقيد.",
    steps: [
      { title: "عبّي جرّتك", text: "حط القطع بجرّتك — هي سلة الشراء — أو صمّم وحدة على ذوقك." },
      { title: "ابعتها على واتساب", text: "جرّتك بتصير رسالة جاهزة. ضيف بطاقة إذا كانت هدية." },
      { title: "بنأكد وبنوصّل", text: "بنرد عليك ونتفق على التفاصيل واليوم، وبعدين بتوصلك لباب البيت." },
    ],
    readyTitle: "جاهز الآن",
    readyText: "الجرار والنباتات. بنفس اليوم بعمّان إذا طلبت قبل ٤، وباليوم اللي بعده لباقي المحافظات.",
    preTitle: "طلب مسبق – أسبوعين",
    preText: "الفيفاريوم والأحواض الكبيرة بنعملها لكل طلب لحاله، وبتكون جاهزة بعد أسبوعين من التأكيد.",
    service: [
      { title: "التوصيل", text: "عمّان ٢ د.أ بنفس اليوم إذا طلبت قبل ٤. باقي المحافظات ٣٫٥ د.أ باليوم اللي بعده. مجاني فوق ٥٠ د.أ." },
      { title: "الدفع", text: "كاش أو كليك أو بطاقة عند الاستلام. ما في دفع قبل التأكيد." },
      { title: "الضمان", text: "بتوصل عايشة أو بنبدّلها مجاناً. معك ٣٠ يوم تحكيلنا عن أي مشكلة." },
    ],
  },

  faq: {
    kicker: "أسئلة",
    title: "أسئلة بتهمّك.",
    items: [
      { q: "الجرّة المسكّرة فعلاً ما بدها عناية؟", a: "ما بدها سقاية ولا تسميد: الماء بيدور جوّا الزجاج. حطها بمكان فيه ضو قوي غير مباشر، بعيد عن الشمس المباشرة، وكل فترة قصّ أي ورقة بتلمس الزجاج." },
      { q: "وين أحطها؟", a: "بأي مكان فيه ضو بدون شمس مباشرة: رف، مكتب، طاولة جنب السرير. وغطاء الإضاءة بيخليها تعيش حتى بالزوايا العتمة." },
      { q: "قديش بتعيش؟", a: "سنين. الجرّة المتوازنة بتجدد حالها باستمرار، وأقدم وحدة معروفة صارلها أكثر من خمسين سنة." },
      { q: "كيف التوصيل؟", a: "القطع الجاهزة بتوصلك بنفس اليوم بعمّان إذا طلبت قبل ٤، وباليوم اللي بعده لباقي المحافظات. الفيفاريوم طلب مسبق، وبيجهز بعد أسبوعين من التأكيد." },
      { q: "كيف بدفع؟", a: "عند الاستلام: كاش أو كليك أو بطاقة. بنأكد كل طلب على واتساب أول، فما في أي دفع مسبق." },
      { q: "بقدر أضيف اسم أو رسالة؟", a: "أكيد. صمّم جرّة خاصة وبنحفر الاسم على الغطاء، وضيف بطاقة إهداء بخط اليد لأي طلب، مجاناً." },
      { q: "شو بصير إذا وصلت متضررة؟", a: "ابعتلنا صورة على واتساب خلال ٣٠ يوم وبنبدّلها مجاناً." },
    ],
  },

  aquarium: { kicker: "كمان من ورشتنا", title: "أحواض سمك، بحرية وعذبة.", text: "بنصمم وبنبني أحواض بحرية وأحواض مي حلوة حسب الطلب. احكيلنا عن المساحة وشو بتحب تربّي، وبنخطط إلها معك.", cta: "اسأل عن حوض سمك", msg: "مرحبا ViraHaus، بدي أسأل عن حوض سمك حسب الطلب." },

  contact: { kicker: "تواصل", title: "عندك سؤال قبل ما تطلب؟", text: "الأحجام، العناية، التوصيل، تصميم خاص — اسألنا على واتساب وبنرد عليك.", cta: "راسلنا على واتساب", msg: "مرحبا ViraHaus، عندي سؤال." },

  footer: {
    tagline: "تيراريوم مسكّر بنعمله بإيدينا، فيفاريوم ونباتات. عمّان، الأردن.",
    shop: "المتجر",
    help: "مساعدة",
    follow: "تابعنا",
    contact: "تواصل",
    rights: "جميع الحقوق محفوظة.",
    instagram: "إنستغرام",
    tiktok: "تيك توك",
    whatsapp: "واتساب",
    city: "عمّان – بنوصل لكل الأردن",
  },

  shop: {
    title: "المتجر",
    lede: "الجرار والنباتات جاهزة اليوم. الأحواض الكبيرة طلب مسبق، وبتجهز بعد أسبوعين من التأكيد.",
    all: "الكل",
    availability: "التوفّر",
    any: "الكل",
    readyNow: "جاهز الآن",
    preorder: "طلب مسبق",
    price: "السعر",
    anyPrice: "كل الأسعار",
    count: (n: number) => `${n.toLocaleString("ar-EG")} ${n === 1 ? "قطعة" : n === 2 ? "قطعتان" : n <= 10 ? "قطع" : "قطعة"}`,
    empty: "ما في قطع بتطابق هالاختيار.",
    reset: "امسح الفلاتر",
    customTitle: "صمّم جرّتك",
    customText: "اختر الجرّة، واسحب عليها النباتات.",
    customCta: "ابدأ التصميم",
  },

  cart: {
    title: "جرّتك",
    open: (n: number) => `افتح جرّتك، ${n} قطعة`,
    label: "الجرّة",
    close: "إغلاق",
    emptyTitle: "جرّتك فاضية.",
    emptyText: "ضيف تيراريوم أو فيفاريوم أو نبتة — وبتنزل هون.",
    browse: "شوف المتجر",
    gift: "هاي هدية",
    giftFor: "لمين الهدية؟",
    giftNote: "رسالة قصيرة — بنكتبها بخط اليد وبنحطها معها.",
    subtotal: "المجموع",
    order: "اطلب على واتساب",
    foot: "بنأكد على واتساب. الدفع عند الاستلام.",
    remove: "احذف",
    less: "نقّص",
    more: "زيد",
    ready: "جاهز الآن",
    pre: "طلب مسبق – بيجهز بعد أسبوعين من التأكيد",
    msgHello: "مرحبا ViraHaus، بدي أطلب:",
    msgTotal: "المجموع",
    msgGift: "هاي هدية.",
    msgFor: "إلى",
    msgNote: "بطاقة بخط اليد",
    msgPre: "طلب مسبق، جاهز خلال أسبوعين",
    msgReady: "جاهز الآن",
    added: "انضافت لجرّتك",
    date: "تاريخ التوصيل (اختياري)",
    promo: "كود الخصم",
    promoPh: "WELCOME10",
    promoApply: "فعّل",
    promoOk: "خصم ١٠٪ على أول طلب",
    promoBad: "هذا الكود مش صحيح",
    discount: "الخصم",
    msgDate: "تاريخ التوصيل",
    msgCode: "الكود",
  },

  customize: {
    kicker: "صمّم جرّتك",
    title: "صمّمها، وإحنا بنزرعها.",
    lede: "اسحب النباتات والحجارة والخشب لجوّا الجرّة. حرّكها، كبّرها أو صغّرها، وبنزرعها بإيدينا زي ما صمّمتها بالضبط.",
    jar: "الجرّة",
    size: "الحجم",
    shapes: { bottle: "زجاجة", cylinder: "أسطوانة", dome: "قبّة" },
    sizes: { s: "صغير", m: "وسط", l: "كبير" },
    palette: { plants: "نباتات", stones: "حجارة وخشب", extras: "إضافات" },
    dragHint: "اسحب للجرّة، أو اضغط لتضيف",
    selected: "المختار",
    smaller: "أصغر",
    larger: "أكبر",
    forward: "لقدّام",
    remove: "احذف",
    clear: "فضّي الجرّة",
    light: "غطاء بإضاءة LED",
    lightText: "ضو ناعم بالغطاء مع مؤقت. بيخليها تعيش حتى بالزوايا العتمة.",
    engrave: "احفر اسم على الغطاء",
    engravePh: "لحد ١٦ حرف",
    giftNote: "بطاقة إهداء (مجاناً، بخط اليد)",
    summary: "جرّتك",
    base: "الجرّة",
    items: "جوّاها",
    none: "لسّا ما في إشي جوّا",
    total: "المجموع",
    lead: "بنزرعها بإيدينا، وبتجهز خلال ٥ أيام.",
    add: "ضيف لجرّتي",
    whatsapp: "اطلب على واتساب",
    msgHello: "مرحبا ViraHaus، بدي جرّة بتصميمي:",
    placeholderNote: "صور القطع قريباً.",
  },

  product: { back: "رجوع للمتجر" },
};

export const DICT: Record<Lang, Dict> = { en, ar };

/* Prefix a site path for the Arabic edition: "/" -> "/ar", "/shop" -> "/ar/shop". */
export function href(lang: Lang, path: string) {
  if (lang === "en") return path;
  if (path === "/") return "/ar";
  if (path.startsWith("/#")) return `/ar${path.slice(1)}`;
  return `/ar${path}`;
}

/* The same page in the other language. */
export function otherLangHref(lang: Lang, path: string) {
  return lang === "en" ? href("ar", path) : path;
}
