# CMS implementation handoff

Last updated: 2026-11-19. T11 code baseline: `a87b7ca`; the subsequent documentation audit, T13 permissions and Netlify handoff are included in the staff-permissions release commit (see Git history).
**T01–T11 and T13 are implemented and verified. T12 and R2 are deferred by the user.**

This file is the current snapshot. Read [task.md](task.md) for agreed scope and
acceptance requirements. Older experiments, failures and superseded next actions
are preserved in [history.md](history.md); they are historical evidence only.

## Start here

1. Read [AGENTS.md](../AGENTS.md), task.md and this file.
2. Inspect `git status` and the code before editing; preserve other work.
3. T13 is complete and verified. Prepare Netlify deployment using the handoff below; durable upload storage is the first blocker. Review section permissions on Users/Invitations; existing staff default to No access. T12/R2 remain deferred; Supabase is selected and current filesystem uploads remain.
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
| T11 | Request-time sitemap/robots, browser/deadline refresh, indexing/navigation checks and operational/editor handoff | `a87b7ca` |

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
  admins can select active colleagues with Recruitment access. User-directory privacy is unchanged.
- Announcement selection refreshes on requests and in open pages at schedule
  boundaries/once per minute. Legal effective dates are calendar metadata, not a
  publication scheduler. Neither feature needs invented launch copy.

## T11 verification evidence (2026-11-15)

The following checks passed during T11 on 2026-11-15. Integration/HTTP tests used
only guarded disposable local fixtures. The final query-navigation refinement was
verified by a fresh build, lint/typecheck and the expanded browser suite.

| Check | Result |
| --- | --- |
| `pnpm lint`, `pnpm typecheck` | Passed |
| `pnpm test` | 63 unit tests passed |
| `pnpm test:integration` | 61 tests passed in the disposable local test database with Mailpit |
| `pnpm test:migrations` | Fresh schema/latest down/latest up passed; scratch database removed |
| `pnpm build` | Passed |
| `pnpm test:http` | Passed real production HTTP/privacy/SEO/PDF/DOCX checks |
| `pnpm test:browser` | All 36 installed-Chrome checks verified on desktop 1280×900 and mobile 390×844: 35 passed in the final full run, interrupted mobile schedule check passed in a targeted rerun |

Browser navigation emitted Next stream-close logs; the checked UI assertions passed.
One mobile schedule check timed out during an approximately eight-hour host pause;
its isolated rerun passed in 11.3 seconds. Earlier test-assumption corrections and
sandbox restrictions are recorded in history.md. Temporary test servers stopped.
T11 was committed as `a87b7ca` on 2026-11-19. No remote CI, push, production
deployment or production restore rehearsal was performed as part of this work.
No schema migration or development records were changed for T11.

