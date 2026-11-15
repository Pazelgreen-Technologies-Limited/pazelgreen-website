import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_announcements_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum_announcements_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__announcements_v_version_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum__announcements_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "announcements" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "message" varchar,
    "link_label" varchar,
    "link_u_r_l" varchar,
    "enabled" boolean DEFAULT true,
    "starts_at" timestamp(3) with time zone,
    "ends_at" timestamp(3) with time zone,
    "priority" numeric DEFAULT 0,
    "review_state" "enum_announcements_review_state" DEFAULT 'draft',
    "review_note" varchar,
    "created_by" varchar,
    "modified_by" varchar,
    "reviewed_by" varchar,
    "published_by" varchar,
    "submitted_at" timestamp(3) with time zone,
    "reviewed_at" timestamp(3) with time zone,
    "published_at" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_announcements_status" DEFAULT 'draft'
  );

  CREATE TABLE "_announcements_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_message" varchar,
    "version_link_label" varchar,
    "version_link_u_r_l" varchar,
    "version_enabled" boolean DEFAULT true,
    "version_starts_at" timestamp(3) with time zone,
    "version_ends_at" timestamp(3) with time zone,
    "version_priority" numeric DEFAULT 0,
    "version_review_state" "enum__announcements_v_version_review_state" DEFAULT 'draft',
    "version_review_note" varchar,
    "version_created_by" varchar,
    "version_modified_by" varchar,
    "version_reviewed_by" varchar,
    "version_published_by" varchar,
    "version_submitted_at" timestamp(3) with time zone,
    "version_reviewed_at" timestamp(3) with time zone,
    "version_published_at" timestamp(3) with time zone,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__announcements_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "announcements_id" integer;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_parent_id_announcements_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."announcements"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "announcements_updated_at_idx" ON "announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at");
  CREATE INDEX "announcements__status_idx" ON "announcements" USING btree ("_status");
  CREATE INDEX "_announcements_v_parent_idx" ON "_announcements_v" USING btree ("parent_id");
  CREATE INDEX "_announcements_v_version_version_updated_at_idx" ON "_announcements_v" USING btree ("version_updated_at");
  CREATE INDEX "_announcements_v_version_version_created_at_idx" ON "_announcements_v" USING btree ("version_created_at");
  CREATE INDEX "_announcements_v_version_version__status_idx" ON "_announcements_v" USING btree ("version__status");
  CREATE INDEX "_announcements_v_created_at_idx" ON "_announcements_v" USING btree ("created_at");
  CREATE INDEX "_announcements_v_updated_at_idx" ON "_announcements_v" USING btree ("updated_at");
  CREATE INDEX "_announcements_v_latest_idx" ON "_announcements_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("announcements_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "announcements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_announcements_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "announcements" CASCADE;
  DROP TABLE "_announcements_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_announcements_fk";

  DROP INDEX "payload_locked_documents_rels_announcements_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "announcements_id";
  DROP TYPE "public"."enum_announcements_review_state";
  DROP TYPE "public"."enum_announcements_status";
  DROP TYPE "public"."enum__announcements_v_version_review_state";
  DROP TYPE "public"."enum__announcements_v_version_status";`)
}
