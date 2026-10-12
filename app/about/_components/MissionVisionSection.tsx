import { Target, Eye } from "lucide-react";
import MotionCard from "@/components/MotionCard";

const cards = [
  {
    icon: Target,
    tag: "Our Mission",
    body: "To develop innovative solutions that strengthen agricultural systems, improve efficiency, and enable sustainable development across emerging markets.",
    highlighted: true,
  },
  {
    icon: Eye,
    tag: "Our Vision",
    body: "To become a global leader in developing innovative solutions that drive sustainable agricultural transformation and resilient food systems across emerging markets.",
    highlighted: false,
  },
];

export default function MissionVisionSection() {
  return (
    <section className="bg-background px-6 py-16 font-sans text-foreground md:py-24">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-wider text-primary/70 uppercase">
            <Target size={12} /> Mission &amp; Vision
          </p>
          <h2 className="text-3xl font-extrabold text-primary-darker md:text-4xl lg:text-5xl">
            Mission &amp; Vision
          </h2>
        </div>

        {/* Two cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map(({ icon: Icon, tag, body, highlighted }) => (
            <MotionCard
              key={tag}
              className={`group rounded-lg border bg-card p-6 transition-colors hover:border-primary-surface md:p-10 ${
                highlighted ? "border-primary/40" : "border-border"
              }`}
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-surface/60 transition-transform duration-300 group-hover:scale-110">
                <Icon size={22} className="text-primary" />
              </div>
              <p className="mb-4 text-xs font-bold tracking-widest text-primary uppercase">
                {tag}
              </p>
              <p className="text-base font-medium text-muted-foreground md:text-lg">
                {body}
              </p>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}
