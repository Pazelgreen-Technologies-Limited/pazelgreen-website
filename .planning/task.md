# Payload CMS implementation plan

Status: T01–T03 implemented and verified. T04–T12 remain pending.
Agreed: 2026-11-07. Read progress.md before starting work.

Infrastructure decision (2026-11-07): PostgreSQL is confirmed. Development uses
Docker Compose; APP_ENV selects DEV_DATABASE_URL, PRODUCTION_DATABASE_URL, or a
separate TEST_DATABASE_URL. Production must never fall back to Docker. Local
email is captured by Mailpit. Production database/SMTP providers remain pending;
the foundation uses persistent mounted public/private filesystem directories,
with a storage adapter required before choosing ephemeral hosting.

## Objective and scope

Add Payload CMS to the existing Next.js website. Preserve the current designs,
strict TypeScript, pnpm, and route-specific component colocation.

Included:
- Company phone, email, address, working hours, and social links.
- Blog posts, public images, categories, and missing blog frontend routes.
- Jobs, dynamic reference dictionaries, website applications, and hiring statuses.
- FAQs in the backend only, with no public routes or anonymous reads.
- A site-wide announcement bar above navigation, with scheduling.
- Privacy policy and terms pages.
- Editable search titles and descriptions for every public page.

Excluded:
- Homepage hero/headline/image/text editing and other homepage content editing.
- General page builders, other marketing copy, solutions/PAGEX CMS content,
  team directories, volunteer portals, and unrelated missing marketing routes.
- Contact-form delivery and newsletter integration.
- Applicant accounts, interview scheduling, and a full applicant tracking system.

Announcements and Home SEO remain included despite exclusion of homepage editing.

## Roles and review

- Two roles: admin and staff. Staff are editors; do not add a third editor role.
- Admins create/invite, deactivate, and delete staff, assign roles, approve and
  publish public content, and archive records.
- Staff create/edit drafts and submit for review. They cannot publish/approve,
  manage users, change roles, or permanently delete records.
- Allow restricted self-service profile/password updates without role changes.
- Use secure invitations/activation, not emailed passwords. Bootstrap the first
  admin through controlled setup. Protect the final active admin from removal,
  deactivation, or demotion.
- Prefer staff deactivation to deletion. Preserve historical attribution when
  an admin deletes a staff account.
- Workflow: draft -> in review -> published, or returned for changes with a note.
  Edits after submission invalidate pending approval. Keep the last published
  version live while a replacement is edited.
- Apply review to all public CMS content: settings, categories, media exposure,
  jobs, announcements, legal pages, and SEO. Admin approval also controls public
  job open/closed changes; automatic expiry applies independently.
- Staff/admins can immediately update private hiring statuses, notes, and
  assignments; these operational actions need no editorial approval.
- Record creator/modifier/reviewer/publisher, timestamps, and hiring history.
- Enforce permissions server-side on every exposed API and upload/download
  endpoint. Public reads must never reveal drafts or private application records.

## Company details

Use a global for primary phone/email/address, optional department contacts,
working hours by day/range with closed state and timezone (Africa/Lagos initially),
and ordered social links with platform/label/URL. Feed footer and Contact details
from one source. Private notification recipients must be stored separately.
Verify real contact details and social URLs before seeding production.

## Blog and media

Collections: posts, categories, and public media.
Posts: title, unique slug, excerpt, rich-text body, cover/inline images, author
attribution, category relationships, publication date, SEO, and review workflow.
Categories: name, unique slug, optional description.
Media: image, useful alt text for informative images, optional caption/attribution.
Build /blog and /blog/[slug], pagination, category filtering, empty states,
and not-found behavior. Preview drafts only through authenticated preview access.

## Careers and dynamic code dictionaries

Collections: jobs, employment types, departments, position codes.
Jobs: title, unique slug, department, position code, employment type, location,
remote/hybrid/on-site arrangement, summary, responsibilities, requirements,
optional compensation, application deadline/timezone, open/closed state,
publication workflow, immutable reference fields, and SEO.

Initial employment types: Direct=D, Contract=C, Internship=I.
TE=Technology & Engineering and DH=Department Head are user-provided examples.
The complete code list is pending; do not treat example seeds as a final list.
Admins manage dictionaries, with normalized unique codes and delimiter validation.
Retire referenced entries instead of deleting them. Position codes may be used
by jobs across departments. Staff can select codes, not change the dictionaries.

Advert reference:
- Example: D-TE | DH-2027-01. REF-ID: is a display label, not stored ID content.
- Pattern: {employmentCode}-{departmentCode} | {positionCode}-{year}-{sequence}.
- Sequence counts ALL adverts company-wide within the year, across departments.
- Allocate once on first approved publication using the Africa/Lagos calendar year.
  Drafts have no final reference.
- Use an atomic annual counter plus database uniqueness, never count()+1.
- Pad to at least two digits; 100 stays 100. Never recycle, wrap, or renumber IDs;
  gaps are acceptable.
- Snapshot codes/year/sequence. Dictionary edits, year changes, closure, reopening,
  and later job edits must not rewrite an issued reference.
- Lock reference-defining employment/department/position fields after publication;
  materially different vacancies get new adverts.
- Use a URL-safe slug/internal ID for URLs rather than the display reference.

Build /join-us/careers and /join-us/careers/[slug] with application UI.
Only published, open, unexpired jobs appear in any public listing, including Join Us.
Closed/expired detail URLs show a closed state with applications disabled.
Draft/unpublished URLs return not found. Recheck eligibility server-side when
receiving applications. Admins may reopen the same advert without a new reference.

## Applications and recruitment

