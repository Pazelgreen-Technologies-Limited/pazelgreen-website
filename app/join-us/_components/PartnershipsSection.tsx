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
    <section className="bg-background px-6 py-16">
      <div className="mx-auto max-w-5xl rounded-2xl bg-background-alt p-8 shadow-md shadow-primary-darker/10 md:p-12">
        {/* Section heading */}
        <div className="text-center">
          <h3 className="text-normal font-extrabold tracking-wide text-accent">
            Collaborate on an agricultural transformation
          </h3>
          <h2 className="mt-2 text-2xl font-extrabold text-foreground md:text-4xl">
            Strategic Partnerships
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            We believe in the power of collaboration. Whether you&apos;re a
            technology provider, research institution, or agricultural
            organization, let&apos;s explore how we can work together to create
            meaningful change.
          </p>
          {/* View positions CTA */}
          <Link
            href="/join-us/careers"
            className="mt-4 inline-flex items-center gap-1 text-2xl font-bold text-primary-darker hover:underline"
          >
            View all openings{" "}
            <span className="rounded-full bg-primary/20 p-2">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        {/* Two info cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Partnership Types */}
          <MotionCard className="rounded-xl bg-primary-lighter p-6 pr-16 transition-colors">
            <div className="mb-3 inline-flex rounded-xl bg-background p-2">
              <Puzzle size={24} className="text-primary" />
            </div>
            <div className="pr-20">
              <h4 className="text-normal font-bold text-foreground">
                Partnership Types
              </h4>
            </div>
            <ul className="mt-2 space-y-2">
              {partnershipTypes.map((item) => (
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

          {/* What We Look For */}
          <MotionCard className="rounded-2xl border border-border bg-background-alt p-6">
            <div className="mb-4 inline-flex rounded-xl bg-primary-lighter p-3">
              <Search size={24} className="text-primary" />
            </div>
            <div className="pr-20">
              <h4 className="text-normal font-bold text-foreground">
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
