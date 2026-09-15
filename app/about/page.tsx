import type { Metadata } from "next";
import AboutHero from "./_components/AboutHero";
import FoundersMessage from "./_components/FoundersMessage";
import VisionMissionSection from "./_components/VisionMissionSection";
import AimsSection from "./_components/AimsSection";
import ObjectivesSection from "./_components/ObjectivesSection";
import CoreValuesSection from "./_components/CoreValuesSection";
import WorkWithUsBanner from "./_components/WorkWithUsBanner";
import WhyWeExistSection from "./_components/WhyWeExistSection";
import NegativeImpactsSection from "./_components/NegativeImpactsSection";
import SdgsTargetedSection from "./_components/SdgsTargetedSection";
import SolutionSection from "./_components/SolutionSection";
import JoinWaitlistCard from "./_components/JoinWaitlistCard";
import WhyNowSection from "./_components/WhyNowSection";
import AboutBottomCta from "./_components/AboutBottomCta";

export const metadata: Metadata = {
  title: "About Us | Pazelgreen Technologies",
  description:
    "Building the digital infrastructure for the future of agriculture in Africa and beyond.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutHero />
      <FoundersMessage />
      <VisionMissionSection />
      <AimsSection />
      <ObjectivesSection />
      <CoreValuesSection />
      <WorkWithUsBanner />
      <WhyWeExistSection />
      <NegativeImpactsSection />
      <SdgsTargetedSection />
      <SolutionSection />
      <JoinWaitlistCard />
      <WhyNowSection />
      <AboutBottomCta />
    </main>
  );
}
