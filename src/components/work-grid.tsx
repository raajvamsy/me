import type { CSSProperties } from "react";
import Link from "next/link";
import { hasMedia } from "@/components/media";
import type { Entry } from "@/lib/content";

function Visual({ slug }: { slug: string }) {
  const src = `/img/work/${slug}.webp`;
  if (hasMedia(src)) {
    return (
      <div className="tile-visual flush">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" loading="lazy" />
      </div>
    );
  }
  const metrics: Record<string, [string, string]> = {
    compression: ["4.92%", "smaller than JPEG XL effort 9 on 4K photos"],
    "web-preview": ["7×", "faster repeat builds"],
    products: ["4", "products"],
  };
  const metric = metrics[slug];
  if (!metric) return <div className="tile-visual" />;
  return (
    <div className="tile-visual">
      <div className="big-metric">
        <b style={{ "--chars": [...metric[0]].length } as CSSProperties}>{metric[0]}</b>
        <span>{metric[1]}</span>
      </div>
    </div>
  );
}


export function WorkGrid({ entries }: { entries: Entry[] }) {
  return (
    <div className="bento">
      {entries.map((entry, index) => (
        <Link
          key={entry.slug}
          href={`/work/${entry.slug}`}
          className="tile"
        >
          <div className="tile-top label">
            <span>
              <b>{String(index + 1).padStart(2, "0")}</b> / {entry.kind}
            </span>
            {entry.draft && <span className="draft-flag">Draft</span>}
          </div>
          <Visual slug={entry.slug} />
          <div className="tile-body">
            <h3>{entry.title}</h3>
            <p>{entry.proof ?? entry.summary}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
