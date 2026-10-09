import Image from "next/image";
import { Users, Send, TrendingUp, Database } from "lucide-react";

// Four systemic issues Pazelgreen addresses
const issues = [
  {
    icon: Users,
    title: "Fragmented Markets",
    description:
      "Stakeholders often operate in disconnected systems, making coordination difficult across the value chain.",
  },
  {
    icon: Send,
    title: "Limited Coordination",
    description:
      "Farmers, processors, logistics providers, markets, and institutions often lack the tools to work together efficiently.",
  },
  {
    icon: TrendingUp,
    title: "Post-Harvest Losses",
    description:
      "Poor coordination and limited visibility contribute to waste, lost income, and reduced value capture.",
  },
  {
    icon: Database,
    title: "Underutilized Resources",
    description:
      "Data, infrastructure, produce, and market opportunities are often not fully optimized.",
  },
];

// Floating "System Insight" cards shown over the right-hand image
const insightCards = [
  {
    title: "Fragmented Value Chains",
    body: "Disconnected actors across the supply chain limit overall system performance.",
  },
  {
    title: "Low Market Visibility",
    body: "Market signals and pricing data are inaccessible to most value chain participants.",
  },
  {
    title: "Coordination Gaps",
    body: "Farmers, processors, and logistics providers lack shared tools to operate efficiently.",
  },
];

export default function WhyWeExistSection() {
  return (
    <section className="bg-green-50 px-6 py-16 md:py-24 font-sans text-gray-900">
      <div className="mx-auto max-w-5xl">
        {/* Two-column layout: copy on left, image with overlays on right */}
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-16">
          {/* LEFT — copy column */}
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-background px-4 py-1.5 text-xs font-semibold tracking-widest text-primary uppercase">
              <span>🔍</span> Why We Exist
            </p>
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
              Agriculture&apos;s biggest problem is fragmentation.
            </h2>
            <p className="mt-5 text-sm text-gray-600 md:text-base">
              Agricultural systems across emerging markets continue to face
              structural inefficiencies including fragmented markets, limited
              coordination, post-harvest losses, and underutilized resources.
              These challenges limit productivity, reduce value capture, and
              slow sustainable development across the sector.
            </p>

            {/* Issue list */}
            <ul className="mt-8 space-y-5">
              {issues.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 md:text-base">
                      {title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Dark green callout */}
            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-green-800 p-5 text-background shadow-lg md:p-6">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-700">
                <Send size={16} className="text-primary" />
              </div>
              <p className="text-sm text-green-50 md:text-base">
                Pazelgreen exists to address these gaps through innovation-led
                solutions that improve how agricultural systems function,
                connect, and grow.
              </p>
            </div>
          </div>

          {/* RIGHT — image with floating insight cards */}
          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-3/4 md:aspect-4/5">
              {/* Replace /about-fragmentation.png with the exported Figma asset */}
              <Image
                src="/about-fragmentation.png"
                alt="Top view of agricultural fields highlighting fragmentation"
                fill
                className="object-cover"
              />

              {/* Insight card — top-left */}
              <InsightCard
                className="absolute top-6 left-4 right-6 md:top-8 md:left-6 md:right-10"
                title={insightCards[0].title}
                body={insightCards[0].body}
              />
              {/* Insight card — middle-right */}
              <InsightCard
                className="absolute top-1/3 right-4 left-10 md:right-6 md:left-16"
                title={insightCards[1].title}
                body={insightCards[1].body}
              />
              {/* Insight card — bottom */}
              <InsightCard
                className="absolute bottom-6 left-4 right-12 md:bottom-10 md:left-8 md:right-20"
                title={insightCards[2].title}
                body={insightCards[2].body}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Small helper component for the green floating "System Insight" cards
function InsightCard({
  title,
  body,
  className = "",
}: {
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-green-800/95 p-3 text-background shadow-lg backdrop-blur-sm md:p-4 ${className}`}
    >
      <p className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-primary uppercase md:text-xs">
        <span>📊</span> System Insight
      </p>
      <h4 className="text-sm font-bold md:text-base">{title}</h4>
      <p className="mt-1 text-xs text-green-50 md:text-sm">{body}</p>
    </div>
  );
}
