import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

const clubClasses = defineCollection({
	// Load MDX files in the `src/content/club-classes/` directory. MDX is required
	// so lessons can import `<Math>` and `<CodeBlock>` and embed JS-driven
	// string constants (`const kadaneCode = ...`) inside the body.
	loader: glob({
		base: './src/content/club-classes',
		pattern: '**/*.{md,mdx}',
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		// Difficulty matches the `.club-problem-difficulty.<value>` CSS
		// variants in `src/styles/club-classes.css`.
		difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
		// `true` hides the entry from the index and 404s its direct URL.
		// Filter at the `getCollection()` boundary, not in templates, so
		// drafts never leak into any future sitemap/RSS listing.
		draft: z.boolean().default(false),
		// Manual ordering for the index. Defaults to 0 so unnumbered stubs
		// sort together (and then alphabetically by title) until curated.
		order: z.number().default(0),
	}),
});

export const collections = { blog, clubClasses };
