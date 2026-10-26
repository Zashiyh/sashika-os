import type { WindowAppId } from "./apps";
import { windowApps } from "./apps";

export interface WindowState {
  id: WindowAppId;
  x: number;
  y: number;
  w: number;
  h: number;
  minimized: boolean;
  maximized: boolean;
}

export interface WindowManagerState {
  windows: Partial<Record<WindowAppId, WindowState>>;
  /** Stacking order — last item is on top */
  order: WindowAppId[];
}

export interface Viewport {
  width: number;
  /** Height available for windows (excludes the taskbar) */
  height: number;
}

export type WindowAction =
  | { type: "open"; id: WindowAppId; viewport: Viewport }
  | { type: "close"; id: WindowAppId }
  | { type: "focus"; id: WindowAppId }
  | { type: "minimize"; id: WindowAppId }
  | { type: "toggleMaximize"; id: WindowAppId }
  | { type: "move"; id: WindowAppId; x: number; y: number }
  | { type: "resize"; id: WindowAppId; w: number; h: number }
  | { type: "minimizeAll" }
  | { type: "closeAll" }
  | { type: "fitToViewport"; viewport: Viewport };

export const initialWindowState: WindowManagerState = { windows: {}, order: [] };

export const MIN_WINDOW = { w: 340, h: 260 };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

function placeWindow(id: WindowAppId, state: WindowManagerState, viewport: Viewport): WindowState {
  const { w: dw, h: dh } = windowApps[id].defaultSize;
  const w = clamp(dw, MIN_WINDOW.w, viewport.width - 24);
  const h = clamp(dh, MIN_WINDOW.h, viewport.height - 24);
  const openCount = Object.keys(state.windows).length;
  const cascade = (openCount % 6) * 28;
  const x = clamp(Math.round((viewport.width - w) / 2) + cascade - 56, 8, viewport.width - w - 8);
  const y = clamp(Math.round((viewport.height - h) / 2) + cascade - 48, 8, viewport.height - h - 8);
  return { id, x, y, w, h, minimized: false, maximized: false };
}

const bringToFront = (order: WindowAppId[], id: WindowAppId) => [...order.filter((item) => item !== id), id];

export function windowReducer(state: WindowManagerState, action: WindowAction): WindowManagerState {
  switch (action.type) {
    case "open": {
      const existing = state.windows[action.id];
      if (existing) {
        return {
          windows: { ...state.windows, [action.id]: { ...existing, minimized: false } },
          order: bringToFront(state.order, action.id),
        };
      }
      return {
        windows: { ...state.windows, [action.id]: placeWindow(action.id, state, action.viewport) },
        order: bringToFront(state.order, action.id),
      };
    }
    case "close": {
      const windows = { ...state.windows };
      delete windows[action.id];
      return { windows, order: state.order.filter((item) => item !== action.id) };
    }
    case "focus": {
      const win = state.windows[action.id];
      if (!win) return state;
      if (state.order[state.order.length - 1] === action.id && !win.minimized) return state;
      return {
        windows: { ...state.windows, [action.id]: { ...win, minimized: false } },
        order: bringToFront(state.order, action.id),
      };
    }
    case "minimize": {
      const win = state.windows[action.id];
      if (!win) return state;
      // Move minimized window to the bottom so focus falls to the next one
      return {
        windows: { ...state.windows, [action.id]: { ...win, minimized: true } },
        order: [action.id, ...state.order.filter((item) => item !== action.id)],
      };
    }
    case "toggleMaximize": {
      const win = state.windows[action.id];
      if (!win) return state;
      return {
        windows: { ...state.windows, [action.id]: { ...win, maximized: !win.maximized, minimized: false } },
        order: bringToFront(state.order, action.id),
      };
    }
    case "move": {
      const win = state.windows[action.id];
      if (!win) return state;
      return { ...state, windows: { ...state.windows, [action.id]: { ...win, x: action.x, y: action.y } } };
    }
    case "resize": {
      const win = state.windows[action.id];
      if (!win) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...win, w: Math.max(MIN_WINDOW.w, action.w), h: Math.max(MIN_WINDOW.h, action.h) },
        },
      };
    }
    case "minimizeAll": {
      const windows = { ...state.windows };
      (Object.keys(windows) as WindowAppId[]).forEach((id) => {
        const win = windows[id];
        if (win) windows[id] = { ...win, minimized: true };
      });
      return { ...state, windows };
    }
    case "closeAll":
      return initialWindowState;
    case "fitToViewport": {
      const windows = { ...state.windows };
      const { width, height } = action.viewport;
      (Object.keys(windows) as WindowAppId[]).forEach((id) => {
        const win = windows[id];
        if (!win) return;
        const w = clamp(win.w, MIN_WINDOW.w, width - 16);
        const h = clamp(win.h, MIN_WINDOW.h, height - 16);
        windows[id] = { ...win, w, h, x: clamp(win.x, 0, width - w), y: clamp(win.y, 0, height - h) };
      });
      return { ...state, windows };
    }
    default:
      return state;
  }
}

/** Id of the top-most visible window, if any */
export function getActiveWindow(state: WindowManagerState): WindowAppId | null {
  for (let i = state.order.length - 1; i >= 0; i -= 1) {
    const id = state.order[i];
    if (!state.windows[id]?.minimized) return id;
  }
  return null;
}
