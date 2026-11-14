# CMS implementation progress

Last updated: 2026-11-14.
Current phase: T01–T04 complete and verified; next planned implementation is T05.

## Start here

1. Read AGENTS.md and .planning/task.md.
2. Inspect git status and relevant files; preserve other contributors' work.
3. Continue with the next unchecked task; read relevant local Next.js guides before code.
4. Update this record with implementation evidence and the next concrete action.

## Completed

- Reviewed all five existing public pages and shared content for CMS needs.
- Confirmed the narrowed scope with the user and documented it in task.md.
- Defined annual advert IDs, per-advert applicant IDs, dynamic dictionaries,
  admin/staff permissions, admin approval, and backend-only FAQs.
- Chose startup-friendly application fields, private CVs, hiring statuses,
  and one visible announcement selected from multiple saved records.
- Created task.md and progress.md and added handoff rules to AGENTS.md.
- Completed T01 baseline/runtime checks and T02/T03 CMS foundation, access,
  invitations, approval workflow, protected storage/previews, migrations and tests.

## Confirmed decisions

- Advert sequence counts all adverts company-wide within a year.
- Admin-managed code dictionaries must support changes; full code list pending.
- Closed jobs disappear from public listings.
- Staff/admins create jobs and track applications. Only admins manage users.
- Staff prepare drafts; admins approve public changes.
- FAQs remain backend-only.
- Homepage hero/content editing is excluded; announcements and page SEO are included.
- Announcements support enabled state, optional links, and scheduling.

## Defaults selected

- Allocate immutable advert IDs on first approved publication, using Lagos year.
- Allocate immutable applicant IDs per advert on successful durable submission.
- Required application fields: name/email/CV/privacy acknowledgement.
  Phone, portfolio link, and supporting message are optional.
- Success screen and acknowledgement email show the applicant reference.
- Staff manage private hiring statuses immediately; public job state changes
  require admin approval. Automatic expiry applies independently.
- Closed detail URLs remain informative with applications disabled.
- No applicant accounts or automatic rejection/offer/status emails initially.
- Multiple saved announcements, one eligible notice visible at a time.
- Prefer staff deactivation, preserve historical attribution on deletion,
  and protect the final active admin.
- PostgreSQL confirmed by the user; Docker Compose for development. Production provider remains unselected.

## Pre-implementation observations (historical)

- package.json declares Next.js 16.2.9 and React 19.2.4; Payload is absent.
- Existing pages: Home, About, Solutions, Join Us, Contact.
- Blog, careers listing/detail, legal pages, and announcement bar are not built.
- Content is hardcoded; no CMS models or application endpoints exist.
- app/layout.tsx wraps pages in Navbar/Footer; admin needs layout isolation.
- env.ts requires DATABASE_URL and NEXT_PUBLIC_API_URL; this does not establish
  an implemented backend. Review requirements during foundation work.
- package.json has dev/build/start/lint scripts, but no test script/framework.
- Contact and newsletter forms lack backend integrations; outside this scope.
- Footer/contact emails differ; social links are '#'. Verify before seeding.
- Unrelated missing destinations include /pagex, /get-started, /demo, /solution,
  and volunteer/partnership/signup routes. Do not silently expand scope.
- A previous inspection returned Node v22.13.0. Recheck the runtime and current
  Payload requirements rather than assuming compatibility.

## Planning-stage validation (historical)

- Documentation-only work: inspected AGENTS.md, package.json, env.ts, and git status.
- CMS code, dependencies, migrations, forms, and routes have not been implemented.
- No application tests/build were run for these documentation-only changes.
- See final documentation verification entry below for actual file checks.

## Pending inputs and launch dependencies

- Administrator's full code list; does not block dynamic dictionary implementation.
- Verified contacts, working hours, social URLs, initial posts and vacancies.
- Approved privacy/terms/recruitment copy and applicant retention duration.
- Production database, public/private storage, transactional email,
  private recruitment recipients, and deployment configuration.
