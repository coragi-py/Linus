import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users, ShieldCheck, Activity } from "lucide-react";
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
              icon={ShieldCheck}
              label="Interações (7 dias)"
              value={metricas?.totais?.licoes || "0"}
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
        </TabsContent>

        {/* ABA 2: GESTÃO DE USUÁRIOS */}
        <TabsContent value="usuarios" className="animate-in fade-in-50">
          <section className="neu overflow-x-auto rounded-2xl bg-card border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="font-display text-lg">Tabela de Acessos</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Altere os níveis de permissão e bloqueie contas.
              </p>
            </div>

            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="p-4 font-bold">Nome</th>
                  <th className="p-4 font-bold">E-mail</th>
                  <th className="p-4 font-bold">Nível de Acesso (Papel)</th>
                  <th className="p-4 font-bold">Status da Conta</th>
                  <th className="p-4 font-bold text-right">Ação Rápida</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 font-bold">{u.nome}</td>
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
                ))}
              </tbody>
            </table>
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
