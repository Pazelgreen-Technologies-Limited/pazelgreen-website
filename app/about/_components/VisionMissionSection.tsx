export default function VisionMissionSection() {
  return (
    <section className="w-full bg-white pb-16 sm:pb-20 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {/* Card 1: Our Vision */}
          <div className="flex flex-col justify-center rounded-2xl bg-[#9C4D15] p-8 text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 sm:rounded-3xl sm:p-12">
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Our Vision
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-amber-100/90 sm:text-base md:text-lg">
              A thriving, resilient, and technology-driven agricultural ecosystem
              where no food is wasted, farmers are empowered, and sustainable
              agriculture powers economic growth across Africa.
            </p>
          </div>

          {/* Card 2: Our Mission */}
          <div className="flex flex-col justify-center rounded-2xl bg-[#128827] p-8 text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 sm:rounded-3xl sm:p-12">
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Our Mission
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-emerald-100/90 sm:text-base md:text-lg">
              To build the digital infrastructure that connects, optimizes, and
              scales agricultural value chains through cutting-edge technology,
              transparent market access, and sustainable innovation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
