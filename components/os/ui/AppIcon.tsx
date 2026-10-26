import type { OSApp } from "@/lib/os/apps";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

function AppGlyph({ app, className }: { app: OSApp; className?: string }) {
  if (app.kind === "window") return <app.icon className={className} aria-hidden="true" />;
  return app.id === "github" ? <GithubIcon className={className} /> : <LinkedinIcon className={className} />;
}

/** Glossy gradient tile used on the desktop, launcher, start menu and taskbar. */
export function AppIconTile({ app, size = "md", className }: { app: OSApp; size?: "sm" | "md" | "lg"; className?: string }) {
  const dims = size === "sm" ? "size-7 rounded-lg" : size === "lg" ? "size-14 rounded-2xl" : "size-12 rounded-xl";
  const glyph = size === "sm" ? "size-3.5" : size === "lg" ? "size-6" : "size-5.5";
  return (
    <span
      className={cn("os-icon-tile relative grid shrink-0 place-items-center text-white", dims, className)}
      style={{ ["--tint-a" as string]: app.tint[0], ["--tint-b" as string]: app.tint[1] }}
      aria-hidden="true"
    >
      <AppGlyph app={app} className={cn(glyph, "drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]")} />
      <span className="pointer-events-none absolute inset-x-1 top-0.5 h-1/2 rounded-[inherit] bg-gradient-to-b from-white/30 to-transparent" />
    </span>
  );
}
