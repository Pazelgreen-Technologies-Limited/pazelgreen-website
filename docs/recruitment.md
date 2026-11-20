# Recruitment operations

CV bytes use the configured private filesystem directory or the private S3
bucket's `cvs/` prefix. Downloads still require Payload Recruitment access; never
make the bucket public. See [object storage](object-storage.md) for setup, failed
submission cleanup, existing-file transfer and provider cutover.

Applications are private and have no applicant login. Admins and staff with Recruitment View/Modify can filter Applications by job/status.
Updating statuses or notes requires Recruitment Modify (or admin). Staff with
Recruitment Modify can select themselves
in the assignment picker; admins can select active colleagues with Recruitment access. The existing
user directory remains private to administrators.
Hiring History retains the actor ID and each operational change immediately;
these private actions do not require editorial approval. No status-change emails
are sent. Deactivating staff retains historical attribution.

## Enable applications

1. Obtain company approval of recruitment privacy text and retention duration.
2. In Recruitment Settings, enter that notice, a version identifier, and retention
   days. Enable applications, save, submit for review, and have an admin publish.
3. An admin configures private email recipients in Recruitment Delivery.
4. Schedule `pnpm cms:deliver` every minute with the same environment as the app.
   Locally, run it manually to deliver into Mailpit. Each run handles up to 50
   due applications. Schedule another run while a backlog remains.

No notice or policy is seeded. Disabled/unpublished settings hide the form and
reject submissions. Published settings stay live while a replacement is drafted.
Changing the notice version requires candidates with an older open form to reload.
Each application snapshots the acknowledged notice/version and time.

## Submission and privacy

Required fields are full name, email, PDF/DOCX CV up to 5 MB and acknowledgement.
Phone, portfolio/LinkedIn URL and message are optional. CVs use random filenames
outside Next's public directory. Both record reads and actual file downloads
require active CMS access. Downloads use private/no-store and attachment headers.
Private CV bytes cannot be replaced. Files attached to applications cannot be
deleted through the normal file API.

The server checks actual file content, bounded ZIP expansion for DOCX, upload
size, safe portfolio URLs and current published/open/unexpired advert state.
Publication and application receipt share the advert transaction lock. Applicant
sequence allocation, record/history creation and retry identity commit together.
The reference extends the advert with at least three digits, never wraps, and is
immutable. Failed submissions roll back numbering. Include applications and
applicant_counters in the same consistent database backup as jobs/counters.

The form retains a random retry key while open. Retrying identical data with that
key returns the same reference, including after closure. A changed payload with
the same key is rejected; reload for an intentional new submission. A fresh key
allows a later application; matching email/job is flagged for staff review.
There are no public application lookup/list/detail endpoints. Success returns
only the reference to the submitting form; do not place personal data in URLs.

Same-origin submission, a honeypot, bounded request bodies and shared PostgreSQL
hourly quotas (five accepted applications per email; 1,000 total) provide baseline
abuse controls across processes. Deploy behind an ingress with request timeouts,
body limits and network rate limiting before public launch. Email variations can
evade email quotas; these controls do not replace ingress protection or malware
scanning. Treat CVs as untrusted documents when opening them.

## Delivery and recovery

Application success means the database commit succeeded. Sending is independent.
Candidate Delivery and Staff Delivery show pending/sent/failed in Applications;
Delivery Attempts and Next Delivery At show retry progress. Missing recipients
fail staff delivery visibly while candidate delivery can succeed. Retry delays
start at two minutes and double up to 1,024 minutes (17 hours 4 minutes); no record
or ID is recreated. App startup does not run this worker automatically.
Overlapping workers lock rows with SKIP LOCKED. Successful destinations are skipped.
Notification emails to staff contain a reference and authenticated CMS link,
without candidate details or CV attachments. SMTP errors are not logged with data.

SMTP is at least once: a crash after remote acceptance but before the local commit
can cause a repeated email. Stable Message-ID values aid deduplication but cannot
guarantee exactly-once delivery across arbitrary mail providers. Monitor failed
queue entries and scheduler health. Do not reset sent flags for ordinary retries.

## Retention and backups

Retention Review At is calculated from the approved duration on receipt. It is a
review date, not automatic irreversible deletion. The company must approve its
deletion/legal-hold procedure before launch. An authorized operator should review
due applications, legal holds and queued deliveries, record the action without
candidate data, remove private history/application/CV records and bytes, and handle
backup expiry consistently with the policy. Preserve per-advert counters so IDs
are never reused. Do not truncate counters as a retention action.

Back up private files with the matching database snapshot, encrypt backups and
restrict restore access. Filesystem writes cannot participate in PostgreSQL
transactions: failed attempts clean up their own files, while process crashes can
leave orphan bytes. Reconcile unreferenced random files against private_files
after an appropriate grace period and verified backup; never delete active uploads.
Old hashed abuse buckets can be pruned after 48 hours from recruitment_rate_limits.
Do not put candidate data, CV contents or recipient lists in logs/planning files.

Staff need the corresponding section permission to view drafts or modify records.
Admins assign access per section; publication remains admin-only. See
[staff permissions](staff-permissions.md).
