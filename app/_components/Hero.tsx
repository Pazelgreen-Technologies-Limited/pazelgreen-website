import Image from "next/image";
import { Phone } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden font-sans text-white">
      {/* Background image */}
      <Image
        src="/hero-bg.jpg"
        alt="Sustainable agriculture field"
        fill
        priority
        className="object-cover"
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 rounded-full bg-white/20 px-4 py-1 text-xs font-medium tracking-wide text-white">
          PAZELGREEN TECHNOLOGIES
        </span>

        <h1 className="max-w-3xl text-4xl font-bold md:text-5xl">
          Innovating the Future of{" "}
          <span className="text-brand">Sustainable</span> Agriculture
        </h1>

        <p className="mt-4 max-w-2xl text-sm  md:text-base">
          Transforming agricultural inefficiencies into opportunities for
          growth, resilience, and sustainable development across emerging
          markets worldwide.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button href="/pagex" variant="solid" showArrow>
            Explore PAGEX
          </Button>
          <Button href="/contact" variant="white">
            <span className="text-brand">
              <Phone size={16} />
            </span>
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
