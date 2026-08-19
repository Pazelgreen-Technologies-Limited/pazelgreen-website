import {
  Handshake,
  MonitorPlay,
  Sprout,
  Globe,
  Building,
  TrendingUp,
} from "lucide-react";

// Six collaboration areas
const collaborations = [
  {
    icon: Handshake,
    title: "Partnership",
    description:
      "Build strategic alliances to expand reach and co-create value across the agricultural ecosystem.",
  },
  {
    icon: MonitorPlay,
    title: "PAGEX Demo",
    description:
      "Request a live walkthrough of Pazelgreen's flagship platform and discover its capabilities firsthand.",
  },
  {
    icon: Sprout,
    title: "Agricultural Innovation",
    description:
      "Explore cutting-edge solutions for sustainable farming, crop management, and food systems.",
  },
  {
    icon: Globe,
    title: "Sustainability Project",
    description:
      "Join impact-driven initiatives focused on climate-smart agriculture and environmental stewardship.",
  },
  {
    icon: Building,
    title: "Enterprise Solutions",
    description:
      "Deploy robust, scalable agricultural technologies designed for large-scale commercial operations.",
  },
  {
    icon: TrendingUp,
    title: "Investment",
    description:
      "Partner with us to fund and scale the next generation of agritech solutions in emerging markets.",
  },
];

export default function CollaborateSection() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <p className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold text-green-500">
            <span className="h-px w-6 bg-green-400" /> WORK WITH US{" "}
            <span className="h-px w-6 bg-green-400" />
          </p>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            How can we collaborate?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">
            Select an area of interest to learn more about how we partner with
            organizations across the agricultural value chain.
          </p>
        </div>

        {/* 2-row, 3-column grid of collaboration cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {collaborations.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-colors hover:bg-green-50 hover:border-green-100 cursor-pointer"
            >
              <div className="mb-4 inline-flex rounded-xl bg-white p-3 shadow-sm">
                <Icon size={20} className="text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
