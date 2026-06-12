import Link from "next/link";
import {
  LayoutGrid,
  Recycle,
  Users,
  LineChart,
  ArrowRight,
} from "lucide-react";

// Core capability cards
const capabilities = [
  {
    icon: LayoutGrid,
    title: "Digital Platforms & Market Coordination",
    description:
      "Developing digital platforms that connect stakeholders, improve transparency, and enhance coordination across agricultural value chains.",
  },
  {
    icon: Recycle,
    title: "Waste Reduction & Resource Optimization",
    description:
      "Designing solutions that transform food and agro-waste into economic, environmental, and social value.",
  },
  {
    icon: Users,
    title: "Capacity Building & Ecosystem Development",
    description:
      "Supporting farmers, cooperatives, and agribusinesses through training, coordination, and ecosystem-driven innovation.",
  },
  {
    icon: LineChart,
    title: "Data & Intelligence for Agriculture",
    description:
      "Leveraging data and intelligent systems to improve decision-making, strengthen resilience, and enhance agri-food systems.",
  },
];

export default function CoreCapabilities() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl rounded-2xl bg-gray-50 p-8 shadow-sm md:p-12">
        {/* Section heading */}
        <div className="text-center">
          <h3 className="text-sm font-semibold tracking-wide text-orange-500">
            What We Do
          </h3>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
            Core Capabilities
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
            We build innovative solutions that address critical gaps across
            agricultural systems, enabling sustainable growth, resilience, and
            value creation across emerging markets.
          </p>
          <Link
            href="/solution"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
          >
            View all capabilities <ArrowRight size={14} />
          </Link>
        </div>

        {/* Capability cards grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {capabilities.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl bg-green-50 p-6 transition-colors hover:bg-green-100"
            >
              <Icon className="mb-3 text-green-600" size={24} />
              <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
