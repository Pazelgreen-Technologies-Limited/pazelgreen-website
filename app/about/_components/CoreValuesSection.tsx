import {
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Shield,
  Leaf,
  Users,
  Zap,
  Star,
  HeartHandshake,
} from "lucide-react";

const values = [
  {
    name: "Innovation",
    icon: Lightbulb,
    description:
      "Pioneering technological solutions to age-old agricultural challenges.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    name: "Integrity",
    icon: ShieldCheck,
    description:
      "Uncompromising honesty, transparency, and ethics in everything we do.",
    color: "bg-pink-50 text-pink-600 border-pink-100",
  },
  {
    name: "Impact",
    icon: TrendingUp,
    description:
      "Measuring success by real-world change in farmers' lives and community well-being.",
    color: "bg-cyan-50 text-cyan-600 border-cyan-100",
  },
  {
    name: "Resilience",
    icon: Shield,
    description:
      "Building adaptive systems that withstand climate, economic, and supply chain shocks.",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    name: "Sustainability",
    icon: Leaf,
    description:
      "Championing environmental stewardship and long-term ecological balance.",
    color: "bg-rose-50 text-rose-600 border-rose-100",
  },
  {
    name: "Collaboration",
    icon: Users,
    description:
      "Partnering across borders, sectors, and communities to drive collective progress.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    name: "Empowerment",
    icon: Zap,
    description:
      "Putting power, tools, and equitable rewards directly into the hands of producers.",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    name: "Excellence",
    icon: Star,
    description:
      "Pursuing the highest standards of execution, quality, and service reliability.",
    color: "bg-lime-50 text-lime-600 border-lime-100",
  },
  {
    name: "Inclusivity",
    icon: HeartHandshake,
    description:
      "Ensuring smallholders, women, and youth are central to the agricultural transformation.",
    color: "bg-orange-50 text-orange-600 border-orange-100",
  },
];

export default function CoreValuesSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Core Values
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {values.map((v, index) => {
            const Icon = v.icon;
            return (
              <div
                key={index}
                className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-lg sm:p-8"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-xs transition-transform duration-300 group-hover:scale-110 ${v.color}`}
                >
                  <Icon className="h-6 w-6 stroke-[2.2]" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  {v.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
