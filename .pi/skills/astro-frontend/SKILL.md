---
name: astro-frontend
description: Astro 5/6 frontend conventions for content-driven, mostly-static sites — file structure, content collections with the Content Layer API and Zod schemas, hydration directives, image handling, MDX, integrations, view transitions, and GitHub Pages deployment. Use when working on .astro files, astro.config.*, content collections, islands, hydration directives, responsive images, MDX content, integrations (mdx, sitemap, rss, tailwind, check), or deploying an Astro site. Applies especially to the kosmos-hub blog (Astro 5.16.15, MDX + RSS + sitemap, GitHub Pages). Do NOT use for non-Astro frameworks (Next.js, Remix, SvelteKit, Nuxt), backend API work, realtime dashboards, or auth-first SSR — route those elsewhere.
---

# Astro Frontend

A focused skill for building and maintaining Astro 5/6 sites — especially content-heavy, mostly-static projects like the kosmos-hub blog in this repo.

## When to fire

Trigger on any of:

- Editing or scaffolding `.astro` files, `astro.config.*`, or `src/content.config.ts`.
- Setting up or refactoring a **content collection** (Zod schema, `glob()`/`file()` loader).
- Picking a **hydration directive** (`client:load` / `client:idle` / `client:visible` / `client:only`).
- Adding or upgrading an **integration** (`@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`, `@tailwindcss/vite`, `@astrojs/check`).
- Image handling decisions (`<Image />` from `astro:assets` vs. `public/` assets).
- View transitions, `ClientRouter`, or persistent islands across navigation.
- Deploying an Astro site (GitHub Pages, Cloudflare Pages, Vercel, Netlify).
- Working inside this repo's `kosmos-hub` blog.

Do NOT fire for:

- Next.js, Remix, SvelteKit, Nuxt, or other non-Astro frameworks — those have their own conventions.
- Backend API work, databases, auth flows unrelated to Astro's adapter layer.
- Realtime dashboards or cross-page client-state apps — Astro is the wrong tool; recommend Next.js / Remix.
- Generic CSS/HTML questions unrelated to Astro-specific patterns.

## File structure

Follow Astro's defaults. Do not relocate `src/pages/` or `src/content/`.

```
src/
  pages/          # File-based routes: .astro, .md, .mdx.
  layouts/        # Page wrappers. Keep one BaseLayout.astro.
  components/     # .astro components and framework islands.
  content/        # Content collections (managed by Astro).
  styles/         # Global CSS, design tokens.
public/           # Static assets served at /. Favicons, robots.txt, llms.txt.
astro.config.mjs
tsconfig.json
```

**One `BaseLayout.astro`** holds `<head>` metadata, the canonical link, Open Graph tags, and JSON-LD. Per-page values are passed as props — never duplicate SEO markup across pages.

## Content collections (Astro 5/6)

Use a Zod schema for **every** collection, and define it with a **Content Layer `loader`**:

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

Rules:

- The legacy `type: "content"` property was **removed in Astro 6** — always use a loader (`glob()` for a folder, `file()` for a single data source).
- Schemas run at build time and **fail the build** on missing or malformed frontmatter — lean on them; do not duplicate validation in templates.
- Query with `getCollection("posts")` in `.astro` files.
- **Filter drafts in the query, not in templates:**

  ```ts
  const posts = (await getCollection("posts", ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  ```

- Use `getEntry("posts", slug)` for single posts; pair with `render()` (Astro 5+) instead of the deprecated `entry.render()`.

## Hydration directives

Pick by **when the user needs the interactivity**, not by what feels safe. Each hydrated component ships a framework runtime to the user — defer the cost when you can.

| Directive | When to use |
| --- | --- |
| `client:load` | Hydrate on page load. Above-the-fold interactivity the user touches immediately (theme toggle, sticky nav). |
| `client:idle` | Hydrate during browser idle. Non-critical widgets the user may touch later (footer newsletter form). |
| `client:visible` | Hydrate when scrolled into view. Below-the-fold widgets (comments, embedded chart). **Right default for most islands.** |
| `client:only="framework"` | Skip server rendering; render only on the client. Use when the component cannot render on the server (reads `window`, draggable canvas). |

Do **not** default to `client:load` for everything. Prefer `client:visible` and `client:idle` when deferring is safe.

## Images

- Use `<Image />` from `astro:assets` for any image inside `src/`:

  ```astro
  ---
  import { Image } from "astro:assets";
  import hero from "../assets/hero.jpg";
  ---
  <Image
    src={hero}
    alt="Description"
    widths={[400, 800, 1200]}
    sizes="(max-width: 720px) 100vw, 800px"
  />
  ```

  Generates responsive sources, sets explicit dimensions, and prevents layout shift.

