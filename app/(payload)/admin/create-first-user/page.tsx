import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function FirstAdministratorSetup() {
  return <main className="cms:mx-auto cms:my-[10vh] cms:max-w-xl cms:p-6">
    <h1>Administrator setup</h1>
    <p>The first administrator must be created by the person configuring this server.</p>
    <p>Set the bootstrap administrator email and password in the server environment, then run <code>pnpm cms:bootstrap</code>. Setup instructions are in <code>docs/cms-setup.md</code>.</p>
    <p>Once setup is complete, an administrator can invite staff from the CMS.</p>
    <Link href="/admin/login">Sign in</Link>
  </main>;
}
