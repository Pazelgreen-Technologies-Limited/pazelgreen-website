import type { Metadata } from "next";
import Hero from "./_components/Hero";
import ProblemSection from "./_components/ProblemSection";
import VisionSection from "./_components/VisionSection";
import CoreCapabilities from "./_components/CoreCapabilities";
import PagexSection from "./_components/PagexSection";
import GetInvolvedSection from "./_components/GetInvolvedSection";
import InsightsTeaser from "./_components/InsightsTeaser";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Pazelgreen Technologies | Sustainable Agriculture Systems",
  description:
    "Pazelgreen builds practical solutions that strengthen agricultural systems and support sustainable development across emerging markets.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <FadeIn as="div" duration={450}>
        <ProblemSection />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <CoreCapabilities />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <PagexSection />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <VisionSection />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <InsightsTeaser />
      </FadeIn>
      <FadeIn as="div" duration={450}>
        <GetInvolvedSection />
      </FadeIn>
    </main>
  );
}
