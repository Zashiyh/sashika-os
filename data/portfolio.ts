/**
 * SASHIKA OS — centralized portfolio content.
 *
 * Every piece of content shown in the OS (windows, terminal, start menu,
 * lock screen, no-JS fallback) is read from this file. Edit here only.
 *
 * Sources used when this file was written:
 *  - Live portfolio: https://sashikaportfolio.vercel.app
 *  - Previous portfolio source (this repository, components/*)
 *  - GitHub profile README: https://github.com/Zashiyh/Zashiyh
 *  - Public project repositories on https://github.com/Zashiyh
 *
 * Nothing here is invented. Where information is not available yet the
 * item is explicitly marked (e.g. `detailsPending: true`, empty arrays).
 */

export type ProjectCategory = "web" | "mobile" | "security" | "ai" | "business" | "iot";

export type ProjectStatusTone = "live" | "source" | "private" | "pending";

export interface ProjectStatus {
  label: string;
  tone: ProjectStatusTone;
}

export interface Project {
  id: string;
  name: string;
  /** Short one-line descriptor shown on cards */
  tagline: string;
  categories: ProjectCategory[];
  /** The problem the project addresses */
  problem: string;
  description: string;
  features: string[];
  tech: string[];
  status: ProjectStatus;
  image?: string;
  imageAlt?: string;
  github?: string;
  demo?: string;
  featured?: boolean;
  /** True when the project is real but its full write-up has not been added yet */
  detailsPending?: boolean;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  /** Alternative names used to match this skill against project tech lists */
  aliases?: string[];
  note?: string;
}

export interface EducationEntry {
  institution: string;
  shortName: string;
  programme: string;
  period: string;
  location: string;
  description: string;
}

export interface ExperienceEntry {
  role: string;
  organisation: string;
  period: string;
  description: string;
  type: "work" | "internship" | "volunteer" | "activity";
}

export interface Certificate {
  title: string;
  issuer: string;
  date?: string;
  credentialUrl?: string;
  image?: string;
}

export interface Achievement {
  title: string;
  issuer: string;
  description: string;
  url?: string;
}

export interface SocialLink {
  id: "github" | "linkedin" | "portfolio" | "email";
  label: string;
  handle: string;
  href: string;
}

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

export const profile = {
  name: "Sashika Madushan",
  firstName: "Sashika",
  username: "sashika.madushan",
  role: "Software Engineer Undergraduate",
  location: "Sri Lanka",
  /** Set to null to show the built-in placeholder avatar */
  photo: "/myprofile.jpeg" as string | null,
  email: "sashikamadushan2003@gmail.com",
  availability: "Open to internship opportunities",
  shortIntro:
    "Software Engineering undergraduate building modern web applications, full-stack systems and interactive digital experiences.",
  intro: [
    "I'm Sashika Madushan, a Software Engineering undergraduate at the National Institute of Business Management (NIBM), Sri Lanka. I'm passionate about creating modern digital products that combine thoughtful design, solid engineering and real-world functionality.",
    "My main focus is web development — especially responsive interfaces and full-stack applications built with modern JavaScript and TypeScript technologies. I enjoy turning real-world requirements into clean, maintainable and user-focused software.",
    "Beyond web development, I enjoy exploring AI, cybersecurity, cloud technologies, mobile development and IoT systems. Every project is an opportunity to improve my engineering skills, experiment with ideas and create something useful.",
  ],
  principles: [
    {
      title: "Modern Development",
      text: "Clean, responsive and maintainable web applications with modern technologies.",
    },
    {
      title: "Full-Stack Thinking",
      text: "Comfortable across frontend interfaces, APIs, databases and application architecture.",
    },
    {
      title: "Security Mindset",
      text: "Interested in secure development, threat intelligence and building systems with security in mind.",
    },
    {
      title: "Always Building",
      text: "I learn by creating real projects, experimenting with new technologies and solving practical problems.",
    },
  ],
  workWith: [
    "Full-stack web application development",
    "Frontend and responsive UI development",
    "Backend and REST API development",
    "Database-driven application architecture",
    "Mobile application development",
    "Authentication and role-based systems",
    "Cloud and web deployment fundamentals",
    "Networking and infrastructure fundamentals",
    "Software testing and QA",
  ],
  learning: ["Cloud Computing", "Cyber Security", "Advanced Backend Development", "System Design", "DevOps Fundamentals"],
  lookingFor: [
    "Software Engineering",
    "Full Stack Development",
    "Frontend / Backend Development",
    "Cloud Computing",
    "Networking",
    "QA / Software Testing",
  ],
  careerGoal:
    "I'm looking for an IT / Software Engineering internship where I can gain practical industry experience while contributing to real software projects — strengthening my engineering fundamentals, working with experienced teams and gradually taking responsibility for building reliable, maintainable software.",
} as const;

