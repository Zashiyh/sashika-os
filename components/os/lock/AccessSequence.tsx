"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Fingerprint, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "@/data/portfolio";
import type { SoundName } from "@/lib/os/sound";
import { Avatar } from "../ui/Avatar";

type Phase = "interface" | "verify" | "granted";

const VERIFY_STEPS = [
  { at: 0, label: "SESSION INITIALIZED" },
  { at: 0.4, label: "LOADING USER PROFILE" },
  { at: 0.75, label: "MOUNTING PORTFOLIO VOLUMES" },
];

interface AccessSequenceProps {
  reducedMotion: boolean;
  play: (name: SoundName) => void;
  onComplete: () => void;
}

/**
 * Simulated sign-in animation. Purely visual: nothing is requested,
 * collected, scanned or verified.
 */
export function AccessSequence({ reducedMotion, play, onComplete }: AccessSequenceProps) {
  const [phase, setPhase] = useState<Phase>("interface");
  const [typed, setTyped] = useState(reducedMotion ? profile.username.length : 0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    const typeStart = reducedMotion ? 0 : 350;
    const perChar = reducedMotion ? 0 : 55;
    if (!reducedMotion) {
      for (let i = 1; i <= profile.username.length; i += 1) {
        at(typeStart + i * perChar, () => {
          setTyped(i);
          play("key");
        });
      }
    }
    const verifyAt = reducedMotion ? 250 : typeStart + profile.username.length * perChar + 350;
    const verifyDuration = reducedMotion ? 300 : 1500;
    at(verifyAt, () => {
      setPhase("verify");
      play("scan");
    });
    const steps = 20;
    for (let i = 1; i <= steps; i += 1) {
      at(verifyAt + (verifyDuration / steps) * i, () => setProgress(i / steps));
    }
    const grantedAt = verifyAt + verifyDuration + 150;
    at(grantedAt, () => {
      setPhase("granted");
      play("granted");
    });
    at(grantedAt + (reducedMotion ? 500 : 1000), onComplete);
    return () => timers.forEach(clearTimeout);
  }, [reducedMotion, play, onComplete]);

  const currentStep = [...VERIFY_STEPS].reverse().find((step) => progress >= step.at) ?? VERIFY_STEPS[0];

  return (
    <div className="flex h-full flex-col" role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] text-cyan-300">
        <Fingerprint className="size-4" aria-hidden />
        {phase === "granted" ? "PORTFOLIO ACCESS GRANTED" : "IDENTITY INTERFACE READY"}
      </div>

      <AnimatePresence mode="wait">
        {phase !== "granted" ? (
          <motion.div
            key="working"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="mt-5 flex flex-1 flex-col"
          >
            <div className="flex items-center gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-cyan-300/30">
                <Avatar className="size-full rounded-none" />
                {phase === "verify" && (
                  <span aria-hidden className="scan-line absolute inset-x-0 h-0.5 bg-cyan-300 shadow-[0_0_12px_2px_rgba(34,211,238,0.9)]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Display name</p>
                <div className="mt-1 flex h-10 items-center rounded-lg border border-cyan-300/25 bg-black/40 px-3 font-mono text-sm text-cyan-100">
                  {profile.username.slice(0, typed)}
                  {phase === "interface" && <span className="caret-blink ml-0.5 inline-block h-4 w-[2px] bg-cyan-300" aria-hidden />}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-[11px] tracking-[0.2em]">
                <span className="flex items-center gap-2 text-cyan-200">
                  <ScanLine className="size-3.5" aria-hidden />
                  {phase === "verify" ? currentStep.label : "AWAITING VERIFICATION"}
                </span>
                <span className="font-mono text-slate-400">{Math.round(progress * 100)}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 transition-[width] duration-100"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <ul className="mt-4 space-y-1.5 font-mono text-[11px]">
                {VERIFY_STEPS.map((step) => {
                  const complete = progress > step.at + 0.2 || progress === 1;
                  const active = phase === "verify" && progress >= step.at;
                  return (
                    <li key={step.label} className={active ? "text-cyan-100" : "text-slate-500"}>
                      <span className={complete ? "text-emerald-300" : active ? "text-cyan-300" : ""}>{complete ? "✔" : active ? "›" : "·"}</span>{" "}
                      {step.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="granted"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.9, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-1 flex-col items-center justify-center text-center"
          >
            <CheckCircle2 className="size-14 text-emerald-300 drop-shadow-[0_0_18px_rgba(52,211,153,0.7)]" aria-hidden />
            <p className="mt-4 font-display text-3xl font-bold tracking-[0.25em] text-white">ACCESS GRANTED</p>
            <p className="mt-2 text-sm text-slate-300">Welcome to SASHIKA OS. Opening desktop…</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-4 text-[10px] text-slate-500">Visual sequence only — nothing is collected, scanned or verified.</p>
    </div>
  );
}
