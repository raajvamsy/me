import Link from "next/link";
import { Icon } from "@/components/icons";
import { hasMedia } from "@/components/media";
import type { Entry } from "@/lib/content";

// Shown when a project has no illustration yet.
const metrics: Record<string, [string, string]> = {
  compression: ["4.92%", "smaller than JPEG XL effort 9 on 4K photos"],
  "web-preview": ["7×", "faster repeat builds"],
  products: ["3", "products built"],
};

export function WorkGrid({ entries }: { entries: Entry[] }) {
  return (
    <div className="grid">
      {entries.map((entry) => {
        const image = `/img/work/${entry.slug}.webp`;
        const metric = metrics[entry.slug];
        return (
          <Link key={entry.slug} href={`/work/${entry.slug}`} className="card tile">
            {hasMedia(image) ? (
              <div className="tile-visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="" loading="lazy" />
              </div>
            ) : (
              metric && (
                <div className="tile-visual metric-visual">
                  <b>{metric[0]}</b>
                  <span>{metric[1]}</span>
                </div>
              )
            )}
            <div className="tile-body">
              <div className="chips">
                <span className="badge">{entry.kind}</span>
                {entry.draft && <span className="badge draft-flag">Draft</span>}
              </div>
              <h3>{entry.title}</h3>
              <p>{entry.proof ?? entry.summary}</p>
              {entry.tags.length > 0 && (
                <div className="chips">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <span className="link">
                Read case study
                <Icon name="arrow" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
