# Suri's Blog

Astro static blog served at **https://suri.world/blog**. It builds as part
of the main Vercel project: the root build command (`npm run build:all`)
builds this site and merges its output into `dist/blog/`. No separate
Vercel project or domain is needed.

## Writing a post

Add a markdown file to `src/content/blog/`:

```markdown
---
title: "My new post"
date: 2025-06-01
category: Journal
---

Body text here.
```

- `date` accepts `YYYY-MM-DD`.
- Set `draft: true` to keep a post out of the index, RSS, and build.
- The filename becomes the URL: `my-new-post.md` ->
  `/blog/posts/my-new-post/`.

## Privacy

The repo is private. Raw markdown only ever lives in the repo; the static
build ships rendered HTML, so `.md` sources are never downloadable from
the site.

## Run locally

```bash
# Blog only, with hot reload (served under the /blog base path):
cd blog
npm install
npm run dev      # http://localhost:4321/blog/

# Full site + blog merged, exactly like production (from the repo root):
npm run build:all
npm run preview  # http://localhost:4173, blog at /blog
```

## Deploy

Nothing extra: the blog ships with every deploy of the main `suri.world`
Vercel project. The `blog.suri.world` DNS record is unused by this setup
and can be removed.
