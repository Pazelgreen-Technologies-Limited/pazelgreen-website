import { LegalDocument } from "@/components/LegalDocument";
import { getPublishedLegalPage, legalMetadata } from "@/lib/legal-pages";

export const generateMetadata = () => legalMetadata("privacy-policy");
export default async function PrivacyPolicyPage() {
  return <LegalDocument page={await getPublishedLegalPage("privacy-policy")} />;
}
