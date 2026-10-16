import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  UNITS as FALLBACK_UNITS,
  RECOMMENDED_UNIT,
  type Unit,
  type Lesson,
  type Placement,
} from "@/data/curriculum";

export type Role = "estudante" | "conteudo" | "sistema";

export const ROLE_LABEL: Record<Role, string> = {
  estudante: "Estudante",
  conteudo: "Administrador de Conteúdo",
  sistema: "Administrador de Sistemas",
};

export type LinusState = {
  name: string;
  role: Role;
  loggedIn: boolean;
  placement: Placement | null;
  placementDone: boolean;
  streak: number;
  hearts: number;
  completedLessons: string[];
  badges: string[];
  errorsByTopic: Record<string, { erros: number; total: number }>;
};

const STORAGE_KEY = "linus.state.v2";
const API_BASE = "http://localhost:8000/api/v1";

const EMPTY_TOPICS: Record<string, { erros: number; total: number }> = {
  "Leitura de Partituras": { erros: 0, total: 0 },
  "Intervalos e Escalas": { erros: 0, total: 0 },
  "Modos Gregos": { erros: 0, total: 0 },
  "Acordes e Campos Harmônicos": { erros: 0, total: 0 },
};

const INITIAL: LinusState = {
  name: "Aluno Linus",
  role: "estudante",
  loggedIn: false,
  placement: null,
  placementDone: false,
  streak: 0,
  hearts: 5,
  completedLessons: [],
  badges: [],
  errorsByTopic: { ...EMPTY_TOPICS },
};

type Ctx = {
  state: LinusState;
  ready: boolean;
  units: Unit[];
  allLessons: (Lesson & { unitId: string })[];
  findLessonById: (lessonId: string) => { unit: Unit; lesson: Lesson } | null;
  refreshCurriculum: () => Promise<void>;
  login: (name: string) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  finishPlacement: (placement: Placement) => void;
  completeLesson: (lessonId: string, stats?: { acertos?: number; total?: number }) => void;
  registerAnswer: (
    topic: string,
    correct: boolean,
    meta?: { exercicioId?: string; resposta?: string; tempoRespostaMs?: number },
  ) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  awardBadge: (badge: string) => void;
  resetProgress: () => void;
  recommendedUnitId: string;
  progressPercent: number;
  weakestTopic: { topic: string; rate: number } | null;
};

const LinusContext = createContext<Ctx | null>(null);

