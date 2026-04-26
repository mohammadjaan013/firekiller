import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import CategoriesSection from "@/components/home/CategoriesSection";
import HowItWorks from "@/components/home/HowItWorks";
import WhyFireKiller from "@/components/home/WhyFireKiller";
import VideoShowcase from "@/components/home/VideoShowcase";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ExpertArticles from "@/components/home/ExpertArticles";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoriesSection />
      <HowItWorks />
      <WhyFireKiller />
      <VideoShowcase />
      <TestimonialsSection />
      <ExpertArticles />
    </>
  );
}