- Production first-admin credentials through server secrets; local admin is configured. Never commit credentials.

## Next concrete action

T05: implement blog posts/categories and public listing/detail routes, preserving
the review rules, public media boundaries and existing visual design.
Startup now ensures a first administrator exists from server environment secrets;
existing administrators are preserved. Use supported
Node (24.22.2 is pinned); this machine's system Node remains 22.13.0. A portable
24.22.2 runtime in Temp was used for all final verification.

## Future work log

Append dated entries with task ID, implementation summary, changed files,
commands/results, unresolved blockers, and next action. Never log secrets or
applicant personal data. A plan or partial implementation is not a completed task.

### 2026-11-07 - T01 baseline; T02/T03 implementation in progress

- Working tree initially clean. Read installed Next route-group, layout,
  environment-variable and route-handler guides before implementation, and
  rechecked relevant guides after upgrading Next.
- Baseline: Node 22.13.0, pnpm 10.18.1, Docker 27.4.0, Compose 2.31.0.
  Lint passed with four pre-existing unused-import warnings; tsc passed.
  Build first failed fetching Google fonts under the sandbox, then passed with
  network access. No baseline application failures were found.
- Payload 3.93.0 package requires Node ^22.23.4 or >=24.22.1 and its actual
  published Next peer requires 16.3.3+ on Next 16 (stricter than website docs).
  Selected Next 16.3.3, Payload packages 3.93.0, GraphQL 16.11.0, Node 24.22.2.
  Downloaded a portable Node runtime to Temp for validation, without modifying
  the user's system Node installation. Updated repository runtime/CI requirements.
- User confirmed Docker PostgreSQL in development, production DB selected by
  environment. Implemented APP_ENV and separate DEV/PRODUCTION/TEST database URLs;
  production refuses missing/local DB URLs and has no development fallback.
- Added compose.yaml (Postgres 17.7 and Mailpit with named volumes), configured
  untracked local development secrets without logging them, and started healthy
  services. Created a separate disposable pazelgreen_test database.
- Added isolated frontend/Payload root layouts, CMS config, generated types/import
  map, explicit SQL migrations (schema push disabled), persistent filesystem upload
  directories outside public/, CLI bootstrap, users/invitations, audit records,
  reusable review hooks, protected previews and private file access.
- Both schema and last-admin guard migrations applied to development and test DBs.
  Environment tests: 11 passed. Initial integration run: 9 passed, 6 failed;
  correcting test expectations/fixtures and investigating publication state.
  Updated production build and TypeScript passed before final test refinements.
- Production DB/SMTP/storage providers and initial administrator identity are not
  supplied. Local Mailpit and persistent disk interface avoid choosing providers.
  No real admin account or production resources have been created.
- Next: finish meaningful integration and HTTP checks, review security boundaries,
  then mark T02/T03 complete only once verification passes.

### 2026-11-07 - Documentation verification

- Verified both planning files are readable and all T01-T12 tasks are present.
- Verified AGENTS.md contains exactly one handoff section and links to both files.
- Reviewed the AGENTS.md diff and ran git whitespace checks on tracked changes
  and both new Markdown files; no whitespace errors were reported.
- Git reports only AGENTS.md modified and .planning/ newly added.
- Application checks remain unrun because no application code changed.
- Next: T01 baseline/runtime checks, then T02 foundation and T03 access control.

### 2026-11-07 - T02/T03 completed and verified

Implementation:

- compose.yaml, env.ts, .env.example and scripts/database.ts provide environment
  selection and local Postgres/Mailpit with named volumes. Development uses port
  5433 on localhost. Production requires its own URL, HTTPS origin, SMTP and
  persistent storage paths, with no fallback to development. Test DB is separate.
- Public routes/components moved together to app/(frontend); URLs/designs retained.
  app/(payload) contains isolated admin/API routes, activation/setup pages and
  prefixed Tailwind utilities without resetting Payload's admin CSS.
