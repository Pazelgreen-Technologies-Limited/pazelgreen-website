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
      <FadeIn as="div">
        <WhoWeAreSection />
      </FadeIn>
      <FadeIn as="div">
        <OurStorySection />
      </FadeIn>
      <FadeIn as="div">
        <FounderPerspective />
      </FadeIn>
      <FadeIn as="div">
        <MissionVisionSection />
      </FadeIn>
      <FadeIn as="div">
        <CoreValuesSection />
      </FadeIn>
      <FadeIn as="div">
        <WhyWeExistSection />
      </FadeIn>
      <FadeIn as="div">
        <OurApproachSection />
      </FadeIn>
      <FadeIn as="div">
        <WhatWeBuildSection />
      </FadeIn>
      <FadeIn as="div">
        <PagexSection />
      </FadeIn>
      <FadeIn as="div">
        <CommitmentSection />
      </FadeIn>
    </main>
  );
}
