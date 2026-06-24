import { Store, Link2, Boxes } from "lucide-react";

// The three problems PAGEX addresses
const problems = [
  {
    icon: Store,
    title: "Fragmented Markets",
    description:
      "Bridging the gaps between isolated agricultural sectors to create a unified, accessible marketplace for all participants.",
  },
  {
    icon: Link2,
    title: "Limited Coordination",
    description:
      "Providing the digital infrastructure needed to align efforts, share vital information, and streamline operations across the supply chain.",
  },
  {
    icon: Boxes,
    title: "Underutilized Resources",
    description:
      "Maximizing the potential of agricultural assets through intelligent allocation, reducing waste, and improving overall yield efficiency.",
  },
];

export default function WhyItMatters() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Why This Matters
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600">
            Agricultural systems face persistent inefficiencies including
            fragmented markets, limited coordination, and underutilized
            resources. PAGEX addresses these gaps by enabling structured
            interaction and data-driven coordination.
          </p>
        </div>

        {/* Problem cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {problems.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl bg-gray-50 p-6 transition-colors hover:bg-green-50"
            >
              {/* Icon badge */}
              <div className="mb-4 inline-flex rounded-xl bg-white p-3 shadow-sm">
                <Icon size={22} className="text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
