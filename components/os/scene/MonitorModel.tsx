"use client";

import { Html, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { SCREEN } from "./constants";

const DISTANCE_FACTOR = (SCREEN.width * 400) / SCREEN.px.w;

function useLabelTexture(text: string) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "600 34px 'Space Grotesk', 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(186, 230, 253, 0.75)";
      ctx.letterSpacing = "10px";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [text]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Keyboard() {
  const keys = useRef<THREE.InstancedMesh>(null);
  const cols = 14;
  const rows = 4;

  useLayoutEffect(() => {
    const mesh = keys.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    let i = 0;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        matrix.setPosition(-1.17 + c * 0.18, 0.05, -0.28 + r * 0.18);
        mesh.setMatrixAt(i, matrix);
        const glow = (r === 1 && c > 3 && c < 7) || (r === 3 && c === 12);
        mesh.setColorAt(i, color.set(glow ? "#155e75" : "#0b1222"));
        i += 1;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  return (
    <group position={[0, -1.95, 1.55]} rotation={[0.06, 0, 0]}>
      <RoundedBox args={[2.75, 0.07, 0.9]} radius={0.03} smoothness={3}>
        <meshStandardMaterial color="#080d1a" metalness={0.7} roughness={0.35} />
      </RoundedBox>
      <instancedMesh ref={keys} args={[undefined, undefined, cols * rows]}>
        <boxGeometry args={[0.15, 0.04, 0.15]} />
        <meshStandardMaterial roughness={0.5} metalness={0.3} />
      </instancedMesh>
      {/* Space bar */}
      <mesh position={[0, 0.05, 0.42 - 0.04]}>
        <boxGeometry args={[0.9, 0.04, 0.12]} />
        <meshStandardMaterial color="#0b1222" roughness={0.5} />
      </mesh>
      {/* Under-glow */}
      <mesh position={[0, -0.036, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.9, 1.0]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.08} toneMapped={false} />
      </mesh>
    </group>
  );
}

interface MonitorModelProps {
  screen: ReactNode;
  screenOn: boolean;
  /** Drag rotation target in radians, written by the parent */
  dragRotation: React.MutableRefObject<number>;
  reducedMotion: boolean;
}

export function MonitorModel({ screen, screenOn, dragRotation, reducedMotion }: MonitorModelProps) {
  const group = useRef<THREE.Group>(null);
  const led = useRef<THREE.MeshBasicMaterial>(null);
  const label = useLabelTexture("SASHIKA");

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const target = dragRotation.current;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, target, 4, delta);
    if (!reducedMotion) g.position.y = 0.2 + Math.sin(state.clock.elapsedTime * 0.6) * 0.012;
    if (led.current) led.current.opacity = screenOn ? 0.75 + Math.sin(state.clock.elapsedTime * 2.4) * 0.25 : 0.2;
  });

  return (
    <group>
      <group ref={group} position={[0, 0.2, 0]}>
        {/* Bezel */}
        <RoundedBox args={[3.56, 2.5, 0.26]} radius={0.09} smoothness={4}>
          <meshStandardMaterial color="#0a1020" metalness={0.85} roughness={0.28} envMapIntensity={1.2} />
        </RoundedBox>
        {/* Bezel lip highlight */}
        <mesh position={[0, SCREEN.y, 0.131]}>
          <planeGeometry args={[SCREEN.width + 0.12, SCREEN.height + 0.12]} />
          <meshStandardMaterial color="#05070d" metalness={0.2} roughness={0.15} />
        </mesh>
        {/* Screen glass (visible before the HTML screen powers on) */}
        <mesh position={[0, SCREEN.y, 0.134]}>
          <planeGeometry args={[SCREEN.width, SCREEN.height]} />
          <meshStandardMaterial
            color="#01030a"
            emissive="#0e7490"
            emissiveIntensity={screenOn ? 0.35 : 0.04}
            roughness={0.08}
            metalness={0.1}
          />
        </mesh>

        {/* Live HTML screen */}
        <Html
          transform
          distanceFactor={DISTANCE_FACTOR}
          position={[0, SCREEN.y, SCREEN.z]}
          zIndexRange={[20, 0]}
          style={{ width: SCREEN.px.w, height: SCREEN.px.h }}
        >
          <div
            className="relative size-full overflow-hidden rounded-[6px]"
            style={{
              opacity: screenOn ? 1 : 0,
              transform: screenOn ? "scale(1)" : "scale(1, 0.01)",
              transition: reducedMotion ? "opacity 200ms" : "opacity 500ms ease, transform 600ms cubic-bezier(0.2,0.8,0.2,1)",
            }}
          >
            {screen}
            {/* Glass glare + vignette over the DOM screen */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.07)_0%,transparent_28%,transparent_70%,rgba(103,232,249,0.04)_100%)]" />
            <div aria-hidden className="crt-vignette pointer-events-none absolute inset-0" />
          </div>
        </Html>

        {/* Chin details */}
        <mesh position={[0, -1.1, 0.132]}>
          <planeGeometry args={[0.9, 0.11]} />
          <meshBasicMaterial map={label} transparent toneMapped={false} />
        </mesh>
        <mesh position={[1.55, -1.1, 0.132]}>
          <circleGeometry args={[0.018, 16]} />
          <meshBasicMaterial ref={led} color="#22d3ee" transparent toneMapped={false} />
        </mesh>
        <mesh position={[0, -1.235, 0.12]}>
          <boxGeometry args={[2.4, 0.012, 0.02]} />
          <meshBasicMaterial color="#22d3ee" toneMapped={false} transparent opacity={0.85} />
        </mesh>

        {/* Stepped rear casing — retro CRT silhouette, modern finish */}
        <RoundedBox args={[3.3, 2.2, 0.5]} radius={0.12} smoothness={3} position={[0, 0.02, -0.36]}>
          <meshStandardMaterial color="#0b1222" metalness={0.75} roughness={0.35} />
        </RoundedBox>
        <RoundedBox args={[2.5, 1.65, 0.62]} radius={0.16} smoothness={3} position={[0, 0.05, -0.88]}>
          <meshStandardMaterial color="#0a101d" metalness={0.7} roughness={0.4} />
        </RoundedBox>
        {/* Rear accent light */}
        <mesh position={[0, 0.05, -1.2]}>
          <boxGeometry args={[1.6, 0.03, 0.02]} />
          <meshBasicMaterial color="#8b5cf6" toneMapped={false} />
        </mesh>

        {/* Stand */}
        <RoundedBox args={[0.46, 1.0, 0.24]} radius={0.06} smoothness={3} position={[0, -1.55, -0.55]} rotation={[-0.12, 0, 0]}>
          <meshStandardMaterial color="#0b1222" metalness={0.85} roughness={0.25} />
        </RoundedBox>
        <RoundedBox args={[1.9, 0.08, 1.25]} radius={0.04} smoothness={3} position={[0, -2.17, -0.35]}>
          <meshStandardMaterial color="#090f1c" metalness={0.85} roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, -2.125, 0.27]}>
          <boxGeometry args={[1.2, 0.006, 0.01]} />
          <meshBasicMaterial color="#22d3ee" toneMapped={false} />
        </mesh>
      </group>
      <Keyboard />
    </group>
  );
}
