"use client";

import { Keyboard, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import pkg from "@/package.json";
import { profile, projects } from "@/data/portfolio";
import { allApps, shortcutLabel } from "@/lib/os/apps";
import { useOS } from "../OSProvider";
import { OSLogo } from "../ui/OSLogo";
import { AppShell, SectionTitle } from "./shared";

const deps = pkg.dependencies as Record<string, string>;
const version = (name: string) => (deps[name] ?? "").replace(/^[\^~]/, "");

function formatUptime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return h ? `${h}h ${m % 60}m` : m ? `${m}m ${s % 60}s` : `${s}s`;
}

/** "System Properties" — portfolio info, build stack and keyboard shortcuts. */
export default function SystemInfoApp() {
  const { theme, reducedMotion, liteMode, sessionStart } = useOS();
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const tick = () => setUptime(Date.now() - sessionStart);
    const first = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(id);
    };
  }, [sessionStart]);

  const rows: [string, string][] = [
    ["Operating system", "SASHIKA OS — Cyber Edition"],
    ["Version", "2.0 (build 2026.10)"],
    ["Registered to", profile.name],
    ["Role", profile.role],
    ["Location", profile.location],
    ["Projects indexed", String(projects.length)],
    ["Theme", theme === "cyber" ? "Modern cyber" : "Classic retro"],
    ["Display mode", liteMode ? "2D (3D disabled by visitor)" : "3D monitor when supported"],
    ["Motion", reducedMotion ? "Reduced" : "Full"],
    ["Session uptime", formatUptime(uptime)],
  ];

  const stack: [string, string][] = [
    ["Next.js", version("next")],
    ["React", version("react")],
    ["TypeScript", "5"],
    ["Tailwind CSS", "4"],
    ["Three.js", version("three")],
    ["React Three Fiber", version("@react-three/fiber")],
    ["Framer Motion", version("framer-motion")],
  ];

  return (
    <AppShell>
      <div className="flex items-center gap-4">
        <OSLogo className="size-16" />
        <div>
          <h1 className="font-display text-xl font-semibold">SASHIKA OS</h1>
          <p className="os-muted text-sm">A portfolio operating system by {profile.name}</p>
        </div>
      </div>

      <section className="os-card mt-5 p-4">
        <SectionTitle icon={Monitor}>System</SectionTitle>
        <dl className="grid gap-y-1.5 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[9.5rem_1fr] gap-3">
              <dt className="os-muted">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="os-card mt-4 p-4">
        <SectionTitle>Built with</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {stack.map(([name, v]) => (
            <span key={name} className="os-chip">
              {name} {v && <span className="opacity-60">{v}</span>}
            </span>
          ))}
        </div>
      </section>

      <section className="os-card mt-4 p-4">
        <SectionTitle icon={Keyboard}>Keyboard shortcuts</SectionTitle>
        <dl className="grid gap-y-1 text-sm @md:grid-cols-2 @md:gap-x-6">
          {allApps
            .filter((app) => app.shortcut)
            .map((app) => (
              <div key={app.id} className="flex justify-between gap-3">
                <dt>{app.title}</dt>
                <dd>
                  <kbd className="os-chip !rounded !px-1.5 font-mono !text-[11px]">{shortcutLabel(app.shortcut)}</kbd>
                </dd>
              </div>
            ))}
          {[
            ["Start menu", "Alt+Shift+M"],
            ["Show desktop", "Alt+Shift+D"],
            ["Close active window", "Esc"],
            ["Toggle theme", "Alt+Shift+Y"],
          ].map(([label, keys]) => (
            <div key={label} className="flex justify-between gap-3">
              <dt>{label}</dt>
              <dd>
                <kbd className="os-chip !rounded !px-1.5 font-mono !text-[11px]">{keys}</kbd>
              </dd>
            </div>
          ))}
        </dl>
        <p className="os-muted mt-3 text-xs">Psst… the terminal has a few hidden commands, and there might be a classic code hidden somewhere. ↑↑↓↓</p>
      </section>
    </AppShell>
  );
}
