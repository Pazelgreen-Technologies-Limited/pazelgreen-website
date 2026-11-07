# CMS foundation (T01–T03)

## Local setup

Use Node **24.22.2** (see `.node-version`), pnpm **10.18.1**, and Docker Compose.
Payload **3.93.0**, Next **16.3.3**, and GraphQL **16.11.0** are pinned together.
The Node requirement comes from Payload's published package, and Next 16.3.3 is
the minimum Next 16 release accepted by that package's peer dependencies.

1. Run `pnpm install --frozen-lockfile`.
2. Copy `.env.example` to `.env`. Choose a local PostgreSQL password and put the
   same URL-encoded password in `DEV_DATABASE_URL`. Set `PAYLOAD_SECRET` to a
   random secret of at least 32 characters. Never commit `.env`.
3. Run `pnpm dev`. Its predev step starts Docker services, waits for PostgreSQL,
   and applies committed migrations before starting Next. Schema push is disabled.
4. Open the website at `http://localhost:3000`, admin at `/admin`, and the local
   email inbox at `http://localhost:8025`.

PostgreSQL binds only to `127.0.0.1:5433`, avoiding other local databases on 5432.
The database and Mailpit inbox have named Docker volumes. `pnpm db:stop` stops
services without deleting data; `pnpm db:up` starts them again. Never use
`docker compose down -v` unless you intend to permanently erase local data.
Changing POSTGRES_PASSWORD after initialization does not change an existing
database role's password; rotate it inside Postgres and update the URL together.

### First administrator and invitations

There is no public account registration, including Payload's first-user API.
Temporarily set `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` (12–256
characters) in your untracked environment, then run `pnpm cms:bootstrap`.
The command accepts only an empty user database and serializes concurrent setup.
Remove the bootstrap credentials immediately after success.

An administrator signs in and creates a record in **Invitations** with the
recipient's email, name and admin/staff role. The recipient receives a single-use
link valid for 24 hours, chooses their own password at `/admin/accept-invitation`,
then signs in. Only a SHA-256 token hash is stored. Redemption and account creation
share a database transaction and row lock, so simultaneous redemption creates
one account. Delete an unused invitation to revoke it; create a new invitation
to resend after expiry. Mailpit receives these emails in development. If SMTP
fails during invitation creation, the record is rolled back; retry after recovery.

Only admins manage users and invitations. Staff can edit their own name, email,
and password; role/status changes are denied on the server. Prefer deactivation
to deletion. Deactivation and role changes clear existing sessions. Disabled
users cannot log in or access protected data. Hooks and a PostgreSQL trigger
protect the final active admin, including concurrent/bulk updates. Audit records
store immutable user identifiers rather than relationships, preserving historical
attribution when users are deleted. Database administrators remain responsible
for access to database credentials and backups.

### Drafts and approvals

`cms/workflow.ts` supplies `withReview` for collections added in later tasks.
Public media is the first use. Staff/admins save drafts and set `reviewState` to
`in-review` when ready. An admin can publish that unchanged submitted draft or
return it with `reviewState=changes-requested` and a required note. Editing content
after submission resets review to `draft`. Save edits before submitting again.

All non-publication writes are forced into draft storage before Payload decides
which table to write, even if a caller omits `draft=true`. A replacement draft
does not overwrite published data. Publishing requires an explicit
`_status=published` with `draft=false` or omitted. Staff cannot publish. Creator,
modifier, submission, review and publication timestamps/identifiers are set by
server hooks. Version history is restricted to active staff/admins; restoring
versions directly is blocked to preserve review. Copy historical values into a
draft and submit them again instead. Upload new media records for replacement
images; existing file bytes cannot be replaced behind an approved public URL.
Admins can archive content without deleting its history by using Unpublish
(`_status=draft`, `draft=false`); staff requests only save private drafts.
Editorial review notes and attribution fields are hidden from anonymous reads.
Concurrent edits and publication are serialized before loading the latest version.

