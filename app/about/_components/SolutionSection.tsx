import AboutImagePlaceholder from "./AboutImagePlaceholder";

export default function SolutionSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          The Solution
        </h2>

        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: Farmer with Laptop */}
          <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-xl sm:rounded-3xl">
              <AboutImagePlaceholder
                src="/images/about/solution-farmer.png"
                alt="AgTech adoption: woman farmer utilizing laptop technology in field"
                fill
                label="solution-farmer.png"
              />
            </div>
          </div>

          {/* Right: The Solution Narrative */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
              End-to-End AgTech Infrastructure
            </h3>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700 sm:text-base">
              <p>
                Pazelgreen bridges the critical gaps between agricultural supply
                and demand through PAGEX — our integrated digital marketplace and
                supply chain platform.
              </p>
              <p>
                By combining real-time market data, transparent pricing
                mechanisms, route-optimized logistics, and cooperative
                aggregation hubs, we eliminate the points of friction where
                food and capital are lost.
              </p>
              <p>
                We empower farmers with instant market access and guaranteed
                off-take, while providing commercial buyers with consistent,
                quality-verified agricultural commodities with full traceability
                from farm to fork.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
