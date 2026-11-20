# Netlify deployment handoff

Status: the CMS and T13 permissions are verified locally. No Netlify deployment
has been verified. Adding environment variables and pushing is not sufficient
without storage configuration, release setup and hosted checks. T12 launch acceptance and R2
remain deferred; this checklist records outstanding work without approving launch.

## 1. Resolve upload storage before deployment

Supabase is selected for PostgreSQL and initial object storage. The implemented
Payload S3 adapter uses separate `media/` and `cvs/` prefixes in one private bucket,
preserving Payload URLs, approval rules and authenticated CV access. Configure it
using the [object-storage guide](object-storage.md), run the connection/privacy
check, and copy existing local uploads before switching a populated installation.
Never expose this bucket publicly. Images committed to the codebase remain static
assets. R2 is deferred; a later cutover needs a verified object copy and credential
change, not a database-provider move. Local filesystem mode still needs persistent
mounts and is unsuitable for durable Netlify uploads.

See [Payload deployment guidance](https://payloadcms.com/docs/production/deployment)
and [Netlify's Payload guide](https://developers.netlify.com/guides/deploy-payload-cms-3-to-netlify/).

## 2. Configure the production environment and build

Use the repository's pinned Node and pnpm versions. Configure production values
through Netlify's environment settings, with the required build and runtime scopes:

- `APP_ENV=production`, `PRODUCTION_DATABASE_URL` for the selected Supabase database.
- A stable `PAYLOAD_SECRET` of at least 32 characters and HTTPS `SERVER_URL` matching
  the deployed website origin.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD` and
  `EMAIL_FROM_ADDRESS` for real invitation and recruitment delivery.
- `STORAGE_DRIVER=s3`, `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`
  and `S3_SECRET_ACCESS_KEY` for the private bucket. Persistent directory variables
  are required only for local filesystem production mode, not S3 mode.

Keep credentials out of Git and planning records. Use isolated databases/storage
for deploy previews; previews must not run migrations against production.
Netlify variables need appropriate scopes and a new deploy to take effect; see
[Netlify environment variables](https://docs.netlify.com/build/environment-variables/overview/).

The verified local production build command is `pnpm exec next build --webpack`.
The default `pnpm build` uses Turbopack and has an unresolved Google-font resolver
failure/stall on the development machine. The package script is unchanged.
Configure the reviewed build command and verify Netlify's Next.js integration in
a staging deployment; a local webpack pass does not certify the hosted build.

## 3. Apply migrations and bootstrap the first admin

Back up an existing production database before schema changes. Run
`pnpm cms:migrate` once from a controlled release environment against the verified
production database before serving code that needs the schema. Do not assume
Netlify applies migrations automatically on push. The T13 migration defaults
existing staff and pending invitations to No access; admins retain full access.

If no admin exists, provide `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD`
to the controlled setup environment and run `pnpm cms:bootstrap` after migrations.
Netlify's standard Next.js deployment does not run the repository's persistent
`pnpm start`/`prestart` process, so merely setting bootstrap variables is not enough.
Change the initial password at first login and remove bootstrap secrets after
successful setup. Preserve existing admins and content. Assign actual staff
sections using the [staff permission guide](staff-permissions.md).

## 4. Configure delivery and verify the hosted release

If recruitment is enabled, provision a scheduler capable of running
`pnpm cms:deliver` every minute with the production environment and dependencies.
The site does not run this worker automatically. Verify invitation delivery,
application acknowledgements, staff notifications and retry behavior. Keep
applications disabled until the required approved settings and recipients exist.

Before calling the deployment ready, verify HTTPS pages, login, section access,
approval and previews, public image persistence across redeploys, denied anonymous
CV access and allowed authenticated downloads. Verify database/files backups and
an isolated restore. Record actual hosted evidence separately from local tests.
Use [CMS operations](cms-operations.md) for release/recovery procedures and the
[T12 checklist](../.planning/t12-checklist.md) when launch acceptance resumes.
