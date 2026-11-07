# CMS implementation progress

Last updated: 2026-11-07.
Current phase: planning complete; CMS implementation not started.

## Start here

1. Read AGENTS.md and .planning/task.md.
2. Inspect git status and relevant files; preserve other contributors' work.
3. Start T01 and read relevant node_modules/next/dist/docs/ guides before code.
4. Update this record with implementation evidence and the next concrete action.

## Completed

- Reviewed all five existing public pages and shared content for CMS needs.
- Confirmed the narrowed scope with the user and documented it in task.md.
- Defined annual advert IDs, per-advert applicant IDs, dynamic dictionaries,
  admin/staff permissions, admin approval, and backend-only FAQs.
- Chose startup-friendly application fields, private CVs, hiring statuses,
  and one visible announcement selected from multiple saved records.
- Created task.md and progress.md and added handoff rules to AGENTS.md.

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
- Postgres is proposed; production provider choices remain unverified.

## Repository observations to recheck

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

## Validation so far

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

T01: inspect the working tree and local Next.js guides, verify runtime/Payload
compatibility, and record baseline lint/type/build results.
Then implement T02 foundation and T03 access/review before exposing content.

## Future work log

Append dated entries with task ID, implementation summary, changed files,
commands/results, unresolved blockers, and next action. Never log secrets or
applicant personal data. A plan or partial implementation is not a completed task.

### 2026-11-07 - Documentation verification

- Verified both planning files are readable and all T01-T12 tasks are present.
- Verified AGENTS.md contains exactly one handoff section and links to both files.
- Reviewed the AGENTS.md diff and ran git whitespace checks on tracked changes
  and both new Markdown files; no whitespace errors were reported.
- Git reports only AGENTS.md modified and .planning/ newly added.
- Application checks remain unrun because no application code changed.
- Next: T01 baseline/runtime checks, then T02 foundation and T03 access control.
