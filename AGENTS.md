# AGENTS.md — Kosmos Hub

Personal site for **Gustavo Valenzuela** (`@gustavovaasc`), deployed at
`https://gustavovaasc.github.io/kosmos-hub`. Three sections, served as static
pages from a single Astro site:

| Section | Route | Status |
| --- | --- | --- |
| Main menu | `/` | Active. Two options: classes, about-me. |
| Competitive programming classes | `/club-classes/` | Active. CPCFI lessons (BST, Kadane) as flat pages. |
| Personal blog | `/blog/` | Scaffolded (collection + 5 template posts) but **not linked from the main menu** and still using template content. |

## Stack

- **Astro 5.16.15** (Bear Blog fork — keep visual changes minimal).
- **TypeScript**, **MDX**, **RSS**, **sitemap** integrations.
- **KaTeX** for math (via `src/components/Math.astro`).
- **sharp** for image processing.
- **GitHub Pages** deploy via `actions/deploy-pages@v4`. `base: '/kosmos-hub'` means every asset path is prefixed in production.

## Commands

```sh
npm run dev          # localhost:4321
npm run build        # → ./dist/
npm run preview      # serve the production build locally
npm run astro ...    # any astro CLI subcommand
```

## Project structure (as it actually is)

```
src/
  assets/              # images used inside .astro components (BlogPost hero, etc.)
  components/
    BaseHead.astro     # head/SEO for every page
    ClubHeader.astro   # header used in club-classes pages
    CodeBlock.astro    # code samples for CP lessons
    Math.astro         # KaTeX wrapper — <Math formula="…" display? />
    Header.astro, Footer.astro, FormattedDate.astro, HeaderLink.astro, MenuOption.astro
  content/
    blog/              # blog content collection (5 Astro-template posts)
  content.config.ts    # blog collection schema (Content Layer glob loader)
  consts.ts            # SITE_TITLE, SITE_DESCRIPTION, base = '/kosmos-hub'
  layouts/
    BlogPost.astro     # layout used by blog posts
  pages/
    index.astro                    # main menu (only 2 options today)
    about.astro                    # English placeholder
    about-me/index.astro           # Spanish placeholder
    blog/
      index.astro                  # blog index
      [...slug].astro              # blog post pages
    club-classes/
      index.astro                  # classes landing
      bst/index.astro              # BST lesson
      kadane/index.astro           # Kadane's algorithm lesson
    rss.xml.js
  scripts/             # client scripts (e.g. portfolio.js)
  styles/              # global + per-section CSS
public/
  favicon.ico          # OG images, favicons, pre-sized assets go here
```

## Sections

### Main menu (`src/pages/index.astro`)

Two `<MenuOption>` components. When the blog is ready, add a third here
linking to `${base}/blog`.

### Competitive programming classes (`/club-classes/`)

- Lessons are **flat pages** under `src/pages/club-classes/<slug>/index.astro`.
  Not a content collection yet — when you have more than a handful of classes,
  migrate to a `club-classes` collection with a Zod schema (mirror the `blog`
  pattern in `src/content.config.ts`). The two existing lessons (`bst/`,
  `kadane/`) need a light refactor to become collection entries.
- Each lesson uses `<CodeBlock>` for code samples and `<Math>` for formulas.
- Custom styles in `src/styles/club-classes.css`.
- **CPCFI** is the brand for Gustavo's competitive programming classes — keep
  the name consistent when writing copy.

### Blog (`/blog/`)

- Backed by the `blog` collection in `src/content.config.ts`:
  `title`, `description`, `pubDate`, `updatedDate`, `heroImage` (validated by
  `image()` from `astro:content`).
- The five current posts are **Astro starter-kit placeholders** — replace them
  before publishing the blog.
- Filter drafts and future-dated posts in `getCollection()` queries, not in
  templates (so RSS and sitemap stay clean).
- Once real content exists, add a third `<MenuOption>` in `index.astro`.

## Conventions

- **Language**: site UI/copy and git commit messages are in **Spanish**.
  AGENTS.md, code comments, and variable names are in **English**.
  `README.md` is English. Don't mix inside a single artifact.
- **Theme**: Bear Blog fork — small, focused changes. The design intent is the
  point; resist redesigns.
- **Base path**: every URL is prefixed `/kosmos-hub` in production. Use
  `import { base } from '../consts'` (already exported) or
  `import.meta.env.BASE_URL`. **Never hardcode `/about-me` or `/blog` in hrefs.**
- **Math**: use `<Math formula="…" />` from `src/components/Math.astro`, or
  `<Math formula="…" display />` for block math. Don't import KaTeX directly.
- **Images**: use `<Image />` from `astro:assets` for `src/assets/` images
  (responsive sources, explicit dimensions). Put pre-sized assets, OG images,
  and favicons in `public/`.

## Pi agent skills

This repo ships a Pi agent skill at `.pi/skills/astro-frontend/SKILL.md`.
**Load it when working on Astro-specific code** — it covers the Content Layer
API, hydration directives, integrations, view transitions, and the common
pitfalls. In Pi, use `/skill:astro-frontend` to force-load. Project-local
trust must be granted on first interactive session in this directory.

## Out of scope — do not suggest

- **Framework migrations** (Next.js, Remix, SvelteKit). Astro is the right
  tool for this site.
- **SSR, auth, databases**. This is a static site on GitHub Pages.
- **`@astrojs/tailwind`** (deprecated, Tailwind v3 only). Use
  `@tailwindcss/vite` only if styling becomes painful — there's no Tailwind
  here today.

## Common pitfalls specific to this repo

1. **Hardcoded `/...` hrefs** — break under `base: '/kosmos-hub'`. Always go
   through `${base}/...` from `src/consts.ts`.
2. **Filtering drafts in templates** — leaks into RSS/sitemap. Filter in
   `getCollection()`.
3. **Adding new classes as flat pages** — when you cross ~3 classes, migrate
   to a `club-classes` content collection first; flat pages don't scale.
4. **Using `<img>` for images** — use `<Image />` from `astro:assets` so they
   get optimized.
5. **Reusing `BlogPost.astro` for non-blog content** — it's blog-specific
   (expects `pubDate`, `heroImage`). Create a new layout for classes.
6. **Editing the menu without re-checking `MenuOption.astro` props** — the
   menu is data-driven through props (`title`, `description`, `href`,
   `icon`, `colorClass`). Match the existing shape.
