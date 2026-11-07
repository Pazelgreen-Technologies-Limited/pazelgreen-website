import { ActivationForm } from "./_components/ActivationForm";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };

export default function AcceptInvitationPage() {
  return <main className="cms:mx-auto cms:my-[10vh] cms:max-w-lg cms:p-6">
    <h1>Activate your CMS account</h1>
    <p>Choose a password of at least 12 characters. Invitation links expire after 24 hours.</p>
    <ActivationForm />
  </main>;
}
