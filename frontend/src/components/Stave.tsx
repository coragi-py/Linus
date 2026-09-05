// Esse arquivo é responsável por renderizar a partitura musical usando a biblioteca VexFlow.

import { useEffect, useRef } from "react";
import { Factory } from "vexflow"; // Importação direta do VexFlow 4+

interface StaveProps {
  data: {
    clef: string;
    timeSignature: string;
    notes: string;
    width?: number;
    height?: number;
  };
  className?: string;
}

export default function Stave({ data, className }: StaveProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    // Limpa a partitura anterior (essencial ao mudar de pergunta na triagem)
    containerRef.current.innerHTML = "";

    try {
      // Passamos o elemento HTML diretamente em vez de usar um ID em string
      const vf = new Factory({
        renderer: {
          elementId: containerRef.current as unknown as string,
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
    } catch (error) {
      console.error("Erro ao desenhar a partitura no VexFlow:", error);
    }
  }, [data]);

  return (
    // Div limpa, apenas com a referência para o React manipular o DOM
    <div ref={containerRef} className={`flex justify-center ${className}`} />
  );
}
