import BackgroundSection from "@/components/BackgroundSection";
import Button from "@/components/ui/Button";

export default function SolutionCTA() {
  return (
    <BackgroundSection
      imageSrc="/solution-cta-bg.jpg"
      imageAlt="Agricultural field at golden hour"
      overlayColor="bg-black/50"
      height="h-[360px]"
    >
      {/* CTA content */}
      <h2 className="max-w-xl text-2xl font-bold text-white md:text-3xl">
        Get started today for a better future in agriculture
      </h2>

      {/* CTA buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button href="/get-started" variant="white" className="rounded-full!">
          Get Started
        </Button>
        <Button href="/solution" variant="outline" className="rounded-full!">
          Learn More
        </Button>
      </div>
    </BackgroundSection>
  );
}
