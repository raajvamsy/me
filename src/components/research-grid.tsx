import Link from "next/link";
import { hasMedia } from "@/components/media";
import type { ResearchPage } from "@/lib/research";

const sizes = ["t-wide", "", "", "t-wide", "t-half", "t-half"];

export function PageHero({
  title,
  eyebrow,
  summary,
  stats,
}: {
  title: string;
  eyebrow: React.ReactNode;
  summary: string;
  stats: { value: string; label: string }[];
}) {
  return (
    <>
      <section className="hero">
        <div className="label hero-eyebrow">{eyebrow}</div>
        <h1 className="hero-page-title">{title}</h1>
        <div className="hero-foot">
          <div />
          <p>{summary}</p>
        </div>
      </section>
      <section className="stats-strip" aria-label="Key numbers">
        {stats.map(({ value, label }) => (
          <div key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </section>
    </>
  );
}

export function ResearchGrid({ pages }: { pages: (ResearchPage & { href: string; tag: string })[] }) {
  return (
    <div className="bento">
      {pages.map((page, index) => {
        const image = `/img/research/${page.line}/${page.slug}.webp`;
        return (
          <Link key={page.href} href={page.href} className={`tile ${sizes[index % sizes.length]}`}>
            <div className="tile-top label">
              <span>
                <b>{String(index + 1).padStart(2, "0")}</b> / {page.tag}
              </span>
            </div>
            {hasMedia(image) ? (
              <div className="tile-visual flush">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="" loading="lazy" />
              </div>
            ) : (
              <div className="tile-visual">
                <div className="big-metric">
                  <b>{page.metric}</b>
                  <span>{page.metricLabel}</span>
                </div>
              </div>
            )}
            <div className="tile-body">
              <h3>{page.title}</h3>
              <p>{page.summary}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
