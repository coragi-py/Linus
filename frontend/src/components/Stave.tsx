// Esse arquivo é responsável por renderizar a partitura musical usando a biblioteca VexFlow.
// Compatível tanto com `data` (Triagem/Admin) quanto com `notes` (Lições interativas/Prática).

import { useEffect, useRef } from "react";
import {
  Accidental,
  Factory,
  Formatter,
  Renderer,
  Stave as VexStave,
  StaveNote,
  Voice,
} from "vexflow";

export interface StaveProps {
  /** Formato usado pela Triagem e pelo Admin de Conteúdo */
  data?: {
    clef: string;
    timeSignature: string;
    notes: string;
    width?: number;
    height?: number;
  };
  /** Formato usado pelas Lições interativas (ex: ["C4", "E4"]) */
  notes?: string[];
  sequential?: boolean;
  width?: number;
  height?: number;
  scale?: number;
  clef?: "treble" | "bass";
  className?: string;
}

function toVexKey(note: string): { key: string; accidental: string | null } {
  const match = /^([A-Ga-g])([#b]?)(\d)$/.exec(note.trim());
  if (!match) return { key: "c/4", accidental: null };
  const [, letter, acc, octave] = match;
  return {
    key: `${letter!.toLowerCase()}${acc || ""}/${octave}`,
    accidental: acc ? acc : null,
  };
}

export function Stave({
  data,
  notes,
  sequential = true,
  width = 400,
  height = 150,
  scale = 1,
  clef = "treble",
  className = "",
}: StaveProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Limpa a partitura anterior
    el.innerHTML = "";

    try {
      // MODO 1: Objeto `data` (Triagem e Admin)
      if (data) {
        const vf = new Factory({
          renderer: {
            elementId: el as unknown as string,
            width: data.width || 400,
            height: data.height || 150,
          },
        });

        const score = vf.EasyScore();
        const system = vf.System();

        system
          .addStave({
            voices: [score.voice(score.notes(data.notes))],
          })
          .addClef(data.clef)
          .addTimeSignature(data.timeSignature);

        vf.draw();
        return;
      }

      // MODO 2: Lista `notes` (Lições interativas e Construtor de Escalas)
      if (notes && notes.length > 0) {
        const renderer = new Renderer(el, Renderer.Backends.SVG);
        renderer.resize(width, height);
        const context = renderer.getContext();
        context.scale(scale, scale);

        const scaledWidth = Math.max(220, Math.floor(width / scale) - 24);
        const stave = new VexStave(10, 10, scaledWidth);
        stave.addClef(clef);
        stave.setContext(context).draw();

        const duration = notes.length === 1 ? "w" : "q";
        const staveNotes: StaveNote[] = [];

        if (sequential) {
          for (const rawNote of notes) {
            const { key, accidental } = toVexKey(rawNote);
            const sn = new StaveNote({
              clef,
              keys: [key],
              duration,
            });
            if (accidental) {
              sn.addModifier(new Accidental(accidental), 0);
            }
            staveNotes.push(sn);
          }
        } else {
          const parsed = notes.map(toVexKey);
          const sn = new StaveNote({
            clef,
            keys: parsed.map((p) => p.key),
            duration: "w",
          });
          parsed.forEach((p, idx) => {
            if (p.accidental) {
              sn.addModifier(new Accidental(p.accidental), idx);
            }
          });
          staveNotes.push(sn);
        }

        const voice = new Voice({ numBeats: Math.max(staveNotes.length, 1), beatValue: 4 });
        voice.setStrict(false);
        voice.addTickables(staveNotes);

        new Formatter().joinVoices([voice]).format([voice], Math.max(120, scaledWidth - 70));
        voice.draw(context, stave);
      }
    } catch (error) {
      console.error("Erro ao desenhar a partitura no VexFlow:", error);
    }
  }, [data, notes, sequential, width, height, scale, clef]);

  return <div ref={containerRef} className={`flex justify-center ${className}`} />;
}

export default Stave;
