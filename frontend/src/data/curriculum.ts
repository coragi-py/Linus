export type ExerciseKind = "note-reading" | "keyboard" | "builder" | "multiple-choice";

export type Exercise = {
  id: string;
  kind: ExerciseKind;
  prompt: string;
  /** Nota exibida na pauta (VexFlow), ex. "C4" */
  stave?: string[];
  /** Alternativas para múltipla escolha */
  options?: string[];
  answer: string;
  /** Nota que o aluno deve tocar no piano */
  targetNote?: string;
  /** Sequência esperada no construtor */
  sequence?: string[];
  explanation: string;
};

export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  exercises: Exercise[];
};

export type Unit = {
  id: string;
  index: number;
  title: string;
  description: string;
  level: "Iniciante" | "Intermediário" | "Praticante Empírico";
  lessons: Lesson[];
};

export const UNITS: Unit[] = [
  {
    id: "u1",
    index: 1,
    title: "Unidade 1: Leitura de Partituras",
    description: "Pauta, clave de Sol, notas e figuras de duração.",
    level: "Iniciante",
    lessons: [
      {
        id: "u1-l1",
        title: "As notas na clave de Sol",
        subtitle: "Reconheça as notas nas linhas e espaços",
        exercises: [
          {
            id: "u1-l1-e1",
            kind: "note-reading",
            prompt: "Qual nota está escrita na pauta?",
            stave: ["C4"],
            options: ["Dó", "Ré", "Mi", "Fá"],
            answer: "Dó",
            explanation: "Dó central fica na linha suplementar abaixo da pauta, na clave de Sol.",
          },
          {
            id: "u1-l1-e2",
            kind: "note-reading",
            prompt: "Qual nota está escrita na pauta?",
            stave: ["G4"],
            options: ["Fá", "Sol", "Lá", "Si"],
            answer: "Sol",
            explanation: "A clave de Sol envolve a segunda linha, que é justamente o Sol.",
          },
          {
            id: "u1-l1-e3",
            kind: "keyboard",
            prompt: "Toque no piano a nota mostrada na pauta.",
            stave: ["E4"],
            answer: "E4",
            targetNote: "E4",
            explanation: "Mi fica no primeiro espaço da pauta, entre a primeira e a segunda linha.",
          },
        ],
      },
      {
        id: "u1-l2",
        title: "Figuras de duração",
        subtitle: "Semibreve, mínima, semínima e colcheia",
        exercises: [
          {
            id: "u1-l2-e1",
            kind: "multiple-choice",
            prompt: "Quantos tempos vale uma mínima em compasso 4/4?",
            options: ["1 tempo", "2 tempos", "3 tempos", "4 tempos"],
            answer: "2 tempos",
            explanation: "A mínima vale metade da semibreve: 2 tempos em 4/4.",
          },
          {
            id: "u1-l2-e2",
            kind: "multiple-choice",
            prompt: "Qual figura vale meio tempo em 4/4?",
            options: ["Semibreve", "Semínima", "Colcheia", "Mínima"],
            answer: "Colcheia",
            explanation: "A colcheia é metade da semínima, portanto meio tempo em 4/4.",
          },
          {
            id: "u1-l2-e3",
            kind: "note-reading",
            prompt: "Qual nota está escrita na pauta?",
            stave: ["A4"],
            options: ["Sol", "Lá", "Si", "Dó"],
            answer: "Lá",
            explanation: "Lá ocupa o segundo espaço da pauta na clave de Sol.",
          },
        ],
      },
    ],
  },
  {
    id: "u2",
    index: 2,
    title: "Unidade 2: Intervalos e Escalas",
    description: "Distâncias entre notas e a escala maior.",
    level: "Iniciante",
    lessons: [
      {
        id: "u2-l1",
        title: "Intervalos básicos",
        subtitle: "Terças, quartas e quintas",
        exercises: [
          {
            id: "u2-l1-e1",
            kind: "note-reading",
            prompt: "Qual é o intervalo entre as duas notas da pauta?",
            stave: ["C4", "E4"],
            options: ["Terça maior", "Terça menor", "Quarta justa", "Quinta justa"],
            answer: "Terça maior",
            explanation: "De Dó a Mi há 4 semitons, formando uma terça maior.",
          },
          {
            id: "u2-l1-e2",
            kind: "note-reading",
            prompt: "Qual é o intervalo entre as duas notas da pauta?",
            stave: ["C4", "G4"],
            options: ["Quarta justa", "Quinta justa", "Sexta maior", "Oitava"],
            answer: "Quinta justa",
            explanation: "De Dó a Sol há 7 semitons: quinta justa, base dos acordes.",
          },
          {
            id: "u2-l1-e3",
            kind: "builder",
            prompt: "Monte a escala de Dó maior ascendente.",
            sequence: ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
            answer: "C4,D4,E4,F4,G4,A4,B4",
            explanation: "Dó maior segue tom-tom-semitom-tom-tom-tom-semitom, sem acidentes.",
          },
        ],
      },
    ],
  },
  {
    id: "u3",
    index: 3,
    title: "Unidade 3: Modos Gregos",
    description: "Jônio, dórico, frígio, lídio, mixolídio, eólio e lócrio.",
    level: "Intermediário",
    lessons: [
      {
        id: "u3-l1",
        title: "Os sete modos",
        subtitle: "Cada grau da escala maior gera um modo",
        exercises: [
          {
            id: "u3-l1-e1",
            kind: "multiple-choice",
            prompt: "Qual modo começa no segundo grau da escala maior?",
            options: ["Jônio", "Dórico", "Frígio", "Lídio"],
            answer: "Dórico",
            explanation: "O dórico parte do 2º grau: em Dó maior, de Ré a Ré.",
          },
          {
            id: "u3-l1-e2",
            kind: "multiple-choice",
            prompt: "Qual modo tem a quarta aumentada como característica?",
            options: ["Lídio", "Mixolídio", "Eólio", "Lócrio"],
            answer: "Lídio",
            explanation: "O lídio (4º grau) tem #4, som luminoso e flutuante.",
          },
          {
            id: "u3-l1-e3",
            kind: "builder",
            prompt: "Monte o modo dórico de Ré (só notas naturais).",
            sequence: ["D4", "E4", "F4", "G4", "A4", "B4"],
            answer: "D4,E4,F4,G4,A4,B4",
            explanation: "O dórico de Ré usa apenas notas naturais, com terça e sétima menores.",
          },
        ],
      },
    ],
  },
  {
    id: "u4",
    index: 4,
    title: "Unidade 4: Acordes e Campos Harmônicos",
    description: "Tríades, tétrades e a harmonização da escala.",
    level: "Praticante Empírico",
    lessons: [
      {
        id: "u4-l1",
        title: "Tríades maiores e menores",
        subtitle: "A construção do acorde em terças",
        exercises: [
          {
            id: "u4-l1-e1",
            kind: "multiple-choice",
            prompt: "Quais notas formam o acorde de Dó maior?",
            options: ["Dó, Mi, Sol", "Dó, Mi bemol, Sol", "Dó, Fá, Lá", "Dó, Ré, Sol"],
            answer: "Dó, Mi, Sol",
            explanation: "Tríade maior = tônica + terça maior + quinta justa.",
          },
          {
            id: "u4-l1-e2",
            kind: "builder",
            prompt: "Monte a tríade de Lá menor ascendente.",
            sequence: ["A3", "C4", "E4"],
            answer: "A3,C4,E4",
            explanation: "Lá menor = Lá + Dó (terça menor) + Mi (quinta justa).",
          },
          {
            id: "u4-l1-e3",
            kind: "multiple-choice",
            prompt: "No campo harmônico de Dó maior, qual é o acorde do V grau?",
            options: ["Fá maior", "Sol maior", "Lá menor", "Si diminuto"],
            answer: "Sol maior",
            explanation: "O V grau de Dó maior é Sol maior, o acorde dominante.",
          },
        ],
      },
    ],
  },
];

