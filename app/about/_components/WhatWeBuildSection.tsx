import Link from "next/link";
import {
  ArrowRight,
  Send,
  BarChart3,
  GraduationCap,
  LineChart,
} from "lucide-react";
import MotionCard from "@/components/MotionCard";

type CardVisual = "icon" | "bars" | "list" | "chart";

interface SolutionCard {
  icon: typeof Send;
  pillLabel: string;
  tag: string;
  title: string;
  description: string;
  visual: CardVisual;
}

// Four core solution areas Pazelgreen builds
const solutions: SolutionCard[] = [
  {
    icon: Send,
    pillLabel: "Value Chain Connected",
    tag: "Coordination",
    title: "Digital Coordination Systems",
    description:
      "Platforms that improve how agricultural stakeholders connect, collaborate, and operate across the value chain.",
    visual: "icon",
  },
  {
    icon: BarChart3,
    pillLabel: "Optimization",
    tag: "Optimization",
    title: "Resource Optimization Tools",
    description:
      "Solutions that help reduce waste, improve visibility, and make better use of agricultural resources.",
    visual: "bars",
  },
  {
    icon: GraduationCap,
    pillLabel: "Capacity",
    tag: "Capacity",
    title: "Capacity-Building Initiatives",
    description:
      "Programs and tools that strengthen skills, knowledge, and readiness across agricultural ecosystems.",
    visual: "list",
  },
  {
    icon: LineChart,
    pillLabel: "Data-Driven Decisions",
    tag: "Intelligence",
    title: "Agricultural Intelligence Solutions",
    description:
      "Data-driven systems that support better decisions, market visibility, and long-term value creation.",
    visual: "chart",
  },
];

export default function WhatWeBuildSection() {
  return (
    <section className="bg-background-alt px-6 py-16 md:py-24 font-sans text-foreground">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-surface bg-background px-4 py-1.5 text-xs font-semibold tracking-widest text-primary uppercase">
            <span>🛠️</span> What We Build
          </p>
          <h2 className="text-3xl font-extrabold text-foreground md:text-4xl lg:text-5xl">
            Solutions built for real agricultural scale
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground md:text-base">
            Pazelgreen builds solutions across key areas of agricultural
            transformation, helping systems become more connected, efficient,
            and data-driven.
          </p>
        </div>

        {/* 2x2 solution cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {solutions.map((card) => (
            <SolutionCardItem key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Reusable card rendering — pulls out the visual variant cleanly
function SolutionCardItem({
  icon: Icon,
  pillLabel,
  tag,
  title,
  description,
  visual,
}: SolutionCard) {
  return (
    <MotionCard className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-colors hover:border-primary-surface">
      {/* Visual header area */}
      <div className="relative flex h-44 items-end justify-start bg-primary-lighter p-6 md:h-48">
        {/* Top-left icon */}
        <div className="absolute top-5 left-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-background shadow-sm">
          <Icon size={20} className="text-primary" />
        </div>

        {/* Pill label — placed inside the visual area */}
        {(pillLabel === "Capacity" ||
          pillLabel === "Data-Driven Decisions") && (
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-surface bg-background px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {pillLabel}
          </span>
        )}

        {/* Visual variant */}
        {visual === "icon" && (
          <div className="ml-auto text-primary opacity-30">
            <Icon size={120} />
          </div>
        )}
        {visual === "bars" && <BarChartVisual />}
        {visual === "list" && <ListBarsVisual />}
        {visual === "chart" && <LineChartVisual />}
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {tag}
        </p>
        <h3 className="text-base font-bold text-foreground md:text-lg">
          {title}
        </h3>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          {description}
        </p>

        {/* Divider + Learn More link */}
        <div className="mt-auto pt-6">
          <div className="h-px w-full bg-border" />
          <Link
            href="/solutions"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            <ArrowRight size={16} /> Learn More
          </Link>
        </div>
      </div>
    </MotionCard>
  );
}

// Decorative visuals rendered inside the card top — these mimic the Figma mock
function BarChartVisual() {
  return (
    <div className="absolute right-6 bottom-5 flex items-end gap-1.5">
      {[28, 42, 56, 72, 88, 64, 48].map((h, i) => (
        <div
          key={i}
          className={`w-3 rounded-t-md ${
            i === 3
              ? "h-16 bg-primary"
              : i === 2
                ? "h-12 bg-primary/80"
                : "bg-primary/40"
          }`}
          style={{ height: `${h * 0.5}px` }}
        />
      ))}
    </div>
  );
}

function ListBarsVisual() {
  return (
    <div className="absolute right-6 bottom-5 space-y-1.5">
      {[80, 60, 70].map((w, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className={`h-2 rounded-full ${i === 0 ? "bg-primary" : "bg-primary/40"}`}
            style={{ width: `${w}px` }}
          />
          <div className="h-2 w-8 rounded-full bg-border" />
        </div>
      ))}
    </div>
  );
}

function LineChartVisual() {
  return (
    <div className="absolute right-6 bottom-5">
      <LineChart size={70} className="text-primary/70" />
    </div>
  );
}
