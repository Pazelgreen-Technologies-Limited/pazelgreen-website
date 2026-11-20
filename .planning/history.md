# Archived CMS implementation history

These are historical notes through T10, preserved on 2026-11-15. Statements such
as "next", "pending", "in progress" and "ready for commit" describe their original
point in time. They are not current instructions.

Read [the current handoff](progress.md) for status, verified commits and the next
action, and [the task plan](task.md) for scope and acceptance criteria.

## Earlier progress record

# CMS implementation progress

Last updated: 2026-11-15.
Current phase: T01–T10 complete and verified. T11 is next; T11–T12 remain pending.

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

T11 is next: audit public cache behavior, add/verify sitemap and indexing rules,
complete broader integration/E2E acceptance, backup/migration recovery guidance,
editor onboarding and operations. Exclude FAQs, private applications/CVs,
unapproved content and authenticated previews from public indexing. T07–T10 are
finished in separate commits; the user has not requested implementation of T11 yet.
T12 still needs real codes/content/contacts, company-approved legal/retention copy,
production providers/persistent storage, delivery scheduler and recipient setup.
No company policy or launch approval should be invented.
Startup now ensures a first administrator exists from server environment secrets;
existing administrators are preserved. Use supported
Node (24.22.2 is pinned); this machine's system Node remains 22.13.0. A portable
24.22.2 runtime in Temp was used for all final verification.

## Future work log

Append dated entries with task ID, implementation summary, changed files,
commands/results, unresolved blockers, and next action. Never log secrets or
applicant personal data. A plan or partial implementation is not a completed task.

### 2026-11-14 - Startup runtime follow-up after T06

- Reproduced the user's predev exit 13 on system Node 22.13.0: Docker and
  migrations succeeded, then bootstrap's dynamic Payload configuration import
  reported an unsettled top-level await. Standalone bootstrap also sometimes
  succeeded, so an isolated retry is not evidence of a reliable supported setup.
- Node 22.13.0 is below the declared Payload/project engine minimum. Added
  .npmrc engine-strict=true so pnpm refuses incompatible runtimes before startup
  database actions. Documented runtime selection in README and cms-setup.md.
- Verified pnpm dev under system Node 22.13.0 now fails immediately with
  ERR_PNPM_UNSUPPORTED_ENGINE, before predev or database actions. With portable
  Node 24.22.2 selected in PATH, pnpm predev passed (services healthy, migrations
  complete, existing admin preserved), then Next dev reached Ready on temporary
  port 3100. The temporary server was stopped; an attempted HTTP login request
  was interrupted during first compilation and is not claimed as an HTTP pass.
- Documented the exit-13 symptom in the handbook. No application/bootstrap logic
  or credentials changed. The user's normal terminal still needs to select a
  supported Node runtime; the Temp download is a session workaround, not a
  permanent installation or a project dependency.
- This is a T02/T03 startup follow-up. T01–T06 remain complete; T07 is next.

### 2026-11-14 - T06 implementation in progress

- Added reviewed admin-managed dictionaries and jobs, immutable reference fields,
  transactional annual counter allocation, careers routes/previews, listing SEO,
  and dynamic Join Us openings. Migration includes agreed D/C/I employment types
  only; department/position examples are not seeded as company data.
- Added unit and integration checks for code validation, Lagos year boundaries,
  concurrent numbering, retries, rollback, reference immutability and job states.
- Unit checks passed (56); final integration, HTTP/browser, migration round trip,
  lint, TypeScript and build validation remain pending. T06 is not complete yet.
- Application collection/forms/submission and eligibility rechecks remain T07.
- Production build and fresh migration/down/up checks passed. Integration caught
  that private audit publication timestamps cannot be anonymous sort keys; public
  careers ordering now uses immutable reference year/sequence and ID instead.
- Expanded tests to cover actual Lagos year rollover and 12-item pagination.
  Explicit draft-create flags are confined to creation; permission tests must
  request actual publication rather than silently saving a draft. Final reruns
  and HTTP/browser checks are in progress.

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

### 2026-11-14 - T05 blog implementation; final verification in progress

- User continued to the next task after T04 commit 8caa57a. T05 only: posts,
  categories, public media relationships, article/listing routes and previews.
  Careers/applications and later tasks remain outside this implementation.
