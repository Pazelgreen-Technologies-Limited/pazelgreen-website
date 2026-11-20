import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_legal_pages_identity" AS ENUM('privacy-policy', 'terms-of-service');
  CREATE TYPE "public"."enum_legal_pages_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum_legal_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_pages_v_version_identity" AS ENUM('privacy-policy', 'terms-of-service');
  CREATE TYPE "public"."enum__legal_pages_v_version_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum__legal_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "legal_pages" (
    "id" serial PRIMARY KEY NOT NULL,
    "identity" "enum_legal_pages_identity",
    "title" varchar,
    "body" jsonb,
    "effective_date" varchar,
    "seo_title" varchar,
    "seo_description" varchar,
    "review_state" "enum_legal_pages_review_state" DEFAULT 'draft',
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
    "_status" "enum_legal_pages_status" DEFAULT 'draft'
  );

  CREATE TABLE "_legal_pages_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_identity" "enum__legal_pages_v_version_identity",
    "version_title" varchar,
    "version_body" jsonb,
    "version_effective_date" varchar,
    "version_seo_title" varchar,
    "version_seo_description" varchar,
    "version_review_state" "enum__legal_pages_v_version_review_state" DEFAULT 'draft',
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
    "version__status" "enum__legal_pages_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "legal_pages_id" integer;
  ALTER TABLE "_legal_pages_v" ADD CONSTRAINT "_legal_pages_v_parent_id_legal_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "legal_pages_identity_idx" ON "legal_pages" USING btree ("identity");
  CREATE INDEX "legal_pages_updated_at_idx" ON "legal_pages" USING btree ("updated_at");
  CREATE INDEX "legal_pages_created_at_idx" ON "legal_pages" USING btree ("created_at");
  CREATE INDEX "legal_pages__status_idx" ON "legal_pages" USING btree ("_status");
  CREATE INDEX "_legal_pages_v_parent_idx" ON "_legal_pages_v" USING btree ("parent_id");
  CREATE INDEX "_legal_pages_v_version_version_identity_idx" ON "_legal_pages_v" USING btree ("version_identity");
  CREATE INDEX "_legal_pages_v_version_version_updated_at_idx" ON "_legal_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_legal_pages_v_version_version_created_at_idx" ON "_legal_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_legal_pages_v_version_version__status_idx" ON "_legal_pages_v" USING btree ("version__status");
  CREATE INDEX "_legal_pages_v_created_at_idx" ON "_legal_pages_v" USING btree ("created_at");
  CREATE INDEX "_legal_pages_v_updated_at_idx" ON "_legal_pages_v" USING btree ("updated_at");
  CREATE INDEX "_legal_pages_v_latest_idx" ON "_legal_pages_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legal_pages_fk" FOREIGN KEY ("legal_pages_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_legal_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("legal_pages_id");
  CREATE FUNCTION protect_legal_identity() RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    IF OLD.identity IS NOT NULL AND NEW.identity IS DISTINCT FROM OLD.identity THEN
      RAISE EXCEPTION 'Legal page identity is permanent';
    END IF;
    RETURN NEW;
  END; $$;
  CREATE TRIGGER immutable_legal_identity BEFORE UPDATE ON legal_pages FOR EACH ROW EXECUTE FUNCTION protect_legal_identity();`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TRIGGER immutable_legal_identity ON legal_pages;
  DROP FUNCTION protect_legal_identity();
  ALTER TABLE "legal_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_legal_pages_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "legal_pages" CASCADE;
  DROP TABLE "_legal_pages_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_legal_pages_fk";

  DROP INDEX "payload_locked_documents_rels_legal_pages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "legal_pages_id";
  DROP TYPE "public"."enum_legal_pages_identity";
  DROP TYPE "public"."enum_legal_pages_review_state";
  DROP TYPE "public"."enum_legal_pages_status";
  DROP TYPE "public"."enum__legal_pages_v_version_identity";
  DROP TYPE "public"."enum__legal_pages_v_version_review_state";
  DROP TYPE "public"."enum__legal_pages_v_version_status";`)
}