export const ALL_LESSONS = UNITS.flatMap((u) => u.lessons.map((l) => ({ ...l, unitId: u.id })));

export function findLesson(id: string) {
  for (const unit of UNITS) {
    const lesson = unit.lessons.find((l) => l.id === id);
    if (lesson) return { unit, lesson };
  }
  return null;
}

export type Placement = "Iniciante" | "Intermediário" | "Praticante Empírico";

export type PlacementQuestion = {
  id: string;
  topic: string;
  prompt: string;
  stave?: string[];
  options: string[];
  answer: string;
  /** Peso pedagógico: questões mais avançadas valem mais na pontuação. */
  weight: number;
};

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: "p1",
    topic: "Experiência prática",
    prompt: "Como você descreveria sua experiência tocando um instrumento?",
    options: [
      "Nunca toquei",
      "Toco algumas músicas de ouvido",
      "Toco há mais de um ano, sem estudar teoria",
      "Toco e já estudei teoria musical",
    ],
    answer: "Toco e já estudei teoria musical",
    weight: 1,
  },
  {
    id: "p2",
    topic: "Leitura de notas",
    prompt: "Na clave de Sol, qual nota fica na segunda linha da pauta?",
    stave: ["G4"],
    options: ["Ré", "Fá", "Sol", "Si"],
    answer: "Sol",
    weight: 1,
  },
  {
    id: "p3",
    topic: "Intervalos",
    prompt: "Quantos semitons tem uma quinta justa?",
    options: ["5", "6", "7", "8"],
    answer: "7",
    weight: 2,
  },
  {
    id: "p4",
    topic: "Escalas e modos",
    prompt: "A escala menor natural equivale a qual modo grego?",
    options: ["Dórico", "Eólio", "Frígio", "Mixolídio"],
    answer: "Eólio",
    weight: 2,
  },
  {
    id: "p5",
    topic: "Harmonia",
    prompt: "No campo harmônico de Dó maior, qual acorde é o V grau?",
    options: ["Fá maior", "Sol maior", "Lá menor", "Si diminuto"],
    answer: "Sol maior",
    weight: 3,
  },
];

export const PLACEMENT_MAX_SCORE = PLACEMENT_QUESTIONS.reduce((s, q) => s + q.weight, 0);

/** Algoritmo de nivelamento: pontuação ponderada sobre o total possível. */
export function scorePlacement(answers: (string | undefined)[]): number {
  return PLACEMENT_QUESTIONS.reduce(
    (sum, q, i) => sum + (answers[i] === q.answer ? q.weight : 0),
    0,
  );
}

export function classifyPlacement(score: number): Placement {
  const ratio = PLACEMENT_MAX_SCORE ? score / PLACEMENT_MAX_SCORE : 0;
  if (ratio < 0.34) return "Iniciante";
  if (ratio < 0.7) return "Intermediário";
  return "Praticante Empírico";
}

export const RECOMMENDED_UNIT: Record<Placement, string> = {
  Iniciante: "u1",
  "Intermediário": "u2",
  "Praticante Empírico": "u3",
};
