"use client";

import { Briefcase, FolderGit2, Hammer, Mail } from "lucide-react";
import { experience, profile, publishedProjects } from "@/data/portfolio";
import { useWindowManager } from "../desktop/WindowManager";
import { AppShell, EmptyState, SectionTitle } from "./shared";

/** Shows verified experience only. Falls back to an honest empty state. */
export default function ExperienceApp() {
  const { launch } = useWindowManager();

  return (
    <AppShell>
      <header className="mb-5">
        <p className="os-accent text-[11px] font-semibold uppercase tracking-[0.25em]">Experience</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">Work & relevant activity</h1>
      </header>

      {experience.length > 0 ? (
        <ol className="relative space-y-4 border-l border-[var(--win-divider)] pl-5">
          {experience.map((item) => (
            <li key={`${item.organisation}-${item.period}`} className="relative">
              <span className="absolute -left-[27px] top-1.5 size-3 rounded-full border-2 border-[var(--accent)] bg-[var(--win-solid)]" aria-hidden />
              <p className="os-muted text-xs">{item.period}</p>
              <p className="font-semibold">{item.role}</p>
              <p className="os-accent text-sm">{item.organisation}</p>
              <p className="mt-1 text-sm leading-relaxed">{item.description}</p>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState icon={Briefcase} title="No professional roles listed yet">
          {profile.firstName} is a Software Engineering undergraduate currently looking for an IT / Software Engineering internship.
        </EmptyState>
      )}

      <section className="mt-6">
        <SectionTitle icon={Hammer}>Hands-on development</SectionTitle>
        <div className="os-card p-4">
          <p className="text-sm leading-relaxed">
            Practical experience so far comes from building and shipping projects —{" "}
            <strong>{publishedProjects.length} documented projects</strong> spanning full-stack web platforms, business management systems, a
            security operations dashboard, an AI chat app and Android / IoT applications.
          </p>
          <ul className="mt-3 grid gap-1.5 text-sm @xl:grid-cols-2">
            {profile.workWith.slice(0, 6).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="os-accent" aria-hidden>
                  ▹
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="os-btn os-btn-primary" onClick={() => launch("projects")}>
              <FolderGit2 className="size-4" aria-hidden /> Browse projects
            </button>
            <button type="button" className="os-btn" onClick={() => launch("contact")}>
              <Mail className="size-4" aria-hidden /> Discuss an internship
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
