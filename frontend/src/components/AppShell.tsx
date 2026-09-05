import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Flame, LogOut, Sparkles, LogIn } from "lucide-react";
import { LinusLogo } from "./Logo";
import { AuthModal } from "./AuthModal";
import { AiAssistant } from "./AiAssistant";
import { useLinus, ROLE_LABEL, type Role } from "@/context/LinusContext";
import { cn } from "@/lib/utils";

const NAV: { to: string; label: string; roles: Role[] }[] = [
  { to: "/trilha", label: "Trilha", roles: ["estudante"] },
  { to: "/pratica", label: "Prática Livre", roles: ["estudante"] },
  { to: "/glossario", label: "Glossário", roles: ["estudante", "conteudo", "sistema"] },
  { to: "/painel", label: "Meu Painel", roles: ["estudante"] },
  { to: "/admin/conteudo", label: "Conteúdo", roles: ["conteudo"] },
  { to: "/admin/sistema", label: "Sistema", roles: ["sistema"] },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { state, logout } = useLinus();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "registro">("login");
  const [aiOpen, setAiOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLesson = pathname.startsWith("/licao");
  const isPublicHome =
    !state.loggedIn && (pathname === "/" || pathname === "/triagem" || pathname === "/registro");

  if (isLesson) return <>{children}</>;

  if (isPublicHome) {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl justify-end gap-2 px-4 py-3">
            <button
              type="button"
              onClick={() => { setAuthMode("login"); setAuthOpen(true); }}
              className="focus-ring rounded-md border border-primary px-4 py-2 text-sm font-bold text-primary"
            >
              Login
            </button>
            <Link
              to="/registro"
              className="focus-ring rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-neu-sm"
            >
              Criar conta
            </Link>
          </div>
        </header>
        <main>{children}</main>
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} initialMode={authMode} />
      </div>
    );
  }

  const items = NAV.filter((n) => n.roles.includes(state.role));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="focus-ring flex items-center gap-2 rounded-lg">
            <span className="text-primary">
              <LinusLogo size={38} />
            </span>
            <span className="font-display text-2xl leading-none text-primary">Linus</span>
          </Link>

          <nav aria-label="Navegação principal" className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto sm:ml-4">
            {items.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="focus-ring whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted"
                activeProps={{ className: "bg-primary-soft text-primary" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {state.role === "estudante" && state.loggedIn && (
              <div className="mr-2 hidden items-center gap-3 sm:flex">
                <span className="neu-sm flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold" title="Ofensiva diária">
                  <Flame className="size-3.5 text-gold" aria-hidden />
                  {state.streak}
                </span>
              </div>
            )}
            
            <button
              type="button"
              onClick={() => setAiOpen(true)}
              className="focus-ring flex items-center gap-1.5 rounded-lg bg-gold px-3 py-2 text-sm font-bold text-gold-foreground shadow-neu-sm active:translate-y-0.5"
            >
              <Sparkles className="size-4" aria-hidden />
              <span className="hidden sm:inline">Assistente</span>
            </button>

            {state.loggedIn ? (
              <div className="flex items-center gap-1 ml-1">
                <div className="hidden flex-col items-end mr-2 md:flex">
                   <span className="text-[10px] font-bold uppercase text-primary/70">{ROLE_LABEL[state.role]}</span>
                   <span className="text-xs font-bold leading-tight">{state.name.split(' ')[0]}</span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="focus-ring flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-bold text-muted-foreground hover:bg-muted"
                  title="Sair"
                >
                  <LogOut className="size-4" aria-hidden />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setAuthOpen(true); }}
                className="focus-ring flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground shadow-neu-sm active:translate-y-0.5"
              >
                <LogIn className="size-4" aria-hidden />
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 border-t border-border py-8 text-center text-xs text-muted-foreground">
        Linus — teoria musical para todas as idades.
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} initialMode={authMode} />
      <AiAssistant open={aiOpen} onOpenChange={setAiOpen} />
    </div>
  );
}

export function SectionTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="mb-1 text-sm font-bold uppercase tracking-wide text-primary">{eyebrow}</p>}
      <h1 className={cn("font-display text-3xl sm:text-4xl")}>{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
    </div>
  );
}
