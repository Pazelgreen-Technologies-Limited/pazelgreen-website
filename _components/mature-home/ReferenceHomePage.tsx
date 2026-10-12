"use client";

import React from "react";
import { SEOHead } from "@/components/SEOHead";
import { Hero } from "./Hero";
import { CredibilityStrip } from "./CredibilityStrip";
import { ProblemSection } from "./ProblemSection";
import { PagexSection } from "./PagexSection";
import { CapabilitiesGrid } from "./CapabilitiesGrid";
import { ProofSection } from "./ProofSection";
import { VisionBand } from "./VisionBand";
import { InsightsSection } from "./InsightsSection";
import { ClosingCta } from "./ClosingCta";

interface HomePageProps {
  onNavigate: (path: string) => void;
  onWatchDemo: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onWatchDemo,
}) => {
  return (
    <>
      <SEOHead
        title="Pazelgreen Technologies | PAGEX - The Agricultural Coordination Layer"
        description="PAGEX connects farmers, buyers and service providers on one platform, with real-time market prices, transparent transactions and end-to-end traceability."
      />

      {/* 1. HERO */}
      <Hero onNavigate={onNavigate} />

      {/* 2. CREDIBILITY STRIP */}
      <CredibilityStrip />

      {/* 3. THE PROBLEM */}
      <ProblemSection />

      {/* 4. PAGEX (Centerpiece Deep Green Section) */}
      <PagexSection onNavigate={onNavigate} onWatchDemo={onWatchDemo} />

      {/* 5. BEYOND THE PLATFORM: Capabilities Grid */}
      <CapabilitiesGrid onNavigate={onNavigate} />

      {/* 6. PROOF: Case-studies / Testimonials */}
      <ProofSection />

      {/* 7. VISION BAND */}
      <VisionBand />

      {/* 8. LATEST INSIGHTS */}
      <InsightsSection onNavigate={onNavigate} />

      {/* 9. CLOSING CTA */}
      <ClosingCta onNavigate={onNavigate} />
    </>
  );
};
