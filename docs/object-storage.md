# Private object storage

Payload uses `@payloadcms/storage-s3` 3.93.0 for Supabase Storage and other
S3-compatible providers. PostgreSQL stores upload metadata; the bucket stores
file bytes. The database and object store can use different providers.

## Configuration

Keep the bucket private, including images: unpublished images must not be public.
In Supabase, turn off **Public bucket** and do not create anonymous read policies
for these objects. S3 credentials belong only on the server and bypass Supabase
storage RLS; never expose them through `NEXT_PUBLIC_` variables or browser code.

Set these in your ignored local `.env` and in Netlify's server/build environment:

```dotenv
STORAGE_DRIVER=s3
S3_ENDPOINT=https://<project-reference>.storage.supabase.co/storage/v1/s3
S3_REGION=<region-from-supabase-s3-settings>
S3_BUCKET=<existing-private-bucket-name>
S3_ACCESS_KEY_ID=<generated-s3-access-key>
S3_SECRET_ACCESS_KEY=<generated-s3-secret>
```

Copy the exact endpoint and region from Supabase; do not construct them from
your database URL. Use generated S3 credentials, not the database password,
publishable/anon key or service-role key. See
[Supabase S3 authentication](https://supabase.com/docs/guides/storage/s3/authentication).
Restart the app after changing configuration.

Without `STORAGE_DRIVER`, any nonempty S3 setting selects S3 outside tests and
requires all five settings. With none set, storage stays local. Set
`STORAGE_DRIVER=local` to deliberately retain filesystem uploads while preparing
the bucket. S3 production mode does not require persistent upload directories;
local production mode still requires separate absolute mounted paths.

Run `pnpm cms:storage:check` before enabling S3 for real content. It checks the S3
settings even while `STORAGE_DRIVER=local` keeps application uploads local. It writes
one random, non-personal test object, compares authenticated downloaded bytes,
checks unsigned access (including Supabase's public REST route) and removes its
own object. It does not change bucket privacy or touch other objects. A failure
is not a successful connection check; correct the named phase and rerun. For R2,
also disable public `r2.dev` access and any public custom-domain bucket access.

## Access and application behavior

- One private bucket uses `media/` for images and `cvs/` for private CVs.
- Payload keeps the existing `/api/media/file/...` and
  `/api/private-files/file/...` URLs. Provider URLs are not sent to visitors.
- Anonymous visitors can retrieve approved images only. Authenticated section
  access determines drafts/previews. CV bytes require Recruitment View or admin.
- Downloads stream through Payload with existing private/no-store headers.
  Client uploads and signed-download redirects are disabled so validation and
  access checks remain on the server.
- Upload prefixes and object-key metadata cannot be redirected by clients to
  another namespace. Existing media/CV replacement restrictions are preserved.
- Failed application transactions attempt to delete that attempt's random CV
  object. A failed cleanup logs a generic reconciliation warning without applicant
  details; the operator must reconcile orphaned objects before retention review.
- Requests have finite connection/request timeouts and bounded SDK retries.
  Storage errors reject the submission; the database counter/application rollback
  remains in force. Storage and database transactions are not atomic together.

The new schema migration adds `prefix` and `_objectKey` fields to both upload
collections and media versions. Fields exist in local and S3 modes so switching
drivers does not change the database schema. Apply committed migrations before
starting the changed app. This migration moves no files and changes no credentials.

## Moving existing local uploads

Changing configuration does not copy existing files. For an installation with
existing CMS uploads, pause edits/application submissions, back up the database
and both upload directories, apply migrations, and set the target S3 configuration
in the release environment. Keep local directories accessible to that process.
Then run `pnpm cms:storage:copy-local` before serving the app in S3 mode.

The command reads current upload records, copies originals to their collection
prefix, verifies exact bytes, and preserves record IDs, website URLs and local
files. Current collections have no generated image sizes. It does not migrate
static codebase images or deleted records. Missing files/conflicting objects stop
the command rather than inventing replacement content. Run with writes paused;
reruns verify existing matching objects. Never delete source files until the
release and restore procedure have been verified.

## Later move from Supabase Storage to Cloudflare R2

1. Create a private R2 bucket; keep public access disabled and obtain S3 credentials.
2. Back up the source bucket and database. Pause uploads/deletes during final copy.
3. Copy all objects preserving full keys, including `media/`, `cvs/` and any future
   generated sizes/object-key folders. Verify object counts, sizes and checksums.
4. Change `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` and
   `S3_REGION` (`auto` for R2). Keep `STORAGE_DRIVER=s3` and redeploy.
5. Run the connection check and verify published/draft images, private CV access,
   new uploads, deletion and a redeploy. Retain the source for a recovery window.

No database-provider move or upload-record re-creation is required. Website URLs
remain Payload URLs. Changing credentials alone does not move objects; a rollback
after accepting new writes requires copying those writes back or retaining access
to them. Use the R2 S3 endpoint rather than a public serving domain.

## Verification

`pnpm test:storage` needs the guarded local test database, Mailpit and an existing
webpack production build. It starts/stops a loopback S3 simulator, runs the real
integration and production HTTP suites with synthetic uploads, and checks that
PUT/HEAD/GET/DELETE paths were exercised. It never uses real bucket credentials.
CI runs it after the normal tests. Ordinary test runs explicitly keep local storage.
After normal local integration fixtures exist, add `--copy-local` to verify the
local-file copy and its idempotent rerun before S3 acceptance. Add `--browser` to
run the six affected admin/preview permission checks on desktop/mobile while the
simulator remains running. CI uses both flags after the full normal browser suite.

For inspection through Postman, run:

```powershell
postman simulation run postman/simulations/storage/storage.sim.yaml --port 4103 --no-history --output ndjson
```

In another terminal set `CMS_TEST_STORAGE=s3` and
`CMS_TEST_S3_ENDPOINT=http://127.0.0.1:4103/s3`, then run integration and HTTP
tests sequentially. Stop the simulator afterward. The owned mock models only the
S3 operations used here; it checks SigV4 header presence, not signatures or real
bucket policies. Its context document records this limitation. A live provider
check and deployed verification remain separate evidence.

Netlify release automation, SMTP/scheduling and hosted upload request-size limits
still need deployment acceptance. This storage integration alone does not certify
Netlify readiness. See [Netlify deployment](netlify-deployment.md).
