import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_employment_types_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum_employment_types_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__employment_types_v_version_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum__employment_types_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_departments_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum_departments_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__departments_v_version_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum__departments_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_position_codes_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum_position_codes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__position_codes_v_version_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum__position_codes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_jobs_arrangement" AS ENUM('remote', 'hybrid', 'on-site');
  CREATE TYPE "public"."enum_jobs_state" AS ENUM('open', 'closed');
  CREATE TYPE "public"."enum_jobs_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum_jobs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__jobs_v_version_arrangement" AS ENUM('remote', 'hybrid', 'on-site');
  CREATE TYPE "public"."enum__jobs_v_version_state" AS ENUM('open', 'closed');
  CREATE TYPE "public"."enum__jobs_v_version_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum__jobs_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "employment_types" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "code" varchar,
    "active" boolean DEFAULT true,
    "review_state" "enum_employment_types_review_state" DEFAULT 'draft',
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
    "_status" "enum_employment_types_status" DEFAULT 'draft'
  );

  CREATE TABLE "_employment_types_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_name" varchar,
    "version_code" varchar,
    "version_active" boolean DEFAULT true,
    "version_review_state" "enum__employment_types_v_version_review_state" DEFAULT 'draft',
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
    "version__status" "enum__employment_types_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "departments" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "code" varchar,
    "active" boolean DEFAULT true,
    "review_state" "enum_departments_review_state" DEFAULT 'draft',
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
    "_status" "enum_departments_status" DEFAULT 'draft'
  );

  CREATE TABLE "_departments_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_name" varchar,
    "version_code" varchar,
    "version_active" boolean DEFAULT true,
    "version_review_state" "enum__departments_v_version_review_state" DEFAULT 'draft',
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
    "version__status" "enum__departments_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "position_codes" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "code" varchar,
    "active" boolean DEFAULT true,
    "review_state" "enum_position_codes_review_state" DEFAULT 'draft',
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
    "_status" "enum_position_codes_status" DEFAULT 'draft'
  );

  CREATE TABLE "_position_codes_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_name" varchar,
    "version_code" varchar,
    "version_active" boolean DEFAULT true,
    "version_review_state" "enum__position_codes_v_version_review_state" DEFAULT 'draft',
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
    "version__status" "enum__position_codes_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "jobs" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "employment_type_id" integer,
    "department_id" integer,
    "position_code_id" integer,
    "location" varchar,
    "arrangement" "enum_jobs_arrangement",
    "summary" varchar,
    "responsibilities" varchar,
    "requirements" varchar,
    "compensation" varchar,
    "deadline" timestamp(3) with time zone,
    "deadline_timezone" varchar DEFAULT 'Africa/Lagos',
    "state" "enum_jobs_state" DEFAULT 'open',
    "reference" varchar,
    "reference_year" numeric,
    "reference_sequence" numeric,
    "employment_code" varchar,
    "department_code" varchar,
    "position_code_snapshot" varchar,
    "seo_title" varchar,
    "seo_description" varchar,
    "review_state" "enum_jobs_review_state" DEFAULT 'draft',
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
    "_status" "enum_jobs_status" DEFAULT 'draft'
  );

  CREATE TABLE "_jobs_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_employment_type_id" integer,
    "version_department_id" integer,
    "version_position_code_id" integer,
    "version_location" varchar,
    "version_arrangement" "enum__jobs_v_version_arrangement",
    "version_summary" varchar,
    "version_responsibilities" varchar,
    "version_requirements" varchar,
    "version_compensation" varchar,
    "version_deadline" timestamp(3) with time zone,
    "version_deadline_timezone" varchar DEFAULT 'Africa/Lagos',
    "version_state" "enum__jobs_v_version_state" DEFAULT 'open',
    "version_reference" varchar,
    "version_reference_year" numeric,
    "version_reference_sequence" numeric,
    "version_employment_code" varchar,
    "version_department_code" varchar,
    "version_position_code_snapshot" varchar,
    "version_seo_title" varchar,
    "version_seo_description" varchar,
    "version_review_state" "enum__jobs_v_version_review_state" DEFAULT 'draft',
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
    "version__status" "enum__jobs_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "annual_advert_counters" (
    "id" serial PRIMARY KEY NOT NULL,
    "year" numeric NOT NULL,
    "value" numeric NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "employment_types_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "departments_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "position_codes_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "jobs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "annual_advert_counters_id" integer;
  ALTER TABLE "page_seo" ADD COLUMN "careers_title" varchar;
  ALTER TABLE "page_seo" ADD COLUMN "careers_description" varchar;
  ALTER TABLE "_page_seo_v" ADD COLUMN "version_careers_title" varchar;
  ALTER TABLE "_page_seo_v" ADD COLUMN "version_careers_description" varchar;
  ALTER TABLE "_employment_types_v" ADD CONSTRAINT "_employment_types_v_parent_id_employment_types_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."employment_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_departments_v" ADD CONSTRAINT "_departments_v_parent_id_departments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_position_codes_v" ADD CONSTRAINT "_position_codes_v_parent_id_position_codes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."position_codes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_employment_type_id_employment_types_id_fk" FOREIGN KEY ("employment_type_id") REFERENCES "public"."employment_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_position_code_id_position_codes_id_fk" FOREIGN KEY ("position_code_id") REFERENCES "public"."position_codes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_parent_id_jobs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_version_employment_type_id_employment_types_id_fk" FOREIGN KEY ("version_employment_type_id") REFERENCES "public"."employment_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_version_department_id_departments_id_fk" FOREIGN KEY ("version_department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_version_position_code_id_position_codes_id_fk" FOREIGN KEY ("version_position_code_id") REFERENCES "public"."position_codes"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "employment_types_code_idx" ON "employment_types" USING btree ("code");
  CREATE INDEX "employment_types_updated_at_idx" ON "employment_types" USING btree ("updated_at");
  CREATE INDEX "employment_types_created_at_idx" ON "employment_types" USING btree ("created_at");
  CREATE INDEX "employment_types__status_idx" ON "employment_types" USING btree ("_status");
  CREATE INDEX "_employment_types_v_parent_idx" ON "_employment_types_v" USING btree ("parent_id");
  CREATE INDEX "_employment_types_v_version_version_code_idx" ON "_employment_types_v" USING btree ("version_code");
  CREATE INDEX "_employment_types_v_version_version_updated_at_idx" ON "_employment_types_v" USING btree ("version_updated_at");
  CREATE INDEX "_employment_types_v_version_version_created_at_idx" ON "_employment_types_v" USING btree ("version_created_at");
  CREATE INDEX "_employment_types_v_version_version__status_idx" ON "_employment_types_v" USING btree ("version__status");
  CREATE INDEX "_employment_types_v_created_at_idx" ON "_employment_types_v" USING btree ("created_at");
  CREATE INDEX "_employment_types_v_updated_at_idx" ON "_employment_types_v" USING btree ("updated_at");
  CREATE INDEX "_employment_types_v_latest_idx" ON "_employment_types_v" USING btree ("latest");
  CREATE UNIQUE INDEX "departments_code_idx" ON "departments" USING btree ("code");
  CREATE INDEX "departments_updated_at_idx" ON "departments" USING btree ("updated_at");
  CREATE INDEX "departments_created_at_idx" ON "departments" USING btree ("created_at");
  CREATE INDEX "departments__status_idx" ON "departments" USING btree ("_status");
  CREATE INDEX "_departments_v_parent_idx" ON "_departments_v" USING btree ("parent_id");
  CREATE INDEX "_departments_v_version_version_code_idx" ON "_departments_v" USING btree ("version_code");
  CREATE INDEX "_departments_v_version_version_updated_at_idx" ON "_departments_v" USING btree ("version_updated_at");
  CREATE INDEX "_departments_v_version_version_created_at_idx" ON "_departments_v" USING btree ("version_created_at");
  CREATE INDEX "_departments_v_version_version__status_idx" ON "_departments_v" USING btree ("version__status");
  CREATE INDEX "_departments_v_created_at_idx" ON "_departments_v" USING btree ("created_at");
  CREATE INDEX "_departments_v_updated_at_idx" ON "_departments_v" USING btree ("updated_at");
  CREATE INDEX "_departments_v_latest_idx" ON "_departments_v" USING btree ("latest");
  CREATE UNIQUE INDEX "position_codes_code_idx" ON "position_codes" USING btree ("code");
  CREATE INDEX "position_codes_updated_at_idx" ON "position_codes" USING btree ("updated_at");
  CREATE INDEX "position_codes_created_at_idx" ON "position_codes" USING btree ("created_at");
  CREATE INDEX "position_codes__status_idx" ON "position_codes" USING btree ("_status");
  CREATE INDEX "_position_codes_v_parent_idx" ON "_position_codes_v" USING btree ("parent_id");
  CREATE INDEX "_position_codes_v_version_version_code_idx" ON "_position_codes_v" USING btree ("version_code");
  CREATE INDEX "_position_codes_v_version_version_updated_at_idx" ON "_position_codes_v" USING btree ("version_updated_at");
  CREATE INDEX "_position_codes_v_version_version_created_at_idx" ON "_position_codes_v" USING btree ("version_created_at");
  CREATE INDEX "_position_codes_v_version_version__status_idx" ON "_position_codes_v" USING btree ("version__status");
  CREATE INDEX "_position_codes_v_created_at_idx" ON "_position_codes_v" USING btree ("created_at");
  CREATE INDEX "_position_codes_v_updated_at_idx" ON "_position_codes_v" USING btree ("updated_at");
  CREATE INDEX "_position_codes_v_latest_idx" ON "_position_codes_v" USING btree ("latest");
  CREATE UNIQUE INDEX "jobs_slug_idx" ON "jobs" USING btree ("slug");
  CREATE INDEX "jobs_employment_type_idx" ON "jobs" USING btree ("employment_type_id");
  CREATE INDEX "jobs_department_idx" ON "jobs" USING btree ("department_id");
  CREATE INDEX "jobs_position_code_idx" ON "jobs" USING btree ("position_code_id");
  CREATE UNIQUE INDEX "jobs_reference_idx" ON "jobs" USING btree ("reference");
  CREATE INDEX "jobs_updated_at_idx" ON "jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");
  CREATE INDEX "jobs__status_idx" ON "jobs" USING btree ("_status");
  CREATE UNIQUE INDEX "referenceYear_referenceSequence_idx" ON "jobs" USING btree ("reference_year","reference_sequence");
  CREATE INDEX "_jobs_v_parent_idx" ON "_jobs_v" USING btree ("parent_id");
  CREATE INDEX "_jobs_v_version_version_slug_idx" ON "_jobs_v" USING btree ("version_slug");
  CREATE INDEX "_jobs_v_version_version_employment_type_idx" ON "_jobs_v" USING btree ("version_employment_type_id");
  CREATE INDEX "_jobs_v_version_version_department_idx" ON "_jobs_v" USING btree ("version_department_id");
  CREATE INDEX "_jobs_v_version_version_position_code_idx" ON "_jobs_v" USING btree ("version_position_code_id");
  CREATE INDEX "_jobs_v_version_version_reference_idx" ON "_jobs_v" USING btree ("version_reference");
  CREATE INDEX "_jobs_v_version_version_updated_at_idx" ON "_jobs_v" USING btree ("version_updated_at");
  CREATE INDEX "_jobs_v_version_version_created_at_idx" ON "_jobs_v" USING btree ("version_created_at");
  CREATE INDEX "_jobs_v_version_version__status_idx" ON "_jobs_v" USING btree ("version__status");
  CREATE INDEX "_jobs_v_created_at_idx" ON "_jobs_v" USING btree ("created_at");
  CREATE INDEX "_jobs_v_updated_at_idx" ON "_jobs_v" USING btree ("updated_at");
  CREATE INDEX "_jobs_v_latest_idx" ON "_jobs_v" USING btree ("latest");
  CREATE INDEX "version_referenceYear_version_referenceSequence_idx" ON "_jobs_v" USING btree ("version_reference_year","version_reference_sequence");
  CREATE UNIQUE INDEX "annual_advert_counters_year_idx" ON "annual_advert_counters" USING btree ("year");
  CREATE INDEX "annual_advert_counters_updated_at_idx" ON "annual_advert_counters" USING btree ("updated_at");
  CREATE INDEX "annual_advert_counters_created_at_idx" ON "annual_advert_counters" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_employment_types_fk" FOREIGN KEY ("employment_types_id") REFERENCES "public"."employment_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_departments_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_position_codes_fk" FOREIGN KEY ("position_codes_id") REFERENCES "public"."position_codes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_annual_advert_counters_fk" FOREIGN KEY ("annual_advert_counters_id") REFERENCES "public"."annual_advert_counters"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_employment_types_id_idx" ON "payload_locked_documents_rels" USING btree ("employment_types_id");
  CREATE INDEX "payload_locked_documents_rels_departments_id_idx" ON "payload_locked_documents_rels" USING btree ("departments_id");
  CREATE INDEX "payload_locked_documents_rels_position_codes_id_idx" ON "payload_locked_documents_rels" USING btree ("position_codes_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_annual_advert_counters_id_idx" ON "payload_locked_documents_rels" USING btree ("annual_advert_counters_id");`)
  // Only the three explicitly agreed employment codes are seeded. Department
  // and position examples are not treated as approved company dictionaries.
  await db.execute(sql`
    WITH seeded AS (
      INSERT INTO employment_types (name, code, active, review_state, _status, published_at)
      VALUES ('Direct', 'D', true, 'published', 'published', NOW()),
             ('Contract', 'C', true, 'published', 'published', NOW()),
             ('Internship', 'I', true, 'published', 'published', NOW()) RETURNING *
    ) INSERT INTO _employment_types_v (parent_id, version_name, version_code, version_active,
      version_review_state, version__status, version_published_at, version_created_at, version_updated_at, latest)
      SELECT id, name, code, active, 'published', 'published', published_at, created_at, updated_at, true FROM seeded;

    CREATE FUNCTION protect_issued_advert() RETURNS trigger AS $$
    BEGIN
      IF OLD.reference IS NOT NULL THEN
        IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'Issued adverts cannot be deleted'; END IF;
        IF ROW(NEW.reference, NEW.reference_year, NEW.reference_sequence, NEW.employment_code,
          NEW.department_code, NEW.position_code_snapshot, NEW.employment_type_id, NEW.department_id, NEW.position_code_id)
          IS DISTINCT FROM ROW(OLD.reference, OLD.reference_year, OLD.reference_sequence, OLD.employment_code,
          OLD.department_code, OLD.position_code_snapshot, OLD.employment_type_id, OLD.department_id, OLD.position_code_id)
          THEN RAISE EXCEPTION 'Issued advert references and defining codes are immutable'; END IF;
      END IF;
      IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
      RETURN NEW;
    END; $$ LANGUAGE plpgsql;
    CREATE TRIGGER jobs_protect_issued_advert BEFORE UPDATE OR DELETE ON jobs
      FOR EACH ROW EXECUTE FUNCTION protect_issued_advert();
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TRIGGER IF EXISTS jobs_protect_issued_advert ON jobs; DROP FUNCTION IF EXISTS protect_issued_advert();`);
  await db.execute(sql`
   ALTER TABLE "employment_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_employment_types_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "departments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_departments_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "position_codes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_position_codes_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_jobs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "annual_advert_counters" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "employment_types" CASCADE;
  DROP TABLE "_employment_types_v" CASCADE;
  DROP TABLE "departments" CASCADE;
  DROP TABLE "_departments_v" CASCADE;
  DROP TABLE "position_codes" CASCADE;
  DROP TABLE "_position_codes_v" CASCADE;
  DROP TABLE "jobs" CASCADE;
  DROP TABLE "_jobs_v" CASCADE;
  DROP TABLE "annual_advert_counters" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_employment_types_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_departments_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_position_codes_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_jobs_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_annual_advert_counters_fk";

  DROP INDEX "payload_locked_documents_rels_employment_types_id_idx";
  DROP INDEX "payload_locked_documents_rels_departments_id_idx";
  DROP INDEX "payload_locked_documents_rels_position_codes_id_idx";
  DROP INDEX "payload_locked_documents_rels_jobs_id_idx";
  DROP INDEX "payload_locked_documents_rels_annual_advert_counters_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "employment_types_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "departments_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "position_codes_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "jobs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "annual_advert_counters_id";
  ALTER TABLE "page_seo" DROP COLUMN "careers_title";
  ALTER TABLE "page_seo" DROP COLUMN "careers_description";
  ALTER TABLE "_page_seo_v" DROP COLUMN "version_careers_title";
  ALTER TABLE "_page_seo_v" DROP COLUMN "version_careers_description";
  DROP TYPE "public"."enum_employment_types_review_state";
  DROP TYPE "public"."enum_employment_types_status";
  DROP TYPE "public"."enum__employment_types_v_version_review_state";
  DROP TYPE "public"."enum__employment_types_v_version_status";
  DROP TYPE "public"."enum_departments_review_state";
  DROP TYPE "public"."enum_departments_status";
  DROP TYPE "public"."enum__departments_v_version_review_state";
  DROP TYPE "public"."enum__departments_v_version_status";
  DROP TYPE "public"."enum_position_codes_review_state";
  DROP TYPE "public"."enum_position_codes_status";
  DROP TYPE "public"."enum__position_codes_v_version_review_state";
  DROP TYPE "public"."enum__position_codes_v_version_status";
  DROP TYPE "public"."enum_jobs_arrangement";
  DROP TYPE "public"."enum_jobs_state";
  DROP TYPE "public"."enum_jobs_review_state";
  DROP TYPE "public"."enum_jobs_status";
  DROP TYPE "public"."enum__jobs_v_version_arrangement";
  DROP TYPE "public"."enum__jobs_v_version_state";
  DROP TYPE "public"."enum__jobs_v_version_review_state";
  DROP TYPE "public"."enum__jobs_v_version_status";`)
}
