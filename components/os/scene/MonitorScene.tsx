"use client";

import { ContactShadows, Environment, Grid, Lightformer, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePageVisible } from "@/hooks/usePageVisible";
import { CameraRig, type CameraStage } from "./CameraRig";
import { MonitorModel } from "./MonitorModel";

export interface MonitorSceneProps {
  /** Content rendered on the monitor screen (the lock screen) */
  screen: ReactNode;
  stage: CameraStage;
  reducedMotion: boolean;
  /** Lighter scene for tablets / weaker devices */
  quality: "high" | "low";
  onZoomComplete: () => void;
  onContextLost: () => void;
  /** Called once if the scene can't sustain a usable frame rate */
  onLowPerformance?: () => void;
}

/**
 * Samples the frame rate for ~3s after a short warm-up. If the device can't
 * hold ~20fps even at reduced resolution, the parent swaps to the 2D lock screen.
 */
function FrameRateGuard({ onLow }: { onLow: () => void }) {
  const sample = useRef({ elapsed: 0, frames: 0, done: false });
  useFrame((_, delta) => {
    const s = sample.current;
    if (s.done) return;
    s.elapsed += Math.min(delta, 1);
    if (s.elapsed < 1.5) return; // warm-up: shader compilation, env map
    s.frames += 1;
    if (s.elapsed >= 4.5) {
      s.done = true;
      if (s.frames / (s.elapsed - 1.5) < 20) onLow();
    }
  });
  return null;
}

/**
 * Stage B — the interactive 3D monitor. Loaded with next/dynamic (ssr:false)
 * only when WebGL is available; the 2D fallback is used otherwise.
 */
export default function MonitorScene({ screen, stage, reducedMotion, quality, onZoomComplete, onContextLost, onLowPerformance }: MonitorSceneProps) {
  const visible = usePageVisible();
  const pointer = useRef({ x: 0, y: 0 });
  const dragRotation = useRef(0);
  const drag = useRef<{ startX: number; startRot: number } | null>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState<number>(quality === "high" ? 1.75 : 1.25);
  const [screenOn, setScreenOn] = useState(reducedMotion);

  // Power the screen on once the camera has mostly arrived
  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(() => setScreenOn(true), 1100);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  // Pointer parallax + optional drag-to-rotate (outside the screen only)
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
      if (drag.current) {
        const dx = (event.clientX - drag.current.startX) / window.innerWidth;
        dragRotation.current = Math.max(-0.55, Math.min(0.55, drag.current.startRot + dx * 2.2));
      }
    };
    const onDown = (event: PointerEvent) => {
      if (!(event.target instanceof HTMLCanvasElement)) return;
      drag.current = { startX: event.clientX, startRot: dragRotation.current };
      el.style.cursor = "grabbing";
    };
    const onUp = () => {
      if (!drag.current) return;
      drag.current = null;
      el.style.cursor = "";
      dragRotation.current = 0; // ease back to centre
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const handleCreated = useCallback(
    ({ gl }: { gl: { domElement: HTMLCanvasElement } }) => {
      gl.domElement.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
        onContextLost();
      });
    },
    [onContextLost],
  );

  return (
    <div ref={wrapper} className="absolute inset-0 cursor-grab touch-none" aria-hidden={false}>
      <Canvas
        dpr={[1, dpr]}
        frameloop={visible ? "always" : "never"}
        camera={{ fov: 35, position: reducedMotion ? [0, 0.35, 9] : [0, 3.6, 17], near: 0.1, far: 80 }}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
        onCreated={handleCreated}
        aria-label="3D monitor showing the SASHIKA OS lock screen"
      >
        <color attach="background" args={["#02040a"]} />
        <fog attach="fog" args={["#02040a", 12, 34]} />

        <PerformanceMonitor onDecline={() => setDpr(1)} />
        {onLowPerformance && <FrameRateGuard onLow={onLowPerformance} />}

        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 6, 5]} intensity={1.1} color="#dbeafe" />
        <pointLight position={[0, 0.3, 2.6]} intensity={screenOn ? 7 : 1} distance={9} color="#22d3ee" />
        <spotLight position={[-5, 4, -4]} angle={0.5} penumbra={1} intensity={60} color="#8b5cf6" />
        <spotLight position={[5, 2.5, -3]} angle={0.5} penumbra={1} intensity={30} color="#22d3ee" />

        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={2.2} color="#e0f2fe" position={[0, 5, 3]} scale={[8, 2, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={3} color="#22d3ee" position={[-5, 1, 1]} scale={[2, 6, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={3} color="#8b5cf6" position={[5, 1, 1]} scale={[2, 6, 1]} rotation-y={-Math.PI / 2} />
          <Lightformer form="ring" intensity={1.5} color="#60a5fa" position={[0, 1, -6]} scale={4} />
        </Environment>

        <MonitorModel screen={screen} screenOn={screenOn} dragRotation={dragRotation} reducedMotion={reducedMotion} />

        {/* Floor */}
        <mesh rotation-x={-Math.PI / 2} position={[0, -2.215, 0]}>
          <planeGeometry args={[80, 80]} />
          <meshStandardMaterial color="#03060f" metalness={0.6} roughness={0.55} />
        </mesh>
        <Grid
          position={[0, -2.21, 0]}
          args={[40, 40]}
          cellSize={0.5}
          cellThickness={0.6}
          cellColor="#0b3a4a"
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor="#0e7490"
          fadeDistance={quality === "high" ? 28 : 18}
          fadeStrength={1.4}
          infiniteGrid
        />
        <ContactShadows position={[0, -2.2, 0]} opacity={0.7} scale={12} blur={2.4} far={3} frames={1} resolution={quality === "high" ? 512 : 256} />

        <Sparkles
          count={quality === "high" ? 60 : 24}
          scale={[14, 6, 10]}
          position={[0, 0.8, -1]}
          size={2.2}
          speed={reducedMotion ? 0 : 0.25}
          opacity={0.45}
          color="#67e8f9"
        />

        <CameraRig stage={stage} reducedMotion={reducedMotion} pointer={pointer} onZoomComplete={onZoomComplete} />
      </Canvas>
    </div>
  );
}
