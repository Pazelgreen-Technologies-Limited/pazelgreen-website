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
- `DEV_DATABASE_URL` with the local database name, user, URL-encoded password and port.
- `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` (12–256 characters) for first startup.
- A random `PAYLOAD_SECRET` of at least 32 characters.
- `SERVER_URL=http://localhost:3000` for the default development port.

Keep an existing `.env` instead of overwriting it. See the handbook's
[setup procedure](payload-handbook.md#first-local-setup) for secret generation,
password distinctions and why each step matters.

```sh
pnpm dev
```

`predev` starts Compose services, waits for readiness, runs migrations and ensures an admin exists before
Next.js. Public site: http://localhost:3000. Admin: http://localhost:3000/admin.
Local email inbox: http://localhost:8025. PostgreSQL: `127.0.0.1:5433`.

## First admin and invitations

Set bootstrap credentials before the first start. Both `pnpm dev` and `pnpm start`
check for an admin and create one only if none exists. Existing admin credentials
are never reset; an inactive admin is preserved rather than reactivated. Concurrent
starts are serialized by a database transaction lock. Missing or invalid credentials
stop startup only when an admin must be created. An existing staff account is never
promoted if its email conflicts; choose a different bootstrap email.

Sign in at `/admin`. A newly bootstrapped admin must set a password before accessing
CMS content, and may update their email. Saving signs out existing sessions; sign
in again. Existing admins are unaffected by this requirement. Remove bootstrap
values after setup. `pnpm cms:bootstrap` remains available as an idempotent manual check.

Additional users join by administrator invitations, not public signup. Invitations
expire after 24 hours and can be used once. Development emails go to Mailpit.
See [admin workflows](payload-handbook.md#using-the-admin-panel).

## Everyday commands

| Command | Effect |
| --- | --- |
| `pnpm dev` | Start local services, migrate, ensure an admin and run Next.js/Payload |
| Ctrl+C in the app terminal | Stop Next.js; leave Docker services running |
| `pnpm db:stop` | Stop project containers without deleting their volumes |
| `pnpm db:up` | Start project containers and wait for readiness |
| `pnpm db:status` | Inspect container state |
| `pnpm db:exec <args>` | Run a Compose exec command with URL-derived settings |
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
pnpm db:exec -T postgres psql -U pazelgreen -d postgres -c "CREATE DATABASE pazelgreen_test;"
```

This example assumes the default local Postgres user. If you changed
the username in `DEV_DATABASE_URL`, use that value with `-U`. If the database already exists, reuse it
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
pnpm test:migrations
pnpm build
pnpm test:http
pnpm exec playwright install chromium
pnpm test:browser
```

Integration tests use real PostgreSQL and Mailpit. HTTP checks need their fixtures
and a fresh production build; the script starts/stops its own test server on
`127.0.0.1:3101`. Browser checks use a separate temporary server on port 3102 and
need Chromium (or PLAYWRIGHT_CHANNEL=chrome for installed Google Chrome). Run suites
sequentially because they share test fixtures. CI provisions test services and runs these checks; it does not
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
release job before serving code that needs the new schema. Supply bootstrap credentials
if no admin exists, then serve with `pnpm start`; its prestart check creates the admin.

Use `pnpm start` as the deployment command so its admin check runs; invoking `next start` directly bypasses that check.
`pnpm start` does not start Docker or apply migrations. Build success does not
verify SMTP delivery or storage persistence. Verify the deployed HTTPS site,
login/invitation delivery, approved content and denied private access, and rehearse
[backup recovery](payload-handbook.md#backups-and-recovery). Coordinate breaking
schema changes with the running app; code rollback alone does not restore a database.

## Company settings and page SEO (T04)

The Website group in Payload contains **Company settings** and **Page SEO**.
Company settings control the primary email, phone, address, department contacts,
ordered social links and working hours in an IANA timezone (Africa/Lagos initially).
The footer and Contact page read the same published values. Open days use HH:mm
with closing after opening; mark closed days explicitly. Each weekday occurs once.
Social links need an HTTP(S) URL; placeholder # links cannot be published.

Page SEO contains fixed groups for Home, About, Solutions, Join Us, Contact and
the Blog and Careers listings.
It controls search titles/descriptions only. Empty fields use the existing site
metadata defaults; homepage content remains outside the CMS scope. Article SEO belongs to each post; future job/legal metadata will belong to their
documents rather than these globals.

Staff save drafts, set reviewState to in-review, then save again. An admin publishes
the unchanged submitted draft. Editing a submitted draft invalidates its approval.
To return a draft, admins choose changes-requested and provide a review note.
Previously published values remain public during draft edits. Version restoration
cannot bypass review. An admin may unpublish a global to restore the site fallbacks.

No contact data was seeded or published automatically: current email addresses
conflict and social links are placeholders. Before launch, verify real contacts,
hours and social URLs, enter them in Company settings and complete approval.
Until first publication, the old footer contacts and social placeholders remain
frontend fallbacks; Contact uses that same primary email. Once published, blank
optional fields and empty lists are omitted rather than replaced with old values.
No private SMTP/recruitment recipients belong in this public global.

These public pages read published globals at request time, memoized only within
the request. Approved changes appear on the next request without a rebuild; drafts
are never used for rendering or metadata. The site now needs its database when
serving marketing pages. Migrations remain required before running the updated app.

## Blog (T05)

Read the [blog editor guide](blog-editing.md) for posts/categories, media approval,
visual draft previews, article SEO, public filtering/pagination and browser checks.
No real articles are seeded automatically.

## Careers (T06)

Read the [careers editor guide](careers-editing.md) for admin-managed dictionaries,
job drafts/approval, permanent annual advert IDs, preview, deadline semantics and
public careers pages. The migration seeds only the agreed D/C/I employment types.
No actual vacancies or example department/position codes are seeded.

## Current limits and implementation status

T01–T06 provide the CMS foundation, company settings, SEO, blog and careers.
Applications/private CV workflow and recruitment emails are next in T07. The current
media preview is authenticated JSON; private PDF/DOCX storage is not a complete
application system. See [current functionality](payload-handbook.md#what-is-available-today),
[task plan](../.planning/task.md) and [progress](../.planning/progress.md).
