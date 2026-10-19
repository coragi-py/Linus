// Adicionado a historico e plotado as notas para visualização por Antonio 10/09
// Adicionado a visualização das notas das musicas gravadas na partitura para visualização, por Antonio 12/09
import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Eraser,
  Keyboard,
  Music2,
  Play,
  Save,
  X,
  ListMusic,
  Trash2,
  Sparkles,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { SectionTitle } from "@/components/AppShell";
import Stave from "@/components/Stave";
import { VirtualPiano } from "@/components/VirtualPiano";
import { noteLabelPt } from "@/lib/music";
import * as Tone from "tone";

export const Route = createFileRoute("/pratica")({
  head: () => ({
    meta: [
      { title: "Playground — Piano virtual | Linus" },
      {
        name: "description",
        content:
          "Nesta área, você pode criar melodias com base no seu conhecimento e explorar sua criatividade musical.",
      },
      { property: "og:title", content: "Playground — Piano virtual | Linus" },
      {
        property: "og:description",
        content: "Toque com o teclado do computador e veja a partitura renderizar em tempo real.",
      },
    ],
  }),
  component: Pratica,
});

interface MusicaSalva {
  id_musica: string;
  nome_musica: string;
  notas: string[];
  id_usuario?: string | null;
  is_publica?: boolean;
  data_criacao: string;
}

