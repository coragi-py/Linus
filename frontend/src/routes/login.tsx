import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Lock, Mail, Music, LogIn } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

// Validação simples e direta para a entrada de dados
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginComponent() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Submissão do Login Manual (JWT)
  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Ajuste o endpoint conforme as URLs do seu backend Django (geralmente gerado pelo SimpleJWT ou Djoser)
      const response = await fetch("http://localhost:8000/api/v1/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Credenciais inválidas. Tente novamente.");
      }

      const result = await response.json();

      // Armazenamento seguro do token no client-side
      localStorage.setItem("access_token", result.access);
      if (result.refresh) {
        localStorage.setItem("refresh_token", result.refresh);
      }

      toast.success("Bem-vindo de volta ao Linus!");
      navigate({ to: "/painel" });
    } catch (error: any) {
      toast.error(error.message || "Falha na comunicação com o servidor.");
    }
  };

  // Tratamento do Google OAuth na tela de Login
  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_token: idToken,
          terms_accepted: false, // Força a passagem no Serializer para cair na regra do 403
          terms_version: "",
        }),
      });

      if (response.status === 403) {
        const errData = await response.json();
        if (errData.status === "registration_required") {
          toast.warning("Conta não encontrada. Por favor, conclua seu cadastro primeiro.");
          navigate({ to: "/registro" });
          return;
        }
      }

      if (!response.ok) throw new Error("Falha na autenticação com o Google.");

      const result = await response.json();
      localStorage.setItem("access_token", result.access);

      toast.success("Login efetuado com sucesso!");
      navigate({ to: "/painel" });
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar o login com o Google.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Music className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground">Acesse sua conta</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Continue sua jornada musical no Linus
          </p>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Falha ao abrir pop-up do Google")}
            useOneTap={false}
          />
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-xs uppercase text-muted-foreground">
            ou faça login manual
          </span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                {...register("password")}
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? (
              "Autenticando..."
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Ainda não tem uma conta?{" "}
          <Link to="/registro" className="font-medium text-primary hover:underline">
            Crie sua conta!
          </Link>
        </div>
      </div>
    </div>
  );
}
