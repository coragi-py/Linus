import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Lock, Mail, User, Calendar, ShieldCheck, Music } from "lucide-react";

export const Route = createFileRoute("/registro")({
  component: RegistroComponent,
});

// Validação com Zod conforme as regras de negócio da LGPD e PFC
const currentYear = new Date().getFullYear();
const minBirthYear = currentYear - 12;

// Blacklist de nomes impróprios
const blacklistNicknames = [
  "admin",
  "administrador",
  "root",
  "suporte",
  "linus",
  "sistema",
  "palavrao1",
  "palavrao2",
];

// Função de validação customizada
const validarNomeApropriado = (nome: string) => {
  const nomeLower = nome.toLowerCase().trim();
  return !blacklistNicknames.some((palavra) => nomeLower.includes(palavra));
};

// Regras comuns exigidas pela LGPD em ambos os fluxos
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
    message: "Você deve aceitar os Termos de Uso e Política de Privacidade",
  }),
};

// Schema para o cadastro manual (Exige email e senha)
const manualSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  ...regrasBase,
});

// Schema para o fluxo Google (Torna email e senha opcionais, mas EXIGE o nome)
const googleSchema = z.object({
  email: z.string().optional(),
  senha: z.string().optional(),
  ...regrasBase,
});

type RegistroFormValues = z.infer<typeof manualSchema>;

function RegistroComponent() {
  const navigate = useNavigate();
  const [termosLidos, setTermosLidos] = useState(false);
  const [fluxoGooglePendente, setFluxoGooglePendente] = useState(false);
  const [googleIdTokenTemp, setGoogleIdTokenTemp] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistroFormValues>({
    // Alterna o schema dinamicamente com base no fluxo atual
    resolver: zodResolver(fluxoGooglePendente ? googleSchema : manualSchema),
    defaultValues: {
      aceiteTermos: false,
    },
  });

  // Handler para liberação do checkbox dos Termos de Uso (Art. 8º LGPD)
  const handleLerTermos = (e: React.MouseEvent) => {
    e.preventDefault();
    setTermosLidos(true);
    toast.info("Termos de Uso visualizados. O aceite foi desbloqueado.");
  };

  // Tratamento do Google OAuth com Fluxo Invertido
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

      if (response.status === 403) {
        const errData = await response.json();
        if (errData.status === "registration_required") {
          // FLUXO INVERTIDO: Retém o token e pede o resto dos dados
          setGoogleIdTokenTemp(idToken);
          setFluxoGooglePendente(true);
          toast.warning(
            "Complete as informações de LGPD para finalizar seu cadastro com o Google.",
          );
          return;
        }
      }

      if (!response.ok) throw new Error("Erro na autenticação com Google.");

      const result = await response.json();
      localStorage.setItem("access_token", result.access);
      toast.success("Login com Google efetuado com sucesso!");
      navigate({ to: "/painel" });
    } catch (error: any) {
      toast.error(error.message || "Erro no processo do Google OAuth.");
    }
  };

  // Submissão do Formulário (Manual ou Conclusão do Google)
  const onSubmit = async (data: RegistroFormValues) => {
    try {
      if (fluxoGooglePendente && googleIdTokenTemp) {
        // Rota de criação via Google OAuth
        const payloadGoogle = {
          id_token: googleIdTokenTemp,
          name: data.nome,
          ano_nascimento: data.anoNascimento,
          terms_accepted: data.aceiteTermos,
          terms_version: "1.0",
        };

        const response = await fetch("http://localhost:8000/api/v1/auth/google/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadGoogle),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Erro ao finalizar cadastro com Google.");
        }

        const result = await response.json();
        localStorage.setItem("access_token", result.access); // O GoogleAuthView já retorna o JWT
        toast.success("Cadastro via Google realizado com sucesso!");
        navigate({ to: "/painel" });
      } else {
        // Rota de criação Manual
        const payload = {
          nome: data.nome,
          email: data.email,
          password: data.senha,
          ano_nascimento: data.anoNascimento,
          terms_accepted: data.aceiteTermos,
          terms_version: "1.0",
        };

        const response = await fetch("http://localhost:8000/api/v1/auth/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          let errorMessage = "Erro ao realizar cadastro.";
          try {
            // Tenta ler como JSON (funciona em 400 Bad Request)
            const errData = await response.json();
            errorMessage = errData.detail || errData.error || errData.email?.[0] || errorMessage;
          } catch {
            // Se quebrar ao ler (HTML 500 ou 404), cai aqui
            errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
          }
          throw new Error(errorMessage);
        }

        toast.success("Cadastro realizado com sucesso! Bem-vindo ao Linus.");
        navigate({ to: "/painel" });
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
            <strong>Quase lá!</strong> Identificamos sua conta Google, mas precisamos do seu ano de
            nascimento e do aceite dos Termos (exigência LGPD).
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground">
              Nome Completo
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
                    type="password"
                    {...register("senha")}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
                {errors.senha && (
                  <p className="mt-1 text-xs text-destructive">{errors.senha.message}</p>
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
