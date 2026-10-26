"use client";

import { useEffect, useState } from "react";

/**
 * Returns the current Date, updated on the minute (or every second when
 * `withSeconds` is true). Returns null until mounted to avoid hydration
 * mismatches between server and client time.
 */
export function useClock(withSeconds = false): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = new Date();
      setNow(current);
      const delay = withSeconds ? 1000 - current.getMilliseconds() : (60 - current.getSeconds()) * 1000 - current.getMilliseconds();
      timeout = setTimeout(tick, delay + 5);
    };
    tick();
    return () => clearTimeout(timeout);
  }, [withSeconds]);

  return now;
}

export const formatTime = (date: Date, seconds = false) =>
  date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", ...(seconds ? { second: "2-digit" } : {}) });

export const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
