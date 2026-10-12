import Link from "next/link";
import {
  LayoutGrid,
  Recycle,
  Users,
  LineChart,
  ArrowRight,
} from "lucide-react";
import MotionCard from "@/components/MotionCard";

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
    <section className="bg-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary/70">
            What We Do
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-primary-darker sm:text-4xl">
            Core Capabilities
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            We build innovative solutions that address critical gaps across
            agricultural systems, enabling sustainable growth, resilience, and
            value creation across emerging markets.
          </p>
          <Link
            href="/solutions"
            className="group mt-5 inline-flex items-center gap-2 font-semibold text-primary-darker hover:underline"
          >
            Explore all solutions
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Capability cards grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {capabilities.map(({ icon: Icon, title, description }) => (
            <MotionCard
              key={title}
              className="group rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-surface hover:shadow-lg md:p-8"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary-surface/60 transition-transform duration-300 group-hover:scale-110">
                <Icon size={22} className="text-primary" />
              </div>

              <h3 className="text-lg font-bold text-primary-darker">{title}</h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {description}
              </p>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}
