"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects, profile } from "@/data/portfolio";
import type { SoundName } from "@/lib/os/sound";
import { OSLogo } from "../ui/OSLogo";

interface BootSequenceProps {
  reducedMotion: boolean;
  onComplete: () => void;
  /** remember = visitor ticked "Always skip intro" */
  onSkip: (remember: boolean) => void;
  play: (name: SoundName) => void;
}

const BIOS_LINES = [
  "SASHIKA BIOS v2.0.26 — Cyber Edition",
  `Copyright (C) 2026 ${profile.name}. All rights reserved.`,
  "",
  "Processor ......... Curiosity Engine (always learning)",
  `Project storage ... ${projects.length} entries indexed`,
  "Stack ............. Next.js · React · TypeScript · Three.js",
  "Display ........... SASHIKA-CRT 3D @ cinematic",
  "",
  "Booting from PORTFOLIO://identity ...",
];

const INIT_MESSAGES = [
  "INITIALIZING SASHIKA OS...",
  "LOADING DIGITAL IDENTITY...",
  "CONNECTING TO PORTFOLIO NETWORK...",
  "PREPARING USER ENVIRONMENT...",
];

const STREAMS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  text: Array.from({ length: 48 }, (_, j) => ((i * 7 + j * 13) % 16).toString(16).toUpperCase()).join(""),
  left: i < 5 ? `${2 + i * 3.2}%` : `${82 + (i - 5) * 3.4}%`,
  dur: `${8 + (i % 4) * 2.5}s`,
  delay: `${-(i * 1.3)}s`,
}));

/**
 * Stage A — cinematic boot. ~4.5s, skippable (button, Esc, Enter, Space),
 * with a near-instant reduced-motion variant.
 */
