import type { Metadata } from "next";
import TermsOfServiceContent from "./_components/TermsOfServiceContent";

export const metadata: Metadata = {
  title: "Terms of Service | Pazelgreen Technologies",
  description:
    "Terms and conditions governing use of Pazelgreen Technologies platforms, PAGEX commodity coordination, escrow trading, and data feeds.",
};

export default function TermsOfServicePage() {
  return (
    <main className="space-y-16 pt-28 pb-12 md:pt-32 md:pb-20">
      <TermsOfServiceContent />
    </main>
  );
}
