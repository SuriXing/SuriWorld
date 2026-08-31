// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Built as part of the main suri.world Vercel project: the root
// `npm run build:all` merges this build into dist/blog/. base must
// match that merge target, and internal links in pages carry /blog.
export default defineConfig({
  site: 'https://suri.world',
  base: '/blog',
  integrations: [sitemap()],
});
