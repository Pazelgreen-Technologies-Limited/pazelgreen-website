import AboutHero from "./_components/AboutHero";
import WhoWeAreSection from "./_components/WhoWeAreSection";
import OurStorySection from "./_components/OurStorySection";
import FounderPerspective from "./_components/FounderPerspective";
import MissionVisionSection from "./_components/MissionVisionSection";
import CoreValuesSection from "./_components/CoreValuesSection";
import WhyWeExistSection from "./_components/WhyWeExistSection";
import OurApproachSection from "./_components/OurApproachSection";
import WhatWeBuildSection from "./_components/WhatWeBuildSection";
import PagexSection from "./_components/PagexSection";
import CommitmentSection from "./_components/CommitmentSection";
import { FadeIn } from "@/components/FadeIn";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <FadeIn as="div" duration={450}>
        <WhoWeAreSection />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <OurStorySection />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <FounderPerspective />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <MissionVisionSection />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <CoreValuesSection />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <WhyWeExistSection />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <OurApproachSection />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <WhatWeBuildSection />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <PagexSection />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <CommitmentSection />
      </FadeIn>
    </main>
  );
}
