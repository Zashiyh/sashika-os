"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink as ExternalIcon,
  FolderOpen,
  LayoutGrid,
  List,
  Lock,
  Search,
  Target,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  getSocial,
  projectCategoryLabels,
  projects,
  type Project,
  type ProjectCategory,
  type ProjectStatusTone,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { useAudio } from "../AudioController";
import { GithubIcon } from "../ui/BrandIcons";
import { ExternalLink, SectionTitle } from "./shared";

type Filter = "all" | ProjectCategory;

const toneClass: Record<ProjectStatusTone, string> = {
  live: "border-emerald-400/40 bg-emerald-400/10 text-emerald-700 cyber:text-emerald-300",
  source: "border-sky-400/40 bg-sky-400/10 text-sky-800 cyber:text-sky-300",
  private: "border-slate-400/40 bg-slate-400/10 text-slate-700 cyber:text-slate-300",
  pending: "border-amber-400/40 bg-amber-400/10 text-amber-800 cyber:text-amber-300",
};

export function StatusBadge({ project }: { project: Project }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium", toneClass[project.status.tone])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {project.status.label}
    </span>
  );
}

function ProjectThumb({ project, className, sizes }: { project: Project; className?: string; sizes: string }) {
  if (!project.image) {
    return (
      <div
        className={cn(
          "relative grid place-items-center overflow-hidden bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_18%,transparent),color-mix(in_srgb,var(--accent-3)_18%,transparent))]",
          className,
        )}
      >
        <div aria-hidden className="absolute inset-0 opacity-30 [background-image:linear-gradient(var(--win-divider)_1px,transparent_1px),linear-gradient(90deg,var(--win-divider)_1px,transparent_1px)] [background-size:22px_22px]" />
        <span className="relative font-display text-3xl font-semibold opacity-70">
          {project.name
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")}
        </span>
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden bg-black/40", className)}>
      <Image src={project.image} alt={project.imageAlt ?? `${project.name} screenshot`} fill sizes={sizes} className="object-cover object-top" />
    </div>
  );
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <motion.article
      key={project.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2 }}
      className="p-4 @lg:p-6"
      aria-labelledby={`project-${project.id}-title`}
    >
      <button type="button" onClick={onBack} className="os-btn mb-4 !min-h-8 !px-3 text-xs">
        <ArrowLeft className="size-3.5" aria-hidden /> All projects
      </button>

      <ProjectThumb project={project} className="aspect-[21/9] w-full rounded-xl border border-[var(--win-card-border)]" sizes="(max-width: 768px) 100vw, 900px" />

      <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="os-accent text-[11px] font-semibold uppercase tracking-[0.22em]">{project.tagline}</p>
          <h2 id={`project-${project.id}-title`} className="mt-1 font-display text-2xl font-semibold">
            {project.name}
          </h2>
        </div>
        <StatusBadge project={project} />
      </div>

      <div className="mt-5 grid gap-5 @3xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <section className="os-card p-4">
            <SectionTitle icon={Target}>Problem</SectionTitle>
            <p className="text-sm leading-relaxed">{project.problem}</p>
          </section>
          <section>
            <SectionTitle>Description</SectionTitle>
            <p className="text-[15px] leading-relaxed">{project.description}</p>
          </section>
          {project.features.length > 0 && (
            <section>
              <SectionTitle icon={CheckCircle2}>Key features</SectionTitle>
              <ul className="grid gap-2 @xl:grid-cols-2">
                {project.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm">
                    <CheckCircle2 className="os-accent mt-0.5 size-4 shrink-0" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {project.detailsPending && (
            <p className="os-card p-4 text-sm os-muted">
              Full details for this project — technologies, features and links — will be added soon.
            </p>
          )}
        </div>

        <aside className="space-y-4">
          {project.tech.length > 0 && (
            <section className="os-card p-4">
              <SectionTitle>Technologies</SectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <span key={tech} className="os-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}
          <section className="os-card p-4">
            <SectionTitle>Links</SectionTitle>
            <div className="flex flex-col gap-2">
              {project.demo && (
                <ExternalLink href={project.demo} className="os-btn os-btn-primary justify-start">
                  <ExternalIcon className="size-4" aria-hidden /> Live demo
                </ExternalLink>
              )}
              {project.github && (
                <ExternalLink href={project.github} className="os-btn justify-start">
                  <GithubIcon className="size-4" /> Source code
                </ExternalLink>
              )}
              {!project.demo && !project.github && (
                <p className="os-muted flex items-center gap-2 text-sm">
                  <Lock className="size-4" aria-hidden /> No public links available.
                </p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </motion.article>
  );
}

export default function ProjectsExplorer() {
  const { play } = useAudio();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string | null>(null);

  const categories = useMemo(() => {
    const used = new Set<ProjectCategory>();
    projects.forEach((project) => project.categories.forEach((category) => used.add(category)));
    return (Object.keys(projectCategoryLabels) as ProjectCategory[]).filter((category) => used.has(category));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      if (filter !== "all" && !project.categories.includes(filter)) return false;
      if (!q) return true;
      return [project.name, project.tagline, project.description, ...project.tech].some((value) => value.toLowerCase().includes(q));
    });
  }, [filter, query]);

  const current = projects.find((project) => project.id === selected) ?? null;

  const open = (id: string) => {
    play("click");
    setSelected(id);
  };

  return (
    <div className="@container flex h-full min-h-0 flex-col">
      {/* Address bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--win-divider)] px-3 py-2">
        <div className={cn("os-input !min-h-9 flex-1 items-center gap-2 !py-0 font-mono text-xs", current ? "flex" : "hidden @md:flex")}>
          <FolderOpen className="os-accent size-4 shrink-0" aria-hidden />
          <span className="truncate">
            C:\Users\Sashika\Projects{current ? `\\${current.id}` : filter !== "all" ? `\\${filter}` : ""}
          </span>
        </div>
        {!current && (
          <>
            <label className="relative flex-1 @xl:max-w-64">
              <span className="sr-only">Search projects</span>
              <Search className="os-muted pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name or tech…"
                className="os-input !min-h-9 !py-1.5 !pl-9 text-sm"
              />
            </label>
            <div className="flex gap-1" role="group" aria-label="View mode">
              <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={cn("os-btn !min-h-9 !px-2.5", view === "grid" && "!border-[var(--accent)]")}>
                <LayoutGrid className="size-4" aria-hidden />
                <span className="sr-only">Grid view</span>
              </button>
              <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={cn("os-btn !min-h-9 !px-2.5", view === "list" && "!border-[var(--accent)]")}>
                <List className="size-4" aria-hidden />
                <span className="sr-only">List view</span>
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <nav aria-label="Project categories" className="os-scroll hidden w-52 shrink-0 overflow-y-auto border-r border-[var(--win-divider)] p-3 @3xl:block">
          <p className="os-muted mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.22em]">Project tasks</p>
          {(["all", ...categories] as Filter[]).map((item) => {
            const count = item === "all" ? projects.length : projects.filter((p) => p.categories.includes(item)).length;
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setFilter(item);
                  setSelected(null);
                }}
                aria-current={filter === item ? "true" : undefined}
                className={cn(
                  "os-menu-item flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm",
                  filter === item && "bg-[var(--chip-bg)] font-semibold",
                )}
              >
                {item === "all" ? "All projects" : projectCategoryLabels[item]}
                <span className="os-muted text-xs">{count}</span>
              </button>
            );
          })}
          <p className="os-muted mb-2 mt-5 px-2 text-[10px] font-semibold uppercase tracking-[0.22em]">Other places</p>
          <ExternalLink href={getSocial("github").href} className="os-menu-item flex items-center gap-2 rounded-md px-2 py-1.5 text-sm">
            <GithubIcon className="size-4" /> GitHub profile
          </ExternalLink>
        </nav>

        <div className="os-scroll min-w-0 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            {current ? (
              <ProjectDetail key="detail" project={current} onBack={() => setSelected(null)} />
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 @lg:p-5">
                {/* Mobile / narrow filter chips */}
                <div className="-mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1 @3xl:hidden" role="group" aria-label="Filter projects">
                  {(["all", ...categories] as Filter[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={filter === item}
                      onClick={() => setFilter(item)}
                      className={cn("os-chip !py-1", filter === item && "!border-[var(--accent)] font-semibold")}
                    >
                      {item === "all" ? "All" : projectCategoryLabels[item]}
                    </button>
                  ))}
                </div>

                <p className="os-muted mb-3 text-xs" aria-live="polite">
                  {visible.length} {visible.length === 1 ? "project" : "projects"}
                </p>

                {visible.length === 0 ? (
                  <p className="os-card p-6 text-center text-sm os-muted">No projects match “{query}”.</p>
                ) : view === "grid" ? (
                  <ul className="grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-3">
                    {visible.map((project) => (
                      <li key={project.id}>
                        <button
                          type="button"
                          onClick={() => open(project.id)}
                          className="os-card os-card-interactive group flex h-full w-full flex-col overflow-hidden text-left"
                        >
                          <ProjectThumb project={project} className="aspect-[16/9] w-full" sizes="(max-width: 768px) 100vw, 360px" />
                          <span className="flex flex-1 flex-col p-4">
                            <span className="flex items-start justify-between gap-2">
                              <span className="font-semibold leading-snug">{project.name}</span>
                            </span>
                            <span className="os-muted mt-1 text-xs">{project.tagline}</span>
                            <span className="mt-3">
                              <StatusBadge project={project} />
                            </span>
                            {project.tech.length > 0 && (
                              <span className="mt-3 flex flex-wrap gap-1">
                                {project.tech.slice(0, 4).map((tech) => (
                                  <span key={tech} className="os-chip !px-2 !text-[11px]">
                                    {tech}
                                  </span>
                                ))}
                                {project.tech.length > 4 && <span className="os-muted self-center text-[11px]">+{project.tech.length - 4}</span>}
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="divide-y divide-[var(--win-divider)] os-card overflow-hidden">
                    {visible.map((project) => (
                      <li key={project.id}>
                        <button type="button" onClick={() => open(project.id)} className="os-menu-item flex w-full items-center gap-4 p-3 text-left">
                          <ProjectThumb project={project} className="aspect-video w-24 shrink-0 rounded-md" sizes="96px" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold">{project.name}</span>
                            <span className="os-muted block truncate text-xs">{project.tagline}</span>
                          </span>
                          <span className="hidden @xl:block">
                            <StatusBadge project={project} />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
