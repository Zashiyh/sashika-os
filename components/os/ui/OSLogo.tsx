import { useId } from "react";
import { cn } from "@/lib/utils";

/** SASHIKA OS mark — hexagon shell with a geometric "S" circuit glyph. */
export function OSLogo({ className, title = "SASHIKA OS" }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 64" className={cn("size-12", className)} role="img" aria-label={title}>
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="55%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path
        d="M32 3 57 17.5v29L32 61 7 46.5v-29Z"
        fill="rgba(34,211,238,0.06)"
        stroke={`url(#g-${id})`}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M32 9.5 51.5 20.8v22.4L32 54.5 12.5 43.2V20.8Z" fill="none" stroke="rgba(103,232,249,0.25)" strokeWidth="1" />
      <path
        d="M42 21H28a6 6 0 0 0 0 12h8a6 6 0 0 1 0 12H22"
        fill="none"
        stroke={`url(#g-${id})`}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="42" cy="21" r="2.6" fill="#67e8f9" />
      <circle cx="22" cy="45" r="2.6" fill="#8b5cf6" />
    </svg>
  );
}
