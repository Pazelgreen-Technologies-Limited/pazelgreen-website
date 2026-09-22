import Link from "next/link";
import { ArrowRight, Send, BarChart3, GraduationCap, LineChart } from "lucide-react";

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
    <section className="bg-gray-50 px-6 py-16 md:py-24 font-sans text-gray-900">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-widest text-brand uppercase">
            <span>🛠️</span> What We Build
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
            Solutions built for real agricultural scale
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-gray-600 md:text-base">
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
    <article className="flex flex-col overflow-hidden rounded-2xl border border-green-100 bg-white transition-colors hover:border-green-200">
      {/* Visual header area */}
      <div className="relative flex h-44 items-end justify-start bg-green-50 p-6 md:h-48">
        {/* Top-left icon */}
        <div className="absolute top-5 left-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
          <Icon size={20} className="text-brand" />
        </div>

        {/* Pill label — placed inside the visual area */}
        {(pillLabel === "Capacity" || pillLabel === "Data-Driven Decisions") && (
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1 text-[10px] font-bold tracking-widest text-brand uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {pillLabel}
          </span>
        )}

        {/* Visual variant */}
        {visual === "icon" && (
          <div className="ml-auto text-brand opacity-30">
            <Icon size={120} />
          </div>
        )}
        {visual === "bars" && <BarChartVisual />}
        {visual === "list" && <ListBarsVisual />}
        {visual === "chart" && <LineChartVisual />}
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-brand uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {tag}
        </p>
        <h3 className="text-base font-bold text-gray-900 md:text-lg">{title}</h3>
        <p className="mt-3 text-sm text-gray-600 md:text-base">{description}</p>

        {/* Divider + Learn More link */}
        <div className="mt-auto pt-6">
          <div className="h-px w-full bg-gray-200" />
          <Link
            href="/solutions"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            <ArrowRight size={16} /> Learn More
          </Link>
        </div>
      </div>
    </article>
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
            i === 3 ? "h-16 bg-brand" : i === 2 ? "h-12 bg-brand/80" : "bg-brand/40"
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
            className={`h-2 rounded-full ${i === 0 ? "bg-brand" : "bg-brand/40"}`}
            style={{ width: `${w}px` }}
          />
          <div className="h-2 w-8 rounded-full bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

function LineChartVisual() {
  return (
    <div className="absolute right-6 bottom-5">
      <LineChart size={70} className="text-brand/70" />
    </div>
  );
}
