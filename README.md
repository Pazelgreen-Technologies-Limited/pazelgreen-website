# Pazelgreen Corporate Website

The official public-facing corporate and marketing website for **Pazelgreen**, built with Next.js, TypeScript, and Tailwind CSS. Pazelgreen is dedicated to creating innovative and sustainable tech solutions that drastically reduce food and agricultural waste across Africa.

---

## 🚀 Getting Started

Follow these steps to get the project running locally on your machine.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v20.x or higher recommended)
- **pnpm** (This project uses `pnpm` for fast, space-efficient package management)

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

3. **Run the development server:**

```bash
   pnpm dev
```

Open http://localhost:3000 in your browser to see the result.

## 📁 Project Structure & Component Philosophy

This codebase is organized around a **colocation pattern**. The goal is to keep components as close as possible to where they are actually used, making the project intuitive to navigate as it grows.

### How Components are Distributed:

- Global Components (components/):  
  This folder is the home for building blocks shared across the entire site. Things like the Navbar, Footer, or core ui elements (like generic buttons or cards) live here because they aren't tied to any single view.

- Page-Specific Components (\_components/ inside a route):  
  When a component is highly specialized and only needed for a single page—like a unique ContactForm or a specific agricultural impact chart—it lives right inside that page's folder.

Tip: The underscore in \_components is a Next.js convention that tells the framework to ignore this folder for routing, keeping it safely tucked away as private UI code.

```plaintext
pazelgreen-website/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── lib/
│   │   └── (empty)
│   ├── _components/
│   │   ├── CoreCapabilities.tsx
│   │   ├── GetInvolvedSection.tsx
│   │   ├── Hero.tsx
│   │   ├── PagexSection.tsx
│   │   ├── ProblemSection.tsx
│   │   └── VisionSection.tsx
│   └── solutions/
│       ├── page.tsx
│       └── _components/
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