- payload.config.ts, payload-types.ts, generated admin/importMap.js and migrations/
  provide the pinned Payload/Postgres foundation. Schema push is disabled; initial
  schema and a concurrent last-admin trigger were migrated to development/test DBs.
- cms/ contains role/access rules, users, invitations, immutable audit snapshots,
  review/version hooks, transactional locks, public media/private files and
  authenticated JSON draft previews. Invitation tokens are hashed, expiring and
  consumed atomically with account creation. Existing sessions are invalidated by
  deactivation/role changes. Anonymous/private/draft access is denied server-side.
- Staff drafts preserve live content, edits invalidate pending review, admin
  publication requires an unchanged submitted draft, and admins can unpublish
  without deleting history. Editorial notes/attribution are private. Media bytes
  cannot be replaced behind an already approved URL. Files live outside public/.
- scripts/bootstrap-admin.ts controls the first admin; HTTP first-user registration
  is blocked. Concurrency tests initially found the successful CLI retained
  background resources after database cleanup. Disabled optional telemetry and
  added explicit successful CLI exit after cleanup/output flush. Concurrent CLI
  processes now prove one success and one explicit existing-user refusal.
- package/lockfile/runtime/CI configuration updated. Added vitest config and unit,
  integration and real production HTTP checks. Removed four existing unused-import
  warnings. Documented setup/production/storage/invitations/workflow and custom API
  contracts in docs/cms-setup.md and docs/cms-api.yaml; README and plans updated.

Final validation (actual results):

- pnpm test: 14 environment tests passed.
- pnpm test:integration: 19 passed against real local PostgreSQL and Mailpit,
  including concurrent CLI bootstrap, final-admin changes, invitation redemption,
  role escalation, expiry, malformed requests, draft/publication/version privacy,
  private downloads and preserved historical attribution.
- pnpm test:http: passed against a temporary production server using only the
  disposable test DB. Verified public/admin routes, denied public registration,
  staff/admin REST permissions, approved vs draft data, protected previews/files,
  and revocation of an already-issued staff session. Server stopped afterward.
- pnpm typecheck passed. pnpm lint passed with zero errors/warnings. Final pnpm
  build passed after all application changes, including isolated Tailwind styles.
- Payload types/import map generation succeeded. Both SQL migrations applied.
  Frozen-lockfile offline install succeeded. Docker reports both services healthy.
- Git whitespace check passed. CI now provisions Postgres/Mailpit and runs the
  checks, but no remote GitHub Actions run/deployment was triggered in this session.

Operational handoff and remaining scope:

- No real administrator, production DB, production SMTP account or cloud storage
  was created. Initial admin identity/password must be supplied securely for CLI
  bootstrap, never in planning files or logs. Local development secrets are in .env.
- Production storage currently requires persistent mounted filesystem directories;
  ephemeral hosting needs a storage adapter before deployment. Provider selection
  and real production configuration remain launch dependencies, not silently chosen.
- Preview currently covers media as authenticated JSON; frontend blog/job previews
  follow their future routes. Private PDF/DOCX storage is foundation only; candidate
  applications, deeper CV validation and retention remain T07.
- T04–T12 are unchecked. Next: company settings and existing-page SEO (T04).

### 2026-11-07 - Team documentation for the T01–T03 foundation

- Added docs/payload-handbook.md as the first-time Payload/team handbook. It
  explains the architecture, terminology, current vs planned features, why each
  local setup action exists, credentials, roles, editing/review, environment
  selection, migrations/APIs, production provisioning/releases, persistent
  storage, backups/recovery, team responsibilities and troubleshooting.
- Reorganized README.md as the project entry point with a documentation map,
  accurate feature status, local quick start, common commands, architecture and
  contribution guidance. Reworked docs/cms-setup.md as the shorter command
  reference, linking to the handbook for explanations instead of duplicating them.
- Cross-checked instructions against package.json, env.ts, .env.example,
  compose.yaml, CMS configs/hooks, bootstrap/database scripts, tests and CI.
  Verified official Payload guidance, including version-matched v3 Local API
  access defaults, plus SMTP and Postgres initialization references.
