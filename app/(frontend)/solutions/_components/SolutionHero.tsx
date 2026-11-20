import BackgroundSection from "@/components/BackgroundSection";
import Button from "@/components/ui/Button";
import { PhoneIcon } from "lucide-react";

export default function SolutionHero() {
  return (
    <BackgroundSection
      imageSrc="/solution-hero-bg.jpg"
      imageAlt="Agricultural technology and innovation"
      overlayColor="bg-black/55"
      height="h-screen"
    >
      <span className="mb-6 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-medium tracking-widest text-white uppercase">
        Pazelgreen Innovations
      </span>

      <h1 className="max-w-2xl text-4xl font-bold text-white md:text-5xl">
        Our <span className="text-brand">Solutions</span>
      </h1>

      <p className="mt-4 max-w-xl text-sm text-gray-300 md:text-base">
        We develop innovative solutions that address critical gaps across
        agricultural systems, enabling sustainable growth, resilience and value
        creation across emerging markets.
      </p>

      {/* CTA buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button href="/pagex" variant="solid" showArrow>
          Explore PAGEX
        </Button>
        <Button href="/contact" variant="white">
          <PhoneIcon size={16} className="text-brand" /> Contact Us
        </Button>
      </div>
    </BackgroundSection>
  );
}
