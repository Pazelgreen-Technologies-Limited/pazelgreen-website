import { Leaf, Network, BarChart3 } from "lucide-react";
import MotionCard from "@/components/MotionCard";

const challenges = [
  {
    icon: Network,
    title: "Fragmented markets",
    description:
      "Producers, buyers, and service providers often operate without reliable ways to coordinate across the value chain.",
  },
  {
    icon: Leaf,
    title: "Post-harvest losses",
    description:
      "Delays, limited market access, and weak logistics can reduce the value of agricultural produce before it reaches buyers.",
  },
  {
    icon: BarChart3,
    title: "Limited market visibility",
    description:
      "Inconsistent information about pricing, demand, and quality makes it harder for participants to make informed decisions.",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-background-alt px-6 py-16 font-sans md:py-20">
      <div className="mx-auto max-w-300">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary/70">
            The challenge
          </p>
          <h2 className="text-3xl font-extrabold text-primary-darker sm:text-4xl">
            Agricultural systems lose value when people and information are
            disconnected.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Across emerging markets, persistent coordination gaps limit
            productivity, market access, and sustainable growth.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {challenges.map(({ icon: Icon, title, description }) => (
            <MotionCard
              key={title}
              className="group rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-surface hover:shadow-lg"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary-surface/60 transition-transform duration-300 group-hover:scale-110">
                <Icon className="text-primary" size={22} />
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