export const socialLinks: SocialLink[] = [
  { id: "github", label: "GitHub", handle: "@Zashiyh", href: "https://github.com/Zashiyh" },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "in/sashika-madushan",
    href: "https://www.linkedin.com/in/sashika-madushan-448612299/",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    handle: "sashikaportfolio.vercel.app",
    href: "https://sashikaportfolio.vercel.app",
  },
  {
    id: "email",
    label: "Email",
    handle: profile.email,
    href: `mailto:${profile.email}`,
  },
];

export const getSocial = (id: SocialLink["id"]): SocialLink =>
  socialLinks.find((link) => link.id === id) as SocialLink;

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export const projects: Project[] = [
  {
    id: "bookinglk",
    name: "BookingLK",
    tagline: "Hotel & accommodation booking platform",
    categories: ["web", "business"],
    problem:
      "Travellers need one place to discover, compare and book hotels, resorts, villas, guest houses and apartments across Sri Lanka.",
    description:
      "A modern full-stack hotel booking platform for discovering, comparing and booking accommodation across Sri Lanka. It covers hotel search and filtering, detailed property pages, a booking workflow with email confirmation, and separate dashboards for guests, hotel owners and administrators.",
    features: [
      "Location-based hotel discovery and destination search",
      "Hotel filtering and detailed hotel pages",
      "Booking workflow with confirmation email",
      "QR-based booking confirmation",
      "User, hotel-owner and admin dashboards",
      "JWT authentication with role-based access control",
      "Favourites, reviews and hotel location on a map",
      "Responsive UI with dark / light theme",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "MongoDB",
      "Mongoose",
      "React Hook Form",
      "Zod",
      "JWT",
      "bcrypt",
      "REST APIs",
    ],
    status: { label: "Live demo", tone: "live" },
    image: "/bookinglk1.png",
    imageAlt: "BookingLK home page showing hotel search across Sri Lanka",
    github: "https://github.com/Zashiyh/bookinglk2.0",
    demo: "https://bookinglk2-0.vercel.app/",
    featured: true,
  },
  {
    id: "cybershield-xdr",
    name: "CyberShield XDR",
    tagline: "Security operations (SOC) dashboard",
    categories: ["security", "web", "ai"],
    problem:
      "Security teams need a single interface to monitor threats, triage alerts, track incidents and keep an eye on protected assets.",
    description:
      "An AI-powered threat intelligence and security operations platform (developed under the working name CyberGuard SOC). It centralises security alerts, threat intelligence, incident management, IP analysis, system health and real-time threat visualisation in one dashboard.",
    features: [
      "Security overview dashboard with threat and incident statistics",
      "Alert list with IP search, severity filters and threat scores",
      "Create incidents directly from alerts",
      "Threat intelligence feed and suspicious IP information",
      "Interactive attack map and live threat feed",
      "IP security checker",
      "Threat analytics and historical trends",
      "System health monitor (CPU, memory, database, API, uptime)",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Recharts", "MongoDB", "Mongoose", "REST APIs"],
    status: { label: "Source on GitHub", tone: "source" },
    image: "/sybersheild.png",
    imageAlt: "CyberShield XDR security operations dashboard",
    github: "https://github.com/Zashiyh/cybershield-xdr",
    featured: true,
  },
  {
    id: "cooroonduwatte-tea",
    name: "Cooroonduwatte Tea Factory",
    tagline: "Tea collection & factory management system",
    categories: ["business", "web"],
    problem:
      "A tea factory needs to replace scattered records of suppliers, collection areas, daily leaf weights and payments with one reliable system.",
    description:
      "A full-stack, database-driven management system for a tea factory workflow. It manages tea collection areas, suppliers, daily tea leaf collections, factory scale weights, payments and monthly reporting through a centralised dashboard.",
    features: [
      "Area and supplier management",
      "Daily tea collection and leaf weight tracking",
      "Factory scale comparison",
      "Monthly dashboards and reports",
      "Supplier payments and account transactions",
      "User management with authentication",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Mongoose", "REST APIs"],
    status: { label: "Source on GitHub", tone: "source" },
    image: "/tea-factory.png",
    imageAlt: "Cooroonduwatte tea factory management dashboard",
    github: "https://github.com/Zashiyh/Tea-collecting-management-system",
    featured: true,
  },
  {
    id: "smartpos-pro",
    name: "SmartPOS Pro",
    tagline: "Point-of-sale & business management",
    categories: ["business", "web"],
    problem: "Small retail businesses need a simple way to manage products, sales, inventory and day-to-day operations.",
    description:
      "A full-stack retail management system that lets businesses manage products, inventory, sales, customers, invoices and analytics through a modern, responsive dashboard secured with JWT authentication.",
    features: [
      "Product and inventory management",
      "Sales processing",
      "Customer management",
      "Invoice generation",
      "Analytics dashboard",
      "JWT authentication and role-based access",
    ],
    tech: ["Next.js", "React", "TypeScript", "MongoDB", "JWT", "Tailwind CSS"],
    status: { label: "Live demo", tone: "live" },
    image: "/smartpos.png",
    imageAlt: "SmartPOS Pro sales dashboard",
    github: "https://github.com/Zashiyh/smart-pos",
    demo: "https://smart-pos-indol.vercel.app/dashboard",
    featured: true,
  },
  {
    id: "intellichat",
    name: "IntelliChat",
    tagline: "AI chat application",
    categories: ["ai", "web"],
    problem: "People want a fast, modern conversational interface for talking to an AI assistant.",
    description:
      "An AI-powered chat application with a modern conversational interface and a FastAPI backend that integrates Gemini AI for intelligent responses, with message storage in MongoDB.",
    features: [
      "AI-powered conversations",
      "Real-time chat interface",
      "File attachment support",
      "Message history storage",
      "User authentication",
      "Responsive design",
    ],
    tech: ["React", "Vite", "TypeScript", "Tailwind CSS", "FastAPI", "Python", "MongoDB", "Gemini AI"],
    status: { label: "Source on GitHub", tone: "source" },
    image: "/chatbot.png",
    imageAlt: "IntelliChat conversational AI interface",
    github: "https://github.com/Zashiyh/ChatBot",
  },
  {
    id: "traveler",
    name: "Traveler",
    tagline: "Travel social & IoT mobile app",
    categories: ["mobile", "iot"],
    problem: "Travellers want to share experiences and check real-time environmental and weather conditions in one app.",
    description:
      "A travel-focused Android application that combines social travel experiences — sharing posts and photos, exploring destinations and interacting with other travellers — with real-time environmental and weather data from an ESP32-based IoT device.",
    features: [
      "User profiles and Firebase Authentication",
      "Travel post sharing with photo upload",
      "Destination discovery",
      "Likes and comments",
      "Real-time data sync with Firebase",
      "Environmental / weather readings from ESP32 hardware",
    ],
    tech: ["Kotlin", "Jetpack Compose", "Firebase", "ESP32", "IoT", "Material Design"],
    status: { label: "Source on GitHub", tone: "source" },
    image: "/traveler.png",
    imageAlt: "Traveler Android app screens",
    github: "https://github.com/Zashiyh/Traveler1",
  },
  {
    id: "supermart",
    name: "SuperMart",
    tagline: "Online supermarket — web & mobile",
    categories: ["mobile", "web", "business"],
    problem: "Shoppers expect a modern online supermarket experience on both web and mobile.",
    description:
      "An online supermarket platform focused on a modern shopping experience across web and mobile interfaces, including product browsing, categories, product details and a shopping cart backed by REST APIs.",
    features: ["Product browsing and categories", "Product details", "Shopping cart", "Mobile application", "REST API integration"],
    tech: ["React Native", "Expo", "JavaScript", "TypeScript", "REST APIs"],
    status: { label: "No public repository", tone: "private" },
  },
  {
    id: "gov-biodata",
    name: "Government Officer Biodata Management System",
    tagline: "Officer biodata records management",
    categories: ["business", "web"],
    problem: "Managing government officers' biodata records in a structured, centralised system.",
    description:
      "A records management system for government officer biodata. The full project write-up — technologies, features and status — has not been published yet.",
    features: [],
    tech: [],
    status: { label: "Details coming soon", tone: "pending" },
    detailsPending: true,
  },
  {
    id: "uds-increment",
    name: "UDS Increment Data",
    tagline: "Increment data management",
    categories: ["business"],
    problem: "Recording and managing UDS increment data.",
    description:
      "A data management project for UDS increment records. The full project write-up — technologies, features and status — has not been published yet.",
    features: [],
    tech: [],
    status: { label: "Details coming soon", tone: "pending" },
    detailsPending: true,
  },
  {
    id: "form-172",
    name: "172 Form ID Registration & Payment Receipt System",
    tagline: "ID registration & receipt management",
    categories: ["business", "web"],
    problem: "Handling 172 Form ID registrations and their payment receipts in one place.",
    description:
      "A management system for 172 Form ID registrations and payment receipts. The full project write-up — technologies, features and status — has not been published yet.",
    features: [],
    tech: [],
    status: { label: "Details coming soon", tone: "pending" },
    detailsPending: true,
  },
  {
    id: "portfolio",
    name: "SASHIKA OS (this portfolio)",
    tagline: "Interactive 3D cyber operating system portfolio",
    categories: ["web"],
    problem: "A portfolio that is memorable and interactive while keeping all content fast, accessible and easy to explore.",
    description:
      "My personal portfolio, rebuilt as a retro-futuristic operating system inside a 3D monitor: a cinematic boot, an identity lock screen, a desktop with draggable windows, a portfolio terminal and a 2D fallback for devices without WebGL.",
    features: [
      "3D monitor scene built with React Three Fiber",
      "Window manager with drag, minimise, maximise and keyboard support",
      "Portfolio terminal with safe, data-driven commands",
      "Classic retro and modern cyber themes",
      "Reduced-motion support and 2D fallback",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js", "React Three Fiber", "Framer Motion"],
    status: { label: "Live", tone: "live" },
    github: "https://github.com/Zashiyh/sashika-madushan-portfolio",
    demo: "https://sashikaportfolio.vercel.app",
  },
];

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  web: "Web",
  mobile: "Mobile",
  security: "Security",
  ai: "AI",
  business: "Business systems",
  iot: "IoT",
};

/* ------------------------------------------------------------------ */
/* Skills — no percentages, evidence comes from linked projects        */
/* ------------------------------------------------------------------ */

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Programming Languages",
    description: "Languages I write application code in.",
    skills: [
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "Java" },
      { name: "C#" },
      { name: "PHP" },
      { name: "Kotlin" },
      { name: "Python" },
      { name: "SQL" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    description: "Modern interfaces, responsive layouts and interactive web experiences.",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Tailwind CSS" },
      { name: "HTML & CSS" },
      { name: "Framer Motion" },
      { name: "Three.js / React Three Fiber", aliases: ["Three.js", "React Three Fiber"] },
    ],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    description: "APIs, server-side systems, authentication and application logic.",
    skills: [
      { name: "Node.js" },
      { name: "Next.js API Routes", aliases: ["Next.js"] },
      { name: "REST APIs" },
      { name: "FastAPI" },
      { name: "JWT Authentication", aliases: ["JWT"] },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    description: "Relational and NoSQL databases, data modelling and application storage.",
    skills: [
      { name: "MySQL" },
      { name: "MongoDB", aliases: ["Mongoose"] },
      { name: "Firebase" },
      { name: "Supabase" },
      { name: "Oracle" },
    ],
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description: "Android and cross-platform applications.",
    skills: [
      { name: "React Native" },
      { name: "Expo" },
      { name: "Kotlin" },
      { name: "Jetpack Compose" },
      { name: "FlutterFlow" },
    ],
  },
  {
    id: "design",
    title: "UI/UX & Design",
    description: "Interface design, prototyping and design workflows.",
    skills: [{ name: "UI/UX Design" }, { name: "Prototyping" }, { name: "Figma" }],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    description: "Cloud fundamentals, deployment, version control and environments.",
    skills: [
      { name: "Cloud Computing (fundamentals)" },
      { name: "AWS (fundamentals)" },
      { name: "Vercel deployment" },
      { name: "Docker" },
      { name: "Git & GitHub" },
      { name: "Linux" },
    ],
  },
  {
    id: "networking",
    title: "Networking & Security",
    description: "Infrastructure fundamentals and building with security in mind.",
    skills: [
      { name: "Networking fundamentals" },
      { name: "Cybersecurity fundamentals" },
      { name: "Secure authentication (JWT, bcrypt, RBAC)", aliases: ["JWT", "bcrypt"] },
    ],
  },
  {
    id: "tools",
    title: "Tools & Practices",
    description: "Everyday development tools and engineering practices.",
    skills: [
      { name: "Postman" },
      { name: "VS Code" },
      { name: "Software Testing & QA" },
      { name: "IoT / ESP32", aliases: ["ESP32", "IoT"] },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Education / Experience / Certificates                               */
/* ------------------------------------------------------------------ */

export const education: EducationEntry[] = [
  {
    institution: "National Institute of Business Management",
    shortName: "NIBM",
    programme: "Software Engineering (Undergraduate)",
    period: "2023 – Present",
    location: "Sri Lanka",
    description:
      "Studying Software Engineering with a focus on modern web development, databases and software architecture.",
  },
];

export const learningRoadmap = {
  completed: [
    "Software Engineering fundamentals",
    "Web development",
    "Database development",
    "REST API development",
    "Git & GitHub",
    "UI/UX fundamentals",
  ],
  improving: ["Advanced Full Stack Development", "Cloud Computing", "Cyber Security", "System Design", "DevOps fundamentals"],
  future: ["Cloud Architecture", "Distributed Systems", "Advanced Security", "Scalable Backend Systems"],
};

/**
 * Verified work experience only. Empty until real roles are added.
 * Example:
 * { role: "Software Engineering Intern", organisation: "Company", period: "2026 – Present", type: "internship", description: "..." }
 */
export const experience: ExperienceEntry[] = [];

/** Credly certificates */
export const certificates: Certificate[] = [
{
  title: "Ethical Hacker",
  issuer: "Cisco",
  credentialUrl:
    "https://www.credly.com/badges/f6b1a1ba-f8c1-4365-ba66-74d881fcd3f2/linked_in_profile",
  image: "/images/certificates/ethical-hacker.png",
},
{
  title: "AWS Q Developer",
  issuer: "Amazon Web Services",
  credentialUrl:
    "https://www.credly.com/badges/b176f97d-c6a5-4950-849f-0c12759958ff/linked_in_profile",
  image: "/images/certificates/aws-q-developer.png",
},
];

export const achievements: Achievement[] = [
  {
    title: "Pull Shark",
    issuer: "GitHub Achievements",
    description: "Awarded by GitHub for merged pull requests.",
    url: "https://github.com/Zashiyh?tab=achievements",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9#+]/g, "");

/** Projects whose tech list mentions the given skill (or one of its aliases). */
export function projectsUsingSkill(skill: Skill): Project[] {
  const names = [skill.name, ...(skill.aliases ?? [])].map(normalise);
  return projects.filter((project) => project.tech.some((tech) => names.includes(normalise(tech))));
}

export const publishedProjects = projects.filter((project) => !project.detailsPending);