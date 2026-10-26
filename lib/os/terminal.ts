/**
 * Portfolio terminal command engine.
 *
 * Pure and data-driven: commands are matched against a fixed whitelist and
 * produce formatted lines from data/portfolio.ts. There is NO shell, no eval,
 * no filesystem and no network access.
 */
import {
  achievements,
  certificates,
  education,
  experience,
  getSocial,
  profile,
  projects,
  skillCategories,
} from "@/data/portfolio";
import type { WindowAppId } from "./apps";
import { isWindowApp } from "./apps";

export type LineKind = "input" | "text" | "heading" | "muted" | "error" | "success" | "accent" | "link" | "pair" | "ascii";

export interface TermLine {
  kind: LineKind;
  text: string;
  /** For links */
  href?: string;
  /** For key/value pairs */
  label?: string;
}

export type TermEffect =
  | { type: "clear" }
  | { type: "exit" }
  | { type: "open"; app: WindowAppId }
  | { type: "external"; href: string }
  | { type: "theme"; value: "cyber" | "retro" }
  | { type: "sound"; value: boolean }
  | { type: "glitch" };

export interface CommandResult {
  lines: TermLine[];
  effects?: TermEffect[];
}

interface CommandDef {
  name: string;
  description: string;
  usage?: string;
  hidden?: boolean;
  run: (args: string[]) => CommandResult;
}

const t = (text: string): TermLine => ({ kind: "text", text });
const h = (text: string): TermLine => ({ kind: "heading", text });
const m = (text: string): TermLine => ({ kind: "muted", text });
const a = (text: string): TermLine => ({ kind: "accent", text });
const ok = (text: string): TermLine => ({ kind: "success", text });
const err = (text: string): TermLine => ({ kind: "error", text });
const pair = (label: string, text: string): TermLine => ({ kind: "pair", label, text });
const link = (text: string, href: string): TermLine => ({ kind: "link", text, href });
const blank = (): TermLine => ({ kind: "text", text: "" });

const LOGO = [
  "  ____    _    ____  _   _ ___ _  __    _       ___  ____  ",
  " / ___|  / \\  / ___|| | | |_ _| |/ /   / \\     / _ \\/ ___| ",
  " \\___ \\ / _ \\ \\___ \\| |_| || || ' /   / _ \\   | | | \\___ \\ ",
  "  ___) / ___ \\ ___) |  _  || || . \\  / ___ \\  | |_| |___) |",
  " |____/_/   \\_\\____/|_| |_|___|_|\\_\\/_/   \\_\\  \\___/|____/ ",
];

