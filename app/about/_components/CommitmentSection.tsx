import Image from "next/image";
import Button from "@/components/ui/Button";
import { BookOpen, Mail } from "lucide-react";

export default function CommitmentSection() {
  return (
    <section className="relative h-[420px] w-full overflow-hidden md:h-[500px] font-sans text-background">
      {/* Background image — replace /about-commitment-bg.png with the exported Figma asset */}
      <Image
        src="/about-commitment-bg.png"
        alt="Hands holding a sprout representing agricultural sustainability"
        fill
        className="object-cover"
      />
      {/* Dark green overlay for text readability */}
      <div className="absolute inset-0 bg-green-950/75" />

      {/* Section content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 py-1.5 text-xs font-bold tracking-widest text-background uppercase">
          <span>🌱</span> Our Commitment
        </p>
        <h2 className="max-w-3xl text-3xl font-extrabold text-background md:text-4xl lg:text-5xl">
          Shaping a more connected and resilient agricultural future.
        </h2>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button href="/pagex" variant="solid">
            <BookOpen size={16} /> Explore PAGEX
          </Button>
          <Button href="/contact" variant="outline">
            <Mail size={16} /> Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
