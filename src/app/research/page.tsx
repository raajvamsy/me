import type { Metadata } from "next";
import { PageHero, ResearchGrid } from "@/components/research-grid";
import { getResearchLines } from "@/lib/research";

export const metadata: Metadata = { title: "Research" };

export default function ResearchLanding() {
  const lines = getResearchLines();
  const branches = lines.reduce((total, line) => total + line.branches.length, 0);
  const commits = lines.reduce((total, line) => total + (line.commits ?? 0), 0);

  return (
    <div className="wrap">
      <PageHero
        title="Research"
        eyebrow="Independent research"
        summary="Every line of inquiry, branch by branch: what each one asked, what it found, and where it stopped."
        stats={[
          { value: String(lines.length), label: "lines of research" },
          { value: String(branches), label: "branches written up, each with its own page" },
          { value: `${commits.toLocaleString("en-US")}+`, label: "commits across these repositories" },
          { value: "1/3", label: "bodies where the organism fully meets its claim so far" },
        ]}
      />
      <div className="section-head">
        <div>
          <div className="eyebrow">Lines of research</div>
          <h2>{lines.length} lines, each with its branches</h2>
        </div>
      </div>
      <ResearchGrid
        pages={lines.map((line) => ({
          ...line,
          href: `/research/${line.line}`,
          tag: `${line.branches.length} ${line.branches.length === 1 ? "branch" : "branches"}`,
        }))}
      />
    </div>
  );
}
