"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { profile } from "@/data/portfolio";
import { runCommand, suggest, type TermEffect, type TermLine } from "@/lib/os/terminal";
import { cn } from "@/lib/utils";
import { useAudio } from "../AudioController";
import { useWindowManager } from "../desktop/WindowManager";
import { useOS } from "../OSProvider";

interface Entry {
  id: number;
  lines: TermLine[];
}

const PROMPT = "guest@sashika-os:~$";
const QUICK = ["help", "about", "projects", "skills", "contact", "neofetch"];

function Line({ line }: { line: TermLine }) {
  switch (line.kind) {
    case "input":
      return (
        <p>
          <span className="text-emerald-400">{PROMPT}</span> <span className="text-white">{line.text}</span>
        </p>
      );
    case "heading":
      return <p className="mt-1 font-semibold text-cyan-300">{line.text}</p>;
    case "muted":
      return <p className="text-slate-500">{line.text}</p>;
    case "error":
      return <p className="text-rose-400">{line.text}</p>;
    case "success":
      return <p className="text-emerald-300">{line.text}</p>;
    case "accent":
      return <p className="text-violet-300">{line.text}</p>;
    case "ascii":
      return <pre className="text-[10px] leading-tight text-cyan-400 sm:text-xs">{line.text}</pre>;
    case "link":
      return (
        <p>
          <a
            href={line.href}
            className="text-sky-300 underline decoration-sky-300/40 underline-offset-2 hover:decoration-sky-300"
            {...(line.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {line.text}
          </a>
        </p>
      );
    case "pair":
      return (
        <p className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-3">
          <span className="text-cyan-400">{line.label}</span>
          <span className="text-slate-200">{line.text}</span>
        </p>
      );
    default:
      return <p className="whitespace-pre-wrap text-slate-200">{line.text || "\u00a0"}</p>;
  }
}

/** Safe, data-driven portfolio terminal (see lib/os/terminal.ts). */
export default function TerminalWindow() {
  const { launch, close } = useWindowManager();
  const { setTheme, glitch } = useOS();
  const { setEnabled, play } = useAudio();
  const [entries, setEntries] = useState<Entry[]>(() => [
    {
      id: 0,
      lines: [
        { kind: "accent", text: "SASHIKA OS Terminal — Cyber Edition" },
        { kind: "muted", text: `Welcome, guest. You're exploring ${profile.name}'s portfolio.` },
        { kind: "muted", text: "Type `help` to list commands." },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const idRef = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  const applyEffects = useCallback(
    (effects: TermEffect[] = []) => {
      for (const effect of effects) {
        if (effect.type === "clear") setEntries([]);
        else if (effect.type === "exit") setTimeout(() => close("terminal"), 250);
        else if (effect.type === "open") launch(effect.app);
        else if (effect.type === "external") window.open(effect.href, "_blank", "noopener,noreferrer");
        else if (effect.type === "theme") setTheme(effect.value);
        else if (effect.type === "sound") setEnabled(effect.value);
        else if (effect.type === "glitch") glitch();
      }
    },
    [close, launch, setTheme, setEnabled, glitch],
  );

  const execute = (raw: string) => {
    const value = raw.trim();
    const result = runCommand(value, history);
    const inputLine: TermLine = { kind: "input", text: value };
    const clears = result.effects?.some((effect) => effect.type === "clear");
    if (!clears) {
      setEntries((prev) => [...prev.slice(-80), { id: idRef.current++, lines: [inputLine, ...result.lines] }]);
    }
    if (value) setHistory((prev) => [...prev.slice(-49), value]);
    setHistoryIndex(null);
    setInput("");
    if (result.lines.some((line) => line.kind === "error")) play("error");
    applyEffects(result.effects);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      execute(input);
    } else if (event.key === "Tab") {
      event.preventDefault();
      const options = suggest(input);
      if (options.length === 1) setInput(options[0].includes(" ") ? options[0] : `${options[0]} `);
      else if (options.length > 1) {
        setEntries((prev) => [...prev, { id: idRef.current++, lines: [{ kind: "input", text: input }, { kind: "muted", text: options.join("   ") }] }]);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
    } else if (event.key.length === 1) {
      play("key");
    }
  };

  const hints = input ? suggest(input).slice(0, 5) : [];

  return (
    <div
      className="flex h-full min-h-0 flex-col bg-[var(--term-bg)] font-mono text-[13px] leading-relaxed text-[var(--term-fg)]"
      onClick={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      <div ref={scrollRef} className="os-scroll min-h-0 flex-1 overflow-y-auto px-4 pt-3" role="log" aria-live="polite" aria-label="Terminal output">
        {entries.map((entry) => (
          <div key={entry.id} className="mb-2 break-words">
            {entry.lines.map((line, index) => (
              <Line key={index} line={line} />
            ))}
          </div>
        ))}
        <div className="flex items-center gap-2 pb-3">
          <label htmlFor="terminal-input" className="shrink-0 text-emerald-400">
            {PROMPT}
          </label>
          <div className="relative min-w-0 flex-1">
            <input
              id="terminal-input"
              ref={inputRef}
              data-keep-escape
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              maxLength={300}
              className="w-full bg-transparent text-white caret-transparent outline-none"
              aria-describedby="terminal-hints"
            />
            {/* Blinking block cursor */}
            <span
              aria-hidden
              className="caret-blink pointer-events-none absolute top-1/2 h-[1.1em] w-[0.6em] -translate-y-1/2 bg-cyan-300/90"
              style={{ left: `${input.length}ch` }}
            />
          </div>
        </div>
      </div>

      <div id="terminal-hints" className="flex flex-wrap items-center gap-1.5 border-t border-white/10 px-3 py-2 text-[11px]">
        <span className="text-slate-500">{hints.length ? "Tab ↹" : "Try:"}</span>
        {(hints.length ? hints : QUICK).map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (hints.length) {
                setInput(cmd);
                inputRef.current?.focus();
              } else {
                execute(cmd);
              }
            }}
            className={cn("rounded border border-cyan-400/20 bg-cyan-400/5 px-2 py-0.5 text-cyan-200 transition hover:border-cyan-400/60")}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
