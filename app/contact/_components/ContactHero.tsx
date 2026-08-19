import BackgroundSection from "@/components/BackgroundSection";
import Button from "@/components/ui/Button";
import { Send } from "lucide-react";

export default function ContactHero() {
  return (
    <BackgroundSection
      imageSrc="/contact-hero-bg.jpg"
      imageAlt="Greenhouse interior"
      overlayColor="bg-[#06260FE0]"
      height="h-screen"
    >
      {/* Pill label with decorative lines */}
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px w-8 bg-green-400" />
        <span className="text-xs font-semibold tracking-widest text-green-400 uppercase">
          Pazelgreen Technologies
        </span>
        <span className="h-px w-8 bg-green-400" />
      </div>

      <h1 className="max-w-2xl text-4xl font-bold text-white md:text-5xl">
        Contact <span className="text-green-400">Pazelgreen</span>
      </h1>

      <p className="mt-4 max-w-lg text-sm text-gray-300 md:text-base">
        Have a question, partnership idea, product inquiry, or collaboration
        opportunity? We&apos;d love to hear from you.
      </p>

      {/* CTA buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button href="#contact-form" variant="solid">
          <Send size={15} /> Send a Message
        </Button>
        <Button href="/pagex" variant="ghost" showArrow>
          Explore PAGEX
        </Button>
      </div>
    </BackgroundSection>
  );
}