Use a private applications collection and private CV storage, separate from media.

Initial form:
- Required: full name, email, CV (PDF or DOCX, maximum 5 MB), acknowledgement of
  the recruitment privacy notice.
- Optional: phone, portfolio/LinkedIn URL, short supporting message.
- Automatically link the job; do not ask candidates to enter advert IDs.
- No applicant accounts or sensitive demographic questions initially.

Applicant reference example: D-TE | DH-2027-01-001.
Allocate an atomic sequence per advert on successful durable submission.
Pad to at least three digits; 1000 stays 1000. Preserve IDs permanently.
Use database uniqueness, transaction-safe allocation, and submission idempotency.
A retried submission or email retry must not create a second application/ID.
Allow intentional later submissions; flag matching email/job for staff review.

Show the ID on the success screen and email an acknowledgement.
Notify staff through private configured recruitment recipients. Email failure
must not lose a saved application: retry delivery and show failures to staff.
Statuses: New, In Review, Shortlisted, Interview, Offer, Hired, Rejected, Withdrawn.
Support filters by job/status, optional staff assignment, and private notes/history.
Do not automatically send rejection/offer/status emails in this phase.

Restrict applicant details/CVs/notes to staff/admins. No public enumeration or
public media URLs. Validate upload content/type/size server-side, implement abuse
controls, and keep applicant personal data out of logs.
Document a configurable retention policy. Company approval of duration and
recruitment privacy/legal copy is a launch dependency; do not invent final policy.

## FAQs

Backend-only collection: question, restricted rich-text answer, optional group,
sort order, and draft/admin approval workflow. No public page, anonymous API
read, sitemap inclusion, or search integration until explicitly requested.

## Announcement bar

Support multiple saved records, displaying one eligible notice at a time.
Fields: internal title, short message, optional link label/URL, enabled switch,
optional start/end timestamps, priority, and draft/admin approval.
Validate end after start and show the scheduling timezone to editors.
Eligibility: published, enabled, and currently within its schedule.
Choose highest priority, then latest publication, then stable internal ID.
If none qualify, render no bar. No carousel or stacking initially.
Render above navigation on all public pages without overlap on mobile/desktop.
Schedules must activate/expire without another publish action; account for cache
boundaries and the existing fixed navbar.

## Legal and SEO

Legal collection: fixed privacy-policy/terms identities, title, rich-text content,
effective date, version history, and workflow. Build /privacy-policy and
/terms-of-service and connect the footer. Require approved legal copy before launch.

SEO: title/description with defaults and draft/admin approval.
Use a constrained global keyed to existing static public routes. Store blog/job/
legal SEO on its owning document to avoid competing sources. Include new listing
pages. Emit server-rendered metadata and exclude drafts/private data from indexing
and sitemaps. Search engines may choose different displayed text.

## Delivery tasks

- [x] T01: Inspect current working tree and relevant local Next.js guides. Record
  Node/pnpm versions, verify current Payload compatibility, and run baseline checks.
- [x] T02: Add Payload foundation, isolated frontend/admin layouts, database
  migrations, generated types, environment documentation, and persistent public/
  private storage. Use Docker PostgreSQL locally and explicit production DB/SMTP/
  persistent storage settings. Production providers remain a launch dependency.
  Do not expose secrets.
- [x] T03: Implement users/invitations, access rules, last-admin protection,
  draft/review/publish behavior, authenticated previews, history, and audit fields.
- [ ] T04: Implement company settings and existing-page SEO; seed verified data
  and connect footer/contact fields without redesigning the site.
- [ ] T05: Implement blog/categories/public media and blog frontend routes.
- [ ] T06: Implement dictionaries, jobs, annual references, careers routes,
  open/closed/expiry behavior, and dynamic Join Us openings.
- [ ] T07: Implement applications, per-advert IDs, private CVs, hiring workflow,
  acknowledgements, staff notifications, and retry-safe delivery.
- [ ] T08: Implement backend-only FAQs and test denied anonymous reads.
- [ ] T09: Implement announcements, scheduling, selection, and responsive navbar.
- [ ] T10: Implement legal pages and SEO for newly built routes.
- [ ] T11: Complete cache invalidation, sitemap behavior, integration/E2E tests,
  migrations/backup instructions, editor onboarding, and operational documentation.
- [ ] T12: Validate launch dependencies: actual codes, verified content, approved
  legal/retention policy, email/storage/database deployment, and navigation.
  Record unrelated missing routes separately without expanding implementation.

## Required acceptance checks

- Role/API tests cover anonymous/staff/admin access, role escalation, user
  management, last-admin protection, drafts, and private CV downloads.
- Approval tests prove draft edits preserve live content, staff cannot publish,
  post-submission edits invalidate review, and publication refreshes public data.
- Reference tests cover cross-department annual numbering, year rollover,
  concurrent publishing/applications, idempotent retries, padding overflow,
  dictionary edits, closure/reopening, and failed submissions.
- Closed/expired jobs disappear from listings and reject new applications on
  the server. Closed detail pages remain informative.
- Validate uploads and prove saved applications survive notification failure.
- Test blog pagination/filtering, legal routes, metadata, FAQ privacy, announcement
  disabled/future/expired/tied records, and schedule boundaries.
- Check announcement/navigation and application forms for responsive behavior
  and accessibility.
- Run pnpm lint, TypeScript checks, production build, and meaningful integration/
  E2E checks. Report unavailable checks honestly; no unrun tests reported as passing.

## Handoff

Mark tasks complete only after implementation and verification. Keep decisions,
changed files, test evidence, blockers, and the next action in progress.md.
Record scope changes before expanding implementation.
