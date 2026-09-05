import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users, ShieldCheck, Activity, TrendingUp } from "lucide-react";
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

  const ativos = usuarios.filter((u) => u.ativo).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionTitle
        eyebrow="Administrador de sistemas"
        title="Visão geral da plataforma"
        description="Métricas simuladas de uso e controle de contas, papéis e status."
      />

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

function Metric({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="neu p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="font-display text-2xl">{value}</p>
        </div>
      </div>
    </div>
  );
}
