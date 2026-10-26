"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Accessibility, Box, LogIn, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { formatDate, formatTime, useClock } from "@/hooks/useClock";
import { profile } from "@/data/portfolio";
import type { SoundName } from "@/lib/os/sound";
import { cn } from "@/lib/utils";
import { SoundToggleButton } from "../AudioController";
import { Avatar } from "../ui/Avatar";
import { OSLogo } from "../ui/OSLogo";
import { AccessSequence } from "./AccessSequence";

export interface LockScreenProps {
  /** "monitor" = rendered on the 3D screen at a fixed resolution */
  variant: "monitor" | "fluid";
  reducedMotion: boolean;
  motionOverride: boolean;
  onToggleMotion: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  /** Whether the 3D monitor is currently shown, and whether it can be */
  threeD: { active: boolean; available: boolean; onToggle: () => void };
  play: (name: SoundName) => void;
  /** Called when the access animation finishes */
  onAccessGranted: () => void;
  /** Skip straight to the desktop and remember the preference */
  onSkipIntro: () => void;
}

const STATUS = [
  { label: "IDENTITY INTERFACE", value: "READY" },
  { label: "SESSION", value: "STANDBY" },
  { label: "NETWORK", value: "PORTFOLIO-NET" },
  { label: "MODE", value: "GUEST ACCESS" },
];

/**
 * Stage C — identity lock screen. Receives everything through props because
 * it can be rendered inside the 3D scene's separate React root.
 */
