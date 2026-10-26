/**
 * Tiny synthesized UI sound engine (Web Audio API). No audio files are
 * downloaded. Nothing plays until the visitor enables sound, and the
 * AudioContext is only created after a user gesture.
 */

export type SoundName = "click" | "open" | "close" | "minimize" | "error" | "notify" | "granted" | "boot" | "key" | "scan";

interface Tone {
  freq: number;
  /** seconds from start */
  at: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  /** optional frequency to glide to */
  to?: number;
}

const patterns: Record<SoundName, Tone[]> = {
  click: [{ freq: 1800, at: 0, dur: 0.03, type: "square", gain: 0.03 }],
  key: [{ freq: 2400, at: 0, dur: 0.015, type: "square", gain: 0.012 }],
  open: [
    { freq: 520, at: 0, dur: 0.09, type: "sine", gain: 0.06, to: 880 },
    { freq: 1320, at: 0.05, dur: 0.08, type: "triangle", gain: 0.03 },
  ],
  close: [{ freq: 760, at: 0, dur: 0.1, type: "sine", gain: 0.05, to: 380 }],
  minimize: [{ freq: 640, at: 0, dur: 0.12, type: "sine", gain: 0.04, to: 300 }],
  error: [
    { freq: 220, at: 0, dur: 0.12, type: "square", gain: 0.035 },
    { freq: 180, at: 0.13, dur: 0.16, type: "square", gain: 0.035 },
  ],
  notify: [
    { freq: 988, at: 0, dur: 0.1, type: "sine", gain: 0.05 },
    { freq: 1319, at: 0.1, dur: 0.16, type: "sine", gain: 0.05 },
  ],
  scan: [{ freq: 300, at: 0, dur: 0.6, type: "sawtooth", gain: 0.012, to: 1400 }],
  granted: [
    { freq: 523.25, at: 0, dur: 0.14, type: "triangle", gain: 0.06 },
    { freq: 659.25, at: 0.1, dur: 0.14, type: "triangle", gain: 0.06 },
    { freq: 783.99, at: 0.2, dur: 0.14, type: "triangle", gain: 0.06 },
    { freq: 1046.5, at: 0.3, dur: 0.4, type: "sine", gain: 0.07 },
  ],
  boot: [
    { freq: 311.13, at: 0, dur: 1.2, type: "sine", gain: 0.05 },
    { freq: 466.16, at: 0.18, dur: 1.1, type: "sine", gain: 0.045 },
    { freq: 622.25, at: 0.36, dur: 1.0, type: "sine", gain: 0.04 },
    { freq: 932.33, at: 0.54, dur: 1.2, type: "triangle", gain: 0.03 },
  ],
};

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!context) {
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      context = new Ctor();
    } catch {
      return null;
    }
  }
  if (context.state === "suspended") void context.resume().catch(() => undefined);
  return context;
}

export function playSound(name: SoundName): void {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime + 0.01;
  for (const tone of patterns[name]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tone.type ?? "sine";
    osc.frequency.setValueAtTime(tone.freq, now + tone.at);
    if (tone.to) osc.frequency.exponentialRampToValueAtTime(tone.to, now + tone.at + tone.dur);
    const peak = tone.gain ?? 0.05;
    gain.gain.setValueAtTime(0.0001, now + tone.at);
    gain.gain.exponentialRampToValueAtTime(peak, now + tone.at + Math.min(0.02, tone.dur / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.at + tone.dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + tone.at);
    osc.stop(now + tone.at + tone.dur + 0.05);
  }
}
