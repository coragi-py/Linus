# Frontend — Linus

> Interface web do Linus, construída em TypeScript e organizada por rotas, componentes reutilizáveis, contexto de aplicação e recursos voltados ao aprendizado musical.

## Tecnologias e organização

Aplicação com Vite e TanStack Router. O frontend usa roteamento baseado em arquivos, componentes de interface reutilizáveis e uma camada de utilitários para áudio, música, tratamento de erro e validações auxiliares.

```text
frontend/
├── public/                    # Arquivos públicos, favicon e robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                # Biblioteca de componentes de interface
│   │   ├── AiAssistant.tsx    # Assistente de IA
│   │   ├── AppShell.tsx       # Estrutura visual da aplicação
│   │   ├── AuthModal.tsx      # Modal relacionado a autenticação
│   │   ├── GlossaryDiagram.tsx
│   │   ├── Logo.tsx
│   │   ├── Stave.tsx          # Representação de pauta musical
│   │   └── VirtualPiano.tsx   # Piano virtual
│   ├── context/
│   │   └── LinusContext.tsx   # Estado compartilhado do domínio/UI
│   ├── data/
│   │   └── curriculum.ts      # Dados curriculares e/ou conteúdo local
│   ├── hooks/
│   │   └── use-mobile.tsx     # Adaptação responsiva
│   ├── lib/
│   │   ├── audio.ts           # Recursos de áudio
│   │   ├── blacklist.ts       # Lista/regras de bloqueio; validar finalidade
│   │   ├── constants.ts
│   │   ├── error-capture.ts
│   │   ├── error-page.ts
│   │   ├── music.ts           # Regras auxiliares de música
│   │   └── utils.ts
│   ├── routes/                # Páginas e controle de navegação
│   ├── router.tsx
│   ├── routeTree.gen.ts       # Arquivo gerado automaticamente; não editar manualmente
│   ├── server.ts
│   ├── start.ts
│   └── styles.css
├── package.json
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
└── components.json
```

## Instalação e execução

```bash
cd frontend
npm ci
npm run dev
```

Se `npm ci` não puder ser utilizado no ambiente, execute:

```bash
npm install
npm run dev
```

Use os scripts definidos no `package.json` como fonte de verdade para build, lint, testes e execução. Antes de publicar, execute pelo menos o build de produção e o lint disponíveis no projeto.

```bash
npm run build
npm run lint
```

## Rotas e regras de negócio

O TanStack Router gera a árvore de rotas em `routeTree.gen.ts` a partir dos arquivos em `src/routes`. Não edite o arquivo gerado.

| Rota de arquivo       | Tela/objetivo inferido           | Regras de negócio ou controles a validar                                                        |
| --------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------- |
| `index.tsx`           | Página inicial                   | Apresentação do produto, CTAs e encaminhamento para registro/login                              |
| `login.tsx`           | Autenticação                     | Validação de credenciais, tratamento de erro, redirecionamento pós-login e possível desafio 2FA |
| `registro.tsx`        | Criação de conta                 | Campos mínimos, confirmação de senha, aceite de termos e mensagens de validação                 |
| `recuperar-senha.tsx` | Recuperação/redefinição de senha | Solicitação sem enumeração de usuário, token, expiração, nova senha e confirmação               |
| `termos.tsx`          | Termos e privacidade             | Exibição de versão, data de vigência e vínculo com o aceite quando necessário                   |
| `painel.tsx`          | Painel do estudante              | Resumo de progresso, atalhos e estado autenticado                                               |
| `perfil.tsx`          | Perfil e dados do titular        | Atualização de dados, privacidade, consentimentos e possíveis direitos LGPD                     |
| `trilha.tsx`          | Trilhas de aprendizagem          | Exibição, seleção e avanço nas trilhas                                                          |
| `licao.$lessonId.tsx` | Lição parametrizada              | Validação de `lessonId`, carregamento de conteúdo e proteção contra acesso indevido             |
| `pratica.tsx`         | Prática musical                  | Interação com áudio, piano virtual, exercícios e feedback                                       |
| `triagem.tsx`         | Triagem/nivelamento              | Coleta mínima de respostas, cálculo/encaminhamento de nível e persistência segura               |
| `glossario.tsx`       | Glossário                        | Busca, consulta e representação de conceitos musicais                                           |
| `admin.conteudo.tsx`  | Administração de conteúdo        | Restrição por papel e proteção contra operação não autorizada                                   |
| `admin.sistema.tsx`   | Administração do sistema         | Restrição forte por papel, ações auditáveis e confirmações para operações sensíveis             |
| `__root.tsx`          | Layout raiz                      | Providers, tratamento de erros, cabeçalho, navegação e limites de aplicação                     |

### Páginas administrativas

As rotas com prefixo `admin.` exigem controle efetivo no frontend **e no backend**.

### Rotas parametrizadas

`licao.$lessonId.tsx` indica uma rota com identificador dinâmico. O frontend valida formato e existência do parâmetro, mas o backend continua responsável por verificar autorização e elegibilidade do usuário para acessar a lição ou seu conteúdo.

## Componentes e experiência do usuário

### Componentes de domínio

| Componente            | Responsabilidade                          | Cuidados de UX e acessibilidade                                                     |
| --------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------- |
| `AppShell.tsx`        | Estrutura comum de navegação e conteúdo   | Foco visível, navegação por teclado, responsividade e indicação de página atual     |
| `AuthModal.tsx`       | Entrada ou ações de autenticação em modal | Gerenciamento de foco, fechamento por teclado, mensagens de erro anunciáveis        |
| `AiAssistant.tsx`     | Interface para assistência de IA          | Deixar claro o caráter assistivo, limitar dados enviados e tratar indisponibilidade |
| `VirtualPiano.tsx`    | Interação prática com teclado musical     | Alternativas por teclado, feedback visual/sonoro e não depender apenas de cor       |
| `Stave.tsx`           | Visualização de pauta musical             | Texto alternativo ou descrição equivalente para conteúdo essencial                  |
| `GlossaryDiagram.tsx` | Visualização de relações do glossário     | Legendas, contraste e alternativa textual para informações críticas                 |

### Biblioteca de UI

A pasta `components/ui` contém componentes de baixo nível, como formulário, input, checkbox, select, modal, alerta, toast, tabela, tabs, tooltip, calendário e input OTP. Isso oferece uma base consistente para:

- Mensagens de erro próximas ao campo e linguagem clara.
- Estados de carregamento, vazio, sucesso e falha.
- Confirmação explícita em ações destrutivas.
- Navegação por teclado e foco controlado em diálogos.
- Contraste adequado e controles que não dependem exclusivamente de cor.
- Design responsivo, complementado por `use-mobile.tsx`.

                     |

## Manutenção

- Não edite `routeTree.gen.ts` manualmente; regenere-o por meio do fluxo do roteador.
- Centralize constantes, URLs e configurações em arquivos adequados; não espalhe valores de ambiente pelo código.
- Mantenha componentes de domínio separados de componentes de UI genéricos.
- Remova logs de depuração e não use `console.log` para dados pessoais, credenciais, tokens ou respostas sensíveis.
- Atualize este documento sempre que novas rotas, permissões, formulários ou integrações forem adicionados.
