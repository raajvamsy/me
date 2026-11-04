import Link from "next/link";
import { getEntries, type Entry } from "@/lib/content";
import { site } from "@/lib/site";

const impact = [
  ["7×", "faster repeat builds, with nearly half the peak memory", "Web preview"],
  ["~150×", "faster bug turnaround from an agentic ticket-to-repro pipeline", "Agentic engineering"],
  ["3.5×", "faster live reload on the same preview pipeline", "Web preview"],
  ["1", "product built and launched solo: on npm and the MCP registry", "MemoryLayer"],
];

const roles = [
  {
    title: "Principal Engineer",
    org: "WaveMaker",
    when: "Apr 2025 – now",
    text: "Owns the React Native developer stack: CLI, build pipeline, Expo integration and web preview. Built the image-to-code, build observability and agentic engineering pipelines.",
  },
  {
    title: "Senior Software Development Engineer",
    org: "WaveMaker",
    when: "May 2022 – Apr 2025",
    text: "Founding engineer of the React Native platform team. Built the codebase from inception and set the code review and integration bar.",
  },
  {
    title: "Software Developer",
    org: "Pramati Technologies (WaveMaker)",
    when: "Apr 2019 – Nov 2020",
    text: "Built mobile and web apps for enterprise customers on the low-code platform, and extended its Java-based IDE.",
  },
];

const skills = [
  ["Platform", "React Native, Expo, Next.js, TypeScript, build systems, CLIs"],
  ["Applied AI", "LLM agents, MCP, RAG, evaluation, formal verification (Z3)"],
  ["Backend", "Python, Java, Spring Boot, FastAPI, Supabase, PostgreSQL"],
];

const ticker = [
  "React Native", "Expo", "TypeScript", "Next.js", "MCP", "Python", "Java", "Spring Boot",
  "Supabase", "PostgreSQL", "Z3", "RAG", "Docker", "Elasticsearch",
];

const principles = [
  ["Measure first", "The slow bundler turned out to be a memory limit. I profile before I optimise."],
  ["Verify end to end", "Migrations are checked by running real generated apps, and screenshots by re-rendering them."],
  ["Show the failures", "Research pages list the failed attempts next to the results."],
  ["Ship it", "MemoryLayer was built and launched solo, and it is live on npm and the MCP registry."],
];

// Feature cards: a repeating 7/5, 5/7, 6/6 rhythm.
const featured: [string, string][] = [
  ["web-preview", "s7"],
  ["build-observability", "s5"],
  ["platform", "s5"],
  ["memorylayer", "s7"],
  ["organism", ""],
  ["compression", ""],
];

export default function Home() {
  const all = getEntries("work");
  const cards = featured
    .map(([slug, span]) => ({ entry: all.find((e) => e.slug === slug), span }))
    .filter((c): c is { entry: Entry; span: string } => !!c.entry);

  return (
    <>
      <section className="hero-band">
        <div className="hero-copy">
          <p className="eyebrow">Principal Engineer · Hyderabad, India</p>
          <h1>
            From developer platforms to <em>working AI products.</em>
          </h1>
          <p className="hero-sub">
            I&apos;m {site.name}. At WaveMaker I own the React Native build and preview stack. On
            my own I launched MemoryLayer and run independent research on learning systems.
          </p>
          <div className="cta-row">
            <a className="btn light" href="/resume.pdf">
              Download resume ↓
            </a>
            <a className="btn ghost" href={`mailto:${site.email}`}>
              Email me
            </a>
            <a className="btn ghost" href={site.linkedin}>
              LinkedIn
            </a>
            <a className="btn ghost" href={site.github}>
              GitHub
            </a>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="impact" aria-label="Impact">
          {impact.map(([value, label, where]) => (
            <div key={label}>
              <b>{value}</b>
              <span>{label}</span>
              <i>{where}</i>
            </div>
          ))}
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...ticker, ...ticker].map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>

        <section id="work" className="block">
          <div className="section-row section-head">
            <div>
              <p className="label">Selected work</p>
              <h2>Platforms, products and research.</h2>
            </div>
            <Link href="/work" className="more">
              All work →
            </Link>
          </div>
          <div className="feature-grid">
            {cards.map(({ entry, span }) => (
              <Link key={entry.slug} href={`/work/${entry.slug}`} className={`feature ${span}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/img/work/${entry.slug}.webp`} alt="" loading="lazy" />
                <span className="pill">{entry.kind}</span>
                <span className="go" aria-hidden="true">
                  →
                </span>
                <h3>{entry.title}</h3>
                <p>{entry.proof ?? entry.summary}</p>
                {entry.tags.length > 0 && (
                  <ul className="tags">
                    {entry.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
              </Link>
            ))}
          </div>
        </section>

        <section id="experience" className="block">
          <div className="split">
            <div className="section-head">
              <p className="label">Experience</p>
              <h2>From founding engineer to principal.</h2>
              <p>I joined the React Native platform team at its start and have owned its developer stack since.</p>
              <a className="btn" href="/resume.pdf">
                Full resume ↓
              </a>
            </div>
            <div>
              <ol className="roles">
                {roles.map((r) => (
                  <li key={r.title}>
                    <span className="label">{r.when}</span>
                    <div>
                      <h3>
                        {r.title} <small>{r.org}</small>
                      </h3>
                      <p>{r.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <dl className="skills">
                {skills.map(([k, v]) => (
                  <div key={k}>
                    <dt className="label">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="block">
          <div className="section-head">
            <p className="label">How I work</p>
            <h2>Habits that show up in the results.</h2>
          </div>
          <ol className="principles">
            {principles.map(([title, text], i) => (
              <li key={title}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="contact-band">
          <p className="label kicker">Contact</p>
          <h2>Hiring, or want to talk shop?</h2>
          <p>Email is the fastest way to reach me.</p>
          <div className="cta-row">
            <a className="btn primary" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <a className="btn" href="/resume.pdf">
              Resume (PDF)
            </a>
            <a className="btn" href={site.linkedin}>
              LinkedIn
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
