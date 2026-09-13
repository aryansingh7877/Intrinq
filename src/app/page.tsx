import Hero from "@/components/Hero";
import MarqueeSection from "@/components/MarqueeSection";
import ModernBusinessSection from "@/components/ModernBusinessSection";
import DifferenceSection from "@/components/DifferenceSection";
import ServicesSection from "@/components/ServicesSection";
import AiVsHumanSection from "@/components/AiVsHumanSection";
import WhoWeWorkWithSection from "@/components/WhoWeWorkWithSection";
import OurProcessSection from "@/components/OurProcessSection";
import PrinciplesSection from "@/components/PrinciplesSection";
import BlogSection from "@/components/BlogSection";
import PrecisionStatisticsSection from "@/components/PrecisionStatisticsSection";
import DecisionCtaSection from "@/components/DecisionCtaSection";
import TypographicFooter from "@/components/TypographicFooter";
import MorphingNavbar from "@/components/MorphingNavbar";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-[#060B11] text-[#F7F4EE]">
      {/* Morphing Navigation System (Hero Floating Dock <-> Editorial Top Header) */}
      <MorphingNavbar />

      {/* 1. Cinematic Hero Section */}
      <Hero />

      {/* 2. Experimental Digital HUD Marquee Section */}
      <MarqueeSection />

      {/* 3. The Modern Business Editorial Section */}
      <ModernBusinessSection />

      {/* 4. The IntrinsQ Difference / Five-Step Process Section */}
      <DifferenceSection />

      {/* 5. Comprehensive Integrated Advisory Services Section */}
      <ServicesSection />

      {/* 6. A Process Built on Judgment: AI Speed vs Human Conviction Section */}
      <AiVsHumanSection />

      {/* 7. Who We Work With: Editorial Audience Architecture Section */}
      <WhoWeWorkWithSection />

      {/* 8. Our Process: A Cinematic Advisory Journey Section */}
      <OurProcessSection />

      {/* 9. The IntrinsQ Principles: Interactive Mechanical Dial Section */}
      <PrinciplesSection />

      {/* 10. Our Blog: Premium Editorial Journal Section */}
      <BlogSection />

      {/* 11. Precision Statistics Experience Section */}
      <PrecisionStatisticsSection />

      {/* 12. Final CTA: The Decision ("Begin the Conversation") Section */}
      <DecisionCtaSection />

      {/* 13. Typographic Ending Experience: Minimal Oversized Footer */}
      <TypographicFooter />
    </div>
  );
}