`GET /api/preview/media/:id` returns the latest draft as JSON only to active
staff/admins, with `private, no-store` and `noindex` headers. Frontend previews
for blog/jobs will be connected when their public routes exist. Public REST reads
return only published records; anonymous draft/version/preview access is denied.

### Storage

Local upload bytes live in `storage/public` and `storage/private`, ignored by Git
and outside Next's `public/` directory. Payload serves them through access-checked
endpoints; private file downloads require an active staff/admin session and return
`private, no-store`. Maximum upload size is 5 MB. Public media accepts JPEG, PNG,
and WebP. Private storage currently provides PDF/DOCX infrastructure only; the
candidate upload validation, applications, and retention workflow belong to T07.
Do not point a web server/CDN directly at private storage.

## Environment selection and production

| APP_ENV | Connection | Docker startup |
| --- | --- | --- |
| `development` | `DEV_DATABASE_URL` | `pnpm dev` starts local Compose services |
| `test` | `TEST_DATABASE_URL` | Not started automatically |
| `production` | `PRODUCTION_DATABASE_URL` | Refused by database scripts |

When APP_ENV is absent, production NODE_ENV selects production; other runtimes
default to development. Set APP_ENV explicitly in deployments. Next sets
NODE_ENV=production during **every** build, so APP_ENV=development intentionally
supports a local production build against Docker. Do not set NODE_ENV manually
to invent additional environments.

Production never falls back to development or the legacy DATABASE_URL. It needs:

- `APP_ENV=production`, `PRODUCTION_DATABASE_URL`, and a strong `PAYLOAD_SECRET`.
- An HTTPS `SERVER_URL`, SMTP credentials and a verified `EMAIL_FROM_ADDRESS`.
- Absolute `PUBLIC_UPLOAD_DIR` and `PRIVATE_UPLOAD_DIR` on separate persistent
  mounted directories, with filesystem access for the app's service account.

This foundation supports a server with persistent disks. Ephemeral/serverless
hosting requires a storage adapter before deployment; no cloud provider has been
selected. Configure database TLS through the production connection URL/provider,
and retain certificate verification. Back up Postgres **and** both upload mounts.
Mailpit is development-only; never use it as the production email service.

Release steps: install locked dependencies, generate types/import map if schemas
changed, run checks, build, back up the database, run `pnpm cms:migrate`, then
`pnpm start`. Run migrations as a single deployment job before accepting traffic.
Keep the same PAYLOAD_SECRET across restarts. No secret is NEXT_PUBLIC_.
SKIP_ENV_VALIDATION no longer bypasses CMS environment checks.

## Development and verification

- `pnpm cms:types` / `pnpm cms:importmap`: regenerate committed outputs.
- `pnpm cms:migration:create <name>`: generate a schema migration; review and commit
  its TS/JSON files and migration index. Keep custom trigger migrations intact.
- `pnpm cms:migrate`: apply migrations; `pnpm exec payload migrate:status`: inspect.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`: routine checks.
- `pnpm test:integration`: real PostgreSQL/Mailpit integration checks.
- After integration tests and a production build, `pnpm test:http` starts a
  temporary production server on 127.0.0.1:3101 against test fixtures, verifies
  real REST roles/publication/downloads/session revocation, and stops the server.

Before integration tests, start Docker and create a separate database:

```sh
docker compose exec -T postgres psql -U pazelgreen -d postgres -c "CREATE DATABASE pazelgreen_test;"
```

Set TEST_DATABASE_URL with the local credentials and `/pazelgreen_test` database.
Tests refuse non-local URLs and names that do not end in `_test`, apply migrations,
then truncate only that verified test database's CMS records. They also use separate
`storage/test-public` and `storage/test-private` directories. Never use a real
development or production database as TEST_DATABASE_URL.

See `.planning/progress.md` for actual validation evidence and remaining tasks.
