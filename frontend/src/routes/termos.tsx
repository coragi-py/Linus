import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Shield, FileText } from "lucide-react";

export const Route = createFileRoute("/termos")({
  component: TermosComponent,
});

function TermosComponent() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Cabeçalho */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Music className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Transparência e Privacidade
          </h1>
          <p className="text-muted-foreground">
            Leia atentamente nossos Termos de Uso e Política de Privacidade aplicados ao Linus.
          </p>
        </div>

        {/* Container das Abas */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-8">
          <Tabs defaultValue="termos" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
              <TabsTrigger value="termos" className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Termos de Uso
              </TabsTrigger>
              <TabsTrigger
                value="privacidade"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Shield className="h-4 w-4" />
                Política de Privacidade
              </TabsTrigger>
            </TabsList>

            {/* ABA: TERMOS DE USO */}
            <TabsContent
              value="termos"
              className="space-y-6 text-sm text-muted-foreground leading-relaxed"
            >
              <div className="border-b border-border pb-4 mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Termos de Uso - Plataforma Linus
                </h2>
                <p className="mt-1">Última atualização: 22 de setembro de 2026.</p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  1. Introdução e Aceitação dos Termos
                </h3>
                <p>
                  1.1. Estes Termos de Uso aplicam-se a todas as pessoas que acessam e utilizam a
                  plataforma denominada "Linus", desenvolvida no âmbito do Projeto Final de Curso em
                  Engenharia de Software da Universidade de Mogi das Cruzes (UMC).
                </p>
                <p>
                  1.2. Ao criar uma conta, navegar pela plataforma ou utilizar os nossos recursos
                  didáticos, você declara ter lido, compreendido e concordado de forma livre e
                  expressa com estes Termos de Uso e com a nossa Política de Privacidade.
                </p>
                <p>
                  1.3. O conhecimento e aceite destes documentos são requisitos obrigatórios para a
                  utilização da plataforma e de seus serviços. Caso discorde de qualquer disposição
                  aqui contida, você não deve acessar a plataforma.
                </p>
                <p>
                  1.4. O Linus é um recurso educacional web gratuito, sem fins lucrativos,
                  desenvolvido para fornecer ferramentas interativas para o ensino autônomo e
                  introdutório de teoria musical.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  2. Público-Alvo, Cadastro e Responsabilidade da Conta
                </h3>
                <p>
                  2.1. O acesso a determinadas funcionalidades exigirá a realização de um cadastro
                  prévio na plataforma.
                </p>
                <p>
                  2.2. A plataforma destina-se a estudantes, entusiastas e músicos autodidatas. Em
                  estrita conformidade com o Artigo 14 da Lei Geral de Proteção de Dados (LGPD), o
                  cadastro na plataforma é permitido apenas para pessoas com idade igual ou superior
                  a 12 (doze) anos. O Linus reserva-se o direito de excluir imediatamente contas
                  caso identifique que foram criadas por crianças menores de 12 anos.
                </p>
                <p>
                  2.3. Ao realizar o cadastro, a Pessoa Usuária compromete-se a fornecer informações
                  verdadeiras e exatas (nome, e-mail e ano de nascimento). A responsabilidade pela
                  guarda, sigilo e utilização da sua senha de acesso é exclusiva da Pessoa Usuária.
                </p>
                <p>
                  2.4. A plataforma permite o acesso de visitantes anônimos para a realização do
                  questionário de triagem inicial (nivelamento). Neste caso, as informações são
                  mantidas temporariamente em sessão (sendo descartadas após 30 minutos sem
                  cadastro).
                </p>
                <p>2.5. A conta é de uso pessoal e intransferível.</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  3. Natureza do Serviço e Limitações de Funcionalidades
                </h3>
                <p>
                  3.1. O Linus disponibilizará funcionalidades como trilhas de aprendizagem, piano
                  virtual controlado pelo teclado do computador, partituras visuais e recursos de
                  gamificação.
                </p>
                <p>
                  3.2. Por se tratar de um projeto acadêmico em fase de desenvolvimento (MVP), os
                  serviços são fornecidos "no estado em que se encontram". A plataforma poderá
                  passar por manutenções, atualizações ou ter funcionalidades removidas a qualquer
                  momento, sem aviso prévio.
                </p>
                <p>
                  3.3. Aviso Educacional: O Linus não tem o propósito de substituir aulas
                  presenciais de música, o trabalho humano de um professor habilitado, ou o
                  aprendizado em instrumentos musicais físicos.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  4. Assistente Didático (Inteligência Artificial)
                </h3>
                <p>
                  4.1. A plataforma disponibiliza um assistente/tutor didático (chatbot) baseado em
                  IA Generativa, integrado através da Google Gemini API, exclusivo para dúvidas de
                  teoria musical.
                </p>
                <p>
                  4.2. A Pessoa Usuária compreende que as respostas da IA possuem caráter puramente
                  auxiliar e podem apresentar erros ou imprecisões (alucinações).
                </p>
                <p>
                  4.3. É expressamente proibido enviar dados pessoais, utilizar linguagem ofensiva,
                  ou tentar manipular a IA (prompt injection/jailbreaking) para contornar as travas
                  de segurança do modelo.
                </p>
                <p>
                  4.4. A infração das regras de uso da IA resultará no bloqueio e exclusão imediata
                  da conta.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  5. Disposições Finais e Foro
                </h3>
                <p>
                  Estes Termos de Uso são regidos e interpretados de acordo com as leis da República
                  Federativa do Brasil (LGPD e Marco Civil da Internet). Fica eleito o Foro da
                  Comarca de Mogi das Cruzes, SP, para dirimir eventuais controvérsias.
                </p>
              </section>
            </TabsContent>

            {/* ABA: POLÍTICA DE PRIVACIDADE */}
            <TabsContent
              value="privacidade"
              className="space-y-6 text-sm text-muted-foreground leading-relaxed"
            >
              <div className="border-b border-border pb-4 mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Política de Privacidade - Linus
                </h2>
                <p className="mt-1">Última atualização: 22 de setembro de 2026.</p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">1. Introdução</h3>
                <p>
                  1.1. O Linus é uma plataforma web interativa voltada à aprendizagem autônoma de
                  teoria musical. Para fornecer funcionalidades como trilhas progressivas e
                  gamificação, precisamos tratar alguns de seus dados pessoais.
                </p>
                <p>
                  1.2. Esta Política indica as formas de coleta, acesso e utilização de dados pela
                  equipe de desenvolvimento do Linus (Projeto Acadêmico - Engenharia de Software /
                  UMC). A equipe atua provisoriamente como controladora dos dados. E-mail oficial:
                  linuspfc@gmail.com.
                </p>
                <p>
                  1.3. O Linus não coleta intencionalmente dados de crianças menores de 12 anos.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  2. Quais dados pessoais o Linus coleta?
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Dados cadastrais:</strong> Nome completo, e-mail, senha e ano de
                    nascimento. O ano é coletado apenas para métricas demográficas de faixa etária.
                  </li>
                  <li>
                    <strong>Dados de acesso federado:</strong> Informações básicas via Google OAuth
                    2.0 (se utilizado).
                  </li>
                  <li>
                    <strong>Dados pedagógicos e navegação:</strong> Histórico de exercícios, taxa de
                    erro/acerto, streaks, medalhas e gravações do piano virtual.
                  </li>
                  <li>
                    <strong>Dados interativos (IA):</strong> Dúvidas enviadas ao assistente virtual
                    (API do Google Gemini).
                  </li>
                  <li>
                    <strong>Dados técnicos e auditoria:</strong> Endereço IP e logs de autenticação
                    imutáveis.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  3. Como e para que utilizamos os dados?
                </h3>
                <p>
                  O Linus realiza o tratamento (Execução de Contrato e Cumprimento de Obrigação
                  Legal) para:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Prestar o serviço educacional e liberar acesso às lições.</li>
                  <li>Alimentar o motor determinístico de exercícios adaptativos.</li>
                  <li>Conceder conquistas gamificadas e manter o dashboard do usuário.</li>
                  <li>Disparar comunicações de segurança (2FA e redefinição de senhas).</li>
                  <li>
                    Processar dúvidas no assistente IA e manter logs de segurança (Marco Civil da
                    Internet).
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  4. Compartilhamento e Serviços de Terceiros
                </h3>
                <p>
                  4.1. O Linus não vende nem cede seus dados para fins publicitários ou comerciais.
                </p>
                <p>
                  4.2. O compartilhamento ocorre estritamente com provedores de infraestrutura
                  (Hospedagem Cloud, envio de e-mails transacionais e plataforma Google Cloud para
                  IA/OAuth).
                </p>
                <p>
                  4.3. As dúvidas enviadas ao Gemini API não incluem seus dados pessoais de
                  cadastro, limitando-se ao conteúdo textual da pergunta musical.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  5. Seus Direitos (Art. 18 da LGPD)
                </h3>
                <p>
                  Você possui o direito de solicitar acesso, correção, oposição ou a{" "}
                  <strong>eliminação (exclusão da conta)</strong> diretamente pela plataforma. Ao
                  confirmar a exclusão na aba de Perfil, todo o seu progresso e dados pessoais serão
                  removidos definitivamente, mantendo-se apenas os logs técnicos anonimizados.
                </p>
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
