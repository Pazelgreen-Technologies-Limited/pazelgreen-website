import React from "react";
import { SITE_CONFIG } from "@/lib/site-config";
import { AlertTriangle, GitFork, FileQuestion } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

export const ProblemSection: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case "post-harvest-loss":
        return <AlertTriangle className="w-6 h-6 text-amber" />;
      case "fragmented-markets":
        return <GitFork className="w-6 h-6 text-brand" />;
      case "data-gaps":
        return <FileQuestion className="w-6 h-6 text-brand" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-brand" />;
    }
  };

  return (
    <section className="py-20 md:py-28 bg-sage/50 border-b border-brand-dark/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
        {/* Section Header */}
        <FadeIn className="max-w-2xl space-y-4">
          <span className="text-xs uppercase font-bold tracking-wider text-brand/70">
            Systemic Inefficiencies
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-brand tracking-tight leading-tight">
            {SITE_CONFIG.theProblem.heading}
          </h2>
          <p className="text-base text-charcoal-muted leading-relaxed">
            Across West African agricultural corridors, the disconnect between
            rural producers and commercial buyers creates severe value
            destruction before produce ever arrives at the consumer table.
          </p>
        </FadeIn>

        {/* 3 Pain Cards (Pain only, no solutions) with subtle stagger */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SITE_CONFIG.theProblem.cards.map((card, idx) => (
            <FadeIn
              key={card.id}
              delay={idx * 120}
              className="p-7 sm:p-8 rounded-2xl bg-white border border-brand-dark/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-sand flex items-center justify-center border border-brand-dark/10">
                  {getIcon(card.id)}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-heading text-brand">
                  {card.title}
                </h3>

                {/* Two sentences pain description */}
                <p className="text-sm text-charcoal-muted leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Stat Slot with Placeholder comment */}
              {/* TODO: Add verified sourced statistic citation from ongoing empirical surveys */}
              <div className="pt-4 border-t border-brand-dark/10 space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-brand">
                  {card.statValue}
                </div>
                <div className="text-xs font-medium text-charcoal">
                  {card.statLabel}
                </div>
                <div className="text-[10px] text-charcoal-muted italic">
                  Source: {card.statSource}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
