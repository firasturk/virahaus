/*
 * What the product pages need beyond the catalogue: each piece's outline for the
 * size diagram, its measurements per size option (same order as the options in
 * products.ts), and its Arabic copy.
 *
 * The measurements are working estimates taken from the size labels and photos.
 * Replace them with measured figures before the pages run as ads.
 */

export type Shape = "jar" | "cylinder" | "tank" | "cabinet" | "pot" | "air";

/** Centimetres. w is the width (or diameter for round vessels), d the depth where it matters. */
export interface Size { h: number; w: number; d?: number }

export interface ProductExtra {
  shape: Shape;
  sizes: Size[];
  ar: {
    name: string;
    tagline: string;
    description: string;
    variantName: string;
    options: string[];
    specs: { label: string; value: string }[];
  };
}

const POT_SIZES: Record<string, Size> = { "9": { w: 9, h: 22 }, "12": { w: 12, h: 30 }, "15": { w: 15, h: 38 } };

const plantCare = {
  brightIndirect: { label: "الضوء", value: "ساطع وغير مباشر" },
  filtered: { label: "الضوء", value: "ضوء مُصفّى" },
  medium: { label: "الضوء", value: "متوسط" },
  humHigh: { label: "الرطوبة", value: "عالية" },
  humMedHigh: { label: "الرطوبة", value: "متوسطة إلى عالية" },
  dryTop: { label: "الري", value: "اترك سطح التربة يجف بين الريّات" },
  moist: { label: "الري", value: "حافظ على رطوبة متساوية" },
};

