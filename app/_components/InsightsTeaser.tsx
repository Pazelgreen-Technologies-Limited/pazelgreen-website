import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { insights } from "@/app/insights/_components/insights-data";

export default function InsightsTeaser() {
  const latestInsights = insights.slice(0, 3);

  return (
    <section className="bg-background-alt px-6 py-16 md:py-20">
      <div className="mx-auto max-w-300">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-primary/70">
              Research &amp; intelligence
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-primary-darker sm:text-4xl">
              Latest Insights
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Perspectives on market coordination, value chains, and
              post-harvest systems across emerging markets.
            </p>
          </div>
          <Link
            href="/insights"
            className="group inline-flex shrink-0 items-center gap-2 font-semibold text-primary-darker transition-colors hover:text-primary"
          >
            Explore all insights
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {latestInsights.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-surface hover:shadow-lg"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">
                    {article.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{article.publishedAt}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="mt-3 line-clamp-2 text-lg leading-snug font-bold text-primary-darker">
                  {article.title}
                </h3>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {article.summary}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs">
                  <span className="text-muted-foreground">
                    By {article.author.name}
                  </span>
                  <Link
                    href="/insights"
                    className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary-darker hover:text-primary"
                  >
                    Read insights <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
