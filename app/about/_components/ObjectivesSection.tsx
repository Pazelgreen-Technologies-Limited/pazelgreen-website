import { Check } from "lucide-react";
import AboutImagePlaceholder from "./AboutImagePlaceholder";

const objectives = [
  {
    title: "Scale the PAGEX platform to connect over 100,000 farmers by 2027",
    description:
      "Accelerating onboarding through community agents, cooperatives, and strategic partnerships.",
  },
  {
    title: "Reduce regional post-harvest losses by up to 35% in partner regions",
    description:
      "Leveraging cold-chain monitoring, rapid logistics routing, and predictive demand scheduling.",
  },
  {
    title: "Facilitate $50M+ in transparent, traceable agricultural transactions",
    description:
      "Ensuring end-to-end provenance, digitized payments, and fair trade validation.",
  },
  {
    title: "Establish cross-border trade corridors across West and East Africa",
    description:
      "Unlocking inter-regional agricultural trade through harmonized standards and digital border compliance.",
  },
];

export default function ObjectivesSection() {
  return (
    <section className="w-full bg-[#F5F2EB] py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: Objectives list */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Objectives
            </h2>

            <div className="mt-8 space-y-6">
              {objectives.map((obj, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-2xl border border-stone-200/60 bg-white/80 p-5 shadow-xs transition-all duration-200 hover:bg-white hover:shadow-md sm:p-6"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#12AB17] text-white shadow-xs">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                      {obj.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {obj.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Farmer inspecting seedlings */}
          <div className="order-1 mx-auto w-full max-w-md lg:order-2 lg:col-span-5 lg:max-w-none">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-xl sm:rounded-3xl">
              <AboutImagePlaceholder
                src="/images/about/objectives-farmer.png"
                alt="Farmer in hat examining crop seedlings in agricultural field"
                fill
                label="objectives-farmer.png"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
