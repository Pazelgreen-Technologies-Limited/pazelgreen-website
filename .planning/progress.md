# CMS implementation handoff

Last updated: 2026-11-15. Code baseline: `ee3df3b`.
**T01–T10 are implemented and verified. T11 is next. T11–T12 are incomplete.**

This file is the current snapshot. Read [task.md](task.md) for agreed scope and
acceptance requirements. Older experiments, failures and superseded next actions
are preserved in [history.md](history.md); they are historical evidence only.

## Start here

1. Read [AGENTS.md](../AGENTS.md), task.md and this file.
2. Inspect `git status` and the code before editing; preserve other work.
3. Confirm the requested task. The latest user request is a documentation audit;
   it does not request implementation of T11.
4. For implementation, select the supported runtime and read relevant installed
   Next.js guides. Do not rely on older Next.js conventions or a temporary runtime.
5. Update this snapshot, task checkboxes and relevant human guides after verified
   changes. Keep dated detail in history.md and distinguish completed checks from
   proposed work. Never include secrets or applicant data.

## Completed implementation

| Task | Delivered behavior | Commit |
| --- | --- | --- |
| T01–T03 | PostgreSQL/Payload foundation, admin/staff, invitations, permissions, review, versions, audit and protected storage | `8645217` |
| T02/T03 follow-up | Automatic first-admin startup, mandatory initial password change, URL-derived Docker settings | `f573e32` |
| T04 | Reviewed company details and static-route SEO; shared Footer/Contact reads | `8caa57a` |
| T05 | Reviewed blog/categories/media, public listing/details and protected previews | `d481b1d` |
| T06 | Dictionaries, jobs, atomic annual advert references, public careers/Join Us and expiry | `086ce28` |
| T07 | Private applications/CVs, atomic applicant IDs, idempotency, hiring history and durable email queue | `06c237e` |
| T08 | Reviewed FAQs with no anonymous reads or public integration | `e7f9601` |
| T09 | One scheduled notice above responsive navigation; open-page boundary refresh | `e2c1cb1` |
| T10 | Fixed privacy/terms identities, approved public pages, protected previews and document SEO | `ee3df3b` |

Runtime follow-ups: `6bbadd4` enforces supported Node before startup; `617e6f1`
documents persistent Git Bash runtime selection. Node 24.22.2 and pnpm 10.18.1 are
pinned. The user's Git Bash has a persistent user-local Node installation; this
is machine setup, not a repository dependency. Other shells must select Node
explicitly. Never assume a runtime previously downloaded into Temp still exists.

## How the current system behaves

- Public pages read approved database records through Payload at request time.
  `lib/company-settings.ts` feeds both Footer and Contact. Before first publication
  or after unpublishing, it returns legacy hardcoded contacts/social placeholders.
  Published optional blanks are omitted. This fallback is not verified launch data.
- Blogs, careers, legal pages, announcements and editable SEO are database-backed.
  Homepage/other marketing copy and navigation remain code-controlled. No company
  posts, vacancies, notices, policies or candidate records were seeded. Only the
  agreed D/C/I employment dictionary entries were seeded by migrations.
- Staff draft/submit; admins approve public changes. Edits preserve the previous
  approved version. FAQs stay private after approval. Previews require active CMS
  access and send noindex/private/no-store headers.
- Advert numbering is company-wide per Lagos calendar year. Applicant numbering
  is per advert. Both are atomic, immutable and never recycled. Preserve counters
  with their records in backups. A submission retry does not allocate another ID.
- Recruitment forms require published enabled settings with an approved notice,
  version and retention duration. Recipients are a separate admin-only global.
  `pnpm cms:deliver` must be scheduled every minute; app startup does not run it.
  SMTP is at least once across crashes; retention dates request review, not
  automatic deletion. Staff can select themselves in the assignment picker;
  admins can select active colleagues. User-directory privacy is unchanged.
- Announcement selection refreshes on requests and in open pages at schedule
  boundaries/once per minute. Legal effective dates are calendar metadata, not a
  publication scheduler. Neither feature needs invented launch copy.

## Latest verification evidence

The following checks passed for the T07–T10 code baseline on 2026-11-15. They are
recorded results, not claims that the current documentation-only edit reran them.

