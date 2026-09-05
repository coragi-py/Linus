import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinusLogo } from "@/components/Logo";
import { useLinus } from "@/context/LinusContext";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Criar conta — Linus" },
      {
        name: "description",
        content:
          "Crie sua conta no Linus para salvar seu nível da triagem, sua ofensiva diária e o progresso na trilha de teoria musical.",
      },
      { property: "og:title", content: "Criar conta — Linus" },
      {
        property: "og:description",
        content: "Salve seu nível e seu progresso na trilha de teoria musical do Linus.",
      },
    ],
  }),
  component: Registro,
});

function Registro() {
  const { login, state } = useLinus();
  const navigate = useNavigate();
  const [name, setName] = useState(state.name);
  const [email, setEmail] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    login(name);
    navigate({ to: "/trilha" });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="neu p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="text-primary">
            <LinusLogo size={56} />
          </span>
          <h1 className="mt-2 font-display text-2xl">Criar conta no Linus</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {state.placementDone
              ? `Seu nível ${state.placement} e seu progresso serão salvos na sua conta.`
              : "Salve seu progresso, sua ofensiva e seu nível na trilha."}
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como quer ser chamado?"
              className="rounded-md"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              className="rounded-md"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              className="rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="focus-ring mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-success py-3.5 font-display text-lg text-success-foreground shadow-neu-sm active:translate-y-0.5"
          >
            <UserPlus className="size-5" aria-hidden /> Criar conta
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Ainda não fez a triagem?{" "}
          <Link to="/triagem" className="focus-ring font-bold text-primary underline">
            Descobrir meu nível
          </Link>
        </p>
      </div>
    </div>
  );
}