- Added cms/blog.ts and cms/blog-content.ts with review-enabled posts/categories,
  generated slugs, public author attribution, excerpts, publication display dates,
  cover/inline media, a restricted Lexical editor and per-post SEO. Publication
  requires nonempty safe content and previously published categories/images.
  Referenced IDs are resolved through Payload rather than trusting node URLs.
- Added lib/blog.ts and lib/blog-query.ts plus route-local components under
  app/(frontend)/blog. Listing supports six posts/page, stable newest-first order,
  approved-category filters, empty states and not-found behavior. Articles use
  approved content and SEO at request time; editor cookies/preview query flags
  cannot switch the normal public URL to a draft. Added a fixed Blog listing
  group to Page SEO without competing with article-owned SEO.
- Added session-protected /blog/preview/[id] and expanded authenticated JSON
  previews to posts/categories. Visual previews send noindex, private/no-store and
  no-referrer headers. Public uploads stay behind media access checks and bypass
  the separate Next image optimizer cache. Navbar highlights Blog on nested URLs.
- Design follows existing green/white palette and Nunito/Inter typography. New
  listing uses image/text rows; articles use a narrow reading measure. Reviewed
  desktop listing and mobile article screenshots from real Chrome test runs.
- Generated 20261114_191532_blog_posts_and_categories migration/snapshot and types;
  updated admin import map. Reviewed generated SQL and fixed type-only imports
  and whitespace before applying the test migration. Existing data is preserved.
- Added Playwright 1.65.1, browser config, desktop/mobile tests and a CI browser
  step. Browser/HTTP suites use only the verified disposable local test database,
  separate temporary servers and fixture content. No real posts were seeded.
- Updated README, setup/handbook, blog editing guide and preview API enum. Guides
  explain publication dates are display metadata rather than scheduling controls,
  author privacy, media/category approval, preview authentication, URL changes and
  sequential test execution. Production content/rights approval remains T12.

Verification so far:

- Unit tests: 46 passed; initial complete integration run: 34 passed. Initial
  production build passed with approved network access for fonts. Ten desktop/
  mobile Chrome checks passed, with screenshots captured under ignored test-results.
- One integration invocation overlapped pnpm dependency relinking and could not
  import a package; rerunning after installation succeeded. Draft fixtures were
  corrected to satisfy Payload's generated strict draft types.
- HTTP checks reached the protected-preview assertions; corrected a test that
  followed an anonymous preview redirect then inspected the login page's headers.
  The final rerun uses the original preview response.
- Final verification is running sequentially after the last reference-query and
  responsive wrapping refinements. Do not mark T05 complete until it finishes.
- Next: finish checks, apply development migration, record final results and commit
  T05 separately. T06 jobs/dictionaries/careers follows only after T05 completion.

### 2026-11-14 - T05 final validation and handoff

- Final pnpm lint and pnpm typecheck passed without errors/warnings.
- pnpm test: 46 passed. pnpm test:integration: 34 passed against the verified
  disposable PostgreSQL/Mailpit database, including publication, dependency
  approval, slugs, live vs draft content/SEO, pagination/filtering and unpublishing.
- Final pnpm build passed with font-download access. Blog routes are dynamic and
  use request-time published reads. Final pnpm test:http passed, including article
  HTML/metadata, category/page boundaries, unpublished not-found behavior, signed-in
  public reads, preview authentication/noindex/no-store headers and JSON previews.
- Final pnpm test:browser passed all 10 checks in installed headless Google Chrome
  across desktop (1280x900) and mobile (390x844). Checked images load, no horizontal
  overflow, keyboard activation, filtering/pagination, empty categories, public
  article metadata and real-session draft previews. Screenshots reviewed locally.
  Browser and HTTP temporary servers stopped; outputs remain ignored in test-results.
- Reviewed migration rollback SQL and guarded generated foreign-key drops that
  could follow CASCADE table removal. The applied UP SQL was unchanged. Added
  tests/migrations/roundtrip.ts and pnpm test:migrations; its final fresh/up/down/up
  check passed in a uniquely created scratch DB. The runner isolates Payload in a
  child process because the adapter's destroy does not close its pool. Cleanup
  finishes after worker exit; verified no scratch migration databases remain.
- pnpm predev passed against local development: Docker services healthy, blog
  migration applied, existing admin preserved. Generated types and import map are
  included. Frozen-lockfile offline installation passed using the existing store.
- Updated CI to install Chromium, run desktop/mobile flows and verify the latest
  migration rollback/reapply. No remote Actions run, push or deployment was invoked.
