import AboutImagePlaceholder from "./AboutImagePlaceholder";

const sdgs = [
  { id: 1, name: "SDG 1: No Poverty", file: "sdg-1.png" },
  { id: 2, name: "SDG 2: Zero Hunger", file: "sdg-2.png" },
  { id: 3, name: "SDG 3: Good Health", file: "sdg-3.png" },
  { id: 5, name: "SDG 5: Gender Equality", file: "sdg-5.png" },
  { id: 7, name: "SDG 7: Clean Energy", file: "sdg-6.png" },
  { id: 8, name: "SDG 8: Decent Work", file: "sdg-7.png" },
  { id: 9, name: "SDG 9: Industry & Innovation", file: "sdg-8.png" },
  { id: 10, name: "SDG 10: Reduced Inequalities", file: "sdg-9.png" },
  { id: 12, name: "SDG 12: Responsible Consumption", file: "sdg-12.png" },
  { id: 13, name: "SDG 13: Climate Action", file: "sdg-13.png" },
  { id: 14, name: "SDG 14: Life Below Water", file: "sdg-15.png" },
  { id: 17, name: "SDG 17: Partnerships", file: "sdg-17.png" },
];

export default function SdgsTargetedSection() {
  return (
    <section className="w-full bg-[#E2EEDC] py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            SDGs Targeted
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            Our initiatives directly align with and accelerate 12 of the United
            Nations Sustainable Development Goals.
          </p>
        </div>

        {/* 12 SDG Images Grid (6 columns desktop, 4 tablet, 3-2 mobile) */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-5">
          {sdgs.map((sdg) => (
            <div
              key={sdg.id}
              className="group relative aspect-square w-full overflow-hidden rounded-xl border border-stone-300/60 bg-white/70 shadow-xs transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-md sm:rounded-2xl"
            >
              <AboutImagePlaceholder
                src={`/images/about/${sdg.file}`}
                alt={sdg.name}
                fill
                label={sdg.file}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
