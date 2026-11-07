import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, ArrowRight, Heart, PartyPopper, Volume2, X } from "lucide-react";
import { Stave } from "@/components/Stave";
import { VirtualPiano } from "@/components/VirtualPiano";
import { type Exercise } from "@/data/curriculum";
import { useLinus } from "@/context/LinusContext";
import { playFeedback, playNote, playSequence } from "@/lib/audio";
import { noteLabelPt } from "@/lib/music";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/licao/$lessonId")({
  head: () => ({
    meta: [
      { title: "Lição interativa — Linus" },
      {
        name: "description",
        content:
          "Aula interativa de teoria musical com explicação guiada, exemplo sonoro na pauta e exercícios práticos.",
      },
    ],
  }),
  component: LessonPage,
});

type Status = "idle" | "correct" | "wrong";

function LessonPage() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const { state, findLessonById, completeLesson, loseHeart, refillHearts, registerAnswer } =
    useLinus();

  const found = useMemo(() => findLessonById(lessonId), [findLessonById, lessonId]);

  // Começa na etapa teórica ("teoria") antes de ir para os exercícios ("pratica")
  const [etapaAula, setEtapaAula] = useState<"teoria" | "pratica">("teoria");
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [selected, setSelected] = useState<string | null>(null);
  const [built, setBuilt] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    refillHearts();
    setEtapaAula("teoria");
    setIndex(0);
    setStatus("idle");
    setSelected(null);
    setBuilt([]);
    setFinished(false);
    setAcertos(0);
    startTimeRef.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  useEffect(() => {
    if (etapaAula === "pratica") {
      startTimeRef.current = Date.now();
    }
  }, [index, etapaAula]);

  if (!found || found.lesson.exercises.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl">Lição não encontrada</h1>
        <Link to="/trilha" className="mt-4 inline-block font-bold text-primary underline">
          Voltar para a trilha
        </Link>
      </div>
    );
  }

  const { lesson, unit } = found;
  const topic = unit.title.replace(/^Unidade \d+: /, "");
  const ex: Exercise = lesson.exercises[index]!;
  const progress =
    etapaAula === "teoria"
      ? 5
      : ((index + (status !== "idle" ? 1 : 0)) / lesson.exercises.length) * 100;

  const textoTeorico = lesson.theory || lesson.subtitle || "";
  const paragrafosTeoria = textoTeorico
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const demoNotes: string[] = Array.isArray(lesson.partitura_dados?.notes)
    ? lesson.partitura_dados!.notes!
    : ex.stave || ["C4", "D4", "E4", "F4", "G4"];
  const demoClef = lesson.partitura_dados?.clef || "treble";
  const demoCaption =
    lesson.partitura_dados?.caption ||
    "Ouça e observe as notas de referência na pauta antes de iniciar os exercícios.";

  function validar(resposta: string) {
    if (status !== "idle") return;
    const ok = resposta === ex.answer;
    const elapsedMs = Math.max(0, Date.now() - startTimeRef.current);

    setSelected(resposta);
    setStatus(ok ? "correct" : "wrong");
    registerAnswer(topic, ok, {
      exercicioId: ex.id,
      resposta,
      tempoRespostaMs: elapsedMs,
    });
    void playFeedback(ok);
    if (ok) setAcertos((a) => a + 1);
    else loseHeart();
  }

  function avancar() {
    if (index + 1 >= lesson.exercises.length) {
      completeLesson(lesson.id, {
        acertos,
        total: lesson.exercises.length,
      });
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setStatus("idle");
    setSelected(null);
    setBuilt([]);
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <div className="neu animate-pop p-8 text-center">
          <span className="mx-auto mb-4 flex size-16 items-center justify-center rounded-lg bg-gold text-gold-foreground">
            <PartyPopper className="size-8" aria-hidden />
          </span>
          <h1 className="font-display text-3xl">Lição concluída!</h1>
          <p className="mt-2 text-muted-foreground">
            Você acertou {acertos} de {lesson.exercises.length} exercícios práticos nesta aula.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/trilha"
              className="focus-ring rounded-lg bg-success px-6 py-3.5 font-display text-lg text-success-foreground shadow-neu-sm active:translate-y-0.5"
            >
              Voltar à trilha
            </Link>
            <Link
              to="/painel"
              className="focus-ring rounded-lg bg-card px-6 py-3.5 font-display text-lg text-primary shadow-neu-sm active:translate-y-0.5"
            >
              Ver meu painel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Barra superior */}
      <header className="border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <button
            type="button"
            aria-label="Sair da lição"
            onClick={() => navigate({ to: "/trilha" })}
            className="focus-ring rounded-xl p-2 text-muted-foreground hover:bg-muted"
          >
            <X className="size-5" aria-hidden />
          </button>
          <div
            className="h-4 flex-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-success transition-[width] duration-500"
              style={{ width: `${Math.max(progress, 5)}%` }}
            />
          </div>

          {etapaAula === "pratica" && (
            <button
              type="button"
              onClick={() => setEtapaAula("teoria")}
              className="focus-ring flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary hover:bg-muted"
            >
              <BookOpen className="size-3.5" /> Rever Teoria
            </button>
          )}

          <p className="flex items-center gap-1" aria-label={`${state.hearts} vidas restantes`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart
                key={i}
                className={cn(
                  "size-5",
                  i < state.hearts ? "fill-destructive text-destructive" : "text-muted",
                )}
                aria-hidden
              />
            ))}
          </p>
        </div>
      </header>

      {/* ================= ETAPA 1: CONTEÚDO TEÓRICO E DEMONSTRAÇÃO SONORA ================= */}
      {etapaAula === "teoria" ? (
        <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 pb-24">
          <div className="neu rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <BookOpen className="size-3.5" /> Guia Teórico da Aula · {unit.title}
              </span>
              <h1 className="mt-3 font-display text-2xl sm:text-3xl text-foreground">
                {lesson.title}
              </h1>
            </div>

            <div className="space-y-4 text-base leading-relaxed text-foreground/90">
              {paragrafosTeoria.map((paragrafo, idx) => (
                <p
                  key={idx}
                  className={cn(
                    idx === 0 && "font-medium text-foreground",
                    paragrafo.startsWith("💡") &&
                      "rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm font-medium text-foreground",
                  )}
                >
                  {paragrafo}
                </p>
              ))}
            </div>

            {/* Demonstração Interativa na Pauta + Síntese Sonora */}
            {demoNotes.length > 0 && (
              <div className="neu-inset flex flex-col items-center gap-3 rounded-xl p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Exemplo Visual e Sonoro na Pauta
                </span>
                <Stave
                  notes={demoNotes}
                  sequential={demoNotes.length > 1}
                  width={460}
                  height={170}
                  scale={1.35}
                  clef={demoClef}
                />
                <p className="text-center text-xs text-muted-foreground">{demoCaption}</p>
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      void (demoNotes.length > 1
                        ? playSequence(demoNotes)
                        : playNote(demoNotes[0]!, "2n"))
                    }
                    className="focus-ring flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-neu-sm active:translate-y-0.5"
                  >
                    <Volume2 className="size-4" aria-hidden /> Ouvir Exemplo Completo
                  </button>
                  {demoNotes.map((n, i) => (
                    <button
                      key={`${n}-${i}`}
                      type="button"
                      onClick={() => void playNote(n, "4n")}
                      className="focus-ring rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted"
                    >
                      ♪ {noteLabelPt(n)} ({n})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                A seguir: <strong>{lesson.exercises.length} exercícios práticos</strong> para fixar
                este conteúdo.
              </p>
              <button
                type="button"
                onClick={() => setEtapaAula("pratica")}
                className="focus-ring flex items-center gap-2 rounded-xl bg-success px-6 py-3.5 font-display text-lg text-success-foreground shadow-neu-sm transition-transform active:translate-y-0.5"
              >
                Iniciar Prática ({lesson.exercises.length} desafios)
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ================= ETAPA 2: EXERCÍCIOS INTERATIVOS ================= */
        <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 pb-40">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            {lesson.title} · Exercício {index + 1} de {lesson.exercises.length}
          </p>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl">{ex.prompt}</h1>

          {ex.stave && (
            <div className="neu-inset mt-6 flex flex-col items-center gap-3 p-5">
              <Stave
                notes={ex.stave}
                sequential={ex.stave.length > 1}
                width={420}
                height={180}
                scale={1.45}
                clef="treble"
              />
              <button
                type="button"
                onClick={() =>
                  void (ex.stave!.length > 1
                    ? playSequence(ex.stave!)
                    : playNote(ex.stave![0]!, "2n"))
                }
                className="focus-ring flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm font-bold text-primary shadow-neu-sm active:translate-y-0.5"
              >
                <Volume2 className="size-4" aria-hidden /> Ouvir
              </button>
            </div>
          )}

          {/* Múltipla escolha / leitura de notas */}
          {ex.options && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {ex.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => validar(opt)}
                  disabled={status !== "idle"}
                  className={cn(
                    "focus-ring rounded-lg bg-background p-4 text-left font-bold shadow-neu-sm transition-transform hover:bg-primary-soft active:translate-y-0.5",
                    selected === opt &&
                      status === "correct" &&
                      "bg-success text-success-foreground",
                    selected === opt &&
                      status === "wrong" &&
                      "animate-shake bg-destructive text-destructive-foreground",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Toque no piano */}
          {ex.kind === "keyboard" && (
            <div className="mt-8">
              <p className="mb-3 text-sm text-muted-foreground">
                Toque a tecla correspondente no piano abaixo (mouse ou teclado do computador).
              </p>
              <VirtualPiano onNoteOn={(note) => validar(note)} compact />
            </div>
          )}

          {/* Construtor de escalas/intervalos */}
          {ex.kind === "builder" && ex.sequence && (
            <div className="mt-8 space-y-4">
              <div className="neu-inset flex min-h-24 flex-wrap items-center gap-2 p-4">
                {built.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Clique nas notas na ordem correta para montar a sequência.
                  </p>
                )}
                {built.map((n, i) => (
                  <span
                    key={`${n}-${i}`}
                    className="animate-pop rounded-xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"
                  >
                    {noteLabelPt(n)}
                  </span>
                ))}
              </div>
              {built.length > 0 && (
                <div className="neu-inset flex justify-center p-4">
                  <Stave notes={built} sequential width={420} height={150} />
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {[...ex.sequence]
                  .sort((a, b) => a.localeCompare(b))
                  .map((n) => (
                    <button
                      key={n}
                      type="button"
                      disabled={status !== "idle"}
                      onClick={() => {
                        void playNote(n);
                        setBuilt((b) => [...b, n]);
                      }}
                      className="focus-ring rounded-lg bg-card px-4 py-3 text-sm font-bold shadow-neu-sm active:translate-y-0.5"
                    >
                      {noteLabelPt(n)} {n.slice(-1)}
                    </button>
                  ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBuilt([])}
                  className="focus-ring rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-muted"
                >
                  Limpar
                </button>
                <button
                  type="button"
                  disabled={status !== "idle" || built.length === 0}
                  onClick={() => validar(built.join(","))}
                  className="focus-ring rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-neu-sm disabled:opacity-50"
                >
                  Conferir sequência
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Barra de confirmação inferior */}
      {etapaAula === "pratica" && status !== "idle" && (
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 border-t-2 p-5",
            status === "correct"
              ? "border-success bg-accent"
              : "border-destructive bg-destructive/10",
          )}
          role="status"
          aria-live="assertive"
        >
          <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-4">
            <div className="flex-1">
              <p
                className={cn(
                  "font-display text-xl",
                  status === "correct" ? "text-success-foreground" : "text-destructive",
                )}
              >
                {status === "correct" ? "Muito bem!" : `Ainda não. Resposta: ${ex.answer}`}
              </p>
              <p className="mt-1 text-sm text-foreground">{ex.explanation}</p>
            </div>
            <button
              type="button"
              onClick={avancar}
              className={cn(
                "focus-ring rounded-lg px-8 py-3.5 font-display text-lg shadow-neu-sm active:translate-y-0.5",
                status === "correct"
                  ? "bg-success text-success-foreground"
                  : "bg-primary text-primary-foreground",
              )}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
