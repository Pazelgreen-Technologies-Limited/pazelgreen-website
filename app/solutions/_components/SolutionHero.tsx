import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function SolutionHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/solution-hero-bg.jpg"
        alt="Agricultural technology and innovation"
        fill
        priority
        className="object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Pill label */}
        <span className="mb-6 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-medium tracking-widest text-white uppercase">
          Pazelgreen Innovations
        </span>

        <h1 className="max-w-2xl text-4xl font-bold text-white md:text-5xl">
          Our <span className="text-green-400">Solutions</span>
        </h1>

        <p className="mt-4 max-w-xl text-sm text-gray-300 md:text-base">
          We develop innovative solutions that address critical gaps across
          agricultural systems, enabling sustainable growth, resilience and
          value creation across emerging markets.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/pagex"
            className="flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-medium text-white hover:bg-green-600"
          >
            Explore PAGEX <ArrowRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-full bg-white/10 border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/20"
          >
            <Phone size={16} /> Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
