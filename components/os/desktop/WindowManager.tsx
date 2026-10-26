"use client";

import { AnimatePresence } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { getApp, isWindowApp, type AppId, type WindowAppId } from "@/lib/os/apps";
import {
  getActiveWindow,
  initialWindowState,
  windowReducer,
  type Viewport,
  type WindowManagerState,
} from "@/lib/os/windowReducer";
import { useAudio } from "../AudioController";
import { AppContent } from "../apps/AppContent";
import { PortfolioWindow } from "./PortfolioWindow";

interface WindowManagerValue {
  state: WindowManagerState;
  activeId: WindowAppId | null;
  /** Opens a window app, or an external link app in a new tab */
  launch: (id: AppId) => void;
  close: (id: WindowAppId) => void;
  focus: (id: WindowAppId) => void;
  minimize: (id: WindowAppId) => void;
  toggleMaximize: (id: WindowAppId) => void;
  move: (id: WindowAppId, x: number, y: number) => void;
  resize: (id: WindowAppId, w: number, h: number) => void;
  minimizeAll: () => void;
  closeAll: () => void;
  /** Taskbar behaviour: focus, or minimise if already active */
  toggleFromTaskbar: (id: WindowAppId) => void;
}

const WindowManagerContext = createContext<WindowManagerValue | null>(null);

export const TASKBAR_HEIGHT = 52;

function currentViewport(): Viewport {
  if (typeof window === "undefined") return { width: 1280, height: 748 };
  return { width: window.innerWidth, height: window.innerHeight - TASKBAR_HEIGHT };
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowReducer, initialWindowState);
  const { play } = useAudio();
  const activeId = getActiveWindow(state);

  const launch = useCallback(
    (id: AppId) => {
      const app = getApp(id);
      if (app.kind === "link") {
        play("click");
        window.open(app.href, "_blank", "noopener,noreferrer");
        return;
      }
      play("open");
      dispatch({ type: "open", id: app.id, viewport: currentViewport() });
    },
    [play],
  );

  const close = useCallback(
    (id: WindowAppId) => {
      play("close");
      dispatch({ type: "close", id });
    },
    [play],
  );

  const minimize = useCallback(
    (id: WindowAppId) => {
      play("minimize");
      dispatch({ type: "minimize", id });
    },
    [play],
  );

  const focus = useCallback((id: WindowAppId) => dispatch({ type: "focus", id }), []);
  const toggleMaximize = useCallback((id: WindowAppId) => dispatch({ type: "toggleMaximize", id }), []);
  const move = useCallback((id: WindowAppId, x: number, y: number) => dispatch({ type: "move", id, x, y }), []);
  const resize = useCallback((id: WindowAppId, w: number, h: number) => dispatch({ type: "resize", id, w, h }), []);
  const minimizeAll = useCallback(() => dispatch({ type: "minimizeAll" }), []);
  const closeAll = useCallback(() => dispatch({ type: "closeAll" }), []);

  const toggleFromTaskbar = useCallback(
    (id: WindowAppId) => {
      const win = state.windows[id];
      if (!win) return;
      if (activeId === id && !win.minimized) minimize(id);
      else focus(id);
    },
    [state.windows, activeId, minimize, focus],
  );

  // Keep windows inside the viewport on resize
  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => dispatch({ type: "fitToViewport", viewport: currentViewport() }));
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Reflect the active window in the URL hash (shareable deep links)
  const lastHash = useRef<string | null>(null);
  useEffect(() => {
    const next = activeId ? `#${activeId}` : "";
    if (lastHash.current === next) return;
    lastHash.current = next;
    const url = `${window.location.pathname}${window.location.search}${next}`;
    window.history.replaceState(window.history.state, "", url);
  }, [activeId]);

  const value = useMemo<WindowManagerValue>(
    () => ({
      state,
      activeId,
      launch,
      close,
      focus,
      minimize,
      toggleMaximize,
      move,
      resize,
      minimizeAll,
      closeAll,
      toggleFromTaskbar,
    }),
    [state, activeId, launch, close, focus, minimize, toggleMaximize, move, resize, minimizeAll, closeAll, toggleFromTaskbar],
  );

  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>;
}

export function useWindowManager(): WindowManagerValue {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error("useWindowManager must be used inside <WindowManagerProvider>");
  return ctx;
}

/** Renders every open window in stacking order. */
export function WindowLayer({ isMobile }: { isMobile: boolean }) {
  const { state, activeId } = useWindowManager();
  const ids = Object.keys(state.windows).filter(isWindowApp) as WindowAppId[];

  return (
    <AnimatePresence>
      {ids.map((id) => {
        const win = state.windows[id];
        if (!win) return null;
        const z = state.order.indexOf(id) + 10;
        return (
          <PortfolioWindow key={id} win={win} zIndex={z} active={activeId === id} isMobile={isMobile}>
            <AppContent id={id} />
          </PortfolioWindow>
        );
      })}
    </AnimatePresence>
  );
}
