import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import CategoriesSection from "@/components/home/CategoriesSection";
import HowItWorks from "@/components/home/HowItWorks";
import WhyFireKiller from "@/components/home/WhyFireKiller";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoriesSection />
      <HowItWorks />
      <WhyFireKiller />
    </>
  );
}
