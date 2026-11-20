import BackgroundSection from "@/components/BackgroundSection";
import Button from "@/components/ui/Button";
import { Phone } from "lucide-react";

export default function JoinHero() {
  return (
    <BackgroundSection
      imageSrc="/join-hero-bg.jpg"
      imageAlt="People working in a greenhouse"
      overlayColor="bg-[#041A08]/60"
      height="h-screen"
    >
      <h1 className="max-w-3xl text-4xl font-bold text-white md:text-5xl">
        Join the Pazelgreen <span className="text-brand">Ecosystem</span>
      </h1>

      <p className="mt-4 max-w-xl text-sm text-white md:text-base">
        Become part of the ecosystem shaping agricultural innovation. We&apos;re
        building the future of sustainable farming, and we need you.
      </p>

      {/* CTA buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button href="/contact" variant="white">
          <Phone size={16} /> Contact Us
        </Button>
        <Button href="/join-us/signup" variant="solid" showArrow>
          Sign up now
        </Button>
      </div>
    </BackgroundSection>
  );
}
