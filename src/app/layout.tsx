import type { Metadata } from "next";
import { Caveat, Inter, JetBrains_Mono, Protest_Revolution } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import { InkFilters, InkRidge } from "@/components/ink-art";
import { getEntries } from "@/lib/content";
import { site } from "@/lib/site";
import "./globals.css";

const display = Protest_Revolution({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s / ${site.name}` },
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
    <html lang="en" className={`${display.variable} ${hand.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <InkFilters />
        <nav className="site-nav" aria-label="Main">
          <div className="wrap">
            <Link href="/" className="name" aria-label="Raaj Vamsy, home">
              <span aria-hidden="true">RAAJ</span>
              <svg className="logo-v" viewBox="0 0 10 12" aria-hidden="true">
                <polygon points="0,0 2.1,0 6,12 4,12" fill="currentColor" />
                <polygon points="10.5,-1.6 8.4,-1.6 4,12 6,12" fill="var(--accent)" />
              </svg>
              <span aria-hidden="true">AMSY</span>
            </Link>
            <Link href="/work">Work</Link>
            <Link href="/research">Research</Link>
            {hasWriting && <Link href="/blog">Writing</Link>}
            {hasDocs && <Link href="/docs">Docs</Link>}
            <a href="/resume.pdf">Resume</a>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="site-footer">
          <InkRidge />
          <div className="wrap">
            <span>
              <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={site.github}>GitHub</a> · <a href={site.linkedin}>LinkedIn</a> · <a href="/resume.pdf">Resume</a>
            </span>
            <span>Illustrations generated with AI. Results come from project logs.</span>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
