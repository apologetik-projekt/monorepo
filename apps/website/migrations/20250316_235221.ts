import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "appendix" jsonb DEFAULT '{"root":{"type":"root","children":[{"tag":"h2","type":"heading","children":[{"text":"Quellen","type":"text"}]}]}}';
  ALTER TABLE "_posts_v" ADD COLUMN "version_appendix" jsonb DEFAULT '{"root":{"type":"root","children":[{"tag":"h2","type":"heading","children":[{"text":"Quellen","type":"text"}]}]}}';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "posts" DROP COLUMN IF EXISTS "appendix";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_appendix";`)
}
