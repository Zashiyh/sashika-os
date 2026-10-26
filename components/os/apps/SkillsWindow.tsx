"use client";

import { Boxes, Cloud, Code2, Database, Layout, Network, Palette, Server, Smartphone, Wrench, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { projectsUsingSkill, skillCategories } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { AppShell } from "./shared";

const categoryIcons: Record<string, LucideIcon> = {
  languages: Code2,
  frontend: Layout,
  backend: Server,
  databases: Database,
  mobile: Smartphone,
  design: Palette,
  cloud: Cloud,
  networking: Network,
  tools: Wrench,
};

/**
 * Skills grouped by category. Instead of self-rated percentages, each skill
 * lists the projects where it was actually used (derived from project data).
 */
export default function SkillsWindow() {
  const [active, setActive] = useState<string>("all");

  const categories = useMemo(
    () =>
      skillCategories.map((category) => ({
        ...category,
        skills: category.skills.map((skill) => ({ ...skill, usedIn: projectsUsingSkill(skill) })),
      })),
    [],
  );

  const shown = active === "all" ? categories : categories.filter((category) => category.id === active);

  return (
    <AppShell>
      <header className="mb-5">
        <p className="os-accent text-[11px] font-semibold uppercase tracking-[0.25em]">Technical skills</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">Tools I use to build things</h1>
        <p className="os-muted mt-1.5 max-w-2xl text-sm leading-relaxed">
          No self-rated percentages — where a skill appears in my published projects, those projects are listed as evidence.
        </p>
      </header>

      <div className="-mx-1 mb-5 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter skill categories">
        {[{ id: "all", title: "All" }, ...categories].map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={active === category.id}
            onClick={() => setActive(category.id)}
            className={cn("os-chip !py-1", active === category.id && "!border-[var(--accent)] font-semibold")}
          >
            {category.title}
          </button>
        ))}
      </div>

      <div className="grid gap-4 @2xl:grid-cols-2">
        {shown.map((category) => {
          const Icon = categoryIcons[category.id] ?? Boxes;
          return (
            <section key={category.id} className="os-card p-4" aria-labelledby={`skills-${category.id}`}>
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--chip-bg)] os-accent">
                  <Icon className="size-4.5" aria-hidden />
                </span>
                <div>
                  <h2 id={`skills-${category.id}`} className="font-semibold">
                    {category.title}
                  </h2>
                  <p className="os-muted text-xs leading-relaxed">{category.description}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {category.skills.map((skill) => (
                  <li key={skill.name} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <span className="font-medium">{skill.name}</span>
                    {skill.usedIn.length > 0 && (
                      <span className="os-muted text-[11px]">
                        — used in {skill.usedIn.slice(0, 3).map((project) => project.name.replace(/\s*\(.*\)/, "")).join(", ")}
                        {skill.usedIn.length > 3 ? ` +${skill.usedIn.length - 3}` : ""}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
