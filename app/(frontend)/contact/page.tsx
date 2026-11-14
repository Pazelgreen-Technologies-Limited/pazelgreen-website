import { pageMetadata } from "@/lib/page-seo";

export const generateMetadata = () => pageMetadata("contact");

import ContactHero from "./_components/ContactHero";
import ContactForm from "./_components/ContactForm";
import CollaborateSection from "./_components/CollaborateSection";

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactForm />
      <CollaborateSection />
    </main>
  );
}
