import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One markdown file per post. Raw .md lives only in the (private) repo —
// the static build ships rendered HTML, never the sources.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string().default('Journal'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
