import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EntryList } from "@/components/entry-list";
import { EntryPage } from "@/components/entry-page";
import { WorkGrid } from "@/components/work-grid";
import { getEntries, getEntry, type Collection } from "./content";

// Each section is one line of config, so adding a new section stays cheap.
export function collectionRoutes(collection: Collection, title: string, heading: string, intro: string) {
  const base = `/${collection}`;

  return {
    listMetadata: { title } satisfies Metadata,

    ListPage() {
      const entries = getEntries(collection);
      if (entries.length === 0) notFound();
      return (
        <div className="wrap">
          <header className="page-head">
            <div className="eyebrow">{title}</div>
            <h1>{heading}</h1>
            <p>{intro}</p>
          </header>
          {collection === "work" ? (
            <WorkGrid entries={entries} />
          ) : (
            <EntryList entries={entries} base={base} />
          )}
        </div>
      );
    },

    generateStaticParams() {
      // Cache Components requires at least one param, so an empty section gets a slug that 404s.
      const slugs = getEntries(collection).map(({ slug }) => ({ slug }));
      return slugs.length > 0 ? slugs : [{ slug: "none" }];
    },

    async generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
      const { slug } = await params;
      const entry = getEntry(collection, slug);
      return entry ? { title: entry.title, description: entry.summary } : {};
    },

    async EntryRoute({ params }: { params: Promise<{ slug: string }> }) {
      const { slug } = await params;
      const entries = getEntries(collection);
      const index = entries.findIndex((entry) => entry.slug === slug);
      if (index < 0) notFound();
      const entry = entries[index];
      const prev = entries[index - 1];
      const next = entries[index + 1];
      return (
        <EntryPage
          title={entry.title}
          summary={entry.summary}
          body={entry.body}
          media={`${collection}/${entry.slug}`}
          crumbs={
            <>
              <Link href={base}>{title}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{entry.title}</span>
            </>
          }
          badges={[entry.kind, ...(entry.draft ? ["Draft"] : [])]}
          details={[
            { label: "Type", value: entry.kind },
            ...(entry.date ? [{ label: "Date", value: entry.date }] : []),
          ]}
          stack={entry.tags}
          prev={prev && { href: `${base}/${prev.slug}`, title: prev.title }}
          next={next && { href: `${base}/${next.slug}`, title: next.title }}
        />
      );
    },
  };
}

export const work = collectionRoutes(
  "work",
  "Work",
  "Case studies and products",
  "Platform engineering, products and research. Each covers the problem, what changed, the measured result and what failed.",
);
export const blog = collectionRoutes("blog", "Writing", "Notes and essays", "Notes and essays.");
export const docs = collectionRoutes("docs", "Docs", "Reference notes", "Reference notes.");
