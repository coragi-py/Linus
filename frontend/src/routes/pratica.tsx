//Adicionado a historico e plotado as notas para visualização por Antonio 10/09
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eraser, Keyboard, Music2, Save } from "lucide-react";
import { SectionTitle } from "@/components/AppShell";
import Stave from "@/components/Stave";
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
  const [isSaving, setIsSaving] = useState(false);


  // Armazenando as ultimos 8 notas
  const recentNotes = history.slice(-8);


  // Vexflow
  // Cada nota armazenada vira colcheia (/8).
  // Na ausencia de nota é preenchdio o restante com pausas (/8/r) para fechar o compasso 4/4.
  // Se nenhuma nota foi tocada ainda, exibe uma pausa de compasso inteiro (/w/r).
  const notas=
  // aqui dentro modifica as notas, duração etc.
    recentNotes.length === 0
      ? "B4/w/r"
      : [
          ...recentNotes.map((n) => `${n}/8`),
          ...Array(8 - recentNotes.length).fill("B4/8/r"),
        ].join(", ");


  const handleSaveToDatabase = async () => {
    if (history.length === 0) return;


    setIsSaving(true);
    console.log("Enviando para o backend a sequência de notas:", history);


    setTimeout(() => {
      alert("Integração com backend virá aqui!");
      setIsSaving(false);
    }, 1000);
  };


  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <SectionTitle
        eyebrow="Prática livre"
        title="Piano virtual e partitura ao vivo"
        description="Duas oitavas de C3 a B4, síntese polifônica de baixa latência e a nota aparecendo na pauta no instante em que você toca."
      />


      <div className="neu p-5 sm:p-7">
        <div className="neu-inset mb-5 flex flex-col items-center gap-3 p-5">
          {/* Seletor de Clave */}
          <div className="flex items-center gap-2 self-end" role="group" aria-label="Escolher clave">
            <Music2 className="size-4 text-primary" aria-hidden />
            <button
              type="button"
              onClick={() => setClef("treble")}
              aria-pressed={clef === "treble"}
              className={
                clef === "treble"
                  ? "focus-ring rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                  : "focus-ring rounded-md px-3 py-1.5 text-xs font-bold text-muted-foreground"
              }
            >
              Clave de Sol
            </button>
            <button
              type="button"
              onClick={() => setClef("bass")}
              aria-pressed={clef === "bass"}
              className={
                clef === "bass"
                  ? "focus-ring rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                  : "focus-ring rounded-md px-3 py-1.5 text-xs font-bold text-muted-foreground"
              }
            >
              Clave de Fá
            </button>
          </div>


          {/* Partitura exibindo o histórico deslizante de até 8 notas */}
          <Stave
            data={{
              clef: clef,
              timeSignature: "4/4",
              notes: notas,
              width: 560,
              height: 190,
            }}
          />


          <p className="text-sm font-bold text-primary" aria-live="polite">
            {current.length > 0
              ? current.map((n) => `${noteLabelPt(n)} ${n.slice(-1)}`).join(" · ")
              : "Toque uma tecla para escrever na pauta"}
          </p>
        </div>


        <VirtualPiano
          onNoteOn={(note) => {
            setCurrent([note]);
            setHistory((h) => [...h, note]);
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
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Últimas notas tocadas ({history.length})</h2>


          <button
            onClick={handleSaveToDatabase}
            disabled={history.length === 0 || isSaving}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            <Save className="size-4" aria-hidden />
            {isSaving ? "Salvando..." : "Salvar Gravação"}
          </button>
        </div>


        <div className="mt-4 flex max-h-48 flex-wrap gap-2 overflow-y-auto p-2">
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