export const EXTRA: Record<string, ProductExtra> = {
  "ember-jar": {
    shape: "jar",
    sizes: [{ h: 28, w: 18 }, { h: 42, w: 26 }, { h: 60, w: 36 }],
    ar: {
      name: "جرّة إمبر",
      tagline: "سلسلة من الحجر البركاني تحت ضوء واحد بارد.",
      description:
        "حجر بركاني أسود مرصوص على شكل تلّة، مكسوّ بالطحالب وسرخس ناعم، ومغلق داخل وعاء زجاجي منفوخ يدوياً. أضف غطاء LED فيضيء وحده كل يوم بمؤقت. نزرعه ونغلقه يدوياً، فيصنع طقسه بنفسه: لا ري ولا تسميد. أعطه الضوء واتركه يعيش.",
      variantName: "الحجم",
      options: ["صغير – ٢٨ سم", "ستوديو – ٤٢ سم", "كبير – ٦٠ سم"],
      specs: [
        { label: "الوعاء", value: "زجاج بوروسيليكات منفوخ يدوياً" },
        { label: "الإضاءة", value: "غطاء LED اختياري بمؤقت يومي (+٢٠ د.أ)" },
        { label: "الطبقات", value: "حجر بركاني، طحلب، طبقة تصريف" },
        { label: "العناية", value: "لا شيء. مغلق، يحتاج الضوء فقط" },
        { label: "الصنع", value: "يدوي، قطعة قطعة" },
      ],
    },
  },
  "cascade-vessel": {
    shape: "cylinder",
    sizes: [{ h: 30, w: 14 }, { h: 45, w: 18 }],
    ar: {
      name: "أسطوانة كاسكيد",
      tagline: "أسطوانة مطر لا يتوقف تماماً.",
      description:
        "زجاج طويل، قطرات على الجدران، وعمود من الطحالب والتين الزاحف يتسلق عموداً من الفلين. مع غطاء LED يضيء كفانوس على المكتب في المساء. مغلق يدوياً، ويسقي نفسه بنفسه.",
      variantName: "الارتفاع",
      options: ["٣٠ سم", "٤٥ سم"],
      specs: [
        { label: "الوعاء", value: "أسطوانة زجاجية" },
        { label: "الإضاءة", value: "غطاء LED اختياري بمؤقت يومي (+٢٠ د.أ)" },
        { label: "النباتات", value: "تين زاحف، طحلب، عمود فلين" },
        { label: "العناية", value: "لا شيء. مغلق، يحتاج الضوء فقط" },
        { label: "الصنع", value: "يدوي، قطعة قطعة" },
      ],
    },
  },
  "nimbus-cylinder": {
    shape: "cylinder",
    sizes: [{ h: 24, w: 20 }, { h: 24, w: 20 }],
    ar: {
      name: "أسطوانة نيمبس",
      tagline: "ضباب داخل جرّة.",
      description:
        "أسطوانة منخفضة وعريضة مبنية حول قطعة واحدة من الخشب الطبيعي، مفروشة بالطحالب ومضاءة من الأعلى. أهدأ قطعة في المجموعة وأسهلها: مغلقة يدوياً ولا تحتاج إلا الضوء.",
      variantName: "التشطيب",
      options: ["زجاج شفاف", "زجاج منقّط"],
      specs: [
        { label: "الوعاء", value: "أسطوانة ٢٤ سم" },
        { label: "النباتات", value: "خشب طبيعي، طحلب، سرخس" },
        { label: "العناية", value: "لا شيء. مغلق، يحتاج الضوء فقط" },
        { label: "الصنع", value: "يدوي، قطعة قطعة" },
      ],
    },
  },
  "canopy-tank": {
    shape: "tank",
    sizes: [{ w: 40, d: 40, h: 60 }, { w: 60, d: 45, h: 60 }],
    ar: {
      name: "حوض كانوبي",
      tagline: "غابة مطيرة بباب أمامي وطقس مدمج.",
      description:
        "حوض من الزجاج عالي الشفافية بغطاء مفصلي، وفوهة رذاذ، وإضاءة كاملة الطيف. خلفية من الفلين مزروعة بالبروميليا والفيتونيا والطحالب، وطبقة ماء ضحلة في القاع للرطوبة.",
      variantName: "الحجم",
      options: ["٤٠ – ٤٠×٤٠×٦٠ سم", "٦٠ – ٦٠×٤٥×٦٠ سم"],
      specs: [
        { label: "الزجاج", value: "عالي الشفافية ٦ مم، غطاء مفصلي" },
        { label: "الإضاءة", value: "LED كامل الطيف قابل للتعتيم" },
        { label: "الرذاذ", value: "فوهة واحدة جاهزة للمؤقت" },
        { label: "الخلفية", value: "لحاء فلين مزروع" },
        { label: "التسليم", value: "طلب مسبق، جاهز خلال أسبوعين" },
      ],
    },
  },
  "atrium-cabinet": {
    shape: "cabinet",
    sizes: [{ w: 120, d: 60, h: 200 }, { w: 160, d: 60, h: 200 }],
    ar: {
      name: "خزانة أتريوم",
      tagline: "جدار من الغابة خلف بابين.",
      description:
        "فيفاريوم عرض ببابين على خزانة سوداء مطفأة. أنثوريوم وكالاثيا وبروميليا ونباتات متسلقة على خلفية منحوتة، تحت أربعة أضواء. يُصنع حسب الطلب، يُزرع يدوياً، ويُسلَّم ويُركَّب.",
      variantName: "العرض",
      options: ["١٢٠ سم", "١٦٠ سم"],
      specs: [
        { label: "الزجاج", value: "عالي الشفافية، بابان، ٨ مم" },
        { label: "الخزانة", value: "سوداء مطفأة مع تهوية" },
        { label: "الإضاءة", value: "٤ أضواء مع شروق وغروب مبرمج" },
        { label: "الرذاذ", value: "نظام مطر وخزان في القاعدة" },
        { label: "التسليم", value: "طلب مسبق، جاهز خلال أسبوعين من التأكيد" },
      ],
    },
  },
  tidepool: {
    shape: "cabinet",
    sizes: [{ w: 45, d: 45, h: 170 }, { w: 60, d: 45, h: 170 }],
    ar: {
      name: "بالوداريوم تايدبول",
      tagline: "نصفه يابسة ونصفه ماء. وكلاهما حي.",
      description: "شاطئ مزروع فوق بركة ضحلة فيها عدس الماء وجسر من الخشب الطبيعي. مصمم للنباتات التي تحب أن تبقى أقدامها مبللة.",
      variantName: "الحجم",
      options: ["٤٥ سم", "٦٠ سم"],
      specs: [
        { label: "الزجاج", value: "عالي الشفافية" },
        { label: "الماء", value: "بركة ٨ سم مع فلتر" },
        { label: "الإضاءة", value: "إضاءة كاملة الطيف" },
        { label: "التسليم", value: "طلب مسبق، جاهز خلال أسبوعين" },
      ],
    },
  },
  caladium: {
    shape: "pot",
    sizes: [POT_SIZES["9"], POT_SIZES["12"]],
    ar: {
      name: "كالاديوم",
      tagline: "عروق وردية على الأخضر. لافت بطريقة جميلة.",
      description: "أوراق على شكل قلب مرشوشة بالوردي والأبيض. يحب الدفء والرطوبة والظل الساطع، أي أنه يحب الفيفاريوم.",
      variantName: "الأصيص",
      options: ["٩ سم", "١٢ سم"],
      specs: [plantCare.brightIndirect, plantCare.humHigh, plantCare.moist],
    },
  },
  "begonia-maculata": {
    shape: "pot",
    sizes: [POT_SIZES["9"], POT_SIZES["12"]],
    ar: {
      name: "بيغونيا منقّطة",
      tagline: "أوراق كجناح الملاك، نقاط فضية، وأحمر من الأسفل.",
      description: "أوراق طويلة مدببة منقّطة بالفضي وبلون النبيذ من الخلف. تنمو بشكل عمودي، وتحب الرطوبة والضوء المُصفّى.",
      variantName: "الأصيص",
      options: ["٩ سم", "١٢ سم"],
      specs: [plantCare.filtered, plantCare.humMedHigh, plantCare.dryTop],
    },
  },
  "bromeliad-variegated": {
    shape: "pot",
    sizes: [POT_SIZES["12"], POT_SIZES["15"]],
    ar: {
      name: "بروميليا مخططة",
      tagline: "وردة خضراء بحواف كريمية.",
      description: "بروميليا تخزّن الماء في كأسها الوسطى لا في التربة. أوراقها المخططة تنفتح كالمروحة. بطيئة وقوية وتعيش طويلاً تحت الزجاج.",
      variantName: "الأصيص",
      options: ["١٢ سم", "١٥ سم"],
      specs: [{ label: "الضوء", value: "ساطع" }, { label: "الري", value: "املأ الكأس واشطفها شهرياً" }, plantCare.humHigh],
    },
  },
  "begonia-wightii": {
    shape: "pot",
    sizes: [POT_SIZES["9"], POT_SIZES["12"]],
    ar: {
      name: "بيغونيا وايتي",
      tagline: "نقاط أكبر، وورقة أغمق.",
      description: "القريبة الأجرأ للبيغونيا المنقطة: نقاط فضية أكبر على أوراق زيتونية بلون عنابي من الأسفل.",
      variantName: "الأصيص",
      options: ["٩ سم", "١٢ سم"],
      specs: [plantCare.filtered, plantCare.humMedHigh],
    },
  },
  tillandsia: {
    shape: "air",
    sizes: [{ w: 8, h: 10 }, { w: 16, h: 10 }],
    ar: {
      name: "نبتة هوائية",
      tagline: "بلا تربة. تحمرّ قبل أن تزهر.",
      description: "تعيش على الهواء والرذاذ. تتحول كلها للأحمر وتطلق زهرة بنفسجية مرة في السنة. ثبّتها على لحاء أو سلك وانسَ الأصص.",
      variantName: "الحجم",
      options: ["واحدة", "مجموعة من ثلاث"],
      specs: [plantCare.brightIndirect, { label: "الري", value: "رذاذ ٣ مرات أسبوعياً، ونقع شهري" }, { label: "التربة", value: "لا يوجد" }],
    },
  },
  cryptanthus: {
    shape: "pot",
    sizes: [{ w: 9, h: 14 }],
    ar: {
      name: "نجمة الأرض",
      tagline: "نجمة وردية مسطحة لأرضية الغابة.",
      description: "وردة ملتصقة بالأرض مخططة بالوردي والكريمي والأخضر. تبقى صغيرة ومنخفضة وتحب الزاوية الرطبة في التيراريوم.",
      variantName: "الأصيص",
      options: ["٩ سم"],
      specs: [plantCare.medium, plantCare.humHigh, plantCare.moist],
    },
  },
  "begonia-rex": {
    shape: "pot",
    sizes: [POT_SIZES["9"], POT_SIZES["12"]],
    ar: {
      name: "بيغونيا ريكس",
      tagline: "أوراق ملوّنة بالوردي والأخضر والفضي.",
      description: "تُزرع لأوراقها وحدها: أوراق عريضة ومحفورة مغسولة بالوردي ومحاطة بالأخضر. بطيئة ولافتة وتحب الرطوبة الهادئة في الأحواض المغلقة.",
      variantName: "الأصيص",
      options: ["٩ سم", "١٢ سم"],
      specs: [plantCare.brightIndirect, plantCare.humHigh, { label: "الري", value: "رطوبة خفيفة، بلا إغراق" }],
    },
  },
  "pilea-aluminum": {
    shape: "pot",
    sizes: [POT_SIZES["9"], POT_SIZES["12"]],
    ar: {
      name: "نبتة الألمنيوم",
      tagline: "ضربات فرشاة فضية على أخضر داكن.",
      description: "أوراق مبطنة بعلامات فضية لامعة كأنها مرسومة. صغيرة وسريعة النمو، تملأ وسط الفيفاريوم خلال موسم.",
      variantName: "الأصيص",
      options: ["٩ سم", "١٢ سم"],
      specs: [{ label: "الضوء", value: "متوسط إلى ساطع" }, plantCare.humMedHigh, plantCare.dryTop],
    },
  },
  "pilea-moon-valley": {
    shape: "pot",
    sizes: [{ w: 9, h: 16 }],
    ar: {
      name: "بيليا وادي القمر",
      tagline: "مجعّدة كسطح القمر، أخضر ليموني على برونزي.",
      description: "أوراق مجعدة بعمق بلون أخضر حامض فوق عروق برونزية. تبقى منخفضة وكثيفة، ومفضلة لتغطية أرضية التيراريوم.",
      variantName: "الأصيص",
      options: ["٩ سم"],
      specs: [plantCare.medium, plantCare.humHigh, plantCare.moist],
    },
  },
  "anthurium-clarinervium": {
    shape: "pot",
    sizes: [{ w: 12, h: 35 }, { w: 15, h: 45 }],
    ar: {
      name: "أنثوريوم مخملي",
      tagline: "قلب مخملي داكن بعروق بيضاء.",
      description: "أوراق سميكة مخملية على شكل قلب بعروق بيضاء كالطباشير. بطيء النمو ونحتي الشكل، وورقة واحدة تكفي لتكون محور الحوض.",
      variantName: "الأصيص",
      options: ["١٢ سم", "١٥ سم"],
      specs: [plantCare.brightIndirect, plantCare.humHigh, plantCare.dryTop],
    },
  },
};

export const CATEGORY_AR: Record<string, string> = { terrarium: "تيراريوم", vivarium: "فيفاريوم", plants: "نباتات" };
export const CATEGORY_AR_PLURAL: Record<string, string> = { terrarium: "تيراريوم", vivarium: "فيفاريوم", plants: "نباتات" };
