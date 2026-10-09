import { Send, Layers, Sprout } from "lucide-react";
import MotionCard from "@/components/MotionCard";

const principles = [
  {
    icon: Send,
    title: "Coordination over fragmentation",
    description:
      "We design systems that improve how stakeholders connect and interact across agricultural value chains.",
    highlighted: false,
    footerTag: null as string | null,
  },
  {
    icon: Layers,
    title: "Efficiency over waste",
    description:
      "We focus on unlocking value within existing agricultural systems and eliminating inefficiencies that reduce overall productivity.",
    highlighted: true,
    footerTag: "Value-Focused Design",
  },
  {
    icon: Sprout,
    title: "Sustainability over short-term fixes",
    description:
      "We build solutions designed for long-term resilience and scalability across diverse agricultural contexts.",
    highlighted: false,
    footerTag: null as string | null,
  },
];

export default function OurApproachSection() {
  return (
    <section className="bg-background px-6 py-16 md:py-24 font-sans text-foreground">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-surface bg-primary-lighter px-4 py-1.5 text-xs font-semibold tracking-widest text-primary uppercase">
            <span>🌱</span> Our Approach
          </p>
          <h2 className="text-3xl font-extrabold text-foreground md:text-4xl lg:text-5xl">
            Three principles guide how we build.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground md:text-base">
            We approach agricultural development as a systems challenge, not a
            single-problem solution.
          </p>
        </div>

        {/* 3 principle cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {principles.map(
            ({ icon: Icon, title, description, highlighted, footerTag }) => (
              <MotionCard
                key={title}
                className={`group flex flex-col rounded-2xl border p-6 md:p-8 transition-colors ${
                  highlighted
                    ? "border-transparent bg-primary-darker text-inverse-foreground shadow-lg"
                    : "border-border bg-primary-lighter"
                }`}
              >
                <div
                  className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                    highlighted
                      ? "bg-background/5 border border-background/50"
                      : "bg-primary-darker/15"
                  }`}
                >
                  <Icon size={22} className="text-primary" />
                </div>
                {/* Green accent bar — only the highlighted middle card has the dark bar */}
                <div
                  className={`mb-4 h-1 w-12 rounded-full ${
                    highlighted ? "bg-primary" : "bg-primary"
                  }`}
                />
                <h3
                  className={`text-base font-semibold md:text-lg ${
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

                {footerTag && (
                  <>
                    <div className="mt-auto pt-6">
                      <div
                        className={`h-px w-full ${
                          highlighted ? "bg-inverse-foreground/20" : "bg-border"
                        }`}
                      />
                    </div>
                    <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
                      <span>⚡</span> {footerTag}
                    </p>
                  </>
                )}
              </MotionCard>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
