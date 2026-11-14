import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_company_settings_working_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_company_settings_social_links_platform" AS ENUM('facebook', 'x', 'linkedin', 'instagram', 'youtube', 'other');
  CREATE TYPE "public"."enum_company_settings_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum_company_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__company_settings_v_version_working_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum__company_settings_v_version_social_links_platform" AS ENUM('facebook', 'x', 'linkedin', 'instagram', 'youtube', 'other');
  CREATE TYPE "public"."enum__company_settings_v_version_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum__company_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_seo_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum_page_seo_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_seo_v_version_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum__page_seo_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "company_settings_department_contacts" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "email" varchar,
    "description" varchar
  );

  CREATE TABLE "company_settings_working_hours" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "day" "enum_company_settings_working_hours_day",
    "closed" boolean DEFAULT false,
    "opens" varchar,
    "closes" varchar
  );

  CREATE TABLE "company_settings_social_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "platform" "enum_company_settings_social_links_platform",
    "label" varchar,
    "url" varchar
  );

  CREATE TABLE "company_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "email" varchar,
    "phone" varchar,
    "address" varchar,
    "timezone" varchar DEFAULT 'Africa/Lagos',
    "review_state" "enum_company_settings_review_state" DEFAULT 'draft',
    "review_note" varchar,
    "created_by" varchar,
    "modified_by" varchar,
    "reviewed_by" varchar,
    "published_by" varchar,
    "submitted_at" timestamp(3) with time zone,
    "reviewed_at" timestamp(3) with time zone,
    "published_at" timestamp(3) with time zone,
    "_status" "enum_company_settings_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE "_company_settings_v_version_department_contacts" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "email" varchar,
    "description" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_company_settings_v_version_working_hours" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "day" "enum__company_settings_v_version_working_hours_day",
    "closed" boolean DEFAULT false,
    "opens" varchar,
    "closes" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_company_settings_v_version_social_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "platform" "enum__company_settings_v_version_social_links_platform",
    "label" varchar,
    "url" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_company_settings_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_email" varchar,
    "version_phone" varchar,
    "version_address" varchar,
    "version_timezone" varchar DEFAULT 'Africa/Lagos',
    "version_review_state" "enum__company_settings_v_version_review_state" DEFAULT 'draft',
    "version_review_note" varchar,
    "version_created_by" varchar,
    "version_modified_by" varchar,
    "version_reviewed_by" varchar,
    "version_published_by" varchar,
    "version_submitted_at" timestamp(3) with time zone,
    "version_reviewed_at" timestamp(3) with time zone,
    "version_published_at" timestamp(3) with time zone,
    "version__status" "enum__company_settings_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "page_seo" (
    "id" serial PRIMARY KEY NOT NULL,
    "home_title" varchar,
    "home_description" varchar,
    "about_title" varchar,
    "about_description" varchar,
    "solutions_title" varchar,
    "solutions_description" varchar,
    "join_us_title" varchar,
    "join_us_description" varchar,
    "contact_title" varchar,
    "contact_description" varchar,
    "review_state" "enum_page_seo_review_state" DEFAULT 'draft',
    "review_note" varchar,
    "created_by" varchar,
    "modified_by" varchar,
    "reviewed_by" varchar,
    "published_by" varchar,
    "submitted_at" timestamp(3) with time zone,
    "reviewed_at" timestamp(3) with time zone,
    "published_at" timestamp(3) with time zone,
    "_status" "enum_page_seo_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE "_page_seo_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_home_title" varchar,
    "version_home_description" varchar,
    "version_about_title" varchar,
    "version_about_description" varchar,
    "version_solutions_title" varchar,
    "version_solutions_description" varchar,
    "version_join_us_title" varchar,
    "version_join_us_description" varchar,
    "version_contact_title" varchar,
    "version_contact_description" varchar,
    "version_review_state" "enum__page_seo_v_version_review_state" DEFAULT 'draft',
    "version_review_note" varchar,
    "version_created_by" varchar,
    "version_modified_by" varchar,
    "version_reviewed_by" varchar,
    "version_published_by" varchar,
    "version_submitted_at" timestamp(3) with time zone,
    "version_reviewed_at" timestamp(3) with time zone,
    "version_published_at" timestamp(3) with time zone,
    "version__status" "enum__page_seo_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  ALTER TABLE "company_settings_department_contacts" ADD CONSTRAINT "company_settings_department_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_settings_working_hours" ADD CONSTRAINT "company_settings_working_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_settings_social_links" ADD CONSTRAINT "company_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_settings_v_version_department_contacts" ADD CONSTRAINT "_company_settings_v_version_department_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_company_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_settings_v_version_working_hours" ADD CONSTRAINT "_company_settings_v_version_working_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_company_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_settings_v_version_social_links" ADD CONSTRAINT "_company_settings_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_company_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "company_settings_department_contacts_order_idx" ON "company_settings_department_contacts" USING btree ("_order");
  CREATE INDEX "company_settings_department_contacts_parent_id_idx" ON "company_settings_department_contacts" USING btree ("_parent_id");
  CREATE INDEX "company_settings_working_hours_order_idx" ON "company_settings_working_hours" USING btree ("_order");
  CREATE INDEX "company_settings_working_hours_parent_id_idx" ON "company_settings_working_hours" USING btree ("_parent_id");
  CREATE INDEX "company_settings_social_links_order_idx" ON "company_settings_social_links" USING btree ("_order");
  CREATE INDEX "company_settings_social_links_parent_id_idx" ON "company_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "company_settings__status_idx" ON "company_settings" USING btree ("_status");
  CREATE INDEX "_company_settings_v_version_department_contacts_order_idx" ON "_company_settings_v_version_department_contacts" USING btree ("_order");
  CREATE INDEX "_company_settings_v_version_department_contacts_parent_id_idx" ON "_company_settings_v_version_department_contacts" USING btree ("_parent_id");
  CREATE INDEX "_company_settings_v_version_working_hours_order_idx" ON "_company_settings_v_version_working_hours" USING btree ("_order");
  CREATE INDEX "_company_settings_v_version_working_hours_parent_id_idx" ON "_company_settings_v_version_working_hours" USING btree ("_parent_id");
  CREATE INDEX "_company_settings_v_version_social_links_order_idx" ON "_company_settings_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_company_settings_v_version_social_links_parent_id_idx" ON "_company_settings_v_version_social_links" USING btree ("_parent_id");
  CREATE INDEX "_company_settings_v_version_version__status_idx" ON "_company_settings_v" USING btree ("version__status");
  CREATE INDEX "_company_settings_v_created_at_idx" ON "_company_settings_v" USING btree ("created_at");
  CREATE INDEX "_company_settings_v_updated_at_idx" ON "_company_settings_v" USING btree ("updated_at");
  CREATE INDEX "_company_settings_v_latest_idx" ON "_company_settings_v" USING btree ("latest");
  CREATE INDEX "page_seo__status_idx" ON "page_seo" USING btree ("_status");
  CREATE INDEX "_page_seo_v_version_version__status_idx" ON "_page_seo_v" USING btree ("version__status");
  CREATE INDEX "_page_seo_v_created_at_idx" ON "_page_seo_v" USING btree ("created_at");
  CREATE INDEX "_page_seo_v_updated_at_idx" ON "_page_seo_v" USING btree ("updated_at");
  CREATE INDEX "_page_seo_v_latest_idx" ON "_page_seo_v" USING btree ("latest");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "company_settings_department_contacts" CASCADE;
  DROP TABLE "company_settings_working_hours" CASCADE;
  DROP TABLE "company_settings_social_links" CASCADE;
  DROP TABLE "company_settings" CASCADE;
  DROP TABLE "_company_settings_v_version_department_contacts" CASCADE;
  DROP TABLE "_company_settings_v_version_working_hours" CASCADE;
  DROP TABLE "_company_settings_v_version_social_links" CASCADE;
  DROP TABLE "_company_settings_v" CASCADE;
  DROP TABLE "page_seo" CASCADE;
  DROP TABLE "_page_seo_v" CASCADE;
  DROP TYPE "public"."enum_company_settings_working_hours_day";
  DROP TYPE "public"."enum_company_settings_social_links_platform";
  DROP TYPE "public"."enum_company_settings_review_state";
  DROP TYPE "public"."enum_company_settings_status";
  DROP TYPE "public"."enum__company_settings_v_version_working_hours_day";
  DROP TYPE "public"."enum__company_settings_v_version_social_links_platform";
  DROP TYPE "public"."enum__company_settings_v_version_review_state";
  DROP TYPE "public"."enum__company_settings_v_version_status";
  DROP TYPE "public"."enum_page_seo_review_state";
  DROP TYPE "public"."enum_page_seo_status";
  DROP TYPE "public"."enum__page_seo_v_version_review_state";
  DROP TYPE "public"."enum__page_seo_v_version_status";`)
}
