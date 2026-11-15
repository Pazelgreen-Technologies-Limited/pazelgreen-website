# Pazelgreen website

Pazelgreen's public website and content management application. Built with Next.js,
Payload CMS, PostgreSQL, TypeScript, and Tailwind CSS.

The public site introduces Pazelgreen's work on sustainable technology and reducing
food and agricultural waste across Africa. Payload provides the team's admin
interface and the backend for CMS features as they are added.

## New to the project?

Start with the [Payload team handbook](docs/payload-handbook.md). It explains how
the system fits together, why each setup step exists, how editors use the admin,
and what changes between local development and production.

| Document | Use it for |
| --- | --- |
| [Payload handbook](docs/payload-handbook.md) | First-time learning, team workflows, production responsibilities, backups and troubleshooting |
| [Setup command reference](docs/cms-setup.md) | Commands for local setup, first-admin creation, tests and releases |
| [Blog editor guide](docs/blog-editing.md) | Writing, previewing, reviewing and publishing blog articles |
| [Careers editor guide](docs/careers-editing.md) | Code dictionaries, job approval, permanent advert references and public states |
| [Recruitment operations](docs/recruitment.md) | Private applications/CVs, hiring history, privacy settings and email retries |
| [FAQ editor guide](docs/faqs-editing.md) | Internal questions/answers and private editorial approval |
| [Custom CMS API contract](docs/cms-api.yaml) | Invitation activation and authenticated draft-preview endpoints |
| [Implementation plan](.planning/task.md) | Agreed CMS scope, task order and acceptance criteria |
| [Progress record](.planning/progress.md) | Completed work, verification evidence and the next task |
| [Repository instructions](AGENTS.md) | Architecture and coding conventions |

## Current status

The public Home, About, Solutions, Join Us and Contact pages exist. The CMS
foundation (T01–T03) includes admin/staff accounts, invitations, media review,
version history, audit records, protected file storage and database migrations.

Company settings and existing-page SEO (T04) are available under Website in the
admin, with staff drafts and admin approval. Footer/Contact share published details.
The Blog group (T05) now provides posts/categories, authenticated draft previews,
public articles and a filtered/paginated blog listing. Careers (T06) provides code
dictionaries, reviewed jobs, permanent annual advert references, public careers
pages and dynamic Join Us openings. Recruitment (T07) adds private applications,
CVs, applicant references, hiring workflow and queued emails. FAQs (T08) provide
private reviewed questions/answers. Announcements and legal pages remain planned.
Most other public marketing content is hardcoded.
Contact-form delivery and newsletter integration are outside this CMS scope.
See the implementation plan before assuming a feature is available in `/admin`.
The next planned task is **T09: scheduled announcements**.

## Run locally

### Requirements

| Tool | Project version / role |
| --- | --- |
| Node.js | **24.22.2**, pinned in [`.node-version`](.node-version) |
| pnpm | **10.18.1**, pinned in [package.json](package.json) |
| Docker Desktop / Compose | Runs local PostgreSQL and Mailpit; Docker must be running |

Select/install the Node version before continuing; the version file does not
install it for you. Check `node --version`, `pnpm --version` and
`docker compose version` in your terminal.

pnpm enforces the Node engine requirement before running scripts. Node 22.13.0
is unsupported and can exit with an unsettled top-level await while loading
Payload during startup. Select Node 24.22.2 in the same terminal before running
`pnpm dev`; `.node-version` alone does not change your active runtime.

### First checkout

```sh
git clone git@github.com:Pazelgreen-Technologies-Limited/pazelgreen-website.git
cd pazelgreen-website
pnpm install --frozen-lockfile
```

For a new checkout, copy `.env.example` to `.env` (PowerShell:
`Copy-Item .env.example .env`). If `.env` already exists, keep it and edit the
necessary values rather than overwriting working credentials.

