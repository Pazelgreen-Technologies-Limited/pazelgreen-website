# Pazelgreen Corporate Website

The official public-facing corporate and marketing website for **Pazelgreen**, built with Next.js, TypeScript, and Tailwind CSS. Pazelgreen is dedicated to creating innovative and sustainable tech solutions that drastically reduce food and agricultural waste across Africa.

---

## 🚀 Getting Started

Follow these steps to get the project running locally on your machine.

### Prerequisites

Ensure you have the following installed:

- **Node.js 24.22.2** (see `.node-version`; Payload requires a supported recent runtime)
- **pnpm** (This project uses `pnpm` for fast, space-efficient package management)
- **Docker Desktop / Docker Compose** for local PostgreSQL and Mailpit

### Setup Instructions

1. **Clone the repository:**

```bash
   git clone git@github.com:Pazelgreen-Technologies-Limited/pazelgreen-website.git
   cd pazelgreen-website
```

2. **Install dependencies:**

```bash
   pnpm install
```

3. **Configure `.env`:** Copy `.env.example`, set a random `PAYLOAD_SECRET`, and
   match the PostgreSQL password in `POSTGRES_PASSWORD` and `DEV_DATABASE_URL`.

4. **Run the development server:**

```bash
   pnpm dev
```

The predev step starts Docker PostgreSQL/Mailpit and applies committed migrations.
Open http://localhost:3000 in your browser to see the result. CMS admin lives at
`/admin`; local invitation emails arrive at http://localhost:8025.

See [CMS setup and operations](docs/cms-setup.md) for environment selection,
first-admin bootstrap, invitations, storage, approval workflow, tests, and production.
`APP_ENV=development` uses `DEV_DATABASE_URL` (Docker); `APP_ENV=production`
requires `PRODUCTION_DATABASE_URL` and never falls back to the local database.

## 📁 Project Structure & Component Philosophy

This codebase is organized around a **colocation pattern**. The goal is to keep components as close as possible to where they are actually used, making the project intuitive to navigate as it grows.

### How Components are Distributed:

- Global Components (components/):
  This folder is the home for building blocks shared across the entire site. Things like the Navbar, Footer, or core ui elements (like generic buttons or cards) live here because they aren't tied to any single view.

- Page-Specific Components (\_components/ inside a route):
  When a component is highly specialized and only needed for a single page—like a unique ContactForm or a specific agricultural impact chart—it lives right inside that page's folder.

Tip: The underscore in \_components is a Next.js convention that tells the framework to ignore this folder for routing, keeping it safely tucked away as private UI code. Public routes now live inside `app/(frontend)` and CMS routes inside `app/(payload)` with separate root layouts; their URLs are unchanged.

```plaintext
pazelgreen-website/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── app/
│   ├── (frontend)/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── _components/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── join-us/
│   │   └── solutions/
│   └── (payload)/
│       ├── layout.tsx
│       ├── admin/
│       └── api/
├── cms/
├── migrations/
├── scripts/
├── tests/
├── docs/cms-setup.md
├── compose.yaml
├── payload.config.ts
├── payload-types.ts
├── components/
│   ├── Footer.tsx
│   └── Navbar.tsx
├── next-env.d.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── tsconfig.json
└── public/
    └── favicon.ico
```

### 🛠️ Tech Stack

Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS

Package Manager: pnpm

## Issue map:
```text
                 ┌──> Issue 8 (Docs)  [Immediate]
                 │
                 ├──> Issue 9 (UI Fixes) [Immediate]
                 │
Issue 1 (Setup) ─┴──> Issue 2 (CMS Schemas)
                           │
                           ├──> Issue 3 (Approvals & Email) ──┐
                           ├──> Issue 4 (Global Layout)     ──┼──> Issue 7 (Launch & E2E)
                           ├──> Issue 5 (Dynamic Pages)     ──┤
                           └──> Issue 6 (Forms & Security)  ──┘
```


