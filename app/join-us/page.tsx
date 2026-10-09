import JoinHero from "./_components/JoinHero";
import RolesSection from "./_components/RolesSection";
import ImpactBanner from "./_components/ImpactBanner";
import CareersSection from "./_components/CareersSection";
import VolunteerSection from "./_components/VolunteerSection";
import PartnershipsSection from "./_components/PartnershipsSection";
import FutureBanner from "./_components/FutureBanner";
import { FadeIn } from "@/components/FadeIn";

export default function JoinUsPage() {
  return (
    <main>
      <JoinHero />
      <FadeIn as="div">
        <RolesSection />
      </FadeIn>
      <FadeIn as="div">
        <ImpactBanner />
      </FadeIn>
      <FadeIn as="div">
        <CareersSection />
      </FadeIn>
      <FadeIn as="div">
        <VolunteerSection />
      </FadeIn>
      <FadeIn as="div">
        <PartnershipsSection />
      </FadeIn>
      <FadeIn as="div">
        <FutureBanner />
      </FadeIn>
    </main>
  );
}
