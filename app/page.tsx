import Hero from "./_components/Hero";
import ProblemSection from "./_components/ProblemSection";
import VisionSection from "./_components/VisionSection";
import CoreCapabilities from "./_components/CoreCapabilities";
import PagexSection from "./_components/PagexSection";
import GetInvolvedSection from "./_components/GetInvolvedSection";
import { FadeIn } from "@/components/FadeIn";

export default function Home() {
  return (
    <main>
      <div className="relative">
        <Hero />
        <div className="relative z-10 -mt-6 rounded-t-3xl bg-background">
          <FadeIn as="div">
            <ProblemSection />
          </FadeIn>
          <FadeIn as="div">
            <VisionSection />
          </FadeIn>
          <FadeIn as="div">
            <CoreCapabilities />
          </FadeIn>
          <FadeIn as="div">
            <PagexSection />
          </FadeIn>
          <FadeIn as="div">
            <GetInvolvedSection />
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
