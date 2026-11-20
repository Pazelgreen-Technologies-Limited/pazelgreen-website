import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { InitialPasswordForm } from "./_components/InitialPasswordForm";

export const metadata: Metadata = { title: "Change initial password", robots: { index: false, follow: false } };

export default async function ChangeInitialPasswordPage() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login");
  if (!user.mustChangePassword) redirect("/admin");
  return <main className="cms:mx-auto cms:my-[10vh] cms:max-w-lg cms:p-6">
    <h1>Choose your own password</h1>
    <p>Replace your initial password before using the CMS. You can update your email here too.</p>
    <InitialPasswordForm id={user.id} email={user.email} />
  </main>;
}
