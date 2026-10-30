import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Collection = "work" | "blog" | "docs";

export type Entry = {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  date?: string;
  order: number;
  proof?: string;
  imagePrompt?: string;
  draft: boolean;
  body: string;
};

const root = path.join(process.cwd(), "content");

// Drafts show in `npm run dev` with a label and never reach a production build.
export function getEntries(collection: Collection): Entry[] {
  const dir = path.join(root, collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: String(data.title),
        kind: String(data.kind ?? (collection === "blog" ? "Note" : "Doc")),
        summary: String(data.summary ?? ""),
        date: data.date ? String(data.date) : undefined,
        order: Number(data.order ?? 100),
        proof: data.proof ? String(data.proof) : undefined,
        imagePrompt: data.imagePrompt ? String(data.imagePrompt) : undefined,
        draft: Boolean(data.draft),
        body: content,
      };
    })
    .filter((entry) => !entry.draft || process.env.NODE_ENV !== "production")
    .sort((a, b) =>
      collection === "blog"
        ? (b.date ?? "").localeCompare(a.date ?? "")
        : a.order - b.order,
    );
}

export function getEntry(collection: Collection, slug: string): Entry | undefined {
  return getEntries(collection).find((entry) => entry.slug === slug);
}
