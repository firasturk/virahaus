import Image from "next/image";

import { num, type Lang } from "@/lib/i18n";

const COPY = {
  en: {
    kicker: "Built from scratch",
    title: "From a glass box to a rainforest.",
    lede: "Every vivarium is built from nothing for the room it will live in. This is one of ours, step by step.",
    steps: [
      { t: "The frame", d: "Pipes and foam boards set the trunks and the shape of the land." },
      { t: "Roots", d: "Flexible tubes are bent into place to become the roots." },
      { t: "Foam", d: "Expanding foam fills every gap and turns it into one solid piece." },
      { t: "The skin", d: "Fabric dipped in a stone-grey coating wraps everything like bark." },
      { t: "Carving", d: "Bark lines, knots and buttress roots are shaped by hand." },
      { t: "Lianas", d: "Vines climb between the trunks, ready for the plants to grab." },
      { t: "Planting", d: "Moss walls, bromeliads and begonias. Then the lights, the misting and the first rain." },
    ],
    film: "The finished build, before planting",
  },
  ar: {
    kicker: "من الصفر",
    title: "من صندوق زجاج لغابة مطيرة.",
    lede: "كل فيفاريوم بنبنيه من الصفر عشان المكان اللي رح يعيش فيه. هاد واحد من شغلنا، خطوة بخطوة.",
    steps: [
      { t: "الهيكل", d: "مواسير وألواح فوم بترسم الجذوع وشكل الأرض." },
      { t: "الجذور", d: "خراطيم مرنة بنثنيها بمكانها عشان تصير جذور." },
      { t: "الرغوة", d: "رغوة بتتمدد وبتعبّي كل الفراغات، فبيصير الهيكل قطعة وحدة." },
      { t: "اللحاء", d: "قماش مغموس بخلطة رمادية بيلفّ كل إشي وبيعطيه شكل اللحاء." },
      { t: "النحت", d: "خطوط اللحاء والعقد والجذور العريضة بنشكّلها بإيدينا." },
      { t: "الليانا", d: "حبال بتتسلق بين الجذوع، جاهزة تمسك فيها النباتات." },
      { t: "الزراعة", d: "جدار طحالب وبروميليا وبيغونيا، وبعدها الضو والرذاذ وأول مطرة." },
    ],
    film: "الهيكل جاهز، قبل الزراعة",
  },
};

const IMG = ["01-frame", "02-roots", "03-foam", "04-skin", "05-sculpt", "06-vines", "07-plant"];

/* The build process for made-to-order vivariums, from the studio's own photos. Scrolls sideways on every screen. */
export default function VivariumBuild({ lang, bare = false }: { lang: Lang; bare?: boolean }) {
  const t = COPY[lang];
  return (
    <section className={bare ? "mt-20 text-ink" : "bg-white px-5 py-20 text-ink sm:px-10 lg:py-24"}>
      <div className="mx-auto max-w-7xl">
        <p className="kicker">{t.kicker}</p>
        <h2 className="display mt-3 text-[clamp(1.9rem,3.6vw,2.8rem)]">{t.title}</h2>
        <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-ink/65">{t.lede}</p>
        <ol className="-mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:thin] sm:-mx-10 sm:px-10 lg:mx-0 lg:px-0">
          {t.steps.map((s, i) => (
            <li key={s.t} className="w-[68vw] max-w-[260px] shrink-0 snap-start">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-sand">
                <Image src={`/media/build/${IMG[i]}.jpg`} alt={s.t} fill sizes="260px" className="object-cover" />
                <span className="absolute start-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-xs tabular-nums">{num(i + 1, lang)}</span>
              </div>
              <h3 className="mt-3 font-medium">{s.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/65">{s.d}</p>
            </li>
          ))}
          <li className="w-[68vw] max-w-[260px] shrink-0 snap-start">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-ink">
              <video className="absolute inset-0 h-full w-full object-cover" poster="/media/build/new-project.jpg" autoPlay muted loop playsInline preload="metadata" aria-label={t.film}>
                <source src="/media/build/new-project.mp4" type="video/mp4" />
              </video>
            </div>
            <p className="mt-3 text-sm text-ink/65">{t.film}</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
