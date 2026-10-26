"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FolderGit2, Mail, Menu, UserRound } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatTime, useClock } from "@/hooks/useClock";
import { profile } from "@/data/portfolio";
import { allApps, desktopOrder, getApp, windowApps, type AppId, type WindowAppId } from "@/lib/os/apps";
import { cn } from "@/lib/utils";
import { useOS } from "../OSProvider";
import { AppIconTile } from "../ui/AppIcon";
import { Avatar } from "../ui/Avatar";
import { OSLogo } from "../ui/OSLogo";
import { DesktopIcon } from "./DesktopIcon";
import { NotificationArea } from "./NotificationArea";
import { StartMenu } from "./StartMenu";
import { Taskbar } from "./Taskbar";
import { useWindowManager, WindowLayer } from "./WindowManager";

interface DesktopEnvironmentProps {
  isMobile: boolean;
  canUse3D: boolean;
  initialApp: WindowAppId | null;
  onLock: () => void;
  onRestart: () => void;
  onReplayIntro: () => void;
}

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const desktopApps = desktopOrder.map(getApp);

function Wallpaper() {
  return (
    <div aria-hidden className="os-wallpaper absolute inset-0 overflow-hidden">
      <div className="os-wallpaper-grid" />
      <div className="os-wallpaper-cyber absolute inset-0">
        {/* Emblem */}
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]">
          <OSLogo className="size-[min(42vw,420px)]" title="" />
        </div>
        <div className="absolute left-1/2 top-[40%] size-[min(60vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
        <div className="absolute left-1/2 top-[40%] size-[min(80vw,860px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet-300/[0.07]" />
        <p className="absolute bottom-[calc(var(--taskbar-h)+18px)] right-6 hidden text-right font-mono text-[10px] leading-relaxed tracking-[0.25em] text-cyan-200/30 md:block">
          SASHIKA OS · CYBER EDITION
          <br />
          {profile.location.toUpperCase()} · GUEST SESSION
        </p>
      </div>
    </div>
  );
}

function IdentityWidget({ onOpen }: { onOpen: (id: AppId) => void }) {
  const now = useClock();
  return (
    <aside aria-label="Profile widget" className="os-window absolute right-5 top-5 hidden w-72 !rounded-2xl p-4 xl:block">
      <div className="flex items-center gap-3">
        <Avatar className="size-12 border border-[var(--chip-border)]" sizes="48px" />
        <div className="min-w-0">
          <p className="truncate font-semibold">{profile.name}</p>
          <p className="os-muted truncate text-xs">{profile.role}</p>
        </div>
      </div>
      <p className="mt-3 font-display text-4xl font-light tabular-nums">{now ? formatTime(now) : "--:--"}</p>
      <p className="os-muted text-xs">{now ? now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) : "\u00a0"}</p>
      <span className="os-chip mt-3">
        <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden /> {profile.availability}
      </span>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" className="os-btn os-btn-primary !min-h-9 !px-2 text-xs" onClick={() => onOpen("projects")}>
          <FolderGit2 className="size-3.5" aria-hidden /> Projects
        </button>
        <button type="button" className="os-btn !min-h-9 !px-2 text-xs" onClick={() => onOpen("contact")}>
          <Mail className="size-3.5" aria-hidden /> Contact
        </button>
      </div>
    </aside>
  );
}

