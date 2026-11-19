# CMS operations and recovery

This runbook completes the engineering handoff for T11. It does not certify a
production deployment. Record the actual providers, owners and acceptance evidence
in the [T12 launch checklist](../.planning/t12-checklist.md). Use the supported
Node/pnpm versions and [environment setup](cms-setup.md#environment-selection).
Never copy credentials, applicant data, database dumps or recipient lists into Git.

## Publishing, caching and indexing

Public database reads call `connection()` before querying Payload. They request
`draft: false` and enforce anonymous access; React `cache()` only deduplicates a
render, not successive requests. There is no persistent CMS data cache or static
page cache to invalidate after approval. Publication, withdrawal and expiry are
visible on the next request without rebuilding. Do not add `use cache`, CDN HTML
caching or public authenticated-response caching without extending acceptance tests.

Next preserves shared layouts during client navigation. The frontend refreshes
server content on pathname/query changes, returning to a visible tab and browser bfcache
restoration, so company details in the shared Footer are refreshed too. Content
edited elsewhere while a visitor stays on the same visible page needs a refresh.
Announcements independently poll at schedule boundaries and at least once a minute.
Displayed job deadlines trigger a server refresh on the careers listing, Join Us
openings and job details. Inactive tabs can throttle timers; visibility restoration
refreshes data, and the application endpoint always rechecks eligibility itself.
Refresh merges server content while preserving unaffected form state.

`/sitemap.xml` is generated per request from the seven implemented static routes,
anonymous approved posts, open/unexpired approved jobs and approved legal documents.
Queries include every record, not just the first listing page. Drafts, withdrawn
records, previews, FAQs, private records, API/admin routes, query variants and
unbuilt marketing routes are excluded. Editorial save timestamps are omitted rather
than presented as dates of public changes. This single sitemap is intended for
fewer than 50,000 URLs; split with Next's `generateSitemaps` before that limit.

Closed/expired approved job URLs remain readable with applications disabled, but
emit `noindex, follow` and leave the sitemap. Reopening the same advert restores
index eligibility without changing its reference. Withdrawal returns not found.
Search engines update on their own crawl schedules; sitemap removal is not an
instant removal request.

`/robots.txt` advertises the sitemap using the deployment's `SERVER_URL` and
discourages administrative/API/preview crawling. Those responses also send
`X-Robots-Tag: noindex, nofollow`. Robots rules are not access controls; existing
server permissions protect private content. Staging must have hosting-level access
protection so production content and policies are not publicly mirrored.

## Navigation audit

The CMS routes, main navigation, Footer Careers and legal links have implemented
targets. Corrected `/careers` to `/join-us/careers`, and `/solution` to `/solutions`.
Legal links intentionally show an unavailable state until approved copy exists.

These pre-existing marketing destinations remain unbuilt and excluded from the
sitemap: `/team`, `/pagex`, `/market-intelligence`, `/supply-chain`,
`/quality-control`, `/analytics`, `/get-started`, `/demo`, `/join-us/signup`,
`/join-us/volunteer`, `/join-us/partnerships`. They appear in Footer, Navbar and
marketing calls to action. T12 must decide whether to hide them or redirect each
to a relevant existing page. Creating those features is outside the CMS scope.
Contact-form delivery and newsletter integration also remain excluded; do not
advertise their successful delivery as a launch acceptance result.

## Release and migration recovery

The process below assumes a persistent Node server. For Netlify's Next.js
deployment, use the [Netlify handoff](netlify-deployment.md) for explicit bootstrap,
durable storage and separate worker requirements; `pnpm start` is not its startup path.

1. Identify the release commit, migration list and selected environment. Check
   the database identity through the provider console and a database session;
   `APP_ENV` validation does not establish that a supplied production URL is correct.
2. Run the [test sequence](cms-setup.md#test-database-and-checks) on a disposable
   database, including fresh schema/latest down/latest up. Rehearse the release
   against an isolated staging copy at the previous production schema when upgrading.
3. Obtain a consistent database/files backup and verify its manifest. Pause writes
   and delivery if migration compatibility or a consistent snapshot requires it.
4. Build the reviewed release. Inspect `pnpm exec payload migrate:status`, run
   `pnpm cms:migrate` exactly once in the controlled release job, inspect status
   again, then start compatible app replicas with `pnpm start`.
5. Verify HTTPS public pages, staff/admin login, approved metadata, sitemap,
   draft denial, image bytes and authenticated CV downloads. Verify SMTP and
   scheduler delivery separately. Resume traffic and workers only after acceptance.

If migration fails, stop the rollout and retain the error without dumping data or
connection strings. Inspect migration status and the actual schema in a restricted
session: a process failure alone does not prove whether a migration committed.
Do not repeatedly rerun a partially applied migration, edit its ledger, or use
`migrate:fresh`, `migrate:reset` or down commands against production.

Reproduce using a restored isolated copy. Prefer a reviewed forward repair;
only roll code back if the previous code supports the resulting schema. If a
database restore is necessary, coordinate the same recovery point for files,
database and release. Obtain the operator's incident approval before replacing
live data. Reconcile applications accepted after the recovery point before
reopening recruitment: missing issued references can otherwise be reused, and
lost delivery commits can repeat emails. A code rollback is not data recovery.

## Backup procedure

The operator must agree frequency, retention, encryption, recovery point objective
(maximum lost work), recovery time objective (maximum outage), legal holds and
backup expiry before launch. Protect backups with access separate from the app.
Include PostgreSQL, both upload directories and the matching release/migration
manifest. Recover required secrets through the secret manager, separately from dumps.

For a filesystem installation, use a maintenance window or a verified coordinated
snapshot process. Pause public writes, admin edits and the delivery worker; let
in-flight requests finish. Snapshot the public/private upload mounts and database
within that write-free window. PostgreSQL includes the annual and per-advert
counters, versions, private applications, acknowledged notices and queue states;
never back up selected tables while omitting those records.

Provider-managed snapshots/PITR are acceptable when matched with file recovery.
For an operator-managed logical backup, use PostgreSQL client tools compatible
with the server. Configure a libpq service named `pazelgreen-backup` through the
operator's protected service/password files (not command-line credentials).
The following example paths must be replaced with protected backup destinations:

```sh
pg_dump --dbname="service=pazelgreen-backup" --format=custom --file="/secure-backups/release/database.dump"
pg_restore --list "/secure-backups/release/database.dump"
```

An archive list is only a structural check, not a successful restore. Capture the
two filesystem snapshots with the platform's backup tool, preserving file bytes,
names and restricted ownership. Record commit, migration status, snapshot times,
file checksums/counts, backup tool exit results and recovery point in a restricted
manifest. Check encryption, off-host replication and access. Resume writes and
workers; alert on missed backups. Do not store dumps inside this checkout or mounts
that disappear with the app host.

## Isolated restore rehearsal

1. Provision a separate empty database and separate public/private mounts with no
   public ingress. Never test a restore by overwriting development or production.
2. Disable schedulers and route all email to a test sink such as Mailpit; block
   outbound production SMTP at the network layer. Restored delivery rows and user
   addresses can otherwise trigger real emails. Restrict access to the restored data.
3. Configure a protected libpq service named `pazelgreen-restore` for that database.
   Independently verify its hostname and database name before restoring:

   ```sh
   psql "service=pazelgreen-restore" -c "SELECT current_database(), inet_server_addr(), inet_server_port();"
   pg_restore --dbname="service=pazelgreen-restore" --exit-on-error --no-owner --no-acl "/secure-backups/release/database.dump"
   ```

4. Restore matching files into the isolated mounts and apply correct restricted
   ownership. Start the backed-up release with that environment's protected
   configuration. Do not start newer code and automatically mutate the restored
   schema before verifying the recovery point. Check migrations with migrate:status.
5. Check an authorized login, approved pages and sitemap; draft/private anonymous
   denial; public image bytes; authorized PDF/DOCX downloads; restored counters and
   issued references; acknowledged notice snapshots and queue delivery states.
   Compare file checksums against the manifest. Do not paste records into evidence.
6. In the isolated copy, verify a controlled test publication/submission allocates
   a reference above the restored counters and delivery goes only to the sink.
   Rehearse an upgrade separately if needed. Do not alter production counters.
7. Record backup identifiers, release/schema, elapsed restore time, achieved
   recovery point, checks and issues in restricted operational evidence. Destroy
   the isolated sensitive copy under the approved retention procedure afterward.

No production backup or restore rehearsal has been performed by T11. T12 requires
evidence from the chosen infrastructure; the local migration roundtrip is not a
substitute.

## Scheduler, queue and service monitoring

Run `pnpm cms:deliver` every minute with the deployed release, production environment
and secret-manager access. Use a supervised scheduler with execution history and
alerts. Do not assume startup runs the worker. A Linux host can use a systemd timer
or cron; managed hosting can use its scheduled job facility. Set its working directory
to the release, select the pinned Node/pnpm, and load secrets through that platform.
Multiple workers are safe through row locks; each invocation processes at most 50
due applications. Avoid accumulating stalled processes and monitor execution time.

The worker prints only processed counts and exits after its batch. Exit zero does
not prove every email was sent: SMTP failures are saved as delivery states, and a
zero count can mean no due work or entries waiting for backoff. Inspect Applications'
Candidate/Staff Delivery, Delivery Attempts and Next Delivery At. Alert on scheduler
silence (initial target: three missed minute runs), process failures, failed delivery
states and increasing due backlog/age. Tune alert ownership and targets in T12.
Retry uses existing rows; do not recreate applications, reset sent states or counters.

If delivery fails, verify private recipients, sender/domain, SMTP credentials and
provider health in restricted settings. Fix configuration and allow scheduled
backoff retries, or have an authorized operator bring due dates forward in a
controlled incident action. Re-run the worker and verify both destinations in the
CMS and provider evidence. Redact addresses, tokens and payloads from shared logs.
SMTP is at least once across crashes, including restore-related replay.

Monitor HTTPS public/admin health, PostgreSQL connectivity/capacity, upload mount
availability/free space, error rates, backup success and scheduler history. Verify
monitoring with a controlled failure during deployment acceptance. Keep proxy/body
logs free of form contents, cookies and authorization headers. Set ingress upload,
timeout and rate limits and preserve same-origin behavior. Review account removal
and recruitment retention regularly using the [recruitment runbook](recruitment.md).

## Editor onboarding and handoff

1. An admin invites each person through Users/Invitations. Use individual accounts;
   activation links expire after 24 hours. Staff need no database, Docker or secrets.
2. Confirm the correct hosted `/admin` address and role. A bootstrapped first admin
   must change the initial password; never share that account with editors.
3. Practise with an artificial draft: save, preview while authenticated, submit
   unchanged for review, then have an admin approve. Verify the normal public URL
   in a signed-out browser. Draft previews are private and not sharing links.
4. Practise replacing a published record: the old approved copy remains live;
   edits after submission invalidate review. Return for changes with a note, submit
   again and publish. Verify the page/metadata and refresh an already open tab.
5. Use the topic guides for [blog](blog-editing.md), [careers](careers-editing.md),
   [FAQs](faqs-editing.md), [announcements](announcements-editing.md) and
   [legal pages](legal-editing.md). FAQs stay private after approval. Legal effective
   dates do not schedule publication. Only approved open jobs accept applications.
6. Hiring staff practise private notes/statuses and an authorized CV download with
   artificial data. These actions need no editorial review and send no status emails.
   Keep real candidate information in the CMS, not email threads or handoff notes.
7. Assign a content approver and operational owner. Record how to report failures,
   revoke/deactivate departing users, review due retention and request restoration.
   Confirm each editor can complete their assigned workflow before granting launch
   readiness. Admins manage users and dictionaries; staff cannot publish or escalate.

For onboarding, admins must assign section access on the invitation or user record.
New and existing staff default to No access after the permissions migration.
See [staff permissions](staff-permissions.md) for View/Modify rules and rollout.
