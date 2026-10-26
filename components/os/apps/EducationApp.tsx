"use client";

import { CheckCircle2, Compass, GraduationCap, MapPin, TrendingUp } from "lucide-react";
import { education, learningRoadmap } from "@/data/portfolio";
import { AppShell, SectionTitle } from "./shared";

export default function EducationApp() {
  return (
    <AppShell>
      <header className="mb-5">
        <p className="os-accent text-[11px] font-semibold uppercase tracking-[0.25em]">Education</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">Studies & learning roadmap</h1>
      </header>

      <div className="space-y-3">
        {education.map((item) => (
          <article key={item.institution} className="os-card relative overflow-hidden p-5">
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[var(--accent)] opacity-10 blur-2xl" />
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--chip-bg)] os-accent">
                <GraduationCap className="size-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="os-muted text-xs">{item.period}</p>
                <h2 className="text-lg font-semibold">{item.programme}</h2>
                <p className="os-accent text-sm font-medium">
                  {item.institution} ({item.shortName})
                </p>
                <p className="os-muted mt-1 flex items-center gap-1 text-xs">
                  <MapPin className="size-3" aria-hidden /> {item.location}
                </p>
                <p className="mt-3 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 @2xl:grid-cols-3">
        <section className="os-card p-4">
          <SectionTitle icon={CheckCircle2}>Completed / current</SectionTitle>
          <ul className="space-y-1.5 text-sm">
            {learningRoadmap.completed.map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="os-card p-4">
          <SectionTitle icon={TrendingUp}>Currently improving</SectionTitle>
          <ul className="space-y-1.5 text-sm">
            {learningRoadmap.improving.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="os-accent" aria-hidden>
                  →
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="os-card p-4">
          <SectionTitle icon={Compass}>Future direction</SectionTitle>
          <ul className="space-y-1.5 text-sm">
            {learningRoadmap.future.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="os-accent" aria-hidden>
                  ◇
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
