# Pazelgreen website

Pazelgreen's public website and team content management system. Built with
Next.js, Payload CMS, PostgreSQL, TypeScript and Tailwind CSS.

**T01–T11 are implemented and verified.**
T12 launch work is deferred at the user's request. Its company inputs and
production acceptance checks remain in the [T12 answer checklist](.planning/t12-checklist.md).

## Where to start

| What you want to do | Start here |
| --- | --- |
| Edit content on an already hosted site | Open that site's `/admin` with your invited account; no Node or Docker needed |
| Run the website on your computer | Follow [Run locally](#run-locally) below |
| Understand how the CMS works | Read the [team handbook](docs/payload-handbook.md) |
| Operate releases, backups, indexing and editor onboarding | Read [CMS operations](docs/cms-operations.md) |
| Resume launch preparation when requested | Fill in the deferred [T12 checklist](.planning/t12-checklist.md) |
| Continue development or hand work to another agent | Read [AGENTS.md](AGENTS.md), the [task plan](.planning/task.md) and the [current handoff](.planning/progress.md) |

## What you can edit

| Content | Where to edit it | Where it appears |
| --- | --- | --- |
| Company email, phone, address, hours, department contacts and socials | Website → Company Settings | Footer and Contact page |
| Search titles/descriptions for static pages and listings | Website → Page SEO | Public page metadata |
| Blog posts, categories and images | Blog and Content/Media | `/blog` and article pages |
| Jobs, employment types, departments and position codes | Careers | `/join-us/careers`, role pages and Join Us openings |
| Applications, private CVs, hiring statuses, assignments and notes | Careers | Private CMS screens; candidates use the public job form |
| Recruitment notice/retention settings and private recipients | Careers → Recruitment Settings / Recruitment Delivery | Application form and queued email delivery |
| FAQs | Content → FAQs | Internal CMS only, including after approval |
| Scheduled announcements | Website → Announcements | One notice above public navigation |
| Privacy policy and terms | Website → Legal Pages | `/privacy-policy` and `/terms-of-service` |

Public content comes from approved database records. Staff save drafts and submit
them for review; admins publish. Editing a published record keeps the previous
approved version live until its replacement is approved.

Homepage/other marketing copy and navigation remain in code. Contact-form delivery
and newsletter integration are outside the agreed CMS scope.

### Why the admin or website may look empty

The CMS provides editing screens; it does not invent company articles, jobs or
policies. Only the agreed Direct/Contract/Internship employment types are seeded.

- Company Settings uses the original hardcoded contact/social values until first
  publication, and again if unpublished. These are legacy fallbacks, not verified
  launch content. Once published, database values feed both Footer and Contact;
  blank optional fields are omitted.
- Blogs and careers show empty states until approved records exist. Legal pages
  are unavailable until approved policy documents are published.
- Application forms stay disabled until approved recruitment notice/version and
  retention settings are published. Configure recipients and the delivery
  scheduler separately; see [recruitment operations](docs/recruitment.md).

## Run locally

### 1. Prepare your tools

Use **Node 24.22.2**, **pnpm 10.18.1** and running **Docker Desktop with Compose**.
Select Node in the terminal you will use; [`.node-version`](.node-version) records
the version but does not install or activate it.

In your checkout:

```sh
node --version
pnpm --version
docker compose version
pnpm install --frozen-lockfile
```

Node 22.13.0 is unsupported. If pnpm reports an engine error, fix the active Node
version first. Git Bash users who changed `.bashrc` can reload it with
`source ~/.bashrc` and clear remembered command paths with `hash -r`.

### 2. Configure your local environment

If `.env` does not exist, copy [`.env.example`](.env.example) to `.env`. **Keep an
existing `.env`; do not overwrite working settings.** Set these values:

| Setting | What to enter |
| --- | --- |
| `APP_ENV` | `development` |
| `DEV_DATABASE_URL` | Your local PostgreSQL URL, normally using port 5433 and database `pazelgreen`; URL-encode special password characters |
| `PAYLOAD_SECRET` | A random secret of at least 32 characters; keep it stable |
| `SERVER_URL` | `http://localhost:3000` for the default local address |
| `BOOTSTRAP_ADMIN_EMAIL` | Your first admin email; needed only if no admin exists |
| `BOOTSTRAP_ADMIN_PASSWORD` | A unique initial password of 12–256 characters |

Docker database settings are derived from `DEV_DATABASE_URL`; you do not need
duplicate `POSTGRES_*` variables. Local email defaults to Mailpit. The handbook
explains [secret generation and each setting](docs/payload-handbook.md#first-local-setup).
Real `.env` files, uploads and database contents are kept out of Git.

### 3. Start and sign in

```sh
pnpm dev
```

This starts PostgreSQL/Mailpit, waits for them, applies migrations, ensures the
first admin exists and starts Next.js. Keep the terminal open.

| Address | Purpose |
| --- | --- |
| [localhost:3000](http://localhost:3000) | Public website |
| [localhost:3000/admin](http://localhost:3000/admin) | CMS admin |
| [localhost:8025](http://localhost:8025) | Captured local emails; these are not sent to real inboxes |

Sign in with the bootstrap credentials. A newly created admin must choose a new
password before editing content and can update their email at the same time.
Sign in again afterward and remove bootstrap values from `.env`. Existing admins
and their credentials are preserved on later starts. Invite teammates through
the CMS rather than sharing passwords.

Use the same browser origin as `SERVER_URL`. If you change the hostname or port,
update that setting and restart; application submissions check the public origin.

### 4. Make your first company-details edit

1. Open Website → Company Settings and enter verified company details.
2. Save the draft, then set Review State to **in-review** and save again.
3. As an admin, publish that unchanged submitted draft.
4. Refresh the public Footer/Contact page to see the approved database values.
   No rebuild is needed. Further content edits need another review cycle.

On later days, run `pnpm dev`. Ctrl+C stops Next.js; `pnpm db:stop` stops the
Docker services while preserving their data. `pnpm db:up` starts them again.

## Everyday commands and checks

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start local services, migrate, ensure an admin and run the app |
| `pnpm db:up` / `pnpm db:stop` / `pnpm db:status` | Start, stop or inspect local services |
| `pnpm cms:deliver` | Deliver due recruitment emails; run manually locally, schedule every minute when deployed |
| `pnpm cms:types` / `pnpm cms:importmap` | Refresh generated CMS types/admin imports |
| `pnpm cms:migration:create <name>` / `pnpm cms:migrate` | Generate a migration for review / apply committed migrations |
| `pnpm lint` / `pnpm typecheck` | Check code style and TypeScript |
| `pnpm build` / `pnpm start` | Build with webpack / serve the optimized app; start does not start Docker or apply migrations |

For verification, first configure the [separate disposable test database and local
Mailpit](docs/cms-setup.md#test-database-and-checks). Run lint → typecheck →
`pnpm test` → `pnpm test:integration` → `pnpm test:migrations` → build →
`pnpm test:http` → `pnpm test:browser`, fixing failures before continuing.
Browser tests need Chromium or installed Chrome; the setup guide explains both.
Tests reset test records. Run suites sequentially and let test servers stop
before rebuilding. After a failed HTTP sequence, rerun integration to reset its
fixtures before retrying. GitHub Actions is configured for these checks; local
passing results do not mean a remote CI run or deployment happened.

## Guides and project handoff

| Guide | Use it for |
| --- | --- |
| [Team handbook](docs/payload-handbook.md) | Concepts, accounts, environments, deployment and backups |
| [Setup reference](docs/cms-setup.md) | Exact local, test, migration and release commands |
| [Netlify deployment](docs/netlify-deployment.md) | Outstanding storage, environment, migration, bootstrap and hosted verification work |
| [Object storage](docs/object-storage.md) | Private Supabase S3 configuration, connection checks, local-file transfer and later R2 cutover |
| [Blog](docs/blog-editing.md) / [Careers](docs/careers-editing.md) | Creating and publishing articles and jobs |
| [Recruitment](docs/recruitment.md) | Private CVs, applicant IDs, hiring operations, email retries and retention |
| [FAQs](docs/faqs-editing.md) / [Announcements](docs/announcements-editing.md) / [Legal pages](docs/legal-editing.md) | Feature-specific editing rules |
| [Custom API contract](docs/cms-api.yaml) | Invitations, draft previews, application submission and active announcements |
| [Operations](docs/cms-operations.md) | Publishing/indexing behavior, release recovery, monitoring and editor onboarding |
| [Staff permissions](docs/staff-permissions.md) | Assign section View/Modify access, media dependencies and migration rollout |
| [Task plan](.planning/task.md) / [Current handoff](.planning/progress.md) | Agreed scope, T11/T13 completion evidence and deferred T12 inputs |
| [Archived history](.planning/history.md) | Earlier implementation notes; superseded next actions are historical only |

Code lives in `app/` (public/admin routes), `cms/` (schemas and server rules),
`lib/` (public reads), `components/` (shared UI), `migrations/`, `scripts/` and
`tests/`. Follow [AGENTS.md](AGENTS.md) for component placement and coding rules.

Production needs independently configured PostgreSQL, SMTP, HTTPS, durable
public/private storage (private S3 or persistent filesystem mounts), release migrations, recruitment scheduling and verified
backups. Git does not share or back up content/uploads. Read the
[production procedure](docs/payload-handbook.md#running-in-production) before
deploying. T11 indexing/navigation checks and recovery instructions are complete.
Actual production recovery verification, company-approved content/policies and
launch acceptance remain in the deferred T12 task.

Staff permissions are assigned per section: No access, View or Modify. Modify
covers every record in that section; publishing remains admin-only. Existing staff
need explicit assignments after migration. See [staff permissions](docs/staff-permissions.md).
