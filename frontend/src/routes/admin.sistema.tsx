import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  ShieldCheck,
  Activity,
  BookOpen,
  CheckCircle2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Lock,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  FileSearch,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { SectionTitle } from "@/components/AppShell";
import { type Role } from "@/context/LinusContext";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/sistema")({
  component: AdminSistema,
});

type RealUser = { id: string; nome: string; email: string; role: Role; ativo: boolean };

type AuditLogItem = {
  id: string;
  action: string;
  usuario: string;
  nome_usuario?: string;
  ip_address: string;
  timestamp: string;
  data_iso?: string;
};

const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:8000").replace(
  /\/+$/,
  "",
)}/api/v1`;

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "estudante", label: "Estudante" },
  { value: "conteudo", label: "Administrador de Conteúdo" },
  { value: "sistema", label: "Administrador de Sistemas" },
];

const ITEMS_PER_PAGE = 25;
const AUDIT_ITEMS_PER_PAGE = 20;

const DATE_INPUT_CLASS =
  "block h-10 w-full min-w-[140px] rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

// Extrai YYYY-MM-DD mesmo se data_iso não vier preenchido do backend
function extractIsoDate(dataIso?: string, timestampStr?: string): string {
  if (dataIso && /^\d{4}-\d{2}-\d{2}$/.test(dataIso)) return dataIso;
  if (timestampStr) {
    const match = timestampStr.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`;
    }
  }
  return "";
}

function getAuditBadgeStyle(action: string): string {
  const act = (action || "").toUpperCase();
  if (act.includes("FAILED") || act.includes("BLOCKED") || act.includes("DELETED")) {
    return "bg-destructive/15 text-destructive border-destructive/30";
  }
  if (act.includes("LGPD") || act.includes("CONSENT") || act.includes("ANONYMIZED")) {
    return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
  }
  if (act.includes("ADMIN") || act.includes("CREATED") || act.includes("UPDATED")) {
    return "bg-primary/15 text-primary border-primary/30";
  }
  if (act.includes("LESSON") || act.includes("STREAK")) {
    return "bg-success/15 text-success border-success/30";
  }
  return "bg-muted text-foreground border-border";
}

