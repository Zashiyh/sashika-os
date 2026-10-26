/** Safe localStorage helpers — never throw (private mode, disabled storage, SSR). */

const PREFIX = "sashika-os:";

export const storageKeys = {
  skipIntro: "skip-intro",
  theme: "theme",
  sound: "sound",
  liteMode: "lite-mode",
} as const;

export function readPref<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(PREFIX + key);
    return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writePref(key: string, value: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.localStorage.removeItem(PREFIX + key);
    else window.localStorage.setItem(PREFIX + key, value);
  } catch {
    /* storage unavailable — preference simply isn't remembered */
  }
}
