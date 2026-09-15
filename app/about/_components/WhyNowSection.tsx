import { ArrowUpRight } from "lucide-react";

const macroDrivers = [
  {
    title: "Rapid Digital & Mobile Penetration",
    description:
      "Over 80% of smallholders now have access to mobile connectivity, creating an unprecedented window to deploy digital solutions at planetary scale.",
  },
  {
    title: "AfCFTA Trade Integration",
    description:
      "The African Continental Free Trade Area has unlocked the world's largest single free trade market, removing barriers for cross-border food trade and value addition.",
  },
  {
    title: "Urgent Climate & Food Security Demands",
    description:
      "Accelerating climate instability demands immediate, climate-smart logistical efficiency to protect harvest yields and ensure food system sovereignty.",
  },
];

export default function WhyNowSection() {
  return (
    <section className="w-full bg-[#F5F2EB] py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why now?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-700 sm:text-base md:text-lg">
            Africa stands at an unprecedented inflection point. With 60% of the
            world&apos;s uncultivated arable land, the continent holds the key to
            global food security in the 21st century — yet it currently imports
            tens of billions of dollars in food annually.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {macroDrivers.map((driver, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-2xl border border-stone-200/70 bg-white/90 p-5 shadow-xs transition-all duration-200 hover:bg-white hover:shadow-md sm:p-6"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#12AB17] text-white shadow-xs">
                <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                  {driver.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600 sm:text-base">
                  {driver.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
