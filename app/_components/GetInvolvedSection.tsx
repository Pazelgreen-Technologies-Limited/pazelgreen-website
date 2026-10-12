import Image from "next/image";
import Link from "next/link";

export default function GetInvolvedSection() {
  return (
    <section className="relative h-100 w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/get-involved-bg.jpg"
        alt="Greenhouse agriculture technology"
        fill
        className="object-cover"
      />
      {/* Dark green overlay for text readability */}
      <div className="absolute inset-0 bg-primary-darker/75" />

      {/* Section content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-xs font-bold uppercase tracking-wider text-background/80">
          Get Involved
        </span>
        <h2 className="max-w-3xl text-3xl font-bold text-background md:text-4xl">
          Building the future of agricultural systems requires collaboration.
        </h2>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/join-us"
            className="rounded-lg bg-background px-6 py-3 text-sm font-semibold text-primary-darker transition-transform duration-200 hover:-translate-y-0.5 hover:bg-background-alt"
          >
            Join Us
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-background px-6 py-3 text-sm font-semibold text-background transition-all duration-200 hover:-translate-y-0.5 hover:bg-background/10"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
