import React, { useState } from "react";
import { SITE_CONFIG } from "@/lib/site-config";
import { MapPin, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

export const ProofSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const studies = SITE_CONFIG.proof.caseStudies;

  // If proof section is disabled or has no case studies, hide entirely as requested
  if (!SITE_CONFIG.proof.enabled || !studies.length) {
    return null;
  }

  const current = studies[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % studies.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + studies.length) % studies.length);
  };

  return (
    <section className="py-20 md:py-28 bg-sage/40 border-b border-brand-dark/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-brand/70">
              Illustrative case study placeholder
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-brand tracking-tight">
              {SITE_CONFIG.proof.title}
            </h2>
            <p className="text-sm sm:text-base text-charcoal-muted">
              {SITE_CONFIG.proof.subtitle}
            </p>
          </div>

          {/* Carousel navigation controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrev}
              aria-label="Previous case study"
              className="p-2.5 rounded-xl bg-white border border-brand-dark/15 text-brand hover:bg-brand-dark hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next case study"
              className="p-2.5 rounded-xl bg-white border border-brand-dark/15 text-brand hover:bg-brand-dark hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </FadeIn>

        {/* Featured Case Study Card */}
        <FadeIn
          delay={120}
          className="p-8 sm:p-12 rounded-3xl bg-white border border-brand-dark/12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Left Column: Quote and Stakeholder (span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-sage text-brand font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand" />
                {current.location}
              </span>
              <span className="text-charcoal-muted font-medium">
                · {current.corridor}
              </span>
            </div>

            <div className="relative">
              <Quote className="w-10 h-10 text-brand/20 absolute -top-4 -left-4 -z-0" />
              <blockquote className="text-lg sm:text-xl text-brand font-medium leading-relaxed italic relative z-10">
                {`"${current.quote}"`}
              </blockquote>
            </div>

            <div className="pt-2 border-t border-brand-dark/10 flex flex-col">
              <span className="text-sm font-bold text-brand font-heading">
                {current.author}
              </span>
              <span className="text-xs text-charcoal-muted">
                {current.role} ·{" "}
                <strong className="text-charcoal font-semibold">
                  {current.stakeholder}
                </strong>
              </span>
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed pt-1">
              {current.impactDescription}
            </p>
          </div>

          {/* Right Column: Key Metrics (span 5) */}
          <div className="lg:col-span-5 bg-sand p-6 sm:p-8 rounded-2xl border border-brand-dark/10 space-y-5">
            <span className="text-xs uppercase font-bold text-brand/70 tracking-wider block">
              Operational Metrics
            </span>

            <div className="space-y-4">
              {current.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-brand-dark/8"
                >
                  <span className="text-xs text-charcoal-muted font-medium">
                    {m.label}
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold font-heading text-brand">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-charcoal-muted text-center">
              Corridor {activeIndex + 1} of {studies.length} active value chain
              deployments
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
