import { useEffect, useRef } from "react";
import { noteToVex } from "@/lib/music";
import { cn } from "@/lib/utils";

type Props = {
  /** Notas em notação científica, ex. ["C4"]. Mais de uma nota = acorde/intervalo. */
  notes: string[];
  /** Renderiza cada nota separadamente na sequência (em vez de acorde) */
  sequential?: boolean;
  width?: number;
  height?: number;
  /** Fator de ampliação visual da pauta (padrão 1.6 para melhor legibilidade). */
  scale?: number;
  clef?: "treble" | "bass";
  className?: string;
};

/** Pauta dinâmica em SVG usando VexFlow (carregado somente no cliente). */
export function Stave({
  notes,
  sequential = false,
  width = 360,
  height = 150,
  scale = 1.6,
  clef = "treble",
  className,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;

    (async () => {
      const VF = await import("vexflow");
      if (cancelled || !hostRef.current) return;
      const el = hostRef.current;
      el.innerHTML = "";

      const renderer = new VF.Renderer(el, VF.Renderer.Backends.SVG);
      renderer.resize(width, height);
      const ctx = renderer.getContext();
      ctx.scale(scale, scale);
      const w = width / scale;
      const h = height / scale;
      ctx.setFillStyle("#2D3748");
      ctx.setStrokeStyle("#2D3748");

      const stave = new VF.Stave(20, Math.max(12, h / 2 - 34), w - 34);
      stave.addClef(clef).setContext(ctx).draw();

      if (notes.length === 0) {
        return;
      }

      const groups = sequential ? notes.map((n) => [n]) : [notes];
      const staveNotes = groups.map((group) => {
        const keys = group.map(noteToVex);
        const sn = new VF.StaveNote({ keys, duration: "q", clef });
        keys.forEach((k, i) => {
          if (k.includes("#")) {
            sn.addModifier(new VF.Accidental("#"), i);
          } else if (k.includes("b")) {
            sn.addModifier(new VF.Accidental("b"), i);
          } else if (k.includes("n")) {
            sn.addModifier(new VF.Accidental("n"), i);
          }
        });
        sn.setStyle({ fillStyle: "#2B6CB0", strokeStyle: "#2B6CB0" });
        return sn;
      });

      const voice = new VF.Voice({ numBeats: staveNotes.length, beatValue: 4 }).setStrict(false);
      voice.addTickables(staveNotes);
      new VF.Formatter().joinVoices([voice]).format([voice], w - 70);
      voice.draw(ctx, stave);

      const svg = el.querySelector("svg");
      if (svg) {
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.style.width = "100%";
        svg.style.maxWidth = `${width}px`;
        svg.style.height = "auto";
        svg.style.display = "block";
        svg.style.margin = "0 auto";
        svg.style.overflow = "visible";
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [notes, sequential, width, height, scale, clef]);

  return (
    <div
      ref={hostRef}
      className={cn("flex w-full justify-center overflow-visible", className)}
      aria-label={`Pauta musical com as notas ${notes.join(", ") || "vazia"}`}
      role="img"
    />
  );
}
