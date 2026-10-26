"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useOS } from "../OSProvider";

/** Toast notifications above the system tray. */
export function NotificationArea({ isMobile }: { isMobile: boolean }) {
  const { toasts, dismissToast } = useOS();
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        isMobile
          ? "pointer-events-none absolute inset-x-3 bottom-[calc(var(--taskbar-h)+12px)] z-[960] flex flex-col gap-2"
          : "pointer-events-none absolute bottom-[calc(var(--taskbar-h)+12px)] right-3 z-[960] flex w-80 flex-col gap-2"
      }
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: isMobile ? 0 : 40, y: isMobile ? 12 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: isMobile ? 0 : 40, transition: { duration: 0.15 } }}
            data-mobile={isMobile || undefined}
            className="os-window pointer-events-auto flex gap-3 !rounded-xl p-3"
          >
            <Bell className="os-accent mt-0.5 size-4 shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.body && <p className="os-muted mt-0.5 text-xs leading-relaxed">{toast.body}</p>}
            </div>
            <button type="button" onClick={() => dismissToast(toast.id)} className="os-muted -m-1 h-fit rounded p-1 hover:text-[var(--win-fg)]" aria-label="Dismiss notification">
              <X className="size-3.5" aria-hidden />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
