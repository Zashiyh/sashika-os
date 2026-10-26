"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { IDLE_SCREEN_FRACTION, SCREEN } from "./constants";

export type CameraStage = "intro" | "idle" | "zoom";

interface CameraRigProps {
  stage: CameraStage;
  reducedMotion: boolean;
  /** Normalised pointer position (-1..1), written by the parent */
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  onZoomComplete: () => void;
}

const SCREEN_WORLD_Y = 0.2 + SCREEN.y;
const LOOK_IDLE = new THREE.Vector3(0, -0.05, 0);
const LOOK_ZOOM = new THREE.Vector3(0, SCREEN_WORLD_Y, 0);

/** Damped cinematic camera: fly-in → idle parallax → push into the screen. */
export function CameraRig({ stage, reducedMotion, pointer, onZoomComplete }: CameraRigProps) {
  const look = useRef(LOOK_IDLE.clone());
  const target = useRef(new THREE.Vector3());
  const zoomDone = useRef(false);
  const zoomStarted = useRef(0);

  useEffect(() => {
    if (stage === "zoom") {
      zoomDone.current = false;
      zoomStarted.current = performance.now();
      if (reducedMotion) {
        zoomDone.current = true;
        onZoomComplete();
      }
    }
  }, [stage, reducedMotion, onZoomComplete]);

  useFrame((state, delta) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / Math.max(1, state.size.height);
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));

    if (stage === "zoom") {
      // Distance at which the screen covers the whole viewport
      const d = Math.min(SCREEN.height / (2 * tanHalf), SCREEN.width / (2 * tanHalf * aspect)) * 0.97;
      target.current.set(0, SCREEN_WORLD_Y, SCREEN.z + d);
      look.current.lerp(LOOK_ZOOM, 1 - Math.exp(-6 * delta));
    } else {
      // Frame the screen large enough for its text to stay readable
      const byWidth = SCREEN.width / (IDLE_SCREEN_FRACTION * 2 * tanHalf * aspect);
      const byHeight = SCREEN.height / (0.64 * 2 * tanHalf);
      const idleDist = Math.max(byWidth, byHeight);
      const dist = stage === "intro" ? idleDist + 1.6 : idleDist;
      const px = reducedMotion ? 0 : pointer.current.x;
      const py = reducedMotion ? 0 : pointer.current.y;
      target.current.set(px * 0.55, 0.55 + py * 0.3, dist);
      look.current.lerp(LOOK_IDLE, 1 - Math.exp(-4 * delta));
    }

    const lambda = stage === "zoom" ? 3.2 : stage === "intro" ? 1.4 : 2.4;
    if (reducedMotion && stage !== "zoom") {
      cam.position.copy(target.current);
    } else {
      cam.position.x = THREE.MathUtils.damp(cam.position.x, target.current.x, lambda, delta);
      cam.position.y = THREE.MathUtils.damp(cam.position.y, target.current.y, lambda, delta);
      cam.position.z = THREE.MathUtils.damp(cam.position.z, target.current.z, lambda, delta);
    }
    cam.lookAt(look.current);

    if (stage === "zoom" && !zoomDone.current) {
      const close = cam.position.distanceTo(target.current) < 0.06;
      const timedOut = performance.now() - zoomStarted.current > 1800;
      if (close || timedOut) {
        zoomDone.current = true;
        onZoomComplete();
      }
    }
  });

  return null;
}
