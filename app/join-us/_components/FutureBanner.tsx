import BackgroundSection from "@/components/BackgroundSection";
import Button from "@/components/ui/Button";

export default function FutureBanner() {
  return (
    <BackgroundSection
      imageSrc="/future-bg.jpg"
      imageAlt="Drone flying over agricultural field with a humanoid robot"
      overlayColor="bg-gradient-to-b from-[#052E16]/10 to-[#14532D]/90"
      height="h-[500px]"
    >
      <h2 className="max-w-xl text-4xl font-bold text-white md:text-3xl">
        Let&apos;s Build the Future Together
      </h2>
      <p className="mt-3 max-w-lg text-sm text-white">
        Reach out to discuss your interests, ask questions, or propose new
        opportunities. We&apos;d love to hear from you.
      </p>

      {/* Two CTA buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button href="/join-us/careers" variant="white">
          Career Inquiries
        </Button>
        <Button href="/join-us/partnerships" variant="solid">
          Partnership Inquiries
        </Button>
      </div>
    </BackgroundSection>
  );
}
