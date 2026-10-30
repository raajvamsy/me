import { WorkGrid } from "@/components/work-grid";
import { getEntries } from "@/lib/content";

const stats = [
  ["15/15", "lives where learned behaviour beat a newborn control, on one body"],
  ["4.92%", "smaller than JPEG XL effort 9 on 4K photos, lossless"],
  ["25/27", "test files over 10 KB where FunnelZip beat the best standard tool"],
  ["3", "bodies tested with one learning core: met, partly met, not yet"],
];

export default function Home() {
  return (
    <div className="wrap">
      <section className="hero">
        <h1>
          <span>Raaj Vamsy</span>{" "}
          <span className="last">Rayavarapu</span>
        </h1>
        <div className="hero-foot">
          <div className="label">
            Principal Engineer
            <br />
            Independent researcher
            <br />
            Hyderabad, India
          </div>
          <p>
            I build developer platforms at work and learning systems on my own time. These pages
            show the tests and the failures along with the results.
          </p>
        </div>
      </section>

      <section className="stats-strip" aria-label="Key results">
        {stats.map(([value, label]) => (
          <div key={value}>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <div className="section-head">
        <h2>Selected work</h2>
        <span className="label">Research and engineering</span>
      </div>
      <WorkGrid entries={getEntries("work")} />
    </div>
  );
}
