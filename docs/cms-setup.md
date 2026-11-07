# CMS setup command reference

This is the short operational reference. New to Payload? Read the
[team handbook](payload-handbook.md) for the concepts, reasons, editing workflow,
production responsibilities, recovery and troubleshooting. Commands below reflect
this repository's scripts; stop and fix errors before continuing to the next step.

## Local setup

Use Node **24.22.2**, pnpm **10.18.1**, and running Docker Desktop/Compose.
On a new checkout, install with `pnpm install --frozen-lockfile`, copy
`.env.example` to `.env`, and configure:

- `APP_ENV=development`.
- Matching `POSTGRES_PASSWORD` and URL-encoded password in `DEV_DATABASE_URL`.
- A random `PAYLOAD_SECRET` of at least 32 characters.
- `SERVER_URL=http://localhost:3000` for the default development port.

Keep an existing `.env` instead of overwriting it. See the handbook's
[setup procedure](payload-handbook.md#first-local-setup) for secret generation,
password distinctions and why each step matters.

```sh
pnpm dev
```

`predev` starts Compose services, waits for readiness and runs migrations before
Next.js. Public site: http://localhost:3000. Admin: http://localhost:3000/admin.
Local email inbox: http://localhost:8025. PostgreSQL: `127.0.0.1:5433`.

## First admin and invitations

After the database is ready and migrated, temporarily set
`BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` (12–256 characters) in your
untracked environment, then run in another terminal:

```sh
pnpm cms:bootstrap
```

Remove both bootstrap values after success. This command only accepts an empty
users collection. Existing shared environments use administrator invitations;
there is no public signup. An invitation expires after 24 hours and can be used
once. Development email is captured by Mailpit rather than sent to real inboxes.
See [admin workflows](payload-handbook.md#using-the-admin-panel).

## Everyday commands

| Command | Effect |
| --- | --- |
| `pnpm dev` | Start local services, apply pending migrations and run Next.js/Payload |
| Ctrl+C in the app terminal | Stop Next.js; leave Docker services running |
| `pnpm db:stop` | Stop project containers without deleting their volumes |
| `pnpm db:up` | Start project containers and wait for readiness |
| `docker compose ps` | Inspect container state |
| `pnpm cms:migrate` | Apply pending migrations to the database selected by APP_ENV |
| `pnpm exec payload migrate:status` | Show migration status |

Our database helper scripts refuse non-development APP_ENV values. Local optimized
build rehearsal: `pnpm db:up`, `pnpm cms:migrate`, `pnpm build`, then `pnpm start`,
keeping `APP_ENV=development`. Stop any app using port 3000 first.

## Schema changes

After editing a collection/global definition as part of a feature:

```sh
pnpm cms:types
pnpm cms:importmap
pnpm cms:migration:create describe_the_change
```

Review the generated SQL and snapshot, then apply it with `pnpm cms:migrate`.
Commit relevant generated types, import-map changes, migration TS/JSON and index.
Database schema push is disabled. Keep applied migrations append-only and preserve
custom database triggers. See [developer workflow](payload-handbook.md#developer-workflow).

## Test database and checks

Start local services with `pnpm db:up`. Once, create a separate disposable database:

```sh
docker compose exec -T postgres psql -U pazelgreen -d postgres -c "CREATE DATABASE pazelgreen_test;"
```

This example assumes the default local Postgres user. If you changed
`POSTGRES_USER`, use that value with `-U`. If the database already exists, reuse it
only if it is genuinely disposable; do not delete another database to resolve the error.

Set `TEST_DATABASE_URL` in `.env` using the local credentials and the
`pazelgreen_test` database. The helpers require localhost/127.0.0.1 and a database
name ending in `_test`. Integration tests **reset CMS records** in that database
and use `storage/test-public` and `storage/test-private`.

Run in order, fixing failures before continuing:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm test:http
```

Integration tests use real PostgreSQL and Mailpit. HTTP checks need their fixtures
and a fresh production build; the script starts/stops its own test server on
`127.0.0.1:3101`. CI provisions test services and runs these checks; it does not
provision production or deploy the website.

## Environment selection

| APP_ENV | Database URL | Intended use |
| --- | --- | --- |
| `development` | `DEV_DATABASE_URL` | Local Docker database |
| `test` | `TEST_DATABASE_URL` | Disposable local test database |
| `production` | `PRODUCTION_DATABASE_URL` | Explicitly configured hosted deployment |

APP_ENV is distinct from Next's NODE_ENV. Production never falls back to the
local database or legacy DATABASE_URL. For details and every supported variable,
see [environment configuration](payload-handbook.md#understanding-environment-variables).

## Production release reference

Read the [full production procedure](payload-handbook.md#running-in-production)
first. The operator must provision PostgreSQL, SMTP, HTTPS hosting and persistent
upload storage, and configure APP_ENV, the production URL, stable PAYLOAD_SECRET,
SERVER_URL, SMTP values, and absolute PUBLIC_UPLOAD_DIR/PRIVATE_UPLOAD_DIR paths.
The current filesystem storage requires persistent mounts; ephemeral/serverless
hosting needs an implemented storage adapter before deployment.

For a reviewed release, install locked dependencies, run checks in the development/
CI test environment, and build the release with its required configuration. Back
up existing production data and apply `pnpm cms:migrate` once in a controlled
release job before serving code that needs the new schema. Bootstrap a first admin
only for an empty users collection, then serve the built app with `pnpm start`.

`pnpm start` does not start Docker or apply migrations. Build success does not
verify SMTP delivery or storage persistence. Verify the deployed HTTPS site,
login/invitation delivery, approved content and denied private access, and rehearse
[backup recovery](payload-handbook.md#backups-and-recovery). Coordinate breaking
schema changes with the running app; code rollback alone does not restore a database.

## Current limits and implementation status

T01–T03 provide the CMS foundation. Visual blog/job previews, company settings,
SEO, recruitment and other planned features are not all present yet. The current
media preview is authenticated JSON; private PDF/DOCX storage is not a complete
application system. See [current functionality](payload-handbook.md#what-is-available-today),
[task plan](../.planning/task.md) and [progress](../.planning/progress.md).
