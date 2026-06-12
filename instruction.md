Look at the design image in public/home.png and public/solution.png and generate a Next.js website matching it. Follow these strict structural guidelines:

1. CORE STACK: Follow the Next.js and agent rules specified in AGENTS.md. Use TypeScript for all styling and logic.
2. IMAGE HANDLING: For any images/graphics present in the design, DO NOT write real URLs. Instead, place an inline comment '<!-- TODO: Add required photo manually -->' and use a Next.js <Image /> component placeholder with explicit width, height, and a gray background.
3. TAILWIND COLORS: Extract the exact color hex codes from the design image. If they do not perfectly match a default Tailwind color (e.g., slate-500, blue-600), output the required custom color extensions. Write a separate code block showing exactly what to add to the 'theme.extend.colors' object inside my tailwind.config.ts.
4. RESPONSIVE DESIGN: The provided mockup is a desktop layout. Automatically design and implement a mobile-first responsive layout. Use Tailwind responsive variants (e.g., hidden md:block, grid-cols-1 md:grid-cols-3) to ensure it collapses into a stunning, professional mobile interface on small screens."
