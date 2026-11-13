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
  brightIndirect: { label: "الضوء", value: "قوي وغير مباشر" },
  filtered: { label: "الضوء", value: "مُصفّى، مش مباشر" },
  medium: { label: "الضوء", value: "متوسط" },
  humHigh: { label: "الرطوبة", value: "عالية" },
  humMedHigh: { label: "الرطوبة", value: "متوسطة لعالية" },
  dryTop: { label: "الري", value: "خلّي وجه التربة ينشف قبل ما تسقي" },
  moist: { label: "الري", value: "خلّي التربة رطبة دايماً" },
};

export const EXTRA: Record<string, ProductExtra> = {
  "ember-jar": {
    shape: "jar",
    sizes: [{ h: 28, w: 18 }, { h: 42, w: 26 }, { h: 60, w: 36 }],
    ar: {
      name: "جرّة إمبر",
      tagline: "تلّة حجر بركاني تحت ضو واحد بارد.",
      description:
        "حجر بركاني أسود مرصوص على شكل تلّة، مغطّى بالطحالب وسرخس ناعم، ومسكّر جوّا زجاج منفوخ يدوياً. ضيف غطاء LED وبيضوي لحاله كل يوم بمؤقت. بنزرعها ونسكّرها بإيدينا، فبتعمل طقسها لحالها: لا ري ولا تسميد. أعطيها ضو وخلّيها تعيش.",
      variantName: "الحجم",
      options: ["صغير – ٢٨ سم", "ستوديو – ٤٢ سم", "كبير – ٦٠ سم"],
      specs: [
        { label: "الوعاء", value: "زجاج بوروسيليكات منفوخ يدوياً" },
        { label: "الإضاءة", value: "غطاء LED اختياري مع مؤقت يومي (+٢٠ د.أ)" },
        { label: "الطبقات", value: "حجر بركاني، طحلب، طبقة تصريف" },
        { label: "العناية", value: "ولا إشي. مسكّرة وبدها ضو بس" },
        { label: "الصنع", value: "شغل يدوي، قطعة قطعة" },
      ],
    },
  },
  "cascade-vessel": {
    shape: "cylinder",
    sizes: [{ h: 30, w: 14 }, { h: 45, w: 18 }],
    ar: {
      name: "أسطوانة كاسكيد",
      tagline: "أسطوانة فيها مطر ما بيوقف تقريباً.",
      description:
        "زجاج طويل، نقاط ماء على الجدران، وطحالب وتين زاحف بيتسلقوا عمود فلين. مع غطاء LED بتضوي زي فانوس على المكتب بالليل. مسكّرة بإيدينا، وبتسقي حالها بحالها.",
      variantName: "الارتفاع",
      options: ["٣٠ سم", "٤٥ سم"],
      specs: [
        { label: "الوعاء", value: "أسطوانة زجاجية" },
        { label: "الإضاءة", value: "غطاء LED اختياري مع مؤقت يومي (+٢٠ د.أ)" },
        { label: "النباتات", value: "تين زاحف، طحلب، عمود فلين" },
        { label: "العناية", value: "ولا إشي. مسكّرة وبدها ضو بس" },
        { label: "الصنع", value: "شغل يدوي، قطعة قطعة" },
      ],
    },
  },
  "nimbus-cylinder": {
    shape: "cylinder",
    sizes: [{ h: 24, w: 20 }, { h: 24, w: 20 }],
    ar: {
      name: "أسطوانة نيمبس",
      tagline: "ضباب جوّا جرّة.",
      description:
        "أسطوانة واطية وعريضة مبنية حوالين قطعة خشب طبيعي وحدة، مفروشة بالطحالب ومضوّاية من فوق. أهدى قطعة بالمجموعة وأسهلها: مسكّرة بإيدينا وما بدها غير ضو.",
      variantName: "التشطيب",
      options: ["زجاج شفاف", "زجاج منقّط"],
      specs: [
        { label: "الوعاء", value: "أسطوانة ٢٤ سم" },
        { label: "النباتات", value: "خشب طبيعي، طحلب، سرخس" },
        { label: "العناية", value: "ولا إشي. مسكّرة وبدها ضو بس" },
        { label: "الصنع", value: "شغل يدوي، قطعة قطعة" },
      ],
    },
  },
  "canopy-tank": {
    shape: "tank",
    sizes: [{ w: 40, d: 40, h: 60 }, { w: 60, d: 45, h: 60 }],
    ar: {
      name: "حوض كانوبي",
      tagline: "غابة مطيرة بباب من قدّام وطقس جاهز جوّاها.",
      description:
        "حوض زجاج شفاف كتير بغطاء بيفتح، وفوهة رذاذ، وإضاءة كاملة الطيف. خلفية فلين مزروعة بروميليا وفيتونيا وطحالب، وطبقة ماء خفيفة بالقاع للرطوبة.",
      variantName: "الحجم",
      options: ["٤٠ – ٤٠×٤٠×٦٠ سم", "٦٠ – ٦٠×٤٥×٦٠ سم"],
      specs: [
        { label: "الزجاج", value: "شفافية عالية ٦ مم، غطاء بيفتح" },
        { label: "الإضاءة", value: "LED كامل الطيف، وبتقدر تخففه" },
        { label: "الرذاذ", value: "فوهة وحدة جاهزة للمؤقت" },
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
      tagline: "جدار من الغابة ورا بابين.",
      description:
        "فيفاريوم عرض ببابين على خزانة سوداء مطفية. أنثوريوم وكالاثيا وبروميليا ونباتات متسلقة على خلفية منحوتة، تحت أربع أضواء. بنعمله حسب الطلب، بنزرعه بإيدينا، وبنوصله وبنركّبه.",
      variantName: "العرض",
      options: ["١٢٠ سم", "١٦٠ سم"],
      specs: [
        { label: "الزجاج", value: "شفافية عالية، بابين، ٨ مم" },
        { label: "الخزانة", value: "سوداء مطفية مع تهوية" },
        { label: "الإضاءة", value: "٤ أضواء مع شروق وغروب مبرمج" },
        { label: "الرذاذ", value: "نظام مطر وخزان بالقاعدة" },
        { label: "التسليم", value: "طلب مسبق، جاهز خلال أسبوعين من التأكيد" },
      ],
    },
  },
  tidepool: {
    shape: "cabinet",
    sizes: [{ w: 45, d: 45, h: 170 }, { w: 60, d: 45, h: 170 }],
    ar: {
      name: "بالوداريوم تايدبول",
      tagline: "نصه يابسة ونصه ماء. والاثنين عايشين.",
      description: "شط مزروع فوق بركة خفيفة فيها عدس ماء وجسر خشب طبيعي. معمول للنباتات اللي بتحب تضل إجريها مبلولة.",
      variantName: "الحجم",
      options: ["٤٥ سم", "٦٠ سم"],
      specs: [
        { label: "الزجاج", value: "شفافية عالية" },
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
      tagline: "عروق وردية على الأخضر. بيلفت النظر.",
      description: "ورق على شكل قلب مرشوش بالوردي والأبيض. بيحب الدفء والرطوبة والظل المضوّي، يعني بيحب الفيفاريوم.",
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
      tagline: "ورق زي جناح الملاك، نقاط فضية، وأحمر من تحت.",
      description: "ورق طويل ومدبب، منقّط بالفضي ولونه نبيذي من ورا. بتطلع لفوق، وبتحب الرطوبة والضو المُصفّى.",
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
      description: "بروميليا بتخزّن الماء بالكاسة اللي بنصها، مش بالتربة. ورقها المخطط بينفتح زي المروحة. بطيئة وقوية وبتعيش طويل تحت الزجاج.",
      variantName: "الأصيص",
      options: ["١٢ سم", "١٥ سم"],
      specs: [{ label: "الضوء", value: "قوي" }, { label: "الري", value: "عبّي الكاسة واشطفها كل شهر" }, plantCare.humHigh],
    },
  },
  "begonia-wightii": {
    shape: "pot",
    sizes: [POT_SIZES["9"], POT_SIZES["12"]],
    ar: {
      name: "بيغونيا وايتي",
      tagline: "نقاط أكبر، وورقة أغمق.",
      description: "قريبة البيغونيا المنقّطة بس أجرأ: نقاط فضية أكبر على ورق زيتي، ولونه عنابي من تحت.",
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
      tagline: "بدون تربة. بتحمرّ قبل ما تزهّر.",
      description: "بتعيش على الهوا والرذاذ. بتحمرّ كلها وبتطلّع زهرة بنفسجية مرة بالسنة. ثبّتها على لحاء أو سلك وانسَ الأصص.",
      variantName: "الحجم",
      options: ["وحدة", "ثلاثة مع بعض"],
      specs: [plantCare.brightIndirect, { label: "الري", value: "رذاذ ٣ مرات بالأسبوع، ونقع مرة بالشهر" }, { label: "التربة", value: "ما بدها" }],
    },
  },
  cryptanthus: {
    shape: "pot",
    sizes: [{ w: 9, h: 14 }],
    ar: {
      name: "نجمة الأرض",
      tagline: "نجمة وردية مسطحة لأرض الغابة.",
      description: "وردة لازقة بالأرض، مخططة بالوردي والكريمي والأخضر. بتضل صغيرة وواطية وبتحب الزاوية الرطبة بالتيراريوم.",
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
      tagline: "ورق ملوّن بالوردي والأخضر والفضي.",
      description: "بتنزرع عشان ورقها بس: ورق عريض ومحفور، مغسول بالوردي وحواليه أخضر. بطيئة ولافتة وبتحب الرطوبة الهادية بالأحواض المسكّرة.",
      variantName: "الأصيص",
      options: ["٩ سم", "١٢ سم"],
      specs: [plantCare.brightIndirect, plantCare.humHigh, { label: "الري", value: "رطوبة خفيفة، بدون إغراق" }],
    },
  },
  "pilea-aluminum": {
    shape: "pot",
    sizes: [POT_SIZES["9"], POT_SIZES["12"]],
    ar: {
      name: "نبتة الألمنيوم",
      tagline: "ضربات فرشاة فضية على أخضر غامق.",
      description: "ورق منفوخ عليه علامات فضية لامعة كأنها مرسومة. صغيرة وبتكبر بسرعة، وبتعبّي نص الفيفاريوم خلال موسم.",
      variantName: "الأصيص",
      options: ["٩ سم", "١٢ سم"],
      specs: [{ label: "الضوء", value: "متوسط لقوي" }, plantCare.humMedHigh, plantCare.dryTop],
    },
  },
  "pilea-moon-valley": {
    shape: "pot",
    sizes: [{ w: 9, h: 16 }],
    ar: {
      name: "بيليا وادي القمر",
      tagline: "مجعّدة زي سطح القمر، أخضر ليموني على برونزي.",
      description: "ورق مجعّد كتير بلون أخضر حامض فوق عروق برونزية. بتضل واطية وكثيفة، ومفضّلة لتغطية أرض التيراريوم.",
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
      tagline: "قلب مخملي غامق بعروق بيضاء.",
      description: "ورق سميك ومخملي على شكل قلب، بعروق بيضاء زي الطباشير. بطيء بالنمو وشكله زي المنحوتة، وورقة وحدة بتكفي تكون نجمة الحوض.",
      variantName: "الأصيص",
      options: ["١٢ سم", "١٥ سم"],
      specs: [plantCare.brightIndirect, plantCare.humHigh, plantCare.dryTop],
    },
  },
};

export const CATEGORY_AR: Record<string, string> = { terrarium: "تيراريوم", vivarium: "فيفاريوم", plants: "نباتات" };
export const CATEGORY_AR_PLURAL: Record<string, string> = { terrarium: "تيراريوم", vivarium: "فيفاريوم", plants: "نباتات" };
