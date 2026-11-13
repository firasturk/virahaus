import type { Lang } from "@/lib/i18n";
import AnnouncementBar from "./announcement-bar";
import CorporateBand from "./corporate-band";
import GiftSection from "./gift-section";
import Reviews from "./reviews";
import HeroBanner from "./hero-banner";
import { AquariumBand, BestsellersSection, CategoriesSection, ContactBand, CustomizeBand, EcosystemSection, FaqSection, HowSection, UspStrip } from "./home-sections";
import SiteFooter from "./site-footer";
import StartAtTop from "./start-at-top";

/*
 * The home page, in the order the strongest gift shops use: promise, reasons to
 * trust, ways in (worlds, ready-to-gift, build your own), why it needs no care,
 * gifting, how buying works, questions, side lines, contact.
 */
export default function HomePage({ lang }: { lang: Lang }) {
  return (
    <main className="flex-1 bg-white">
      <StartAtTop />
      <AnnouncementBar lang={lang} />
      <HeroBanner lang={lang} />
      <UspStrip lang={lang} />
      <CategoriesSection lang={lang} />
      <BestsellersSection lang={lang} />
      <Reviews lang={lang} tone="sand" />
      <CustomizeBand lang={lang} />
      <EcosystemSection lang={lang} />
      <GiftSection lang={lang} />
      <CorporateBand lang={lang} />
      <HowSection lang={lang} />
      <FaqSection lang={lang} />
      <AquariumBand lang={lang} />
      <ContactBand lang={lang} />
      <SiteFooter lang={lang} />
    </main>
  );
}
