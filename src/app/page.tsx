import Link from "next/link";
import { WorkGrid } from "@/components/work-grid";
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

const pick = (slugs: string[]) => {
  const all = getEntries("work");
  return slugs.map((s) => all.find((e) => e.slug === s)).filter((e): e is Entry => !!e);
};

export default function Home() {
  const engineering = pick(["web-preview", "build-observability", "platform"]);
  const more = pick(["memorylayer", "organism", "compression"]);

  return (
    <div className="wrap">
      <section className="hero">
        <p className="eyebrow">Principal Engineer · Hyderabad, India</p>
        <h1>
          I build developer platforms that teams rely on, and ship AI products on my own.
        </h1>
        <p className="hero-sub">
          {site.name}. Principal Engineer at WaveMaker, owning the React Native build and preview
          stack. Outside work I launched MemoryLayer and run independent research on learning
          systems.
        </p>
        <div className="cta-row">
          <a className="btn primary" href="/resume.pdf">
            Download resume
          </a>
          <a className="btn" href={`mailto:${site.email}`}>
            Email me
          </a>
          <a className="btn" href={site.linkedin}>
            LinkedIn
          </a>
          <a className="btn" href={site.github}>
            GitHub
          </a>
        </div>
      </section>

      <section className="impact" aria-label="Impact">
        {impact.map(([value, label, where]) => (
          <div key={label}>
            <b>{value}</b>
            <span>{label}</span>
            <i>{where}</i>
          </div>
        ))}
      </section>

      <section id="experience" className="block">
        <div className="section-head">
          <h2>Experience</h2>
          <a href="/resume.pdf">Full resume →</a>
        </div>
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
      </section>

      <section id="work" className="block">
        <div className="section-head">
          <h2>Engineering at WaveMaker</h2>
          <Link href="/work">All work →</Link>
        </div>
        <WorkGrid entries={engineering} />
      </section>

      <section className="block">
        <div className="section-head">
          <h2>Products and research</h2>
          <Link href="/research">All research →</Link>
        </div>
        <WorkGrid entries={more} />
      </section>

      <section className="contact-band">
        <h2>Hiring, or want to talk shop?</h2>
        <p>Email is the fastest way to reach me.</p>
        <div className="cta-row">
          <a className="btn primary" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a className="btn" href="/resume.pdf">
            Resume (PDF)
          </a>
        </div>
      </section>
    </div>
  );
}
