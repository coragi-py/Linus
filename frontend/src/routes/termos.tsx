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
                <h2 className="text-2xl font-bold text-foreground">Termos de Uso da Plataforma</h2>
                <p className="mt-1">Última atualização: 18 de novembro de 2026 · Versão 2.0.</p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  1. Introdução e aceitação dos termos
                </h3>
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

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  2. Público-alvo, cadastro e responsabilidade da conta
                </h3>
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

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  3. Natureza do serviço e limitações
                </h3>
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

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  4. Assistente didático com inteligência artificial
                </h3>
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

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  5. Uso adequado da plataforma
                </h3>
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

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  6. Disposições finais e foro
                </h3>
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

            {/* ABA: POLÍTICA DE PRIVACIDADE */}
            <TabsContent
              value="privacidade"
              className="space-y-6 text-sm text-muted-foreground leading-relaxed"
            >
              <div className="border-b border-border pb-4 mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Política de Privacidade da Plataforma
                </h2>
                <p className="mt-1">Última atualização: 18 de novembro de 2026 · Versão 2.0.</p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">1. Introdução</h3>
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

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  2. Quais dados pessoais o Linus coleta?
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Dados cadastrais:</strong> nome completo, endereço de e-mail, senha e
                    ano de nascimento. O ano de nascimento é coletado apenas para classificação
                    demográfica por faixa etária e para apoio às medidas aplicáveis ao público
                    adolescente. O Linus não coleta a data completa de nascimento.
                  </li>
                  <li>
                    <strong>Dados de acesso federado:</strong> informações básicas obtidas por meio
                    do Google OAuth 2.0, quando essa forma de autenticação for utilizada, incluindo
                    o endereço eletrônico verificado e os dados necessários para vincular a conta
                    Google ao perfil do usuário no Linus. Durante o fluxo de autenticação, o Google
                    pode utilizar cookies técnicos de segurança em seu próprio domínio.
                  </li>
                  <li>
                    <strong>Dados pedagógicos e de uso:</strong> resultados da triagem inicial,
                    histórico de exercícios, respostas e tentativas, taxa de acerto ou erro,
                    progresso em lições, pontuação, dias consecutivos de estudo, medalhas,
                    personalização de avatar e sequências de notas salvas no Playground.
                  </li>
                  <li>
                    <strong>Dados interativos com IA:</strong> dúvidas enviadas ao assistente
                    didático, processadas por meio da integração do backend do Linus com a Google
                    Gemini API.
                  </li>
                  <li>
                    <strong>Dados técnicos e de auditoria:</strong> endereço IP, registros de
                    eventos de autenticação, operações críticas e ações de segurança, incluindo data
                    e hora em UTC. Os registros de auditoria são preservados para fins de segurança,
                    integridade e rastreabilidade.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  3. Como e para que utilizamos os dados?
                </h3>
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

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  4. Compartilhamento, serviços de terceiros e cookies
                </h3>
                <p>
                  4.1. O Linus não vende, aluga ou cede seus dados pessoais para fins publicitários
                  ou comerciais.
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

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">5. Segurança da informação</h3>
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

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  6. Retenção e eliminação de dados
                </h3>
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

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  7. Seus direitos conforme o art. 18 da Lei Geral de Proteção de Dados (LGPD)
                </h3>
                <p>Você possui o direito de solicitar:</p>
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

              <section className="space-y-3">
                <h3 className="text-base font-bold text-foreground">8. Contato</h3>
                <p>
                  Para dúvidas, solicitações relacionadas a dados pessoais ou exercício dos direitos
                  previstos na LGPD, entre em contato pelo e-mail oficial:{" "}
                  <strong className="text-foreground">contato@linus.app.br</strong>.
                </p>
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
