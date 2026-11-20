import Image from "next/image";
import Link from "next/link";

export default function GetInvolvedSection() {
  return (
    <section className="relative h-[400px] w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/get-involved-bg.jpg"
        alt="Greenhouse agriculture technology"
        fill
        className="object-cover"
      />
      {/* Dark green overlay for text readability */}
      <div className="absolute inset-0 bg-green-950/60" />

      {/* Section content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 rounded-full bg-white/20 px-4 py-1 text-xs font-medium tracking-wide text-white">
          Get Involved
        </span>
        <h2 className="max-w-2xl text-2xl font-bold text-white md:text-3xl">
          Building the future of agricultural systems requires collaboration.
        </h2>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/join-us"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            Join Us
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
