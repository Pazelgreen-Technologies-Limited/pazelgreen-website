<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Pazelgreen Project Instructions & Constraints

You are an expert full-stack developer assisting on the Pazelgreen website codebase. The marginal cost of completeness is near zero with AI. Do the whole thing. Do it right. Do it with tests. Do it with documentation. Do it so well that Pazelgreen is genuinely impressed — not politely satisfied, actually impressed. Always adhere to the following architecture, code style, and structural standards.

## 📁 Repository Component Architecture (Colocation Pattern)

We enforce a strict colocation pattern for managing user interface components. Do not deviate from this layout when generating new features.

### 1. Global Components (`components/`)

- **When to use:** Use this directory ONLY for atomic primitives and UI building blocks shared across **two or more completely distinct pages**.
- **Examples:** `components/Navbar.tsx`, `components/Footer.tsx`, or generic buttons/inputs in `components/ui/`.

### 2. Page-Specific Components (`_components/` inside routes)

- **When to use:** If a component is highly specialized and exclusive to a single view, it **must** live inside a private `_components` directory right next to that route's `page.tsx`.
- **Routing Guardrail:** Always prefix the folder name with an underscore (`_components`). Next.js App Router ignores underscore-prefixed folders for routing, preserving page privacy.

#### Architectural Layout Example:

When building or suggesting files, match this mental model:

- `app/about/page.tsx` (The Main About Page View)
- `app/about/_components/TeamGrid.tsx` (Used ONLY on the About Page)
- `app/about/_components/CoreValuesCard.tsx` (Used ONLY on the About Page)

---

## commit style

use the following commit message format for all changes:

```
<type>: <subject>
```

Where `<type>` is one of:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

## 🛠️ Tech Stack & Coding Standards

- **Framework:** Next.js (App Router, React Server Components by default unless interactivity is explicitly required via `'use client'`).
- **Language:** Strict TypeScript. Prefer strong type definitions over `any`.
- **Styling:** Tailwind CSS utility classes.
- **Package Manager:** `pnpm` (Never write installation commands using `npm` or `yarn`).

## CMS Planning and Agent Handoff

- Before CMS work, read [the task plan](.planning/task.md) and
  [the progress record](.planning/progress.md). They define the agreed scope,
  decisions, task order, validation requirements, and next action.
- Inspect the working tree and relevant local Next.js guides before implementation.
  Preserve other contributors' changes.
- Update progress.md after meaningful work with task IDs, changed files, actual
  validation results, blockers, and the next action. Mark task.md checkboxes
  complete only when implementation and verification are finished.
- Synchronize scope decisions in both files. Explicit user instructions take
  precedence; do not silently expand CMS scope.
- CMS roles are admin and staff. Staff draft; admins approve public changes
  and manage users. Enforce server permissions, including private CV downloads.
- Advert IDs use an immutable company-wide annual sequence. Applicant IDs extend
  the advert with an immutable per-advert sequence. Allocation must be atomic
  and retry-safe; task.md contains the full rules.
- FAQs remain backend-only. Homepage hero/content editing is excluded;
  site-wide announcements and page SEO are included.
- Never put secrets or applicant personal data in planning documents or logs.
