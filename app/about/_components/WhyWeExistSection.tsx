import AboutImagePlaceholder from "./AboutImagePlaceholder";

const crisisRealities = [
  "Over $4 billion in food lost annually in post-harvest handling across West Africa alone.",
  "70% of the workforce is engaged in agriculture, yet food insecurity continues to escalate.",
  "Fragmented supply chains cause wild price volatility between rural farms and urban centers.",
  "Inadequate infrastructure locks smallholder farmers into subsistence poverty cycles.",
];

export default function WhyWeExistSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Why we exist
        </h2>

        <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: The Problem Image */}
          <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <h3 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl">
              The Problem
            </h3>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl sm:rounded-3xl">
              <AboutImagePlaceholder
                src="/images/about/problem-spoilage.png"
                alt="Agricultural post-harvest losses and food spoilage in crates"
                fill
                label="problem-spoilage.png"
              />
            </div>
          </div>

          {/* Right: Narrative and Key Realities */}
          <div className="flex flex-col justify-center lg:col-span-7 lg:pt-10">
            <h3 className="text-xl font-bold text-[#12AB17] sm:text-2xl">
              A Broken Post-Harvest System in Africa
            </h3>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700 sm:text-base">
              <p>
                Across Sub-Saharan Africa, up to 50% of fresh fruits and
                vegetables spoil before reaching the consumer. This monumental
                loss devastatingly impacts smallholder farmers, who bear the
                cost of lost labor, wasted inputs, and vanished revenue.
              </p>
              <p>
                The root causes are systemic: lack of cold-chain storage,
                unreliable transportation, absent real-time market pricing data,
                and middleman exploitation that drains value away from primary
                producers.
              </p>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <h4 className="text-base font-bold text-gray-900 sm:text-lg">
                Key Realities of the Food Crisis:
              </h4>

              <ul className="mt-4 space-y-3">
                {crisisRealities.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-700 sm:text-base">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#12AB17]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