const commands: CommandDef[] = [
  {
    name: "help",
    description: "List available commands",
    run: () => ({
      lines: [
        h("Available commands"),
        ...commands
          .filter((cmd) => !cmd.hidden)
          .map((cmd) => pair(cmd.usage ?? cmd.name, cmd.description)),
        blank(),
        m("Tip: press Tab to autocomplete, ↑/↓ for history. Some commands are hidden… 👀"),
      ],
    }),
  },
  {
    name: "about",
    description: "Who is Sashika?",
    run: () => ({
      lines: [
        h(profile.name),
        a(`${profile.role} · ${profile.location}`),
        blank(),
        ...profile.intro.map(t),
        blank(),
        pair("status", profile.availability),
      ],
    }),
  },
  {
    name: "projects",
    description: "List projects",
    run: () => ({
      lines: [
        h(`Projects (${projects.length})`),
        ...projects.map((project) => pair(project.id, `${project.name} — ${project.tagline} [${project.status.label}]`)),
        blank(),
        m("Run `project <id>` for details, or `open projects` for the explorer."),
      ],
    }),
  },
  {
    name: "project",
    usage: "project <id>",
    description: "Show details for one project",
    run: (args) => {
      const id = args[0]?.toLowerCase();
      const project = projects.find((item) => item.id === id || item.name.toLowerCase() === id);
      if (!project) {
        return {
          lines: [err(id ? `Project not found: ${id}` : "Usage: project <id>"), m(`Available: ${projects.map((p) => p.id).join(", ")}`)],
        };
      }
      const lines: TermLine[] = [h(project.name), a(project.tagline), blank(), pair("problem", project.problem), t(project.description)];
      if (project.features.length) {
        lines.push(blank(), h("Key features"), ...project.features.map((feature) => t(`  • ${feature}`)));
      }
      if (project.tech.length) lines.push(blank(), pair("stack", project.tech.join(", ")));
      lines.push(pair("status", project.status.label));
      if (project.github) lines.push(link(`GitHub → ${project.github}`, project.github));
      if (project.demo) lines.push(link(`Live → ${project.demo}`, project.demo));
      return { lines };
    },
  },
  {
    name: "skills",
    description: "Technical skills by category",
    run: () => ({
      lines: [
        h("Technical skills"),
        ...skillCategories.map((category) => pair(category.title, category.skills.map((skill) => skill.name).join(" · "))),
      ],
    }),
  },
  {
    name: "experience",
    description: "Work experience",
    run: () => ({
      lines: experience.length
        ? [h("Experience"), ...experience.map((item) => pair(item.period, `${item.role} — ${item.organisation}`))]
        : [
            h("Experience"),
            t("No professional roles listed yet."),
            t(`${profile.firstName} is currently looking for an IT / Software Engineering internship.`),
            m(`Hands-on experience comes from ${projects.filter((p) => !p.detailsPending).length} documented projects — run \`projects\`.`),
          ],
    }),
  },
  {
    name: "education",
    description: "Education",
    run: () => ({
      lines: [
        h("Education"),
        ...education.flatMap((item) => [pair(item.period, `${item.programme}`), t(`  ${item.institution} (${item.shortName}), ${item.location}`)]),
      ],
    }),
  },
  {
    name: "certificates",
    description: "Certificates & achievements",
    run: () => ({
      lines: [
        h("Certificates"),
        ...(certificates.length
          ? certificates.map((cert) => pair(cert.issuer, cert.title))
          : [m("No certificates have been added yet.")]),
        blank(),
        h("Achievements"),
        ...achievements.map((item) => pair(item.issuer, `${item.title} — ${item.description}`)),
      ],
    }),
  },
  {
    name: "contact",
    description: "How to reach Sashika",
    run: () => ({
      lines: [
        h("Contact"),
        link(`email    ${profile.email}`, `mailto:${profile.email}`),
        link(`github   ${getSocial("github").href}`, getSocial("github").href),
        link(`linkedin ${getSocial("linkedin").href}`, getSocial("linkedin").href),
        blank(),
        m("Run `open contact` to send a message from the OS."),
      ],
    }),
  },
  {
    name: "github",
    description: "Open GitHub profile",
    run: () => ({
      lines: [ok("Opening GitHub in a new tab…"), link(getSocial("github").href, getSocial("github").href)],
      effects: [{ type: "external", href: getSocial("github").href }],
    }),
  },
  {
    name: "linkedin",
    description: "Open LinkedIn profile",
    run: () => ({
      lines: [ok("Opening LinkedIn in a new tab…"), link(getSocial("linkedin").href, getSocial("linkedin").href)],
      effects: [{ type: "external", href: getSocial("linkedin").href }],
    }),
  },
  {
    name: "open",
    usage: "open <app>",
    description: "Open a window (about, projects, skills, …)",
    run: (args) => {
      const target = args[0]?.toLowerCase() ?? "";
      if (isWindowApp(target) && target !== "terminal") {
        return { lines: [ok(`Launching ${target}…`)], effects: [{ type: "open", app: target }] };
      }
      return {
        lines: [
          err(target ? `Unknown app: ${target}` : "Usage: open <app>"),
          m("Apps: about, projects, skills, experience, education, certificates, contact, system"),
        ],
      };
    },
  },
  {
    name: "theme",
    usage: "theme <cyber|retro>",
    description: "Switch desktop theme",
    run: (args) => {
      const value = args[0]?.toLowerCase();
      if (value !== "cyber" && value !== "retro") return { lines: [err("Usage: theme <cyber|retro>")] };
      return { lines: [ok(`Theme set to ${value}.`)], effects: [{ type: "theme", value }, { type: "glitch" }] };
    },
  },
  {
    name: "sound",
    usage: "sound <on|off>",
    description: "Toggle UI sounds",
    run: (args) => {
      const value = args[0]?.toLowerCase();
      if (value !== "on" && value !== "off") return { lines: [err("Usage: sound <on|off>")] };
      return { lines: [ok(`Sound ${value}.`)], effects: [{ type: "sound", value: value === "on" }] };
    },
  },
  {
    name: "whoami",
    description: "Print the current user",
    run: () => ({ lines: [t("guest"), m(`You're browsing ${profile.firstName}'s portfolio as a guest. Welcome!`)] }),
  },
  {
    name: "neofetch",
    description: "System summary",
    run: () => ({
      lines: [
        ...LOGO.map((line) => ({ kind: "ascii" as const, text: line })),
        blank(),
        pair("user", `guest@sashika-os`),
        pair("os", "SASHIKA OS — Cyber Edition"),
        pair("owner", `${profile.name} · ${profile.role}`),
        pair("location", profile.location),
        pair("stack", "Next.js · React · TypeScript · Tailwind CSS · Three.js"),
        pair("projects", String(projects.length)),
        pair("status", profile.availability),
      ],
    }),
  },
  {
    name: "date",
    description: "Current date and time",
    run: () => ({ lines: [t(new Date().toString())] }),
  },
  {
    name: "echo",
    usage: "echo <text>",
    description: "Print text",
    run: (args) => ({ lines: [t(args.join(" ").slice(0, 500))] }),
  },
  {
    name: "clear",
    description: "Clear the screen",
    run: () => ({ lines: [], effects: [{ type: "clear" }] }),
  },
  {
    name: "exit",
    description: "Close the terminal",
    run: () => ({ lines: [m("Goodbye 👋")], effects: [{ type: "exit" }] }),
  },
  /* ---------------- hidden / easter eggs ---------------- */
  {
    name: "ayubowan",
    hidden: true,
    description: "Secret developer message",
    run: () => ({
      lines: [
        a("ආයුබෝවන්! — Ayubowan! 🇱🇰"),
        blank(),
        t("You found the secret command. Thanks for exploring this far."),
        t("I built SASHIKA OS to show that a portfolio can be playful and still be well-engineered."),
        t("If you're hiring interns — or just want to talk tech — I'd love to hear from you."),
        blank(),
        m("— Sashika"),
      ],
      effects: [{ type: "glitch" }],
    }),
  },
  {
    name: "sudo",
    hidden: true,
    description: "Nice try",
    run: (args) => {
      if (args.join(" ").toLowerCase().startsWith("hire")) {
        return {
          lines: [ok("[sudo] permission granted. Excellent decision. 😄"), t("Opening contact window…")],
          effects: [{ type: "open", app: "contact" }],
        };
      }
      return { lines: [err("guest is not in the sudoers file. This incident will be reported… to nobody. 🙂"), m("Try: sudo hire sashika")] };
    },
  },
  {
    name: "matrix",
    hidden: true,
    description: "Glitch the screen",
    run: () => ({ lines: [a("Wake up, visitor… the portfolio has you."), m("Follow the white rabbit → `projects`")], effects: [{ type: "glitch" }] }),
  },
  {
    name: "history",
    hidden: true,
    description: "Command history",
    run: () => ({ lines: [] }),
  },
];

