"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { readPref, storageKeys, writePref } from "@/lib/os/storage";

export type OSTheme = "cyber" | "retro";

export interface Toast {
  id: number;
  title: string;
  body?: string;
  tone?: "info" | "success" | "warning";
}

interface OSContextValue {
  theme: OSTheme;
  setTheme: (theme: OSTheme) => void;
  toggleTheme: () => void;
  /** System preference OR the in-OS "reduce motion" toggle */
  reducedMotion: boolean;
  motionOverride: boolean;
  setMotionOverride: (value: boolean) => void;
  /** Visitor chose to disable the 3D monitor */
  liteMode: boolean;
  setLiteMode: (value: boolean) => void;
  glitchKey: number;
  glitch: () => void;
  toasts: Toast[];
  notify: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
  sessionStart: number;
}

const OSContext = createContext<OSContextValue | null>(null);

export function OSProvider({ children }: { children: ReactNode }) {
  const systemReduced = usePrefersReducedMotion();
  const [theme, setThemeState] = useState<OSTheme>("cyber");
  const [motionOverride, setMotionOverrideState] = useState(false);
  const [liteMode, setLiteModeState] = useState(false);
  const [glitchKey, setGlitchKey] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sessionStart] = useState(() => Date.now());
  const toastId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  // Restore preferences after mount (keeps server and first client render identical)
  useEffect(() => {
    const storedTheme = readPref(storageKeys.theme, ["cyber", "retro"] as const, "cyber");
    const storedLite = readPref(storageKeys.liteMode, ["on", "off"] as const, "off") === "on";
    const storedMotion = readPref("reduce-motion", ["on", "off"] as const, "off") === "on";
    const id = requestAnimationFrame(() => {
      setThemeState(storedTheme);
      setLiteModeState(storedLite);
      setMotionOverrideState(storedMotion);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  const reducedMotion = systemReduced || motionOverride;

  const glitch = useCallback(() => {
    if (!reducedMotion) setGlitchKey((key) => key + 1);
  }, [reducedMotion]);

  const setTheme = useCallback(
    (next: OSTheme) => {
      setThemeState(next);
      writePref(storageKeys.theme, next);
      glitch();
    },
    [glitch],
  );

  const toggleTheme = useCallback(() => setTheme(theme === "cyber" ? "retro" : "cyber"), [theme, setTheme]);

  const setMotionOverride = useCallback((value: boolean) => {
    setMotionOverrideState(value);
    writePref("reduce-motion", value ? "on" : "off");
  }, []);

  const setLiteMode = useCallback((value: boolean) => {
    setLiteModeState(value);
    writePref(storageKeys.liteMode, value ? "on" : "off");
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const notify = useCallback(
    (toast: Omit<Toast, "id">) => {
      toastId.current += 1;
      const id = toastId.current;
      setToasts((list) => [...list.slice(-2), { ...toast, id }]);
      timers.current.set(
        id,
        setTimeout(() => dismissToast(id), 6500),
      );
    },
    [dismissToast],
  );

  const value = useMemo<OSContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      reducedMotion,
      motionOverride,
      setMotionOverride,
      liteMode,
      setLiteMode,
      glitchKey,
      glitch,
      toasts,
      notify,
      dismissToast,
      sessionStart,
    }),
    [theme, setTheme, toggleTheme, reducedMotion, motionOverride, setMotionOverride, liteMode, setLiteMode, glitchKey, glitch, toasts, notify, dismissToast, sessionStart],
  );

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export function useOS(): OSContextValue {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used inside <OSProvider>");
  return ctx;
}
