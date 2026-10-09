import type { Metadata } from "next";
import ContactHeader from "./_components/ContactHeader";
import ContactForm, {
  type StakeholderType,
} from "./_components/ContactForm";
import ContactAside from "./_components/ContactAside";

export const metadata: Metadata = {
  title: "Talk to Us | Pazelgreen Technologies",
  description:
    "Connect with Pazelgreen Technologies in Ikorodu, Lagos, Nigeria. Inquire about PAGEX platform access, commercial off-take partnerships, or institutional investments.",
};

type ContactPageProps = {
  searchParams: Promise<{ type?: string | string[] }>;
};

function resolveStakeholderType(
  typeParam: string | string[] | undefined,
): StakeholderType {
  const value = Array.isArray(typeParam) ? typeParam[0] : typeParam;
  const lowerValue = value?.toLowerCase() ?? "";

  if (lowerValue.includes("buyer") || lowerValue.includes("pagex")) {
    return "Buyer";
  }
  if (lowerValue.includes("investor")) {
    return "Investor";
  }
  if (lowerValue.includes("partner")) {
    return "Partner";
  }
  if (lowerValue.includes("career") || lowerValue.includes("job")) {
    return "Job seeker";
  }
  return "Farmer";
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const initialStakeholderType = resolveStakeholderType(
    (await searchParams).type,
  );

  return (
    <main className="space-y-16 pt-28 pb-12 md:pt-32 md:pb-20">
      <ContactHeader />

      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <ContactForm initialStakeholderType={initialStakeholderType} />
          <ContactAside />
        </div>
      </section>
    </main>
  );
}
