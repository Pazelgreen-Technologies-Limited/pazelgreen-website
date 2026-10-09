import { Briefcase, Star } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MotionCard from "@/components/MotionCard";

// Current open roles
const openings = [
  "Full Stack Engineers",
  "Agricultural Scientists",
  "Product Managers",
  "Business Development",
];

// Reasons to join — placeholder, replace with real copy
const whyJoinUs = [
  "Work on cutting-edge agri-tech solutions",
  "Collaborative and mission-driven team",
  "Flexible remote-first environment",
  "Competitive salary and equity options",
];

export default function CareersSection() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto max-w-5xl rounded-2xl bg-background-alt p-8 shadow-md shadow-primary-darker/10 md:p-12">
        {/* Section heading */}
        <div className="text-center">
          <h3 className="text-normal font-extrabold tracking-wide text-accent">
            Join the core team
          </h3>
          <h2 className="mt-2 text-2xl font-extrabold text-foreground md:text-4xl">
            Careers at Pazelgreen
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            We&apos;re building a team of innovators, technologists, and
            agriculture enthusiasts who share our passion for sustainable
            farming. We offer competitive compensation, professional growth, and
            the opportunity to work on problems that matter.
          </p>
          {/* View positions CTA */}
          <Link
            href="/join-us/careers"
            className="mt-4 inline-flex items-center gap-1 text-2xl font-bold text-primary-darker hover:underline"
          >
            View Open Positions{" "}
            <span className="rounded-full bg-primary/20 p-2">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        {/* Two info cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Current Openings card */}
          <MotionCard className="rounded-xl bg-primary-lighter p-6 pr-16 transition-colors">
            <div className="mb-3 inline-flex rounded-xl bg-background p-2">
              <Briefcase size={24} className="text-primary" />
            </div>
            <div className="pr-20">
              <h4 className="text-normal font-bold text-foreground">
                Current Openings
              </h4>
            </div>

            <ul className="mt-2 space-y-2">
              {openings.map((role) => (
                <li
                  key={role}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {role}
                </li>
              ))}
            </ul>
          </MotionCard>

          {/* Why Join Us card */}
          <MotionCard className="rounded-xl bg-primary-lighter p-6 pr-16 transition-colors">
            <div className="mb-3 inline-flex rounded-xl bg-background p-2">
              <Star size={24} className="text-primary" />
            </div>
            <h3 className="text-normal font-bold text-foreground">
              Why Join Us?
            </h3>
            <ul className="mt-2 space-y-2">
              {whyJoinUs.map((item) => (
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
