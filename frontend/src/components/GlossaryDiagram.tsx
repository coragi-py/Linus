import { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Accidental, Formatter } from "vexflow";

export function GlossaryDiagram({ diagram }: { diagram?: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = "";

    const raw = (diagram || "").trim().toLowerCase();

    try {
      const renderer = new Renderer(el, Renderer.Backends.SVG);
      renderer.resize(200, 110);
      const context = renderer.getContext();
      context.scale(1.35, 1.35);

      context.setFillStyle("#2B6CB0");
      context.setStrokeStyle("#2B6CB0");

      const stave = new Stave(12, -10, 125);
      stave.setContext(context);
      stave.getContext().setFillStyle("#2B6CB0").setStrokeStyle("#2B6CB0");

      // 1. Pautas e Claves
      if (["treble", "bass", "alto", "tenor", "percussion"].includes(raw)) {
        stave.addClef(raw).draw();
        return;
      }

      // 2. Fórmulas de Compasso
      const timeMap: Record<string, string> = {
        "time-4/4": "4/4",
        "4/4": "4/4",
        "time-3/4": "3/4",
        "3/4": "3/4",
        "time-2/4": "2/4",
        "2/4": "2/4",
        "time-6/8": "6/8",
        "6/8": "6/8",
        "time-c": "C",
        "time-cut": "C|",
      };
      if (timeMap[raw]) {
        stave.addTimeSignature(timeMap[raw]).draw();
        return;
      }

      // 3. Figuras de Nota
      const durationMap: Record<string, string> = {
        whole: "w",
        half: "h",
        quarter: "q",
        eighth: "8",
        sixteenth: "16",
        thirtysecond: "32",
        sixtyfourth: "64",
      };
      if (durationMap[raw]) {
        stave.draw();
        const note = new StaveNote({ keys: ["b/4"], duration: durationMap[raw] });
        note.setStyle({ fillStyle: "#2B6CB0", strokeStyle: "#2B6CB0" });
        Formatter.FormatAndDraw(context, stave, [note]);
        return;
      }

      // 4. Pausas
      const restMap: Record<string, string> = {
        "whole-rest": "wr",
        "half-rest": "hr",
        "quarter-rest": "qr",
        "eighth-rest": "8r",
        "sixteenth-rest": "16r",
        "thirtysecond-rest": "32r",
        "sixtyfourth-rest": "64r",
      };
      if (restMap[raw]) {
        stave.draw();
        const note = new StaveNote({ keys: ["b/4"], duration: restMap[raw] });
        note.setStyle({ fillStyle: "#2B6CB0", strokeStyle: "#2B6CB0" });
        Formatter.FormatAndDraw(context, stave, [note]);
        return;
      }

      // 5. Acidentes
      const accMap: Record<string, string> = {
        sharp: "#",
        flat: "b",
        natural: "n",
        doublesharp: "##",
        doubleflat: "bb",
      };
      if (accMap[raw]) {
        stave.draw();
        const note = new StaveNote({ keys: ["b/4"], duration: "q" }).addModifier(
          new Accidental(accMap[raw]),
        );
        note.setStyle({ fillStyle: "#2B6CB0", strokeStyle: "#2B6CB0" });
        Formatter.FormatAndDraw(context, stave, [note]);
        return;
      }

      // Fallback seguro: desenha a pauta musical padrão sem quebrar a página
      stave.draw();
    } catch (err) {
      console.error("Erro ao renderizar diagrama do glossário:", raw, err);
    }
  }, [diagram]);

  return (
    <div
      ref={containerRef}
      className="glossary-diagram-container flex h-28 w-full items-center justify-center"
    />
  );
}

export default GlossaryDiagram;