- Documentation file links (42 local targets) and fenced-code balance passed.
  Updated the editor guide, setup/handbook, README, API preview enum and plan.
- T05 is complete. No real post/category records or external resources were
  created. Initial content and image rights/attribution remain T12 launch inputs.
  Next task: T06 dictionaries, jobs, annual references and careers routes.

### 2026-11-14 - T06 final validation and handoff

- Added cms/careers.ts and cms/career-rules.ts; registered employment types,
  departments, position codes, reviewed jobs and a hidden counter collection.
  Admins alone manage dictionaries. Codes are normalized, unique and delimiter
  safe; retire entries instead of deleting them. Staff draft jobs, admins approve.
- First approval allocates a company-wide sequence with a transactional UPSERT
  and unique reference/year-sequence constraints. Africa/Lagos determines the
  year. Snapshots and defining relationships are locked after issue; retries,
  dictionary edits, closure/reopening and year rollover preserve references.
  Issued adverts cannot be deleted; PostgreSQL guards reference changes/deletion.
- Added lib/careers.ts, request-time paginated careers listing/detail pages and
  authenticated noindex visual previews under app/(frontend)/join-us/careers/.
  Join Us reads up to four real open roles. Public sort uses immutable year and
  sequence, then ID. Draft closures preserve the live advert; expiry takes effect
  at the exact deadline without another publish or rebuild. Closed detail URLs
  remain informative; unpublished details are not found.
- Added careers listing SEO to Page SEO and job-specific SEO on jobs. Extended
  JSON previews and no-store/noindex/no-referrer headers to careers. Draft views
  tolerate incomplete text and invalid deadline/timezone values.
- Migration 20261114_201626_careers includes schema, snapshot and issued-reference
  guard. Seeded only the explicitly agreed Direct=D, Contract=C, Internship=I
  employment types with published versions; no real vacancies or department/
  position examples. Generated Payload types are included; import map unchanged.
- Final pnpm lint and pnpm typecheck passed with no lint errors/warnings.
  pnpm test passed 56 unit tests. pnpm test:integration passed all 46 tests,
  including concurrent cross-department publication, same-advert retries, failed
  allocation rollback, actual Lagos year rollover, padding past 99, database-level
  immutability, retirement/reopening, pagination and published vs draft states.
- pnpm test:migrations passed fresh migrations/latest-down/latest-up in its own
  scratch database, verifying D/C/I seeds and careers table removal/recreation.
  Down SQL guards FK drops after CASCADE; scratch cleanup completed.
- Final pnpm build passed. pnpm test:http passed production HTML/SEO/access,
  previews, warmed-page closure/reopening, empty listings and real deadline
  passage without republishing. It restores the approved job/private draft fixture.
- pnpm test:browser passed all 16 checks in installed headless Google Chrome on
  desktop 1280x900 and mobile 390x844. Reviewed careers detail screenshots; no
  horizontal overflow. Verified Join Us links, approved metadata, closed/expired
  details, private URLs and session-protected previews alongside blog regressions.
  Next logged two stream-close messages during browser navigation; all assertions
  passed. Temporary HTTP/browser servers stopped; screenshots are ignored.
- pnpm predev passed locally: Docker healthy, careers migration applied, existing
  admin preserved. Only D/C/I dictionary entries were initialized; no real job
  content or external resources were created. No remote CI/push/deployment run.
- Added docs/careers-editing.md and updated README, setup, handbook, API contract
  and planning. Guide covers deadline entry/display, permanent IDs, retirement,
  test safety and consistent counter/adverts backup requirements.
- T06 is complete. T07 is next: applications, per-advert applicant references,
  private CVs, recruitment operations and retry-safe email delivery. Open role
  pages currently explain the forthcoming form; no submission endpoint exists.
  Full company codes, real vacancies, recruitment privacy/retention approval and
  production providers remain T12 launch dependencies.

### 2026-11-14 - Persistent Git Bash runtime setup

- User requested fixing the remaining unsupported-engine error. Installed the
  already downloaded Node 24.22.2 under the user's LocalAppData Programs directory
  (pazelgreen-node/node-v24.22.2-win-x64), outside Temp. No system Node installation
  was removed or overwritten.
- Added a managed PATH block to the user's .bashrc and .bash_profile, preserving
  existing content and creating timestamped .pazelgreen-node-*.bak copies before
  modification. These are local machine files, not repository dependencies.
