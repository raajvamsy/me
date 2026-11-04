import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Compare } from "@/components/compare";
import { KabirReplay } from "@/components/kabir-replay";
import { PageMedia } from "@/components/media";
import { Sample } from "@/components/sample";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Headings can hold inline code, so ids are built from their text and not their markup.
const textOf = (node: ReactNode): string => {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
};

type Parent = ReactElement<{ children?: ReactNode }>;
const elements = (node: ReactNode) => Children.toArray(node).filter(isValidElement) as Parent[];

// Phones stack each row, so every cell carries its column name to show beside the value.
function LabelledTable({ children, ...props }: ComponentProps<"table">) {
  const sections = elements(children);
  const headerRow = elements(sections[0]?.props.children)[0];
  const labels = elements(headerRow?.props.children).map((cell) => textOf(cell.props.children));

  const labelled = sections.map((section, index) =>
    index === 0
      ? section
      : cloneElement(
          section,
          {},
          elements(section.props.children).map((row) =>
            cloneElement(
              row,
              {},
              elements(row.props.children).map((cell, column) =>
                cloneElement(
                  cell as ReactElement<Record<string, unknown>>,
                  { "data-label": labels[column] },
                  // One wrapper keeps mixed text and bold together in the stacked layout.
                  <span>{cell.props.children}</span>,
                ),
              ),
            ),
          ),
        ),
  );

  return (
    <div className="table-scroll">
      <table {...props}>{labelled}</table>
    </div>
  );
}

const components = {
  Compare,
  KabirReplay,
  Sample,
  table: LabelledTable,
  h2: ({ children }: ComponentProps<"h2">) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  img: ({ alt, src }: ComponentProps<"img">) => (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? ""} loading="lazy" />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  ),
  // A figure cannot sit inside a paragraph, and Markdown wraps lone images in one.
  p: ({ children, ...props }: ComponentProps<"p">) => {
    const only = Array.isArray(children) ? null : children;
    if (only && typeof only === "object" && "props" in only && "src" in (only.props as object)) {
      return <>{children}</>;
    }
    return <p {...props}>{children}</p>;
  },
};

export function Prose({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}

export function EntryPage({
  title,
  summary,
  body,
  crumbs,
  badges = [],
  details = [],
  stack = [],
  prev,
  next,
  media,
}: {
  title: string;
  summary: string;
  body: string;
  crumbs: ReactNode;
  badges?: string[];
  details?: { label: string; value: ReactNode }[];
  stack?: string[];
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
  media?: string;
}) {
  const headings = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1].replaceAll("`", ""));
  const hasDetails = details.length > 0 || stack.length > 0;

  return (
    <article className="wrap">
      <header className="entry-head">
        <nav aria-label="Breadcrumb" className="crumbs">
          {crumbs}
        </nav>
        <div className="row">
          <div>
            {badges.length > 0 && (
              <div className="chips">
                {badges.map((badge) => (
                  <span key={badge} className={badge === "Draft" ? "badge draft-flag" : "badge"}>
                    {badge}
                  </span>
                ))}
              </div>
            )}
            <h1>{title}</h1>
            <p className="lede">{summary}</p>
          </div>
          {hasDetails && (
            <aside className="card details">
              <h2>Details</h2>
              <dl>
                {details.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
                {stack.length > 0 && (
                  <div className="stack">
                    <dt>Stack</dt>
                    <dd className="chips">
                      {stack.map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </aside>
          )}
        </div>
      </header>
      <div className="entry-grid">
        {headings.length > 1 && (
          <nav className="toc" aria-label="On this page">
            <h2>On this page</h2>
            <ol>
              {headings.map((heading) => (
                <li key={heading}>
                  <a href={`#${slugify(heading)}`}>{heading}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="entry-main">
          {media && <PageMedia base={media} title={title} />}
          <Prose source={body} />
          {(prev || next) && (
            <nav className="pager" aria-label="More pages">
              {prev && (
                <Link href={prev.href} className="card">
                  <small>← Previous</small>
                  <strong>{prev.title}</strong>
                </Link>
              )}
              {next && (
                <Link href={next.href} className="card" style={{ textAlign: "right" }}>
                  <small>Next →</small>
                  <strong>{next.title}</strong>
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </article>
  );
}
