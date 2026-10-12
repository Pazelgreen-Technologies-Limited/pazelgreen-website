import React from "react";
import { SITE_CONFIG } from "@/lib/site-config";
import {
  ArrowRight,
  Compass,
  ShieldAlert,
  GraduationCap,
  BarChart4,
} from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

interface CapabilitiesGridProps {
  onNavigate: (path: string) => void;
}

export const CapabilitiesGrid: React.FC<CapabilitiesGridProps> = ({
  onNavigate,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case "market-coordination":
        return <Compass className="w-5 h-5 text-brand" />;
      case "waste-reduction":
        return <ShieldAlert className="w-5 h-5 text-brand" />;
      case "capacity-building":
        return <GraduationCap className="w-5 h-5 text-brand" />;
      case "data-intelligence":
        return <BarChart4 className="w-5 h-5 text-brand" />;
      default:
        return <ArrowRight className="w-5 h-5 text-brand" />;
    }
  };

  return (
    <section className="py-20 md:py-28 bg-sand border-b border-brand-dark/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
        {/* Section Header */}
        <FadeIn className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-brand/70">
              Comprehensive Strategic Scope
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-brand tracking-tight leading-tight">
              More than one product.
            </h2>
            <p className="text-base text-charcoal-muted leading-relaxed">
              Pazelgreen combines digital coordination with on-the-ground
              capability building and post-harvest optimization across four
              interconnected pillars.
            </p>
          </div>

          <button
            onClick={() => onNavigate("/solutions")}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:text-brand transition-colors group self-start md:self-auto cursor-pointer"
          >
            <span>Explore all solutions in depth</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </FadeIn>

        {/* 2x2 Capabilities Grid with subtle stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SITE_CONFIG.capabilities.map((cap, idx) => (
            <FadeIn
              key={cap.id}
              delay={idx * 100}
              onClick={() => onNavigate("/solutions")}
              className="p-8 rounded-2xl bg-white border border-brand-dark/10 shadow-xs hover:border-brand hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-sage flex items-center justify-center border border-brand-dark/10 group-hover:bg-brand group-hover:text-white transition-colors">
                  {getIcon(cap.id)}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-heading text-brand group-hover:text-brand transition-colors leading-snug">
                  {cap.title}
                </h3>

                {/* Exactly one line / concise summary */}
                <p className="text-sm text-charcoal-muted leading-relaxed line-clamp-2">
                  {cap.summary}
                </p>
              </div>

              {/* Arrow Link to Solutions */}
              <div className="pt-4 border-t border-brand-dark/8 flex items-center justify-between text-xs font-semibold text-brand group-hover:text-brand">
                <span>Discover approach & outcomes</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
