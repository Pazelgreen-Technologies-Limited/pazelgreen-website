import Button from "@/components/ui/Button";
import { CheckCircle2, BookOpen } from "lucide-react";
import Link from "next/link";
import { StreamingText } from "@/components/StreamingText";

// Trust badges displayed below the CTA buttons
const trustBadges = ["Innovation-Led", "Systems-Focused", "Global Reach"];

export default function AboutHero() {
  return (
    <section className="bg-background px-6 pb-16 pt-28 font-sans md:pb-20 md:pt-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-primary/70">
            About Pazelgreen
          </p>
          <StreamingText
            as="h1"
            className="text-4xl font-extrabold text-primary-darker sm:text-5xl lg:text-6xl"
          >
            Building systems for agricultural transformation.
          </StreamingText>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Pazelgreen is an agritech innovation company creating solutions that
            strengthen agricultural systems, reduce inefficiencies, and drive
            sustainable development across emerging markets.
          </p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button
              href="/pagex"
              variant="solid"
              className="transition-transform duration-200 hover:-translate-y-0.5"
            >
              <BookOpen size={16} /> Explore PAGEX
            </Button>
            <Link
              href="#our-story"
              className="inline-flex items-center gap-2 rounded-xl border border-primary-darker px-6 py-3 text-sm font-medium text-primary-darker transition-colors hover:bg-primary-surface/40"
            >
              <CheckCircle2 size={16} /> Our Story
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6">
            {trustBadges.map((label) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <CheckCircle2 size={16} className="text-primary" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
