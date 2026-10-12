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
    <main className="space-y-20 pt-28 pb-12 md:pt-32 md:pb-20">
      <JoinHero />
      <RolesSection />
      <ImpactBanner />
      <CareersSection />
      <VolunteerSection />
      <PartnershipsSection />
      <FutureBanner />
    </main>
  );
}
