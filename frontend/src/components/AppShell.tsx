import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Flame, LogOut, Sparkles, LogIn, UserCircle, Settings } from "lucide-react";
import { LinusLogo } from "./Logo";
import { AiAssistant } from "./AiAssistant";
import { useLinus, ROLE_LABEL } from "@/context/LinusContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mapeamento RBAC espelhando os perfis do backend (Django: 'usuario', 'admin-conteudo', 'admin-sistema')
const NAV: { to: string; label: string; roles: string[] }[] = [
  { to: "/trilha", label: "Trilha", roles: ["estudante", "usuario"] },
  { to: "/pratica", label: "Prática Livre", roles: ["estudante", "usuario"] },
  {
    to: "/glossario",
    label: "Glossário",
    roles: ["estudante", "usuario", "admin-conteudo", "admin-sistema", "conteudo", "sistema"],
  },
  { to: "/painel", label: "Meu Painel", roles: ["estudante", "usuario"] },
  { to: "/admin/conteudo", label: "Conteúdo", roles: ["admin-conteudo", "conteudo"] },
  { to: "/admin/sistema", label: "Sistema", roles: ["admin-sistema", "sistema"] },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { state, logout } = useLinus();
  const [aiOpen, setAiOpen] = useState(false);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLesson = pathname.startsWith("/licao");

  // Identifica rotas públicas/deslogadas para renderizar o header limpo
  const isPublicHome =
    !state.loggedIn &&
    (pathname === "/" ||
      pathname === "/triagem" ||
      pathname === "/registro" ||
      pathname === "/login" ||
      pathname === "/termos");

  if (isLesson) return <>{children}</>;

  if (isPublicHome) {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link to="/" className="focus-ring flex items-center gap-2 rounded-lg">
              <span className="text-primary">
                <LinusLogo size={32} />
              </span>
              <span className="font-display text-xl font-bold text-primary hidden sm:inline">
                Linus
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="focus-ring rounded-md border border-primary px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
              >
                Login
              </Link>
              <Link
                to="/registro"
                className="focus-ring rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-neu-sm transition-transform active:translate-y-0.5"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    );
  }

  // Prevenção de erro caso a role ainda esteja nula na hidratação
  const currentRole = state.role || "usuario";
  const items = NAV.filter((n) => n.roles.includes(currentRole));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link
            to={state.loggedIn ? "/painel" : "/"}
            className="focus-ring flex items-center gap-2 rounded-lg"
          >
            <span className="text-primary">
              <LinusLogo size={38} />
            </span>
            <span className="font-display text-2xl leading-none text-primary">Linus</span>
          </Link>

          <nav
            aria-label="Navegação principal"
            className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto sm:ml-4"
          >
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
            {(currentRole === "estudante" || currentRole === "usuario") && state.loggedIn && (
              <div className="mr-2 hidden items-center gap-3 sm:flex">
                <span
                  className="neu-sm flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold"
                  title="Ofensiva diária"
                >
                  <Flame className="size-3.5 text-gold" aria-hidden />
                  {state.streak || 0}
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
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus-ring flex items-center gap-2 rounded-lg p-1.5 outline-none transition-colors hover:bg-muted">
                    <div className="hidden flex-col items-end md:flex">
                      <span className="text-[10px] font-bold uppercase text-primary/70">
                        {/* Fallback amigável caso a ROLE_LABEL do Context ainda não tenha sido atualizada */}
                        {ROLE_LABEL?.[currentRole] || currentRole.replace("-", " ")}
                      </span>
                      <span className="text-xs font-bold leading-tight truncate max-w-[120px]">
                        {state.name ? state.name.split(" ")[0] : "Usuário"}
                      </span>
                    </div>
                    <UserCircle className="size-8 text-primary" strokeWidth={1.5} />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56 font-sans">
                    <DropdownMenuLabel className="font-bold">Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/perfil" className="flex cursor-pointer items-center gap-2 py-2">
                        <Settings className="size-4 text-muted-foreground" />
                        <span className="font-medium">Perfil e Privacidade</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex cursor-pointer items-center gap-2 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <LogOut className="size-4" />
                      <span className="font-bold">Sair do sistema</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link
                to="/login"
                className="focus-ring flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground shadow-neu-sm active:translate-y-0.5"
              >
                <LogIn className="size-4" aria-hidden />
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 border-t border-border py-8 text-center text-xs text-muted-foreground">
        Linus — teoria musical para todos.
      </footer>

      <AiAssistant open={aiOpen} onOpenChange={setAiOpen} />
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-1 text-sm font-bold uppercase tracking-wide text-primary">{eyebrow}</p>
      )}
      <h1 className={cn("font-display text-3xl sm:text-4xl")}>{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
    </div>
  );
}
