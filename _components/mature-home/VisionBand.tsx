import React from "react";
import { SITE_CONFIG } from "@/lib/site-config";
import { FadeIn } from "@/components/FadeIn";

export const VisionBand: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-brand-dark text-white relative overflow-hidden border-y border-forest-light">
      {/* Subtle organic watermark accent */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
        <span className="text-[180px] font-extrabold text-white select-none">
          PAGEX
        </span>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
        <FadeIn className="space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-brand">
            Our Guiding Mandate
          </span>
          {/* Exactly one sentence only */}
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-[1.25]">
            {`"${SITE_CONFIG.vision.statement}"`}
          </p>
        </FadeIn>
      </div>
    </section>
  );
};
