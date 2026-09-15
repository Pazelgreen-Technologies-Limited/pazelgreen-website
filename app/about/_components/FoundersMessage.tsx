import AboutImagePlaceholder from "./AboutImagePlaceholder";

export default function FoundersMessage() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: Founder's Portrait */}
          <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl sm:rounded-3xl">
              <AboutImagePlaceholder
                src="/images/about/founder.png"
                alt="Oluwadamilola Olowoseunre Roseline, Founder & CEO of Pazelgreen Technologies"
                fill
                label="founder.png"
              />
            </div>
          </div>

          {/* Right: Founder's Message Content */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Founder&apos;s Message
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700 sm:text-base">
              <p>
                At Pazelgreen, we are committed to designing innovative and sustainable solutions that
                tackle the critical challenges faced by players in Nigeria's agri-food supply chain.{" "}
                <span className="font-medium text-gray-900">
                  Our focus is on addressing issues that hinder agricultural development,
                  with a particular emphasis on mitigating food and agro-waste problems.
                </span>
              </p>
              <p>
                By providing solutions that enhance business sustainability and profitability for stakeholders,
                we aim to drive growth across the sector. In doing so,
                we contribute to the overall socio-economic development of the country,
                while fostering long-term resilience and progress within the agricultural landscape.
              </p>
              <p>
                For us: &quot;Solutions are not just products but a movement towards achieving
                a robust and low-waste economy in Africa&quot;
              </p>
            </div>

            {/* Founder Sign-off */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="text-base font-bold text-gray-900">Oluwadamilola Olowoseunre Roseline</p>
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Founder &amp; CEO, Pazelgreen Technologies
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
