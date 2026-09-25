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
    <section className="bg-white px-6 py-16 md:py-24 font-sans text-gray-900">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-semibold tracking-widest text-brand uppercase">
            <span>🌱</span> Our Approach
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
            Three principles guide how we build.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-gray-600 md:text-base">
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
                    ? "border-transparent bg-green-800 text-white shadow-lg"
                    : "border-green-100 bg-white"
                }`}
              >
                <div
                  className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                    highlighted ? "bg-green-700" : "bg-green-50"
                  }`}
                >
                  <Icon
                    size={22}
                    className="text-brand transition-transform duration-300 group-hover:-rotate-12"
                  />
                </div>
                {/* Green accent bar — only the highlighted middle card has the dark bar */}
                <div
                  className={`mb-4 h-1 w-12 rounded-full ${
                    highlighted ? "bg-brand" : "bg-brand"
                  }`}
                />
                <h3
                  className={`text-base font-bold md:text-lg ${
                    highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`mt-3 text-sm md:text-base ${
                    highlighted ? "text-green-50" : "text-gray-600"
                  }`}
                >
                  {description}
                </p>

                {footerTag && (
                  <>
                    <div className="mt-auto pt-6">
                      <div
                        className={`h-px w-full ${
                          highlighted ? "bg-white/20" : "bg-gray-200"
                        }`}
                      />
                    </div>
                    <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand">
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
