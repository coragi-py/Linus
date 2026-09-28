import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, ShieldAlert, KeyRound } from "lucide-react";

// 1. Definição estrita dos parâmetros esperados na URL
const searchSchema = z.object({
  token: z.string().catch(""),
  email: z.string().catch(""),
});

export const Route = createFileRoute("/recuperar-senha")({
  validateSearch: searchSchema,
  component: RecuperarSenhaComponent,
});

// 2. Schema de validação com as mesmas regras de alta segurança do cadastro
const novaSenhaSchema = z
  .object({
    novaSenha: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(/[\W_]/, "A senha deve conter pelo menos um caractere especial"),
    confirmaSenha: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.novaSenha === data.confirmaSenha, {
    message: "As senhas não coincidem",
    path: ["confirmaSenha"],
  });

type NovaSenhaFormValues = z.infer<typeof novaSenhaSchema>;

function RecuperarSenhaComponent() {
  const { token, email } = Route.useSearch();
  const navigate = useNavigate();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NovaSenhaFormValues>({
    resolver: zodResolver(novaSenhaSchema),
    mode: "onChange", // Validação em tempo real
  });

  // Tela de bloqueio caso o usuário acesse a rota sem os parâmetros do e-mail
  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-lg text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
            Link de Segurança Inválido
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Este link de recuperação está incompleto ou inválido. Por favor, solicite a redefinição
            de senha novamente.
          </p>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    );
  }

  // Envio da nova senha e dos parâmetros extraídos da URL para o Backend
  const onSubmit = async (data: NovaSenhaFormValues) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/password-reset/confirm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          token: token,
          new_password: data.novaSenha,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.detail || "Erro ao redefinir a senha.");
      }

      toast.success("Senha redefinida com sucesso! Faça login para continuar.");
      navigate({ to: "/login" });
    } catch (error: any) {
      toast.error(error.message || "Falha na comunicação com o servidor.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
            Definir Nova Senha
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie uma nova senha forte para a conta associada a <br />
            <strong className="text-foreground">{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground">
              Nova Senha
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type={mostrarSenha ? "text" : "password"}
                {...register("novaSenha")}
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
            {errors.novaSenha && (
              <p className="mt-1 text-xs text-destructive">{errors.novaSenha.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground">
              Confirmar Nova Senha
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary py-2.5 mt-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Redefinindo..." : "Salvar Nova Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
