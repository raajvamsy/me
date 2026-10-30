# Raaj Vamsy Rayavarapu: personal site

A Next.js showcase of research and engineering work, written in MDX.

```bash
npm install
npm run dev -- -p 3457
```

## Where things live

| Path | Contents |
|---|---|
| `content/work`, `content/blog`, `content/docs` | One `.mdx` file per page. See `content/README.md` |
| `content/research/<line>/` | `index.mdx` for the line, plus one `.mdx` per branch |
| `public/img`, `public/video` | Page media, found by path: `img/work/<slug>.webp`, `img/research/<line>/<slug>.webp`, and the same under `video/` as `.mp4` |
| `design/image-pipeline/` | Prompt list and save helpers for ChatGPT image generation |

`/prompts` lists a copyable image prompt for every page, in development only.

## Publishing

Set `NEXT_PUBLIC_SITE_URL` to the live address.