- Documentation validation: local file/heading links and code-fence balance
  checked; 85 pnpm command references matched package.json; all 20 .env.example
  variable names are explained; whitespace checks passed for tracked/new docs.
- No application code/configuration changed. Application tests/build were not
  rerun for this documentation-only update; prior implementation results above
  remain historical evidence. No production actions or account setup performed.
- No CMS scope/status change: T01–T03 remain complete, T04–T12 pending. Next
  implementation remains company settings and existing-page SEO (T04).

### 2026-11-14 - Startup simplification decision (T02/T03 follow-up)

User approved automatic first-admin creation on application startup using environment
credentials, with mandatory initial password setup. Existing admins are preserved;
there is no new super-admin role. Keep separate development/production/test URLs,
and derive local Docker settings from DEV_DATABASE_URL instead of duplicate POSTGRES
variables. Blog, careers and other CMS features remain subsequent work (T04–T12).

### 2026-11-14 - T02/T03 startup follow-up completed and verified

Implementation:

- cms/bootstrap.ts and scripts/bootstrap-admin.ts implement an idempotent,
  transaction-locked first-admin check. package.json runs it automatically in
  predev after Docker/migrations and in prestart before serving production.
  Existing admins (including inactive ones) are preserved without requiring
  bootstrap secrets; existing staff are never promoted on an email collision.
- cms/users.ts, cms/access.ts, cms/password.ts, the admin catch-all page and
  admin/change-initial-password route enforce initial password setup before CMS
  access. Reusing the initial password is rejected; the email can be changed too.
  Password setup revokes every session within the update transaction. The HTTP
  test caught Payload preserving the caller's session after beforeChange; the
  final implementation clears it in afterChange and verifies revocation.
- Added the append-only 20261114_120000_initial_password migration and matching
  schema snapshot; regenerated payload-types.ts. Existing accounts default to
  no forced password change. Applied migration to development and test DBs.
- scripts/database-config.ts derives local Compose settings from DEV_DATABASE_URL;
  scripts/database.ts passes them directly to Docker. Removed duplicate POSTGRES
  entries from .env.example and the existing untracked local .env, preserving
  connection URLs and all other secrets. Added db:status, db:exec and db:logs
  helpers so operational commands receive those derived settings too.
- Moved tsx into runtime dependencies for startup checks; refreshed pnpm-lock.yaml.
  Updated README.md, docs/cms-setup.md, docs/payload-handbook.md and task.md.

Actual validation (Node 24.22.2 portable runtime, pnpm 10.18.1):

- pnpm test: 22 passed, covering environment selection and URL-to-Docker parsing.
- pnpm test:integration: 20 passed with real PostgreSQL/Mailpit. Expanded checks
  cover concurrent first-admin creation, missing/invalid bootstrap secrets, staff
  email collision, preserved credentials on restart, mandatory password setup,
  blocked content access, rejected flag bypass, password reuse and revoked sessions.
- pnpm typecheck and pnpm lint passed with no errors or warnings.
- Final pnpm build passed. Initial sandbox build could not fetch Google Fonts;
  rebuilding with approved network access succeeded.
- Final pnpm test:http passed against a temporary production server and the
  disposable test database, including the initial-password route, cookie redirect,
  password/email changes, denied private access and revoked initial JWT session.
  The server stopped afterward. Test requests include browser-equivalent origin
  headers as required by Payload cookie CSRF validation.
- pnpm predev and pnpm prestart both passed against the local development DB and
  reported that the existing administrator was preserved. Docker services healthy.
- Offline lockfile refresh passed. Documentation links (36 local targets) and
  fenced-code balance passed. Git whitespace check passed.

No production actions, real account creation or CMS content features were added.
Production migrations remain a controlled release step before pnpm start; direct
next start bypasses the documented bootstrap lifecycle. No blockers remain for
this follow-up. T04–T12 remain pending; next planned work is T04 company settings
and existing-page SEO, followed by blog, careers and the other agreed CMS features.

