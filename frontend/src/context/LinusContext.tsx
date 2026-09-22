import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { ALL_LESSONS, RECOMMENDED_UNIT, type Placement } from "@/data/curriculum";

// Padrão de RBAC correspondente ao CustomUser no backend Django
export type Role = "usuario" | "admin-conteudo" | "admin-sistema" | null;

export const ROLE_LABEL: Record<Exclude<Role, null>, string> = {
  usuario: "Usuário Estudante",
  "admin-conteudo": "Administrador de Conteúdo",
  "admin-sistema": "Administrador de Sistemas",
};

export type LinusState = {
  // Autenticação
  isAuthenticated: boolean;
  accessToken: string | null;
  role: Role;
  name: string;
  // Gamificação e Progresso
  placement: Placement | null;
  placementDone: boolean;
  streak: number;
  hearts: number;
  completedLessons: string[];
  badges: string[];
  errorsByTopic: Record<string, { erros: number; total: number }>;
};

// Nova chave para invalidar caches legados e forçar sincronização
const STORAGE_KEY = "linus.state.v2";

const INITIAL: LinusState = {
  isAuthenticated: false,
  accessToken: null,
  role: null,
  name: "Aluno Linus",
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
  login: (access: string, refresh: string) => void;
  logout: () => void;
  getAccessToken: () => string | null;
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

  // Inicialização: Lê progresso local e valida o token JWT de forma assíncrona
  useEffect(() => {
    let loadedState = { ...INITIAL };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        loadedState = { ...loadedState, ...(JSON.parse(raw) as Partial<LinusState>) };
      }
    } catch {
      /* ignora dados corrompidos */
    }

    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          loadedState.isAuthenticated = true;
          loadedState.role = decoded.role;
          loadedState.accessToken = token;
        } else {
          // Token expirado, faz limpeza preventiva
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          loadedState.isAuthenticated = false;
          loadedState.role = null;
          loadedState.accessToken = null;
        }
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    } else {
      loadedState.isAuthenticated = false;
    }

    setState(loadedState);
    setReady(true);
  }, []);

  // Persistência contínua do estado local (excluindo os tokens)
  useEffect(() => {
    if (!ready) return;
    try {
      const stateToSave = { ...state, accessToken: null };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
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
      // Novo método de login: recebe e gere credenciais JWT do DRF
      login: (access: string, refresh: string) => {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        const decoded: any = jwtDecode(access);
        update({
          isAuthenticated: true,
          role: decoded.role,
          accessToken: access,
        });
      },
      // Novo método de logout: destrói a sessão e redireciona
      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        update({ isAuthenticated: false, role: null, accessToken: null });
        window.location.href = "/";
      },
      getAccessToken: () => state.accessToken,

      // Funções de Gamificação e Aprendizado preservadas
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
      resetProgress: () =>
        setState({
          ...INITIAL,
          isAuthenticated: state.isAuthenticated,
          role: state.role,
          accessToken: state.accessToken,
        }),
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
