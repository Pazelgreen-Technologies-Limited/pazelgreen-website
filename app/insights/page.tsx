import type { Metadata } from "next";
import InsightsExplorer from "./_components/InsightsExplorer";

export const metadata: Metadata = {
  title: "Agricultural Market Insights | Pazelgreen Technologies",
  description:
    "Empirical research and value chain analysis on commodity pricing, post-harvest losses, and trade infrastructure in emerging agricultural economies.",
};

export default function InsightsPage() {
  return (
    <main className="space-y-16 pt-28 pb-12 md:pt-32 md:pb-20">
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-primary/70">
            Research & Intelligence
          </span>
          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-primary-darker sm:text-5xl lg:text-6xl">
            Insights on agricultural trade, policy & post-harvest tech.
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Rigorous analysis from our field deployments, econometric tracking
            of Nigerian commodity hubs, and supply chain engineering.
          </p>
          <p className="text-xs font-medium text-accent-dark">
            Sample articles and author profiles are placeholders pending
            publication.
          </p>
        </div>
      </section>

      <InsightsExplorer />
    </main>
  );
}