Run integration → migration check → build → HTTP → browser sequentially, with
the [documented test setup](../docs/cms-setup.md#test-database-and-checks). Do not
rebuild `.next` while HTTP/browser servers are running. HTTP tests change fixtures;
rerun integration before retrying a failed HTTP sequence from the beginning.

## T11 completed: 2026-11-15

Added request-time sitemap/robots routes; anonymous approved URLs only, with closed/
expired jobs excluded and their readable details marked noindex/follow. Added
admin/API noindex headers, shared-layout refresh on pathname/query/visibility/bfcache
restoration, and displayed vacancy deadline refresh. Corrected Careers/Solutions
link typos; unbuilt marketing destinations remain recorded for a T12 decision.
New browser acceptance checks cover indexing, publication/withdrawal/history,
approved Footer navigation refresh and automatic deadline expiry.

Added docs/cms-operations.md for cache/indexing/navigation decisions, migration
recovery, consistent database/files backups, isolated restores, queue monitoring
and editor onboarding. Added [T12 answer/acceptance checklist](t12-checklist.md).
Actual production restore verification remains T12, not a local engineering claim.

Changed files: app/sitemap.ts, app/robots.ts, next.config.ts, frontend layout and
_components/PublicContentRefresh.tsx, components/RefreshAt.tsx, careers listing/
detail/JobView and Join Us CareersSection; Footer/CoreCapabilities/SolutionCTA
links; tests/browser/publication.spec.ts; README, operations/setup/handbook/legal
guides and planning records. No schema or generated-type change was needed.

The audit confirmed request-time approved reads in company settings, Page SEO,
blog/categories/media, jobs, legal pages and announcements; React cache is scoped
to rendering. No persistent CMS cache was introduced. Announcements keep their
existing schedule polling. Sitemap responses use max-age=0/must-revalidate;
authenticated previews and private CV downloads retain private/no-store behavior.

Verification is recorded above. Checks passed for 15 guide/planning Markdown files,
127 local link targets, 141 documented command occurrences, balanced fences,
task statuses and Git whitespace. All T11 engineering work is complete; company-approved data and actual
deployed services remain T12 dependencies.

T12 is a separate launch acceptance task. Do not mark it complete based on a
successful local build or the existence of the CMS fields.

## Documentation audit: 2026-11-19

Reviewed the repository documentation against the committed T11 code, package
scripts, environment configuration, CI checks and current scope. Fixed stale T11
next-step wording in README, updated the handoff with commit `a87b7ca`, aligned
the handbook/setup next action with deferred T12, and added T11 indexing/browser
behavior to the blog and careers topic guides. Changed files: README.md,
docs/payload-handbook.md, docs/cms-setup.md, docs/blog-editing.md,
docs/careers-editing.md and .planning/task.md/progress.md/history.md.
Historical entries remain dated evidence. No application code or task completion
status changed. Application regression tests were not rerun for documentation-only
edits; the T11 evidence above remains explicitly dated 2026-11-15.

Audit validation passed: 17 repository Markdown files, 130 local file/heading
targets, 142 documented command occurrences, balanced fences, five About assets,
CLAUDE.md's AGENTS.md reference and the parsed four-route API YAML. Task status
checks confirm T01–T11 complete/T12 deferred. Git whitespace validation passed.
The audit is complete; subsequent authorised T13 work is recorded below.

## T12 inputs and operational limits

**Deferred on 2026-11-19:** the user requested committing T11 before further
rearrangements. T13 section permissions were subsequently authorised and completed. Keep the
[T12 checklist](t12-checklist.md) for when launch work resumes; record answers
and scope decisions before implementing the remaining production acceptance list.
Do not put credentials, private recipients or applicant data into planning files.

- Confirm full company codes, contacts, hours, social URLs, initial articles/image
  rights and actual vacancies. Do not promote examples/fallbacks into approved data.
- Obtain company-approved privacy/terms/recruitment copy and retention duration,
  including deletion/legal-hold and backup-expiry procedures.
- Configure the selected Supabase PostgreSQL, choose SMTP/HTTPS hosting and persistent
  public/private storage. Ephemeral hosting requires a storage adapter. Verify
  deployment, backups, permissions and recovery independently.
- Configure private recruitment recipients, delivery scheduling, monitoring and
  ingress upload/time/rate limits. Supabase account is available per the user; no production deployment or scheduler was provisioned in this work.
- Production first-admin credentials belong in deployment secrets if needed;
  existing admins are preserved. Do not reset accounts to redo setup.
- Contact-form delivery, newsletters, applicant accounts, interview scheduling,
  homepage editing and unrelated marketing routes remain outside agreed scope.

## T13 section permissions: complete, 2026-11-19

Admins now assign No access, View or Modify on Users and Invitations. Modify
covers every record in a section, regardless of author. Nine sections cover Blog,
Media, Careers, Recruitment, Company details, Page SEO, FAQs, Announcements and
Legal pages. Admin-only publishing, deletion, dictionaries, recipients and user
management remain enforced. Public approved reads remain available without CMS
access. Staff cannot self-escalate; permission changes revoke affected sessions.

Navigation and direct admin routes use Payload's admin.hidden rules. Server
access functions protect writes, versions, previews, applicant data and CV bytes.
Related media reads retain their own approved-content filter when a blog viewer
lacks Media access; public images render without exposing private review fields.

Migration `20261119_192433_staff_section_permissions` adds nullable permission
select fields with No access defaults to users and invitations. Existing staff
and pending invitations require explicit admin assignments; admins retain full
access. Applied to the verified local development database and disposable test
schema only. No production migration or deployment was performed. Upload files
and company content were not migrated or seeded.

Changed files: cms/permissions.ts and shared access/workflow/global-review rules;
users/invitations, media, recruitment, FAQs, announcements and preview endpoint;
three frontend preview pages and lib/blog.ts; payload.config.ts, generated types,
migration TS/JSON/index; unit/integration/HTTP/browser/migration tests; README,
all CMS human guides, API YAML and planning records. Earlier documentation-audit
edits are preserved. The [staff permission guide](../docs/staff-permissions.md)
explains setup, section mapping, exceptions and rollout.

Verification on 2026-11-19:

| Check | Result |
| --- | --- |
| `pnpm lint`, TypeScript | Passed; production build also completed TypeScript |
| `pnpm test` | 73 unit tests passed |
| `pnpm test:integration` | 67 tests passed, including CLI bootstrap, invitation inheritance, other-author edits, view-only and cross-section denial, populated-media privacy and session revocation |
| `pnpm test:migrations` | Fresh schema/latest down/latest up passed; scratch database removed; both users/invitations permission defaults verified |
| `pnpm exec next build --webpack` | Passed production compilation, type checking, page generation and tracing |
| `pnpm test:http` | Passed production HTTP permissions, publication/privacy, PDF/DOCX downloads and revocation checks |
| `pnpm test:browser` with installed Chrome | All 42 checks passed on desktop/mobile in 2.9 minutes; includes six new admin permission checks |
| Documentation/Git | 18 Markdown files and relative targets checked, four-route YAML parsed, whitespace check passed |

Default `pnpm build` (Turbopack) failed in the unchanged Google-font resolver path;
a fresh-output retry stalled and was stopped. This issue remains unresolved;
production acceptance above uses Next's supported webpack mode, with no package
script change. Payload config now uses native createRequire for CommonJS @next/env
compatibility with both Node CLI and Next bundlers. Next emitted stream-close logs
during browser navigation; the checked assertions all passed. Earlier failed runs
and test-assumption fixes are recorded in history.md.

## Netlify deployment handoff: 2026-11-19

The user requested updated documentation and a commit after clarifying deployment
requirements. Added [Netlify deployment](../docs/netlify-deployment.md) and linked
setup, operations, handbook and README to it. Local T13 verification above remains
the application evidence; no application code changed in this documentation pass.

Next action: resolve durable public/private upload storage for Netlify. Current
filesystem uploads require persistent mounts; directory environment variables do
not provide them. R2 remains deferred; no alternative adapter is implemented.
Then configure production secrets/SMTP, the reviewed webpack build command,
controlled Supabase migrations and explicit `pnpm cms:bootstrap` if no admin exists.
Netlify's standard deployment does not run `pnpm start`/`prestart`. Configure a
separate recruitment delivery scheduler if enabled, assign staff access, and verify
the hosted release including persistent uploads, private CV access and recovery.

The implementation, prior documentation audit and this handoff are included in
the user-requested commit; locate it by subject `feat: add staff section permissions`.
No push or production changes are included. T12 and R2 remain deferred. Preserve
existing account credentials and content. This pass verified 16 Markdown files,
129 local file targets, balanced fences and Git whitespace checks. The recorded
application suites were not rerun for prose edits.
