import Image from "next/image";
import { Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import { FadeIn } from "@/components/FadeIn";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden font-sans text-background">
      {/* Background image */}
      <Image
        src="/hero-bg.jpg"
        alt="Sustainable agriculture field"
        fill
        priority
        className="object-cover"
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-primary-darker/70" />

      {/* Hero content */}
      <FadeIn
        as="div"
        duration={450}
        className="relative z-10 mx-auto flex h-full w-full max-w-[1200px] flex-col items-start justify-center px-6 text-left"
      >
        <span className="mb-4 text-xs font-bold uppercase tracking-wider text-background/80">
          PAZELGREEN TECHNOLOGIES
        </span>

        <h1 className="max-w-4xl text-4xl font-extrabold sm:text-5xl lg:text-6xl">
          Innovating the future of sustainable agriculture.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/90 md:text-lg">
          Transforming agricultural inefficiencies into opportunities for
          growth, resilience, and sustainable development across emerging
          markets worldwide.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button href="/solutions" variant="solid" showArrow>
            Explore our solutions
          </Button>
          <Button href="/contact" variant="white">
            <span className="text-primary">
              <Phone size={16} />
            </span>
            Contact Us
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}