- A fresh Git Bash login selected the permanent user runtime, reported Node
  v24.22.2 and pnpm 10.18.1. Ran actual pnpm dev through that shell on temporary
  port 3100: Docker healthy, migrations complete, existing admin preserved, Next
  reached Ready. Stopped the verification server with Ctrl+C. No HTTP response
  test or application regression suite was needed/claimed for this setup change.
- Existing open shells must reload .bashrc and clear Bash's command cache, or be
  reopened. Added this instruction to docs/cms-setup.md. Other shell types still
  need their own supported-runtime selection; the setup targets the user's Git
  Bash workflow. Restored only Next's automatic AGENTS.md edits after verification.
- No application code or credentials changed. T01–T06 remain complete; next CMS
  task is T07 as described in Next concrete action above.

### 2026-11-15 - T07 implementation and verification underway

- Added private Applications/Hiring History, reviewed Recruitment Settings and
  admin-only private delivery recipients. Notice/version/retention approval gates
  forms; no company policy, recipients or real candidates were seeded.
- Added same-origin bounded multipart submission, byte-validated private PDF/DOCX
  uploads, per-advert atomic counters, transaction-scoped retry keys, immutable
  applicant identity, duplicate flags and shared database abuse buckets. Public
  role eligibility is rechecked under the publication lock. Success returns only
  the reference; candidate information is excluded from application logs.
- Added route-local accessible application form, durable email queue/delivery CLI,
  exponential retries and private status/notes/assignment history. SMTP is at least
  once across crashes; production scheduler/recipients remain setup requirements.
- Migration 20261115_085557 adds schema/counters/identity trigger. Generated types,
  recruitment operator guide, integration/unit/browser/HTTP checks are included.
- Initial regression checks: existing 46 integration tests passed. Corrected an
  invalid PDF fixture (Payload performs deeper parsing), a populated-CV test ID,
  and due-time test setup for slight host/container clock differences. Production
  build and TypeScript passed. Final integration/migration/browser checks pending;
  T07 is not marked complete yet. T08 FAQ module prepared but not registered.
- Next: finish T07 verification, document results and commit; then T08–T10 in order.

### 2026-11-15 - T07 verified and complete

- Final integration: 52 passed; unit: 58 passed; lint and TypeScript passed.
  Fresh-schema/latest-down/latest-up migration verification passed in a new
  scratch database with cleanup. Production build passed after the origin fix.
- Real Chrome desktop/mobile: all 20 checks passed, including deliberately lost
  response recovery returning the same application reference, anonymous private
  record denial and cross-origin rejection. Reviewed mobile success screenshot;
  reference wraps without horizontal overflow. Existing blog/careers checks pass.
  Next emitted one stream-close message during navigation; assertions passed.
- HTTP smoke suite passed production public/admin/access/preview/CV checks.
  Browser testing caught request.url using an internal Next host: now compare
  Origin with configured SERVER_URL. Slight host/container clock skew required
  explicitly due queue fixtures; operational retries already run on a scheduler.
- Final small refinements permit omitted optional API fields and PDF 2.0 headers;
  unit tests passed afterward. The next stage reruns the integration regression.
- Updated README, setup, handbook, careers guide, recruitment runbook and API
  contract (also corrected pre-existing malformed preview YAML). No real candidate
  records, policies or notifications were created. Tests use local disposable DB
  and Mailpit; development migration will be applied after the T07–T10 batch.
- SMTP delivery is explicitly at least once; a production scheduler, ingress abuse
  controls, approved policy/retention procedure and recipients remain T12 inputs.
  T07 complete. T08 FAQ module is prepared but not yet registered/committed.

### 2026-11-15 - T08 FAQ verification

- Registered cms/faqs.ts: restricted rich-text answers, optional grouping/order,
  shared staff-draft/admin-approval, and staff-only reads even when published.
  No public page, preview, search or sitemap integration was added.
- Generated migration 20261115_092113_faqs and types; admin import map unchanged.
  Guarded rollback FK removal after CASCADE. Normalized generated SQL whitespace,
  including the preceding recruitment migration; no SQL behavior changed there.
- Integration: 54 passed, including anonymous list/detail/history denial, staff
  publication/deletion denial, preserved approved answer during edits and rejected
  embedded uploads. Recruitment regression passed. Lint/TypeScript and latest
  migration fresh/down/up passed. Build/real HTTP denial checks in progress.
