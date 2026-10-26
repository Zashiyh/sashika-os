"use client";

import { Compass, FolderGit2, Mail, MapPin, Rocket, Shield, Sparkles, Target, Wrench } from "lucide-react";
import { getSocial, profile } from "@/data/portfolio";
import { useWindowManager } from "../desktop/WindowManager";
import { Avatar } from "../ui/Avatar";
import { GithubIcon } from "../ui/BrandIcons";
import { AppShell, ExternalLink, SectionTitle } from "./shared";

const principleIcons = [Rocket, Wrench, Shield, Sparkles];

export default function AboutApp() {
  const { launch } = useWindowManager();

  return (
    <AppShell>
      {/* Header */}
      <header className="os-card relative overflow-hidden p-5 @2xl:p-6">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-[var(--accent)] opacity-10 blur-3xl" />
        <div className="flex flex-col gap-5 @xl:flex-row @xl:items-center">
          <Avatar className="size-24 shrink-0 border-2 border-[var(--chip-border)] text-2xl @2xl:size-28" sizes="112px" />
          <div className="min-w-0 flex-1">
            <p className="os-accent text-[11px] font-semibold uppercase tracking-[0.25em]">About me</p>
            <h1 className="mt-1 font-display text-2xl font-semibold @2xl:text-3xl">{profile.name}</h1>
            <p className="mt-1 text-sm">{profile.role}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="os-chip">
                <MapPin className="size-3" aria-hidden /> {profile.location}
              </span>
              <span className="os-chip">
                <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden /> {profile.availability}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="os-btn os-btn-primary" onClick={() => launch("projects")}>
            <FolderGit2 className="size-4" aria-hidden /> View projects
          </button>
          <button type="button" className="os-btn" onClick={() => launch("contact")}>
            <Mail className="size-4" aria-hidden /> Contact me
          </button>
          <ExternalLink href={getSocial("github").href} className="os-btn">
            <GithubIcon className="size-4" /> GitHub
          </ExternalLink>
        </div>
      </header>

      <div className="mt-5 grid gap-5 @3xl:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="about-intro">
          <SectionTitle icon={Sparkles}>
            <span id="about-intro">Introduction</span>
          </SectionTitle>
          <div className="space-y-3 text-[15px] leading-relaxed">
            {profile.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <div className="space-y-5">
          <section className="os-card p-4" aria-labelledby="about-learning">
            <SectionTitle icon={Compass}>
              <span id="about-learning">Currently learning</span>
            </SectionTitle>
            <div className="flex flex-wrap gap-2">
              {profile.learning.map((item) => (
                <span key={item} className="os-chip">
                  {item}
                </span>
              ))}
            </div>
          </section>
          <section className="os-card p-4" aria-labelledby="about-looking">
            <SectionTitle icon={Target}>
              <span id="about-looking">Internship interests</span>
            </SectionTitle>
            <ul className="grid gap-1.5 text-sm">
              {profile.lookingFor.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="os-accent" aria-hidden>
                    ▹
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="mt-6" aria-labelledby="about-principles">
        <SectionTitle>
          <span id="about-principles">How I work</span>
        </SectionTitle>
        <div className="grid gap-3 @xl:grid-cols-2">
          {profile.principles.map((item, index) => {
            const Icon = principleIcons[index % principleIcons.length];
            return (
              <div key={item.title} className="os-card flex gap-3 p-4">
                <Icon className="os-accent mt-0.5 size-5 shrink-0" aria-hidden />
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="os-muted mt-1 text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-5 @3xl:grid-cols-2">
        <div>
          <SectionTitle icon={Wrench}>What I work with</SectionTitle>
          <ul className="grid gap-1.5 text-sm">
            {profile.workWith.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="os-accent" aria-hidden>
                  ▹
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="os-card p-4">
          <SectionTitle icon={Target}>Career direction</SectionTitle>
          <p className="text-sm leading-relaxed">{profile.careerGoal}</p>
        </div>
      </section>
    </AppShell>
  );
}
