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
      <div className="mx-auto md:max-w-5xl rounded-2xl bg-gray-50 p-8 md:p-12 md:shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1)]">
        {/* Section heading */}
        <div className="text-center">
          <h3 className="text-normal font-extrabold tracking-wide text-orange-500">
            What We Do
          </h3>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-900 md:text-4xl">
            Core Capabilities
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
            We build innovative solutions that address critical gaps across
            agricultural systems, enabling sustainable growth, resilience, and
            value creation across emerging markets.
          </p>
          <Link
            href="/solution"
            className="mt-4 inline-flex items-center gap-1 text-2xl font-medium text-green-800 hover:underline"
          >
            View all capabilities{" "}
            <span className="bg-[#17913B33] p-2 rounded-full">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        {/* Capability cards grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {capabilities.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl bg-green-50 p-6 md:pr-16 transition-colors"
            >
              <div className="mb-3 inline-flex rounded-xl bg-white p-2">
                <Icon size={24} className="text-green-600" />
              </div>

              <div className="md:pr-20">
                <h4 className="text-normal font-bold text-gray-900">{title}</h4>
              </div>

              <p className="mt-2 text-sm text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
