import type { MetadataRoute } from "next";
import { getEntries } from "@/lib/content";
import { getResearchLines } from "@/lib/research";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/work",
    "/research",
    ...getEntries("work").map(({ slug }) => `/work/${slug}`),
    ...getResearchLines().flatMap(({ line, branches }) => [
      `/research/${line}`,
      ...branches.map(({ slug }) => `/research/${line}/${slug}`),
    ]),
    ...(["blog", "docs"] as const).flatMap((section) =>
      getEntries(section).map(({ slug }) => `/${section}/${slug}`),
    ),
  ];
  return paths.map((path) => ({ url: `${site.url}${path}` }));
}
