"use client";

import { forwardRef } from "react";
import type { OSApp } from "@/lib/os/apps";
import { shortcutLabel } from "@/lib/os/apps";
import { cn } from "@/lib/utils";
import { AppIconTile } from "../ui/AppIcon";

interface DesktopIconProps {
  app: OSApp;
  selected: boolean;
  variant?: "desktop" | "launcher";
  tabIndex?: number;
  onSelect: () => void;
  onOpen: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * Desktop shortcut. Single click opens (XP's "single-click to open" option —
 * friendlier for portfolio visitors); Enter/Space also open.
 */
export const DesktopIcon = forwardRef<HTMLButtonElement, DesktopIconProps>(function DesktopIcon(
  { app, selected, variant = "desktop", tabIndex, onSelect, onOpen, onKeyDown },
  ref,
) {
  const external = app.kind === "link";
  return (
    <button
      ref={ref}
      type="button"
      tabIndex={tabIndex}
      data-selected={selected}
      onFocus={onSelect}
      onClick={() => {
        onSelect();
        onOpen();
      }}
      onKeyDown={onKeyDown}
      title={`${app.description}${app.shortcut ? ` (${shortcutLabel(app.shortcut)})` : ""}`}
      aria-label={`${app.label}${external ? " (opens in a new tab)" : ""}`}
      className={cn(
        "os-icon group relative flex flex-col items-center gap-1.5 rounded-xl p-1.5 text-center outline-none transition",
        variant === "desktop" ? "w-[92px]" : "w-full",
      )}
    >
      <span
        aria-hidden
        className="os-icon-glow pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_50%_35%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_70%)] opacity-0 transition"
      />
      <span className="relative transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-95">
        <AppIconTile app={app} size={variant === "launcher" ? "lg" : "md"} />
        {external && (
          <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full bg-white text-[9px] font-bold text-slate-900 shadow" aria-hidden>
            ↗
          </span>
        )}
      </span>
      <span
        className={cn(
          "os-icon-label relative rounded px-1 text-[12px] font-medium leading-tight",
          variant === "launcher" && "text-[11.5px]",
        )}
      >
        {app.label}
      </span>
    </button>
  );
});
