import Image from "next/image";
import { Send, Lightbulb, Quote } from "lucide-react";
import MotionCard from "@/components/MotionCard";

// Two bottom cards highlighting the founder's approach
const approachCards = [
  {
    icon: Send,
    title: "Systems Thinking",
    description:
      "Understanding every actor and connection before designing solutions.",
  },
  {
    icon: Lightbulb,
    title: "Practical Innovation",
    description:
      "Building solutions that work in real-world agricultural contexts.",
  },
];

export default function FounderPerspective() {
  return (
    <section className="bg-background px-6 py-16 md:py-24 font-sans text-foreground">
      <div className="mx-auto max-w-5xl">
        {/* Heading row: text on left, founder image on right */}
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-12">
          {/* LEFT — copy column */}
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-surface bg-primary-lighter px-4 py-1.5 text-xs font-semibold tracking-widest text-primary uppercase">
              <Quote size={12} /> Founder&apos;s Perspective
            </p>

            <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-4xl lg:text-5xl">
              Building systems, not just products.
            </h2>

            <div className="mt-6 space-y-4 text-sm text-muted-foreground md:text-base">
              <p>
                The founder of Pazelgreen approaches agricultural development
                from a systems-thinking perspective, with a focus on addressing
                structural inefficiencies across agricultural value chains
                through innovation and coordination.
              </p>
              <p>
                This perspective is shaped by a deep understanding of the gaps
                that limit productivity, value creation, and sustainability
                within agricultural systems across emerging markets.
              </p>
              <p>
                Through Pazelgreen, she is focused on building practical and
                scalable solutions that strengthen agricultural systems and
                contribute to long-term sustainable development.
              </p>
            </div>

            {/* Pull-quote with green left border */}
            <blockquote className="mt-8 border-l-4 border-primary bg-primary-lighter/40 px-5 py-4">
              <p className="text-base font-semibold italic text-primary-darker md:text-lg">
                &ldquo;Pazelgreen exists to build practical systems that help
                agriculture become more coordinated, efficient, and
                sustainable.&rdquo;
              </p>
              <footer className="mt-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                — Founder, Pazelgreen Technologies
              </footer>
            </blockquote>
          </div>

          {/* RIGHT — founder image card */}
          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-4/5 md:aspect-3/4">
              {/* Replace /about-founder.png with the exported Figma asset */}
              <Image
                src="/about-founder.png"
                alt="Founder of Pazelgreen Technologies"
                fill
                className="object-cover"
              />
              {/* Pazelgreen badge in the top-right of the image */}
              <span className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full bg-primary-darker/90 px-3 py-1 text-xs font-semibold text-inverse-foreground backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Pazelgreen
              </span>

              {/* Founder caption card overlapping the bottom of the image */}
              <div className="absolute right-4 bottom-4 left-4 rounded-xl bg-background p-4 shadow-md md:p-5">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-lighter">
                    <Lightbulb size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Founder, Pazelgreen Technologies
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Oluwadamilola Olowoseunre Roseline
                    </p>
                    <p className="text-xs text-muted-foreground">
                      System Architect | Innovation Leader | Mentor
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom — two small approach cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:max-w-3xl">
          {approachCards.map(({ icon: Icon, title, description }) => (
            <MotionCard
              key={title}
              className="group rounded-2xl border border-border bg-background p-6 transition-colors hover:border-primary-surface"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-lighter">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}
