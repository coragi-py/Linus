import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  ShieldCheck,
  Activity,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Lock,
  Layers,
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

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "estudante", label: "Estudante" },
  { value: "conteudo", label: "Administrador de Conteúdo" },
  { value: "sistema", label: "Administrador de Sistemas" },
];

const ITEMS_PER_PAGE = 25;

function AdminSistema() {
  const [usuarios, setUsuarios] = useState<RealUser[]>([]);
  const [metricas, setMetricas] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados de Filtro e Paginação da Tabela de Usuários
  const [buscaTexto, setBuscaTexto] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "ativos" | "suspensos">("todos");
  const [filtroRole, setFiltroRole] = useState<"todos" | "estudante" | "conteudo" | "sistema">(
    "todos",
  );
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        const [resUsers, resMetrics] = await Promise.all([
          fetch("http://localhost:8000/api/v1/auth/admin/users/", { headers }),
          fetch("http://localhost:8000/api/v1/auth/admin/metrics/", { headers }),
        ]);

        if (!resUsers.ok || !resMetrics.ok) {
          throw new Error("Falha de permissão ou comunicação.");
        }

        const dataUsers = await resUsers.json();
        const dataMetrics = await resMetrics.json();

        setUsuarios(dataUsers);
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

  // Reseta para a página 1 sempre que os filtros mudarem
  useEffect(() => {
    setPaginaAtual(1);
  }, [buscaTexto, filtroStatus, filtroRole]);

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

  const handleUpdateRole = async (userId: string, newRole: Role) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:8000/api/v1/auth/admin/users/${userId}/`, {
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
      const res = await fetch(`http://localhost:8000/api/v1/auth/admin/users/${userId}/`, {
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
          Sincronizando telemetria e base de usuários...
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
        description="Monitore indicadores globais (Big Numbers), telemetria pedagógica, trilha de auditoria e controle de acesso (RBAC)."
      />

      <Tabs defaultValue="dashboard" className="mt-6 w-full">
        <TabsList className="mb-8 grid h-12 w-full max-w-md grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 text-sm font-bold">
            <Activity className="size-4" /> Dashboard & Métricas
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2 text-sm font-bold">
            <Users className="size-4" /> Gestão de Usuários ({usuarios.length})
          </TabsTrigger>
        </TabsList>

        {/* ================= ABA 1: DASHBOARD DE MÉTRICAS (BIG NUMBERS) ================= */}
        <TabsContent value="dashboard" className="space-y-8 animate-in fade-in-50">
          {/* Linha 1: Big Numbers de Usuários, Aprendizagem e Segurança */}
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

          {/* Linha 3: Gráficos de Evolução (Últimos 7 dias) */}
          <div className="grid gap-5 lg:grid-cols-2">
            <section className="neu rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg">Acessos Ativos vs. Novos Cadastros (7 dias)</h2>
              <p className="text-xs text-muted-foreground">
                Volume diário de estudantes com login registrado e novas contas criadas.
              </p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metricas?.grafico || []}>
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

            <section className="neu rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg">
                Engajamento Pedagógico: Aulas & Exercícios (7 dias)
              </h2>
              <p className="text-xs text-muted-foreground">
                Quantidade de lições finalizadas e exercícios submetidos diariamente.
              </p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metricas?.grafico || []}>
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
          </div>

          {/* Linha 4: Desempenho por Tópico + Trilha de Auditoria Recente */}
          <div className="grid gap-5 lg:grid-cols-12">
            <section className="neu rounded-2xl border border-border bg-card p-6 lg:col-span-5">
              <h2 className="font-display text-lg">Taxa de Acerto Global por Tópico</h2>
              <p className="text-xs text-muted-foreground">
                Consolidação das tentativas de todos os estudantes por unidade temática.
              </p>
              <div className="mt-5 space-y-4">
                {(metricas?.desempenho_topicos || []).length === 0 ? (
                  <p className="py-8 text-center text-xs italic text-muted-foreground">
                    Ainda não há tentativas de exercícios registradas no banco.
                  </p>
                ) : (
                  metricas.desempenho_topicos.map((item: any) => (
                    <div key={item.topico} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>{item.topico}</span>
                        <span className="text-muted-foreground">
                          {item.precisao}% acerto ({item.total} resp.)
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${item.precisao}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="neu rounded-2xl border border-border bg-card p-6 lg:col-span-7">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg">Últimos Eventos de Auditoria (Imutáveis)</h2>
                  <p className="text-xs text-muted-foreground">
                    Rastreabilidade em tempo real de auditoria.
                  </p>
                </div>
                <AlertTriangle className="size-5 text-gold" />
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="pb-2 font-bold">Evento / Ação</th>
                      <th className="pb-2 font-bold">Usuário</th>
                      <th className="pb-2 font-bold">IP Origem</th>
                      <th className="pb-2 text-right font-bold">Data/Hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(metricas?.ultimos_logs || []).map((log: any) => (
                      <tr key={log.id} className="hover:bg-muted/30">
                        <td className="py-2.5 font-mono font-bold text-primary">{log.action}</td>
                        <td className="py-2.5 text-foreground">{log.usuario}</td>
                        <td className="py-2.5 font-mono text-muted-foreground">{log.ip_address}</td>
                        <td className="py-2.5 text-right text-muted-foreground">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
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

            {/* Controles de Paginação */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-muted/20 px-6 py-4 text-xs">
              <span className="font-semibold text-muted-foreground">
                Página {paginaAtual} de {totalPaginas} ({usuariosFiltrados.length} registros)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={paginaAtual <= 1}
                  onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 font-bold hover:bg-muted disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" /> Anterior
                </button>
                <button
                  type="button"
                  disabled={paginaAtual >= totalPaginas}
                  onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 font-bold hover:bg-muted disabled:opacity-40"
                >
                  Próxima <ChevronRight className="size-4" />
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