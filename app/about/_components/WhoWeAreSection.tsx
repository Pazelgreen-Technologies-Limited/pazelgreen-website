import { Sprout, Send, Leaf } from "lucide-react";
import MotionCard from "@/components/MotionCard";

// Three pillars describing how Pazelgreen operates
const pillars = [
  {
    icon: Sprout,
    title: "Agricultural Development",
    description:
      "We design solutions that strengthen value creation across food systems and agricultural value chains.",
    highlighted: false,
    footerTag: null as string | null,
  },
  {
    icon: Send,
    title: "Technology-Driven Coordination",
    description:
      "We build digital systems that improve how stakeholders connect, interact, and operate across the value chain.",
    highlighted: true,
    footerTag: "Digital-First Infrastructure",
  },
  {
    icon: Leaf,
    title: "Sustainability-Focused Innovation",
    description:
      "We create solutions that support long-term resilience, efficiency, and sustainable growth.",
    highlighted: false,
    footerTag: null as string | null,
  },
];

export default function WhoWeAreSection() {
  return (
    <section className="bg-background px-6 py-16 md:py-24 font-sans text-foreground">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-surface bg-primary-lighter px-4 py-1.5 text-xs font-semibold tracking-widest text-primary uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Who We Are
          </p>
          <h2 className="text-3xl font-extrabold text-foreground md:text-4xl lg:text-5xl">
            Building systems for agricultural transformation.
          </h2>
          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-sm text-muted-foreground md:text-base">
            <p>
              Pazelgreen is an innovation-driven agritech company building
              practical and scalable solutions that address inefficiencies
              across agricultural systems.
            </p>
            <p>
              We operate at the intersection of agricultural development,
              technology-driven coordination, and sustainability-focused
              innovation.
            </p>
          </div>
        </div>

        {/* Pillar cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map(
            ({ icon: Icon, title, description, highlighted, footerTag }) => (
              <MotionCard
                key={title}
                className={`group flex flex-col rounded-2xl border p-6 md:p-8 transition-colors ${
                  highlighted
                    ? "border-transparent bg-primary-darker text-inverse-foreground shadow-lg"
                    : "border-border bg-primary-lighter hover:border-primary-surface"
                }`}
              >
                {/* Icon bubble */}
                <div
                  className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                    highlighted
                      ? "bg-inverse-foreground/5 border border-inverse-foreground/50"
                      : "bg-primary-darker/15"
                  }`}
                >
                  <Icon size={22} className="text-primary" />
                </div>

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

                {/* Footer tag shown only on highlighted card */}
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
