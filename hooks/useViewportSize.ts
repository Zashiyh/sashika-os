"use client";

import { useEffect, useState } from "react";

export interface ViewportSize {
  width: number;
  height: number;
}

/** Window size, throttled with requestAnimationFrame. */
export function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>({ width: 1280, height: 800 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setSize({ width: window.innerWidth, height: window.innerHeight }));
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, []);

  return size;
}
