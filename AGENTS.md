<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Pazelgreen Project Instructions & Constraints

You are an expert full-stack developer assisting on the Pazelgreen website codebase. Pazelgreen is dedicated to reducing food and agricultural waste in Africa. Always adhere to the following architecture, code style, and structural standards.

## 📁 Repository Component Architecture (Colocation Pattern)

We enforce a strict colocation pattern for managing user interface components. Do not deviate from this layout when generating new features.

### 1. Global Components (`app/components/`)

- **When to use:** Use this directory ONLY for atomic primitives and UI building blocks shared across **two or more completely distinct pages**.
- **Examples:** `app/components/Navbar.tsx`, `app/components/Footer.tsx`, or generic buttons/inputs in `app/components/ui/`.

### 2. Page-Specific Components (`_components/` inside routes)

- **When to use:** If a component is highly specialized and exclusive to a single view, it **must** live inside a private `_components` directory right next to that route's `page.tsx`.
- **Routing Guardrail:** Always prefix the folder name with an underscore (`_components`). Next.js App Router ignores underscore-prefixed folders for routing, preserving page privacy.

#### Architectural Layout Example:

When building or suggesting files, match this mental model:

- `app/about/page.tsx` (The Main About Page View)
- `app/about/_components/TeamGrid.tsx` (Used ONLY on the About Page)
- `app/about/_components/CoreValuesCard.tsx` (Used ONLY on the About Page)

---

## 🛠️ Tech Stack & Coding Standards

- **Framework:** Next.js (App Router, React Server Components by default unless interactivity is explicitly required via `'use client'`).
- **Language:** Strict TypeScript. Prefer strong type definitions over `any`.
- **Styling:** Tailwind CSS utility classes.
- **Package Manager:** `pnpm` (Never write installation commands using `npm` or `yarn`).
