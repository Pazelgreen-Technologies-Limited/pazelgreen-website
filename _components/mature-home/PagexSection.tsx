import React, { useState } from "react";
import { SITE_CONFIG } from "@/lib/site-config";
import Button from "@/components/ui/Button";
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Play,
  Layers,
  Sparkles,
  Users,
  Store,
  Truck,
} from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

interface PagexSectionProps {
  onNavigate: (path: string) => void;
  onWatchDemo: () => void;
}

type AudienceId = "farmers" | "buyers" | "providers";

const isAudienceId = (id: string): id is AudienceId =>
  id === "farmers" || id === "buyers" || id === "providers";

export const PagexSection: React.FC<PagexSectionProps> = ({
  onNavigate,
  onWatchDemo,
}) => {
  const [activeAudienceId, setActiveAudienceId] = useState<
    "farmers" | "buyers" | "providers"
  >("farmers");

  const activeAudience =
    SITE_CONFIG.pagex.audiences.find((a) => a.id === activeAudienceId) ||
    SITE_CONFIG.pagex.audiences[0];

  const getBenefitIcon = (index: number) => {
    switch (index) {
      case 0:
        return <TrendingUp className="w-6 h-6 text-brand" />;
      case 1:
        return <ShieldCheck className="w-6 h-6 text-brand" />;
      case 2:
        return <Layers className="w-6 h-6 text-brand" />;
      default:
        return <CheckCircle2 className="w-6 h-6 text-brand" />;
    }
  };

  const getAudienceIcon = (id: string) => {
    switch (id) {
      case "farmers":
        return <Users className="w-4 h-4" />;
      case "buyers":
        return <Store className="w-4 h-4" />;
      case "providers":
        return <Truck className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <section className="py-20 md:py-28 bg-brand-dark text-white relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-forest-light rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20 relative z-10">
        {/* Header Block */}
        <FadeIn className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-brand">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PAGEX Ecosystem Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            {SITE_CONFIG.pagex.heading}
          </h2>

          {/* Exactly one plain sentence */}
          <p className="text-lg sm:text-xl text-white/85 font-normal leading-relaxed">
            {SITE_CONFIG.pagex.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate("/pagex")}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore PAGEX
            </Button>

            <Button
              variant="outline-white"
              size="lg"
              onClick={onWatchDemo}
              icon={<Play className="w-4 h-4 fill-current" />}
            >
              Watch demo
            </Button>
          </div>
        </FadeIn>

        {/* 3 Core Benefit Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SITE_CONFIG.pagex.benefits.map((benefit, index) => (
            <FadeIn
              key={benefit.id}
              delay={index * 120}
              className="p-7 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-brand/50 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                  {getBenefitIcon(index)}
                </div>

                <h3 className="text-xl font-bold font-heading text-white leading-snug">
                  {benefit.title}
                </h3>

                <p className="text-sm text-white/75 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Specific Highlights */}
              <ul className="space-y-2 pt-4 border-t border-white/10 text-xs text-white/80">
                {benefit.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>

        {/* Tabbed "Who it's for" Element */}
        <FadeIn
          delay={150}
          className="p-6 sm:p-10 rounded-2xl md:rounded-3xl bg-white/5 border border-white/15 backdrop-blur-xs space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-brand tracking-wider block mb-1">
                Value for Every Stakeholder
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                Who PAGEX is built for
              </h3>
            </div>

            {/* Audience Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-black/20 rounded-xl border border-white/10">
              {SITE_CONFIG.pagex.audiences.map((aud) => (
                <button
                  key={aud.id}
                  onClick={() => {
                    if (isAudienceId(aud.id)) setActiveAudienceId(aud.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeAudienceId === aud.id
                      ? "bg-brand text-white shadow-sm"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {getAudienceIcon(aud.id)}
                  <span>{aud.title.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Audience Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            <div className="lg:col-span-7 space-y-4">
              <div className="text-lg sm:text-xl font-semibold text-white font-heading">
                {activeAudience.title}
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                {activeAudience.tagline}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeAudience.benefits.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-white/90"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 p-6 rounded-2xl border border-white/15 space-y-4 text-center sm:text-left">
              <span className="text-xs uppercase font-semibold text-brand tracking-wider">
                Direct Integration
              </span>
              <h4 className="text-base font-bold text-white font-heading">
                Ready to connect your supply network?
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Onboard your cooperative, processing facility, or logistics
                fleet into verified trading corridors within 48 hours.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate(`/contact?type=${activeAudience.id}`)}
                className="w-full font-semibold"
              >
                {activeAudience.ctaText}
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
