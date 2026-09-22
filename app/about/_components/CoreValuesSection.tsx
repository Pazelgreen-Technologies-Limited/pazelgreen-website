import { Send, Lightbulb, Leaf, Diamond, Globe } from "lucide-react";

// Core values shown as 5 cards (3 in top row, 2 in bottom row).
// Middle card on the top row is highlighted to match the Figma emphasis.
const values = [
  {
    icon: Send,
    title: "Systems Thinking",
    description:
      "We approach challenges as interconnected systems, not isolated problems.",
    highlighted: false,
  },
  {
    icon: Lightbulb,
    title: "Practical Innovation",
    description:
      "We build solutions that are applicable, scalable, and relevant to real agricultural conditions.",
    highlighted: true,
  },
  {
    icon: Leaf,
    title: "Sustainability by Design",
    description:
      "We integrate environmental, economic, and social sustainability from the start.",
    highlighted: false,
  },
  {
    icon: Diamond,
    title: "Value Creation",
    description:
      "We unlock hidden value within agricultural systems and transform inefficiencies into opportunities.",
    highlighted: false,
  },
  {
    icon: Globe,
    title: "Contextual Intelligence",
    description:
      "We design with deep understanding of local realities while maintaining a global perspective.",
    highlighted: false,
  },
];

export default function CoreValuesSection() {
  return (
    <section className="bg-white px-6 py-16 md:py-24 font-sans text-gray-900">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-semibold tracking-widest text-brand uppercase">
            <span>★</span> Core Values
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
            Core values that guide how we build.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-gray-600 md:text-base">
            Our values guide every decision, every solution, and every system we
            build at Pazelgreen.
          </p>
        </div>

        {/* Top row — 3 cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.slice(0, 3).map(({ icon: Icon, title, description, highlighted }) => (
            <div
              key={title}
              className={`rounded-2xl border p-6 md:p-8 transition-colors ${
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
                  className={highlighted ? "text-brand" : "text-brand"}
                />
              </div>
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
            </div>
          ))}
        </div>

        {/* Bottom row — 2 cards, offset to mimic the centered Figma layout */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:max-w-3xl md:mx-auto">
          {values.slice(3).map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-green-100 bg-white p-6 md:p-8 transition-colors hover:border-green-200"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <Icon size={22} className="text-brand" />
              </div>
              <h3 className="text-base font-bold text-gray-900 md:text-lg">
                {title}
              </h3>
              <p className="mt-3 text-sm text-gray-600 md:text-base">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
