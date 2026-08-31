# Suri's Blog

Astro static blog, deployed at **https://blog.suri.world** as its own Vercel
project. Lives in this repo under `blog/` so the main site and the blog
version together; they deploy independently.

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
- The filename becomes the URL: `my-new-post.md` -> `/posts/my-new-post/`.

## Privacy

The repo is private. Raw markdown only ever lives in the repo; the static
build ships rendered HTML, so `.md` sources are never downloadable from the
site.

## Run locally

```bash
cd blog
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Deploy (one-time Vercel setup)

1. Vercel dashboard -> **Add New Project** -> import `SuriXing/SuriWorld`.
2. **Root Directory**: `blog` (Framework auto-detects Astro).
3. After first deploy: **Settings -> Domains** -> add `blog.suri.world`
   (the DNS CNAME is already pointed at Vercel).
4. Pushes to `main` that touch `blog/` redeploy the blog automatically.

The main site keeps a `/blog` redirect to this domain, so old links keep
working.
