import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Lock, Mail, User, Calendar, ShieldCheck, Music, Eye, EyeOff } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useLinus, type Role } from "@/context/LinusContext";
import { blacklistNicknames } from "@/lib/blacklist";
import { VERSAO_TERMOS_USO } from "@/lib/constants";

export const Route = createFileRoute("/registro")({
  component: RegistroComponent,
});

const currentYear = new Date().getFullYear();
const minBirthYear = currentYear - 12;

const validarNomeApropriado = (nome: string) => {
  const nomeLower = nome.toLowerCase().trim();
  return !blacklistNicknames.some((palavra) => nomeLower.includes(palavra));
};

const regrasBase = {
  nome: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .refine(validarNomeApropriado, "O nome escolhido contém termos não permitidos."),
  anoNascimento: z
    .number({ invalid_type_error: "O ano de nascimento é obrigatório" })
    .int()
    .min(1900, "Ano inválido")
    .max(
      minBirthYear,
      `Você deve ter pelo menos 12 anos para se cadastrar (nascido até ${minBirthYear})`,
    ),
  aceiteTermos: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os Termos de Uso",
  }),
};

const manualSchema = z
  .object({
    email: z.string().email("E-mail inválido"),
    senha: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(/[\W_]/, "A senha deve conter pelo menos um caractere especial"),
    confirmaSenha: z.string().min(1, "Confirme sua senha"),
    ...regrasBase,
  })
  .refine((data) => data.senha === data.confirmaSenha, {
    message: "As senhas não coincidem",
    path: ["confirmaSenha"],
  });

const googleSchema = z.object({
  email: z.string().optional(),
  senha: z.string().optional(),
  confirmaSenha: z.string().optional(),
  ...regrasBase,
});

type RegistroFormValues = z.infer<typeof manualSchema>;

