// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed as its own Vercel project rooted at this directory, served at
// https://blog.suri.world. The main site's /blog redirect points here.
export default defineConfig({
  site: 'https://blog.suri.world',
  integrations: [sitemap()],
});
