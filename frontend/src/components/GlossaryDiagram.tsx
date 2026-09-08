// Esse arquivo utiliza a biblioteca VexFlow para renderizar os símbolos das notas musicais de acordo com o contexto que o JSON trás no parametro diagram, por Anny em 08/09
import { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Accidental, Formatter } from "vexflow";
export function GlossaryDiagram({ diagram }: { diagram: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = ""; 
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(200, 100);
    const context = renderer.getContext();
    context.scale(1.4, 1.4);
    // cores do desenho da nota
    context.setFillStyle("#2B6CB0");
    context.setStrokeStyle("#2B6CB0");
    const stave = new Stave(15, -25, 120);
    stave.setContext(context);
    stave.getContext().setFillStyle("#2B6CB0").setStrokeStyle("#2B6CB0");
    //Pautas e Claves
    if (["treble", "bass", "alto", "tenor", "percussion"].includes(diagram)) {
      stave.addClef(diagram).draw();
    } 
    //Fórmulas de Compasso
    else if (diagram.startsWith("time-")) {
      const timeMap: Record<string, string> = {
        "time-4/4": "4/4",
        "time-3/4": "3/4",
        "time-2/4": "2/4",
        "time-6/8": "6/8",
        "time-c": "C",
        "time-cut": "C|",
      };
      stave.addTimeSignature(timeMap[diagram]).draw();
    }
    //Figuras de Nota
    else if (
      ["whole", "half", "quarter", "eighth", "sixteenth", "thirtysecond", "sixtyfourth"].includes(
        diagram,
      )
    ) {
      stave.draw();
      const durationMap: Record<string, string> = { 
        whole: "w",
        half: "h",
        quarter: "q",
        eighth: "8",
        sixteenth: "16",
        thirtysecond: "32",
        sixtyfourth: "64",
      };
      const note = new StaveNote({ keys: ["b/4"], duration: durationMap[diagram] });
      note.setStyle({ fillStyle: "#2B6CB0", strokeStyle: "#2B6CB0" });
      Formatter.FormatAndDraw(context, stave, [note]);
    } 
    //Pausas
    else if (
      [
        "whole-rest",
        "half-rest",
        "quarter-rest",
        "eighth-rest",
        "sixteenth-rest",
        "thirtysecond-rest",
        "sixtyfourth-rest",
      ].includes(diagram)
    ) {
      stave.draw();
      const restMap: Record<string, string> = { 
        "whole-rest": "wr",
        "half-rest": "hr",
        "quarter-rest": "qr",
        "eighth-rest": "8r",
        "sixteenth-rest": "16r",
        "thirtysecond-rest": "32r",
        "sixtyfourth-rest": "64r",
      };
      const note = new StaveNote({ keys: ["b/4"], duration: restMap[diagram] });
      note.setStyle({ fillStyle: "#2B6CB0", strokeStyle: "#2B6CB0" });
      Formatter.FormatAndDraw(context, stave, [note]);
    } 
    //Acidentes
    else if (["sharp", "flat", "natural", "doublesharp", "doubleflat"].includes(diagram)) {
      stave.draw();
      const accMap: Record<string, string> = { 
        sharp: "#",
        flat: "b",
        natural: "n",
        doublesharp: "##",
        doubleflat: "bb",
      };
      const note = new StaveNote({ keys: ["b/4"], duration: "q" }).addModifier(
        new Accidental(accMap[diagram]),
      );
      note.setStyle({ fillStyle: "#2B6CB0", strokeStyle: "#2B6CB0" });
      Formatter.FormatAndDraw(context, stave, [note]);
    }
    //Pauta Vazia (stave)
    else {
      stave.draw();
    }
  }, [diagram]);

  return <div ref={containerRef} className="flex h-32 w-full items-center justify-center" />;
}