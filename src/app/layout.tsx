import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import { getEntries } from "@/lib/content";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const serif = Instrument_Serif({ subsets: ["latin"], variable: "--font-serif", weight: "400", style: ["normal", "italic"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}, Principal Engineer`, template: `%s / ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: ["/img/research/organism/index.webp"],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const hasWriting = getEntries("blog").length > 0;
  const hasDocs = getEntries("docs").length > 0;

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <nav className="site-nav" aria-label="Main">
          <div className="wrap">
            <Link href="/" className="name">
              Raaj Vamsy
            </Link>
            <div className="nav-links">
              <Link href="/work">Work</Link>
              <Link href="/research">Research</Link>
              {hasWriting && <Link href="/blog">Writing</Link>}
              {hasDocs && <Link href="/docs">Docs</Link>}
              <a href="/resume.pdf">Resume</a>
              <a href={`mailto:${site.email}`} className="nav-cta">
                Contact
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <span>
              <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={site.github}>GitHub</a> · <a href={site.linkedin}>LinkedIn</a> · <a href="/resume.pdf">Resume</a>
            </span>
            <span>Illustrations are AI-generated. Results come from project logs.</span>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
