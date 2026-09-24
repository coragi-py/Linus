import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Lock, Mail, Music, LogIn, ShieldAlert, KeyRound } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useLinus, type Role } from "@/context/LinusContext";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

// Schema para o Login Tradicional
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

// Schema para a Validação do OTP (2FA)
const otpSchema = z.object({
  otp: z.string().length(6, "O código de segurança deve ter exatamente 6 dígitos numéricos"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

function LoginComponent() {
  const navigate = useNavigate();
  const { login, setRole } = useLinus();

  // Gerenciamento de Estado da Tela (Máquina de Estados)
  const [etapa, setEtapa] = useState<"login" | "2fa">("login");
  const [emailPendente, setEmailPendente] = useState<string>("");

  // Formulário 1: Credenciais
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Formulário 2: OTP (2FA)
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors, isSubmitting: isOtpSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  // Função utilitária para centralizar o sucesso do Login/2FA
  const finalizarLoginComSucesso = (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    if (refresh) localStorage.setItem("refresh_token", refresh);

    const decoded = jwtDecode<{ role: string; nome?: string }>(access);
    setRole((decoded.role as Role) || "estudante");
    login(decoded.nome || "Usuário");

    toast.success("Acesso liberado com sucesso!");
    window.location.href = "/painel"; // Redirecionamento hard para reidratar o Contexto
  };

  // Submissão do Login Manual
  const onLogin = async (data: LoginFormValues) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const result = await response.json();

      if (response.status === 202 && result.status === "2fa_required") {
        setEmailPendente(data.email);
        setEtapa("2fa");
        toast.info("Código de segurança enviado para o seu e-mail.");
        return;
      }

      if (!response.ok) throw new Error(result.error || result.detail || "Credenciais inválidas.");

      finalizarLoginComSucesso(result.access, result.refresh);
    } catch (error: any) {
      toast.error(error.message || "Falha na comunicação com o servidor.");
    }
  };

  // Tratamento do Login via Google (OAuth)
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

      // Interceptação de Conta Inexistente (Vai para Registro)
      if (response.status === 403 && result.status === "registration_required") {
        toast.warning("Conta não encontrada. Por favor, conclua seu cadastro primeiro.");
        navigate({ to: "/registro" });
        return;
      }

      // Interceptação de 2FA no fluxo do Google
      if (response.status === 202 && result.status === "2fa_required") {
        // Extrai o e-mail do payload do token do Google para usar na rota de Verify
        const decodedGoogle = jwtDecode<{ email: string }>(idToken);
        setEmailPendente(decodedGoogle.email);
        setEtapa("2fa");
        toast.info("Código de segurança enviado para o e-mail associado à sua conta Google.");
        return;
      }

      if (!response.ok) throw new Error(result.error || "Falha na autenticação com o Google.");

      finalizarLoginComSucesso(result.access, result.refresh);
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar o login com o Google.");
    }
  };

  // Submissão do Código OTP
  const onVerify2FA = async (data: OtpFormValues) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/verify-2fa/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailPendente, otp: data.otp }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Código inválido ou expirado.");

      finalizarLoginComSucesso(result.access, result.refresh);
    } catch (error: any) {
      toast.error(error.message || "Falha ao verificar código de segurança.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-lg">
        {/* CABEÇALHO DINÂMICO */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {etapa === "login" ? (
              <Music className="h-6 w-6" />
            ) : (
              <ShieldAlert className="h-6 w-6" />
            )}
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
            {etapa === "login" ? "Acesse sua conta" : "Autenticação em Duas Etapas"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {etapa === "login"
              ? "Continue sua jornada musical no Linus"
              : `Enviamos um código de 6 dígitos para o e-mail ${emailPendente.replace(/(.{2})(.*)(?=@)/, "$1***")}`}
          </p>
        </div>

        {/* FLUXO 1: LOGIN PADRÃO */}
        {etapa === "login" && (
          <>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Falha ao abrir pop-up do Google")}
                useOneTap={false}
              />
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border"></div>
              <span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">
                ou faça login manual
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  E-mail
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    {...registerLogin("email")}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="seu@email.com"
                  />
                </div>
                {loginErrors.email && (
                  <p className="mt-1 text-xs text-destructive">{loginErrors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Senha
                  </label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    {...registerLogin("password")}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
                {loginErrors.password && (
                  <p className="mt-1 text-xs text-destructive">{loginErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoginSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoginSubmitting ? (
                  "Autenticando..."
                ) : (
                  <>
                    <LogIn className="h-4 w-4" /> Entrar
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Ainda não tem uma conta?{" "}
              <Link to="/registro" className="font-medium text-primary hover:underline">
                Cadastre-se grátis
              </Link>
            </div>
          </>
        )}

        {/* FLUXO 2: VALIDAÇÃO OTP 2FA */}
        {etapa === "2fa" && (
          <form onSubmit={handleOtpSubmit(onVerify2FA)} className="space-y-6">
            <div>
              <label className="block text-center text-xs font-semibold uppercase text-muted-foreground">
                Código de Segurança
              </label>
              <div className="relative mt-2 flex justify-center">
                <KeyRound className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  maxLength={6}
                  autoComplete="one-time-code"
                  {...registerOtp("otp")}
                  className="w-full rounded-lg border border-input bg-background py-3 pl-12 pr-4 text-center text-xl font-bold tracking-[0.5em] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="000000"
                />
              </div>
              {otpErrors.otp && (
                <p className="mt-2 text-center text-xs text-destructive">{otpErrors.otp.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isOtpSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isOtpSubmitting ? "Verificando..." : "Validar Código"}
              </button>

              <button
                type="button"
                onClick={() => setEtapa("login")}
                className="w-full rounded-lg border border-input bg-background py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                Voltar para o Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
