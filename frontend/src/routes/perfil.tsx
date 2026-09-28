import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { User, Lock, ShieldAlert, EyeOff, Eye, Save, AlertTriangle, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLinus, type Role } from "@/context/LinusContext";
import { blacklistNicknames } from "@/lib/blacklist";

export const Route = createFileRoute("/perfil")({
  component: PerfilComponent,
});

// Validação customizada contra palavras impróprias
const validarNomeApropriado = (nome: string) => {
  const nomeLower = nome.toLowerCase().trim();
  return !blacklistNicknames.some((palavra) => nomeLower.includes(palavra));
};

const nomeSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .refine(validarNomeApropriado, "O nome escolhido contém termos não permitidos."),
});

const senhaSchema = z
  .object({
    senhaAtual: z.string().min(1, "A senha atual é obrigatória"),
    novaSenha: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(/[\W_]/, "A senha deve conter pelo menos um caractere especial"),
    confirmaSenha: z.string().min(1, "Confirme sua nova senha"),
  })
  .refine((data) => data.novaSenha === data.confirmaSenha, {
    message: "As senhas não coincidem",
    path: ["confirmaSenha"],
  });

type NomeFormValues = z.infer<typeof nomeSchema>;
type SenhaFormValues = z.infer<typeof senhaSchema>;

