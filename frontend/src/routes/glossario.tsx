import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, EyeOff } from "lucide-react";
import { SectionTitle } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
//import { GLOSSARY, type GlossaryCategory } from "@/data/glossary";
import { GlossaryDiagram } from "@/components/GlossaryDiagram";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/glossario")({
  head: () => ({
    meta: [
      { title: "Glossário Visual de Música — Linus" },
      {
        name: "description",
        content:
          "Consulte termos e símbolos musicais — pautas, figuras de duração e acidentes — com definições e diagramas vetoriais.",
      },
      { property: "og:title", content: "Glossário Visual de Música — Linus" },
      {
        property: "og:description",
        content: "Pautas, figuras e acidentes explicados com texto e diagramas, sem áudio.",
      },
    ],
  }),
  component: Dicionario,
});

type GlossaryCategory = "Pautas" | "Figuras" | "Acidentes";

type GlossaryItem = {
  id: string;
  term: string;
  definition: string;
  diagram: string;
  category: GlossaryCategory;
};

const CATEGORIAS: ("Todas" | GlossaryCategory)[] = ["Todas", "Pautas", "Figuras", "Acidentes"];


function Dicionario() {
  const [busca, setBusca] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIAS)[number]>("Todas");

  const [dadosGlossario, setDadosGlossario] = useState<GlossaryItem[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/glossario/")
      .then((resposta) => resposta.json())
      .then((dados) => {
        setDadosGlossario(dados);
        setCarregando(false);
      })
      .catch((erro) => {
        console.error("Erro ao carregar o glossário:", erro);
        setCarregando(false);
      });
  }, []);

  const resultados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return dadosGlossario.filter(
      (t) =>
        (cat === "Todas" || t.category === cat) &&
        (q === "" || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)),
    );
  }, [busca, cat, dadosGlossario]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionTitle
        eyebrow="Glossário visual"
        title="Termos e símbolos da música"
        description="Busque um conceito e veja a definição junto do desenho do símbolo."
      />

      <p className="mb-6 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm text-muted-foreground">
        <EyeOff className="size-4" aria-hidden />
        Esta seção é apenas texto e imagem — nenhum som é reproduzido aqui.
      </p>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar termo ou símbolo..."
            aria-label="Buscar no glossário"
            className="rounded-lg pl-10"
          />
        </div>
        <div className="flex gap-2" role="group" aria-label="Filtrar por categoria">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "focus-ring rounded-xl px-3 py-2 text-sm font-bold transition-colors",
                cat === c ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground shadow-neu-sm",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {carregando ? (
        <p className="neu p-8 text-center text-muted-foreground"> Carregando termos musicais... </p>
      ) : resultados.length === 0 ? (
        <p className="neu p-8 text-center text-muted-foreground">
          Nenhum termo encontrado para “{busca}”.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((t) => (
            <article key={t.id} className="neu flex flex-col p-5">
              <div className="neu-inset mb-4 p-3">
                <GlossaryDiagram diagram={t.diagram} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">{t.category}</p>
              <h2 className="mt-1 font-display text-lg">{t.term}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.definition}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}