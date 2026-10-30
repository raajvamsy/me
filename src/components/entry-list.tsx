import Link from "next/link";
import type { Entry } from "@/lib/content";

export function EntryList({ entries, base }: { entries: Entry[]; base: string }) {
  return (
    <div className="rows">
      {entries.map((entry) => (
        <Link key={entry.slug} href={`${base}/${entry.slug}`}>
          {entry.date && <span className="label">{entry.date}</span>}
          <h3>{entry.title}</h3>
          <p>{entry.summary}</p>
        </Link>
      ))}
    </div>
  );
}