### 2026-11-14 - T04 company settings and existing-page SEO completed

Scope and implementation:

- Committed the preceding startup follow-up separately as f573e32 (feat: automate
  first admin setup and simplify database configuration). Interpreted the user's
  next pending task as T04, the next unchecked plan item; broader CMS tasks remain
  in their agreed sequence. No launch data or unrelated feature scope was invented.
- Added cms/company-settings.ts and cms/page-seo.ts globals, registered in
  payload.config.ts. Company fields cover primary and department contacts, ordered
  social URLs, weekday opening/closing/closed entries and an IANA timezone. SEO is
  constrained to Home/About/Solutions/Join Us/Contact; homepage content is excluded.
- cms/global-review.ts shares review transitions and audit fields with collections
  via cms/workflow.ts. Updates serialize on a global-specific transaction lock.
  Staff draft/submit; admins publish unchanged submitted drafts, return with notes
  or unpublish. Anonymous draft/history access and version restoration are denied.
  Last approved values stay public while replacements are edited. Tests found and
  fixed the shared workflow's inability to edit returned drafts: editing now resets
  changes-requested to draft without allowing staff to issue reviewer decisions.
- lib/company-settings.ts and lib/page-seo.ts read only approved data with explicit
  access control, at request time and memoized only per request. Footer and Contact
  share contacts/socials/hours. Every existing page emits approved title/description
  through generateMetadata, with existing defaults for empty/unpublished SEO.
  No persistent page/data cache can retain old settings after approval.
- Updated components/Footer.tsx, the route-local ContactForm, lib/social-links.ts
  and five existing route pages without changing their overall design. Blank
  optional published values are omitted. No contact delivery/newsletter work added.
- Generated migration 20261114_174542_company_settings_and_page_seo with schema
  snapshot/index and regenerated payload-types.ts. Corrected generated type imports
  for Node 24 runtime compatibility before applying/testing the migration.
- Updated README, setup reference and team handbook with editorial usage, field
  validation, review, fallback behavior and the live database requirement.

Content and remaining work:

- No verified company dataset was supplied. The old footer primary contact is the
  shared initial display fallback (the prior Contact general email differed).
  Existing social placeholders are retained only as legacy display fallbacks;
  CMS publication rejects placeholder/non-HTTP(S) social URLs. No real company
  global was seeded/published. Owner-approved contact details, hours, URLs and
  initial publication remain explicitly in T12. Missing values were not invented.
- T05 blog is next. T06 careers, T07 applications and T08–T12 remain pending.

Actual validation (portable Node 24.22.2, pnpm 10.18.1):

- pnpm test: 22 passed.
- pnpm test:integration: 27 passed against disposable local PostgreSQL/Mailpit.
  Added global privacy/permission checks, first draft vs publication, preserved live
  data, returned-draft edits, approval invalidation, reviewer notes, version denial,
  invalid URL/timezone/hours publication, concurrent edit/publication and unpublish.
- pnpm typecheck and pnpm lint passed with zero errors/warnings.
- pnpm build passed with approved font-download access; public marketing routes
  correctly render at request time, so builds do not publish draft data.
- pnpm test:http passed against the production build and disposable test database.
  Verified real rendered Footer/Contact details, hours, socials, approved titles/
  descriptions, absence of private drafts, anonymous global history/draft denial,
  staff publish denial and approved updates on warmed pages without a rebuild.
  Existing auth/invitations/media/private-download/session checks also passed.
  The temporary test server stopped afterward.
- pnpm predev passed locally: Docker healthy, globals migration applied and the
  existing administrator preserved. pnpm cms:importmap reported no new imports.
- Documentation file links (37 local targets) and code-fence balance passed.
  Normalized edited CRLF files before the final Git whitespace check.
- No production deployment or real content publication performed. The next action
  is T05 blog implementation. Ready for the separate T04 commit.
