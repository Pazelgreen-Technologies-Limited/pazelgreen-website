# Netlify deployment handoff

Status: the CMS and T13 permissions are verified locally. No Netlify deployment
has been verified. Adding environment variables and pushing is not sufficient
for the current filesystem upload implementation. T12 launch acceptance and R2
remain deferred; this checklist records outstanding work without approving launch.

## 1. Resolve upload storage before deployment

Supabase is selected for PostgreSQL. That database connection does not configure
file storage. Public images and private CVs currently use separate filesystem
directories, which require persistent mounts. Netlify's temporary filesystem is
not durable upload storage. Images already committed to the codebase can continue
to ship with the site; new CMS uploads need a storage adapter.

Select a durable provider and implement storage for both upload collections before
enabling uploads on Netlify. R2 is deferred, so no R2 setup is assumed. If another
provider is selected, verify its Payload integration and private download controls.
Never expose CV files through a public bucket or bypass the existing authenticated
download endpoint. Directory environment variables alone do not solve persistence.
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
- Storage credentials/configuration once the adapter is implemented. The current
  validator still requires separate absolute `PUBLIC_UPLOAD_DIR` and
  `PRIVATE_UPLOAD_DIR` values; revise that configuration as part of the adapter
  work rather than treating temporary directories as permanent storage.

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
