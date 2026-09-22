import Image from "next/image";
import Button from "@/components/ui/Button";
import { CheckCircle2, BookOpen } from "lucide-react";

// Trust badges displayed below the CTA buttons
const trustBadges = ["Innovation-Led", "Systems-Focused", "Global Reach"];

export default function AboutHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden font-sans text-white">
      {/* Background image — replace /about-hero-bg.jpg with the exported Figma asset */}
      <Image
        src="/about-hero-bg.jpg"
        alt="Aerial view of agricultural fields"
        fill
        priority
        className="object-cover"
      />
      {/* Dark green overlay for text readability, mirrors ContactHero/JoinHero */}
      <div className="absolute inset-0 bg-green-950/85" />

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Pill label */}
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          About Pazelgreen
        </span>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
          About Pazelgreen
        </h1>

        <p className="mt-5 max-w-2xl text-sm text-gray-200 md:text-base">
          Pazelgreen is an agritech innovation company creating solutions that
          strengthen agricultural systems, reduce inefficiencies, and drive
          sustainable development across emerging markets.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button href="/pagex" variant="solid">
            <BookOpen size={16} /> Explore PAGEX
          </Button>
          <Button href="#our-story" variant="outline">
            <CheckCircle2 size={16} /> Our Story
          </Button>
        </div>

        {/* Divider */}
        <div className="mt-12 w-full max-w-md border-t border-white/15" />

        {/* Trust badges */}
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trustBadges.map((label) => (
            <li
              key={label}
              className="flex items-center gap-2 text-xs font-medium text-white md:text-sm"
            >
              <CheckCircle2 size={16} className="text-brand" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
