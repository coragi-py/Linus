/** Sintetizador polifônico de baixa latência via Tone.js (carregado sob demanda). */
type ToneModule = typeof import("tone");

let tone: ToneModule | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let synth: any = null;
let starting: Promise<void> | null = null;

export async function initAudio(): Promise<void> {
  if (typeof window === "undefined") return;
  if (synth) {
    if (tone && tone.getContext().state !== "running") await tone.start();
    return;
  }
  if (starting) return starting;
  starting = (async () => {
    tone = await import("tone");
    tone.getContext().lookAhead = 0.01;
    await tone.start();
    synth = new tone.PolySynth(tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.15, sustain: 0.35, release: 0.6 },
    }).toDestination();
    synth.volume.value = -8;
  })();
  return starting;
}

export function noteOn(note: string) {
  if (!synth) return;
  try {
    synth.triggerAttackRelease(note, "8n");
  } catch (e) {
    console.warn("Falha ao acionar nota:", e);
  }
}

export function noteOff(note: string) {
  if (!synth) return;
  try {
    synth.triggerRelease(note);
  } catch (e) {
    // Ignora erros se a nota já foi liberada ou não existe
  }
}

export async function playNote(note: string, duration = "8n") {
  await initAudio();
  synth?.triggerAttackRelease(note, duration);
}

export async function playSequence(notes: string[], gap = 0.45) {
  await initAudio();
  if (!tone || !synth) return;
  const now = tone.now();
  notes.forEach((n, i) => synth.triggerAttackRelease(n, gap * 0.9, now + i * gap));
}

export async function playChord(notes: string[]) {
  await initAudio();
  synth?.triggerAttackRelease(notes, "2n");
}

export async function playFeedback(correct: boolean) {
  await initAudio();
  if (!tone || !synth) return;
  const now = tone.now();
  const seq = correct ? ["E5", "G5", "C6"] : ["E3", "C3"];
  seq.forEach((n, i) => synth.triggerAttackRelease(n, 0.14, now + i * 0.08));
}
