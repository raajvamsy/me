import type { ReactNode } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import {
  alsoWork,
  earlier,
  employers,
  featured,
  impact,
  products,
  researchBlurbs,
  researchResults,
  roles,
  sideWork,
  skills,
} from "@/lib/profile";
import { getResearchLines } from "@/lib/research";
import { site } from "@/lib/site";

function SectionHead({
  id,
  eyebrow,
  title,
  lead,
  action,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 id={id}>{title}</h2>
        {lead && <p>{lead}</p>}
      </div>
      {action}
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

export default function Home() {
  const lines = getResearchLines();
  const writeUps = lines.reduce((total, line) => total + line.branches.length, 0);

  return (
    <>
      {/* Hero: role, one line, and the proof beside it. */}
      <section className="hero" aria-labelledby="intro">
        <div className="dots" aria-hidden="true" />
        <div className="wrap">
          <div className="hero-copy">
            <span className="badge">
              <span className="dot" />
              Principal Engineer · WaveMaker · Hyderabad
            </span>
            <h1 id="intro">
              I build developer platforms <span>and ship AI products.</span>
            </h1>
            <p className="hero-sub">
              I own the React Native developer stack at WaveMaker: CLI, build pipeline, Expo
              integration and web preview. On my own I launched MemoryLayer and ChefQuest, and
              research learning systems.
            </p>
            <div className="cta-row">
              <Link href="#work" className="btn btn-primary">
                View selected work
                <Icon name="arrow" />
              </Link>
              <a href="/resume.pdf" className="btn btn-secondary">
                <Icon name="download" />
                Download resume
              </a>
              <a href={site.github} className="btn btn-secondary btn-icon" aria-label="GitHub">
                <Icon name="github" />
              </a>
              <a href={site.linkedin} className="btn btn-secondary btn-icon" aria-label="LinkedIn">
                <Icon name="linkedin" />
              </a>
            </div>
          </div>

          <aside className="card impact" aria-label="At a glance">
            <div className="impact-head">
              <div className="avatar" aria-hidden="true">
                RV
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{site.name}</div>
                <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                  Principal Engineer, WaveMaker
                </div>
              </div>
              <a href={`mailto:${site.email}`} className="btn btn-secondary btn-sm">
                <Icon name="mail" />
                Email
              </a>
            </div>
            <div className="impact-grid">
              {impact.map((item) => (
                <div key={item.label}>
                  <b>{item.value}</b>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="impact-foot">
              <span>Measured on WaveMaker platform work</span>
              <span className="mono">Since 2017</span>
            </div>
          </aside>
        </div>
      </section>

      <div className="wrap section">
        <div className="career-strip">
          <span className="label">Where I&apos;ve worked</span>
          {employers.map((name) => (
            <strong key={name}>{name}</strong>
          ))}
          <span className="note">+ independent clients, 2017–2022</span>
        </div>
      </div>

      {/* Work */}
      <section id="work" className="wrap section" aria-labelledby="work-title">
        <SectionHead
          id="work-title"
          eyebrow="Selected work"
          title="Platform engineering at WaveMaker"
          lead="Each case study covers the problem, what changed, the measured result and what I learned."
          action={
            <Link href="/work" className="link">
              All case studies
              <Icon name="arrow" />
            </Link>
          }
        />
        <div className="bento">
          <Link href={featured.href} className="card bento-main">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.image} alt="" />
            <div className="body">
              <div className="chips">
                <span className="badge badge-accent">Featured</span>
                <span className="badge">Applied AI</span>
              </div>
              <h3>{featured.title}</h3>
              <p>{featured.summary}</p>
              <div className="metric-row">
                {featured.metrics.map((metric) => (
                  <Metric key={metric.label} {...metric} />
                ))}
                <span className="link" style={{ marginLeft: "auto" }}>
                  Read case study
                  <Icon name="arrow" />
                </span>
              </div>
            </div>
          </Link>

          <div className="bento-side">
            {sideWork.map((item) => (
              <Link key={item.href} href={item.href} className="card hcard">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="" loading="lazy" />
                <div className="body">
                  <span className="badge" style={{ alignSelf: "flex-start" }}>
                    {item.badge}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <div className="foot">
                    {item.metrics.map((metric) => (
                      <Metric key={metric.label} {...metric} />
                    ))}
                    {item.tags.length > 0 && (
                      <div className="chips">
                        {item.tags.map((tag) => (
                          <span key={tag} className="chip">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="row-3">
          {alsoWork.map((item) => (
            <Link key={item.href} href={item.href} className="card mini">
              <header>
                <span className="icon-tile sm">
                  <Icon name={item.icon as IconName} />
                </span>
                <h3>{item.title}</h3>
              </header>
              <p>{item.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="wrap section" aria-labelledby="experience-title">
        <SectionHead
          id="experience-title"
          eyebrow="Experience"
          title="From freelance tools to platform ownership"
          lead="Shipping software since 2017."
          action={
            <a href="/resume.pdf" className="btn btn-secondary">
              <Icon name="download" />
              Full resume (PDF)
            </a>
          }
        />
        <div className="card company">
          <div className="company-meta">
            <div className="company-logo" aria-hidden="true">
              W
            </div>
            <h3>WaveMaker</h3>
            <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>
              Hyderabad · Low-code platform
            </p>
            <p className="dates" style={{ marginTop: 12 }}>
              May 2022 – Present
            </p>
            <span className="badge badge-accent" style={{ marginTop: 16 }}>
              Promoted 2025
            </span>
          </div>
          <ol className="timeline">
            {roles.map((role) => (
              <li key={role.title} className={role.current ? "current" : undefined}>
                <div className="role-head">
                  <h4>
                    {role.title}
                    {role.current && <span className="badge badge-success">Current</span>}
                  </h4>
                  <span className="dates">{role.dates}</span>
                </div>
                <ul className="bullets">
                  {role.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
        <div className="card earlier">
          <h3 className="earlier-title">Earlier</h3>
          {earlier.map((job) => (
            <div key={job.dates} className="earlier-row">
              <span className="dates">{job.dates}</span>
              <strong>{job.title}</strong>
              <span>{job.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="wrap section" aria-labelledby="products-title">
        <SectionHead
          id="products-title"
          eyebrow="Products"
          title="Built and launched on my own"
          lead="Architecture, implementation, release engineering and go-to-market."
        />
        <div className="bento">
          <article className="card product-feature">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/work/memorylayer.webp" alt="" loading="lazy" />
            <div className="body">
              <span className="badge badge-success" style={{ alignSelf: "flex-start" }}>
                <span className="dot" />
                Live since May 2026
              </span>
              <h3>MemoryLayer</h3>
              <p className="muted" style={{ marginTop: 8, fontSize: 14 }}>
                Local-first, MCP-native persistent memory for AI agents. Built and launched solo.
              </p>
              <ul className="checks">
                {[
                  "Hybrid vector and BM25 retrieval",
                  "Z3 verification catches behavioural drift",
                  "On npm and the official MCP Registry",
                ].map((point) => (
                  <li key={point}>
                    <Icon name="check" strokeWidth={2.4} />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="product-actions">
                <a href="https://memorylayer.in" className="btn btn-secondary btn-sm">
                  memorylayer.in
                  <Icon name="external" size={14} />
                </a>
                <Link href="/work/memorylayer" className="btn btn-secondary btn-sm">
                  Case study
                </Link>
              </div>
            </div>
          </article>
          <div className="bento-side">
            {products.map((product) => (
              <a key={product.name} href={product.href} className="card product card-link">
                <header>
                  <div>
                    <span className="icon-tile">
                      <Icon name={product.icon} size={18} />
                    </span>
                    <div>
                      <h3>{product.name}</h3>
                      <div className="mono muted" style={{ fontSize: 12 }}>
                        {product.domain}
                      </div>
                    </div>
                  </div>
                  <span className="badge">{product.badge}</span>
                </header>
                <p>{product.summary}</p>
                <div className="chips">
                  {product.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Research */}
      <section id="research" className="wrap section" aria-labelledby="research-title">
        <SectionHead
          id="research-title"
          eyebrow="Independent research"
          title="Learning systems and compression"
          lead={`${lines.length} lines of inquiry and ${writeUps} write-ups, with failures recorded next to results.`}
          action={
            <Link href="/research" className="link">
              All research
              <Icon name="arrow" />
            </Link>
          }
        />
        <div className="results">
          {researchResults.map((result) => (
            <div key={result.source} className="card result">
              <b>{result.value}</b>
              <span>{result.label}</span>
              <small>{result.source}</small>
            </div>
          ))}
        </div>
        <div className="lines">
          {lines.map((line, index) => (
            <Link key={line.line} href={`/research/${line.line}`} className="card line-card">
              <header>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className="badge">{line.branches.length}</span>
              </header>
              <h3>{line.title}</h3>
              <p>{researchBlurbs[line.line] ?? line.summary}</p>
            </Link>
          ))}
          <Link href="/research" className="card line-card all">
            <span className="link">
              Browse all {writeUps} write-ups
              <Icon name="arrow" />
            </span>
          </Link>
        </div>
      </section>

      {/* Skills */}
      <section className="wrap section" aria-labelledby="skills-title">
        <SectionHead id="skills-title" eyebrow="Skills" title="Tools I work with" />
        <dl className="card skills">
          {skills.map(([group, items]) => (
            <div key={group}>
              <dt>{group}</dt>
              <dd className="chips">
                {items.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Contact */}
      <section id="contact" className="wrap section" aria-labelledby="contact-title">
        <div className="card contact">
          <div className="contact-intro">
            <div className="eyebrow">Contact</div>
            <h2 id="contact-title">Let&apos;s talk.</h2>
            <p>Questions about my work, or a role you think fits? Email is the fastest way to reach me.</p>
            <a href={`mailto:${site.email}`} className="btn btn-primary">
              <Icon name="mail" />
              Send an email
            </a>
          </div>
          <div className="contact-rows">
            {[
              { href: `mailto:${site.email}`, icon: "mail", label: "Email", value: site.email },
              { href: site.linkedin, icon: "linkedin", label: "LinkedIn", value: "in/raajvamsy" },
              { href: site.github, icon: "github", label: "GitHub", value: "raajvamsy" },
              { href: "/resume.pdf", icon: "download", label: "Resume", value: "Download PDF" },
            ].map((row) => (
              <a key={row.label} href={row.href} className="contact-row">
                <span className="icon-tile sm" style={{ color: "var(--ink)" }}>
                  <Icon name={row.icon as IconName} />
                </span>
                <div>
                  <small>{row.label}</small>
                  <strong>{row.value}</strong>
                </div>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
