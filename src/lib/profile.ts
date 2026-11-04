// Home page content. Every number and claim here comes from the resume or a work page.

export const impact = [
  { value: "~150×", label: "faster bug turnaround" },
  { value: "5–7×", label: "faster feature delivery" },
  { value: "7×", label: "faster repeat builds" },
  { value: "3.5×", label: "faster live reload" },
];

export const employers = ["WaveMaker", "Pramati Technologies", "Ingram Micro"];

export const featured = {
  href: "/work/platform#agentic-engineering-pipeline",
  image: "/img/work/platform.webp",
  title: "Agentic engineering pipeline",
  summary:
    "An end-to-end pipeline from issue ticket to a buildable reproduction project, automating spec generation, codebase ingestion, test generation and code generation. The QA team has since adopted the approach.",
  metrics: [
    { value: "~150×", label: "bug turnaround" },
    { value: "5–7×", label: "feature delivery" },
  ],
};

export const sideWork = [
  {
    href: "/work/web-preview",
    image: "/img/work/web-preview.webp",
    badge: "Performance",
    title: "Web preview pipeline",
    summary: "Rebuilt to fit a tight container memory limit.",
    metrics: [
      { value: "7×", label: "builds" },
      { value: "3.5×", label: "reload" },
      { value: "~½", label: "memory" },
    ],
    tags: [] as string[],
  },
  {
    href: "/work/build-observability",
    image: "/img/work/build-observability.webp",
    badge: "Observability",
    title: "Build observability and AI root-cause analysis",
    summary: "Trustworthy build data, failures grouped by owner, and an agent that writes root-cause reports.",
    metrics: [],
    tags: ["MCP", "AI agent"],
  },
];

export const alsoWork = [
  {
    href: "/work/platform#image-to-code",
    icon: "code",
    title: "Image-to-code",
    summary:
      "Screenshot to platform markup, verified by re-rendering against the source. Now a standard way apps are built.",
  },
  {
    href: "/work/platform#performance-diagnostics",
    icon: "pulse",
    title: "Performance diagnostics",
    summary: "Runtime events synced with screen recordings: time to first interaction, API time and re-render cost.",
  },
  {
    href: "/work/platform#expo-router-migration",
    icon: "route",
    title: "Expo Router migration",
    summary: "Moved navigation across code generator and runtime, verified by running real generated apps end to end.",
  },
] as const;

export const roles = [
  {
    title: "Principal Engineer",
    dates: "Apr 2025 – Present",
    current: true,
    points: [
      "Shares architecture and technical direction with the founding architect and team leads.",
      "Built the agentic ticket-to-repro pipeline, image-to-code, build observability and performance diagnostics.",
      "Re-architected web preview: 7× faster repeat builds, 3.5× faster live reload.",
    ],
  },
  {
    title: "Senior Software Development Engineer",
    dates: "May 2022 – Apr 2025",
    current: false,
    points: [
      "Founding engineer of the React Native platform team; built the codebase from inception.",
      "Owned wm-reactnative-cli, Appchef, Expo integration and Web Preview end to end.",
      "Covered QA and enterprise support early on, including onsite customer visits.",
    ],
  },
];

export const earlier = [
  {
    dates: "Dec 2020 – Mar 2022",
    title: "Freelance Software Developer",
    note: "Flask, Django and Spring Boot backends, automation and OpenCV tools",
  },
  {
    dates: "Apr 2019 – Nov 2020",
    title: "Software Developer · Pramati",
    note: "Enterprise mobile and web apps on the WaveMaker platform",
  },
  {
    dates: "Jul 2018 – Dec 2018",
    title: "Software Trainee · Ingram Micro",
    note: "Warehouse desktop software in C# and ASP.NET MVC",
  },
  {
    dates: "Mar 2017 – Jul 2018",
    title: "Freelance Software Developer",
    note: "Qt desktop applications and automation tools",
  },
];

export const products = [
  {
    name: "ChefQuest",
    icon: "utensils",
    href: "https://chefquest.in",
    domain: "chefquest.in",
    badge: "Founder · 2025",
    summary: "A generative-AI recipe product.",
    tags: ["Next.js", "Supabase"],
  },
  {
    name: "Plantopia",
    icon: "sprout",
    href: "/work/products",
    domain: "Gamified plant care",
    badge: "Project",
    summary: "Camera capture, weather data and growth timelines.",
    tags: ["Next.js", "Llama 4 vision"],
  },
] as const;

export const researchResults = [
  { value: "15 / 15", label: "lives where learned behaviour beat a newborn control", source: "The organism" },
  { value: "4.92%", label: "smaller than JPEG XL effort 9 on 4K photos, lossless", source: "FFIC" },
  { value: "25 / 27", label: "test files over 10 KB where FunnelZip beat the best standard tool", source: "FunnelZip" },
];

// One short line per research line, keyed by its folder under content/research.
export const researchBlurbs: Record<string, string> = {
  organism: "One learning core across three bodies",
  funnelbrain: "A non-LLM substrate and its limits",
  wavemind: "Memory as wave geometry",
  compression: "FFIC and FunnelZip",
  memorylayer: "The research behind MemoryLayer",
  trading: "No validated edge, reported as such",
  "living-character": "Combining the lines above",
};

export const skills = [
  ["Languages", ["TypeScript", "JavaScript", "Python", "Java", "C", "C++", "C#"]],
  ["Mobile and web", ["React Native", "Expo", "Next.js", "Angular", "Spring Boot", "FastAPI", "Flask"]],
  ["AI and data", ["LLM APIs", "MCP", "RAG", "Embeddings", "FAISS", "OpenCV", "Z3"]],
  ["Infrastructure", ["Docker", "PostgreSQL", "Supabase", "MySQL", "Elasticsearch", "SQLite"]],
] as const;
