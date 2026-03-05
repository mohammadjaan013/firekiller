import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import ProblemStats from "@/components/home/ProblemStats";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowItWorks from "@/components/home/HowItWorks";
import SocialProof from "@/components/home/SocialProof";
import ClientsSection from "@/components/home/ClientsSection";
import CTABanner from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ProblemStats />
      <CategoriesSection />
      <FeaturedProducts />
      <HowItWorks />
      <SocialProof />
      <ClientsSection />
      <CTABanner />
    </>
  );
}
