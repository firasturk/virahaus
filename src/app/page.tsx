import MotionSection from "@/components/motion-section";
import StartAtTop from "@/components/start-at-top";
import GiftSection from "@/components/gift-section";
import HeroBanner from "@/components/hero-banner";
import ShopSection from "@/components/shop-section";
import SiteFooter from "@/components/site-footer";

export default function Home() {
  return (
    <main className="flex-1">
      <StartAtTop />
      <HeroBanner />
      <MotionSection />
      <ShopSection />
      <GiftSection />
      <SiteFooter />
    </main>
  );
}
