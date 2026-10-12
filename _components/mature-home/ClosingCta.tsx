import React from "react";
import { SITE_CONFIG } from "@/lib/site-config";
import Button from "@/components/ui/Button";
import { ArrowRight, Store, Handshake, Users2 } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

interface ClosingCtaProps {
  onNavigate: (path: string) => void;
}

export const ClosingCta: React.FC<ClosingCtaProps> = ({ onNavigate }) => {
  const getCardIcon = (id: string) => {
    switch (id) {
      case "use-pagex":
        return <Store className="w-5 h-5 text-brand" />;
      case "partner-invest":
        return <Handshake className="w-5 h-5 text-brand" />;
      case "join-team":
        return <Users2 className="w-5 h-5 text-brand" />;
      default:
        return <ArrowRight className="w-5 h-5 text-brand" />;
    }
  };

  return (
    <section className="py-20 md:py-28 bg-sage/50 border-b border-brand-dark/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <FadeIn className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-brand/70">
            Get Involved
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-brand tracking-tight">
            {SITE_CONFIG.closingCta.heading}
          </h2>
          <p className="text-base text-charcoal-muted leading-relaxed">
            {SITE_CONFIG.closingCta.subheading}
          </p>
        </FadeIn>

        {/* 3 Audience Cards with subtle stagger */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SITE_CONFIG.closingCta.cards.map((card, idx) => (
            <FadeIn
              key={card.id}
              delay={idx * 120}
              className="p-8 rounded-2xl bg-white border border-brand-dark/10 shadow-xs hover:border-brand hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-sage flex items-center justify-center border border-brand-dark/10">
                  {getCardIcon(card.id)}
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-brand uppercase tracking-wider block">
                    {card.audience}
                  </span>
                  <h3 className="text-2xl font-bold font-heading text-brand">
                    {card.title}
                  </h3>
                </div>

                <p className="text-sm text-charcoal-muted leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-dark/8">
                <Button
                  variant={card.id === "use-pagex" ? "forest" : "secondary"}
                  size="md"
                  onClick={() => onNavigate(card.href)}
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="w-full font-semibold"
                >
                  {card.ctaText}
                </Button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
