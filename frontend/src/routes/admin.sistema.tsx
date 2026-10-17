// Adicioando métrica de termos de uso/lgpd/banco de dados no dash, por Anny em 16/10.
// Adicionando filtro e paginação na visualização do usuário, por Anny em 17/10.
import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { SectionTitle } from "@/components/AppShell";
import { ROLE_LABEL, type Role } from "@/context/LinusContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/sistema")({
  component: AdminSistema,
});

type RealUser = { id: string; nome: string; email: string; role: Role; ativo: boolean };

function AdminSistema() {
  const [usuarios, setUsuarios] = useState<RealUser[]>([]);
  const [metricas, setMetricas] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Quantidade de usuários por página

  //Volta para página 1 quando busca algo no filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  //Filtragem
  const filteredUsers = usuarios.filter((u) => {
    const matchesSearch =
      u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    // Se o filtro selecionado for estudante/usuario, aceita ambos os termos do banco
    let matchesRole = roleFilter === "todos";
    if (!matchesRole) {
      if (roleFilter === "estudante" || roleFilter === "usuario") {
        matchesRole = u.role === "estudante" || u.role === "usuario";
      } else {
        matchesRole = u.role === roleFilter;
      }
    }

    return matchesSearch && matchesRole;
  });

  //Paginação
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Busca os dados reais ao montar a página
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

    fetchData();
  }, []);

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

      // 1. BLINDAGEM: Verifica se o Django retornou HTML (Erro Fatal/404) em vez de JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const htmlError = await res.text();
        console.error("Erro Crítico no Backend:", htmlError); // Você poderá ler o erro do Django no F12
        throw new Error(
          "O servidor falhou ao processar a rota (Erro 404/500). Verifique o console.",
        );
      }

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro interno do servidor");

      toast.success("Permissões atualizadas com sucesso.");
      setUsuarios(usuarios.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
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

      // 1. BLINDAGEM: Verifica se o Django retornou HTML
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const htmlError = await res.text();
        console.error("Erro Crítico no Backend:", htmlError);
        throw new Error(
          "O servidor falhou ao processar a rota (Erro 404/500). Verifique o console.",
        );
      }

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro interno do servidor");

      toast.success("Status do usuário alterado.");
      setUsuarios(usuarios.map((u) => (u.id === userId ? { ...u, ativo: !currentStatus } : u)));
    } catch (error: any) {
      toast.error(error.message || "Falha ao alterar status.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground font-bold animate-pulse">Sincronizando dados...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 min-h-screen">
      <SectionTitle
        eyebrow="Administração Central"
        title="Painel de Controle Linus"
        description="Acompanhe o desempenho da plataforma e gerencie os acessos de usuários."
      />

      <Tabs defaultValue="dashboard" className="w-full mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 h-12">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 text-sm font-medium">
            <Activity className="size-4" /> Métricas
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2 text-sm font-medium">
            <Users className="size-4" /> Usuários
          </TabsTrigger>
        </TabsList>

        {/* ABA 1: DASHBOARD DE MÉTRICAS */}
        <TabsContent value="dashboard" className="space-y-8 animate-in fade-in-50">
          <div className="grid gap-5 sm:grid-cols-3">
            <Metric
              icon={Users}
              label="Total de Usuários"
              value={metricas?.totais?.usuarios || "0"}
            />
            <Metric icon={Activity} label="Contas Ativas" value={metricas?.totais?.ativos || "0"} />
            <Metric
              icon={Users}
              label="Contas Suspensas"
              value={metricas?.totais?.suspensos || "0"}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="neu p-6 rounded-2xl bg-card border border-border">
              <h2 className="font-display text-lg">Usuários Ativos (Últimos Logins)</h2>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metricas?.grafico || []}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
                    <Line
                      type="monotone"
                      dataKey="ativos"
                      name="Ativos"
                      stroke="var(--success)"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="neu p-6 rounded-2xl bg-card border border-border">
              <h2 className="font-display text-lg">Novos Registros por Dia</h2>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metricas?.grafico || []}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
                    <Bar
                      dataKey="licoes"
                      name="Registros"
                      fill="var(--primary)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
          {/* CONFORMIDADE LGPD */}
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Bloco de Conformidade LGPD */}
            <section className="neu p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="size-5 text-primary" />
                <h2 className="font-display text-lg">Conformidade e Privacidade (LGPD)</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Consentidos</p>
                  <p className="text-2xl font-bold text-success mt-1">{metricas?.lgpd_status?.ativos || 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Revogados</p>
                  <p className="text-2xl font-bold text-warning mt-1">{metricas?.lgpd_status?.revogados || 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Anonimizados</p>
                  <p className="text-2xl font-bold text-muted-foreground mt-1">{metricas?.lgpd_status?.anonimizados || 0}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Monitoramento ativo de consentimentos de acordo com as diretrizes da Lei Geral de Proteção de Dados.
              </p>
            </section>

            {/* Bloco de Saúde e BD */}
            <section className="neu p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="size-5 text-primary" />
                <h2 className="font-display text-lg">Saúde da Infraestrutura & Banco de Dados</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                  <span className="text-sm font-medium text-muted-foreground">Espaço do Banco (PostgreSQL)</span>
                  <span className="text-sm font-bold text-foreground">{metricas?.system_health?.db_size_mb} MB</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                  <span className="text-sm font-medium text-muted-foreground">Latência Média da API (Django)</span>
                  <span className="text-sm font-bold text-success">{metricas?.system_health?.api_latency_ms}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                
              </p>
            </section>
          </div>
        </TabsContent>

        {/* ABA 2: GESTÃO DE USUÁRIOS */}
        <TabsContent value="usuarios" className="animate-in fade-in-50">
          <section className="neu rounded-2xl bg-card border border-border flex flex-col overflow-hidden"> 
            {/* CABEÇALHO COM PESQUISA E FILTROS */}
            <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10">
              <div>
                <h2 className="font-display text-lg">Tabela de Acessos</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Pesquise, filtre e altere os níveis de permissão.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Barra de Pesquisa */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Buscar nome ou e-mail..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 w-full sm:w-64 rounded-xl border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  />
                </div>
                {/* Filtro por Role */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <select 
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="h-10 w-full sm:w-48 rounded-xl border border-input bg-background pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="todos">Todos os Papéis</option>
                    {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                      <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* TABELA */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="p-4 font-bold">Nome</th>
                    <th className="p-4 font-bold">E-mail</th>
                    <th className="p-4 font-bold">Nível de Acesso (Papel)</th>
                    <th className="p-4 font-bold">Status da Conta</th>
                    <th className="p-4 font-bold text-right">Ação Rápida</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-border hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-4 font-bold text-foreground">{u.nome}</td>
                        <td className="p-4 text-muted-foreground">{u.email}</td>
                        <td className="p-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u.id, e.target.value as Role)}
                            className="focus-ring h-9 rounded-lg border border-border bg-background px-3 py-1 text-xs font-bold transition-all hover:bg-muted cursor-pointer"
                          >
                            {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                              <option key={r} value={r}>
                                {ROLE_LABEL[r]}
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
                              "text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors",
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
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-muted-foreground">
                        <Search className="size-8 mx-auto mb-3 opacity-20" />
                        Nenhum usuário encontrado com os filtros atuais.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* CONTROLES DE PAGINAÇÃO */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10 text-sm">
                <span className="text-muted-foreground font-medium">
                  Mostrando{" "}
                  <strong className="text-foreground">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </strong>{" "}
                  a{" "}
                  <strong className="text-foreground">
                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                  </strong>{" "}
                  de <strong className="text-foreground">{filteredUsers.length}</strong> usuários
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="font-bold px-3 py-1 bg-muted/50 rounded-md">
                    {currentPage} / {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) {
  return (
    <div className="neu p-6 rounded-2xl bg-card border border-border flex items-center gap-4">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
        <Icon className="size-6" aria-hidden />
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-display text-3xl font-bold mt-1 text-foreground">{value}</p>
      </div>
    </div>
  );
}
