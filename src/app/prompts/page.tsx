import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyPrompt } from "@/components/copy-prompt";
import { getEntries } from "@/lib/content";
import { getResearchLines } from "@/lib/research";

export const metadata: Metadata = { title: "Image prompts", robots: { index: false } };

const style =
  "Style: premium 3D editorial illustration with a cinematic look, on a near-black background (#0d0d0b), with one signal-orange accent (#ff5a26) and warm off-white highlights. Clean composition with generous negative space, soft studio lighting and fine material detail. Wide 16:9 landscape. Absolutely no text, letters, numbers, logos or watermarks anywhere in the image.";

// A working tool for producing images: it exists in development and never ships.
export default function PromptsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const research = getResearchLines().flatMap((line) => [
    { group: line.title, title: `${line.title}: overview`, prompt: line.imagePrompt, path: `public/img/research/${line.line}/index.webp` },
    ...line.branches.map((branch) => ({
      group: line.title,
      title: branch.title,
      prompt: branch.imagePrompt,
      path: `public/img/research/${line.line}/${branch.slug}.webp`,
    })),
  ]);
  const work = getEntries("work").map((entry) => ({
    group: "Work and products",
    title: entry.title,
    prompt: entry.imagePrompt ?? "",
    path: `public/img/work/${entry.slug}.webp`,
  }));
  const items = [...research, ...work];

  return (
    <div className="wrap">
      <header className="page-head">
        <h1>Image prompts</h1>
        <p>
          One complete prompt for each page. Copy it, generate the image, and save it at the path
          shown. This page exists only in development.
        </p>
      </header>
      <div className="prompt-list">
        {items.map((item) => (
          <section key={item.path}>
            <span className="label">{item.group}</span>
            <h2>{item.title}</h2>
            <p className="prompt-text">{`${item.prompt} ${style}`}</p>
            <CopyPrompt text={`${item.prompt} ${style}`} />
            <code>{item.path}</code>
          </section>
        ))}
      </div>
    </div>
  );
}
