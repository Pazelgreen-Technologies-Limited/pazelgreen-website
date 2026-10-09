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
    <section className="bg-green-50 px-6 py-16 md:py-24 font-sans text-gray-900">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 to-green-100 p-6 md:p-12">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
            {/* LEFT — copy column */}
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-background px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Flagship Product
              </p>
              <h2 className="text-5xl font-extrabold leading-none text-green-900 md:text-6xl lg:text-7xl">
                PAGEX
              </h2>
              <p className="mt-3 text-base font-medium text-primary md:text-lg">
                Ecosystem Coordination &amp; Market Intelligence Platform
              </p>

              <div className="mt-6 space-y-4 text-sm text-gray-700 md:text-base">
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
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-green-100">
                      <Icon size={18} className="text-primary" />
                    </span>
                    <span className="text-sm font-medium text-gray-800 md:text-base">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/pagex" variant="solid">
                  Explore PAGEX <ArrowRight size={16} />
                </Button>
                <Button
                  href="/solutions"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
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
