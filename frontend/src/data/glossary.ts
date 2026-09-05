export type GlossaryCategory = "Pautas" | "Figuras" | "Acidentes";

export type GlossaryTerm = {
  id: string;
  term: string;
  category: GlossaryCategory;
  definition: string;
  /** Diagrama SVG (sem áudio) */
  diagram: "stave" | "treble" | "bass" | "whole" | "half" | "quarter" | "eighth" | "sharp" | "flat" | "natural";
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: "pauta",
    term: "Pauta (Pentagrama)",
    category: "Pautas",
    definition:
      "Conjunto de cinco linhas e quatro espaços onde as notas são escritas. A altura do som depende da posição vertical da nota.",
    diagram: "stave",
  },
  {
    id: "clave-sol",
    term: "Clave de Sol",
    category: "Pautas",
    definition:
      "Símbolo que fixa a nota Sol na segunda linha da pauta. É usada por instrumentos e vozes de região aguda.",
    diagram: "treble",
  },
  {
    id: "clave-fa",
    term: "Clave de Fá",
    category: "Pautas",
    definition:
      "Fixa a nota Fá na quarta linha da pauta. Usada para instrumentos graves, como o baixo e a mão esquerda do piano.",
    diagram: "bass",
  },
  {
    id: "semibreve",
    term: "Semibreve",
    category: "Figuras",
    definition: "Figura de maior duração usual: vale 4 tempos em compasso 4/4. Cabeça oval vazia, sem haste.",
    diagram: "whole",
  },
  {
    id: "minima",
    term: "Mínima",
    category: "Figuras",
    definition: "Vale 2 tempos em 4/4. Cabeça vazia com haste.",
    diagram: "half",
  },
  {
    id: "seminima",
    term: "Semínima",
    category: "Figuras",
    definition: "Vale 1 tempo em 4/4. Cabeça preenchida com haste. É a pulsação mais comum.",
    diagram: "quarter",
  },
  {
    id: "colcheia",
    term: "Colcheia",
    category: "Figuras",
    definition: "Vale meio tempo em 4/4. Cabeça preenchida com haste e um colchete (bandeirola).",
    diagram: "eighth",
  },
  {
    id: "sustenido",
    term: "Sustenido (♯)",
    category: "Acidentes",
    definition: "Eleva a nota em um semitom. Colocado à esquerda da nota ou na armadura de clave.",
    diagram: "sharp",
  },
  {
    id: "bemol",
    term: "Bemol (♭)",
    category: "Acidentes",
    definition: "Abaixa a nota em um semitom. Também pode aparecer na armadura de clave.",
    diagram: "flat",
  },
  {
    id: "bequadro",
    term: "Bequadro (♮)",
    category: "Acidentes",
    definition: "Cancela um sustenido ou bemol anterior, devolvendo a nota ao seu estado natural.",
    diagram: "natural",
  },
];
