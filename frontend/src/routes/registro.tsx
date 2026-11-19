import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Lock, Mail, User, Calendar, ShieldCheck, Music, Eye, EyeOff } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useLinus, type Role } from "@/context/LinusContext";
import { blacklistNicknames } from "@/lib/blacklist";
import { VERSAO_TERMOS_USO } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/registro")({
  component: RegistroComponent,
});

const currentYear = new Date().getFullYear();
const minBirthYear = currentYear - 12;

const validarNomeApropriado = (nome: string) => {
  const nomeLower = nome.toLowerCase().trim();
  return !blacklistNicknames.some((palavra) => nomeLower.includes(palavra));
};

const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:8000").replace(
  /\/+$/,
  "",
)}/api/v1`;

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
    message: "Você deve aceitar os Termos de Uso",
  }),
};

const manualSchema = z
  .object({
    email: z.string().email("E-mail inválido"),
    senha: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(/[\W_]/, "A senha deve conter pelo menos um caractere especial"),
    confirmaSenha: z.string().min(1, "Confirme sua senha"),
    ...regrasBase,
  })
  .refine((data) => data.senha === data.confirmaSenha, {
    message: "As senhas não coincidem",
    path: ["confirmaSenha"],
  });

const googleSchema = z.object({
  email: z.string().optional(),
  senha: z.string().optional(),
  confirmaSenha: z.string().optional(),
  ...regrasBase,
});

type RegistroFormValues = z.infer<typeof manualSchema>;

function RegistroComponent() {
  const navigate = useNavigate();
  const { login, setRole } = useLinus();

  const [termosLidos, setTermosLidos] = useState(false);
  const [modalTermosAberto, setModalTermosAberto] = useState(false);
  const [fluxoGooglePendente, setFluxoGooglePendente] = useState(false);
  const [googleIdTokenTemp, setGoogleIdTokenTemp] = useState<string | null>(null);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistroFormValues>({
    resolver: zodResolver(fluxoGooglePendente ? googleSchema : manualSchema),
    mode: "onChange",
    defaultValues: { aceiteTermos: false },
  });

  const handleConfirmarLeituraTermos = () => {
    setTermosLidos(true);
    setValue("aceiteTermos", true, { shouldValidate: true });
    setModalTermosAberto(false);
    toast.info(`Leitura concluída e aceite dos Termos (v${VERSAO_TERMOS_USO}) registrado.`);
  };

  const finalizarLogin = (access: string, refresh: string, nomeFormulario: string) => {
    localStorage.setItem("access_token", access);
    if (refresh) localStorage.setItem("refresh_token", refresh);

    const decoded = jwtDecode<{ role: string; nome?: string }>(access);
    setRole((decoded.role as Role) || "estudante");
    login(decoded.nome || nomeFormulario);

    window.location.href = "/painel";
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    try {
      const response = await fetch(`${API_URL}/auth/google/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_token: idToken,
          terms_accepted: false,
          terms_version: "",
        }),
      });

      const result = await response.json();

      if (response.status === 403 && result.status === "registration_required") {
        setGoogleIdTokenTemp(idToken);
        setFluxoGooglePendente(true);
        toast.warning("Complete as informações de LGPD para finalizar seu cadastro com o Google.");
        return;
      }

      if (response.status === 202 && result.status === "2fa_required") {
        toast.info("Você já possui uma conta com 2FA. Redirecionando para o login...");
        navigate({ to: "/login" });
        return;
      }

      if (response.status === 403 && result.status === "terms_required") {
        toast.warning("Sua conta está suspensa (LGPD). Redirecionando para o login...");
        navigate({ to: "/login" });
        return;
      }

      if (!response.ok) throw new Error(result.error || "Erro na autenticação com Google.");

      if (result.access) {
        toast.success("Login com Google efetuado com sucesso!");
        finalizarLogin(result.access, result.refresh, "Usuário");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro no processo do Google OAuth.");
    }
  };

  const onSubmit = async (data: RegistroFormValues) => {
    try {
      let response;
      let result;

      if (fluxoGooglePendente && googleIdTokenTemp) {
        response = await fetch(`${API_URL}/auth/google/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_token: googleIdTokenTemp,
            name: data.nome,
            ano_nascimento: data.anoNascimento,
            terms_accepted: data.aceiteTermos,
            terms_version: VERSAO_TERMOS_USO,
          }),
        });
      } else {
        response = await fetch(`${API_URL}/auth/register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: data.nome,
            email: data.email,
            password: data.senha,
            ano_nascimento: data.anoNascimento,
            terms_accepted: data.aceiteTermos,
            terms_version: VERSAO_TERMOS_USO,
          }),
        });
      }

      result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.detail || result.email?.[0] || "Erro ao realizar cadastro.",
        );
      }

      if (result.access) {
        toast.success("Cadastro realizado com sucesso! Bem-vindo ao Linus.");
        finalizarLogin(result.access, result.refresh, data.nome);
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
            <strong>Quase lá!</strong> Identificamos sua conta Google, mas precisamos do seu nome,
            ano de nascimento e aceite dos Termos.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground">
              Nome de Exibição
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
                    type={mostrarSenha ? "text" : "password"}
                    {...register("senha")}
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
                {errors.senha && (
                  <p className="mt-1 text-xs text-destructive">{errors.senha.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Confirmar Senha
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
                Para prosseguir com o cadastro, leia os nossos{" "}
                <button
                  type="button"
                  onClick={() => setModalTermosAberto(true)}
                  className="font-bold text-primary underline hover:text-primary/80 cursor-pointer"
                >
                  Termos de Uso e Política de Privacidade (v{VERSAO_TERMOS_USO})
                </button>
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

      {/* POPUP / MODAL COMPLETO DOS TERMOS DE USO E POLÍTICA DE PRIVACIDADE (V2.0) */}
      <Dialog open={modalTermosAberto} onOpenChange={setModalTermosAberto}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Transparência e Privacidade — Plataforma Linus
            </DialogTitle>
            <DialogDescription>
              Última atualização: 18 de novembro de 2026 · Versão {VERSAO_TERMOS_USO}.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="termos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="termos">Termos de Uso</TabsTrigger>
              <TabsTrigger value="privacidade">Política de Privacidade</TabsTrigger>
            </TabsList>

            {/* ABA COMPLETA: TERMOS DE USO */}
            <TabsContent
              value="termos"
              className="mt-4 max-h-[55vh] overflow-y-auto overscroll-contain pr-3 space-y-5 text-xs leading-relaxed text-muted-foreground"
            >
              <div className="border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">TERMOS DE USO DA PLATAFORMA</h3>
                <p className="mt-1">Última atualização: 18 de novembro de 2026</p>
                <p>Versão 2.0.</p>
              </div>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">
                  1. Introdução e aceitação dos termos
                </h4>
                <p>
                  1.1. Estes Termos de Uso aplicam-se a todas as pessoas que acessam e utilizam a
                  plataforma denominada Linus, desenvolvida no âmbito do Projeto Final de Curso em
                  Engenharia de Software da Universidade de Mogi das Cruzes (UMC).
                </p>
                <p>
                  1.2. Ao criar uma conta, navegar pela plataforma ou utilizar os recursos
                  didáticos, você declara ter lido, compreendido e concordado, de forma livre e
                  expressa, com estes Termos de Uso e com a Política de Privacidade do Linus.
                </p>
                <p>
                  1.3. O conhecimento e o aceite destes documentos são requisitos para a utilização
                  da plataforma e de seus serviços. Caso discorde de qualquer disposição aqui
                  contida, você não deve acessar ou utilizar a plataforma.
                </p>
                <p>
                  1.4. O Linus é um recurso educacional web gratuito, sem fins lucrativos,
                  desenvolvido para fornecer ferramentas interativas para o ensino autônomo e
                  introdutório de teoria musical.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">
                  2. Público-alvo, cadastro e responsabilidade da conta
                </h4>
                <p>
                  2.1. O acesso a determinadas funcionalidades exige a realização de cadastro prévio
                  na plataforma.
                </p>
                <p>
                  2.2. A plataforma destina-se a estudantes, entusiastas e músicos autodidatas. Em
                  conformidade com o art. 14 da Lei Geral de Proteção de Dados (LGPD), o cadastro é
                  permitido apenas para pessoas com idade igual ou superior a 12 anos. O Linus
                  reserva-se o direito de suspender ou excluir contas identificadas como
                  pertencentes a crianças menores de 12 anos.
                </p>
                <p>
                  2.3. Ao realizar o cadastro, a Pessoa Usuária compromete-se a fornecer informações
                  verdadeiras, completas e atualizadas, incluindo nome, endereço de e-mail e ano de
                  nascimento. A responsabilidade pela guarda, sigilo e utilização da senha de acesso
                  é exclusiva da Pessoa Usuária.
                </p>
                <p>
                  2.4. A plataforma permite o acesso de visitantes anônimos para a realização do
                  questionário de triagem inicial de nivelamento. Nesse caso, as informações são
                  mantidas temporariamente em sessão e tratadas como expiradas após 30 minutos, caso
                  o usuário não conclua o cadastro.
                </p>
                <p>2.5. A conta é de uso pessoal e intransferível.</p>
                <p>
                  2.6. A plataforma disponibiliza autenticação por meio do Google OAuth 2.0. Ao
                  utilizar essa forma de login, a Pessoa Usuária autoriza o compartilhamento, com o
                  Google, das informações necessárias para identificar a conta, confirmar o endereço
                  eletrônico verificado e vincular a identidade federada ao perfil do usuário no
                  Linus.
                </p>
                <p>
                  2.7. Durante o fluxo de autenticação com Google, podem ser utilizados cookies
                  técnicos de segurança controlados pelo Google, necessários à proteção da sessão de
                  autenticação. As finalidades, os compartilhamentos e as medidas de proteção
                  associadas a esse fluxo estão descritas na Política de Privacidade.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">
                  3. Natureza do serviço e limitações
                </h4>
                <p>
                  3.1. O Linus disponibiliza funcionalidades como trilhas de aprendizagem, piano
                  virtual controlado pelo teclado do computador, partituras interativas, exercícios,
                  acompanhamento de progresso, glossário musical, Playground e recursos leves de
                  gamificação.
                </p>
                <p>
                  3.2. Por se tratar de um projeto acadêmico em fase de desenvolvimento de Produto
                  Mínimo Viável (MVP), os serviços são fornecidos no estado em que se encontram. A
                  plataforma poderá passar por manutenções, atualizações ou ter funcionalidades
                  alteradas ou removidas.
                </p>
                <p>
                  3.3. O Linus não tem o propósito de substituir aulas presenciais de música, o
                  trabalho humano de um professor habilitado ou o aprendizado em instrumentos
                  musicais físicos. A plataforma é um recurso complementar para estudo, prática e
                  revisão.
                </p>
                <p>
                  3.4. O piano virtual não substitui um instrumento musical real, não avalia
                  postura, articulação, dinâmica ou técnica instrumental completa e não realiza
                  reconhecimento de notas por microfone.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">
                  4. Assistente didático com inteligência artificial
                </h4>
                <p>
                  4.1. A plataforma disponibiliza um assistente didático baseado em inteligência
                  artificial generativa, integrado por meio da Google Gemini API, destinado a
                  dúvidas relacionadas aos conteúdos de teoria musical disponibilizados pelo Linus.
                </p>
                <p>
                  4.2. A Pessoa Usuária compreende que as respostas do assistente possuem caráter
                  auxiliar e podem conter erros, imprecisões ou informações incompletas. Elas não
                  constituem orientação pedagógica definitiva nem substituem o acompanhamento de um
                  professor.
                </p>
                <p>
                  4.3. É expressamente proibido enviar dados pessoais sensíveis, senhas, tokens,
                  chaves de acesso, informações financeiras, dados de saúde ou outros dados
                  confidenciais no campo de conversa do assistente.
                </p>
                <p>
                  4.4. É proibido utilizar linguagem ofensiva ou tentar manipular o assistente por
                  meio de técnicas como prompt injection ou jailbreaking, com o objetivo de
                  contornar restrições de segurança, obter informações internas ou induzir
                  comportamentos não previstos.
                </p>
                <p>
                  4.5. O Linus poderá limitar, suspender ou encerrar o acesso às funcionalidades do
                  assistente em caso de uso abusivo, tentativa de manipulação das instruções do
                  sistema ou violação reiterada destes Termos de Uso.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">5. Uso adequado da plataforma</h4>
                <p>
                  5.1. A Pessoa Usuária deve utilizar o Linus de acordo com as finalidades
                  educacionais da plataforma e respeitar os direitos de outros usuários.
                </p>
                <p>
                  5.2. É proibido utilizar a plataforma para praticar atos ilícitos, tentar acessar
                  contas de terceiros, explorar vulnerabilidades, interferir no funcionamento do
                  sistema, coletar dados de outros usuários ou contornar controles de autenticação e
                  autorização.
                </p>
                <p>
                  5.3. O Linus poderá suspender ou restringir o acesso a funcionalidades em caso de
                  uso abusivo, tentativa de fraude, violação de segurança ou descumprimento
                  reiterado destes Termos de Uso.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">6. Disposições finais e foro</h4>
                <p>
                  6.1. Estes Termos de Uso são regidos e interpretados de acordo com as leis da
                  República Federativa do Brasil, incluindo a LGPD e o Marco Civil da Internet.
                </p>
                <p>
                  6.2. Fica eleito o foro da Comarca de Mogi das Cruzes, SP, para dirimir eventuais
                  controvérsias decorrentes da utilização da plataforma.
                </p>
              </section>
            </TabsContent>

            {/* ABA COMPLETA: POLÍTICA DE PRIVACIDADE */}
            <TabsContent
              value="privacidade"
              className="mt-4 max-h-[55vh] overflow-y-auto overscroll-contain pr-3 space-y-5 text-xs leading-relaxed text-muted-foreground"
            >
              <div className="border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">
                  POLÍTICA DE PRIVACIDADE DA PLATAFORMA
                </h3>
                <p className="mt-1">Última atualização: 18 de novembro de 2026</p>
                <p>Versão 2.0.</p>
              </div>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">1. Introdução</h4>
                <p>
                  1.1. O Linus é uma plataforma web interativa voltada à aprendizagem autônoma e
                  introdutória de teoria musical. Para fornecer funcionalidades como trilhas
                  progressivas, exercícios, acompanhamento de progresso, gamificação, glossário,
                  Playground e assistente didático, precisamos tratar alguns de seus dados pessoais.
                </p>
                <p>
                  1.2. Esta Política indica as formas de coleta, acesso, utilização,
                  compartilhamento, retenção e proteção de dados pela equipe de desenvolvimento do
                  Linus (Projeto Acadêmico — Engenharia de Software / UMC). A equipe atua
                  provisoriamente como controladora dos dados. E-mail oficial: contato@linus.app.br.
                </p>
                <p>
                  1.3. O Linus não coleta intencionalmente dados de crianças menores de 12 anos. O
                  cadastro é destinado a pessoas com idade igual ou superior a 12 anos, conforme os
                  Termos de Uso da plataforma.
                </p>
                <p>
                  1.4. Esta é a versão vigente da Política de Privacidade e Segurança da Informação
                  do Linus. Alterações relevantes poderão ser comunicadas por meio da plataforma ou
                  dos canais de contato informados nesta Política.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">
                  2. Quais dados pessoais o Linus coleta?
                </h4>
                <p>
                  Dados cadastrais: nome completo, endereço de e-mail, senha e ano de nascimento. O
                  ano de nascimento é coletado apenas para classificação demográfica por faixa
                  etária e para apoio às medidas aplicáveis ao público adolescente. O Linus não
                  coleta a data completa de nascimento.
                </p>
                <p>
                  Dados de acesso federado: informações básicas obtidas por meio do Google OAuth
                  2.0, quando essa forma de autenticação for utilizada, incluindo o endereço
                  eletrônico verificado e os dados necessários para vincular a conta Google ao
                  perfil do usuário no Linus. Durante o fluxo de autenticação, o Google pode
                  utilizar cookies técnicos de segurança em seu próprio domínio.
                </p>
                <p>
                  Dados pedagógicos e de uso: resultados da triagem inicial, histórico de
                  exercícios, respostas e tentativas, taxa de acerto ou erro, progresso em lições,
                  pontuação, dias consecutivos de estudo, medalhas, personalização de avatar e
                  sequências de notas salvas no Playground.
                </p>
                <p>
                  Dados interativos com IA: dúvidas enviadas ao assistente didático, processadas por
                  meio da integração do backend do Linus com a Google Gemini API.
                </p>
                <p>
                  Dados técnicos e de auditoria: endereço IP, registros de eventos de autenticação,
                  operações críticas e ações de segurança, incluindo data e hora em UTC. Os
                  registros de auditoria são preservados para fins de segurança, integridade e
                  rastreabilidade.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">
                  3. Como e para que utilizamos os dados?
                </h4>
                <p>
                  O Linus realiza o tratamento de dados pessoais com base na execução de contrato e
                  no cumprimento de obrigações legais, quando aplicável, para:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Prestar o serviço educacional, disponibilizar trilhas, lições, exercícios e
                    recursos de prática.
                  </li>
                  <li>
                    Realizar a autenticação local ou federada por meio do Google OAuth 2.0, quando
                    selecionada pelo usuário, incluindo a verificação da identidade fornecida pelo
                    provedor, a confirmação do endereço eletrônico e a vinculação segura ao perfil
                    do usuário no Linus.
                  </li>
                  <li>
                    Associar o resultado da triagem inicial ao perfil do usuário, quando o cadastro
                    for concluído.
                  </li>
                  <li>
                    Registrar tentativas, calcular indicadores de desempenho, identificar tópicos
                    prioritários para revisão e apresentar informações de progresso.
                  </li>
                  <li>
                    Conceder conquistas gamificadas, registrar dias consecutivos de estudo e manter
                    o painel pessoal do usuário.
                  </li>
                  <li>
                    Enviar comunicações transacionais relacionadas à segurança da conta, como
                    recuperação de senha, autenticação em dois fatores e lembretes de estudo.
                  </li>
                  <li>Processar dúvidas no assistente didático por meio da Google Gemini API.</li>
                  <li>
                    Registrar e preservar logs de auditoria para segurança, prevenção de incidentes,
                    rastreabilidade e cumprimento de obrigações legais aplicáveis.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">
                  4. Compartilhamento, serviços de terceiros e cookies
                </h4>
                <p>
                  4.1. O Linus não vende, aluga ou cede seus dados pessoais para fins publicitários
                  ou comerciais
                </p>
                <p>
                  4.2. O compartilhamento de dados ocorre apenas quando necessário para a operação
                  da plataforma, com provedores de infraestrutura, envio de e-mails transacionais,
                  autenticação federada e processamento de dúvidas pelo assistente didático.
                </p>
                <p>
                  4.3. Para o login com Google, o Linus utiliza o Google Identity Services e o fluxo
                  de autenticação OAuth 2.0. Durante esse processo, o Google pode definir cookies
                  técnicos de segurança em seu próprio domínio, necessários para proteger a sessão
                  de autenticação, validar requisições e reduzir riscos associados a ataques como
                  Cross-Site Request Forgery (CSRF).
                </p>
                <p>
                  4.4. Esses cookies são controlados pelo Google, não são utilizados pelo Linus para
                  publicidade, perfilamento comercial ou acompanhamento de navegação fora da
                  plataforma. O Linus não utiliza esses cookies para criar perfis de comportamento
                  ou compartilhar dados pessoais com anunciantes.
                </p>
                <p>
                  4.5. As informações compartilhadas com o Google no fluxo de autenticação federada
                  são limitadas ao necessário para identificar a conta Google, confirmar o endereço
                  eletrônico verificado e vincular a identidade federada ao perfil do usuário no
                  Linus. A senha da conta Google não é coletada, armazenada ou processada pelo
                  Linus.
                </p>
                <p>
                  4.6. As dúvidas enviadas ao assistente didático são encaminhadas à Google Gemini
                  API por meio do backend do Linus. A solicitação não inclui nome, e-mail, senha,
                  token de sessão, endereço IP, histórico de navegação, histórico de desempenho ou
                  outros dados pessoais que não sejam indispensáveis ao atendimento da dúvida.
                </p>
                <p>
                  4.7. O usuário pode gerenciar ou bloquear cookies por meio das configurações de
                  seu navegador. O bloqueio de cookies técnicos do Google pode impedir ou dificultar
                  a conclusão do fluxo de login com Google. A utilização das demais funcionalidades
                  do Linus que não dependem da autenticação federada podem permanecer disponível.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">5. Segurança da informação</h4>
                <p>
                  O Linus adota medidas técnicas e administrativas para proteger os dados pessoais
                  tratados pela plataforma, proporcionais ao contexto do projeto acadêmico e às
                  finalidades declaradas. Entre as medidas adotadas estão:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Transmissão de comunicações externas por HTTPS, utilizando TLS para proteger a
                    confidencialidade e a integridade dos dados.
                  </li>
                  <li>
                    Armazenamento de senhas por meio de funções de derivação de chave, sem
                    manutenção da senha original em texto puro.
                  </li>
                  <li>
                    Utilização de tokens de acesso e de atualização para controle de sessão, com
                    validação de assinatura, expiração e atributos antes do processamento de
                    operações protegidas.
                  </li>
                  <li>
                    Controle de acesso baseado em papéis, com restrição de operações administrativas
                    e verificação de propriedade dos recursos acessados.
                  </li>
                  <li>
                    Armazenamento seguro de códigos de autenticação em dois fatores e tokens de
                    recuperação de senha, utilizando HMAC-SHA256 e comparação em tempo constante.
                  </li>
                  <li>
                    Manutenção de credenciais de integrações externas em variáveis de ambiente, sem
                    exposição no frontend, no repositório ou nas respostas da API.
                  </li>
                  <li>
                    Registro de eventos críticos e de segurança em trilha de auditoria, sem
                    armazenamento de senhas, hashes de senha, tokens JWT completos, chaves de API ou
                    códigos de autenticação.
                  </li>
                  <li>
                    Adoção de plano de resposta a incidentes para orientar a detecção, análise,
                    contenção, recuperação e comunicação de ocorrências que possam afetar dados
                    pessoais.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">
                  6. Retenção e eliminação de dados
                </h4>
                <p>
                  Os dados pessoais são mantidos enquanto a conta permanecer ativa e enquanto as
                  informações forem necessárias para as finalidades pedagógicas, operacionais, de
                  segurança e de cumprimento de obrigações eventualmente aplicáveis.
                </p>
                <p>
                  Quando o titular solicita a exclusão da conta, os registros relacionais associados
                  ao usuário são anonimizados, de forma que o titular não possa mais ser
                  identificado. Os registros de auditoria podem ser preservados para fins de
                  segurança, integridade e rastreabilidade, desde que os elementos de identificação
                  sejam anonimizados.
                </p>
                <p>
                  Os dados temporários da triagem inicial realizados por visitantes não autenticados
                  são mantidos em sessão por até 30 minutos. Caso o usuário não conclua o cadastro,
                  esses dados são tratados como expirados.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">
                  7. Seus direitos conforme o art. 18 da Lei Geral de Proteção de Dados (LGPD), você
                  possui o direito de solicitar:
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Confirmação da existência de tratamento de seus dados pessoais.</li>
                  <li>Acesso aos dados pessoais tratados pela plataforma.</li>
                  <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
                  <li>
                    Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou
                    tratados em desconformidade com a legislação.
                  </li>
                  <li>
                    Portabilidade dos dados pessoais a outro fornecedor de serviço ou produto,
                    quando aplicável.
                  </li>
                  <li>Eliminação dos dados pessoais tratados com base no consentimento.</li>
                  <li>
                    Informação sobre as entidades com as quais o controlador realizou
                    compartilhamento de dados.
                  </li>
                  <li>
                    Informação sobre a possibilidade de não fornecer o consentimento e sobre as
                    consequências da negativa.
                  </li>
                  <li>
                    Revogação do consentimento, quando o tratamento depender dessa base legal.
                  </li>
                </ul>
                <p>
                  As solicitações podem ser encaminhadas pelo e-mail oficial contato@linus.app.br
                  ou, quando disponível, pelos recursos de privacidade da plataforma.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">8. Contato</h4>
                <p>
                  Para dúvidas, solicitações relacionadas a dados pessoais ou exercício dos direitos
                  previstos na LGPD, entre em contato pelo e-mail oficial: contato@linus.app.br
                </p>
              </section>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-2 flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
            <button
              type="button"
              onClick={() => setModalTermosAberto(false)}
              className="rounded-lg border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleConfirmarLeituraTermos}
              className="rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
            >
              Li e Compreendi — Voltar para o Cadastro
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