export function BootSequence({ reducedMotion, onComplete, onSkip, play }: BootSequenceProps) {
  const [biosCount, setBiosCount] = useState(reducedMotion ? BIOS_LINES.length : 0);
  const [stage, setStage] = useState<"bios" | "load" | "ready">(reducedMotion ? "load" : "bios");
  const [initCount, setInitCount] = useState(reducedMotion ? INIT_MESSAGES.length : 0);
  const [rememberSkip, setRememberSkip] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setLeaving(true);
    setTimeout(onComplete, reducedMotion ? 150 : 450);
  }, [onComplete, reducedMotion]);

  const skip = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onSkip(rememberSkip);
  }, [onSkip, rememberSkip]);

  // Timeline
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    if (reducedMotion) {
      at(500, () => setStage("ready"));
      at(1300, finish);
    } else {
      BIOS_LINES.forEach((_, i) => at(420 + i * 120, () => setBiosCount(i + 1)));
      const loadStart = 420 + BIOS_LINES.length * 120 + 250;
      at(loadStart, () => setStage("load"));
      INIT_MESSAGES.forEach((_, i) => at(loadStart + 300 + i * 520, () => setInitCount(i + 1)));
      const readyAt = loadStart + 300 + INIT_MESSAGES.length * 520 + 150;
      at(readyAt, () => {
        setStage("ready");
        play("boot");
      });
      at(readyAt + 750, finish);
    }
    return () => timers.forEach(clearTimeout);
  }, [reducedMotion, finish, play]);

  // Keyboard skip
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        const target = event.target as HTMLElement | null;
        if (target?.tagName === "INPUT" || target?.tagName === "BUTTON") return;
        event.preventDefault();
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  const progress = stage === "ready" ? 100 : stage === "load" ? Math.round((initCount / (INIT_MESSAGES.length + 1)) * 100) : 4;

  return (
    <motion.section
      aria-label="SASHIKA OS is starting"
      className="fixed inset-0 z-50 overflow-hidden bg-[#010309] font-mono text-cyan-100"
      animate={{ opacity: leaving ? 0 : 1, scale: leaving && !reducedMotion ? 1.04 : 1 }}
      transition={{ duration: reducedMotion ? 0.15 : 0.45, ease: "easeInOut" }}
    >
      <div className={reducedMotion ? "absolute inset-0" : "boot-crt-on absolute inset-0"}>
        {/* Data streams */}
        {!reducedMotion && (
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {STREAMS.map((stream) => (
              <span
                key={stream.id}
                className="boot-stream absolute top-0 text-[11px] leading-none tracking-[0.3em] text-cyan-400/15"
                style={{ left: stream.left, ["--dur" as string]: stream.dur, ["--delay" as string]: stream.delay }}
              >
                {stream.text}
              </span>
            ))}
          </div>
        )}

        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(34,211,238,0.08),transparent_70%)]" />

        {/* BIOS console */}
        <AnimatePresence>
          {stage === "bios" && (
            <motion.div
              key="bios"
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="absolute left-6 top-6 max-w-[92vw] space-y-1 text-[12px] leading-relaxed sm:left-12 sm:top-12 sm:text-sm"
            >
              {BIOS_LINES.slice(0, biosCount).map((line, i) => (
                <p key={i} className={i === 0 ? "font-semibold text-cyan-300" : "text-cyan-100/75"}>
                  {line || "\u00a0"}
                </p>
              ))}
              <span className="caret-blink inline-block h-4 w-2 translate-y-0.5 bg-cyan-300" aria-hidden />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logo + loader */}
        <AnimatePresence>
          {stage !== "bios" && (
            <motion.div
              key="load"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.94, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6"
            >
              <OSLogo className="size-20 drop-shadow-[0_0_24px_rgba(34,211,238,0.55)] sm:size-24" />
              <h1 className="mt-6 text-center font-display text-3xl font-semibold tracking-[0.35em] text-white sm:text-4xl">
                SASHIKA<span className="text-cyan-300"> OS</span>
              </h1>
              <p className="mt-2 text-[11px] uppercase tracking-[0.5em] text-cyan-200/60">Cyber Edition</p>

              {/* XP-inspired block loader, reimagined */}
              <div
                role="progressbar"
                aria-label="Boot progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="boot-loader-track relative mt-10 h-5 w-56 overflow-hidden rounded-md p-[3px]"
              >
                {stage === "ready" ? (
                  <motion.div initial={{ width: "40%" }} animate={{ width: "100%" }} className="h-full rounded-sm bg-gradient-to-r from-cyan-400 to-blue-500" />
                ) : (
                  <div className="boot-loader-blocks flex h-full gap-[3px]">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-full w-3.5 rounded-[2px] bg-gradient-to-b from-cyan-200 via-cyan-400 to-blue-600 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 h-28 w-full max-w-md space-y-1.5 text-[11px] sm:text-xs" aria-live="polite">
                {INIT_MESSAGES.slice(0, initCount).map((message, i) => (
                  <motion.p
                    key={message}
                    initial={reducedMotion ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between gap-4 text-cyan-100/70"
                  >
                    <span>{message}</span>
                    <span className={i < initCount - 1 || stage === "ready" ? "text-emerald-300" : "text-cyan-300"}>
                      {i < initCount - 1 || stage === "ready" ? "[ OK ]" : "[ .. ]"}
                    </span>
                  </motion.p>
                ))}
                {stage === "ready" && (
                  <motion.p initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="pt-1 text-center font-semibold tracking-[0.4em] text-cyan-200">
                    SYSTEM READY.
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div aria-hidden className="crt-scanlines absolute inset-0" />
        <div aria-hidden className="crt-vignette absolute inset-0" />
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs sm:px-12">
        <label className="flex cursor-pointer items-center gap-2 text-cyan-100/60 hover:text-cyan-100">
          <input
            type="checkbox"
            checked={rememberSkip}
            onChange={(event) => setRememberSkip(event.target.checked)}
            className="size-3.5 accent-cyan-400"
          />
          Always skip intro on this device
        </label>
        <div className="flex items-center gap-4">
          <span className="hidden text-cyan-100/40 sm:inline">Press Esc to skip</span>
          <button
            type="button"
            onClick={skip}
            className="rounded-md border border-cyan-300/30 bg-cyan-300/5 px-4 py-2 font-semibold tracking-widest text-cyan-100 transition hover:border-cyan-300/70 hover:bg-cyan-300/10 focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            SKIP INTRO ›
          </button>
        </div>
      </div>
    </motion.section>
  );
}
