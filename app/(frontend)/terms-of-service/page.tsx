import { LegalDocument } from "@/components/LegalDocument";
import { getPublishedLegalPage, legalMetadata } from "@/lib/legal-pages";

export const generateMetadata = () => legalMetadata("terms-of-service");
export default async function TermsOfServicePage() {
  return <LegalDocument page={await getPublishedLegalPage("terms-of-service")} />;
}
