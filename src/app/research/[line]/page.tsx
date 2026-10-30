import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/entry-page";
import { PageMedia } from "@/components/media";
import { PageHero, ResearchGrid } from "@/components/research-grid";
import { getResearchLine, getResearchLines } from "@/lib/research";

type Props = { params: Promise<{ line: string }> };

export function generateStaticParams() {
  return getResearchLines().map(({ line }) => ({ line }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const line = getResearchLine((await params).line);
  return line ? { title: line.title, description: line.summary } : {};
}

export default async function ResearchLinePage({ params }: Props) {
  const line = getResearchLine((await params).line);
  if (!line) notFound();

  return (
    <div className="wrap">
      <PageHero
        title={line.title}
        eyebrow={<Link href="/research">Research</Link>}
        summary={line.summary}
        stats={line.stats}
      />
      <div className="line-intro">
        <PageMedia base={`research/${line.line}/index`} title={line.title} />
        <Prose source={line.body} />
      </div>
      <div className="section-head">
        <h2>Branches</h2>
      </div>
      <ResearchGrid
        pages={line.branches.map((branch) => ({
          ...branch,
          href: `/research/${line.line}/${branch.slug}`,
          tag: branch.period ?? "Branch",
        }))}
      />
    </div>
  );
}
