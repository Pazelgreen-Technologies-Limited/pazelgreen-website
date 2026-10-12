import { Briefcase, HeartHandshake, Handshake } from "lucide-react";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import MotionCard from "@/components/MotionCard";

// The three ways someone can join Pazelgreen
const roles = [
  {
    icon: Briefcase,
    tag: "Join the core team",
    title: "Careers",
    description:
      "Be part of a talented team building the future of sustainable agriculture. We&apos;re looking for passionate professionals to help drive innovation in agrictech solutions.",
    cta: "View Open Positions",
    href: "/join-us/careers",
  },
  {
    icon: HeartHandshake,
    tag: "Support innovation initiatives",
    title: "Volunteers & Contributors",
    description:
      "Share your expertise and make a real impact. Whether you&apos;re a developer, designer, or agriculture specialist, there&apos;s a place for you in advancing agricultural transformation.",
    cta: "Learn More",
    href: "/join-us/volunteer",
  },
  {
    icon: Handshake,
    tag: "Collaborate on agricultural transformation",
    title: "Partners",
    description:
      "Let's work together to create sustainable solutions. Partner with us to combine our expertise and resources for greater impact in global agriculture.",
    cta: "Partnership Opportunities",
    href: "/join-us/partnerships",
  },
];

export default function RolesSection() {
  return (
    <section className="bg-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mx-auto max-w-4xl text-center font-sans text-3xl font-bold text-primary-darker sm:text-4xl">
          Whether you&apos;re an innovator, creator, or advocate, there&apos;s a
          place for you here.
        </h2>

        {/* Role cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {roles.map(({ icon: Icon, tag, title, description, cta, href }) => (
            <MotionCard
              key={title}
              className="flex flex-col rounded-lg border border-border bg-card p-6"
            >
              {/* Icon */}
              <div className="mb-3 inline-flex w-fit rounded-lg bg-primary-surface/60 p-3">
                <Icon size={22} className="text-primary" />
              </div>

              <p className="text-xs font-medium text-muted-foreground">{tag}</p>

              <h3 className="mt-2 flex items-center gap-2 text-lg font-semibold text-primary-darker">
                <ArrowRight size={16} className="shrink-0 text-primary" />
                {title}
              </h3>

              <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">
                {description}
              </p>

              {/* CTA button at bottom of card */}
              <div className="mt-6">
                <Button
                  href={href}
                  variant="solid"
                  showArrow
                  className="w-full justify-center"
                >
                  {cta}
                </Button>
              </div>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}