Set `APP_ENV=development`, choose a local PostgreSQL password, use that same
URL-encoded password in `DEV_DATABASE_URL`, and set a random `PAYLOAD_SECRET` of
at least 32 characters. Before the first start, also set `BOOTSTRAP_ADMIN_EMAIL`
and `BOOTSTRAP_ADMIN_PASSWORD` (12–256 characters). The handbook explains
[each value and how to generate secrets](docs/payload-handbook.md#first-local-setup). Actual `.env` files are ignored
by Git; commit placeholders only in `.env.example`.

```sh
pnpm dev
```

This starts Docker services, waits for them, applies pending migrations, ensures a first admin exists, and then
starts Next.js/Payload. Keep that terminal open.

| Local address | Purpose |
| --- | --- |
| [localhost:3000](http://localhost:3000) | Public website |
| [localhost:3000/admin](http://localhost:3000/admin) | Payload admin |
| [localhost:8025](http://localhost:8025) | Mailpit inbox for development emails |
| `127.0.0.1:5433` | PostgreSQL connection from your computer |

### First administrator

Before the first start, set `BOOTSTRAP_ADMIN_EMAIL` and
`BOOTSTRAP_ADMIN_PASSWORD` (12–256 characters) in your untracked `.env`.
`pnpm dev` and `pnpm start` automatically create an admin if none exists.
Existing admins and their credentials are preserved, even when bootstrap values change.
Sign in at `/admin`; newly bootstrapped admins must choose a password before using
the CMS and can update their email at the same time. Remove bootstrap values afterward.
An existing admin needs no bootstrap secrets on later starts. Shared environments
use invitations for additional users. `pnpm cms:bootstrap` remains an optional
manual check. See the [handbook](docs/payload-handbook.md#first-local-setup).

### Later starts and stopping

Run `pnpm dev` for normal local work. Press Ctrl+C to stop Next.js; Docker services
keep running. `pnpm db:stop` stops those services while preserving their volumes.
`pnpm db:up` starts them again. Database records and uploaded files are local data;
pushing Git commits does not share or back them up.

## Common commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start local services, migrate, ensure an admin and run the development app |
| `pnpm db:up` / `pnpm db:stop` | Start/stop local services without deleting data |
| `pnpm cms:migrate` | Apply committed migrations to the selected database |
| `pnpm cms:deliver` | Deliver due recruitment acknowledgements/notifications; schedule every minute |
| `pnpm cms:types` / `pnpm cms:importmap` | Refresh generated Payload types/admin imports |
| `pnpm cms:migration:create <name>` | Generate a schema migration for review |
| `pnpm lint` / `pnpm typecheck` | Check code style and TypeScript |
| `pnpm test` | Run environment, database configuration, blog and careers unit tests |
| `pnpm test:integration` | Run PostgreSQL/Mailpit tests against a disposable test database |
| `pnpm build` / `pnpm start` | Build and serve the optimized application |
| `pnpm test:http` | Check real HTTP behavior using integration fixtures and a fresh build |
| `pnpm test:browser` | Check blog/careers desktop/mobile flows using Playwright and the production build |
| `pnpm test:migrations` | Check latest migration down/up in a new disposable local database |

For a full verification run, use lint → typecheck → unit tests → integration tests
→ build → HTTP checks → browser checks, fixing failures before continuing. First configure the
[separate test database](docs/cms-setup.md#test-database-and-checks); integration
tests reset its CMS records. GitHub Actions is configured to run this sequence.

## How the repository is organized

```text
app/
  (frontend)/       Public pages, public layout/styles and route-specific _components/
  (payload)/        Admin, REST routes and isolated CMS layout/styles
components/        UI shared across distinct public pages
cms/               Collections, permissions, review hooks and custom endpoints
migrations/        Database migrations and schema snapshots
scripts/           Local service and first-admin commands
tests/             Unit, integration and production HTTP checks
docs/              Team handbook, command reference and API contract
.planning/         Implementation scope and progress
payload.config.ts  Payload's main configuration
payload-types.ts   Generated CMS record types
compose.yaml       Local PostgreSQL and Mailpit services
.env.example       Documented configuration placeholders
```

Route groups in parentheses preserve the public URLs. Page-specific UI belongs in
that route's `_components/` folder; `components/` is for UI shared across distinct
pages. Use strict TypeScript and Tailwind utilities. Prefer Server Components and
add client components where interaction requires them. Follow [AGENTS.md](AGENTS.md)
and read relevant installed Next.js guides before changing application code.

## Production and contributing

`APP_ENV=development` selects `DEV_DATABASE_URL`; `APP_ENV=production` requires
`PRODUCTION_DATABASE_URL` with no local fallback. Production also needs HTTPS,
SMTP, persistent public/private storage, migrations and backups. Our Compose file
is for local services. Read [the production guide](docs/payload-handbook.md#running-in-production)
before selecting hosting or deploying; `pnpm start` does not provision services.

For a PR, include relevant tests, generated files and reviewed migrations; describe
what changed and which checks ran. Use commit subjects like `feat: add company
settings`, `fix: preserve published content` or `docs: clarify CMS onboarding`.
Update the handbook/runbook when behavior changes and `.planning/progress.md`
after meaningful CMS work. Keep credentials, real uploads and private records out
of source control.
