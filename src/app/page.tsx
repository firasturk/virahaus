import AquariumBand from "@/components/aquarium-band";
import CollectionsSection from "@/components/collections-section";
import ContactBand from "@/components/contact-band";
import EcosystemSection from "@/components/ecosystem-section";
import GiftSection from "@/components/gift-section";
import HeroBanner from "@/components/hero-banner";
import HowToOrder from "@/components/how-to-order";
import ShopSection from "@/components/shop-section";
import SiteFooter from "@/components/site-footer";
import StartAtTop from "@/components/start-at-top";

export default function Home() {
  return (
    <main className="flex-1">
      <StartAtTop />
      <HeroBanner />
      <CollectionsSection />
      <EcosystemSection />
      <ShopSection />
      <HowToOrder />
      <GiftSection />
      <AquariumBand />
      <ContactBand />
      <SiteFooter />
    </main>
  );
}
