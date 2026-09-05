import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ALL_LESSONS, RECOMMENDED_UNIT, type Placement } from "@/data/curriculum";

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

const STORAGE_KEY = "linus.state.v1";

const INITIAL: LinusState = {
  name: "Aluno Linus",
  role: "estudante",
  loggedIn: false,
  placement: null,
  placementDone: false,
  streak: 3,
  hearts: 5,
  completedLessons: [],
  badges: ["primeira-nota"],
  errorsByTopic: {
    "Leitura de Partituras": { erros: 2, total: 12 },
    "Intervalos e Escalas": { erros: 7, total: 15 },
    "Modos Gregos": { erros: 5, total: 8 },
    "Acordes e Campos Harmônicos": { erros: 1, total: 6 },
  },
};

type Ctx = {
  state: LinusState;
  ready: boolean;
  login: (name: string) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  finishPlacement: (placement: Placement) => void;
  completeLesson: (lessonId: string) => void;
  registerAnswer: (topic: string, correct: boolean) => void;
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...INITIAL, ...(JSON.parse(raw) as Partial<LinusState>) });
    } catch {
      /* ignora dados corrompidos */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* armazenamento indisponível */
    }
  }, [state, ready]);

  const update = useCallback((patch: Partial<LinusState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const value = useMemo<Ctx>(() => {
    const rate = (t: { erros: number; total: number }) => (t.total ? t.erros / t.total : 0);
    const entries = Object.entries(state.errorsByTopic).map(([topic, v]) => ({
      topic,
      rate: rate(v),
    }));
    entries.sort((a, b) => b.rate - a.rate);
    const weakest = entries[0] && entries[0].rate > 0.4 ? entries[0] : null;

    return {
      state,
      ready,
      login: (name) => update({ name: name || "Aluno Linus", loggedIn: true }),
      logout: () => update({ loggedIn: false }),
      setRole: (role) => update({ role }),
      finishPlacement: (placement) => update({ placement, placementDone: true }),
      completeLesson: (lessonId) =>
        setState((s) => ({
          ...s,
          completedLessons: s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId],
          badges:
            s.completedLessons.length + 1 >= 3 && !s.badges.includes("tres-licoes")
              ? [...s.badges, "tres-licoes"]
              : s.badges,
        })),
      registerAnswer: (topic, correct) =>
        setState((s) => {
          const cur = s.errorsByTopic[topic] ?? { erros: 0, total: 0 };
          return {
            ...s,
            errorsByTopic: {
              ...s.errorsByTopic,
              [topic]: { erros: cur.erros + (correct ? 0 : 1), total: cur.total + 1 },
            },
          };
        }),
      loseHeart: () => setState((s) => ({ ...s, hearts: Math.max(0, s.hearts - 1) })),
      refillHearts: () => update({ hearts: 5 }),
      awardBadge: (badge) =>
        setState((s) => (s.badges.includes(badge) ? s : { ...s, badges: [...s.badges, badge] })),
      resetProgress: () => setState({ ...INITIAL, loggedIn: state.loggedIn, name: state.name }),
      recommendedUnitId: state.placement ? RECOMMENDED_UNIT[state.placement] : "u1",
      progressPercent: Math.round((state.completedLessons.length / ALL_LESSONS.length) * 100),
      weakestTopic: weakest,
    };
  }, [state, ready, update]);

  return <LinusContext.Provider value={value}>{children}</LinusContext.Provider>;
}

export function useLinus() {
  const ctx = useContext(LinusContext);
  if (!ctx) throw new Error("useLinus precisa estar dentro de LinusProvider");
  return ctx;
}
