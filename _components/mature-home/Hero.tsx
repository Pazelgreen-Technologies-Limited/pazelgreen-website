import React from "react";
import { SITE_CONFIG } from "@/lib/site-config";
import Button from "@/components/ui/Button";
import { PagexMockup } from "@/components/PagexMockup";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ImageWrapper } from "@/components/ImageWrapper";
import { FadeIn } from "@/components/FadeIn";

interface HeroProps {
  onNavigate: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-sage/60 via-transparent to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn
          duration={650}
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage border border-brand-dark/10 text-xs font-semibold text-brand">
            <span className="w-2 h-2 rounded-full bg-brand" />
            <span>{SITE_CONFIG.hero.eyebrow}</span>
          </div>

          {/* H1 - Exactly one H1 per page */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-brand tracking-tight leading-[1.12]">
            {SITE_CONFIG.hero.h1}
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg lg:text-xl text-charcoal-muted font-normal leading-relaxed max-w-2xl mx-auto">
            {SITE_CONFIG.hero.subtext}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="forest"
              size="lg"
              onClick={() => onNavigate(SITE_CONFIG.hero.primaryCta.href)}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shadow-md"
            >
              {SITE_CONFIG.hero.primaryCta.text}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate(SITE_CONFIG.hero.secondaryCta.href)}
              className="w-full sm:w-auto"
            >
              {SITE_CONFIG.hero.secondaryCta.text}
            </Button>
          </div>

          {/* Micro trust cues */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-charcoal-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand" />
              Real-time daily spot index
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand" />
              Escrow-protected fulfillment
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand" />
              End-to-end batch traceability
            </span>
          </div>
        </FadeIn>

        {/* Floating Mockup with Farm Backdrop */}
        <FadeIn
          delay={150}
          duration={750}
          className="mt-12 sm:mt-16 relative max-w-5xl mx-auto"
        >
          {/* Subtle farm photography background behind floating mockup with dark-green gradient overlay */}
          <div className="absolute -inset-4 sm:-inset-6 rounded-3xl overflow-hidden -z-10 shadow-lg">
            <ImageWrapper
              src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1600&q=80"
              alt="Nigerian agricultural farmland with lush crops"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="w-full h-full object-cover scale-105 filter blur-[2px]"
              overlayGradient={true}
            />
          </div>

          {/* Floating code-built PAGEX dashboard card */}
          <div className="relative p-2 sm:p-4 rounded-2xl md:rounded-3xl bg-white/20 backdrop-blur-md border border-white/40 shadow-2xl">
            <PagexMockup />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
