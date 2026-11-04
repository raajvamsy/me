import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Entry } from "./content";

export type Stat = { value: string; label: string };

export type ResearchPage = Entry & {
  line: string;
  branch?: string;
  period?: string;
  commits?: number;
  metric: string;
  metricLabel: string;
  stats: Stat[];
  imagePrompt: string;
};

export type ResearchLine = ResearchPage & { branches: ResearchPage[] };

const root = path.join(process.cwd(), "content/research");

function readPage(line: string, file: string): ResearchPage {
  const { data, content } = matter(fs.readFileSync(path.join(root, line, file), "utf8"));
  return {
    line,
    slug: file.replace(/\.mdx$/, ""),
    title: String(data.title),
    kind: "Research",
    summary: String(data.summary ?? ""),
    order: Number(data.order ?? 100),
    tags: [],
    draft: false,
    body: content,
    branch: data.branch ? String(data.branch) : undefined,
    period: data.period ? String(data.period) : undefined,
    commits: data.commits === undefined ? undefined : Number(data.commits),
    metric: String(data.metric ?? ""),
    metricLabel: String(data.metricLabel ?? ""),
    stats: (data.stats ?? []) as Stat[],
    imagePrompt: String(data.imagePrompt ?? ""),
  };
}

export function getResearchLines(): ResearchLine[] {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map(({ name }) => {
      const files = fs.readdirSync(path.join(root, name)).filter((file) => file.endsWith(".mdx"));
      return {
        ...readPage(name, "index.mdx"),
        branches: files
          .filter((file) => file !== "index.mdx")
          .map((file) => readPage(name, file))
          .sort((a, b) => a.order - b.order),
      };
    })
    .sort((a, b) => a.order - b.order);
}

export const getResearchLine = (slug: string) =>
  getResearchLines().find((line) => line.line === slug);
