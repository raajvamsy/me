import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EntryPage } from "@/components/entry-page";
import { getResearchLine, getResearchLines } from "@/lib/research";

type Props = { params: Promise<{ line: string; branch: string }> };

export function generateStaticParams() {
  return getResearchLines().flatMap(({ line, branches }) =>
    branches.map(({ slug }) => ({ line, branch: slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { line, branch } = await params;
  const page = getResearchLine(line)?.branches.find(({ slug }) => slug === branch);
  return page ? { title: page.title, description: page.summary } : {};
}

export default async function ResearchBranchPage({ params }: Props) {
  const { line: lineSlug, branch: branchSlug } = await params;
  const line = getResearchLine(lineSlug);
  const index = line?.branches.findIndex(({ slug }) => slug === branchSlug) ?? -1;
  if (!line || index < 0) notFound();

  const page = line.branches[index];
  const next = line.branches[index + 1];

  return (
    <EntryPage
      title={page.title}
      summary={page.summary}
      body={page.body}
      media={`research/${line.line}/${page.slug}`}
      eyebrow={
        <>
          <Link href="/research">Research</Link> / <Link href={`/research/${line.line}`}>{line.title}</Link>
          <br />
          <b>{page.branch}</b>
          {page.period && ` / ${page.period}`}
          {page.commits !== undefined && ` / ${page.commits} commits`}
        </>
      }
      next={next && { href: `/research/${line.line}/${next.slug}`, title: next.title }}
    />
  );
}