export const commandNames = commands.map((cmd) => cmd.name);
export const visibleCommandNames = commands.filter((cmd) => !cmd.hidden).map((cmd) => cmd.name);

/** Tokenises input safely: only splits on whitespace, never evaluates anything. */
export function runCommand(rawInput: string, history: string[] = []): CommandResult {
  const input = rawInput.trim().slice(0, 300);
  if (!input) return { lines: [] };
  const [name, ...args] = input.split(/\s+/);
  const key = name.toLowerCase();

  if (key === "history") {
    return { lines: history.length ? history.map((item, index) => pair(String(index + 1), item)) : [m("No history yet.")] };
  }

  const command = commands.find((cmd) => cmd.name === key);
  if (!command) {
    const suggestion = suggest(key)[0];
    return {
      lines: [err(`command not found: ${name}`), m(suggestion ? `Did you mean \`${suggestion}\`? Type \`help\` for all commands.` : "Type `help` for all commands.")],
    };
  }
  return command.run(args);
}

/** Prefix suggestions for autocomplete (visible commands first). */
export function suggest(partial: string): string[] {
  const value = partial.trim().toLowerCase();
  if (!value) return [];
  const [first, second] = value.split(/\s+/);
  if (second !== undefined || value.endsWith(" ")) {
    if (first === "open") {
      return ["about", "projects", "skills", "experience", "education", "certificates", "contact", "system"]
        .filter((app) => app.startsWith(second ?? ""))
        .map((app) => `open ${app}`);
    }
    if (first === "project") {
      return projects.map((p) => p.id).filter((id) => id.startsWith(second ?? "")).map((id) => `project ${id}`);
    }
    if (first === "theme") return ["cyber", "retro"].filter((v) => v.startsWith(second ?? "")).map((v) => `theme ${v}`);
    return [];
  }
  return visibleCommandNames.filter((cmd) => cmd.startsWith(value) && cmd !== value);
}
