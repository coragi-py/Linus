import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, EyeOff } from "lucide-react";
import { SectionTitle } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
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

type GlossaryItem = {
  id: string;
  term: string;
  definition: string;
  diagram: string;
  category: string;
};

const CATEGORIAS = ["Todas", "Pautas", "Figuras", "Acidentes"] as const;

function Dicionario() {
  const [busca, setBusca] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIAS)[number]>("Todas");

  const [dadosGlossario, setDadosGlossario] = useState<GlossaryItem[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/glossary/")
      .then((resposta) => resposta.json())
      .then((dados) => {
        const lista = Array.isArray(dados) ? dados : dados.results || [];
        const normalizado: GlossaryItem[] = lista.map((item: any) => ({
          id: item.id,
          term: item.term || item.termo || "",
          definition: item.definition || item.definicao || "",
          diagram: item.diagram || item.figura_svg || "",
          category: item.category || item.categoria || "",
        }));
        setDadosGlossario(normalizado);
        setCarregando(false);
      })
      .catch((erro) => {
        console.error("Erro ao carregar o glossário:", erro);
        setCarregando(false);
      });
  }, []);

  const resultados = useMemo(() => {
    const q = busca.trim().toLowerCase();

    return dadosGlossario.filter((t) => {
      const termoCat = t.category.toLowerCase();

      // Mapeamento flexível com os formatos gravados no banco
      const categoriaValida =
        cat === "Todas" ||
        (cat === "Pautas" && (termoCat.includes("pauta") || termoCat.includes("clave"))) ||
        (cat === "Figuras" &&
          (termoCat.includes("figura") ||
            termoCat.includes("nota") ||
            termoCat.includes("compasso") ||
            termoCat.includes("pausa"))) ||
        (cat === "Acidentes" && termoCat.includes("acidente")) ||
        termoCat.includes(cat.toLowerCase());

      const buscaValida =
        q === "" || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);

      return categoriaValida && buscaValida;
    });
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
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar termo ou símbolo..."
            aria-label="Buscar no glossário"
            className="rounded-lg pl-10"
          />
        </div>
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Filtrar por categoria"
        >
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "focus-ring shrink-0 rounded-xl px-3 py-2 text-sm font-bold transition-colors",
                cat === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground shadow-neu-sm",
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
              <div className="neu-inset mb-4 flex min-h-24 items-center justify-center p-3">
                {t.diagram?.trim().startsWith("<svg") ? (
                  <div
                    className="size-full flex items-center justify-center [&>svg]:size-full [&>svg]:max-h-20"
                    dangerouslySetInnerHTML={{ __html: t.diagram }}
                  />
                ) : (
                  <GlossaryDiagram diagram={t.diagram} />
                )}
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
