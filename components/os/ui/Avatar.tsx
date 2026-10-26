import Image from "next/image";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * Profile photo with a built-in placeholder. Set `profile.photo` to null in
 * data/portfolio.ts to show the placeholder until a real photo is available.
 */
export function Avatar({ className, sizes = "160px", priority = false }: { className?: string; sizes?: string; priority?: boolean }) {
  if (!profile.photo) {
    return (
      <div
        role="img"
        aria-label={`${profile.name} — photo placeholder`}
        className={cn(
          "grid place-items-center rounded-full bg-gradient-to-br from-cyan-500/30 via-blue-600/30 to-violet-600/30 font-display font-semibold text-cyan-100",
          className,
        )}
      >
        <span className="text-[length:inherit]">SM</span>
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden rounded-full bg-slate-900", className)}>
      <Image src={profile.photo} alt={profile.name} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
