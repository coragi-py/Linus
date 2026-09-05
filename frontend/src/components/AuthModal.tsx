import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinusLogo } from "./Logo";
import { useLinus } from "@/context/LinusContext";
import { cn } from "@/lib/utils";

export function AuthModal({
  open,
  onOpenChange,
  initialMode = "login",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialMode?: "login" | "registro";
}) {
  const { login, state } = useLinus();
  const [mode, setMode] = useState<"login" | "registro">(initialMode);
  const [name, setName] = useState(state.name);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (open) {
      setMode(initialMode);
    }
  }, [initialMode, open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    login(name);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-lg border-none bg-card p-0 shadow-neu">
        <div className="p-6 sm:p-8">
          <DialogHeader className="items-center text-center">
            <span className="text-primary">
              <LinusLogo size={56} />
            </span>
            <DialogTitle className="font-display text-2xl">
              {mode === "login" ? "Entrar no Linus" : "Criar conta no Linus"}
            </DialogTitle>
            <DialogDescription>
              Use seu e-mail e senha para acessar a plataforma.
            </DialogDescription>
          </DialogHeader>

          <div className="neu-inset mt-5 flex gap-1 p-1" role="tablist" aria-label="Modo de acesso">
            {(["login", "registro"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  "focus-ring flex-1 rounded-md py-2 text-sm font-bold capitalize transition-colors",
                  mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {m === "login" ? "Entrar" : "Registrar"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-5 space-y-4">
            {mode === "registro" && (
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
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" className="rounded-md" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" placeholder="••••••••" className="rounded-md" required />
            </div>
            <button
              type="submit"
              className="focus-ring mt-2 w-full rounded-lg bg-success py-3.5 font-display text-lg text-success-foreground shadow-neu-sm transition-transform active:translate-y-0.5"
            >
              {mode === "login" ? "Entrar" : "Começar agora"}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
