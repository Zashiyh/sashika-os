"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { WindowAppId } from "@/lib/os/apps";

function AppLoading() {
  return (
    <div className="grid h-full min-h-40 place-items-center" role="status">
      <span className="os-muted flex items-center gap-2 text-sm">
        <span className="size-2 animate-pulse rounded-full bg-[var(--accent)]" aria-hidden /> Loading…
      </span>
    </div>
  );
}

/** Each app is code-split and only downloaded when its window first opens. */
const apps: Record<WindowAppId, ComponentType> = {
  about: dynamic(() => import("./AboutApp"), { loading: AppLoading }),
  projects: dynamic(() => import("./ProjectsExplorer"), { loading: AppLoading }),
  skills: dynamic(() => import("./SkillsWindow"), { loading: AppLoading }),
  experience: dynamic(() => import("./ExperienceApp"), { loading: AppLoading }),
  education: dynamic(() => import("./EducationApp"), { loading: AppLoading }),
  certificates: dynamic(() => import("./CertificatesApp"), { loading: AppLoading }),
  contact: dynamic(() => import("./ContactWindow"), { loading: AppLoading }),
  terminal: dynamic(() => import("./TerminalWindow"), { loading: AppLoading }),
  system: dynamic(() => import("./SystemInfoApp"), { loading: AppLoading }),
};

export function AppContent({ id }: { id: WindowAppId }) {
  const App = apps[id];
  return <App />;
}
