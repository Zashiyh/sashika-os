"use client";

import { Volume2, VolumeX } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { playSound, type SoundName } from "@/lib/os/sound";
import { readPref, storageKeys, writePref } from "@/lib/os/storage";
import { cn } from "@/lib/utils";

interface AudioContextValue {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  toggle: () => void;
  play: (name: SoundName) => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

/**
 * Owns the sound preference (off by default, remembered in localStorage) and
 * exposes `play()`, which is a no-op while sound is disabled.
 */
export function AudioProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(false);

  useEffect(() => {
    const stored = readPref(storageKeys.sound, ["on", "off"] as const, "off") === "on";
    if (stored) {
      const id = requestAnimationFrame(() => setEnabledState(true));
      return () => cancelAnimationFrame(id);
    }
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    writePref(storageKeys.sound, value ? "on" : "off");
    // Called from a click handler, so the AudioContext may start here.
    if (value) playSound("notify");
  }, []);

  const toggle = useCallback(() => setEnabled(!enabled), [enabled, setEnabled]);

  const play = useCallback(
    (name: SoundName) => {
      if (enabled) playSound(name);
    },
    [enabled],
  );

  const value = useMemo(() => ({ enabled, setEnabled, toggle, play }), [enabled, setEnabled, toggle, play]);
  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}

/** Stateless toggle — usable inside portals / separate React roots via props. */
export function SoundToggleButton({
  enabled,
  onToggle,
  className,
  showLabel = false,
}: {
  enabled: boolean;
  onToggle: () => void;
  className?: string;
  showLabel?: boolean;
}) {
  const Icon = enabled ? Volume2 : VolumeX;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute interface sounds" : "Enable interface sounds"}
      title={enabled ? "Sound on" : "Sound off"}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <Icon className="size-4" aria-hidden />
      {showLabel && <span>{enabled ? "Sound on" : "Sound off"}</span>}
    </button>
  );
}

export function SoundToggle({ className, showLabel }: { className?: string; showLabel?: boolean }) {
  const { enabled, toggle } = useAudio();
  return <SoundToggleButton enabled={enabled} onToggle={toggle} className={className} showLabel={showLabel} />;
}