function RegistroComponent() {
  const navigate = useNavigate();
  const { login, setRole } = useLinus();

  const [termosLidos, setTermosLidos] = useState(false);
  const [fluxoGooglePendente, setFluxoGooglePendente] = useState(false);
  const [googleIdTokenTemp, setGoogleIdTokenTemp] = useState<string | null>(null);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroFormValues>({
    resolver: zodResolver(fluxoGooglePendente ? googleSchema : manualSchema),
    mode: "onChange",
    defaultValues: { aceiteTermos: false },
  });

  const handleLerTermos = () => {
    setTermosLidos(true);
    toast.info("Termos de Uso visualizados. O aceite foi desbloqueado.");
  };

  const finalizarLogin = (access: string, refresh: string, nomeFormulario: string) => {
    localStorage.setItem("access_token", access);
    if (refresh) localStorage.setItem("refresh_token", refresh);

    const decoded = jwtDecode<{ role: string; nome?: string }>(access);
    setRole((decoded.role as Role) || "estudante");
    login(decoded.nome || nomeFormulario);

    window.location.href = "/painel";
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_token: idToken,
          terms_accepted: false,
          terms_version: "",
        }),
      });

      const result = await response.json();

      // Interceptação 1: Novo usuário precisa completar dados LGPD
      if (response.status === 403 && result.status === "registration_required") {
        setGoogleIdTokenTemp(idToken);
        setFluxoGooglePendente(true);
        toast.warning("Complete as informações de LGPD para finalizar seu cadastro com o Google.");
        return;
      }

      // Interceptação 2: Usuário antigo clicou no lugar errado e tem 2FA ativo
      if (response.status === 202 && result.status === "2fa_required") {
        toast.info("Você já possui uma conta com 2FA. Redirecionando para o login...");
        navigate({ to: "/login" });
        return;
      }

      // Interceptação 3: Usuário antigo com consentimento revogado
      if (response.status === 403 && result.status === "terms_required") {
        toast.warning("Sua conta está suspensa (LGPD). Redirecionando para o login...");
        navigate({ to: "/login" });
        return;
      }

      if (!response.ok) throw new Error(result.error || "Erro na autenticação com Google.");

      // Login/Registro direto concluído sem pendências
      if (result.access) {
        toast.success("Login com Google efetuado com sucesso!");
        finalizarLogin(result.access, result.refresh, "Usuário");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro no processo do Google OAuth.");
    }
  };

  const onSubmit = async (data: RegistroFormValues) => {
    try {
      let response;
      let result;

      if (fluxoGooglePendente && googleIdTokenTemp) {
        response = await fetch("http://localhost:8000/api/v1/auth/google/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_token: googleIdTokenTemp,
            name: data.nome,
            ano_nascimento: data.anoNascimento,
            terms_accepted: data.aceiteTermos,
            terms_version: VERSAO_TERMOS_USO,
          }),
        });
      } else {
        response = await fetch("http://localhost:8000/api/v1/auth/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: data.nome,
            email: data.email,
            password: data.senha,
            ano_nascimento: data.anoNascimento,
            terms_accepted: data.aceiteTermos,
            terms_version: VERSAO_TERMOS_USO,
          }),
        });
      }

      result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.detail || result.email?.[0] || "Erro ao realizar cadastro.",
        );
      }

      if (result.access) {
        toast.success("Cadastro realizado com sucesso! Bem-vindo ao Linus.");
        finalizarLogin(result.access, result.refresh, data.nome);
      }
    } catch (error: any) {
      toast.error(error.message || "Falha na comunicação com o servidor.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Music className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
            Criar sua conta no Linus
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Aprenda teoria musical de forma prática e interativa
          </p>
        </div>

        {!fluxoGooglePendente ? (
          <>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Falha ao conectar com o Google")}
                useOneTap={false}
              />
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-xs uppercase text-muted-foreground">
                ou cadastro manual
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-amber-500/10 p-4 border border-amber-500/30 text-sm text-amber-600 dark:text-amber-400">
            <strong>Quase lá!</strong> Identificamos sua conta Google, mas precisamos do seu nome,
            ano de nascimento e aceite dos Termos.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground">
              Nome de Exibição
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                {...register("nome")}
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Seu nome"
              />
            </div>
            {errors.nome && <p className="mt-1 text-xs text-destructive">{errors.nome.message}</p>}
          </div>

          {!fluxoGooglePendente && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  E-mail
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Senha
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    {...register("senha")}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.senha && (
                  <p className="mt-1 text-xs text-destructive">{errors.senha.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Confirmar Senha
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type={mostrarConfirmaSenha ? "text" : "password"}
                    {...register("confirmaSenha")}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmaSenha(!mostrarConfirmaSenha)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {mostrarConfirmaSenha ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmaSenha && (
                  <p className="mt-1 text-xs text-destructive">{errors.confirmaSenha.message}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground">
              Ano de Nascimento
            </label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="number"
                {...register("anoNascimento", { valueAsNumber: true })}
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: 2005"
              />
            </div>
            {errors.anoNascimento && (
              <p className="mt-1 text-xs text-destructive">{errors.anoNascimento.message}</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                Para prosseguir com o cadastro, você deve ler os nossos{" "}
                <a
                  href="/termos"
                  onClick={handleLerTermos}
                  className="font-medium text-primary underline hover:text-primary/80"
                  target="_blank"
                  rel="noreferrer"
                >
                  Termos de Uso e Política de Privacidade
                </a>
                .
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="aceiteTermos"
                disabled={!termosLidos}
                {...register("aceiteTermos")}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary disabled:opacity-50 cursor-pointer"
              />
              <label
                htmlFor="aceiteTermos"
                className={`text-xs ${!termosLidos ? "text-muted-foreground/50 cursor-not-allowed" : "text-foreground cursor-pointer"}`}
              >
                Li e concordo com os Termos de Uso (LGPD)
              </label>
            </div>
            {errors.aceiteTermos && (
              <p className="text-xs text-destructive">{errors.aceiteTermos.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Processando..." : "Concluir Cadastro"}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
