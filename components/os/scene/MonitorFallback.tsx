"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SCREEN } from "./constants";

interface MonitorFallbackProps {
  screen: ReactNode;
  zooming: boolean;
  reducedMotion: boolean;
  /** "framed" = CSS monitor (tablet/desktop without WebGL); "full" = phones */
  layout: "framed" | "full";
  onZoomComplete: () => void;
}

/**
 * 2D fallback for the 3D monitor: a CSS-rendered monitor with a perspective
 * tilt and screen-reveal, or a full-screen reveal on phones.
 */
export function MonitorFallback({ screen, zooming, reducedMotion, layout, onZoomComplete }: MonitorFallbackProps) {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    if (layout !== "framed") return;
    const update = () => {
      const maxW = window.innerWidth * 0.86;
      const maxH = window.innerHeight * 0.7;
      setScale(Math.min(maxW / SCREEN.px.w, maxH / SCREEN.px.h, 1.15));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [layout]);

  useEffect(() => {
    if (!zooming) return;
    const timer = setTimeout(onZoomComplete, reducedMotion ? 0 : 700);
    return () => clearTimeout(timer);
  }, [zooming, reducedMotion, onZoomComplete]);

  if (layout === "full") {
    return (
      <motion.div
        className="absolute inset-0"
        initial={reducedMotion ? false : { opacity: 0, scaleY: 0.02 }}
        animate={zooming ? { opacity: 0, scale: 1.04 } : { opacity: 1, scaleY: 1 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {screen}
      </motion.div>
    );
  }

  const w = SCREEN.px.w * scale;
  const h = SCREEN.px.h * scale;

  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden bg-[radial-gradient(60%_50%_at_50%_45%,rgba(34,211,238,0.12),transparent_70%),linear-gradient(180deg,#030817,#02040a)] [perspective:1600px]">
      <div aria-hidden className="os-wallpaper-grid opacity-60" />
      <motion.div
        ref={frame}
        initial={reducedMotion ? false : { rotateX: 14, y: 40, opacity: 0 }}
        animate={zooming ? { rotateX: 0, scale: 1.6, opacity: 0 } : { rotateX: 4, y: 0, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0.1 : zooming ? 0.7 : 1.1, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative"
      >
        {/* Bezel */}
        <div className="rounded-[22px] bg-gradient-to-b from-[#121a2e] to-[#070b16] p-[14px] pb-[34px] shadow-[0_40px_120px_-30px_rgba(34,211,238,0.35),0_0_0_1px_rgba(125,211,252,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="relative overflow-hidden rounded-[8px] bg-black" style={{ width: w, height: h }}>
            <div style={{ width: SCREEN.px.w, height: SCREEN.px.h, transform: `scale(${scale})`, transformOrigin: "top left" }}>
              {screen}
            </div>
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.06)_0%,transparent_30%)]" />
          </div>
          <div aria-hidden className="mx-auto mt-3 flex w-40 items-center justify-center gap-3">
            <span className="h-[2px] flex-1 rounded bg-cyan-400/70 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
            <span className="size-1.5 rounded-full bg-cyan-300" />
          </div>
        </div>
        {/* Stand */}
        <div aria-hidden className="mx-auto h-10 w-24 bg-gradient-to-b from-[#0d1426] to-[#070b16]" />
        <div aria-hidden className="mx-auto h-3 w-64 rounded-full bg-gradient-to-b from-[#121a2e] to-[#060912] shadow-[0_20px_40px_rgba(0,0,0,0.8)]" />
      </motion.div>
    </div>
  );
}
