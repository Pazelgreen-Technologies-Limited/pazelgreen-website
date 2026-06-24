import Image from "next/image";
import Link from "next/link";

export default function SolutionCTA() {
  return (
    <section className="relative h-[360px] w-full overflow-hidden">
      {/* Background image — reuse get-involved-bg or swap with solution-cta-bg.jpg */}
      <Image
        src="/solution-cta-bg.jpg"
        alt="Agricultural field at golden hour"
        fill
        className="object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* CTA content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h2 className="max-w-xl text-2xl font-bold text-white md:text-3xl">
          Get started today for a better future in agriculture
        </h2>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/get-started"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            Get Started
          </Link>
          <Link
            href="/solution"
            className="rounded-full border border-white px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