- Added docs/faqs-editing.md and updated README/handbook. T09 announcement model
  and pure selection helper are prepared separately, not registered yet.
- Final production build and HTTP smoke checks passed, including anonymous FAQ
  list/document/version requests returning 403. T08 is complete; no real FAQ
  content was seeded. Next: register/implement T09 announcements and navigation.

### 2026-11-15 - T09 implementation and verification

- Added reviewed Announcements, deterministic priority/publication/ID selection,
  request-time sanitized active endpoint and public-layout integration. Internal
  titles/audit details are excluded. Safe links and end-after-start are enforced;
  a client admin field shows the actual browser scheduling timezone.
- Open pages refresh at schedule boundaries/once per minute/on tab visibility;
  expired notices hide locally on network failure. The fixed header measures bar
  height and gives public content matching space. Narrow viewports use a labelled,
  scrollable mobile menu with hidden inactive links and close-on-navigation.
- Migration 20261115_092830_announcements, types/import map, operator guide,
  README/handbook/API updates and unit/integration/browser/HTTP tests added.
- Unit: 62 passed; integration: 56 passed; migration fresh/down/up, lint and
  TypeScript passed. Draft validation skips field validators in Payload, so an
  explicit safe-link hook also rejects unsafe draft URLs. Build passed; final
  build/browser layout verification in progress after a landmark-label refinement.
- Real schedule passage already passed on both desktop/mobile. Corrected a test
  selector that ambiguously matched the main menu, category filters and pagination.
  T09 is not marked complete until the final browser/HTTP checks finish.
- Final production build passed. All 24 desktop/mobile Chrome checks passed,
  including actual activation/expiry on an open page, bar/navigation/heading
  geometry, no horizontal overflow and mobile menu accessibility/navigation.
  Reviewed the mobile navigation screenshot. Final HTTP checks passed active
  notice serialization/no-store and public HTML draft exclusion, plus regressions.
- An earlier HTTP attempt overlapped a rebuild and could not find a finished
  build; the final run was sequential after build completion and passed. Browser
  assertions initially used an ambiguous navigation selector; corrected by naming
  the main navigation landmark. No production deployment or real notices created.
- T09 complete. T10 model/guide are prepared separately but unregistered.

### 2026-11-15 - T10 implementation and verification underway

- Registered reviewed Legal Pages with fixed privacy-policy/terms-of-service
  identities, serialized creation even for drafts, permanent identity guards,
  restricted rich text, calendar-only effective dates and document-owned SEO.
  Legal deletion is denied; history remains available to active CMS staff.
- Added public /privacy-policy and /terms-of-service, unavailable/noindex states,
  authenticated /legal/preview/[id] and JSON previews. Footer destinations already
  existed and now resolve when a document is approved. No legal copy was seeded.
- Moved the blog's rich-text renderer to shared components/RichTextBody.tsx for
  use by distinct blog/legal pages; retained safe links and approved-image behavior.
  Added shared LegalDocument/LegalUnavailable views and request-time metadata.
- Generated migration 20261115_094339_legal_pages, snapshot and types. Added
  concurrent identity/review/date/body/SEO tests and legal HTTP/browser coverage.
  Additional T07 regression checks cover real DOCX, omission of optional fields,
  durable failure rollback/file cleanup and actual acknowledgement/staff delivery
  to local Mailpit. Test setup now rejects external SMTP explicitly.
- Added legal editor guide and synchronized README/setup/handbook/API docs.
  T10 verification is in progress; do not mark complete yet. After final checks,
  apply development migrations, record results/remaining T11–T12 work and commit.

### 2026-11-15 - T10 final verification and batch handoff

- Final lint and pnpm typecheck passed; unit tests: 63 passed; integration: 61
  passed. Included concurrent legal identity creation, staff publication denial,
  private drafts/history, preserved live body/date/SEO, immutable identities,
  invalid effective dates, restricted content and protected JSON previews.
- Recruitment regressions also passed: valid DOCX, ZIP traversal/macro/expansion
  rejection, missing optional API fields, actual durable failure rollback with
  private-byte cleanup, and successful candidate/staff sends through local Mailpit.
  The assignment picker follows existing directory privacy: staff can select
  themselves; admins can select active colleagues. No user read access was expanded.
- Latest migration fresh/down/up passed in a newly created scratch database;
  cleanup completed. The fresh migration chain includes all T07–T10 schemas and
  preserves the agreed D/C/I seeds. Reviewed generated SQL/type imports/whitespace.
