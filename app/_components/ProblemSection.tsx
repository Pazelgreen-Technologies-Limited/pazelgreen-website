import {
  GraduationCap,
  Truck,
  Recycle,
  Leaf,
  Network,
  BarChart3,
  ArrowRight,
} from "lucide-react";

// Feature grid items with their icon, title, and description
const features = [
  {
    icon: GraduationCap,
    tag: "Impacting Knowledge",
    title: "Educational Resources",
    description:
      "Offering educational materials on agriculture and business best practices.",
  },
  {
    icon: Truck,
    tag: "Supply Chain",
    title: "Logistics for Seamless Delivery",
    description:
      "This improves customer satisfaction and reliability, which are critical for business reputation and repeat orders.",
  },
  {
    icon: Recycle,
    tag: "Resource Waste",
    title: "Optimized Systems",
    description:
      "Implementing circular economy principles to maximize resource efficiency and sustainability.",
  },
  {
    icon: Leaf,
    tag: "Post-Harvest Loss",
    title: "Value Recovery",
    description:
      "Transforming waste into wealth by optimizing supply chains and extending product lifecycles.",
  },
  {
    icon: Network,
    tag: "Fragmented Markets",
    title: "Connected Ecosystems",
    description:
      "Bridging gaps between farmers, buyers, and service providers through unified digital platforms.",
  },
  {
    icon: BarChart3,
    tag: "Data Gaps",
    title: "Actionable Intelligence",
    description:
      "Providing real-time market insights and predictive analytics for informed decision-making.",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-gray-50 px-6 py-16 my-16 font-sans text-gray-900">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <h1 className="text-center text-2xl font-extrabold text-gray-900 md:text-5xl">
          Transforming Agricultural Inefficiencies into Scalable Opportunities
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-gray-600">
          We identify critical inefficiencies across agricultural value chains
          and transform them into scalable, technology-driven solutions that
          improve logistics, intelligence, sustainability, and market access.
        </p>

        {/* Problem statement card */}
        <div className="mt-10 rounded-2xl bg-white p-8 text-center shadow-sm">
          <h3 className="text-xl font-extrabold tracking-wide text-orange-500">
            Problem Statement
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
            Agricultural Systems across emerging markets face persistent
            inefficiencies from post harvest losses and fragmented markets to
            under-utilized resources and limited access to infrastructure. These
            gaps represent significant opportunities to unlock value, strengthen
            resilience, and accelerate sustainable agricultural development.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, tag, title, description }) => (
            <div key={title} className="rounded-xl bg-white p-6 shadow-sm">
              <Icon className="mb-3 text-green-500" size={28} />
              <p className="text-xs text-gray-400">{tag}</p>
              <h4 className="mt-1 flex items-center gap-1 text-sm font-semibold text-gray-900">
                <span className="text-orange-500">
                  <ArrowRight size={16} />
                </span>{" "}
                {title}
              </h4>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
