import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, LibraryBig, BookOpen, Pencil, Trash2 } from "lucide-react";
import { SectionTitle } from "@/components/AppShell";
import { UNITS } from "@/data/curriculum";
import { GLOSSARY } from "@/data/glossary";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/conteudo")({
  head: () => ({
    meta: [
      { title: "Administração de Conteúdo — Linus" },
      {
        name: "description",
        content: "Gerencie unidades, lições e verbetes do glossário visual da plataforma Linus.",
      },
      { property: "og:title", content: "Administração de Conteúdo — Linus" },
      {
        property: "og:description",
        content: "Painel de curadoria pedagógica: unidades, lições e glossário.",
      },
    ],
  }),
  component: AdminConteudo,
});

type Tab = "modulos" | "licoes" | "glossario";

function AdminConteudo() {
  const [tab, setTab] = useState<Tab>("modulos");

  const TABS: { id: Tab; label: string }[] = [
    { id: "modulos", label: "Unidades" },
    { id: "licoes", label: "Lições" },
    { id: "glossario", label: "Glossário" },
  ];

  const allLessons = UNITS.flatMap((u) => u.lessons.map((l) => ({ ...l, unitTitle: u.title })));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionTitle
        eyebrow="Administrador de conteúdo"
        title="Curadoria Pedagógica"
        description="Gestão de módulos, sequenciamento de lições e base de conhecimento do glossário."
      />

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="neu-inset flex gap-1 p-1" role="tablist" aria-label="Seções de conteúdo">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "focus-ring rounded-xl px-4 py-2 text-sm font-bold transition-colors",
                tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="focus-ring ml-auto flex items-center gap-2 rounded-lg bg-success px-4 py-2.5 font-bold text-success-foreground shadow-neu-sm active:translate-y-0.5"
        >
          <Plus className="size-4" aria-hidden /> Novo item
        </button>
      </div>

      {tab === "modulos" && (
        <div className="grid gap-5 sm:grid-cols-2">
          {UNITS.map((u) => (
            <article key={u.id} className="neu p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <LibraryBig className="size-5" aria-hidden />
                </span>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">
                    Unidade {u.index} · {u.level}
                  </p>
                  <h2 className="mt-1 font-display text-lg">{u.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{u.lessons.length} lições cadastradas</p>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <ActionButton icon={Pencil} label="Editar módulo" />
                <ActionButton icon={Trash2} label="Arquivar" destructive />
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "licoes" && (
        <div className="neu overflow-x-auto">
          <table className="w-full min-w-160 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="p-3">Título</th>
                <th className="p-3">Unidade</th>
                <th className="p-3">Exercícios</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {allLessons.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="p-3 font-bold">{l.title}</td>
                  <td className="p-3 text-muted-foreground">{l.unitTitle}</td>
                  <td className="p-3">{l.exercises.length}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <ActionButton icon={Pencil} label="Editar" />
                      <ActionButton icon={Trash2} label="Remover" destructive />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "glossario" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GLOSSARY.map((t) => (
            <article key={t.id} className="neu p-5">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
                <BookOpen className="size-3.5" aria-hidden /> {t.category}
              </p>
              <h2 className="mt-1 font-display text-base">{t.term}</h2>
              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{t.definition}</p>
              <div className="mt-3 flex gap-2">
                <ActionButton icon={Pencil} label="Editar" />
                <ActionButton icon={Trash2} label="Remover" destructive />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  destructive,
}: {
  icon: typeof Pencil;
  label: string;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      className={cn(
        "focus-ring flex size-9 items-center justify-center rounded-xl transition-colors",
        destructive
          ? "text-destructive hover:bg-destructive/10"
          : "text-muted-foreground hover:bg-muted"
      )}
    >
      <Icon className="size-4" aria-hidden />
      <span className="sr-only">{label}</span>
    </button>
  );
}
