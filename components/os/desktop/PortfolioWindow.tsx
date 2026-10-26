"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Copy, Minus, Square, X } from "lucide-react";
import { memo, useEffect, useRef, type ReactNode } from "react";
import { windowApps } from "@/lib/os/apps";
import type { WindowState } from "@/lib/os/windowReducer";
import { MIN_WINDOW } from "@/lib/os/windowReducer";
import { cn } from "@/lib/utils";
import { TASKBAR_HEIGHT, useWindowManager } from "./WindowManager";

interface PortfolioWindowProps {
  win: WindowState;
  zIndex: number;
  active: boolean;
  isMobile: boolean;
  children: ReactNode;
}

/**
 * A draggable, resizable, minimisable application window.
 * Dragging writes directly to the DOM (no re-render per pointer move) and
 * commits the final position to the reducer on release.
 */
function PortfolioWindowInner({ win, zIndex, active, isMobile, children }: PortfolioWindowProps) {
  const { close, focus, minimize, toggleMaximize, move, resize } = useWindowManager();
  const app = windowApps[win.id];
  const Icon = app.icon;
  const ref = useRef<HTMLDivElement>(null);
  const titleId = `window-title-${win.id}`;
  const fullscreen = isMobile || win.maximized;

  // Move keyboard focus into the window when it becomes active
  useEffect(() => {
    const el = ref.current;
    if (active && !win.minimized && el && !el.contains(document.activeElement)) {
      el.focus({ preventScroll: true });
    }
  }, [active, win.minimized]);

  const onTitlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    focus(win.id);
    if (fullscreen || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;
    const el = ref.current;
    if (!el) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = { x: win.x, y: win.y };
    let next = origin;
    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - TASKBAR_HEIGHT - 40;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

    const onMove = (e: PointerEvent) => {
      next = {
        x: Math.min(Math.max(origin.x + e.clientX - startX, -win.w + 140), maxX),
        y: Math.min(Math.max(origin.y + e.clientY - startY, 0), maxY),
      };
      el.style.left = `${next.x}px`;
      el.style.top = `${next.y}px`;
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (next !== origin) move(win.id, next.x, next.y);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const onResizePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const el = ref.current;
    if (!el) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = { w: win.w, h: win.h };
    let next = origin;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    const onMove = (e: PointerEvent) => {
      next = {
        w: Math.min(Math.max(origin.w + e.clientX - startX, MIN_WINDOW.w), window.innerWidth - win.x - 4),
        h: Math.min(Math.max(origin.h + e.clientY - startY, MIN_WINDOW.h), window.innerHeight - TASKBAR_HEIGHT - win.y - 4),
      };
      el.style.width = `${next.w}px`;
      el.style.height = `${next.h}px`;
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (next !== origin) resize(win.id, next.w, next.h);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && !(event.target as HTMLElement).closest("[data-keep-escape]")) {
      event.stopPropagation();
      close(win.id);
    }
  };

  const style: React.CSSProperties = fullscreen
    ? { left: 0, top: 0, width: "100%", height: `calc(100% - ${TASKBAR_HEIGHT}px)`, zIndex }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex };

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-labelledby={titleId}
      aria-hidden={win.minimized || undefined}
      inert={win.minimized}
      tabIndex={-1}
      data-active={active}
      data-mobile={isMobile || undefined}
      onPointerDownCapture={() => !active && focus(win.id)}
      onKeyDown={onKeyDown}
      className={cn(
        "os-window absolute flex flex-col overflow-hidden outline-none",
        fullscreen && "!rounded-none",
        isMobile && "!border-0",
        win.minimized && "pointer-events-none",
      )}
      style={style}
      initial={isMobile ? { opacity: 0, y: 40 } : { opacity: 0, scale: 0.92, y: 16 }}
      animate={
        win.minimized
          ? { opacity: 0, scale: 0.85, y: 120, transition: { duration: 0.22 } }
          : { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 380, damping: 32 } }
      }
      exit={{ opacity: 0, scale: isMobile ? 1 : 0.94, y: isMobile ? 40 : 8, transition: { duration: 0.16 } }}
    >
      {/* Title bar */}
      <div
        className={cn("os-titlebar flex h-11 shrink-0 items-center gap-2 pl-3 pr-1.5", !fullscreen && "cursor-grab active:cursor-grabbing")}
        onPointerDown={onTitlePointerDown}
        onDoubleClick={(e) => {
          if (!isMobile && !(e.target as HTMLElement).closest("button")) toggleMaximize(win.id);
        }}
      >
        {isMobile && (
          <button type="button" className="os-ctrl -ml-1 !flex !w-auto shrink-0 items-center gap-1 whitespace-nowrap px-2 text-sm" onClick={() => minimize(win.id)} aria-label="Back to home screen">
            <ChevronLeft className="size-4" aria-hidden /> Home
          </button>
        )}
        {!isMobile && <Icon className="size-4 shrink-0 opacity-90" aria-hidden />}
        <h2 id={titleId} className="min-w-0 flex-1 truncate text-[13px] font-semibold tracking-wide">
          {app.title}
        </h2>
        <div className="flex items-center gap-1">
          {!isMobile && (
            <>
              <button type="button" className="os-ctrl" onClick={() => minimize(win.id)} aria-label={`Minimise ${app.title}`} title="Minimise">
                <Minus className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                className="os-ctrl"
                onClick={() => toggleMaximize(win.id)}
                aria-label={win.maximized ? `Restore ${app.title}` : `Maximise ${app.title}`}
                title={win.maximized ? "Restore" : "Maximise"}
              >
                {win.maximized ? <Copy className="size-3" aria-hidden /> : <Square className="size-3" aria-hidden />}
              </button>
            </>
          )}
          <button type="button" className="os-ctrl" data-variant="close" onClick={() => close(win.id)} aria-label={`Close ${app.title}`} title="Close">
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="os-scroll relative min-h-0 flex-1 overflow-auto">{children}</div>

      {!fullscreen && (
        <div
          aria-hidden
          onPointerDown={onResizePointerDown}
          className="absolute bottom-0 right-0 size-4 cursor-se-resize touch-none [background:linear-gradient(135deg,transparent_50%,color-mix(in_srgb,var(--accent)_45%,transparent)_50%,transparent_62%,color-mix(in_srgb,var(--accent)_45%,transparent)_62%,transparent_74%)]"
        />
      )}
    </motion.div>
  );
}

export const PortfolioWindow = memo(PortfolioWindowInner);
