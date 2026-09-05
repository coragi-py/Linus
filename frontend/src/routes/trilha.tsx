import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, CheckCircle2, Lock, Flame } from "lucide-react";
import { SectionTitle } from "@/components/AppShell";
import { UNITS, ALL_LESSONS, RECOMMENDED_UNIT } from "@/data/curriculum";
import { useLinus } from "@/context/LinusContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trilha")({
  head: () => ({
    meta: [
      { title: "Trilha Didática — Linus" },
      {
        name: "description",
        content:
          "Progressão gamificada em quatro unidades: leitura de partituras, intervalos e escalas, modos gregos e acordes.",
      },
      { property: "og:title", content: "Trilha Didática — Linus" },
      {
        property: "og:description",
        content: "Avance pelos nós da trilha e desbloqueie unidades de teoria musical.",
      },
    ],
  }),
  component: Trilha,
});

function Trilha() {
  const { state } = useLinus();

  const completedCount = state.completedLessons.length;
  const totalLessons = ALL_LESSONS.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const recommendedUnitId = RECOMMENDED_UNIT[state.placement || "Iniciante"];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionTitle
        eyebrow="Sua jornada"
        title="Trilha de Aprendizado"
        description="Cada nó é uma lição curta. Complete uma para liberar a próxima."
      />

      <div className="mb-10 flex flex-wrap items-center gap-6 rounded-lg bg-card p-6 shadow-neu-sm">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Progresso geral</p>
          <p className="font-display text-2xl">{progressPercent}% concluído</p>
        </div>
        <div className="h-3 min-w-40 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-success transition-all"
            style={{ width: `${Math.max(progressPercent, 3)}%` }}
          />
        </div>
        <p className="flex items-center gap-1.5 font-bold">
          <Flame className="size-4 text-gold" aria-hidden /> {state.streak} dias
        </p>
      </div>

      <div className="space-y-12">
        {UNITS.map((unit, ui) => {
          const recomendada = unit.id === recommendedUnitId;
          return (
            <section key={unit.id} aria-labelledby={`u-${unit.id}`}>
              <div
                className={cn(
                  "mb-6 rounded-lg p-5",
                  recomendada ? "bg-primary text-primary-foreground shadow-neu" : "bg-card shadow-neu-sm",
                )}
              >
                <p className="text-xs font-bold uppercase tracking-wide opacity-80">
                  Nível {unit.level}
                  {recomendada && " · recomendada para você"}
                </p>
                <h2 id={`u-${unit.id}`} className="font-display text-xl">
                  {unit.title}
                </h2>
                <p className="mt-1 text-sm opacity-90">{unit.description}</p>
              </div>

              <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {unit.lessons.map((lesson, li) => {
                  const isCompleted = state.completedLessons.includes(lesson.id);
                  const prevLesson = unit.lessons[li - 1] || (UNITS[ui - 1]?.lessons.slice(-1)[0]);
                  const isLocked = Boolean(!isCompleted && prevLesson && !state.completedLessons.includes(prevLesson.id));

                  return (
                    <li key={lesson.id} className="group relative">
                      <Link
                        to="/licao/$lessonId"
                        params={{ lessonId: lesson.id }}
                        disabled={isLocked}
                        className={cn(
                          "focus-ring flex items-center gap-4 rounded-lg p-4 transition-all active:scale-95",
                          isLocked ? "cursor-not-allowed opacity-60 grayscale" : "bg-card shadow-neu-sm hover:shadow-neu",
                          isCompleted && "ring-2 ring-success ring-offset-2 ring-offset-background"
                        )}
                      >
                        <div
                          className={cn(
                            "flex size-14 items-center justify-center rounded-lg",
                            isLocked ? "bg-muted text-muted-foreground" :
                            isCompleted ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"
                          )}
                        >
                          {isLocked ? <Lock className="size-6" /> : isCompleted ? <CheckCircle2 className="size-7" /> : <Play className="size-7 ml-1" />}
                        </div>
                        <div>
                          <p className="font-display text-lg">{lesson.title}</p>
                          <p className="text-sm text-muted-foreground">{lesson.subtitle}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
