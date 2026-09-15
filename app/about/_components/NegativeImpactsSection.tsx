const impacts = [
  {
    category: "Economic Drain",
    points: [
      "Lost farmer income & revenue",
      "Crippled rural economies",
      "Discouraged agricultural investment",
      "High import dependency for staples",
    ],
  },
  {
    category: "Environmental Toll",
    points: [
      "Wasted freshwater & fertilizers",
      "Massive methane emissions from landfills",
      "Deforestation for unconsumed crops",
      "Soil degradation",
    ],
  },
  {
    category: "Food Insecurity",
    points: [
      "Escalating urban food prices",
      "Chronic nutritional deficits",
      "Heightened vulnerability to shocks",
      "Severe rural malnutrition",
    ],
  },
  {
    category: "Social Inequality",
    points: [
      "Youth rural-to-urban flight",
      "Disproportionate impact on women farmers",
      "Entrenched poverty traps",
      "Deteriorating community resilience",
    ],
  },
];

export default function NegativeImpactsSection() {
  return (
    <section className="w-full bg-[#F5F2EB] py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Negative Impacts
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {impacts.map((col, index) => (
            <div
              key={index}
              className="rounded-2xl border border-stone-200/70 bg-white/80 p-6 shadow-xs transition-all duration-200 hover:bg-white hover:shadow-md sm:p-7"
            >
              <h3 className="text-lg font-bold text-[#12AB17] sm:text-xl">
                {col.category}
              </h3>

              <ul className="mt-5 space-y-3 text-sm text-gray-700">
                {col.points.map((point, pIndex) => (
                  <li key={pIndex} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
