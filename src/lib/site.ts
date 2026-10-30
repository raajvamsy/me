export const site = {
  name: "Raaj Vamsy Rayavarapu",
  description:
    "Principal Engineer building developer platforms, and independent researcher working on learning systems and compression.",
  email: "raajvamsy@gmail.com",
  github: "https://github.com/raajvamsy",
  linkedin: "https://www.linkedin.com/in/raajvamsy",
  // Set NEXT_PUBLIC_SITE_URL for a custom domain. Vercel supplies its own address otherwise.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3457"),
};
