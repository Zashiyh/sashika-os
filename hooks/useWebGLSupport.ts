"use client";

import { useEffect, useState } from "react";

export type WebGLSupport = "pending" | "supported" | "unsupported";

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/**
 * Detects hardware-accelerated WebGL once on mount. Software renderers
 * (SwiftShader, llvmpipe…) are treated as unsupported — the 3D monitor would
 * run at a few fps there, so the 2D fallback is the better experience.
 * `?3d=force` overrides the check (useful for testing).
 */
export function useWebGLSupport(): WebGLSupport {
  const [support, setSupport] = useState<WebGLSupport>("pending");

  useEffect(() => {
    let result: WebGLSupport = "unsupported";
    const forced = new URLSearchParams(window.location.search).get("3d") === "force";
    try {
      const canvas = document.createElement("canvas");
      const attrs: WebGLContextAttributes = { failIfMajorPerformanceCaveat: !forced };
      const gl = (canvas.getContext("webgl2", attrs) ?? canvas.getContext("webgl", attrs)) as WebGLRenderingContext | null;
      if (gl) {
        const info = gl.getExtension("WEBGL_debug_renderer_info");
        const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
        result = forced || !SOFTWARE_RENDERER.test(renderer) ? "supported" : "unsupported";
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    } catch {
      result = "unsupported";
    }
    // Deferred so the state update happens outside the effect body
    const id = requestAnimationFrame(() => setSupport(result));
    return () => cancelAnimationFrame(id);
  }, []);

  return support;
}
