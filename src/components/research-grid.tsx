import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { hasMedia } from "@/components/media";
import type { ResearchPage } from "@/lib/research";

export function PageHero({
  title,
  eyebrow,
  summary,
  stats,
}: {
  title: string;
  eyebrow: ReactNode;
  summary: string;
  stats: { value: string; label: string }[];
}) {
  return (
    <>
      <header className="page-head">
        <div className="crumbs">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{summary}</p>
      </header>
      {stats.length > 0 && (
        <section className="stat-cards" aria-label="Key numbers">
          {stats.map(({ value, label }) => (
            <div key={label} className="card">
              <b>{value}</b>
              <span>{label}</span>
            </div>
          ))}
        </section>
      )}
    </>
  );
}

export function ResearchGrid({ pages }: { pages: (ResearchPage & { href: string; tag: string })[] }) {
  return (
    <div className="grid">
      {pages.map((page) => {
        const image = `/img/research/${page.line}/${page.slug}.webp`;
        return (
          <Link key={page.href} href={page.href} className="card tile">
            {hasMedia(image) ? (
              <div className="tile-visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="" loading="lazy" />
              </div>
            ) : (
              <div className="tile-visual metric-visual">
                <b>{page.metric}</b>
                <span>{page.metricLabel}</span>
              </div>
            )}
            <div className="tile-body">
              <div className="chips">
                <span className="badge">{page.tag}</span>
              </div>
              <h3>{page.title}</h3>
              <p>{page.summary}</p>
              <span className="link">
                Read more
                <Icon name="arrow" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
