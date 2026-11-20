import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_permissions_blog" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_users_permissions_media" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_users_permissions_careers" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_users_permissions_recruitment" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_users_permissions_company" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_users_permissions_seo" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_users_permissions_faqs" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_users_permissions_announcements" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_users_permissions_legal" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_invitations_permissions_blog" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_invitations_permissions_media" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_invitations_permissions_careers" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_invitations_permissions_recruitment" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_invitations_permissions_company" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_invitations_permissions_seo" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_invitations_permissions_faqs" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_invitations_permissions_announcements" AS ENUM('none', 'read', 'modify');
  CREATE TYPE "public"."enum_invitations_permissions_legal" AS ENUM('none', 'read', 'modify');
  ALTER TABLE "users" ADD COLUMN "permissions_blog" "enum_users_permissions_blog" DEFAULT 'none';
  ALTER TABLE "users" ADD COLUMN "permissions_media" "enum_users_permissions_media" DEFAULT 'none';
  ALTER TABLE "users" ADD COLUMN "permissions_careers" "enum_users_permissions_careers" DEFAULT 'none';
  ALTER TABLE "users" ADD COLUMN "permissions_recruitment" "enum_users_permissions_recruitment" DEFAULT 'none';
  ALTER TABLE "users" ADD COLUMN "permissions_company" "enum_users_permissions_company" DEFAULT 'none';
  ALTER TABLE "users" ADD COLUMN "permissions_seo" "enum_users_permissions_seo" DEFAULT 'none';
  ALTER TABLE "users" ADD COLUMN "permissions_faqs" "enum_users_permissions_faqs" DEFAULT 'none';
  ALTER TABLE "users" ADD COLUMN "permissions_announcements" "enum_users_permissions_announcements" DEFAULT 'none';
  ALTER TABLE "users" ADD COLUMN "permissions_legal" "enum_users_permissions_legal" DEFAULT 'none';
  ALTER TABLE "invitations" ADD COLUMN "permissions_blog" "enum_invitations_permissions_blog" DEFAULT 'none';
  ALTER TABLE "invitations" ADD COLUMN "permissions_media" "enum_invitations_permissions_media" DEFAULT 'none';
  ALTER TABLE "invitations" ADD COLUMN "permissions_careers" "enum_invitations_permissions_careers" DEFAULT 'none';
  ALTER TABLE "invitations" ADD COLUMN "permissions_recruitment" "enum_invitations_permissions_recruitment" DEFAULT 'none';
  ALTER TABLE "invitations" ADD COLUMN "permissions_company" "enum_invitations_permissions_company" DEFAULT 'none';
  ALTER TABLE "invitations" ADD COLUMN "permissions_seo" "enum_invitations_permissions_seo" DEFAULT 'none';
  ALTER TABLE "invitations" ADD COLUMN "permissions_faqs" "enum_invitations_permissions_faqs" DEFAULT 'none';
  ALTER TABLE "invitations" ADD COLUMN "permissions_announcements" "enum_invitations_permissions_announcements" DEFAULT 'none';
  ALTER TABLE "invitations" ADD COLUMN "permissions_legal" "enum_invitations_permissions_legal" DEFAULT 'none';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "permissions_blog";
  ALTER TABLE "users" DROP COLUMN "permissions_media";
  ALTER TABLE "users" DROP COLUMN "permissions_careers";
  ALTER TABLE "users" DROP COLUMN "permissions_recruitment";
  ALTER TABLE "users" DROP COLUMN "permissions_company";
  ALTER TABLE "users" DROP COLUMN "permissions_seo";
  ALTER TABLE "users" DROP COLUMN "permissions_faqs";
  ALTER TABLE "users" DROP COLUMN "permissions_announcements";
  ALTER TABLE "users" DROP COLUMN "permissions_legal";
  ALTER TABLE "invitations" DROP COLUMN "permissions_blog";
  ALTER TABLE "invitations" DROP COLUMN "permissions_media";
  ALTER TABLE "invitations" DROP COLUMN "permissions_careers";
  ALTER TABLE "invitations" DROP COLUMN "permissions_recruitment";
  ALTER TABLE "invitations" DROP COLUMN "permissions_company";
  ALTER TABLE "invitations" DROP COLUMN "permissions_seo";
  ALTER TABLE "invitations" DROP COLUMN "permissions_faqs";
  ALTER TABLE "invitations" DROP COLUMN "permissions_announcements";
  ALTER TABLE "invitations" DROP COLUMN "permissions_legal";
  DROP TYPE "public"."enum_users_permissions_blog";
  DROP TYPE "public"."enum_users_permissions_media";
  DROP TYPE "public"."enum_users_permissions_careers";
  DROP TYPE "public"."enum_users_permissions_recruitment";
  DROP TYPE "public"."enum_users_permissions_company";
  DROP TYPE "public"."enum_users_permissions_seo";
  DROP TYPE "public"."enum_users_permissions_faqs";
  DROP TYPE "public"."enum_users_permissions_announcements";
  DROP TYPE "public"."enum_users_permissions_legal";
  DROP TYPE "public"."enum_invitations_permissions_blog";
  DROP TYPE "public"."enum_invitations_permissions_media";
  DROP TYPE "public"."enum_invitations_permissions_careers";
  DROP TYPE "public"."enum_invitations_permissions_recruitment";
  DROP TYPE "public"."enum_invitations_permissions_company";
  DROP TYPE "public"."enum_invitations_permissions_seo";
  DROP TYPE "public"."enum_invitations_permissions_faqs";
  DROP TYPE "public"."enum_invitations_permissions_announcements";
  DROP TYPE "public"."enum_invitations_permissions_legal";`)
}
