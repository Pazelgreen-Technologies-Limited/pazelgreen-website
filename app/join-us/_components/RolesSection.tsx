import { Briefcase, HeartHandshake, Handshake } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Tagline */}
        <h2 className="text-center text-5xl font-bold text-gray-900 md:text-3xl">
          Whether you&apos;re an innovator, creator, or advocate, there&apos;s a
          place for you here.
        </h2>

        {/* Role cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {roles.map(({ icon: Icon, tag, title, description, cta, href }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-gray-100 p-6"
            >
              {/* Icon */}
              <div className="mb-3 inline-flex rounded-xl bg-green-50 p-3 w-fit">
                <Icon size={22} className="text-green-600" />
              </div>

              {/* Tag */}
              <p className="text-xs text-gray-400">{tag}</p>

              {/* Title with orange plus prefix */}
              <h3 className="mt-1 flex items-center gap-1 text-base font-semibold text-gray-900">
                <span className="text-orange-500">
                  {" "}
                  <ArrowRight size={14} />{" "}
                </span>{" "}
                {title}
              </h3>

              <p className="mt-2 flex-1 text-sm text-gray-600">{description}</p>

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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