- Production build passed. Final HTTP suite passed legal publication/unpublish,
  server-rendered SEO/fallbacks, draft privacy, preview headers/session protection,
  FAQ denial, active announcements, and actual PDF/DOCX download access/headers.
  An initial download check selected the newest file and assumed PDF; corrected it
  to select by MIME and added explicit DOCX download assertions. Reset fixtures
  before the final sequential integration/HTTP/browser run, which all passed.
- All 28 installed-Chrome browser checks passed at desktop 1280x900 and mobile
  390x844: legal footer links/content/metadata/canonical, private previews and
  unpublished terms, plus blog/careers/application/scheduled-notice regressions.
  Reviewed mobile policy screenshot: readable text, effective date and notice/nav
  spacing, no horizontal overflow. Next logged one stream-close event during
  navigation; no assertion failed. Temporary HTTP/browser servers stopped.
- Documentation verification passed 58 local targets and balanced Markdown fences;
  PyYAML parsed the custom API contract with four paths. Updated README, setup,
  handbook, careers/recruitment guides, legal guide, API contract and CI step label.
- pnpm predev passed against development: PostgreSQL/Mailpit healthy, all four
  new migrations applied, existing admin credentials unchanged. No synthetic
  content/policies or applicant records were inserted into development. No secrets
  were printed or changed. AGENTS.md is unchanged.
- T07 commit: 06c237e; T08: e7f9601; T09: e2c1cb1. This final T10 change is ready
  for its own commit. No push, remote CI run or production deployment performed.
- T01–T10 complete; next is T11 as described above. Launch remains gated on T12
  inputs. Applications are intentionally disabled until approved recruitment
  notice/version/retention settings are published. Configure private recipients
  and schedule pnpm cms:deliver every minute to operate recruitment delivery.

## Earlier task milestones and decisions

### 2026-11-14 - Startup simplification decision (T02/T03 follow-up)

User approved automatic first-admin creation on application startup using environment
credentials, with mandatory initial password setup. Existing admins are preserved;
there is no new super-admin role. Keep separate development/production/test URLs,
and derive local Docker settings from DEV_DATABASE_URL instead of duplicate POSTGRES
variables. Blog, careers and other CMS features remain subsequent work (T04–T12).

### 2026-11-14 - T04 completion and remaining work

Completed the next pending implementation task, T04, after the startup follow-up
commit. Company settings and fixed-route SEO are review-enabled globals. No
verified contact dataset was supplied: existing display fallbacks are retained,
and no company records were automatically seeded or published. T12 still requires
owner verification and initial approved content. T05 blog implementation is next;
T05–T12 have not been claimed complete.

### 2026-11-14 - T05 completed

Blog posts/categories, public listing/detail routes, pagination/category filters,
approved media relationships, article/listing SEO and authenticated visual/JSON
previews are implemented and verified. New posts still require admin approval.
No real content was seeded; initial articles/image rights remain T12 inputs.
T06 dictionaries, jobs and careers is the next implementation task.

### 2026-11-14 - T06 completed

Admin-managed reviewed dictionaries, jobs, atomic annual advert references,
careers listing/detail routes, protected previews, automatic expiry and dynamic
Join Us openings are implemented and verified. D/C/I employment types are seeded;
no real vacancy or example department/position codes were seeded. Application
forms/submission, per-advert applicant numbering and private CV workflow remain
T07. Open role pages explicitly explain that online applications are forthcoming.

### 2026-11-15 - T07–T10 completed

The user authorized T07–T10 with incremental commits and documentation. Private
applications/CVs, per-advert applicant IDs, hiring operations and durable email
delivery are implemented. Recruitment forms require an approved notice/version
and retention duration; private recipients and a delivery scheduler need setup.
SMTP delivery is at least once across crashes and never creates another applicant
record/reference. Existing user-directory privacy is preserved: staff can select
themselves in the assignment picker; admins can select active colleagues.

FAQs remain backend-only after approval. Reviewed announcements display one
eligible notice above responsive navigation, with request-time selection and
open-page schedule refreshes. Fixed privacy/terms documents have approved public
routes, private previews, version history and document-owned SEO. Effective legal
dates are calendar dates, not activation schedules. No real content/policies,
candidates or recipients were seeded. Company approvals remain launch inputs.

