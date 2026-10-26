"use client";

import { MotionConfig, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { usePageVisible } from "@/hooks/usePageVisible";
import { useViewportSize } from "@/hooks/useViewportSize";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { isWindowApp, type WindowAppId } from "@/lib/os/apps";
import { readPref, storageKeys, writePref } from "@/lib/os/storage";
import { AudioProvider, useAudio } from "./AudioController";
import { BootSequence } from "./boot/BootSequence";
import { DesktopEnvironment } from "./desktop/DesktopEnvironment";
import { useWindowManager, WindowManagerProvider } from "./desktop/WindowManager";
import { LockScreen } from "./lock/LockScreen";
import { OSProvider, useOS } from "./OSProvider";
import type { CameraStage } from "./scene/CameraRig";
import { SCREEN } from "./scene/constants";
import { MonitorFallback } from "./scene/MonitorFallback";
import { SceneErrorBoundary } from "./scene/SceneErrorBoundary";
import { OSLogo } from "./ui/OSLogo";

function SceneLoading() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#02040a]" role="status">
      <div className="flex flex-col items-center gap-3 text-cyan-200/70">
        <OSLogo className="size-10 animate-pulse" title="" />
        <p className="font-mono text-xs tracking-[0.3em]">LOADING WORKSTATION…</p>
      </div>
    </div>
  );
}

/** Heavy three.js bundle: only fetched when WebGL is available and needed. */
const MonitorScene = dynamic(() => import("./scene/MonitorScene"), { ssr: false, loading: SceneLoading });
const preloadScene = () => void import("./scene/MonitorScene").catch(() => undefined);

type Phase = "init" | "boot" | "lock" | "desktop";