const API_MUSIC_URL = "http://localhost:8000/api/v1/music/musicas/";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function Pratica() {
  const [current, setCurrent] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [clef, setClef] = useState<"treble" | "bass">("treble");
  const [isSaving, setIsSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [musicTitle, setMusicTitle] = useState("");
  const [savedMusics, setSavedMusics] = useState<MusicaSalva[]>([]);
  const [isPlayingId, setIsPlayingId] = useState<string | null>(null);

  const activeSynthRef = useRef<Tone.PolySynth | null>(null);
  const activeTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const fetchSavedMusics = async () => {
    try {
      const response = await fetch(API_MUSIC_URL, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setSavedMusics(Array.isArray(data) ? data : data.results || []);
      }
    } catch (error) {
      console.error("Erro ao buscar músicas salvas:", error);
    }
  };

  useEffect(() => {
    void fetchSavedMusics();
    return () => {
      if (activeSynthRef.current) {
        activeSynthRef.current.dispose();
      }
    };
  }, []);

  const recentNotes = history.slice(-8);

  const notas =
    recentNotes.length === 0
      ? "B4/w/r"
      : [...recentNotes.map((n) => `${n}/8`), ...Array(8 - recentNotes.length).fill("B4/8/r")].join(
          ", ",
        );

  const handleOpenSaveModal = () => {
    if (history.length === 0) return;
    setMusicTitle(`Minha Gravação - ${new Date().toLocaleDateString()}`);
    setIsModalOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!musicTitle.trim()) {
      toast.warning("Por favor, digite um nome para a música.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(API_MUSIC_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          nome_musica: musicTitle.trim(),
          notas: history,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar no backend.");
      }

      toast.success("Gravação salva na sua biblioteca privada!");
      setHistory([]);
      setIsModalOpen(false);
      void fetchSavedMusics();
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Não foi possível salvar a gravação.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMusic = async (id_musica: string, nome: string) => {
    const confirmar = window.confirm(`Deseja realmente excluir a sua gravação "${nome}"?`);
    if (!confirmar) return;

    try {
      const response = await fetch(`${API_MUSIC_URL}${id_musica}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir a música.");
      }

      setSavedMusics((prev) => prev.filter((m) => m.id_musica !== id_musica));
      toast.success("Gravação excluída com sucesso!");
    } catch (error) {
      console.error("Erro na exclusão:", error);
      toast.error("Não foi possível excluir a gravação.");
    }
  };

  const playSavedMusic = async (musica: MusicaSalva) => {
    if (!musica.notas || musica.notas.length === 0) return;

    setHistory(musica.notas);
    setCurrent([]);

    if (activeSynthRef.current) {
      activeSynthRef.current.dispose();
      activeSynthRef.current = null;
    }
    activeTimeoutsRef.current.forEach((t) => clearTimeout(t));
    activeTimeoutsRef.current = [];

    setIsPlayingId(musica.id_musica);
    await Tone.start();

    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    activeSynthRef.current = synth;

    const now = Tone.now();
    musica.notas.forEach((note, index) => {
      synth.triggerAttackRelease(note, "8n", now + index * 0.3);
    });

    const totalDurationMs = musica.notas.length * 300 + 200;
    const timeoutId = setTimeout(() => {
      if (activeSynthRef.current === synth) {
        setIsPlayingId(null);
        activeSynthRef.current = null;
      }
    }, totalDurationMs);

    activeTimeoutsRef.current.push(timeoutId);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionTitle
        eyebrow="Playground"
        title="Piano virtual e partitura em tempo real"
        description="Ouça as amostras públicas para se inspirar ou crie e salve suas próprias melodias privadas."
      />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="neu p-5 sm:p-7">
            <div className="neu-inset mb-5 flex flex-col items-center gap-3 p-5">
              <div
                className="flex items-center gap-2 self-end"
                role="group"
                aria-label="Escolher clave"
              >
                <Music2 className="size-4 text-primary" aria-hidden />
                <button
                  type="button"
                  onClick={() => setClef("treble")}
                  aria-pressed={clef === "treble"}
                  className={
                    clef === "treble"
                      ? "focus-ring rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                      : "focus-ring rounded-md px-3 py-1.5 text-xs font-bold text-muted-foreground"
                  }
                >
                  Clave de Sol
                </button>
                <button
                  type="button"
                  onClick={() => setClef("bass")}
                  aria-pressed={clef === "bass"}
                  className={
                    clef === "bass"
                      ? "focus-ring rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                      : "focus-ring rounded-md px-3 py-1.5 text-xs font-bold text-muted-foreground"
                  }
                >
                  Clave de Fá
                </button>
              </div>

              <Stave
                data={{
                  clef: clef,
                  timeSignature: "4/4",
                  notes: notas,
                  width: 520,
                  height: 190,
                }}
              />

              <p className="text-sm font-bold text-primary" aria-live="polite">
                {current.length > 0
                  ? current.map((n) => `${noteLabelPt(n)} ${n.slice(-1)}`).join(" · ")
                  : "Toque uma tecla para escrever na pauta"}
              </p>
            </div>

            <VirtualPiano
              onNoteOn={(note) => {
                setCurrent([note]);
                setHistory((h) => [...h, note]);
              }}
            />

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Keyboard className="size-4" aria-hidden />
                Teclas: Q=Dó, 2=Dó#, W=Ré, 3=Ré#, E=Mi, R=Fá...
              </p>
              <button
                type="button"
                onClick={() => {
                  setCurrent([]);
                  setHistory([]);
                }}
                className="focus-ring ml-auto flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm font-bold text-primary shadow-neu-sm active:translate-y-0.5"
              >
                <Eraser className="size-4" aria-hidden /> Limpar
              </button>
            </div>
          </div>

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Últimas notas tocadas ({history.length})</h2>

              <button
                onClick={handleOpenSaveModal}
                disabled={history.length === 0 || isSaving}
                className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
              >
                <Save className="size-4" aria-hidden />
                Salvar Minha Gravação
              </button>
            </div>

            <div className="mt-4 flex max-h-48 flex-wrap gap-2 overflow-y-auto p-2">
              {history.length === 0 && (
                <p className="text-sm text-muted-foreground">Nada ainda por aqui.</p>
              )}
              {history.map((n, i) => (
                <span
                  key={`${n}-${i}`}
                  className="neu-sm px-3 py-1.5 text-sm font-bold text-foreground"
                >
                  {noteLabelPt(n)} {n.slice(-1)}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="neu flex h-full flex-col p-5 sm:p-6">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <ListMusic className="size-5 text-primary" />
              <h2 className="font-display text-lg">Biblioteca do Playground</h2>
            </div>

            <div className="mt-4 max-h-[500px] flex-1 space-y-3 overflow-y-auto pr-1">
              {savedMusics.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhuma música disponível no momento.
                </p>
              ) : (
                savedMusics.map((musica) => {
                  const isPublicSample =
                    musica.is_publica === true || musica.id_usuario == null;

                  return (
                    <div
                      key={musica.id_musica}
                      className="neu-inset flex items-center justify-between gap-3 rounded-xl bg-background/50 p-3.5 transition-all hover:border-primary/50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-1.5">
                          {isPublicSample ? (
                            <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                              <Sparkles className="size-2.5" /> Amostra Pública
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                              <Lock className="size-2.5" /> Minha Gravação
                            </span>
                          )}
                        </div>
                        <h4
                          className="truncate text-sm font-bold text-foreground"
                          title={musica.nome_musica}
                        >
                          {musica.nome_musica}
                        </h4>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {musica.notas?.length || 0} notas
                          {!isPublicSample &&
                            ` · ${new Date(musica.data_criacao).toLocaleDateString()}`}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => void playSavedMusic(musica)}
                          title="Ouvir e ver na partitura"
                          className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm hover:opacity-90"
                        >
                          <Play
                            className={`size-3.5 ${
                              isPlayingId === musica.id_musica ? "animate-pulse" : ""
                            }`}
                          />
                        </button>

                        {!isPublicSample && (
                          <button
                            type="button"
                            onClick={() =>
                              void handleDeleteMusic(musica.id_musica, musica.nome_musica)
                            }
                            title="Excluir minha gravação"
                            className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive shadow-sm hover:bg-destructive/20"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="neu w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Salvar Minha Gravação</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Esta gravação ficará visível apenas na sua conta. Digite um título para identificá-la:
            </p>

            <input
              type="text"
              value={musicTitle}
              onChange={(e) => setMusicTitle(e.target.value)}
              placeholder="Digite o nome da música"
              className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmSave()}
                disabled={isSaving}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
              >
                {isSaving ? "Salvando..." : "Confirmar e Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}