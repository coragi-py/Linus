import { useState, useEffect, useMemo, type ReactNode } from "react";
import { createAvatar } from "@dicebear/core";
import { bottts, avataaars } from "@dicebear/collection";
import { Link, useRouterState, Navigate } from "@tanstack/react-router";
import { Flame, LogOut, Sparkles, Settings } from "lucide-react";
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

const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:8000").replace(
  /\/+$/,
  "",
)}/api/v1`;

const COOKIE_CONSENT_KEY = "linus.cookie_consent";

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

export function getHomeByRole(role?: string): string {
  if (role === "admin-conteudo" || role === "conteudo") return "/admin/conteudo";
  if (role === "admin-sistema" || role === "sistema") return "/admin/sistema";
  return "/painel";
}

export function CookieConsentBanner() {
  const [accepted, setAccepted] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
  });

  if (accepted) return null;

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setAccepted(true);
  };

  return (
    <div
      role="region"
      aria-label="Aviso de Cookies e Privacidade"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-md sm:p-5"
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1 text-xs leading-relaxed text-muted-foreground">
          <p className="font-display text-sm font-bold text-foreground">
            Transparência sobre Cookies e Armazenamento Local (LGPD)
          </p>
          <p>
            O <strong>Linus</strong> não utiliza cookies de publicidade ou rastreamento comercial.
            Utilizamos apenas <strong>cookies técnicos estritamente necessários</strong> (como na
            autenticação federada Google OAuth 2.0) e armazenamento local (<code>localStorage</code>
            ) para manter sua sessão segura e seu progresso pedagógico. Consulte nossa{" "}
            <Link
              to="/termos"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary underline hover:opacity-80"
            >
              Política de Privacidade e Termos de Uso
            </Link>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={handleAccept}
          className="focus-ring shrink-0 rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-neu-sm transition-transform active:translate-y-0.5"
        >
          Concordar e Continuar
        </button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { state, ready, logout } = useLinus();
  const [aiOpen, setAiOpen] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState<any>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!state.loggedIn) return;

      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const response = await fetch(`${API_URL}/auth/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.avatar_options && Object.keys(data.avatar_options).length > 0) {
            setAvatarOptions(data.avatar_options);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar avatar", error);
      }
    };
    void fetchAvatar();
  }, [state.loggedIn]);

  const avatarUri = useMemo(() => {
    try {
      const options = avatarOptions || { seed: state.name || "linus", collection: "bottts" };
      const selectedCollection = options.collection === "avataaars" ? avataaars : bottts;

      const avatar = createAvatar(selectedCollection, {
        ...options,
        accessories: options.accessories?.[0] === "none" ? [] : options.accessories,
        accessoriesProbability: options.accessories?.[0] === "none" ? 0 : 100,
        size: 48,
        radius: 50,
        backgroundColor: ["e2e8f0"],
      } as any);

      return avatar.toDataUri();
    } catch (error) {
      console.error("Erro ao gerar avatar no Header:", error);
      const fallbackAvatar = createAvatar(bottts, {
        seed: "erro",
        size: 32,
        backgroundColor: ["e2e8f0"],
      });
      return fallbackAvatar.toDataUri();
    }
  }, [avatarOptions, state.name]);

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!ready) {
    return <div className="min-h-screen bg-background" />;
  }

  const publicRoutes = ["/", "/triagem", "/registro", "/login", "/recuperar-senha", "/termos"];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!state.loggedIn && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = state.role || "usuario";
  const homeRoute = getHomeByRole(currentRole);

  if (state.loggedIn) {
    if (pathname === "/" || pathname === "/login" || pathname === "/registro") {
      return <Navigate to={homeRoute} replace />;
    }

    if (
      pathname === "/painel" &&
      ["admin-conteudo", "conteudo", "admin-sistema", "sistema"].includes(currentRole)
    ) {
      return <Navigate to={homeRoute} replace />;
    }

    if (
      pathname.startsWith("/admin/conteudo") &&
      !["admin-conteudo", "conteudo"].includes(currentRole)
    ) {
      return <Navigate to={homeRoute} replace />;
    }

    if (
      pathname.startsWith("/admin/sistema") &&
      !["admin-sistema", "sistema"].includes(currentRole)
    ) {
      return <Navigate to={homeRoute} replace />;
    }
  }

  const isLesson = pathname.startsWith("/licao");

  if (isLesson) return <>{children}</>;

  // Estrutura deslogada (Landing page, Triagem, Termos, Login, Registro)
  if (!state.loggedIn && isPublicRoute) {
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
        <CookieConsentBanner />
      </div>
    );
  }

  // Estrutura logada
  const items = NAV.filter((n) => n.roles.includes(currentRole));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to={homeRoute} className="focus-ring flex items-center gap-2 rounded-lg">
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
            {(currentRole === "estudante" || currentRole === "usuario") && (
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

            <div className="flex items-center gap-1 ml-1">
              <DropdownMenu>
                <DropdownMenuTrigger className="focus-ring flex items-center gap-2 rounded-lg p-1.5 outline-none transition-colors hover:bg-muted">
                  <div className="hidden flex-col items-end md:flex">
                    <span className="text-[10px] font-bold uppercase text-primary/70">
                      {currentRole === "usuario"
                        ? "ALUNO"
                        : ROLE_LABEL?.[currentRole] || currentRole.replace("-", " ")}
                    </span>
                    <span className="text-xs font-bold leading-tight truncate max-w-[120px]">
                      {state.name ? state.name.split(" ")[0] : "Usuário"}
                    </span>
                  </div>
                  <img
                    src={avatarUri}
                    alt="Avatar"
                    className="size-12 sm:size-14 rounded-full border border-primary/20 bg-background shadow-sm"
                  />
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
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 border-t border-border py-8 text-center text-xs text-muted-foreground">
        Linus — teoria musical para todas as idades.
      </footer>

      <AiAssistant open={aiOpen} onOpenChange={setAiOpen} />
      <CookieConsentBanner />
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
