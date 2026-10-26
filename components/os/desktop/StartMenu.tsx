"use client";

import { motion } from "framer-motion";
import { Accessibility, Box, ExternalLink, Info, LockKeyhole, Mail, Palette, Power, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSocial, profile } from "@/data/portfolio";
import { allApps, desktopOrder, getApp, shortcutLabel, type AppId } from "@/lib/os/apps";
import { cn } from "@/lib/utils";
import { SoundToggle } from "../AudioController";
import { useOS } from "../OSProvider";
import { AppIconTile } from "../ui/AppIcon";
import { Avatar } from "../ui/Avatar";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { useWindowManager } from "./WindowManager";

interface StartMenuProps {
  onClose: () => void;
  onLock: () => void;
  onRestart: () => void;
  onReplayIntro: () => void;
  isMobile: boolean;
  canUse3D: boolean;
}

export function StartMenu({ onClose, onLock, onRestart, onReplayIntro, isMobile, canUse3D }: StartMenuProps) {
  const { launch } = useWindowManager();
  const { theme, toggleTheme, motionOverride, setMotionOverride, liteMode, setLiteMode } = useOS();
  const [query, setQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus({ preventScroll: true });
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pinned = desktopOrder.map(getApp).filter((app) => app.kind === "window");
    if (!q) return pinned;
    return allApps.filter((app) => `${app.title} ${app.description}`.toLowerCase().includes(q));
  }, [query]);

  const run = (id: AppId) => {
    launch(id);
    onClose();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>("[data-menu-item]") ?? []);
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = event.key === "ArrowDown" ? index + 1 : index - 1;
      const target = items[(next + items.length) % items.length];
      if (target) {
        event.preventDefault();
        target.focus();
      }
    }
  };

  const sideItem = "os-menu-item flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px]";

  return (
    <motion.div
      id="start-menu"
      ref={menuRef}
      role="menu"
      aria-label="Start menu"
      onKeyDown={onKeyDown}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.12 } }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className={cn(
        "os-menu absolute z-[950] flex flex-col overflow-hidden",
        isMobile
          ? "inset-x-2 bottom-2 max-h-[85dvh] rounded-2xl"
          : "bottom-[calc(var(--taskbar-h)+8px)] left-2 max-h-[min(640px,calc(100dvh-80px))] w-[min(520px,calc(100vw-16px))] rounded-2xl retro:rounded-t-lg retro:rounded-b-none",
      )}
    >
      {/* Header */}
      <div className="os-menu-header flex items-center gap-3 px-4 py-3">
        <Avatar className="size-12 border-2 border-white/60" sizes="48px" />
        <div className="min-w-0">
          <p className="truncate font-display font-semibold">{profile.name}</p>
          <p className="truncate text-xs opacity-80">{profile.role}</p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[1.25fr_1fr]">
        {/* Apps */}
        <div className="os-scroll min-h-0 overflow-y-auto p-2">
          <label className="relative mb-2 block">
            <span className="sr-only">Search apps</span>
            <Search className="os-muted pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" aria-hidden />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && results[0]) run(results[0].id);
              }}
              placeholder="Search apps…"
              className="os-input !min-h-9 !py-1.5 !pl-9 text-sm"
            />
          </label>
          <ul role="none" className="space-y-0.5">
            {results.map((app) => (
              <li role="none" key={app.id}>
                <button type="button" role="menuitem" data-menu-item onClick={() => run(app.id)} className="os-menu-item flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left">
                  <AppIconTile app={app} size="sm" className="!size-8" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">{app.title}</span>
                    <span className="os-muted block truncate text-[11px]">{app.description}</span>
                  </span>
                  {app.shortcut && !isMobile && <kbd className="os-muted hidden font-mono text-[10px] md:inline">{shortcutLabel(app.shortcut)?.replace("Alt+Shift+", "⇧⌥")}</kbd>}
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="os-muted px-2 py-3 text-sm">No apps match “{query}”.</li>}
          </ul>
        </div>

        {/* Places & settings */}
        <div className="os-menu-side os-scroll min-h-0 overflow-y-auto border-t border-[var(--win-divider)] p-2 sm:border-l sm:border-t-0">
          <a role="menuitem" data-menu-item href={getSocial("github").href} target="_blank" rel="noopener noreferrer" className={sideItem} onClick={onClose}>
            <GithubIcon className="size-4" /> GitHub <ExternalLink className="ml-auto size-3 opacity-60" aria-hidden />
          </a>
          <a role="menuitem" data-menu-item href={getSocial("linkedin").href} target="_blank" rel="noopener noreferrer" className={sideItem} onClick={onClose}>
            <LinkedinIcon className="size-4" /> LinkedIn <ExternalLink className="ml-auto size-3 opacity-60" aria-hidden />
          </a>
          <a role="menuitem" data-menu-item href={`mailto:${profile.email}`} className={sideItem}>
            <Mail className="size-4" aria-hidden /> Email me
          </a>
          <button type="button" role="menuitem" data-menu-item className={sideItem} onClick={() => run("system")}>
            <Info className="size-4" aria-hidden /> System info
          </button>

          <div className="my-2 border-t border-[var(--win-divider)]" />

          <button type="button" role="menuitemcheckbox" aria-checked={theme === "retro"} data-menu-item className={sideItem} onClick={toggleTheme}>
            <Palette className="size-4" aria-hidden /> {theme === "cyber" ? "Classic retro theme" : "Modern cyber theme"}
          </button>
          <SoundToggle showLabel className={sideItem} />
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={motionOverride}
            data-menu-item
            className={sideItem}
            onClick={() => setMotionOverride(!motionOverride)}
          >
            <Accessibility className="size-4" aria-hidden /> {motionOverride ? "Restore motion" : "Reduce motion"}
          </button>
          {canUse3D && (
            <button type="button" role="menuitemcheckbox" aria-checked={!liteMode} data-menu-item className={sideItem} onClick={() => setLiteMode(!liteMode)}>
              <Box className="size-4" aria-hidden /> {liteMode ? "Enable 3D monitor" : "Disable 3D monitor"}
            </button>
          )}
          <button type="button" role="menuitem" data-menu-item className={sideItem} onClick={onReplayIntro}>
            <RotateCcw className="size-4" aria-hidden /> Replay intro
          </button>
          <a role="menuitem" data-menu-item href="/classic" className={sideItem}>
            <ExternalLink className="size-4" aria-hidden /> Classic website
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-1 border-t border-[var(--win-divider)] bg-[var(--menu-side)] px-2 py-1.5 retro:bg-[linear-gradient(180deg,#4282d6,#1d5bbf)] retro:text-white">
        <button type="button" role="menuitem" data-menu-item onClick={onLock} className="os-menu-item flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px]">
          <LockKeyhole className="size-4" aria-hidden /> Lock
        </button>
        <button type="button" role="menuitem" data-menu-item onClick={onRestart} className="os-menu-item flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px]">
          <Power className="size-4" aria-hidden /> Restart
        </button>
      </div>
    </motion.div>
  );
}
