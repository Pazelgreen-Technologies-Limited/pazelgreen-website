import { GitMerge, Gift } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import MotionCard from "@/components/MotionCard";

// Ways contributors can get involved
const ways = [
  "Open source development",
  "Research and insights",
  "Community building",
  "Content creation & education",
];

// Benefits of volunteering — placeholder, replace with real copy
const benefits = [
  "Build your portfolio",
  "Network with professionals",
  "Get real-world experience",
  "Contribute to global impact",
];

export default function VolunteerSection() {
  return (
    <section className="bg-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary/70">
              Support innovation initiatives
            </p>
            <h2 className="mt-2 font-sans text-3xl font-extrabold text-primary-darker sm:text-4xl">
              Volunteer & Contribute
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              You don&apos;t need to be on our team to help shape the future of
              agriculture. We welcome contributions from developers, designers,
              researchers, and agriculture professionals worldwide.
            </p>
            {/* View positions CTA */}
            <Link
              href="/join-us/careers"
              className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-primary-darker hover:underline"
            >
              View all openings <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Two info cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Ways to Contribute */}
          <MotionCard className="rounded-lg border border-border bg-card p-6 transition-colors">
            <div className="mb-3 inline-flex rounded-lg bg-primary-surface/60 p-2">
              <GitMerge size={24} className="text-primary" />
            </div>
            <div className="pr-20">
              <h4 className="text-lg font-bold text-primary-darker">
                Ways to Contribute
              </h4>
            </div>
            <ul className="mt-2 space-y-2">
              {ways.map((item) => (
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

          {/* Benefits */}
          <MotionCard className="rounded-lg border border-border bg-card p-6 transition-colors">
            <div className="mb-3 inline-flex rounded-lg bg-primary-surface/60 p-2">
              <Gift size={24} className="text-primary" />
            </div>
            <div className="pr-20">
              <h4 className="text-lg font-bold text-primary-darker">
                Benefits
              </h4>
            </div>
            <ul className="mt-2 space-y-2">
              {benefits.map((item) => (
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
