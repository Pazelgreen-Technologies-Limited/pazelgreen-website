import Hero from "./_components/Hero";
import ProblemSection from "./_components/ProblemSection";
import VisionSection from "./_components/VisionSection";
import CoreCapabilities from "./_components/CoreCapabilities";
import PagexSection from "./_components/PagexSection";
import GetInvolvedSection from "./_components/GetInvolvedSection";

export default function Home() {
  return (
    // <main>
    //   <Hero />
    //   <ProblemSection />
    //   <VisionSection />
    //   <CoreCapabilities />
    //   <PagexSection />
    //   <GetInvolvedSection />
    // </main>
    <main>
      <div className="relative">
        <Hero />
        <div className="relative z-10 -mt-6 rounded-t-3xl bg-background">
          <ProblemSection />
          <VisionSection />
          <CoreCapabilities />
          <PagexSection />
          <GetInvolvedSection />
        </div>
      </div>
    </main>
  );
}
