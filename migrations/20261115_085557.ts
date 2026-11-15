import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_applications_candidate_delivery" AS ENUM('pending', 'sent', 'failed');
  CREATE TYPE "public"."enum_applications_staff_delivery" AS ENUM('pending', 'sent', 'failed');
  CREATE TYPE "public"."enum_applications_status" AS ENUM('new', 'in-review', 'shortlisted', 'interview', 'offer', 'hired', 'rejected', 'withdrawn');
  CREATE TYPE "public"."enum_recruitment_settings_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum_recruitment_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__recruitment_settings_v_version_review_state" AS ENUM('draft', 'in-review', 'changes-requested', 'published');
  CREATE TYPE "public"."enum__recruitment_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"job_id" integer NOT NULL,
  	"sequence" numeric NOT NULL,
  	"submission_key" varchar NOT NULL,
  	"fingerprint" varchar NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"portfolio" varchar,
  	"message" varchar,
  	"cv_id" integer NOT NULL,
  	"notice_version" varchar NOT NULL,
  	"notice_snapshot" varchar NOT NULL,
  	"consented_at" timestamp(3) with time zone NOT NULL,
  	"retention_review_at" timestamp(3) with time zone NOT NULL,
  	"duplicate" boolean DEFAULT false,
  	"candidate_delivery" "enum_applications_candidate_delivery" DEFAULT 'pending',
  	"staff_delivery" "enum_applications_staff_delivery" DEFAULT 'pending',
  	"delivery_attempts" numeric DEFAULT 0,
  	"next_delivery_at" timestamp(3) with time zone NOT NULL,
  	"status" "enum_applications_status" DEFAULT 'new' NOT NULL,
  	"assigned_to_id" integer,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "hiring_history" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"application_id" integer NOT NULL,
  	"actor" varchar NOT NULL,
  	"status" varchar NOT NULL,
  	"notes" varchar,
  	"assignee" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "recruitment_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"privacy_notice" varchar,
  	"notice_version" varchar,
  	"retention_days" numeric,
  	"review_state" "enum_recruitment_settings_review_state" DEFAULT 'draft',
  	"review_note" varchar,
  	"created_by" varchar,
  	"modified_by" varchar,
  	"reviewed_by" varchar,
  	"published_by" varchar,
  	"submitted_at" timestamp(3) with time zone,
  	"reviewed_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"_status" "enum_recruitment_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "_recruitment_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_enabled" boolean DEFAULT false,
  	"version_privacy_notice" varchar,
  	"version_notice_version" varchar,
  	"version_retention_days" numeric,
  	"version_review_state" "enum__recruitment_settings_v_version_review_state" DEFAULT 'draft',
  	"version_review_note" varchar,
  	"version_created_by" varchar,
  	"version_modified_by" varchar,
  	"version_reviewed_by" varchar,
  	"version_published_by" varchar,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_reviewed_at" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version__status" "enum__recruitment_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );

  CREATE TABLE "recruitment_delivery_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );

  CREATE TABLE "recruitment_delivery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "applications_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "hiring_history_id" integer;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_cv_id_private_files_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."private_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hiring_history" ADD CONSTRAINT "hiring_history_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recruitment_delivery_recipients" ADD CONSTRAINT "recruitment_delivery_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recruitment_delivery"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "applications_reference_idx" ON "applications" USING btree ("reference");
  CREATE INDEX "applications_job_idx" ON "applications" USING btree ("job_id");
  CREATE UNIQUE INDEX "applications_submission_key_idx" ON "applications" USING btree ("submission_key");
  CREATE INDEX "applications_email_idx" ON "applications" USING btree ("email");
  CREATE INDEX "applications_cv_idx" ON "applications" USING btree ("cv_id");
  CREATE INDEX "applications_retention_review_at_idx" ON "applications" USING btree ("retention_review_at");
  CREATE INDEX "applications_status_idx" ON "applications" USING btree ("status");
  CREATE INDEX "applications_assigned_to_idx" ON "applications" USING btree ("assigned_to_id");
  CREATE INDEX "applications_updated_at_idx" ON "applications" USING btree ("updated_at");
  CREATE INDEX "applications_created_at_idx" ON "applications" USING btree ("created_at");
  CREATE UNIQUE INDEX "job_sequence_idx" ON "applications" USING btree ("job_id","sequence");
  CREATE INDEX "hiring_history_application_idx" ON "hiring_history" USING btree ("application_id");
  CREATE INDEX "hiring_history_updated_at_idx" ON "hiring_history" USING btree ("updated_at");
  CREATE INDEX "hiring_history_created_at_idx" ON "hiring_history" USING btree ("created_at");
  CREATE INDEX "recruitment_settings__status_idx" ON "recruitment_settings" USING btree ("_status");
  CREATE INDEX "_recruitment_settings_v_version_version__status_idx" ON "_recruitment_settings_v" USING btree ("version__status");
  CREATE INDEX "_recruitment_settings_v_created_at_idx" ON "_recruitment_settings_v" USING btree ("created_at");
  CREATE INDEX "_recruitment_settings_v_updated_at_idx" ON "_recruitment_settings_v" USING btree ("updated_at");
  CREATE INDEX "_recruitment_settings_v_latest_idx" ON "_recruitment_settings_v" USING btree ("latest");
  CREATE INDEX "recruitment_delivery_recipients_order_idx" ON "recruitment_delivery_recipients" USING btree ("_order");
  CREATE INDEX "recruitment_delivery_recipients_parent_id_idx" ON "recruitment_delivery_recipients" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hiring_history_fk" FOREIGN KEY ("hiring_history_id") REFERENCES "public"."hiring_history"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("applications_id");
  CREATE INDEX "payload_locked_documents_rels_hiring_history_id_idx" ON "payload_locked_documents_rels" USING btree ("hiring_history_id");
  CREATE TABLE applicant_counters (job_id integer PRIMARY KEY REFERENCES jobs(id), value bigint NOT NULL CHECK (value > 0));
  CREATE TABLE recruitment_rate_limits (bucket varchar PRIMARY KEY, value integer NOT NULL, created_at timestamptz NOT NULL DEFAULT NOW());
  CREATE INDEX applications_delivery_queue_idx ON applications (next_delivery_at, id) WHERE candidate_delivery <> 'sent' OR staff_delivery <> 'sent';
  CREATE FUNCTION protect_applicant_reference() RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    IF NEW.reference IS DISTINCT FROM OLD.reference OR NEW.job_id IS DISTINCT FROM OLD.job_id OR NEW.sequence IS DISTINCT FROM OLD.sequence OR NEW.submission_key IS DISTINCT FROM OLD.submission_key OR NEW.fingerprint IS DISTINCT FROM OLD.fingerprint THEN
      RAISE EXCEPTION 'Applicant references and submission identity are immutable';
    END IF;
    RETURN NEW;
  END; $$;
  CREATE TRIGGER immutable_applicant_reference BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION protect_applicant_reference();`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE applicant_counters;
  DROP TABLE recruitment_rate_limits;
  DROP TRIGGER immutable_applicant_reference ON applications;
  DROP FUNCTION protect_applicant_reference();
  ALTER TABLE "applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hiring_history" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "recruitment_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_recruitment_settings_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "recruitment_delivery_recipients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "recruitment_delivery" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "applications" CASCADE;
  DROP TABLE "hiring_history" CASCADE;
  DROP TABLE "recruitment_settings" CASCADE;
  DROP TABLE "_recruitment_settings_v" CASCADE;
  DROP TABLE "recruitment_delivery_recipients" CASCADE;
  DROP TABLE "recruitment_delivery" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_applications_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_hiring_history_fk";

  DROP INDEX "payload_locked_documents_rels_applications_id_idx";
  DROP INDEX "payload_locked_documents_rels_hiring_history_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "applications_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "hiring_history_id";
  DROP TYPE "public"."enum_applications_candidate_delivery";
  DROP TYPE "public"."enum_applications_staff_delivery";
  DROP TYPE "public"."enum_applications_status";
  DROP TYPE "public"."enum_recruitment_settings_review_state";
  DROP TYPE "public"."enum_recruitment_settings_status";
  DROP TYPE "public"."enum__recruitment_settings_v_version_review_state";
  DROP TYPE "public"."enum__recruitment_settings_v_version_status";`)
}
