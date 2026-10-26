"use client";

import { Info, Palette, Wifi } from "lucide-react";
import { formatDate, formatTime, useClock } from "@/hooks/useClock";
import { windowApps, type WindowAppId } from "@/lib/os/apps";
import { cn } from "@/lib/utils";
import { SoundToggle } from "../AudioController";
import { useOS } from "../OSProvider";
import { AppIconTile } from "../ui/AppIcon";
import { OSLogo } from "../ui/OSLogo";
import { useWindowManager } from "./WindowManager";

interface TaskbarProps {
  startOpen: boolean;
  onToggleStart: () => void;
  startButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export function Taskbar({ startOpen, onToggleStart, startButtonRef }: TaskbarProps) {
  const { state, activeId, toggleFromTaskbar, minimizeAll, launch } = useWindowManager();
  const { theme, toggleTheme } = useOS();
  const now = useClock();
  const openIds = Object.keys(state.windows) as WindowAppId[];

  return (
    <nav aria-label="Taskbar" className="os-taskbar absolute inset-x-0 bottom-0 z-[900] flex items-stretch">
      <button
        ref={startButtonRef}
        type="button"
        onClick={onToggleStart}
        aria-haspopup="menu"
        aria-expanded={startOpen}
        aria-controls="start-menu"
        className={cn(
          "os-start-btn my-1.5 ml-1.5 flex items-center gap-2 rounded-xl pl-2 pr-4 text-sm font-semibold tracking-wide transition hover:brightness-110",
          startOpen && "brightness-125",
        )}
      >
        <OSLogo className="size-7" title="" />
        <span>{theme === "retro" ? "start" : "Start"}</span>
      </button>

      <ul className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-2" aria-label="Open windows">
        {openIds.map((id) => {
          const app = windowApps[id];
          const win = state.windows[id];
          const active = activeId === id && !win?.minimized;
          return (
            <li key={id}>
              <button
                type="button"
                data-active={active}
                onClick={() => toggleFromTaskbar(id)}
                aria-pressed={active}
                aria-label={`${app.title}${win?.minimized ? " (minimised)" : ""}`}
                className="os-task-btn flex h-9 max-w-[190px] items-center gap-2 rounded-lg px-2 text-left text-xs"
              >
                <AppIconTile app={app} size="sm" className="!size-6" />
                <span className="hidden truncate lg:inline">{app.title}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="os-tray flex items-center gap-0.5 px-2 text-xs">
        <span className="hidden items-center px-1.5 opacity-80 sm:flex" title="Connected to PORTFOLIO-NET">
          <Wifi className="size-4" aria-hidden />
          <span className="sr-only">Connected to portfolio network</span>
        </span>
        <SoundToggle className="rounded-md p-2 hover:bg-white/10" />
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-md p-2 hover:bg-white/10"
          aria-label={`Switch to ${theme === "cyber" ? "classic retro" : "modern cyber"} theme`}
          title="Toggle theme (Alt+Shift+Y)"
        >
          <Palette className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => launch("system")}
          className="hidden rounded-md p-2 hover:bg-white/10 sm:block"
          aria-label="System information"
          title="System information"
        >
          <Info className="size-4" aria-hidden />
        </button>
        <time
          className="ml-1 min-w-14 text-center leading-tight tabular-nums"
          dateTime={now?.toISOString()}
          title={now ? formatDate(now) : undefined}
        >
          {now ? formatTime(now) : "--:--"}
          <span className="block text-[10px] opacity-70">{now ? now.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}</span>
        </time>
        <button
          type="button"
          onClick={minimizeAll}
          className="ml-1.5 h-full w-2.5 border-l border-[var(--taskbar-border)] hover:bg-white/15"
          aria-label="Show desktop"
          title="Show desktop (Alt+Shift+D)"
        />
      </div>
    </nav>
  );
}
