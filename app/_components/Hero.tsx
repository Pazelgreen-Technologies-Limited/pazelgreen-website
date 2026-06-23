import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
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

        <h1 className="max-w-3xl text-4xl font-bold text-white md:text-5xl">
          Innovating the Future of{" "}
          <span className="text-brand">Sustainable</span> Agriculture
        </h1>

        <p className="mt-4 max-w-2xl text-sm text-gray-200 md:text-base">
          Transforming agricultural inefficiencies into opportunities for
          growth, resilience, and sustainable development across emerging
          markets worldwide.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/pagex"
            className="flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Explore PAGEX <ArrowRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            <Phone size={16} /> Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
