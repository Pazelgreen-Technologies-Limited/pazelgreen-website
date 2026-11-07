# About Page — Image Asset Checklist

This page references the following image filenames. Export them from Figma, rename to match the filenames below, and drop them into `public/`.

| Placeholder file            | Used in section               | Suggested Figma export                                     |
| --------------------------- | ----------------------------- | ---------------------------------------------------------- |
| `/about-hero-bg.jpg`        | `AboutHero` (background)      | Aerial/top-down agriculture scene, dark green tones        |
| `/about-founder.png`        | `FounderPerspective` (right)  | Founder portrait photo                                      |
| `/about-fragmentation.png`  | `WhyWeExistSection` (right)   | Top-down crop field / aerial leafy fields                  |
| `/about-pagex-network.png`  | `PagexSection` (right)        | PAGEX network visualization graphic (transparent PNG ideal) |
| `/about-commitment-bg.png`  | `CommitmentSection` (bg)      | Hands holding sprout / greenhouse hero                      |

## Tips

- The hero image is rendered with `object-cover` so any aspect ratio works — Next.js auto-generates responsive `srcset` for `1920w`, `1080w`, `828w`, etc.
- The founder image is rendered in a `3/4` (mobile) to `4/5` (desktop) aspect-ratio frame.
- The fragmentation image is rendered in `3/4` (mobile) to `4/5` (desktop) with three floating "System Insight" cards layered on top.
- The PAGEX network image is rendered in a square (`aspect-square`) frame — export as a square PNG with a transparent background.
- The commitment CTA background is rendered in a `h-[500px]` banner — use a wide landscape image (~1920x800 or similar).
