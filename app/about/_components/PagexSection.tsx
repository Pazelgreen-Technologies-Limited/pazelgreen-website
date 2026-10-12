import Image from "next/image";
import Button from "@/components/ui/Button";
import { ArrowRight, BookOpen, Network, BarChart3, Sprout } from "lucide-react";

// Three feature highlights shown below the PAGEX description
const pagexFeatures = [
  {
    icon: Network,
    label: "Ecosystem Coordination",
  },
  {
    icon: BarChart3,
    label: "Market Intelligence",
  },
  {
    icon: Sprout,
    label: "Value Creation",
  },
];

export default function PagexSection() {
  return (
    <section className="bg-background-alt px-6 py-16 font-sans text-foreground md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-lg border border-border bg-card p-6 md:p-12">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
            {/* LEFT — copy column */}
            <div>
              <p className="mb-4 text-xs font-bold tracking-wider text-primary/70 uppercase">
                Flagship Product
              </p>
              <h2 className="text-5xl font-extrabold leading-none text-primary-darker md:text-6xl lg:text-7xl">
                PAGEX
              </h2>
              <p className="mt-3 text-base font-medium text-primary-darker md:text-lg">
                Ecosystem Coordination &amp; Market Intelligence Platform
              </p>

              <div className="mt-6 space-y-4 text-sm text-muted-foreground md:text-base">
                <p>
                  PAGEX is Pazelgreen&apos;s flagship platform designed to
                  support ecosystem coordination, market intelligence, and value
                  creation across agricultural systems.
                </p>
                <p>
                  PAGEX connects stakeholders across agricultural value chains,
                  enabling structured coordination, improved transparency, and
                  efficient market interactions.
                </p>
              </div>

              {/* Feature checklist */}
              <ul className="mt-6 space-y-3">
                {pagexFeatures.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-surface/60">
                      <Icon size={18} className="text-primary" />
                    </span>
                    <span className="text-sm font-medium text-foreground md:text-base">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href="/pagex"
                  variant="solid"
                  className="transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Explore PAGEX <ArrowRight size={16} />
                </Button>
                <Button
                  href="/solutions"
                  variant="outline"
                  className="border-primary text-primary transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/10"
                >
                  <BookOpen size={16} /> View Solutions
                </Button>
              </div>
            </div>

            {/* RIGHT — PAGEX network visualization */}
            <div className="relative mx-auto w-full max-w-md md:max-w-none">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                {/* Replace /about-pagex-network.png with the exported Figma asset */}
                <Image
                  src="/about-pagex-network.png"
                  alt="PAGEX network visualization"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