/** Stage D — the desktop (or a touch-first launcher on phones). */
export function DesktopEnvironment({ isMobile, canUse3D, initialApp, onLock, onRestart, onReplayIntro }: DesktopEnvironmentProps) {
  const { launch, minimizeAll, activeId, close, state, toggleFromTaskbar } = useWindowManager();
  const { notify, glitch, toggleTheme } = useOS();
  const [startOpen, setStartOpen] = useState(false);
  const [selected, setSelected] = useState<AppId | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const konami = useRef<string[]>([]);
  const booted = useRef(false);
  const now = useClock();

  const closeStart = useCallback(() => {
    setStartOpen(false);
    startButtonRef.current?.focus({ preventScroll: true });
  }, []);

  // First arrival: open deep-linked app + welcome notification
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    if (initialApp) launch(initialApp);
    const timer = setTimeout(
      () =>
        notify({
          title: "Welcome to SASHIKA OS",
          body: isMobile
            ? "Tap an app to explore. Use ‹ Home to come back here."
            : "Click an icon to explore. Tip: Alt+Shift+T opens the Terminal — try typing help.",
        }),
      900,
    );
    return () => clearTimeout(timer);
  }, [initialApp, isMobile, launch, notify]);

  // Global keyboard shortcuts + Konami easter egg
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";

      if (!typing) {
        konami.current = [...konami.current, event.key].slice(-KONAMI.length);
        if (konami.current.join(",") === KONAMI.join(",")) {
          konami.current = [];
          glitch();
          notify({ title: "Developer mode unlocked ✨", body: "Not really — but thanks for exploring. Try `ayubowan` in the Terminal." });
        }
      }

      if (event.key === "Escape" && startOpen) {
        closeStart();
        return;
      }

      if (!(event.altKey && event.shiftKey)) return;
      const app = allApps.find((item) => item.shortcut === event.code);
      if (app) {
        event.preventDefault();
        setStartOpen(false);
        launch(app.id);
        return;
      }
      if (event.code === "KeyM") {
        event.preventDefault();
        setStartOpen((open) => !open);
      } else if (event.code === "KeyD") {
        event.preventDefault();
        minimizeAll();
      } else if (event.code === "KeyY") {
        event.preventDefault();
        toggleTheme();
      } else if (event.code === "KeyW" && activeId) {
        event.preventDefault();
        close(activeId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startOpen, closeStart, launch, minimizeAll, toggleTheme, activeId, close, glitch, notify]);

  // Roving focus across desktop icons (arrow keys)
  const onIconKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const refs = iconRefs.current;
    const firstLeft = refs[0]?.offsetLeft ?? 0;
    const perColumn = Math.max(1, refs.filter((el) => el && el.offsetLeft === firstLeft).length);
    let next = index;
    if (event.key === "ArrowDown") next = index + 1;
    else if (event.key === "ArrowUp") next = index - 1;
    else if (event.key === "ArrowRight") next = index + perColumn;
    else if (event.key === "ArrowLeft") next = index - perColumn;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = refs.length - 1;
    else return;
    event.preventDefault();
    next = Math.max(0, Math.min(refs.length - 1, next));
    setFocusIndex(next);
    refs[next]?.focus();
  };

  const openIds = Object.keys(state.windows) as WindowAppId[];

  return (
    <div className="absolute inset-0 overflow-hidden" onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}>
      <Wallpaper />

      {isMobile ? (
        /* -------------------------- Mobile launcher -------------------------- */
        <div className="os-scroll absolute inset-0 flex flex-col overflow-y-auto pb-24">
          <header className="sticky top-0 z-10 flex items-center justify-between bg-black/30 px-4 py-2.5 text-xs backdrop-blur-md retro:bg-[#1f4fc4]/80 retro:text-white">
            <span className="flex items-center gap-2 font-semibold tracking-[0.2em]">
              <OSLogo className="size-5" title="" /> SASHIKA OS
            </span>
            <span className="tabular-nums">{now ? formatTime(now) : ""}</span>
          </header>

          <section aria-label="Profile" className="os-window mx-4 mt-4 !rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-14 border border-[var(--chip-border)]" sizes="56px" priority />
              <div className="min-w-0">
                <h1 className="truncate font-display text-lg font-semibold">{profile.name}</h1>
                <p className="os-muted truncate text-xs">
                  {profile.role} · {profile.location}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {(
                [
                  ["about", UserRound, "About"],
                  ["projects", FolderGit2, "Projects"],
                  ["contact", Mail, "Contact"],
                ] as const
              ).map(([id, Icon, label]) => (
                <button key={id} type="button" onClick={() => launch(id)} className={cn("os-btn !min-h-11 flex-col !gap-0.5 !px-1 text-xs", id === "projects" && "os-btn-primary")}>
                  <Icon className="size-4" aria-hidden /> {label}
                </button>
              ))}
            </div>
          </section>

          <nav aria-label="Apps" className="mt-6 px-3">
            <ul className="grid grid-cols-4 gap-x-1 gap-y-4">
              {desktopApps.map((app) => (
                <li key={app.id}>
                  <DesktopIcon app={app} variant="launcher" selected={selected === app.id} onSelect={() => setSelected(app.id)} onOpen={() => launch(app.id)} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : (
        /* ------------------------------ Desktop ------------------------------ */
        <>
          <nav aria-label="Desktop icons" className="absolute bottom-[var(--taskbar-h)] left-0 top-0 p-3">
            <ul className="grid h-full auto-cols-[92px] grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-x-1 gap-y-1">
              {desktopApps.map((app, index) => (
                <li key={app.id}>
                  <DesktopIcon
                    ref={(el) => {
                      iconRefs.current[index] = el;
                    }}
                    app={app}
                    tabIndex={index === focusIndex ? 0 : -1}
                    selected={selected === app.id}
                    onSelect={() => {
                      setSelected(app.id);
                      setFocusIndex(index);
                    }}
                    onOpen={() => launch(app.id)}
                    onKeyDown={onIconKeyDown(index)}
                  />
                </li>
              ))}
            </ul>
          </nav>
          <IdentityWidget onOpen={launch} />
        </>
      )}

      {/* Windows */}
      <WindowLayer isMobile={isMobile} />

      {/* Start menu */}
      <AnimatePresence>
        {startOpen && (
          <>
            <motion.div
              key="start-backdrop"
              className={cn("absolute inset-0 z-[940]", isMobile && "bg-black/40")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onPointerDown={() => setStartOpen(false)}
              aria-hidden
            />
            <StartMenu
              key="start-menu"
              isMobile={isMobile}
              canUse3D={canUse3D}
              onClose={closeStart}
              onLock={() => {
                setStartOpen(false);
                onLock();
              }}
              onRestart={() => {
                setStartOpen(false);
                onRestart();
              }}
              onReplayIntro={() => {
                setStartOpen(false);
                onReplayIntro();
              }}
            />
          </>
        )}
      </AnimatePresence>

      {isMobile ? (
        <nav aria-label="Dock" className="os-taskbar absolute inset-x-0 bottom-0 z-[900] flex items-center gap-2 px-3 pb-[env(safe-area-inset-bottom)]">
          <button
            type="button"
            onClick={() => setStartOpen((open) => !open)}
            aria-expanded={startOpen}
            aria-controls="start-menu"
            aria-label="Open start menu"
            className="os-start-btn grid size-10 place-items-center rounded-xl"
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <ul className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto" aria-label="Open apps">
            {openIds.map((id) => (
              <li key={id}>
                <button type="button" onClick={() => toggleFromTaskbar(id)} aria-label={`Switch to ${windowApps[id].title}`} className="os-task-btn grid size-10 place-items-center rounded-xl">
                  <AppIconTile app={windowApps[id]} size="sm" />
                </button>
              </li>
            ))}
          </ul>
          <span className="text-xs tabular-nums opacity-80">{now ? formatTime(now) : ""}</span>
        </nav>
      ) : (
        <Taskbar startOpen={startOpen} onToggleStart={() => setStartOpen((open) => !open)} startButtonRef={startButtonRef} />
      )}

      <NotificationArea isMobile={isMobile} />
    </div>
  );
}
