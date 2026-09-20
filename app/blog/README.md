# Blog — Backend Integration Guide

This document is for the developer wiring up the PostgreSQL backend to the blog frontend.

---

## Overview

All blog data currently comes from `lib/blog-data.ts` (mock data).
The TypeScript interfaces in that file define the exact shape of data the frontend expects.
**Do not change the interfaces** — update the data source instead.

---

## Pages and their data needs

### `/blog` — Blog Listing Page

**File:** `app/blog/page.tsx`

Needs:

- All posts: `Post[]` — for the article grid
- Categories: `string[]` — for the filter tabs

**Where to wire it:**
Look for this comment in `app/blog/page.tsx`:

```
// BACKEND: replace MOCK_POSTS with → GET /api/posts
// BACKEND: replace MOCK_CATEGORIES with → GET /api/categories
```

---

### `/blog/[slug]` — Blog Detail Page

**File:** `app/blog/[slug]/page.tsx`

Needs:

- Single post by slug: `Post` — for the article content
- All posts (for sidebar "Latest Posts"): `Post[]`
- Comments for a post: `Comment[]`
- Categories: `string[]` — for sidebar
- Tags: `string[]` — for sidebar

**Where to wire it:**
Look for these comments in `app/blog/[slug]/page.tsx`:

```
// BACKEND: replace with → GET /api/posts/:slug
// BACKEND: replace with → GET /api/posts (for sidebar latest posts)
// BACKEND: replace with → GET /api/posts/:slug/comments
```

---

## Forms that need backend wiring

### 1. Comment Form

**File:** `app/blog/[slug]/_components/CommentSection.tsx`

Look for:

```
// BACKEND: wire this form to → POST /api/posts/:slug/comments
// Expected request body: { fullName: string, email: string, body: string, saveDetails: boolean }
// On success: append new comment to the comments list
```

---

### 2. Newsletter Signup Form (Footer)

**File:** `components/Footer.tsx`

Look for:

```
// BACKEND: wire this form to → POST /api/newsletter/subscribe
// Expected request body: { email: string }
// On success: show a confirmation message
```

---

## Database schema suggestion (PostgreSQL)

```sql
-- Posts table
CREATE TABLE posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  excerpt     TEXT,
  content     TEXT,
  cover_image TEXT,
  author_name TEXT,
  author_avatar TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  read_time   INT,
  category    TEXT,
  like_count  INT DEFAULT 0,
  save_count  INT DEFAULT 0
);

-- Tags table
CREATE TABLE tags (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT UNIQUE NOT NULL
);

-- Post tags join table
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Comments table
CREATE TABLE comments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id      UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_name  TEXT NOT NULL,
  author_avatar TEXT,
  body         TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);
```

---

## TypeScript interfaces (do not change)

See `lib/blog-data.ts` for the full interface definitions:

- `Post`
- `Author`
- `Comment`