- Astro does **not** transform images in `public/`. Put pre-sized assets, icons, OG images, favicons, and `robots.txt` there.
- Put source photos in `src/` so `<Image />` can optimize them.

## Integrations to default-install

For most sites, install these on day one:

- `@astrojs/mdx` — JSX inside markdown.
- `@astrojs/sitemap` — generates `/sitemap.xml`.
- `@astrojs/rss` — for blog feeds.
- `@tailwindcss/vite` — Tailwind v4, added under `vite.plugins` with a global `@import "tailwindcss";`. Use `npx astro add tailwind`. The old `@astrojs/tailwind` integration is deprecated and supports only Tailwind v3.
- `@astrojs/check` — type-checks `.astro` files. Add to dev dependencies and run it in CI.

## View transitions

For multi-page apps that want SPA-feel navigation without a full client framework:

- Add `<ClientRouter />` in the shared layout's `<head>`.
- Use `transition:name` on elements that should morph across navigations.
- Persistent islands (`transition:persist`) survive navigation — useful for audio players or nav state.
- Prefer the built-in `<ClientRouter />` over hand-rolling.

## SEO baseline (set in `BaseLayout.astro`)

- `<link rel="canonical" href={canonicalURL} />`
- Title and meta description (driven by props).
- Open Graph: `og:title`, `og:description`, `og:url`, `og:image`, `og:type`.
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
- JSON-LD: `Article` for blog posts; `WebSite` and `Organization` on the homepage.

## Deployment

- **GitHub Pages**: `astro build` → deploy `dist/` via `actions/deploy-pages@v4`. Set `site` and `base` in `astro.config.mjs` when hosting under a project path (e.g. `/repo-name`).
- **Cloudflare Pages**: zero config; build command `astro build`, output `dist`.
- **Vercel**: zero config; Astro auto-detects. Move to Vercel when you need SSR, edge functions, or per-PR previews.

## This repo — kosmos-hub

The repo at `package.json:11` pins `astro@^5.16.15`. Stack specifics:

- **Integrations installed** (`package.json:8-10`): `@astrojs/mdx@^4.3.13`, `@astrojs/rss@^4.0.15`, `@astrojs/sitemap@^3.7.0`.
- **`astro.config.mjs:7-8`**: `site: 'https://gustavovaasc.github.io'`, `base: '/kosmos-hub'` — every asset path and canonical URL must account for the `/kosmos-hub` prefix.
- **Content collection**: lives in `src/content/` (likely `blog/`). Filter drafts and future-dated posts in `getCollection()` queries, not in templates.
- **Math**: `katex@^0.16.28` is installed — use it via a wrapper component or `remark-math`/`rehype-katex` for MDX math.
- **Images**: `sharp@^0.34.3` is the image-processing backend; `<Image />` works out of the box.
- **Deploy target**: GitHub Pages via `actions/deploy-pages@v4`. Build artifact is `dist/`.
- **Theme**: Bear Blog fork (per `README.md:54`). Keep changes minimal — the design intent is the point.

When working in this repo, the `base: '/kosmos-hub'` prefix is the most common source of broken assets and canonical URLs — double-check any hardcoded path.

## Common pitfalls (prioritized)

1. **Hardcoding paths without `import.meta.env.BASE_URL`** — broken under `base: '/kosmos-hub'`. Use `<a href={import.meta.env.BASE_URL + 'post-slug'}/>` or `<Image src={import.meta.env.BASE_URL + '...'} />`.
2. **Using the legacy `type: "content"`** — removed in Astro 6; use a loader.
3. **Filtering drafts in templates** instead of in `getCollection()` — leaks draft content into RSS/sitemap.
4. **Blanket `client:load`** — ships a framework runtime for every hydrated component. Default to `client:visible`.
5. **Multiple base layouts** — duplicate SEO markup and drift. Keep one `BaseLayout.astro`.
6. **Source photos in `public/`** — Astro doesn't transform them there; move to `src/` and use `<Image />`.
7. **Skipping a Zod schema** on a collection — loses build-time validation and type safety.
8. **Using deprecated `@astrojs/tailwind`** — supports only v3; use `@tailwindcss/vite` for v4.
9. **Not running `@astrojs/check` in CI** — leaves `.astro` files un-type-checked.
10. **`entry.render()` instead of `render()`** — legacy Content Collections API.
11. **Putting SEO metadata in per-page components** instead of centralizing in `BaseLayout.astro`.

## When NOT to use Astro

Push back on Astro for:

- Apps with cross-page client state (auth-gated dashboards, multi-step forms with persisted state) → **Next.js or Remix**.
- Realtime dashboards with frequent live updates → **Next.js / Remix with realtime backends**.
- Auth-first SSR by default → Astro supports SSR but **Next.js / Remix** have stronger stories.
- Heavy SPA interactivity everywhere → you don't want islands fighting each other; pick a single-framework SSR framework.
