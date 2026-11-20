import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT 'media';
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "_media_v" ADD COLUMN "version_prefix" varchar DEFAULT 'media';
  ALTER TABLE "_media_v" ADD COLUMN "version__objectkey" varchar;
  ALTER TABLE "private_files" ADD COLUMN "prefix" varchar DEFAULT 'cvs';
  ALTER TABLE "private_files" ADD COLUMN "_objectkey" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  ALTER TABLE "_media_v" DROP COLUMN "version_prefix";
  ALTER TABLE "_media_v" DROP COLUMN "version__objectkey";
  ALTER TABLE "private_files" DROP COLUMN "prefix";
  ALTER TABLE "private_files" DROP COLUMN "_objectkey";`)
}
