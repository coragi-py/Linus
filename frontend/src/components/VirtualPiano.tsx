import { useCallback, useEffect, useState } from "react";
import { PIANO_KEYS, KEY_TO_NOTE, noteLabelPt } from "@/lib/music";
import { initAudio, noteOn, noteOff } from "@/lib/audio";
import { cn } from "@/lib/utils";

type Props = {
  /** Chamado quando uma nota é acionada */
  onNoteOn?: (note: string) => void;
  /** Destaque externo (ex. nota alvo do exercício) */
  highlight?: string[];
  showKeyboardHints?: boolean;
  compact?: boolean;
};

/** Piano virtual de 2 oitavas (C3–B4) com mapeamento de teclado físico. */
export function VirtualPiano({
  onNoteOn,
  highlight = [],
  showKeyboardHints = true,
  compact = false,
}: Props) {
  const [active, setActive] = useState<string[]>([]);

  const press = useCallback(
    (note: string) => {
      setActive((a) => (a.includes(note) ? a : [...a, note]));
      void initAudio().then(() => noteOn(note));
      onNoteOn?.(note);
    },
    [onNoteOn],
  );

  const release = useCallback((note: string) => {
    setActive((a) => a.filter((n) => n !== note));
    noteOff(note);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
      const note = KEY_TO_NOTE[e.key.toLowerCase()];
      if (note) {
        e.preventDefault();
        press(note);
      }
    };
    const up = (e: KeyboardEvent) => {
      const note = KEY_TO_NOTE[e.key.toLowerCase()];
      if (note) release(note);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [press, release]);

  const whites = PIANO_KEYS.filter((k) => !k.isBlack);
  const whiteW = 100 / whites.length;
  const h = compact ? 130 : 180;

  return (
    <div className="neu-inset w-full p-3 sm:p-4">
      <div className="relative w-full select-none" style={{ height: h }}>
        {whites.map((k, i) => {
          const isActive = active.includes(k.note);
          const isHint = highlight.includes(k.note);
          return (
            <button
              key={k.note}
              type="button"
              aria-label={`${k.label} ${k.octave}`}
              onPointerDown={() => press(k.note)}
              onPointerUp={() => release(k.note)}
              onPointerCancel={() => release(k.note)}
              onPointerLeave={() => isActive && release(k.note)}
              className={cn(
                "focus-ring absolute bottom-0 top-0 flex flex-col items-center justify-end gap-1 rounded-b-lg border border-border bg-card pb-2 transition-[transform,background-color] duration-75",
                isActive && "translate-y-[3px] bg-primary-soft",
                isHint && !isActive && "bg-accent",
              )}
              style={{ left: `${i * whiteW}%`, width: `calc(${whiteW}% - 3px)` }}
            >
              {showKeyboardHints && (
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                  {k.keyboard}
                </span>
              )}
              <span className="text-[10px] font-bold text-muted-foreground sm:text-xs">
                {k.label.split(" ")[0]}
              </span>
            </button>
          );
        })}

        {PIANO_KEYS.filter((k) => k.isBlack).map((k) => {
          const whiteIndex = whites.findIndex(
            (w) => w.octave === k.octave && w.note[0] === k.note[0],
          );
          const isActive = active.includes(k.note);
          const isHint = highlight.includes(k.note);
          return (
            <button
              key={k.note}
              type="button"
              aria-label={`${k.label} ${k.octave}`}
              onPointerDown={() => press(k.note)}
              onPointerUp={() => release(k.note)}
              onPointerCancel={() => release(k.note)}
              onPointerLeave={() => isActive && release(k.note)}
              className={cn(
                "focus-ring absolute top-0 z-10 flex items-end justify-center rounded-b-lg bg-foreground pb-1.5 transition-[transform,background-color] duration-75",
                isActive && "translate-y-[3px] bg-primary",
                isHint && !isActive && "bg-primary/80",
              )}
              style={{
                left: `calc(${(whiteIndex + 1) * whiteW}% - ${whiteW * 0.3}%)`,
                width: `${whiteW * 0.6}%`,
                height: h * 0.62,
              }}
            >
              {showKeyboardHints && (
                <span className="text-[9px] font-bold uppercase text-background">{k.keyboard}</span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
        {active.length > 0
          ? `Tocando: ${active.map((n) => `${noteLabelPt(n)} ${n.slice(-1)}`).join(", ")}`
          : "Use o mouse ou o teclado do computador para tocar."}
      </p>
    </div>
  );
}
