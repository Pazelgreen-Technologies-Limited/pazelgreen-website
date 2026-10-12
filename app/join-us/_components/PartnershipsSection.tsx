import { Puzzle, Search } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MotionCard from "@/components/MotionCard";

// Types of partnerships Pazelgreen seeks
const partnershipTypes = [
  "Technology integrations",
  "Research collaborations",
  "Go-to-market partnerships",
  "Investment opportunities",
];

// What Pazelgreen looks for in partners — placeholder, replace with real copy
const whatWeLookFor = [
  "Mission-aligned organizations",
  "Commitment to innovation",
  "Global or regional reach",
  "Focus on sustainable impact",
];

export default function PartnershipsSection() {
  return (
    <section className="bg-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary/70">
            Collaborate on an agricultural transformation
          </p>
          <h2 className="mt-2 font-sans text-3xl font-extrabold text-primary-darker sm:text-4xl">
            Strategic Partnerships
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            We believe in the power of collaboration. Whether you&apos;re a
            technology provider, research institution, or agricultural
            organization, let&apos;s explore how we can work together to create
            meaningful change.
          </p>
          {/* View positions CTA */}
          <Link
            href="/join-us/careers"
            className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-primary-darker hover:underline"
          >
            View all openings <ArrowRight size={16} />
          </Link>
        </div>

        {/* Two info cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Partnership Types */}
          <MotionCard className="rounded-lg border border-border bg-card p-6 transition-colors">
            <div className="mb-3 inline-flex rounded-lg bg-primary-surface/60 p-2">
              <Puzzle size={24} className="text-primary" />
            </div>
            <div className="pr-20">
              <h4 className="text-lg font-bold text-primary-darker">
                Partnership Types
              </h4>
            </div>
            <ul className="mt-2 space-y-2">
              {partnershipTypes.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </MotionCard>

          {/* What We Look For */}
          <MotionCard className="rounded-lg border border-border bg-card p-6">
            <div className="mb-3 inline-flex rounded-lg bg-primary-surface/60 p-2">
              <Search size={24} className="text-primary" />
            </div>
            <div className="pr-20">
              <h4 className="text-lg font-bold text-primary-darker">
                What We Look For
              </h4>
            </div>
            <ul className="mt-2 space-y-2">
              {whatWeLookFor.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </MotionCard>
        </div>
      </div>
    </section>
  );
}
