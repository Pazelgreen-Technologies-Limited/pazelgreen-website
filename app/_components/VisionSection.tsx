import Image from "next/image";

export default function VisionSection() {
  return (
    <section className="relative h-[450px] w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/vision-bg.jpg"
        alt="Sunrise over agricultural field"
        fill
        className="object-cover"
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Vision content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 rounded-full bg-white/20 px-4 py-1 text-xs font-medium tracking-wide text-white">
          Our Vision
        </span>
        <div className="mb-4 h-px w-12 bg-white/60" />
        <p className="max-w-3xl text-lg font-medium text-white md:text-2xl">
          &quot;To become a global leader in developing innovative solutions
          that drive sustainable agricultural transformation and resilient food
          systems across emerging markets.&quot;
        </p>
        <div className="mt-4 h-px w-12 bg-white/60" />
      </div>
    </section>
  );
}
