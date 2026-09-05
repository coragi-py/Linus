export type PianoKey = {
  /** Tone.js / scientific pitch notation, e.g. "C#3" */
  note: string;
  /** VexFlow key notation, e.g. "c#/3" */
  vex: string;
  /** Nome em português, ex. "Dó sustenido" */
  label: string;
  /** Tecla física do computador */
  keyboard: string;
  isBlack: boolean;
  octave: number;
};

export const NOTE_NAMES_PT: Record<string, string> = {
  C: "Dó",
  "C#": "Dó sustenido",
  D: "Ré",
  "D#": "Ré sustenido",
  E: "Mi",
  F: "Fá",
  "F#": "Fá sustenido",
  G: "Sol",
  "G#": "Sol sustenido",
  A: "Lá",
  "A#": "Lá sustenido",
  B: "Si",
};

const CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/** Mapeamento de teclas físicas: Q=C3 ... até a segunda oitava */
const KEY_ROW = [
  "q",
  "2",
  "w",
  "3",
  "e",
  "r",
  "5",
  "t",
  "6",
  "y",
  "7",
  "u",
  "i",
  "9",
  "o",
  "0",
  "p",
  "z",
  "s",
  "x",
  "d",
  "c",
  "v",
  "g",
];

/** Teclado de 2 oitavas: C3 até B4 */
export const PIANO_KEYS: PianoKey[] = Array.from({ length: 24 }, (_, i) => {
  const pitch = CHROMATIC[i % 12]!;
  const octave = 3 + Math.floor(i / 12);
  return {
    note: `${pitch}${octave}`,
    vex: `${pitch.toLowerCase()}/${octave}`,
    label: NOTE_NAMES_PT[pitch]!,
    keyboard: KEY_ROW[i]!,
    isBlack: pitch.includes("#"),
    octave,
  };
});

export const KEY_TO_NOTE: Record<string, string> = PIANO_KEYS.reduce(
  (acc, k) => {
    acc[k.keyboard] = k.note;
    return acc;
  },
  {} as Record<string, string>,
);

export function noteToVex(note: string): string {
  const octave = note.slice(-1);
  const pitch = note.slice(0, -1);
  return `${pitch.toLowerCase()}/${octave}`;
}

export function noteLabelPt(note: string): string {
  const pitch = note.slice(0, -1);
  return NOTE_NAMES_PT[pitch] ?? pitch;
}

export const INTERVALOS_PT: { nome: string; semitons: number }[] = [
  { nome: "Uníssono", semitons: 0 },
  { nome: "Segunda menor", semitons: 1 },
  { nome: "Segunda maior", semitons: 2 },
  { nome: "Terça menor", semitons: 3 },
  { nome: "Terça maior", semitons: 4 },
  { nome: "Quarta justa", semitons: 5 },
  { nome: "Trítono", semitons: 6 },
  { nome: "Quinta justa", semitons: 7 },
  { nome: "Sexta menor", semitons: 8 },
  { nome: "Sexta maior", semitons: 9 },
  { nome: "Sétima menor", semitons: 10 },
  { nome: "Sétima maior", semitons: 11 },
  { nome: "Oitava", semitons: 12 },
];
