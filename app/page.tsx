import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import ProjectsSection from "@/components/ProjectsSection";
import LogoTicker from "@/components/LogoTicker";
import RevealSection from "@/components/RevealSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FinalCTA from "@/components/FinalCTA";
import FAQSection from "@/components/FAQSection";
import CorporateFooter from "@/components/CorporateFooter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans">
      <main className="flex-grow">
        <HeroSection />
        <ProjectsSection />
        <LogoTicker />
        <RevealSection />
        <ServicesSection />
        <PricingSection />
        <TestimonialsSection />
        <FinalCTA />
        <FAQSection />
        <CorporateFooter />
      </main>
    </div>
  );
}
