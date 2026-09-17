// Adicionado bullets de auditoria em relação aos logins. Ainda não possui autorização de exibir os dados pois falta aplicação do accounts. Por Anny, em 17/09.
import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users, ShieldCheck, Activity, TrendingUp, UserPlus, LogIn, AlertTriangle } from "lucide-react";
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
import { SectionTitle } from "@/components/AppShell";
import { ROLE_LABEL, type Role } from "@/context/LinusContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/sistema")({
  head: () => ({
    meta: [
      { title: "Administração de Sistemas — Linus" },
      {
        name: "description",
        content: "Métricas da plataforma e gestão de usuários e papéis.",
      },
      { property: "og:title", content: "Administração de Sistemas — Linus" },
      {
        property: "og:description",
        content: "Métricas simuladas de uso e controle de contas, papéis e status.",
      },
    ],
  }),
  component: AdminSistema,
});

/* interface igual ao JSON que o django retorna */
type AuditData = {
  periodo_analise: string;
  metricas_gerais: {
    novos_cadastros: number;
    logins_com_sucesso: number;
    logins_com_falha: number;
  };
  seguranca: {
    alerta_ips_suspeitos: { ip_origem: string; tentativas_falhas: number }[];
  };
};

type MockUser = { id: number; nome: string; email: string; role: Role; ativo: boolean };

const USUARIOS_INICIAIS: MockUser[] = [
  { id: 1, nome: "Anny Nascimento", email: "anny@linus.app", role: "sistema", ativo: true },
  { id: 2, nome: "Carlos Pereira", email: "carlos@escola.br", role: "estudante", ativo: true },
  { id: 3, nome: "Marina Lopes", email: "marina@escola.br", role: "conteudo", ativo: true },
  { id: 4, nome: "Dona Zilda", email: "zilda@familia.com", role: "estudante", ativo: true },
  { id: 5, nome: "Téo (10 anos)", email: "teo@familia.com", role: "estudante", ativo: false },
  { id: 6, nome: "Rafael Duarte", email: "rafael@conserv.br", role: "estudante", ativo: true },
];

const ATIVIDADE = [
  { dia: "Seg", licoes: 120, ativos: 45 },
  { dia: "Ter", licoes: 155, ativos: 52 },
  { dia: "Qua", licoes: 190, ativos: 61 },
  { dia: "Qui", licoes: 140, ativos: 48 },
  { dia: "Sex", licoes: 210, ativos: 70 },
  { dia: "Sáb", licoes: 85, ativos: 35 },
  { dia: "Dom", licoes: 60, ativos: 28 },
];

function AdminSistema() {
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIAIS);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        // TODO: Quando o 'accounts' estiver pronto, injetar o header: { Authorization: `Bearer ${token}` }
        const response = await fetch('/api/v1/audit/analise/');
        
        if (response.ok) {
          const data = await response.json();
          setAuditData(data);
        }
      } catch (error) {
        console.error("Erro ao buscar métricas de auditoria:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  const ativos = usuarios.filter((u) => u.ativo).length;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionTitle
        eyebrow="Administrador de sistemas"
        title="Visão geral da plataforma"
        description="Métricas simuladas de uso e controle de contas, papéis e status."
      />

  {/* MÉTRICAS REAIS DA API DE AUDITORIA */}
      <div className="grid gap-5 sm:grid-cols-4">
        <Metric 
          icon={UserPlus} 
          label="Novos Cadastros (24h)" 
          value={isLoading ? "..." : String(auditData?.metricas_gerais.novos_cadastros || 0)} 
        />
        <Metric 
          icon={LogIn} 
          label="Logins Sucesso (24h)" 
          value={isLoading ? "..." : String(auditData?.metricas_gerais.logins_com_sucesso || 0)} 
        />
        <Metric 
          icon={AlertTriangle} 
          label="Falhas de Login (24h)" 
          value={isLoading ? "..." : String(auditData?.metricas_gerais.logins_com_falha || 0)}
          highlight={Number(auditData?.metricas_gerais.logins_com_falha) > 5} 
        />
        <Metric 
          icon={Users} 
          label="Total (Mock)" 
          value={String(usuarios.length * 214)} 
        />
      </div>

      {/* ALERTA DE IPS SUSPEITOS (Só aparece se houver ameaça) */}
      {!isLoading && auditData?.seguranca.alerta_ips_suspeitos && auditData.seguranca.alerta_ips_suspeitos.length > 0 && (
        <section className="neu mt-8 border-l-4 border-l-destructive p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            <h2 className="font-display text-lg">Alerta de Segurança: Possível Força Bruta</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            IPs com mais de 5 falhas de autenticação nas últimas 24 horas.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {auditData.seguranca.alerta_ips_suspeitos.map((ip, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-bold text-destructive">
                {ip.ip_origem}
                <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-xs">
                  {ip.tentativas_falhas} falhas
                </span>
              </span>
            ))}
          </div>
        </section>
      )}  

      <div className="grid gap-5 sm:grid-cols-3">
        <Metric icon={Users} label="Usuários cadastrados" value={String(usuarios.length * 214)} />
        <Metric icon={Activity} label="Ativos nos últimos 7 dias" value={String(ativos * 96)} />
        <Metric icon={ShieldCheck} label="Lições concluídas na semana" value="974" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="neu p-6">
          <h2 className="font-display text-lg">Lições concluídas por dia</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATIVIDADE}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
                <Bar dataKey="licoes" name="Lições" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="neu p-6">
          <h2 className="font-display text-lg">Usuários ativos por dia</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ATIVIDADE}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
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
      </div>

      <section className="neu mt-8 overflow-x-auto">
        <div className="p-6">
          <h2 className="font-display text-lg">Gestão de Usuários</h2>
          <p className="text-sm text-muted-foreground">Altere permissões e visualize status em tempo real.</p>
        </div>
        
        <table className="w-full min-w-160 text-sm">
          <caption className="sr-only">Usuários da plataforma</caption>
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="p-3">Nome</th>
              <th className="p-3">E-mail</th>
              <th className="p-3">Papel</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3 font-bold">{u.nome}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3">
                  <label className="sr-only" htmlFor={`role-${u.id}`}>
                    Papel de {u.nome}
                  </label>
                  <select
                    id={`role-${u.id}`}
                    value={u.role}
                    onChange={(e) =>
                      setUsuarios(
                        usuarios.map((x) =>
                          x.id === u.id ? { ...x, role: e.target.value as Role } : x,
                        ),
                      )
                    }
                    className="focus-ring h-9 rounded-xl border-none bg-muted px-3 py-1 text-xs font-bold transition-all"
                  >
                    {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABEL[r]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      u.ativo ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {u.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    type="button"
                    className="text-xs font-bold text-primary hover:underline"
                    onClick={() =>
                      setUsuarios(
                        usuarios.map((x) => (x.id === u.id ? { ...x, ativo: !x.ativo } : x)),
                      )
                    }
                  >
                    {u.ativo ? "Desativar" : "Reativar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Metric({ 
  icon: Icon, 
  label, 
  value, 
  highlight = false 
}: { 
  icon: any; 
  label: string; 
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn("neu p-5 transition-colors", highlight && "border-destructive bg-destructive/5")}>
      <div className="flex items-center gap-3">
        <span className={cn(
          "flex size-10 items-center justify-center rounded-xl",
          highlight ? "bg-destructive/20 text-destructive" : "bg-primary-soft text-primary"
        )}>
          <Icon className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className={cn("font-display text-2xl", highlight && "text-destructive")}>{value}</p>
        </div>
      </div>
    </div>
  );
}