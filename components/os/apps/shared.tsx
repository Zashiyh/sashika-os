import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Standard padded, container-query-aware app body. */
export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("@container min-h-full p-4 @lg:p-6", className)}>{children}</div>;
}

export function SectionTitle({ icon: Icon, children, className }: { icon?: LucideIcon; children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] os-muted", className)}>
      {Icon && <Icon className="size-3.5 os-accent" aria-hidden />}
      {children}
    </h3>
  );
}

export function EmptyState({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: ReactNode }) {
  return (
    <div className="os-card flex flex-col items-center px-6 py-8 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-[var(--chip-bg)] os-accent">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="mt-3 font-semibold">{title}</p>
      {children && <div className="os-muted mt-1.5 max-w-md text-sm leading-relaxed">{children}</div>}
    </div>
  );
}

export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const external = /^https?:/.test(href);
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
