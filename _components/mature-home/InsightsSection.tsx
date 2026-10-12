import React from "react";
import { SITE_CONFIG } from "@/lib/site-config";
import { ImageWrapper } from "@/components/ImageWrapper";
import { ArrowRight, Clock } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

interface InsightsSectionProps {
  onNavigate: (path: string) => void;
  onSelectArticle?: (slug: string) => void;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({
  onNavigate,
  onSelectArticle,
}) => {
  const articles = SITE_CONFIG.insights.slice(0, 3);

  const handleClick = (slug: string) => {
    if (onSelectArticle) {
      onSelectArticle(slug);
    } else {
      onNavigate(`/insights#${slug}`);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-sand border-b border-brand-dark/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-brand/70">
              Market Intelligence & Research
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-brand tracking-tight">
              Latest Insights
            </h2>
            <p className="text-base text-charcoal-muted">
              Analysis on agricultural economics, post-harvest systems, and
              commodity market structures in emerging economies.
            </p>
          </div>

          <button
            onClick={() => onNavigate("/insights")}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:text-brand transition-colors group self-start sm:self-auto cursor-pointer"
          >
            <span>Read all articles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </FadeIn>

        {/* 3 Blog Cards with subtle stagger */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article, idx) => (
            <FadeIn
              key={article.id}
              delay={idx * 120}
              onClick={() => handleClick(article.slug)}
              className="group bg-white rounded-2xl overflow-hidden border border-brand-dark/10 shadow-xs hover:shadow-md hover:border-brand/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden">
                  <ImageWrapper
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6 pt-0 space-y-3">
                  {/* Clean unboxed metadata per zero-pill discipline */}
                  <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                    <span className="font-semibold text-brand">
                      {article.category}
                    </span>
                    <span>·</span>
                    <span>{article.publishedAt}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-heading text-brand group-hover:text-brand transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-charcoal-muted leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Author & Read Link */}
              <div className="px-6 pb-6 pt-2 border-t border-brand-dark/5 flex items-center justify-between text-xs">
                <span className="text-charcoal-muted">
                  By {article.author.name}
                </span>
                <span className="font-semibold text-brand group-hover:text-brand flex items-center gap-1">
                  Read article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