| Check | Result |
| --- | --- |
| `pnpm lint`, `pnpm typecheck` | Passed |
| `pnpm test` | 63 unit tests passed |
| `pnpm test:integration` | 61 tests passed in the disposable local test database with Mailpit |
| `pnpm test:migrations` | Fresh schema/latest down/latest up passed; scratch database removed |
| `pnpm build` | Passed |
| `pnpm test:http` | Passed real production HTTP/privacy/SEO/PDF/DOCX checks |
| `pnpm test:browser` | 28 installed-Chrome checks passed on desktop 1280×900 and mobile 390×844 |
| `pnpm predev` | Applied all four T07–T10 development migrations; existing admin preserved |

Browser navigation emitted one Next stream-close log; no assertion failed. Test
servers stopped. No remote CI, push, production deployment or restore rehearsal
was performed. Baseline evidence and resolved test failures are in history.md.

Run integration → migration check → build → HTTP → browser sequentially, with
the [documented test setup](../docs/cms-setup.md#test-database-and-checks). Do not
rebuild `.next` while HTTP/browser servers are running. HTTP tests change fixtures;
rerun integration before retrying a failed HTTP sequence from the beginning.

## Next implementation: T11

When requested, start with a route/indexing audit, then implement the missing
sitemap/robots behavior. No sitemap/robots route files currently exist in `app/`.

1. Inspect request-time reads and browser cache behavior across approved settings,
   posts, jobs, announcements and legal pages. Preserve live content during drafts
   and schedule/deadline boundaries. Do not add caching that bypasses permissions.
2. Define sitemap/robots rules for real approved public URLs. Exclude drafts,
   authenticated previews, FAQs, applications, CVs and admin/API routes. Resolve
   closed/expired job indexing deliberately against the agreed behavior.
3. Audit navigation against implemented routes. Known issue: Footer Careers uses
   `/careers`; the implemented route is `/join-us/careers`. Other legacy links
   point at unbuilt marketing routes. Fix agreed links or record them; do not
   silently build excluded marketing features.
4. Extend meaningful acceptance checks for cache/indexing/navigation behavior.
   Existing suites already cover T01–T10; do not treat them as missing or rerun
   destructive fixtures against development/production.
5. Complete backup/restore and migration recovery instructions, editor onboarding,
   scheduler/queue monitoring and retention operations. Existing guides provide
   a foundation; a production restore rehearsal is not complete.
6. Run appropriate checks, record actual results and then mark T11 complete.

T12 is a separate launch acceptance task. Do not mark it complete based on a
successful local build or the existence of the CMS fields.

## T12 inputs and operational limits

- Confirm full company codes, contacts, hours, social URLs, initial articles/image
  rights and actual vacancies. Do not promote examples/fallbacks into approved data.
- Obtain company-approved privacy/terms/recruitment copy and retention duration,
  including deletion/legal-hold and backup-expiry procedures.
- Choose/provision production PostgreSQL, SMTP, HTTPS hosting and persistent
  public/private storage. Ephemeral hosting requires a storage adapter. Verify
  deployment, backups, permissions and recovery independently.
- Configure private recruitment recipients, delivery scheduling, monitoring and
  ingress upload/time/rate limits. No production provider or scheduler is provisioned.
- Production first-admin credentials belong in deployment secrets if needed;
  existing admins are preserved. Do not reset accounts to redo setup.
- Contact-form delivery, newsletters, applicant accounts, interview scheduling,
  homepage editing and unrelated marketing routes remain outside agreed scope.

## Documentation audit: 2026-11-15

Reworked README for human onboarding, corrected stale handbook/operations wording,
and moved superseded progress/task milestones into history.md. The current task
plan and this snapshot now agree on T11 next and T12 launch dependencies. No app
code, environment secrets, database records or task completion status changed.
Validation passed across 15 Markdown files and 103 local file/heading targets:
no missing targets, broken heading anchors or unbalanced fences. All 24 documented
command names match package scripts/pnpm built-ins; the four-path API YAML parses,
the task checklist has exactly T01–T10 checked/T11–T12 pending, and the About-page
asset files exist. Git whitespace validation passed. Application regression suites
were not rerun for this documentation-only change; their baseline results above
remain labelled as earlier evidence.
