# CMS implementation progress

Last updated: 2026-11-07.
Current phase: T01–T03 complete and verified; next planned implementation is T04.

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
- Initial admin identity through secure setup; never commit credentials.

## Next concrete action

T04: implement company settings and existing-page SEO without redesigning pages.
The owner can create the real first administrator with the documented CLI bootstrap
after setting credentials in an untracked local/server environment. Use supported
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
