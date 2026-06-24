import { Network, TrendingUp, Leaf } from "lucide-react";

// Three pillars of the connected ecosystem
const pillars = [
  {
    icon: Network,
    title: "System Integration",
    description:
      "Connecting disparate parts of the agricultural value chain into a cohesive, efficient network.",
  },
  {
    icon: TrendingUp,
    title: "Value Creation",
    description:
      "Unlocking new opportunities and improving profitability for all stakeholders through data-driven insights.",
  },
  {
    icon: Leaf,
    title: "Sustainable Growth",
    description:
      "Fostering resilient agricultural practices that ensure long-term viability and environmental stewardship.",
  },
];

export default function EcosystemSection() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Building a Connected Agricultural Innovation Ecosystem
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-600">
            Pazelgreen focuses on integrated solutions that strengthen
            coordination, efficiency, and value creation across agricultural
            systems.
          </p>
        </div>

        {/* Pillar cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              {/* Icon with light green background */}
              <div className="mb-4 inline-flex rounded-xl bg-green-50 p-3">
                <Icon size={24} className="text-green-600" />
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