Final checks passed: lint, TypeScript, 63 unit tests, 61 integration tests,
production build, HTTP suite, 28 desktop/mobile browser checks and scratch
migration fresh/down/up. All four development migrations were applied through
predev; the existing admin was preserved. T11 is the next task; no T11/T12
completion, production deployment or remote CI result is implied.

### 2026-11-15 - Documentation audit before T11

Reworked README for human onboarding, corrected stale handbook/operations wording,
and moved superseded progress/task milestones into history.md. At that point T11
was next and T12 launch dependencies were pending. No app code, environment secrets,
database records or task completion status changed in the documentation-only audit.
Validation passed across 15 Markdown files and 103 local file/heading targets;
24 documented command names matched scripts/pnpm built-ins, API YAML parsed and
Git whitespace validation passed. Application regression suites were not rerun
for that documentation-only change. T11 work below supersedes its next action.

### 2026-11-15 - T11 completion and T12 answer sheet

User authorized completing T11 and creating a T12 checklist to answer next.
Repository baseline was 9ae0cef. Added request-time sitemap/robots with anonymous
approved routes; closed/expired job details remain readable with noindex/follow
and leave the sitemap. Added admin/API noindex headers, pathname/query/visibility/
bfcache refresh for shared content and deadline refresh for displayed jobs.
Corrected Careers/Solutions link typos. Recorded unbuilt marketing destinations
without adding excluded features. Created the operations/recovery/editor runbook
and 14-question T12 answer sheet with a separate production acceptance checklist.
No schema changes, development records, real content, secrets or applicant data
were introduced. Changes remain uncommitted for review.

Verified lint/typecheck, 63 unit tests, 61 integration tests, scratch database
fresh/latest-down/latest-up, production build and production HTTP privacy/SEO/file
checks. Expanded browser coverage from 28 to 36 desktop/mobile checks, including
all sitemap URLs (beyond the first post page), draft exclusion, publish/withdrawal,
browser history, approved Footer data across pathname/query navigation, closed-job
robots and automatic deadline expiry in listings/Join Us/details.

Initial sandboxed tsx/bootstrap commands failed on Windows user-profile access;
approved outside-sandbox reruns passed. First browser run finished 32/36 but stalled
in sandboxed process shutdown; stopped only the verified temporary port-3102 server
and used approved outside-sandbox runs thereafter. Corrected new tests to accept
Next's dynamic metadata max-age=0/must-revalidate header, await navigation completion
before browser back, and inspect sitemap loc URLs instead of rejecting the XML
declaration's question mark. Subsequent history/indexing tests passed.

The final full browser run passed 35 checks; a mobile announcement timing test was
interrupted by an approximately eight-hour host pause and timed out. Its targeted
rerun passed in 11.3 seconds (16.8-second run), verifying all 36 checks across the
final run and rerun. Next emitted stream-close messages during rapid navigation;
the final checked UI assertions passed. No remote CI, commit/push, production
deployment or actual production backup/restore rehearsal was performed. T12
remains pending answers and independently verified infrastructure.

Final documentation validation passed for 15 guide/planning Markdown files,
127 local file/heading targets, 141 documented command occurrences, balanced
fences and T01–T11 checked/T12 pending. Git whitespace validation passed.

### 2026-11-19 - T12 deferred; T11 commit authorized

The user requested skipping T12 for now and committing the completed T11 work
before further rearrangements. Updated task/progress/checklist status to preserve
that decision. No application code changed in this commit-preparation step;
the T11 test evidence above remains the prior verified result. T12 stays unchecked.

### 2026-11-19 - Post-commit documentation audit

The user requested checking all documentation before discussing a new change.
Reviewed current guides and handoff against T11 commit a87b7ca. Corrected README's
stale T11 next steps, recorded the actual completion commit in progress.md,
aligned handbook/setup guidance with T12 deferral, and expanded blog/careers
guidance for the delivered sitemap/browser/deadline behavior. Preserved historical
test evidence and distinguished documentation review from application verification.
No application code, deployment or T12 implementation was authorized or changed.

Validation passed for all 17 repository Markdown files, 130 local link targets,
142 documented command occurrences, balanced fences, five About image assets,
CLAUDE.md's instruction reference, parsed four-route API YAML, task statuses and
Git whitespace. Application regression suites were not rerun for these docs-only
changes. Next action is discussion of the user's proposed application change.


## 2026-11-19: T13 section permissions completed