function AdminSistema() {
  const [usuarios, setUsuarios] = useState<RealUser[]>([]);
  const [metricas, setMetricas] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ================= ESTADOS: FILTROS DO DASHBOARD =================
  const [periodoDashboard, setPeriodoDashboard] = useState<"7d" | "15d" | "30d" | "custom">("7d");
  const [dashDataInicio, setDashDataInicio] = useState("");
  const [dashDataFim, setDashDataFim] = useState("");
  const [visaoGraficos, setVisaoGraficos] = useState<"todos" | "acessos" | "pedagogico">("todos");
  const [filtroNivelTopico, setFiltroNivelTopico] = useState<
    "todos" | "critico" | "atencao" | "adequado"
  >("todos");
  const [ordenacaoTopico, setOrdenacaoTopico] = useState<
    "volume" | "menor_precisao" | "maior_precisao" | "alfabetica"
  >("volume");
  const [buscaTopico, setBuscaTopico] = useState("");

  // ================= ESTADOS: GESTÃO DE USUÁRIOS =================
  const [buscaTexto, setBuscaTexto] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "ativos" | "suspensos">("todos");
  const [filtroRole, setFiltroRole] = useState<"todos" | "estudante" | "conteudo" | "sistema">(
    "todos",
  );
  const [paginaAtual, setPaginaAtual] = useState(1);

  // ================= ESTADOS: ABA DE AUDITORIA =================
  const [auditUsuarioBusca, setAuditUsuarioBusca] = useState("");
  const [auditAcaoFiltro, setAuditAcaoFiltro] = useState("todas");
  const [auditDataInicio, setAuditDataInicio] = useState("");
  const [auditDataFim, setAuditDataFim] = useState("");
  const [paginaAuditoria, setPaginaAuditoria] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        const [resUsers, resMetrics] = await Promise.all([
          fetch(`${API_URL}/auth/admin/users/`, { headers }),
          fetch(`${API_URL}/auth/admin/metrics/?days=30`, { headers }),
        ]);

        if (!resUsers.ok || !resMetrics.ok) {
          throw new Error("Falha de permissão ou comunicação.");
        }

        const dataUsers = await resUsers.json();
        const dataMetrics = await resMetrics.json();

        const listaUsuarios = Array.isArray(dataUsers)
          ? dataUsers
          : Array.isArray(dataUsers?.results)
            ? dataUsers.results
            : [];

        setUsuarios(listaUsuarios);
        setMetricas(dataMetrics);
      } catch (error) {
        console.error("Erro na comunicação:", error);
        toast.error("Não foi possível carregar os dados do sistema.");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  // Reseta página de usuários ao mudar filtros
  useEffect(() => {
    setPaginaAtual(1);
  }, [buscaTexto, filtroStatus, filtroRole]);

  // Reseta página de auditoria ao mudar filtros
  useEffect(() => {
    setPaginaAuditoria(1);
  }, [auditUsuarioBusca, auditAcaoFiltro, auditDataInicio, auditDataFim]);

  // ================= LÓGICA DE FILTRAGEM: DASHBOARD =================
  const serieGraficoFiltrada = useMemo(() => {
    const serieOriginal: any[] = Array.isArray(metricas?.grafico) ? metricas.grafico : [];
    if (serieOriginal.length === 0) return [];

    if (periodoDashboard === "custom" && (dashDataInicio || dashDataFim)) {
      return serieOriginal.filter((item) => {
        const iso = item.data_iso || "";
        if (!iso) return true;
        if (dashDataInicio && iso < dashDataInicio) return false;
        if (dashDataFim && iso > dashDataFim) return false;
        return true;
      });
    }

    const qtdDias = periodoDashboard === "7d" ? 7 : periodoDashboard === "15d" ? 15 : 30;
    return serieOriginal.slice(-qtdDias);
  }, [metricas, periodoDashboard, dashDataInicio, dashDataFim]);

  const resumoPeriodoSelecionado = useMemo(() => {
    return serieGraficoFiltrada.reduce(
      (acc, dia) => ({
        logins: acc.logins + (Number(dia.ativos) || 0),
        novosCadastros: acc.novosCadastros + (Number(dia.novos_registros) || 0),
        licoes: acc.licoes + (Number(dia.licoes) || 0),
        exercicios: acc.exercicios + (Number(dia.exercicios) || 0),
      }),
      { logins: 0, novosCadastros: 0, licoes: 0, exercicios: 0 },
    );
  }, [serieGraficoFiltrada]);

  const topicosFiltrados = useMemo(() => {
    const lista: any[] = Array.isArray(metricas?.desempenho_topicos)
      ? [...metricas.desempenho_topicos]
      : [];

    const termo = buscaTopico.trim().toLowerCase();

    const filtrada = lista.filter((item) => {
      const matchNome = !termo || String(item.topico || "").toLowerCase().includes(termo);
      const p = Number(item.precisao) || 0;

      const matchNivel =
        filtroNivelTopico === "todos" ||
        (filtroNivelTopico === "critico" && p < 50) ||
        (filtroNivelTopico === "atencao" && p >= 50 && p < 75) ||
        (filtroNivelTopico === "adequado" && p >= 75);

      return matchNome && matchNivel;
    });

    filtrada.sort((a, b) => {
      if (ordenacaoTopico === "menor_precisao") return a.precisao - b.precisao;
      if (ordenacaoTopico === "maior_precisao") return b.precisao - a.precisao;
      if (ordenacaoTopico === "alfabetica")
        return String(a.topico).localeCompare(String(b.topico));
      return (b.total || 0) - (a.total || 0);
    });

    return filtrada;
  }, [metricas, buscaTopico, filtroNivelTopico, ordenacaoTopico]);

  // ================= LÓGICA DE FILTRAGEM: USUÁRIOS =================
  const usuariosFiltrados = useMemo(() => {
    const termo = buscaTexto.trim().toLowerCase();

    return usuarios.filter((u) => {
      const matchTexto =
        !termo ||
        (u.nome || "").toLowerCase().includes(termo) ||
        (u.email || "").toLowerCase().includes(termo);

      const matchStatus =
        filtroStatus === "todos" ||
        (filtroStatus === "ativos" && u.ativo) ||
        (filtroStatus === "suspensos" && !u.ativo);

      const normalizedRole =
        u.role === "admin-conteudo"
          ? "conteudo"
          : u.role === "admin-sistema"
            ? "sistema"
            : u.role === "usuario"
              ? "estudante"
              : u.role;

      const matchRole = filtroRole === "todos" || normalizedRole === filtroRole;

      return matchTexto && matchStatus && matchRole;
    });
  }, [usuarios, buscaTexto, filtroStatus, filtroRole]);

  const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / ITEMS_PER_PAGE));
  const usuariosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITEMS_PER_PAGE;
    return usuariosFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);
  }, [usuariosFiltrados, paginaAtual]);

  // ================= LÓGICA DE FILTRAGEM: AUDITORIA =================
  const todosLogsAuditoria: AuditLogItem[] = useMemo(() => {
    return Array.isArray(metricas?.ultimos_logs) ? metricas.ultimos_logs : [];
  }, [metricas]);

  const acoesUnicasAuditoria = useMemo(() => {
    const setAcoes = new Set<string>();
    todosLogsAuditoria.forEach((log) => {
      if (log.action) setAcoes.add(log.action);
    });
    return Array.from(setAcoes).sort();
  }, [todosLogsAuditoria]);

  const logsAuditoriaFiltrados = useMemo(() => {
    const termoUsuario = auditUsuarioBusca.trim().toLowerCase();

    return todosLogsAuditoria.filter((log) => {
      const usuarioStr = (log.usuario || "").toLowerCase();
      const nomeStr = (log.nome_usuario || "").toLowerCase();
      const ipStr = (log.ip_address || "").toLowerCase();

      // 1. Filtro por Usuário associado (e-mail, nome ou IP)
      const matchUsuario =
        !termoUsuario ||
        usuarioStr.includes(termoUsuario) ||
        nomeStr.includes(termoUsuario) ||
        ipStr.includes(termoUsuario);

      // 2. Filtro por Ação
      const matchAcao = auditAcaoFiltro === "todas" || log.action === auditAcaoFiltro;

      // 3. Filtro por Data (Início e Fim)
      const dataLogIso = extractIsoDate(log.data_iso, log.timestamp);
      const matchDataInicio = !auditDataInicio || (dataLogIso && dataLogIso >= auditDataInicio);
      const matchDataFim = !auditDataFim || (dataLogIso && dataLogIso <= auditDataFim);

      return matchUsuario && matchAcao && matchDataInicio && matchDataFim;
    });
  }, [todosLogsAuditoria, auditUsuarioBusca, auditAcaoFiltro, auditDataInicio, auditDataFim]);

  const totalPaginasAuditoria = Math.max(
    1,
    Math.ceil(logsAuditoriaFiltrados.length / AUDIT_ITEMS_PER_PAGE),
  );

  const logsAuditoriaPaginados = useMemo(() => {
    const inicio = (paginaAuditoria - 1) * AUDIT_ITEMS_PER_PAGE;
    return logsAuditoriaFiltrados.slice(inicio, inicio + AUDIT_ITEMS_PER_PAGE);
  }, [logsAuditoriaFiltrados, paginaAuditoria]);

  // ================= HANDLERS DE ATUALIZAÇÃO DE USUÁRIO =================
  const handleUpdateRole = async (userId: string, newRole: Role) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/auth/admin/users/${userId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("O servidor falhou ao processar a rota.");
      }

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro interno do servidor");

      toast.success("Permissões atualizadas com sucesso.");
      setUsuarios((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (error: any) {
      toast.error(error.message || "Falha ao atualizar papel do usuário.");
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/auth/admin/users/${userId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ativo: !currentStatus }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("O servidor falhou ao processar a rota.");
      }

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro interno do servidor");

      toast.success(`Conta ${!currentStatus ? "reativada" : "suspensa"} com sucesso.`);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ativo: !currentStatus } : u)),
      );
    } catch (error: any) {
      toast.error(error.message || "Falha ao alterar status.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="animate-pulse font-bold text-muted-foreground">
          Sincronizando telemetria, auditoria e base de usuários...
        </p>
      </div>
    );
  }

  const totais = metricas?.totais || {};
  const acervo = metricas?.acervo || {};
  const papeis = metricas?.distribuicao_papeis || {};
  const taxaAtivos =
    totais.usuarios > 0 ? Math.round((totais.ativos / totais.usuarios) * 100) : 0;

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-12">
      <SectionTitle
        eyebrow="Administração Central e Observabilidade"
        title="Painel de Controle do Sistema"
        description="Acompanhe indicadores globais, Gestão de usuários cadastrados e trilha de auditoria."
      />

      <Tabs defaultValue="dashboard" className="mt-6 w-full">
        <TabsList className="mb-8 grid h-12 w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <Activity className="size-4" /> Dashboard & Métricas
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <Users className="size-4" /> Gestão de Usuários ({usuarios.length})
          </TabsTrigger>
          <TabsTrigger value="auditoria" className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <ShieldCheck className="size-4" /> Auditoria ({todosLogsAuditoria.length})
          </TabsTrigger>
        </TabsList>

        {/* ================= ABA 1: DASHBOARD DE MÉTRICAS COM FILTROS CONDICIONAIS E DE DATA ================= */}
        <TabsContent value="dashboard" className="space-y-8 animate-in fade-in-50">
          {/* Barra de Filtros Condicionais e de Data do Dashboard */}
          <section className="neu rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-primary" />
                <div>
                  <h2 className="font-display text-base font-bold">
                    Filtros de Período e Visualização Condicional
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Ajuste a janela temporal das séries históricas e filtre as dimensões analíticas do painel.
                  </p>
                </div>
              </div>

              {(periodoDashboard !== "7d" ||
                visaoGraficos !== "todos" ||
                filtroNivelTopico !== "todos" ||
                dashDataInicio ||
                dashDataFim) && (
                <button
                  type="button"
                  onClick={() => {
                    setPeriodoDashboard("7d");
                    setDashDataInicio("");
                    setDashDataFim("");
                    setVisaoGraficos("todos");
                    setFiltroNivelTopico("todos");
                    setOrdenacaoTopico("volume");
                    setBuscaTopico("");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted"
                >
                  <RotateCcw className="size-3.5" /> Restaurar Padrão
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
              {/* Seletor de Período Rápido */}
              <div className="lg:col-span-3">
                <label className="mb-1 block text-[11px] font-bold uppercase text-muted-foreground">
                  Janela de Tempo
                </label>
                <select
                  value={periodoDashboard}
                  onChange={(e) => setPeriodoDashboard(e.target.value as any)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-bold"
                >
                  <option value="7d">Últimos 7 dias</option>
                  <option value="15d">Últimos 15 dias</option>
                  <option value="30d">Últimos 30 dias</option>
                  <option value="custom">Intervalo Personalizado</option>
                </select>
              </div>

              {/* Datas Personalizadas */}
              <div className="lg:col-span-3">
                <label className="mb-1 block text-[11px] font-bold uppercase text-muted-foreground">
                  De (Data Inicial)
                </label>
                <input
                  type="date"
                  value={dashDataInicio}
                  onChange={(e) => {
                    setDashDataInicio(e.target.value);
                    setPeriodoDashboard("custom");
                  }}
                  className={DATE_INPUT_CLASS}
                />
              </div>

              <div className="lg:col-span-3">
                <label className="mb-1 block text-[11px] font-bold uppercase text-muted-foreground">
                  Até (Data Final)
                </label>
                <input
                  type="date"
                  value={dashDataFim}
                  onChange={(e) => {
                    setDashDataFim(e.target.value);
                    setPeriodoDashboard("custom");
                  }}
                  className={DATE_INPUT_CLASS}
                />
              </div>

              {/* Filtro Condicional de Exibição de Gráficos */}
              <div className="lg:col-span-3">
                <label className="mb-1 block text-[11px] font-bold uppercase text-muted-foreground">
                  Foco dos Gráficos
                </label>
                <select
                  value={visaoGraficos}
                  onChange={(e) => setVisaoGraficos(e.target.value as any)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-bold"
                >
                  <option value="todos">Todos os Indicadores</option>
                  <option value="acessos">Apenas Acessos & Cadastros</option>
                  <option value="pedagogico">Apenas Engajamento Pedagógico</option>
                </select>
              </div>
            </div>

            {/* Resumo Dinâmico do Período Filtrado */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/40 px-4 py-2.5 text-xs">
              <span className="font-bold text-muted-foreground">
                Acumulado no período selecionado ({serieGraficoFiltrada.length} dia(s)):
              </span>
              <div className="flex flex-wrap gap-4 font-bold">
                <span>
                  Logins: <strong className="text-success">{resumoPeriodoSelecionado.logins}</strong>
                </span>
                <span>
                  Novos Cadastros:{" "}
                  <strong className="text-primary">{resumoPeriodoSelecionado.novosCadastros}</strong>
                </span>
                <span>
                  Lições Concluídas:{" "}
                  <strong className="text-success">{resumoPeriodoSelecionado.licoes}</strong>
                </span>
                <span>
                  Exercícios Submetidos:{" "}
                  <strong className="text-primary">{resumoPeriodoSelecionado.exercicios}</strong>
                </span>
              </div>
            </div>
          </section>

          {/* Linha 1: Big Numbers Globais */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              icon={Users}
              label="Total de Contas Registradas"
              value={totais.usuarios ?? 0}
              subtitle={`${papeis.estudantes ?? 0} estudantes · ${papeis.admins_conteudo ?? 0} conteúdo · ${papeis.admins_sistema ?? 0} sistema`}
            />
            <MetricCard
              icon={CheckCircle2}
              label="Contas Ativas vs. Suspensas"
              value={`${totais.ativos ?? 0} (${taxaAtivos}%)`}
              subtitle={`${totais.suspensos ?? 0} contas suspensas no momento`}
            />
            <MetricCard
              icon={BookOpen}
              label="Lições Concluídas na Trilha"
              value={totais.licoes ?? 0}
              subtitle={`${acervo.unidades ?? 0} unidades e ${acervo.aulas ?? 0} lições publicadas`}
            />
            <MetricCard
              icon={Activity}
              label="Exercícios Resolvidos (Global)"
              value={totais.tentativas_exercicios ?? 0}
              subtitle={`Precisão média global dos alunos: ${totais.precisao_global ?? 0}%`}
            />
            <MetricCard
              icon={ShieldCheck}
              label="Eventos Auditados (7 dias)"
              value={totais.eventos_auditoria_7d ?? 0}
              subtitle={`${totais.falhas_autenticacao_7d ?? 0} tentativas de login barradas (7d)`}
            />
            <MetricCard
              icon={Lock}
              label="Segurança (2FA) & LGPD"
              value={`${totais.usuarios_2fa ?? 0} com 2FA`}
              subtitle={`${totais.anonimizados_lgpd ?? 0} contas anonimizadas via LGPD`}
            />
          </div>

          {/* Linha 2: Resumo Rápido do Acervo da Plataforma */}
          <section className="neu rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Layers className="size-5 text-primary" />
                <h2 className="font-display text-base font-bold">
                  Inventário de Conteúdo Ativo no Banco
                </h2>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-bold">
                <span className="rounded-lg bg-muted px-3 py-1.5">
                  Unidades: <strong className="text-primary">{acervo.unidades ?? 0}</strong>
                </span>
                <span className="rounded-lg bg-muted px-3 py-1.5">
                  Lições: <strong className="text-primary">{acervo.aulas ?? 0}</strong>
                </span>
                <span className="rounded-lg bg-muted px-3 py-1.5">
                  Exercícios: <strong className="text-primary">{acervo.exercicios ?? 0}</strong>
                </span>
                <span className="rounded-lg bg-muted px-3 py-1.5">
                  Termos no Glossário:{" "}
                  <strong className="text-primary">{acervo.glossario ?? 0}</strong>
                </span>
                <span className="rounded-lg bg-muted px-3 py-1.5">
                  Gravações no Playground:{" "}
                  <strong className="text-primary">{acervo.gravacoes_playground ?? 0}</strong>
                </span>
              </div>
            </div>
          </section>

          {/* Linha 3: Gráficos de Evolução (Condicionais conforme filtro visaoGraficos e Período) */}
          <div
            className={cn(
              "grid gap-5",
              visaoGraficos === "todos" ? "lg:grid-cols-2" : "grid-cols-1",
            )}
          >
            {(visaoGraficos === "todos" || visaoGraficos === "acessos") && (
              <section className="neu rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-lg">
                  Acessos Ativos vs. Novos Cadastros ({serieGraficoFiltrada.length} dias)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Volume diário de estudantes com login registrado e novas contas criadas no período filtrado.
                </p>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={serieGraficoFiltrada}>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={11} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line
                        type="monotone"
                        dataKey="ativos"
                        name="Logins no Dia"
                        stroke="var(--success)"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="novos_registros"
                        name="Novos Cadastros"
                        stroke="var(--primary)"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}

            {(visaoGraficos === "todos" || visaoGraficos === "pedagogico") && (
              <section className="neu rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-lg">
                  Engajamento Pedagógico: Aulas & Exercícios ({serieGraficoFiltrada.length} dias)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Quantidade de lições finalizadas e exercícios submetidos diariamente no período filtrado.
                </p>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={serieGraficoFiltrada}>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={11} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar
                        dataKey="exercicios"
                        name="Exercícios Submetidos"
                        fill="var(--primary)"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="licoes"
                        name="Lições Concluídas"
                        fill="var(--success)"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}
          </div>

          {/* Linha 4: Taxa de Acerto Global por Tópico com Filtros Condicionais */}
          <section className="neu rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg">
                  Taxa de Acerto Global por Tópico Musical
                </h2>
                <p className="text-xs text-muted-foreground">
                  Filtre condicionalmente os tópicos por faixa de domínio pedagógico ou ordene por criticidade.
                </p>
              </div>
              <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-bold">
                Exibindo {topicosFiltrados.length} tópico(s)
              </span>
            </div>

            {/* Controles Condicionais de Tópicos */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
              <div className="relative md:col-span-5">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={buscaTopico}
                  onChange={(e) => setBuscaTopico(e.target.value)}
                  placeholder="Buscar tópico específico..."
                  className="pl-9 text-xs h-9"
                />
              </div>

              <div className="md:col-span-4">
                <select
                  value={filtroNivelTopico}
                  onChange={(e) => setFiltroNivelTopico(e.target.value as any)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-bold"
                >
                  <option value="todos">Faixa de Precisão: Todas</option>
                  <option value="critico">Crítico (&lt; 50% de acerto)</option>
                  <option value="atencao">Em Atenção (50% a 74% de acerto)</option>
                  <option value="adequado">Adequado / Dominado (&ge; 75% de acerto)</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={ordenacaoTopico}
                  onChange={(e) => setOrdenacaoTopico(e.target.value as any)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-bold"
                >
                  <option value="volume">Ordenar: Maior Volume</option>
                  <option value="menor_precisao">Ordenar: Menor Precisão (Críticos)</option>
                  <option value="maior_precisao">Ordenar: Maior Precisão</option>
                  <option value="alfabetica">Ordenar: Alfabética (A-Z)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {topicosFiltrados.length === 0 ? (
                <p className="col-span-2 py-8 text-center text-xs italic text-muted-foreground">
                  Nenhum tópico encontrado para os critérios selecionados.
                </p>
              ) : (
                topicosFiltrados.map((item: any) => {
                  const p = Number(item.precisao) || 0;
                  const barColor =
                    p < 50 ? "bg-destructive" : p < 75 ? "bg-amber-500" : "bg-primary";
                  const badgeLabel = p < 50 ? "Crítico" : p < 75 ? "Atenção" : "Adequado";

                  return (
                    <div
                      key={item.topico}
                      className="rounded-xl border border-border bg-muted/20 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-bold">
                        <span className="truncate">{item.topico}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] uppercase",
                              p < 50
                                ? "bg-destructive/15 text-destructive"
                                : p < 75
                                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                  : "bg-success/15 text-success",
                            )}
                          >
                            {badgeLabel}
                          </span>
                          <span className="text-muted-foreground">
                            {p}% ({item.total} resp.)
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full transition-all", barColor)}
                          style={{ width: `${p}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </TabsContent>

        {/* ================= ABA 2: GESTÃO DE USUÁRIOS COM FILTROS E PAGINAÇÃO ================= */}
        <TabsContent value="usuarios" className="space-y-4 animate-in fade-in-50">
          <section className="neu overflow-hidden rounded-2xl border border-border bg-card">
            {/* Barra de Filtros */}
            <div className="border-b border-border p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg">Controle de Contas e Papéis (RBAC)</h2>
                  <p className="text-sm text-muted-foreground">
                    Pesquise por nome ou e-mail e filtre por status ou nível de permissão.
                  </p>
                </div>
                <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-bold text-foreground">
                  Exibindo {usuariosFiltrados.length} de {usuarios.length} conta(s)
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                {/* Busca por Nome ou E-mail */}
                <div className="relative md:col-span-6">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={buscaTexto}
                    onChange={(e) => setBuscaTexto(e.target.value)}
                    placeholder="Filtrar por nome ou endereço de e-mail..."
                    className="pl-9 text-sm"
                  />
                </div>

                {/* Filtro por Status (Ativo / Suspenso) */}
                <div className="flex items-center gap-2 md:col-span-3">
                  <Filter className="size-4 shrink-0 text-muted-foreground" />
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value as any)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-bold"
                  >
                    <option value="todos">Status: Todos ({usuarios.length})</option>
                    <option value="ativos">
                      Apenas Ativos ({usuarios.filter((u) => u.ativo).length})
                    </option>
                    <option value="suspensos">
                      Apenas Suspensos ({usuarios.filter((u) => !u.ativo).length})
                    </option>
                  </select>
                </div>

                {/* Filtro por Papel (Role) */}
                <div className="md:col-span-3">
                  <select
                    value={filtroRole}
                    onChange={(e) => setFiltroRole(e.target.value as any)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-bold"
                  >
                    <option value="todos">Papel: Todos os Perfis</option>
                    <option value="estudante">Estudantes</option>
                    <option value="conteudo">Administradores de Conteúdo</option>
                    <option value="sistema">Administradores de Sistema</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tabela de Usuários */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="p-4 font-bold">Nome</th>
                    <th className="p-4 font-bold">E-mail</th>
                    <th className="p-4 font-bold">Nível de Acesso (Papel)</th>
                    <th className="p-4 font-bold">Status da Conta</th>
                    <th className="p-4 text-right font-bold">Ação Rápida</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosPaginados.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        Nenhum usuário encontrado para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    usuariosPaginados.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-border transition-colors hover:bg-muted/20"
                      >
                        <td className="p-4 font-bold">{u.nome}</td>
                        <td className="p-4 text-muted-foreground">{u.email}</td>
                        <td className="p-4">
                          <select
                            value={
                              u.role === "admin-conteudo"
                                ? "conteudo"
                                : u.role === "admin-sistema"
                                  ? "sistema"
                                  : u.role === "usuario"
                                    ? "estudante"
                                    : u.role
                            }
                            onChange={(e) => handleUpdateRole(u.id, e.target.value as Role)}
                            className="focus-ring h-9 cursor-pointer rounded-lg border border-border bg-background px-3 py-1 text-xs font-bold transition-all hover:bg-muted"
                          >
                            {ROLE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                              u.ativo
                                ? "bg-success/15 text-success"
                                : "bg-destructive/15 text-destructive",
                            )}
                          >
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                u.ativo ? "bg-success" : "bg-destructive",
                              )}
                            />
                            {u.ativo ? "Ativo" : "Suspenso"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            className={cn(
                              "rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors",
                              u.ativo
                                ? "border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
                                : "border-success/30 text-success hover:bg-success hover:text-white",
                            )}
                            onClick={() => handleToggleStatus(u.id, u.ativo)}
                          >
                            {u.ativo ? "Suspender" : "Reativar"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Controles de Paginação de Usuários */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-muted/20 px-6 py-4 text-xs">
              <span className="font-semibold text-muted-foreground">
                Página {paginaAtual} de {totalPaginas} · Mostrando{" "}
                {usuariosFiltrados.length === 0 ? 0 : (paginaAtual - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(paginaAtual * ITEMS_PER_PAGE, usuariosFiltrados.length)} de{" "}
                {usuariosFiltrados.length} registros
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={paginaAtual <= 1}
                  onClick={() => setPaginaAtual(1)}
                  className="rounded-lg border border-border bg-card px-2.5 py-1.5 font-bold hover:bg-muted disabled:opacity-40"
                >
                  « Primeira
                </button>
                <button
                  type="button"
                  disabled={paginaAtual <= 1}
                  onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 font-bold hover:bg-muted disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" /> Anterior
                </button>

                <span className="px-2 font-bold text-foreground">
                  {paginaAtual} / {totalPaginas}
                </span>

                <button
                  type="button"
                  disabled={paginaAtual >= totalPaginas}
                  onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 font-bold hover:bg-muted disabled:opacity-40"
                >
                  Próxima <ChevronRight className="size-4" />
                </button>
                <button
                  type="button"
                  disabled={paginaAtual >= totalPaginas}
                  onClick={() => setPaginaAtual(totalPaginas)}
                  className="rounded-lg border border-border bg-card px-2.5 py-1.5 font-bold hover:bg-muted disabled:opacity-40"
                >
                  Última »
                </button>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* ================= ABA 3: TRILHA DE AUDITORIA (IMUTÁVEL) COM FILTROS ================= */}
        <TabsContent value="auditoria" className="space-y-4 animate-in fade-in-50">
          <section className="neu overflow-hidden rounded-2xl border border-border bg-card">
            {/* Cabeçalho e Filtros da Auditoria */}
            <div className="border-b border-border p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <FileSearch className="size-5 text-primary" />
                  <div>
                    <h2 className="font-display text-lg">
                      Trilha de Auditoria e Rastreabilidade (Append-Only)
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Filtre eventos imutáveis por usuário associado (e-mail/nome/IP), ação registrada e intervalo de datas.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(auditUsuarioBusca ||
                    auditAcaoFiltro !== "todas" ||
                    auditDataInicio ||
                    auditDataFim) && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuditUsuarioBusca("");
                        setAuditAcaoFiltro("todas");
                        setAuditDataInicio("");
                        setAuditDataFim("");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-bold hover:bg-muted"
                    >
                      <RotateCcw className="size-3.5" /> Limpar Filtros
                    </button>
                  )}
                  <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-bold text-foreground">
                    Exibindo {logsAuditoriaFiltrados.length} de {todosLogsAuditoria.length} evento(s)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
                {/* Busca por Usuário Associado / IP */}
                <div className="lg:col-span-4">
                  <label className="mb-1 block text-[11px] font-bold uppercase text-muted-foreground">
                    Usuário Associado / IP
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={auditUsuarioBusca}
                      onChange={(e) => setAuditUsuarioBusca(e.target.value)}
                      placeholder="E-mail, nome ou IP de origem..."
                      className="pl-9 text-xs h-10"
                    />
                  </div>
                </div>

                {/* Filtro por Ação */}
                <div className="lg:col-span-3">
                  <label className="mb-1 block text-[11px] font-bold uppercase text-muted-foreground">
                    Ação / Evento Registrado
                  </label>
                  <select
                    value={auditAcaoFiltro}
                    onChange={(e) => setAuditAcaoFiltro(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-bold"
                  >
                    <option value="todas">Todas as Ações ({acoesUnicasAuditoria.length})</option>
                    {acoesUnicasAuditoria.map((acao) => (
                      <option key={acao} value={acao}>
                        {acao}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Data Inicial e Data Final com largura confortável */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase text-muted-foreground">
                      De (Data Inicial)
                    </label>
                    <input
                      type="date"
                      value={auditDataInicio}
                      onChange={(e) => setAuditDataInicio(e.target.value)}
                      className={DATE_INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase text-muted-foreground">
                      Até (Data Final)
                    </label>
                    <input
                      type="date"
                      value={auditDataFim}
                      onChange={(e) => setAuditDataFim(e.target.value)}
                      className={DATE_INPUT_CLASS}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela de Eventos de Auditoria (Sem coluna de Payload) */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead>
                  <tr className="bg-muted/50 uppercase tracking-wide text-muted-foreground">
                    <th className="p-4 font-bold">Evento / Ação</th>
                    <th className="p-4 font-bold">Usuário Associado</th>
                    <th className="p-4 font-bold">IP de Origem</th>
                    <th className="p-4 text-right font-bold">Data / Hora (BRT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logsAuditoriaPaginados.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-sm text-muted-foreground">
                        Nenhum registro de auditoria encontrado para os filtros informados.
                      </td>
                    </tr>
                  ) : (
                    logsAuditoriaPaginados.map((log) => (
                      <tr key={log.id} className="transition-colors hover:bg-muted/25">
                        <td className="p-4">
                          <span
                            className={cn(
                              "inline-block rounded-md border px-2.5 py-1 font-mono text-[11px] font-bold",
                              getAuditBadgeStyle(log.action),
                            )}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-foreground">{log.usuario}</div>
                          {log.nome_usuario && (
                            <div className="text-[11px] text-muted-foreground">
                              {log.nome_usuario}
                            </div>
                          )}
                        </td>
                        <td className="p-4 font-mono text-muted-foreground">{log.ip_address}</td>
                        <td className="p-4 text-right font-mono text-muted-foreground">
                          {log.timestamp}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Controles de Paginação da Auditoria */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-muted/20 px-6 py-4 text-xs">
              <span className="font-semibold text-muted-foreground">
                Página {paginaAuditoria} de {totalPaginasAuditoria} · Mostrando{" "}
                {logsAuditoriaFiltrados.length === 0
                  ? 0
                  : (paginaAuditoria - 1) * AUDIT_ITEMS_PER_PAGE + 1}
                –
                {Math.min(
                  paginaAuditoria * AUDIT_ITEMS_PER_PAGE,
                  logsAuditoriaFiltrados.length,
                )}{" "}
                de {logsAuditoriaFiltrados.length} eventos
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={paginaAuditoria <= 1}
                  onClick={() => setPaginaAuditoria(1)}
                  className="rounded-lg border border-border bg-card px-2.5 py-1.5 font-bold hover:bg-muted disabled:opacity-40"
                >
                  « Primeira
                </button>
                <button
                  type="button"
                  disabled={paginaAuditoria <= 1}
                  onClick={() => setPaginaAuditoria((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 font-bold hover:bg-muted disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" /> Anterior
                </button>

                <span className="px-2 font-bold text-foreground">
                  {paginaAuditoria} / {totalPaginasAuditoria}
                </span>

                <button
                  type="button"
                  disabled={paginaAuditoria >= totalPaginasAuditoria}
                  onClick={() =>
                    setPaginaAuditoria((p) => Math.min(totalPaginasAuditoria, p + 1))
                  }
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 font-bold hover:bg-muted disabled:opacity-40"
                >
                  Próxima <ChevronRight className="size-4" />
                </button>
                <button
                  type="button"
                  disabled={paginaAuditoria >= totalPaginasAuditoria}
                  onClick={() => setPaginaAuditoria(totalPaginasAuditoria)}
                  className="rounded-lg border border-border bg-card px-2.5 py-1.5 font-bold hover:bg-muted disabled:opacity-40"
                >
                  Última »
                </button>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
}: {
  icon: any;
  label: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="neu flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-6" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 font-display text-3xl font-bold text-foreground">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}