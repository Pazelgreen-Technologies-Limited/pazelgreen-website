"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Clock, ArrowRight, X, BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";
import { categories, insights, type InsightArticle } from "./insights-data";

export default function InsightsExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<InsightArticle | null>(
    null,
  );

  const filteredArticles = insights.filter((article) => {
    const matchesCat =
      selectedCategory === "All" || article.category === selectedCategory;
    const matchesQuery =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <>
      {/* Filter & search */}
      <section className="mx-auto mt-12 max-w-300 px-4 sm:px-6 lg:px-8">
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary-darker/10 bg-card p-4 shadow-sm sm:flex-row">
          <div className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary-darker text-inverse-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search research topics..."
              className="w-full rounded-xl border border-primary-darker/10 bg-background py-1.5 pr-3 pl-9 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="mx-auto max-w-300 px-4 sm:px-6 lg:px-8">
        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-primary-darker/10 bg-card p-8 py-16 text-center text-sm text-muted-foreground">
            No insights found matching your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => setActiveArticle(article)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveArticle(article);
                  }
                }}
                tabIndex={0}
                role="button"
                className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-primary-darker/10 bg-card transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <div className="space-y-4">
                  <div className="relative aspect-16/10 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>

                  <div className="space-y-3 p-6 pt-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">
                        {article.category}
                      </span>
                      <span>·</span>
                      <span>{article.publishedAt}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </div>

                    <h2 className="font-sans text-lg leading-snug font-bold text-primary-darker">
                      {article.title}
                    </h2>

                    <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-primary-darker/5 px-6 pt-2 pb-6 text-xs">
                  <span className="text-muted-foreground">
                    By {article.author.name}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {activeArticle && (
        <ArticleModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
        />
      )}
    </>
  );
}

function ArticleModal({
  article,
  onClose,
}: {
  article: InsightArticle;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-modal-title"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-primary-darker/20 bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-primary-dark/40 bg-primary-darker px-6 py-4 text-inverse-foreground">
          <div className="flex items-center gap-2 text-xs">
            <BookOpen className="h-4 w-4 text-primary-light" />
            <span className="font-semibold tracking-wide">
              Pazelgreen Research Dispatch
            </span>
            <span className="text-inverse-foreground/50">
              · {article.category}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close article"
            className="cursor-pointer rounded-lg p-1 text-inverse-foreground/70 transition-colors hover:bg-inverse-foreground/10 hover:text-inverse-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto p-6 sm:p-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-primary">
                {article.category}
              </span>
              <span>·</span>
              <span>{article.publishedAt}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>

            <h2
              id="article-modal-title"
              className="font-sans text-2xl leading-tight font-extrabold text-primary-darker sm:text-3xl"
            >
              {article.title}
            </h2>

            <div className="flex items-center gap-3 border-b border-primary-darker/10 pt-1 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-surface text-xs font-bold text-primary-darker">
                {article.author.name.charAt(0)}
              </div>
              <div className="text-xs">
                <div className="font-bold text-primary-darker">
                  {article.author.name}
                </div>
                <div className="text-muted-foreground">
                  {article.author.role}
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-foreground">
            {article.content.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-primary-darker/10 bg-background p-6 sm:flex-row sm:items-center">
            <div>
              <h4 className="mb-1 text-xs font-bold uppercase text-primary">
                Connect With Our Research Team
              </h4>
              <p className="text-xs text-muted-foreground">
                Request tailored value chain datasets or collaborative
                econometric studies.
              </p>
            </div>
            <Button
              variant="solid"
              href="/contact?type=partner"
              className="shrink-0"
            >
              Contact analysts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
