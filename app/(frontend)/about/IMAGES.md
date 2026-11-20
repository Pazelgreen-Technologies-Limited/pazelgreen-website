# About page image assets

These static assets are referenced by the About page. They are controlled in code,
not by the CMS media library. When replacing them with approved assets, keep the
filenames below in `public/` or update the corresponding component references.
Export from the team's design source when available and confirm image rights.

| Asset path                  | Used in section               | Suggested replacement                                      |
| --------------------------- | ----------------------------- | ---------------------------------------------------------- |
| `/about-hero-bg.jpg`        | `AboutHero` (background)      | Aerial/top-down agriculture scene, dark green tones        |
| `/about-founder.png`        | `FounderPerspective` (right)  | Founder portrait photo                                      |
| `/about-fragmentation.png`  | `WhyWeExistSection` (right)   | Top-down crop field / aerial leafy fields                  |
| `/about-pagex-network.png`  | `PagexSection` (right)        | PAGEX network visualization graphic (transparent PNG ideal) |
| `/about-commitment-bg.png`  | `CommitmentSection` (bg)      | Hands holding sprout / greenhouse hero                      |

## Tips

- The hero image is rendered with `object-cover` so any aspect ratio works — Next.js auto-generates responsive `srcset` for `1920w`, `1080w`, `828w`, etc.
- The founder image is rendered in a `4/5` (mobile) to `3/4` (desktop) aspect-ratio frame.
- The fragmentation image is rendered in `3/4` (mobile) to `4/5` (desktop) with three floating "System Insight" cards layered on top.
- The PAGEX network image is rendered in a square (`aspect-square`) frame — export as a square PNG with a transparent background.
- The commitment CTA background is rendered in a 420px mobile / 500px desktop banner — use a wide landscape image (~1920x800 or similar).
