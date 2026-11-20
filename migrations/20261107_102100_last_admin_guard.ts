import { sql, type MigrateDownArgs, type MigrateUpArgs } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE FUNCTION protect_final_admin() RETURNS trigger LANGUAGE plpgsql VOLATILE AS $$
    BEGIN
      IF OLD.role = 'admin' AND OLD.active = true AND
        (TG_OP = 'DELETE' OR NEW.role IS DISTINCT FROM 'admin' OR NEW.active IS DISTINCT FROM true) THEN
        -- Also covers bulk operations and simultaneous requests in different processes.
        -- A volatile SQL query gets a fresh READ COMMITTED snapshot after this lock.
        PERFORM pg_advisory_xact_lock(812732);
        IF NOT EXISTS (SELECT 1 FROM users WHERE role = 'admin' AND active = true AND id <> OLD.id) THEN
          RAISE EXCEPTION 'The final active administrator cannot be removed' USING ERRCODE = '23514';
        END IF;
      END IF;
      IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
      RETURN NEW;
    END;
    $$;
    CREATE TRIGGER users_final_admin_guard BEFORE UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION protect_final_admin();
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TRIGGER IF EXISTS users_final_admin_guard ON users; DROP FUNCTION IF EXISTS protect_final_admin();`);
}
