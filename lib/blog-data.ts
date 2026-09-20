// ============================================================
// lib/blog-data.ts
// ============================================================
// This file serves two purposes:
//   1. Defines the TypeScript interfaces that describe the shape
//      of all blog-related data across the frontend.
//   2. Provides mock data so the UI works without a backend.
//
// BACKEND INTEGRATION GUIDE
// --------------------------
// When the PostgreSQL backend is ready, the mock data below
// should be replaced with real API calls. The interfaces MUST
// stay the same — the frontend components depend on them.
//
// Suggested endpoints:
//   GET /api/posts              → returns Post[]  (for blog listing page)
//   GET /api/posts/:slug        → returns Post    (for blog detail page)
//   GET /api/posts/:slug/comments → returns Comment[]
//   POST /api/posts/:slug/comments → creates a comment, returns Comment
//   GET /api/categories         → returns string[]
//   GET /api/tags               → returns string[]
//
// Each component that needs data has a comment marking exactly
// where the API call should be wired in.
// ============================================================

// ── Interfaces ──────────────────────────────────────────────

export interface Author {
  name: string;
  avatar: string; // URL to author avatar image
}

export interface Post {
  id: string;
  slug: string; // used in the URL: /blog/[slug]
  title: string;
  excerpt: string; // short summary shown on cards
  content: string; // full HTML or markdown content for detail page
  coverImage: string; // URL to cover image
  author: Author;
  publishedAt: string; // ISO date string e.g. "2025-01-17"
  readTime: number; // estimated read time in minutes
  category: string;
  tags: string[];
  commentCount: number;
  likeCount: number;
  saveCount: number;
}

export interface Comment {
  id: string;
  author: Author;
  body: string;
  publishedAt: string;
}

// ── Mock Data ────────────────────────────────────────────────
// Replace these with real API calls when backend is ready.

export const MOCK_CATEGORIES = [
  "All",
  "AgriTech",
  "Sustainability",
  "Farming",
  "Harvest",
  "Fresh Vegetables",
  "Organic Food",
];

export const MOCK_TAGS = [
  "Agriculture",
  "Farming",
  "Harvest",
  "Organic",
  "Vegetables",
  "Irrigation",
  "AgriTech",
];

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    slug: "future-of-farming-smart-irrigation",
    title: "The Future of Farming: Smart Irrigation Solutions",
    excerpt:
      "Growing the future, one harvest at a time — how sensors, weather data and automation are quietly rewriting the rules of water on the farm.",
    content: `
      <p>In recent years, smart irrigation has emerged as a transformative solution in agriculture, addressing the critical need for efficient water use while ensuring crop health and sustainability. As global water scarcity becomes an increasing concern, the demand for smarter water management technologies is growing.</p>
      <h2>What is Smart Irrigation?</h2>
      <p>Smart irrigation refers to the use of advanced technologies to automatically adjust watering schedules and amounts based on real-time data, weather forecasts, and soil moisture levels. Unlike traditional irrigation systems that operate on fixed schedules, smart systems utilize sensors and data analytics to deliver water only when and where it is needed.</p>
      <h2>Why it matters now</h2>
      <p>Smart irrigation is not just a technological trend — it is a necessary evolution in the way we manage water resources in agriculture. By making irrigation systems more efficient and data-driven, smart irrigation helps conserve water, reduce costs, improve crop health, and protect the environment.</p>
    `,
    coverImage: "/blog/smart-irrigation.jpg",
    author: { name: "Dare Salami", avatar: "/blog/avatars/dare.jpg" },
    publishedAt: "2025-01-17",
    readTime: 10,
    category: "AgriTech",
    tags: ["Harvest", "Vegetables", "Irrigation", "AgriTech"],
    commentCount: 0,
    likeCount: 134,
    saveCount: 30,
  },
  {
    id: "2",
    slug: "organic-farming-trends-eco-friendly-agriculture",
    title: "Organic Farming Trends: The Future of Eco-Friendly Agriculture",
    excerpt:
      "Exploring how organic farming practices are reshaping food systems and creating new opportunities for sustainable growth.",
    content: `<p>Organic farming is experiencing a renaissance as consumers demand cleaner, more sustainable food options. This shift is creating new market opportunities for farmers willing to transition away from conventional methods.</p>`,
    coverImage: "/blog/organic-farming.jpg",
    author: { name: "Dare Salami", avatar: "/blog/avatars/dare.jpg" },
    publishedAt: "2025-01-10",
    readTime: 7,
    category: "Sustainability",
    tags: ["Agriculture", "Farming", "Organic"],
    commentCount: 2,
    likeCount: 98,
    saveCount: 22,
  },
  {
    id: "3",
    slug: "agronomy-and-relation-to-other-sciences",
    title: "Agronomy and its Relation to Other Sciences",
    excerpt:
      "Understanding how agronomy intersects with biology, chemistry, and environmental science to drive modern farming forward.",
    content: `<p>Agronomy sits at the crossroads of multiple scientific disciplines. Its relationship with biology, chemistry, and environmental science creates a rich tapestry of knowledge that modern farmers and researchers draw from daily.</p>`,
    coverImage: "/blog/agronomy.jpg",
    author: { name: "Dare Salami", avatar: "/blog/avatars/dare.jpg" },
    publishedAt: "2025-01-05",
    readTime: 8,
    category: "Farming",
    tags: ["Agriculture", "Farming"],
    commentCount: 1,
    likeCount: 76,
    saveCount: 15,
  },
  {
    id: "4",
    slug: "bringing-food-production-back-to-cities",
    title: "Bringing Food Production Back to Cities",
    excerpt:
      "Urban farming is no longer a fringe movement. Here's how cities around the world are reclaiming food production.",
    content: `<p>Urban agriculture is transforming rooftops, vacant lots, and vertical spaces into productive food systems. From hydroponics to community gardens, cities are finding innovative ways to grow food closer to where it is consumed.</p>`,
    coverImage: "/blog/urban-farming.jpg",
    author: { name: "Dare Salami", avatar: "/blog/avatars/dare.jpg" },
    publishedAt: "2024-12-28",
    readTime: 6,
    category: "AgriTech",
    tags: ["Agriculture", "Harvest"],
    commentCount: 3,
    likeCount: 112,
    saveCount: 18,
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    author: { name: "Dare Salami", avatar: "/blog/avatars/dare.jpg" },
    body: "Great article! I've been struggling with soil quality in my garden, and the tips about using organic compost are super helpful. I'll definitely be trying that next season. Do you have any advice on dealing with clay-heavy soil?",
    publishedAt: "2025-01-18",
  },
  {
    id: "c2",
    author: { name: "Dare Salami", avatar: "/blog/avatars/dare.jpg" },
    body: "Great article! I've been struggling with soil quality in my garden, and the tips about using organic compost are super helpful. I'll definitely be trying that next season. Do you have any advice on dealing with clay-heavy soil?",
    publishedAt: "2025-01-19",
  },
];
