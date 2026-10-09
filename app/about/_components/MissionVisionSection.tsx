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
    <section className="bg-background-alt px-6 py-16 md:py-24 font-sans text-foreground">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-surface bg-background px-4 py-1.5 text-xs font-semibold tracking-widest text-primary uppercase">
            <Target size={12} /> Mission &amp; Vision
          </p>
          <h2 className="text-3xl font-extrabold text-foreground md:text-4xl lg:text-5xl">
            Mission &amp; Vision
          </h2>
        </div>

        {/* Two cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map(({ icon: Icon, tag, body, highlighted }) => (
            <MotionCard
              key={tag}
              className={`group rounded-2xl p-6 md:p-10 transition-colors ${
                highlighted
                  ? "bg-primary-darker text-inverse-foreground shadow-lg"
                  : "border border-border bg-background"
              }`}
            >
              <div
                className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                  highlighted ? "bg-primary-dark" : "bg-primary-lighter"
                }`}
              >
                <Icon size={22} className="text-primary" />
              </div>
              <p
                className={`mb-4 text-xs font-bold tracking-widest uppercase ${
                  highlighted ? "text-primary" : "text-primary"
                }`}
              >
                {tag}
              </p>
              <p
                className={`text-base font-medium md:text-lg ${
                  highlighted
                    ? "text-inverse-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {body}
              </p>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}