User authorised per-section staff View/Modify rights across all records, without
per-author ownership. Implemented nine section controls on users/invitations,
admin-only changes, session revocation, UI hiding and server/API protections.
Existing staff/invitations default to No access. Supabase is selected, filesystem
uploads stay in use, and R2/T12 remain deferred. The new migration was applied to
verified local development/test databases; no production changes or commit/push.

Final validation: lint/TypeScript passed, 73 unit tests, 67 integration tests,
fresh/latest-down/latest-up migration round trip, webpack production build,
production HTTP smoke/privacy/ACL checks, and all 42 desktop/mobile browser checks
passed (2.9 minutes). Documentation links, four-route YAML and whitespace checked.

Implementation corrections: generated migration type imports needed explicit
`type` for Node's loader. Existing email retry fixtures using exact NOW() were
made clearly overdue to avoid host/database transaction timing failures. The
first Turbopack build reported Google-font query-resolution errors; a fresh-output
retry stalled and its verified build process tree was stopped. Retained output
initially entered TypeScript's source scan; it was moved into excluded
node_modules/.cache. Webpack exposed @next/env CommonJS interop: named imports
worked in webpack but failed native CLI loading; native createRequire supports
both and was verified by CLI bootstrap/integration and the production build.

Browser testing showed that collection access.admin is not navigation hiding;
admin.hidden now gates visibility/routes. Browser API requests include Origin for
cookie authentication. A Blog viewer without Media access initially hit a draft
relationship-read guard; nested reads now apply their public filter, with an
integration privacy assertion. The built-in denied admin route renders 404. A
preview image-count assertion was corrected from the public article's two images
to the saved replacement draft's single cover; its approved alt text and loaded
bytes are checked. Final browser run passed every test. Stream-close messages
occurred during rapid navigation without failing the assertions.

## Netlify handoff and commit preparation: 2026-11-19

The user requested documentation updates and a commit. Added a Netlify-specific
deployment guide and synchronized setup, operations, handbook, README and current
planning records. Recorded durable upload storage as the first blocker, production
environment/build setup, controlled Supabase migrations, explicit first-admin
bootstrap, separate recruitment scheduling and hosted acceptance requirements.
T12/R2 remain deferred. No production services were changed or deployment claimed.
Prior T13 test results remain dated evidence; this pass changes documentation only.

## T14 private S3 storage: 2026-11-20

User filled the S3 environment and authorised code integration. Implemented the
matching adapter, schema/type/import-map changes, server-controlled namespaces,
application rollback cleanup, isolated test environments, simulator/CI runner,
connection/privacy check and local-file copy operations. Read the installed Next
environment guide and Payload 3.93 adapter source before implementation.

Initial validation corrections: collection storage options omit
disablePayloadAccessControl to retain its default access checks (the option's
type only permits true). Added explicit types for async plugin hooks/test env
maps and a draft flag to the namespace test fixture. Generated migration imports
use type-only declarations and unused arguments were removed. Supabase bucket
names can include uppercase/underscores, so validation uses safe path-style names
rather than AWS-only DNS naming rules. CommonJS simulator imports have a narrow
lint exemption because Postman requires CommonJS. Its manifest requires version 1.

Live connection successfully wrote/read temporary synthetic objects, but the
Supabase public REST route returned HTTP 200: the configured bucket is public.
Removed every temporary check object and asked the user to make the bucket
private. No candidate content or production DB operations were performed.

The first copy acceptance run verified nine synthetic files but the CLI process
retained framework handles after destroy; stopped only the identified copy process,
added the explicit exit used by existing project CLI tools, and restarted acceptance.
The copy rerun preserves existing destination bytes and local/database records.
See progress.md for current final validation rather than treating intermediate
failures or pending statements here as the active handoff.

Final local evidence: lint/TypeScript, 88 unit tests, 68 local integration checks
(one S3-only case skipped), migration round trip and webpack build passed. The
expanded S3 runner passed 69 integration checks, real production HTTP permissions/
PDF/DOCX byte checks, nine-file copy/rerun and six desktop/mobile admin/preview
checks in Chrome. Simulator state/logs confirmed the expected object operations
and cleanup. The known public live bucket is still a user configuration dependency;
T14 stays unchecked until a subsequent live privacy check passes. No production
database, real content transfer, commit or push was performed.

The user subsequently chose to leave the bucket public for now, then explicitly
requested committing the implementation so they can push. Recorded the decision
in task/progress; local storage remains selected and live privacy acceptance stays
deferred. Committing the tested implementation does not certify Netlify deployment.