export function LinusProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LinusState>(INITIAL);
  const [units, setUnits] = useState<Unit[]>(FALLBACK_UNITS);
  const [ready, setReady] = useState(false);

  const update = useCallback((patch: Partial<LinusState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  // 1. Hidrata estado salvo localmente (remove cache legado v1 se existir)
  useEffect(() => {
    try {
      localStorage.removeItem("linus.state.v1");
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<LinusState>;
        setState({
          ...INITIAL,
          ...parsed,
          errorsByTopic: {
            ...EMPTY_TOPICS,
            ...(parsed.errorsByTopic || {}),
          },
        });
      }
    } catch {
      /* ignora dados corrompidos */
    }
    setReady(true);
  }, []);

  // 2. Persiste estado no localStorage
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* armazenamento indisponível */
    }
  }, [state, ready]);

  // 3. Busca módulos, aulas e exercícios reais do backend
  const refreshCurriculum = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/learning/modulos/`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const mappedUnits: Unit[] = data
          .filter((m: any) => m.ativo !== false)
          .map((m: any) => ({
            id: String(m.id),
            index: m.index ?? m.ordem ?? 1,
            title: m.title ?? m.titulo ?? "",
            description: m.description ?? m.descricao ?? "",
            level: (m.level ?? m.categoria ?? "Iniciante") as Placement,
            lessons: (m.lessons ?? m.aulas ?? []).map((l: any) => ({
              id: String(l.id),
              title: l.title ?? l.titulo ?? "",
              subtitle: l.subtitle ?? l.conteudo_teorico ?? "",
              exercises: (l.exercises ?? l.exercicios ?? []).map((e: any) => ({
                id: String(e.id),
                kind: e.kind ?? e.tipo ?? "multiple-choice",
                prompt: e.prompt ?? e.enunciado ?? "",
                stave: e.stave ?? undefined,
                options: e.options ?? undefined,
                answer: e.answer ?? "",
                targetNote: e.targetNote ?? undefined,
                sequence: e.sequence ?? undefined,
                explanation: e.explanation ?? "",
              })),
            })),
          }));
        setUnits(mappedUnits);
      }
    } catch (err) {
      console.error("Erro ao carregar trilha do backend, mantendo currículo local:", err);
    }
  }, []);

  // 4. Sincroniza progresso do aluno autenticado com o backend (fonte única da verdade)
  const syncUserProgress = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/learning/progresso/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      setState((s) => ({
        ...s,
        loggedIn: true,
        streak: typeof data.streak === "number" ? data.streak : 0,
        completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : [],
        badges: Array.isArray(data.badges) ? data.badges : [],
        errorsByTopic: {
          ...EMPTY_TOPICS,
          ...(data.errorsByTopic || {}),
        },
        placement: (data.placement as Placement) || null,
        placementDone: Boolean(data.placement),
      }));
    } catch (err) {
      console.error("Falha ao sincronizar progresso com o backend:", err);
    }
  }, []);

  useEffect(() => {
    void refreshCurriculum();
    void syncUserProgress();
  }, [refreshCurriculum, syncUserProgress, state.loggedIn]);

  const allLessons = useMemo(
    () => units.flatMap((u) => u.lessons.map((l) => ({ ...l, unitId: u.id }))),
    [units],
  );

  const findLessonById = useCallback(
    (lessonId: string) => {
      for (const unit of units) {
        const lesson = unit.lessons.find((l) => l.id === lessonId);
        if (lesson) return { unit, lesson };
      }
      return null;
    },
    [units],
  );

  const value = useMemo<Ctx>(() => {
    const rate = (t: { erros: number; total: number }) => (t.total ? t.erros / t.total : 0);
    const entries = Object.entries(state.errorsByTopic).map(([topic, v]) => ({
      topic,
      rate: rate(v),
    }));
    entries.sort((a, b) => b.rate - a.rate);
    const weakest = entries[0] && entries[0].rate > 0.3 ? entries[0] : null;

    const placementLevel = state.placement || "Iniciante";
    const matchedUnit =
      units.find((u) => u.level === placementLevel) ??
      units.find((u) => u.id === RECOMMENDED_UNIT[placementLevel]) ??
      units[0];
    const recommendedUnitId = matchedUnit ? matchedUnit.id : "u1";

    const totalCount = Math.max(allLessons.length, 1);
    const completedValidCount = state.completedLessons.filter((id) =>
      allLessons.some((l) => l.id === id),
    ).length;

    return {
      state,
      ready,
      units,
      allLessons,
      findLessonById,
      refreshCurriculum,
      login: (name) =>
        setState({
          ...INITIAL,
          name: name || "Aluno Linus",
          loggedIn: true,
        }),
      logout: async () => {
        try {
          const accessToken = localStorage.getItem("access_token");
          const refreshToken = localStorage.getItem("refresh_token");

          if (accessToken && refreshToken) {
            await fetch(`${API_BASE}/auth/logout/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ refresh: refreshToken }),
            });
          }
        } catch (error) {
          console.error("Falha ao registrar logout no servidor:", error);
        } finally {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("linus.state.v1");
          localStorage.removeItem(STORAGE_KEY);
          setState(INITIAL);
          window.location.href = "/";
        }
      },
      setRole: (role) => update({ role }),
      finishPlacement: (placement) => update({ placement, placementDone: true }),
      completeLesson: (lessonId, stats) => {
        setState((s) => ({
          ...s,
          completedLessons: s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId],
          badges:
            s.completedLessons.length + 1 >= 3 && !s.badges.includes("tres-licoes")
              ? [...s.badges, "tres-licoes"]
              : s.badges,
        }));

        const token = localStorage.getItem("access_token");
        if (token) {
          void fetch(`${API_BASE}/learning/aulas/${lessonId}/concluir/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              acertos: stats?.acertos,
              total: stats?.total,
            }),
          })
            .then(async (res) => {
              if (!res.ok) return;
              const data = await res.json();
              setState((s) => ({
                ...s,
                streak: typeof data.streak === "number" ? data.streak : s.streak,
                completedLessons: Array.isArray(data.completedLessons)
                  ? data.completedLessons
                  : s.completedLessons,
                badges: Array.isArray(data.badges) ? data.badges : s.badges,
              }));
            })
            .catch((err) => console.error("Erro ao persistir conclusão da lição:", err));
        }
      },
      registerAnswer: (topic, correct, meta) => {
        setState((s) => {
          const cur = s.errorsByTopic[topic] ?? { erros: 0, total: 0 };
          return {
            ...s,
            errorsByTopic: {
              ...s.errorsByTopic,
              [topic]: { erros: cur.erros + (correct ? 0 : 1), total: cur.total + 1 },
            },
          };
        });

        const token = localStorage.getItem("access_token");
        if (token && meta?.exercicioId) {
          void fetch(`${API_BASE}/learning/tentativas/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              exercicio: meta.exercicioId,
              acertou: correct,
              resposta: meta.resposta,
              tempo_resposta_ms: meta.tempoRespostaMs ?? 0,
            }),
          })
            .then(async (res) => {
              if (!res.ok) return;
              const data = await res.json();
              if (data.errorsByTopic) {
                setState((s) => ({
                  ...s,
                  errorsByTopic: {
                    ...EMPTY_TOPICS,
                    ...data.errorsByTopic,
                  },
                }));
              }
            })
            .catch((err) => console.error("Erro ao registrar tentativa:", err));
        }
      },
      loseHeart: () => setState((s) => ({ ...s, hearts: Math.max(0, s.hearts - 1) })),
      refillHearts: () => update({ hearts: 5 }),
      awardBadge: (badge) =>
        setState((s) => (s.badges.includes(badge) ? s : { ...s, badges: [...s.badges, badge] })),
      resetProgress: () => setState({ ...INITIAL, loggedIn: state.loggedIn, name: state.name }),
      recommendedUnitId,
      progressPercent: Math.round((completedValidCount / totalCount) * 100),
      weakestTopic: weakest,
    };
  }, [state, ready, units, allLessons, findLessonById, refreshCurriculum, update]);

  return <LinusContext.Provider value={value}>{children}</LinusContext.Provider>;
}

export function useLinus() {
  const ctx = useContext(LinusContext);
  if (!ctx) throw new Error("useLinus precisa estar dentro de LinusProvider");
  return ctx;
}
