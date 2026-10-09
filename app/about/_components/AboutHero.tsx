import Image from "next/image";
import Button from "@/components/ui/Button";
import { CheckCircle2, BookOpen } from "lucide-react";

// Trust badges displayed below the CTA buttons
const trustBadges = ["Innovation-Led", "Systems-Focused", "Global Reach"];

export default function AboutHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden font-sans text-background">
      {/* Background image — replace /about-hero-bg.jpg with the exported Figma asset */}
      <Image
        src="/about-hero-bg.jpg"
        alt="Aerial view of agricultural fields"
        fill
        priority
        className="hero-image-enter object-cover"
      />
      {/* Dark green overlay for text readability, mirrors ContactHero/JoinHero */}
      <div className="absolute inset-0 bg-primary-darker/85" />

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Pill label */}
        <span className="hero-enter hero-enter-1 mb-4 inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-background uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          About Pazelgreen
        </span>

        <h1 className="hero-enter hero-enter-2 max-w-3xl text-4xl font-extrabold leading-tight text-background md:text-5xl lg:text-6xl">
          About Pazelgreen
        </h1>

        <p className="hero-enter hero-enter-3 mt-5 max-w-2xl text-sm text-inverse-foreground/80 md:text-base">
          Pazelgreen is an agritech innovation company creating solutions that
          strengthen agricultural systems, reduce inefficiencies, and drive
          sustainable development across emerging markets.
        </p>

        {/* CTA buttons */}
        <div className="hero-enter hero-enter-4 mt-8 flex flex-col gap-4 sm:flex-row">
          <Button href="/pagex" variant="solid">
            <BookOpen size={16} /> Explore PAGEX
          </Button>
          <Button href="#our-story" variant="outline">
            <CheckCircle2 size={16} /> Our Story
          </Button>
        </div>

        {/* Divider */}
        <div className="hero-enter hero-enter-5 mt-12 w-full max-w-md border-t border-background/15" />

        {/* Trust badges */}
        <ul className="hero-enter hero-enter-6 mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trustBadges.map((label) => (
            <li
              key={label}
              className="flex items-center gap-2 text-xs font-medium text-background md:text-sm"
            >
              <CheckCircle2 size={16} className="text-primary" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