function readDeepLink(): WindowAppId | null {
  const params = new URLSearchParams(window.location.search);
  const id = (params.get("app") ?? window.location.hash.replace(/^#/, "")).toLowerCase();
  return isWindowApp(id) ? id : null;
}

function OSShell() {
  const { theme, reducedMotion, motionOverride, setMotionOverride, liteMode, setLiteMode, glitch, glitchKey, notify } = useOS();
  const { enabled: soundEnabled, toggle: toggleSound, play } = useAudio();
  const { closeAll } = useWindowManager();
  const webgl = useWebGLSupport();
  const isMobile = useIsMobile();
  const viewport = useViewportSize();
  const visible = usePageVisible();

  const [phase, setPhase] = useState<Phase>("init");
  const [initialApp, setInitialApp] = useState<WindowAppId | null>(null);
  const [cameraStage, setCameraStage] = useState<CameraStage>("intro");
  const [zooming, setZooming] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  // Decide the starting phase on the client (deep link / remembered preference)
  useEffect(() => {
    const deepLink = readDeepLink();
    const skip = readPref(storageKeys.skipIntro, ["on", "off"] as const, "off") === "on";
    const id = requestAnimationFrame(() => {
      setInitialApp(deepLink);
      setPhase(deepLink || skip ? "desktop" : "boot");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const largeEnoughFor3D = viewport.width >= 1024 && viewport.width / Math.max(1, viewport.height) >= 1.15;
  const canUse3D = webgl === "supported" && !contextLost && !isMobile && largeEnoughFor3D;
  const use3D = canUse3D && !liteMode;
  const framedScale = Math.min((viewport.width * 0.86) / SCREEN.px.w, (viewport.height * 0.7) / SCREEN.px.h);
  const fallbackLayout = !isMobile && framedScale >= 0.85 ? "framed" : "full";

  // Warm up the 3D bundle during the boot animation
  useEffect(() => {
    if (phase === "boot" && canUse3D && !liteMode) preloadScene();
  }, [phase, canUse3D, liteMode]);

  // Cinematic fly-in: far establishing shot → closer readable framing
  useEffect(() => {
    if (phase !== "lock" || cameraStage !== "intro") return;
    const timer = setTimeout(() => setCameraStage("idle"), reducedMotion ? 0 : 2200);
    return () => clearTimeout(timer);
  }, [phase, cameraStage, reducedMotion]);

  const enterLock = useCallback(() => {
    setZooming(false);
    setCameraStage("intro");
    setPhase("lock");
  }, []);

  const enterDesktop = useCallback(() => {
    setZooming(false);
    setPhase("desktop");
  }, []);

  const onBootSkip = useCallback(
    (remember: boolean) => {
      if (remember) writePref(storageKeys.skipIntro, "on");
      enterDesktop();
    },
    [enterDesktop],
  );

  const onAccessGranted = useCallback(() => {
    setZooming(true);
    setCameraStage("zoom");
  }, []);

  const onZoomComplete = useCallback(() => {
    glitch();
    enterDesktop();
  }, [glitch, enterDesktop]);

  const onRestart = useCallback(() => {
    closeAll();
    setPhase("boot");
  }, [closeAll]);

  const onReplayIntro = useCallback(() => {
    writePref(storageKeys.skipIntro, null);
    closeAll();
    setPhase("boot");
  }, [closeAll]);

  const onContextLost = useCallback(() => setContextLost(true), []);
  const onLowPerformance = useCallback(() => {
    setContextLost(true);
    notify({ title: "Switched to lite mode", body: "3D was running slowly on this device, so the 2D lock screen is shown instead." });
  }, [notify]);

  const lockScreen = (variant: "monitor" | "fluid") => (
    <LockScreen
      variant={variant}
      reducedMotion={reducedMotion}
      motionOverride={motionOverride}
      onToggleMotion={() => setMotionOverride(!motionOverride)}
      soundEnabled={soundEnabled}
      onToggleSound={toggleSound}
      threeD={{ active: use3D, available: canUse3D, onToggle: () => setLiteMode(!liteMode) }}
      play={play}
      onAccessGranted={onAccessGranted}
      onSkipIntro={enterDesktop}
    />
  );

  const fallback = (
    <MonitorFallback
      screen={lockScreen(fallbackLayout === "framed" ? "monitor" : "fluid")}
      layout={fallbackLayout}
      zooming={zooming}
      reducedMotion={reducedMotion}
      onZoomComplete={onZoomComplete}
    />
  );

  return (
    <div
      className="os-root fixed inset-0 overflow-hidden"
      data-theme={theme}
      data-reduced-motion={reducedMotion}
      data-paused={!visible}
    >
      <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
        {phase === "init" && (
          <div className="absolute inset-0 grid place-items-center bg-[#010309]" role="status">
            <span className="sr-only">Starting SASHIKA OS…</span>
          </div>
        )}

        {phase === "boot" && <BootSequence reducedMotion={reducedMotion} onComplete={enterLock} onSkip={onBootSkip} play={play} />}

        {phase === "lock" && (
          <section aria-label="Lock screen" className="absolute inset-0">
            {webgl === "pending" ? (
              <SceneLoading />
            ) : use3D ? (
              <SceneErrorBoundary fallback={fallback} onError={onContextLost}>
                <MonitorScene
                  screen={lockScreen("monitor")}
                  stage={cameraStage}
                  reducedMotion={reducedMotion}
                  quality={viewport.width >= 1400 ? "high" : "low"}
                  onZoomComplete={onZoomComplete}
                  onContextLost={onContextLost}
                  onLowPerformance={onLowPerformance}
                />
              </SceneErrorBoundary>
            ) : (
              fallback
            )}
          </section>
        )}

        {phase === "desktop" && (
          <motion.main
            key="desktop"
            aria-label="SASHIKA OS desktop"
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <DesktopEnvironment
              isMobile={isMobile}
              canUse3D={canUse3D}
              initialApp={initialApp}
              onLock={enterLock}
              onRestart={onRestart}
              onReplayIntro={onReplayIntro}
            />
          </motion.main>
        )}

        {/* Inside-the-monitor feel: very subtle CRT overlay on the desktop */}
        {phase === "desktop" && (
          <>
            <div aria-hidden className="crt-scanlines pointer-events-none absolute inset-0 z-[990] opacity-60" />
            <div aria-hidden className="crt-vignette pointer-events-none absolute inset-0 z-[990] opacity-70" />
          </>
        )}

        {glitchKey > 0 && <div key={glitchKey} aria-hidden className="os-glitch-layer" />}
      </MotionConfig>
    </div>
  );
}

/** SASHIKA OS — Cyber Edition. Client-only interactive portfolio shell. */
export default function SashikaOS() {
  return (
    <OSProvider>
      <AudioProvider>
        <WindowManagerProvider>
          <OSShell />
        </WindowManagerProvider>
      </AudioProvider>
    </OSProvider>
  );
}
