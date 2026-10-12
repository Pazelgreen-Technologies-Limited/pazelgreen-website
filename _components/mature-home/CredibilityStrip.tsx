import React from "react";
import { SITE_CONFIG } from "@/lib/site-config";
import { Building2 } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

export const CredibilityStrip: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-sand border-y border-brand-dark/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Key Metrics Row with subtle stagger */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {SITE_CONFIG.credibility.metrics.map((metric, idx) => (
            <FadeIn
              key={idx}
              delay={idx * 100}
              className="p-5 rounded-2xl bg-white border border-brand-dark/8 shadow-xs hover:border-brand/40 transition-colors"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-brand tracking-tight">
                {metric.value}
              </div>
              <div className="text-sm font-semibold text-charcoal mt-1.5 leading-snug">
                {metric.label}
              </div>
              <div className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                {metric.subtext}
              </div>
            </FadeIn>
          ))}
        </div>
        <p className="text-center text-xs text-amber-dark">
          Illustrative placeholder figures and partner names pending
          verification.
        </p>

        {/* Working with Logo / Partner Strip */}
        <FadeIn delay={250} className="pt-2 border-t border-brand-dark/5 space-y-4">
          <div className="text-center">
            <span className="text-xs uppercase font-semibold text-charcoal-muted tracking-widest">
              Working with agricultural cooperatives, off-takers & logistics
              providers across Nigeria
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-10 opacity-80">
            {SITE_CONFIG.credibility.partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/70 border border-brand-dark/10 text-xs text-charcoal shadow-2xs hover:bg-white hover:border-brand/30 transition-colors"
              >
                <Building2 className="w-4 h-4 text-brand shrink-0" />
                <div>
                  <span className="font-semibold block text-brand leading-tight">
                    {partner.name}
                  </span>
                  <span className="text-[10px] text-charcoal-muted block">
                    {partner.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
