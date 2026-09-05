import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eraser, Keyboard, Music2 } from "lucide-react";
import { SectionTitle } from "@/components/AppShell";
import { Stave } from "@/components/Stave";
import { VirtualPiano } from "@/components/VirtualPiano";
import { noteLabelPt } from "@/lib/music";

export const Route = createFileRoute("/pratica")({
  head: () => ({
    meta: [
      { title: "Prática Livre — Piano virtual | Linus" },
      {
        name: "description",
        content:
          "Piano virtual de duas oitavas (C3 a B4) com síntese polifônica e pauta dinâmica que escreve em tempo real a nota tocada.",
      },
      { property: "og:title", content: "Prática Livre — Piano virtual | Linus" },
      {
        property: "og:description",
        content: "Toque com o teclado do computador e veja a partitura se escrever ao vivo.",
      },
    ],
  }),
  component: Pratica,
});

function Pratica() {
  const [current, setCurrent] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [clef, setClef] = useState<"treble" | "bass">("treble");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <SectionTitle
        eyebrow="Prática livre"
        title="Piano virtual e partitura ao vivo"
        description="Duas oitavas de C3 a B4, síntese polifônica de baixa latência e a nota aparecendo na pauta no instante em que você toca."
      />

      <div className="neu p-5 sm:p-7">
        <div className="neu-inset mb-5 flex flex-col items-center gap-3 p-5">
          <div className="flex items-center gap-2 self-end" role="group" aria-label="Escolher clave">
            <Music2 className="size-4 text-primary" aria-hidden />
            <button type="button" onClick={() => setClef("treble")} aria-pressed={clef === "treble"} className={clef === "treble" ? "focus-ring rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground" : "focus-ring rounded-md px-3 py-1.5 text-xs font-bold text-muted-foreground"}>Clave de Sol</button>
            <button type="button" onClick={() => setClef("bass")} aria-pressed={clef === "bass"} className={clef === "bass" ? "focus-ring rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground" : "focus-ring rounded-md px-3 py-1.5 text-xs font-bold text-muted-foreground"}>Clave de Fá</button>
          </div>
          <Stave notes={current} width={560} height={190} scale={1.45} clef={clef} />
          <p className="text-sm font-bold text-primary" aria-live="polite">
            {current.length > 0
              ? current.map((n) => `${noteLabelPt(n)} ${n.slice(-1)}`).join(" · ")
              : "Toque uma tecla para escrever na pauta"}
          </p>
        </div>

        <VirtualPiano
          onNoteOn={(note) => {
            setCurrent([note]);
            setHistory((h) => [note, ...h].slice(0, 16));
          }}
        />

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Keyboard className="size-4" aria-hidden />
            Teclas: Q=Dó, 2=Dó#, W=Ré, 3=Ré#, E=Mi, R=Fá...
          </p>
          <button
            type="button"
            onClick={() => {
              setCurrent([]);
              setHistory([]);
            }}
            className="focus-ring ml-auto flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm font-bold text-primary shadow-neu-sm active:translate-y-0.5"
          >
            <Eraser className="size-4" aria-hidden /> Limpar
          </button>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-xl">Últimas notas tocadas</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {history.length === 0 && <p className="text-sm text-muted-foreground">Nada ainda por aqui.</p>}
          {history.map((n, i) => (
            <span
              key={`${n}-${i}`}
              className="neu-sm px-3 py-1.5 text-sm font-bold text-foreground"
            >
              {noteLabelPt(n)} {n.slice(-1)}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
