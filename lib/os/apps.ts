import type { LucideIcon } from "lucide-react";
import {
  Award,
  Briefcase,
  Cpu,
  FolderGit2,
  GraduationCap,
  Mail,
  SquareTerminal,
  UserRound,
} from "lucide-react";
import { getSocial } from "@/data/portfolio";

/** Apps that open a window inside the OS */
export type WindowAppId =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "certificates"
  | "contact"
  | "terminal"
  | "system";

/** Desktop entries that open an external destination */
export type LinkAppId = "github" | "linkedin";

export type AppId = WindowAppId | LinkAppId;

interface BaseApp {
  id: AppId;
  title: string;
  /** Label under the desktop icon */
  label: string;
  description: string;
  /** Gradient used on icon tiles (two CSS colours) */
  tint: [string, string];
  /** KeyboardEvent.code used with Alt+Shift */
  shortcut?: string;
  showOnDesktop: boolean;
}

export interface WindowApp extends BaseApp {
  kind: "window";
  id: WindowAppId;
  icon: LucideIcon;
  defaultSize: { w: number; h: number };
}

export interface LinkApp extends BaseApp {
  kind: "link";
  id: LinkAppId;
  href: string;
}

export type OSApp = WindowApp | LinkApp;

export const windowApps: Record<WindowAppId, WindowApp> = {
  about: {
    kind: "window",
    id: "about",
    title: "About Me",
    label: "About Me",
    description: "Profile, interests and career direction",
    icon: UserRound,
    tint: ["#22d3ee", "#2563eb"],
    shortcut: "KeyA",
    defaultSize: { w: 820, h: 600 },
    showOnDesktop: true,
  },
  projects: {
    kind: "window",
    id: "projects",
    title: "My Projects",
    label: "My Projects",
    description: "Project explorer with details and links",
    icon: FolderGit2,
    tint: ["#38bdf8", "#7c3aed"],
    shortcut: "KeyP",
    defaultSize: { w: 1020, h: 660 },
    showOnDesktop: true,
  },
  skills: {
    kind: "window",
    id: "skills",
    title: "Technical Skills",
    label: "Technical Skills",
    description: "Technologies grouped by area",
    icon: Cpu,
    tint: ["#5eead4", "#0891b2"],
    shortcut: "KeyS",
    defaultSize: { w: 880, h: 620 },
    showOnDesktop: true,
  },
  experience: {
    kind: "window",
    id: "experience",
    title: "Experience",
    label: "Experience",
    description: "Verified experience and hands-on work",
    icon: Briefcase,
    tint: ["#a78bfa", "#4f46e5"],
    shortcut: "KeyE",
    defaultSize: { w: 720, h: 560 },
    showOnDesktop: true,
  },
  education: {
    kind: "window",
    id: "education",
    title: "Education",
    label: "Education",
    description: "Studies and learning roadmap",
    icon: GraduationCap,
    tint: ["#93c5fd", "#1d4ed8"],
    shortcut: "KeyU",
    defaultSize: { w: 720, h: 560 },
    showOnDesktop: true,
  },
  certificates: {
    kind: "window",
    id: "certificates",
    title: "Certificates",
    label: "Certificates",
    description: "Certificates and achievements",
    icon: Award,
    tint: ["#67e8f9", "#6d28d9"],
    shortcut: "KeyR",
    defaultSize: { w: 660, h: 500 },
    showOnDesktop: true,
  },
  contact: {
    kind: "window",
    id: "contact",
    title: "Contact",
    label: "Contact",
    description: "Email, social links and message form",
    icon: Mail,
    tint: ["#22d3ee", "#0e7490"],
    shortcut: "KeyC",
    defaultSize: { w: 800, h: 600 },
    showOnDesktop: true,
  },
  terminal: {
    kind: "window",
    id: "terminal",
    title: "Terminal",
    label: "Terminal",
    description: "Explore the portfolio with commands",
    icon: SquareTerminal,
    tint: ["#334155", "#0f172a"],
    shortcut: "KeyT",
    defaultSize: { w: 760, h: 480 },
    showOnDesktop: true,
  },
  system: {
    kind: "window",
    id: "system",
    title: "System Information",
    label: "System Info",
    description: "About SASHIKA OS",
    icon: Cpu,
    tint: ["#64748b", "#1e293b"],
    shortcut: "KeyI",
    defaultSize: { w: 580, h: 560 },
    showOnDesktop: false,
  },
};

export const linkApps: Record<LinkAppId, LinkApp> = {
  github: {
    kind: "link",
    id: "github",
    title: "GitHub",
    label: "GitHub",
    description: "Open GitHub profile in a new tab",
    href: getSocial("github").href,
    tint: ["#475569", "#0f172a"],
    shortcut: "KeyG",
    showOnDesktop: true,
  },
  linkedin: {
    kind: "link",
    id: "linkedin",
    title: "LinkedIn",
    label: "LinkedIn",
    description: "Open LinkedIn profile in a new tab",
    href: getSocial("linkedin").href,
    tint: ["#0a66c2", "#0b3a75"],
    shortcut: "KeyL",
    showOnDesktop: true,
  },
};

/** Desktop icon order */
export const desktopOrder: AppId[] = [
  "about",
  "projects",
  "skills",
  "experience",
  "education",
  "certificates",
  "github",
  "linkedin",
  "contact",
  "terminal",
];

export const getApp = (id: AppId): OSApp =>
  (id in windowApps ? windowApps[id as WindowAppId] : linkApps[id as LinkAppId]) as OSApp;

export const isWindowApp = (id: string): id is WindowAppId => id in windowApps;

export const allApps: OSApp[] = [...Object.values(windowApps), ...Object.values(linkApps)];

/** Human readable shortcut, e.g. "Alt+Shift+P" */
export const shortcutLabel = (code?: string) => (code ? `Alt+Shift+${code.replace("Key", "")}` : undefined);
