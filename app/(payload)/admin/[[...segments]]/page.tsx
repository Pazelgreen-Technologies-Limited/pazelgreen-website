import type { Metadata } from "next";
import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

export default async function AdminPage({ params, searchParams }: Args) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (user?.mustChangePassword) redirect("/admin/change-initial-password");
  return RootPage({ config, params, searchParams, importMap });
}
