import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { getEntries } from "@/lib/content";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

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

const sections = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#products", label: "Products" },
  { href: "/#research", label: "Research" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  const extra = [
    getEntries("blog").length > 0 && { href: "/blog", label: "Writing" },
    getEntries("docs").length > 0 && { href: "/docs", label: "Docs" },
  ].filter((link): link is { href: string; label: string } => Boolean(link));
  const links = [...sections, ...extra];

  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <header className="site-nav">
          <div className="wrap">
            <Link href="/" className="brand">
              <span className="logo" aria-hidden="true">
                RV
              </span>
              Raaj Vamsy
            </Link>
            <nav aria-label="Main" className="nav-links">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="navlink">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="nav-actions">
              <a href="/resume.pdf" className="btn btn-secondary btn-sm resume">
                Resume
              </a>
              <Link href="/#contact" className="btn btn-primary btn-sm">
                Contact
              </Link>
              <details className="nav-menu">
                <summary className="btn btn-secondary btn-sm btn-icon" aria-label="Menu">
                  <Icon name="menu" size={18} />
                </summary>
                <nav aria-label="Mobile" className="nav-menu-panel">
                  {links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                    </Link>
                  ))}
                  <a href="/resume.pdf">Resume (PDF)</a>
                </nav>
              </details>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="wrap footer-top">
            <div>
              <Link href="/" className="brand">
                <span className="logo" aria-hidden="true">
                  RV
                </span>
                {site.name}
              </Link>
              <p>Principal Engineer building developer platforms and applied AI. Hyderabad, India.</p>
            </div>
            <nav aria-label="Site" className="footer-col">
              <h2>Site</h2>
              <Link href="/work" className="navlink">
                Work
              </Link>
              <Link href="/research" className="navlink">
                Research
              </Link>
              <Link href="/#experience" className="navlink">
                Experience
              </Link>
              <a href="/resume.pdf" className="navlink">
                Resume
              </a>
            </nav>
            <nav aria-label="Elsewhere" className="footer-col">
              <h2>Elsewhere</h2>
              <a href={site.github} className="navlink">
                GitHub
              </a>
              <a href={site.linkedin} className="navlink">
                LinkedIn
              </a>
              <a href="https://memorylayer.in" className="navlink">
                MemoryLayer
              </a>
              <a href="https://chefquest.in" className="navlink">
                ChefQuest
              </a>
            </nav>
          </div>
          <div className="wrap footer-bottom">
            <span>© 2026 {site.name}</span>
            <span>Illustrations are AI-generated. Results come from project logs.</span>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
