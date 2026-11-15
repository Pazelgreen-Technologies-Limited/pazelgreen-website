# Careers editor guide

The **Careers** group in Payload manages employment types, departments, position
codes and job adverts. Public openings appear at `/join-us/careers` and on Join Us.
Each role has its own URL at `/join-us/careers/<slug>`.

## Set up reference dictionaries

Administrators manage dictionaries; staff can read and select entries. All three
dictionaries use the review workflow: save a draft, save `in-review`, then publish
as an admin without changing the submitted content.

The migration initializes only the agreed employment types: Direct (`D`), Contract
(`C`) and Internship (`I`). Department and position examples such as `TE` and `DH`
are **not** production seeds. Enter the company's confirmed codes before publishing
vacancies. Position codes can be used across departments.

Codes are normalized to uppercase and must start with a letter, followed by up to
11 letters or digits. Spaces, hyphens, pipes and other delimiters are rejected.
Codes must be unique within their dictionary. Names are public display labels.

To retire an entry, clear **Available for new adverts**, submit and publish. New
adverts cannot first publish with a retired or unpublished code. Existing issued
adverts can still close or reopen. Dictionary deletion is disabled; retirement
preserves relationships, including older drafts. Draft dictionary changes do not
affect the published entry until approved.

## Create and approve an advert

1. Create a job with a title and a unique lowercase URL slug. A slug is generated
   from the title if omitted. Changing a published slug changes its address.
2. Select published, active employment, department and position entries.
3. Enter location, remote/hybrid/on-site arrangement, summary, responsibilities
   and requirements. Each line in responsibilities/requirements becomes a list
   item. Content is plain text; HTML is not interpreted. Compensation is optional.
4. Optionally set an application deadline. The admin date picker uses the browser's
   timezone. The API accepts an ISO timestamp with an explicit UTC offset, for
   example `2027-02-01T17:00:00+01:00`. Storage is UTC. **Deadline timezone** is an
   IANA timezone used for public display; changing that label does not move the
   deadline instant. Leave the deadline empty for an open-ended advert.
5. Set state to open or closed and optionally enter the advert's SEO title and
   description. Public metadata falls back to the job title and summary.
6. Save a draft and use Preview while signed in. It opens a protected, noindex
   preview; normal public URLs always render approved content, even for editors.
7. Save review state **in-review**. An admin approves the unchanged draft using
   Publish. Edits after submission require another submission for review.

Staff cannot publish, delete adverts, or change dictionaries. Review notes, history
and audit attribution are private to CMS users. Admins can return work with a note.

## Permanent advert references

The first successful approved publication assigns a reference such as
`D-TE | DH-2027-01`. `REF-ID:` is a display label, not stored reference content.

The number is company-wide for the Africa/Lagos calendar year, independent of
department or employment type. Concurrent publications use an atomic PostgreSQL
counter inside the publication transaction, with unique database constraints.
Failed publications roll back their allocation. Retrying an already successful
publish returns a review conflict instead of allocating again; reload the advert
to see its issued reference. There is no manual counter editor.

Employment/department/position codes, year and sequence are snapshotted. Later
dictionary edits, year rollover, closure, reopening and unpublishing never rewrite
the reference. Numbering pads to two digits and continues past 99. Gaps are allowed;
numbers are never recycled.

After first publication, the three reference-defining relationships are locked,
including in drafts. Create a new advert for a materially different vacancy.
Issued adverts cannot be permanently deleted; close or unpublish them instead.
PostgreSQL also guards issued reference changes and deletion. Draft-only adverts
have no final reference and can be deleted by an admin.

## Public states and SEO

Listings show only published, open, unexpired adverts. The careers listing is
paginated, 12 per page; Join Us shows up to four current openings with a link to
the full listing. An empty listing explains there are no open positions.

Closing/reopening a job is an editorial change requiring approval. A draft closure
leaves the last approved advert open. Expiry at the exact deadline is automatic:
pages query approved data at request time without a rebuild or another publish.
Closed/expired detail URLs remain informative and show applications are closed.
Unpublished and draft-only detail URLs return a not-found page.

Listing metadata lives under **Website → Page SEO → Careers listing**. A job's
metadata lives on that job. Both require admin approval.

## Applications and launch inputs

T06 supplies role information and eligibility states. T07 adds applications, private
CVs, applicant IDs and queued notifications. See [recruitment operations](recruitment.md)
for approved notice/retention setup and the delivery scheduler. Applications stay disabled
until that setup is approved and published. Closed/expired roles reject submissions.

Before launch, the company must confirm its dictionaries, real vacancies and
deadline instants. No real vacancies are seeded. Approved recruitment privacy
copy and retention duration remain launch inputs for the application feature.

## Developer verification

Use the supported Node runtime and running local Docker services. `TEST_DATABASE_URL`
must identify a disposable localhost database ending in `_test`; integration tests
reset it. Never point these checks at real candidate or company records.

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:migrations
pnpm build
pnpm test:http
pnpm test:browser
```

Run database/HTTP/browser suites sequentially because they share fixtures. Browser
and HTTP servers must stop before rebuilding; retry failed HTTP sequences only
after integration has restored their fixtures. Browser
tests use Chromium (`pnpm exec playwright install chromium`) or installed Chrome
with `PLAYWRIGHT_CHANNEL=chrome`. Tests cover role permissions, draft privacy,
atomic concurrent publication, retries, failed allocation rollback, Lagos year
rollover, sequence overflow, immutable codes, retirement, pagination, closed states,
request-time expiry, protected previews, metadata and desktop/mobile navigation.

The migration round trip creates and removes its own local scratch database and
requires a database role with `CREATEDB`. It rolls back/reapplies the latest schema
migration; that can remove its tables/data. This is a disposable-database check,
not a production recovery strategy.
Production recovery must preserve counters alongside adverts and application data
in consistent database backups. Never reset counters to fill a sequence gap.
