import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import {
  Lock,
  Mail,
  Music,
  LogIn,
  ShieldAlert,
  KeyRound,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useLinus, type Role } from "@/context/LinusContext";
import { VERSAO_TERMOS_USO } from "@/lib/constants";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "O código de segurança deve ter exatamente 6 dígitos"),
});

const esqueciSenhaSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;
type EsqueciSenhaFormValues = z.infer<typeof esqueciSenhaSchema>;

function LoginComponent() {
  const navigate = useNavigate();
  const { login, setRole } = useLinus();

  // Estados
  const [etapa, setEtapa] = useState<"login" | "2fa" | "esqueci_senha" | "termos">("login");

  // Memória temporária para Reativação/2FA
  const [loginTemporario, setLoginTemporario] = useState<{
    email?: string;
    password?: string;
    googleToken?: string;
  } | null>(null);

  // Controles LGPD
  const [termosLidos, setTermosLidos] = useState(false);
  const [aceiteTermos, setAceiteTermos] = useState(false);
  const [isTermosSubmitting, setIsTermosSubmitting] = useState(false);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors, isSubmitting: isOtpSubmitting },
  } = useForm<OtpFormValues>({ resolver: zodResolver(otpSchema) });
  const {
    register: registerEsqueciSenha,
    handleSubmit: handleEsqueciSenhaSubmit,
    reset: resetEsqueciSenha,
    formState: { errors: esqueciSenhaErrors, isSubmitting: isEsqueciSenhaSubmitting },
  } = useForm<EsqueciSenhaFormValues>({ resolver: zodResolver(esqueciSenhaSchema) });

  const finalizarLoginComSucesso = (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    if (refresh) localStorage.setItem("refresh_token", refresh);

    const decoded = jwtDecode<{ role: string; nome?: string }>(access);
    setRole((decoded.role as Role) || "estudante");
    login(decoded.nome || "Usuário");

    toast.success("Acesso liberado com sucesso!");
    window.location.href = "/painel";
  };

  const handleLerTermos = () => {
    setTermosLidos(true);
    toast.info("Termos de Uso visualizados. O aceite foi desbloqueado.");
  };

  const onLogin = async (data: LoginFormValues) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          terms_accepted: false,
          terms_version: "",
        }),
      });
      const result = await response.json();

      // Interceptação 1: LGPD Revogado
      if (response.status === 403 && result.status === "terms_required") {
        setLoginTemporario({ email: data.email, password: data.password });
        setEtapa("termos");
        toast.warning("Sua conta está suspensa devido à revogação dos termos.");
        return;
      }

      // Interceptação 2: 2FA Ativo
      if (response.status === 202 && result.status === "2fa_required") {
        setLoginTemporario({ email: data.email });
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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken, terms_accepted: false, terms_version: "" }),
      });
      const result = await response.json();

      if (response.status === 403 && result.status === "registration_required") {
        navigate({ to: "/registro" });
        return;
      }

      if (response.status === 403 && result.status === "terms_required") {
        setLoginTemporario({ googleToken: idToken });
        setEtapa("termos");
        toast.warning("Sua conta está suspensa devido à revogação dos termos.");
        return;
      }

      if (response.status === 202 && result.status === "2fa_required") {
        const decodedGoogle = jwtDecode<{ email: string }>(idToken);
        setLoginTemporario({ email: decodedGoogle.email });
        setEtapa("2fa");
        toast.info("Código de segurança enviado para o e-mail Google.");
        return;
      }

      if (!response.ok) throw new Error(result.error || "Falha na autenticação com o Google.");
      finalizarLoginComSucesso(result.access, result.refresh);
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar o login com o Google.");
    }
  };

  const onReaceitarTermos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termosLidos || !aceiteTermos) {
      toast.error("Você deve ler e concordar com os Termos de Uso.");
      return;
    }
    setIsTermosSubmitting(true);
    try {
      let response;
      if (loginTemporario?.googleToken) {
        response = await fetch("http://localhost:8000/api/v1/auth/google/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_token: loginTemporario.googleToken,
            terms_accepted: true,
            terms_version: VERSAO_TERMOS_USO,
          }),
        });
      } else {
        response = await fetch("http://localhost:8000/api/v1/auth/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginTemporario?.email,
            password: loginTemporario?.password,
            terms_accepted: true,
            terms_version: VERSAO_TERMOS_USO,
          }),
        });
      }

      const result = await response.json();

      // Se tiver 2FA, redireciona para a tela após aceitar os termos
      if (response.status === 202 && result.status === "2fa_required") {
        setEtapa("2fa");
        toast.info("Código de segurança enviado para o seu e-mail.");
        return;
      }

      if (!response.ok) throw new Error(result.error || "Erro ao reativar conta.");
      finalizarLoginComSucesso(result.access, result.refresh);
    } catch (error: any) {
      toast.error(error.message || "Falha ao reativar acesso.");
    } finally {
      setIsTermosSubmitting(false);
    }
  };

  const onVerify2FA = async (data: OtpFormValues) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/verify-2fa/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginTemporario?.email, otp: data.otp }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Código inválido ou expirado.");
      finalizarLoginComSucesso(result.access, result.refresh);
    } catch (error: any) {
      toast.error(error.message || "Falha ao verificar código de segurança.");
    }
  };

  const onEsqueciSenha = async (data: EsqueciSenhaFormValues) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || result.detail || "Erro ao solicitar recuperação.");
      toast.success(result.message || "Link enviado com sucesso.");
      setEtapa("login");
      resetEsqueciSenha();
    } catch (error: any) {
      toast.error(error.message || "Falha na comunicação com o servidor.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {etapa === "login" && <Music className="h-6 w-6" />}
            {etapa === "2fa" && <ShieldAlert className="h-6 w-6" />}
            {etapa === "esqueci_senha" && <KeyRound className="h-6 w-6" />}
            {etapa === "termos" && <ShieldCheck className="h-6 w-6" />}
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
            {etapa === "login" && "Acesse sua conta"}
            {etapa === "2fa" && "Autenticação em Duas Etapas"}
            {etapa === "esqueci_senha" && "Recuperar Senha"}
            {etapa === "termos" && "Conta Suspensa (LGPD)"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {etapa === "login" && "Continue sua jornada musical no Linus"}
            {etapa === "2fa" && `Enviamos um código de 6 dígitos para o e-mail associado.`}
            {etapa === "esqueci_senha" && "Digite seu e-mail para receber instruções."}
            {etapa === "termos" &&
              "Como você revogou o consentimento anteriormente, precisamos que você concorde com os Termos de Uso novamente para restaurar seu acesso."}
          </p>
        </div>

        {/* FLUXO 1: LOGIN */}
        {etapa === "login" && (
          <>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Falha")}
                useOneTap={false}
              />
            </div>
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border"></div>
              <span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">
                ou login manual
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
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-primary"
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
                  <button
                    type="button"
                    onClick={() => setEtapa("esqueci_senha")}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    {...registerLogin("password")}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-primary"
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
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
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

        {/* FLUXO 4: REACEITE DE TERMOS (LGPD) */}
        {etapa === "termos" && (
          <form onSubmit={onReaceitarTermos} className="space-y-6">
            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  Para restaurar seu acesso, leia nossos{" "}
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
                  checked={aceiteTermos}
                  onChange={(e) => setAceiteTermos(e.target.checked)}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary disabled:opacity-50 cursor-pointer"
                />
                <label
                  htmlFor="aceiteTermos"
                  className={`text-xs ${!termosLidos ? "text-muted-foreground/50 cursor-not-allowed" : "text-foreground cursor-pointer"}`}
                >
                  Li e concordo novamente com os Termos de Uso (LGPD)
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isTermosSubmitting || !aceiteTermos}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isTermosSubmitting ? "Processando..." : "Reativar Minha Conta"}
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
                  className="w-full rounded-lg border border-input bg-background py-3 pl-12 pr-4 text-center text-xl font-bold tracking-[0.5em] text-foreground focus:ring-2 focus:ring-primary"
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
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* FLUXO 3: ESQUECI A SENHA */}
        {etapa === "esqueci_senha" && (
          <form onSubmit={handleEsqueciSenhaSubmit(onEsqueciSenha)} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                E-mail cadastrado
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  {...registerEsqueciSenha("email")}
                  className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-primary"
                  placeholder="seu@email.com"
                />
              </div>
              {esqueciSenhaErrors.email && (
                <p className="mt-1 text-xs text-destructive">{esqueciSenhaErrors.email.message}</p>
              )}
            </div>
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isEsqueciSenhaSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isEsqueciSenhaSubmitting ? "Processando..." : "Enviar link de recuperação"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEtapa("login");
                  resetEsqueciSenha();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar para o Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
