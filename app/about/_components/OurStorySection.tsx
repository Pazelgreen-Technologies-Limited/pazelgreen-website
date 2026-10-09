import { Eye, Sprout, TrendingUp, Globe } from "lucide-react";
import MotionCard from "@/components/MotionCard";

// Four-part narrative timeline of how Pazelgreen evolved
const storyCards = [
  {
    icon: Eye,
    tag: "The Observation",
    title:
      "Agricultural systems were fragmented, inefficient, and under-optimized.",
    description:
      "Agricultural systems across emerging markets were fragmented, inefficient, and under-optimized — a structural gap that limited the value available to every participant in the chain.",
    highlighted: false,
  },
  {
    icon: Sprout,
    tag: "The Starting Point",
    title: "A focused effort to reduce waste and improve value capture.",
    description:
      "Pazelgreen began with a focused effort to address agricultural waste and improve value capture — building from first principles to understand the system before designing solutions for it.",
    highlighted: false,
  },
  {
    icon: TrendingUp,
    tag: "The Evolution",
    title:
      "Platforms, programs, and initiatives that strengthen the whole system.",
    description:
      "That focus expanded into platforms, programs, and initiatives that strengthen coordination, improve efficiency, and unlock value across agricultural ecosystems at every level.",
    highlighted: false,
  },
  {
    icon: Globe,
    tag: "Today",
    title:
      "An agritech innovation company developing solutions for Africa and emerging markets.",
    description:
      "Pazelgreen operates as an agritech innovation company developing solutions that support sustainable agricultural development across Africa and emerging markets — with a growing portfolio of platforms and programs.",
    highlighted: true,
  },
];

export default function OurStorySection() {
  return (
    <section
      id="our-story"
      className="bg-primary-lighter px-6 py-16 md:py-24 font-sans text-foreground"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-surface bg-background px-4 py-1.5 text-xs font-semibold tracking-widest text-primary uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Our Story
          </p>
          <h2 className="text-3xl font-extrabold text-foreground md:text-4xl lg:text-5xl">
            From a critical observation to a broader innovation journey.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground md:text-base">
            Pazelgreen began with a simple but important question: how can
            agricultural systems become more efficient, coordinated, and
            valuable?
          </p>
        </div>

        {/* 2x2 story cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {storyCards.map(
            ({ icon: Icon, tag, title, description, highlighted }) => (
              <MotionCard
                key={tag}
                className={`group rounded-2xl border p-6 md:p-8 transition-colors ${
                  highlighted
                    ? "border-transparent bg-primary-darker text-inverse-foreground shadow-lg"
                    : "border-border bg-background"
                }`}
              >
                {/* Tag with icon */}
                <div className="mb-6 flex items-center gap-2">
                  <div
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                      highlighted ? "bg-primary-dark" : "bg-primary-lighter"
                    }`}
                  >
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span
                    className={`text-xs font-bold tracking-widest uppercase ${
                      highlighted ? "text-primary" : "text-primary"
                    }`}
                  >
                    {tag}
                  </span>
                </div>

                <h3
                  className={`text-lg font-bold md:text-xl ${
                    highlighted ? "text-inverse-foreground" : "text-foreground"
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`mt-3 text-sm md:text-base ${
                    highlighted
                      ? "text-inverse-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {description}
                </p>
              </MotionCard>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
