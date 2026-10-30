# Adding content

Add an `.mdx` file to `work/`, `blog/` or `docs/`. The filename is the URL.

```
---
title: "Title"
summary: "One or two sentences."
date: "2026-11-01"   # blog posts
order: 1             # work and docs
draft: true          # shows in npm run dev, hidden in production
---
```

Writing and Docs appear in the navigation once they have a published entry.
Everything here is public once deployed; private notes need authentication first.
