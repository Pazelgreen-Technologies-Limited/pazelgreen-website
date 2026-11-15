import { getPayload } from "payload";
import config from "@payload-config";
import { ApplicationForm } from "./ApplicationForm";

export async function ApplicationSection({ job }: { job: number }) {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: "recruitment-settings", draft: false, overrideAccess: false, depth: 0 });
  if (settings._status !== "published" || !settings.enabled || !settings.privacyNotice || !settings.noticeVersion) return <p className="mt-3 text-gray-600">Online applications are not currently available. Please check back for the application form.</p>;
  return <ApplicationForm job={job} notice={settings.privacyNotice} version={settings.noticeVersion} />;
}
