"use client";

import { useSyncExternalStore } from "react";

/** SSR-safe media query hook. Returns `serverValue` during server render. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => undefined;
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : serverValue),
    () => serverValue,
  );
}

/** Phones and small tablets get the touch-first launcher layout. */
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");

export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
