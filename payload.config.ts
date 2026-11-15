import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { getServerEnvironment } from "./env";
import { Users } from "./cms/users";
import { Invitations } from "./cms/invitations";
import { AuditEvents } from "./cms/audit";
import { createMedia, createPrivateFiles } from "./cms/media";
import { previewEndpoint } from "./cms/preview";
import { CompanySettings } from "./cms/company-settings";
import { PageSEO } from "./cms/page-seo";
import { Categories, Posts } from "./cms/blog";
import { AnnualAdvertCounters, Departments, EmploymentTypes, Jobs, PositionCodes } from "./cms/careers";
import { Applications, HiringHistory, RecruitmentDelivery, RecruitmentSettings } from "./cms/recruitment";
import { FAQs } from "./cms/faqs";
import { Announcements } from "./cms/announcements";

nextEnv.loadEnvConfig(process.cwd());
const env = getServerEnvironment();
const root = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  // CLI setup must finish without a background telemetry network request.
  telemetry: false,
  secret: env.secret,
  serverURL: env.serverURL,
  admin: { user: "users", importMap: { baseDir: root }, meta: { titleSuffix: " | Pazelgreen CMS" } },
  db: postgresAdapter({ pool: { connectionString: env.databaseURL }, push: false, migrationDir: path.resolve(root, "migrations") }),
  email: nodemailerAdapter({ defaultFromAddress: env.emailFrom, defaultFromName: "Pazelgreen", transportOptions: env.smtp, skipVerify: true }),
  editor: lexicalEditor(),
  sharp,
  collections: [Users, Invitations, AuditEvents, createMedia(env.publicStorage), createPrivateFiles(env.privateStorage), Categories, Posts, EmploymentTypes, Departments, PositionCodes, Jobs, AnnualAdvertCounters, Applications, HiringHistory, FAQs, Announcements],
  globals: [CompanySettings, PageSEO, RecruitmentSettings, RecruitmentDelivery],
  endpoints: [previewEndpoint],
  typescript: { outputFile: path.resolve(root, "payload-types.ts") },
  csrf: [env.serverURL],
  cors: [env.serverURL],
  graphQL: { disable: true },
  upload: { limits: { fileSize: 5 * 1024 * 1024 }, abortOnLimit: true },
});
