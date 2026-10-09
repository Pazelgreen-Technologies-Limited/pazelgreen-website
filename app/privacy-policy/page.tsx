import type { Metadata } from "next";
import PrivacyPolicyContent from "./_components/PrivacyPolicyContent";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Privacy Policy | Pazelgreen Technologies",
  description:
    "Privacy policy and data governance practices of Pazelgreen Technologies and the PAGEX platform, complying with the Nigeria Data Protection Act (NDPA).",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="space-y-16 pt-28 pb-12 md:pt-32 md:pb-20">
      <FadeIn as="div">
        <PrivacyPolicyContent />
      </FadeIn>
    </main>
  );
}