export function LockScreen({
  variant,
  reducedMotion,
  motionOverride,
  onToggleMotion,
  soundEnabled,
  onToggleSound,
  threeD,
  play,
  onAccessGranted,
  onSkipIntro,
}: LockScreenProps) {
  const now = useClock();
  const [signingIn, setSigningIn] = useState(false);

  const startSignIn = () => {
    play("click");
    setSigningIn(true);
  };

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
      <div
        className={cn(
          "@container relative isolate flex size-full flex-col overflow-hidden bg-[#030814] text-slate-100",
          variant === "monitor" && "select-none",
        )}
      >
        {/* Backdrop */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_40%,rgba(34,211,238,0.16),transparent_70%),radial-gradient(50%_50%_at_10%_90%,rgba(139,92,246,0.18),transparent_70%),linear-gradient(180deg,#040a1c,#02040b)]" />
          <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(103,232,249,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.25)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(70%_70%_at_60%_45%,#000,transparent)]" />
          <div className="crt-scanlines absolute inset-0" />
        </div>

        {/* Top bar */}
        <header className="flex items-center justify-between px-5 pt-4 @4xl:px-10 @4xl:pt-7">
          <div className="flex items-center gap-3">
            <OSLogo className="size-8 @4xl:size-10" />
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold tracking-[0.3em] text-white @4xl:text-base">SASHIKA OS</p>
              <p className="text-[10px] tracking-[0.35em] text-cyan-300/70">CYBER EDITION</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-300/5 px-3 py-1 text-[10px] tracking-[0.2em] text-emerald-200">
            <ShieldCheck className="size-3.5" aria-hidden />
            <span className="hidden @md:inline">SECURE WORKSTATION</span>
            <span className="@md:hidden">SECURE</span>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5 [&>*]:shrink-0 @4xl:grid @4xl:grid-cols-[1fr_minmax(0,400px)] @4xl:items-center @4xl:gap-10 @4xl:overflow-visible @4xl:px-10 @4xl:py-0">
          {/* Left — time + status */}
          <section aria-label="Workstation status" className="order-2 @4xl:order-1">
            <div className="hidden @4xl:block">
              <p className="font-display text-[64px] font-light leading-none tracking-tight text-white tabular-nums" aria-live="off">
                {now ? formatTime(now) : "--:--"}
              </p>
              <p className="mt-2 text-base text-slate-300">{now ? formatDate(now) : "\u00a0"}</p>
            </div>
            <div className="@4xl:hidden flex items-baseline justify-between">
              <p className="font-display text-4xl font-light text-white tabular-nums">{now ? formatTime(now) : "--:--"}</p>
              <p className="text-xs text-slate-400">{now ? formatDate(now) : ""}</p>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-2 @4xl:mt-7 @4xl:max-w-sm">
              {STATUS.map((item) => (
                <div key={item.label} className="rounded-lg border border-cyan-300/10 bg-cyan-300/[0.03] px-3 py-2">
                  <dt className="text-[9px] tracking-[0.25em] text-slate-500">{item.label}</dt>
                  <dd className="mt-0.5 font-mono text-[11px] text-cyan-200">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Right — identity card / access sequence */}
          <section
            aria-label="Identity card"
            className="order-1 relative overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#050c1d]/85 p-6 shadow-[0_0_60px_-20px_rgba(34,211,238,0.5)] backdrop-blur-xl @4xl:order-2 @4xl:p-7"
          >
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="mb-5 flex items-center justify-between gap-3 whitespace-nowrap text-[10px] tracking-[0.25em] text-slate-400">
              <span className="truncate">CYBERSEC AUTH<span className="hidden @md:inline">ENTICATION</span></span>
              <span className="shrink-0 font-mono text-cyan-300/70">ID · SM-2026</span>
            </div>

            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                {!signingIn ? (
                  <motion.div key="card" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                    <div className="flex items-center gap-5">
                      <div className="relative size-24 shrink-0">
                        <div aria-hidden className="avatar-ring absolute -inset-[3px] rounded-full opacity-80" />
                        <Avatar className="relative size-24 border-4 border-[#050c1d] text-2xl" priority sizes="96px" />
                        <span className="absolute bottom-1 right-1 size-3.5 rounded-full border-2 border-[#050c1d] bg-emerald-400" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <h1 className="font-display text-2xl font-semibold leading-tight text-white">{profile.name}</h1>
                        <p className="mt-1 text-sm text-cyan-200">{profile.role}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="size-3.5" aria-hidden /> {profile.location}
                        </p>
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-slate-300">{profile.shortIntro}</p>
                    <button
                      type="button"
                      onClick={startSignIn}
                      autoFocus={variant === "fluid"}
                      className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 font-semibold tracking-[0.25em] text-[#021018] shadow-[0_0_30px_-6px_rgba(34,211,238,0.8)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                    >
                      <LogIn className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
                      SIGN IN
                    </button>
                    <button
                      type="button"
                      onClick={onSkipIntro}
                      className="mt-3 w-full rounded-lg py-2 text-xs text-slate-400 transition hover:text-cyan-200"
                    >
                      
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="access" className="h-full min-h-[300px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <AccessSequence reducedMotion={reducedMotion} play={play} onComplete={onAccessGranted} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>

        {/* Footer controls */}
        <footer className="flex flex-wrap items-center justify-between gap-2 px-5 pb-4 text-[11px] text-slate-400 @4xl:px-10 @4xl:pb-6">
          <p className="hidden items-center gap-1.5 @md:flex">
            <Sparkles className="size-3.5 text-cyan-300/70" aria-hidden /> Guest session · interface animation only
          </p>
          <div className="flex items-center gap-1">
            <SoundToggleButton
              enabled={soundEnabled}
              onToggle={onToggleSound}
              showLabel
              className="rounded-md px-2.5 py-1.5 hover:bg-white/5 hover:text-cyan-100"
            />
            <button
              type="button"
              onClick={onToggleMotion}
              aria-pressed={motionOverride}
              className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-white/5 hover:text-cyan-100"
            >
              <Accessibility className="size-4" aria-hidden />
              {motionOverride || reducedMotion ? "Motion reduced" : "Reduce motion"}
            </button>
            {threeD.available && (
              <button
                type="button"
                onClick={threeD.onToggle}
                aria-pressed={threeD.active}
                className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-white/5 hover:text-cyan-100"
              >
                <Box className="size-4" aria-hidden />
                {threeD.active ? "3D on" : "3D off"}
              </button>
            )}
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
