import { createFileRoute } from "@tanstack/react-router";
import { Flame, Star, Trophy, Target, TrendingUp, Award, Clock } from "lucide-react";
import { SectionTitle } from "@/components/AppShell";
import { useLinus } from "@/context/LinusContext";
import { ALL_LESSONS } from "@/data/curriculum";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Meu Painel — Progresso e conquistas | Linus" },
      {
        name: "description",
        content:
          "Acompanhe ofensiva diária, taxa de conclusão das lições, conquistas e recomendações de prática.",
      },
      { property: "og:title", content: "Meu Painel — Progresso e conquistas | Linus" },
      {
        property: "og:description",
        content: "Streak, medalhas e a próxima prática recomendada para você.",
      },
    ],
  }),
  component: Painel,
});

function Painel() {
  const { state } = useLinus();
  const completedCount = state.completedLessons.length;
  const progressPercent = Math.round((completedCount / ALL_LESSONS.length) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionTitle
        eyebrow="Painel pessoal"
        title={`Bem-vindo de volta, ${state.name.split(" ")[0]}`}
        description="Confira como está o seu ritmo de estudos e quais são os próximos passos."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article className="neu p-6">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flame className="size-4 text-gold" aria-hidden /> Ofensiva diária
          </p>
          <p className="mt-2 font-display text-4xl">{state.streak} dias</p>
          <p className="text-xs text-muted-foreground">Continue praticando para não perder!</p>
        </article>
        
        <article className="neu p-6">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="size-4 text-success" aria-hidden /> Conclusão de lições
          </p>
          <p className="mt-2 font-display text-4xl">{progressPercent}%</p>
          <p className="text-xs text-muted-foreground">
            {completedCount} de {ALL_LESSONS.length} lições concluídas
          </p>
        </article>

        <article className="neu p-6">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="size-4 text-primary" aria-hidden /> Conquistas
          </p>
          <p className="mt-2 font-display text-4xl">{state.badges.length}</p>
          <p className="text-xs text-muted-foreground">Medalhas desbloqueadas</p>
        </article>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="neu p-6">
          <h2 className="flex items-center gap-2 font-display text-xl">
            <Trophy className="size-5 text-gold" aria-hidden /> Conquistas Recentes
          </h2>
          <div className="mt-5 space-y-4">
            {state.badges.length > 0 ? (
              state.badges.map((b) => (
                <div key={b} className="flex items-center gap-4 rounded-lg bg-muted/30 p-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Star className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold capitalize">{b.replace(/-/g, " ")}</p>
                    <p className="text-xs text-muted-foreground">Conquistado recentemente</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">Complete lições para ganhar medalhas.</p>
            )}
          </div>
        </section>

        <section className="neu p-6">
          <h2 className="flex items-center gap-2 font-display text-xl">
            <Target className="size-5 text-primary" aria-hidden /> Foco de Estudo
          </h2>
          <div className="mt-5 space-y-4">
            {Object.entries(state.errorsByTopic).map(([topic, stats]) => (
              <div key={topic}>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
                  <span>{topic}</span>
                  <span className="text-muted-foreground">{Math.round(((stats.total - stats.erros) / stats.total) * 100)}% precisão</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full bg-primary transition-all" 
                    style={{ width: `${((stats.total - stats.erros) / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