function PerfilComponent() {
  const { state, login, setRole, logout } = useLinus();

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = useState(false);

  // Estado para armazenar os dados devolvidos pela rota LGPD do backend
  const [privacyData, setPrivacyData] = useState<any>(null);

  const {
    register: registerNome,
    handleSubmit: handleNomeSubmit,
    formState: { errors: nomeErrors, isSubmitting: isNomeSubmitting },
  } = useForm<NomeFormValues>({
    resolver: zodResolver(nomeSchema),
    defaultValues: { nome: state.name },
  });

  const {
    register: registerSenha,
    handleSubmit: handleSenhaSubmit,
    reset: resetSenha,
    formState: { errors: senhaErrors, isSubmitting: isSenhaSubmitting },
  } = useForm<SenhaFormValues>({
    resolver: zodResolver(senhaSchema),
    mode: "onChange",
  });

  // Busca os dados da LGPD ao montar a aba de privacidade
  useEffect(() => {
    const fetchPrivacyData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:8000/api/v1/auth/privacy/data/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setPrivacyData(data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados de privacidade", error);
      }
    };
    fetchPrivacyData();
  }, []);

  // 1. Ação: Atualizar Nome
  const onUpdateNome = async (data: NomeFormValues) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/api/v1/auth/profile/update/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: data.nome }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao atualizar perfil.");

      // Atualiza o token no cache e reidrata o contexto para refletir o nome novo no Header
      localStorage.setItem("access_token", result.tokens.access);
      const decoded = jwtDecode<{ role: string; nome?: string }>(result.tokens.access);
      setRole((decoded.role as Role) || "estudante");
      login(decoded.nome || data.nome);

      toast.success("Nome atualizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 2. Ação: Trocar Senha
  const onChangePassword = async (data: SenhaFormValues) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/api/v1/auth/password/change/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ old_password: data.senhaAtual, new_password: data.novaSenha }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao trocar a senha.");

      toast.success("Senha atualizada com segurança.");
      resetSenha();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 3. Ação: Revogar Consentimento (LGPD)
  const onRevokeConsent = async () => {
    if (
      !window.confirm(
        "Atenção! Ao revogar seu consentimento, sua conta será suspensa e você será desconectado. Deseja continuar?",
      )
    )
      return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/api/v1/auth/privacy/revoke-consent/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Falha ao revogar consentimento.");
      toast.info("Consentimento revogado. Sua sessão será encerrada.");
      logout(); // Executa a rotina de limpeza global
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 4. Ação: Excluir Conta (LGPD)
  const onDeleteAccount = async () => {
    if (
      !window.confirm(
        "AÇÃO IRREVERSÍVEL! Todo o seu progresso será perdido e seus dados pessoais serão anonimizados. Deseja realmente excluir sua conta?",
      )
    )
      return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/api/v1/auth/privacy/delete-account/", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Falha ao excluir conta.");
      toast.success("Conta e dados pessoais excluídos com sucesso.");
      logout(); // Executa a rotina de limpeza global
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 min-h-[calc(100vh-200px)]">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Configurações da Conta
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie seus dados pessoais, configurações de segurança e preferências de privacidade.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-8">
        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
            <TabsTrigger value="geral" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 hidden sm:block" /> Perfil
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 hidden sm:block" /> Segurança
            </TabsTrigger>
            <TabsTrigger
              value="privacidade"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <ShieldAlert className="h-4 w-4 hidden sm:block" /> LGPD
            </TabsTrigger>
          </TabsList>

          {/* ABA 1: DADOS GERAIS */}
          <TabsContent value="geral" className="space-y-6 max-w-md">
            <div>
              <h3 className="text-lg font-bold text-foreground">Informações Pessoais</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Atualize o nome como você quer ser chamado na plataforma.
              </p>
            </div>
            <form onSubmit={handleNomeSubmit(onUpdateNome)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Nome de Exibição
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    {...registerNome("nome")}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {nomeErrors.nome && (
                  <p className="mt-1 text-xs text-destructive">{nomeErrors.nome.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isNomeSubmitting}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />{" "}
                {isNomeSubmitting ? "Salvando..." : "Salvar Alterações"}
              </button>
            </form>
          </TabsContent>

          {/* ABA 2: SEGURANÇA */}
          <TabsContent value="seguranca" className="space-y-6 max-w-md">
            <div>
              <h3 className="text-lg font-bold text-foreground">Alterar Senha</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Mantenha sua conta segura utilizando uma senha forte.
              </p>
            </div>
            <form onSubmit={handleSenhaSubmit(onChangePassword)} className="space-y-4">
              {/* Senha Atual */}
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Senha Atual
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type={mostrarSenhaAtual ? "text" : "password"}
                    {...registerSenha("senhaAtual")}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                    className="absolute right-3 top-2.5 text-muted-foreground"
                  >
                    {mostrarSenhaAtual ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {senhaErrors.senhaAtual && (
                  <p className="mt-1 text-xs text-destructive">{senhaErrors.senhaAtual.message}</p>
                )}
              </div>

              {/* Nova Senha */}
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Nova Senha
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type={mostrarNovaSenha ? "text" : "password"}
                    {...registerSenha("novaSenha")}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                    className="absolute right-3 top-2.5 text-muted-foreground"
                  >
                    {mostrarNovaSenha ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {senhaErrors.novaSenha && (
                  <p className="mt-1 text-xs text-destructive">{senhaErrors.novaSenha.message}</p>
                )}
              </div>

              {/* Confirma Nova Senha */}
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Confirmar Nova Senha
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type={mostrarConfirmaSenha ? "text" : "password"}
                    {...registerSenha("confirmaSenha")}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmaSenha(!mostrarConfirmaSenha)}
                    className="absolute right-3 top-2.5 text-muted-foreground"
                  >
                    {mostrarConfirmaSenha ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {senhaErrors.confirmaSenha && (
                  <p className="mt-1 text-xs text-destructive">
                    {senhaErrors.confirmaSenha.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSenhaSubmitting}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />{" "}
                {isSenhaSubmitting ? "Atualizando..." : "Atualizar Senha"}
              </button>
            </form>
          </TabsContent>

          {/* ABA 3: LGPD E PRIVACIDADE */}
          <TabsContent value="privacidade" className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-foreground">Direitos do Titular (LGPD)</h3>
              <p className="text-sm text-muted-foreground">
                De acordo com o Art. 18 da Lei Geral de Proteção de Dados (13.709/2018), você possui
                total controle sobre as suas informações.
              </p>
            </div>

            {/* Painel de Dados do Consentimento */}
            {privacyData && (
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <h4 className="flex items-center gap-2 font-bold text-foreground mb-4">
                  <FileText className="h-4 w-4 text-primary" /> Registro de Consentimento
                </h4>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <span className="block text-xs font-semibold uppercase text-muted-foreground">
                      E-mail Vinculado
                    </span>
                    <span className="font-medium text-foreground">{privacyData.email}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase text-muted-foreground">
                      Termos Aceitos
                    </span>
                    <span className="font-medium text-foreground">
                      Versão {privacyData.termos_de_uso.versao}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase text-muted-foreground">
                      Data do Consentimento
                    </span>
                    <span className="font-medium text-foreground">
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(privacyData.termos_de_uso.data_aceite))}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase text-muted-foreground">
                      IP de Origem
                    </span>
                    <span className="font-medium text-foreground">
                      {privacyData.termos_de_uso.ip_consentimento}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-border pt-6 space-y-6">
              {/* Revogar Consentimento */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                <div>
                  <h5 className="font-bold text-amber-600 dark:text-amber-400">
                    Revogar Consentimento
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1 max-w-lg">
                    Suspende temporariamente o seu acesso à plataforma. Os seus dados continuarão
                    salvos, mas você não poderá fazer login até aceitar os termos novamente.
                  </p>
                </div>
                <button
                  onClick={onRevokeConsent}
                  className="shrink-0 rounded-lg border border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white px-4 py-2 text-sm font-bold transition-colors"
                >
                  Revogar Acesso
                </button>
              </div>

              {/* Excluir Conta (Zona de Perigo) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div>
                  <h5 className="font-bold text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> Excluir Conta Definitivamente
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1 max-w-lg">
                    Ação irreversível. Seu progresso será apagado e seus dados pessoais (nome e
                    e-mail) serão anonimizados permanentemente no banco de dados.
                  </p>
                </div>
                <button
                  onClick={onDeleteAccount}
                  className="shrink-0 rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  Excluir Minha Conta
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
