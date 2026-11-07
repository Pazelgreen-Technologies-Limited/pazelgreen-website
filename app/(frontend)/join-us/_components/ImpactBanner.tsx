import BackgroundSection from "@/components/BackgroundSection";
import Button from "@/components/ui/Button";

export default function ImpactBanner() {
  return (
    <BackgroundSection
      imageSrc="/impact-bg.jpg"
      imageAlt="Close-up of green leaves"
      overlayColor="bg-gradient-to-b from-[#052E16]/0 to-[#14532D]/70"
      height="h-[500px]"
    >
      <h2 className="max-w-xl text-4xl font-bold text-white md:text-3xl">
        Ready to Make an Impact?
      </h2>
      <p className="mt-3 max-w-lg text-sm text-white">
        Get in touch with our team to explore how you can contribute to the
        future of sustainable agriculture.
      </p>
      <div className="mt-6">
        <Button href="/contact" variant="solid">
          Get in touch
        </Button>
      </div>
    </BackgroundSection>
  );
}
