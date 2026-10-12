import type { Metadata } from "next";
import SolutionsHeader from "./_components/SolutionsHeader";
import SolutionPillars from "./_components/SolutionPillars";
import SolutionsCTA from "./_components/SolutionsCTA";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Strategic Solutions | Pazelgreen Technologies",
  description:
    "Explore Pazelgreen's comprehensive solutions: Market Coordination, Post-Harvest Waste Reduction, Capacity Building, and Data & Intelligence for African agriculture.",
};

export default function SolutionPage() {
  return (
    <main className="space-y-20 pt-28 pb-12 md:pt-32 md:pb-20">
      <SolutionsHeader />
      <SolutionPillars />
      <SolutionsCTA />
    </main>
  );
}
