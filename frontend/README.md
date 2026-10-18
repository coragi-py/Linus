# Frontend — Linus

Interface web interativa do sistema Linus, desenvolvida com React, TypeScript, Vite, TanStack Router e Tailwind CSS, integrando síntese de áudio no navegador (Tone.js) e renderização vetorial de partituras (VexFlow).

## Estrutura do Projeto

```text
frontend/
├── public/                     # Favicon e arquivos estáticos
├── src/
│   ├── components/
│   │   ├── ui/                 # Componentes base de interface (shadcn/ui + Radix UI)
│   │   ├── AiAssistant.tsx     # Gaveta do assistente didático integrado à Gemini API
│   │   ├── AppShell.tsx        # Layout global, cabeçalho dinâmico e guardas de rota (RBAC)
│   │   ├── AuthModal.tsx       # Modal de convite para autenticação/cadastro
│   │   ├── GlossaryDiagram.tsx # Renderizador VexFlow para símbolos do glossário
│   │   ├── Logo.tsx            # Identidade visual do Linus
│   │   ├── Stave.tsx           # Renderizador VexFlow para pautas de lições, triagem e prática
│   │   └── VirtualPiano.tsx    # Piano virtual de 2 oitavas (C3–B4) controlado por mouse/teclado
│   ├── context/
│   │   └── LinusContext.tsx    # Estado global, autenticação JWT e sincronização de progresso
│   ├── data/
│   │   └── curriculum.ts       # Tipagens de unidades/lições/exercícios e currículo de fallback
│   ├── hooks/
│   │   └── use-mobile.tsx      # Detecção de viewport responsivo
│   ├── lib/
│   │   ├── audio.ts            # Motor de síntese sonora em tempo real com Tone.js
│   │   ├── blacklist.ts        # Validação client-side de nomes de usuário
│   │   ├── constants.ts        # Constantes de versão de termos (LGPD) e configuração
│   │   ├── music.ts            # Mapeamento de teclas físicas -> notas MIDI e nomenclatura PT-BR
│   │   └── utils.ts            # Utilitários de classes CSS (clsx + tailwind-merge)
│   ├── routes/                 # Páginas da aplicação gerenciadas pelo TanStack Router
│   ├── router.tsx
│   ├── routeTree.gen.ts        # Árvore de rotas gerada automaticamente (não editar manualmente)
│   └── styles.css              # Tokens de design e estilos globais
├── eslint.config.js
├── package.json
├── tsconfig.json
└── vite.config.ts

```

---

## Instalação e Execução

```bash
cd frontend
npm install
npm run dev

```

Scripts disponíveis no `package.json`:

- `npm run dev`: Inicia o servidor de desenvolvimento na porta `8080`.
- `npm run build`: Compila o pacote de produção.
- `npm run lint`: Executa a verificação estática com ESLint.

---

## Mapa de Rotas e Controle de Acesso (`AppShell.tsx`)

O controle de acesso no cliente é realizado pelo `AppShell.tsx` em conjunto com as claims (`role`, `nome`) decodificadas do token JWT no `LinusContext.tsx`:

| Rota (`src/routes/`)  | Caminho URL        | Perfil de Acesso                          | Responsabilidade da Tela                                                                                             |
| --------------------- | ------------------ | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `index.tsx`           | `/`                | Visitante Anônimo                         | Landing page com apresentação da plataforma e atalho para a Triagem                                                  |
| `triagem.tsx`         | `/triagem`         | Visitante / Estudante                     | Questionário diagnóstico com pauta VexFlow e recomendação de unidade inicial                                         |
| `login.tsx`           | `/login`           | Visitante Anônimo                         | Login local, Google OAuth 2.0, validação de OTP 2FA, recuperação de senha e reaceite LGPD                            |
| `registro.tsx`        | `/registro`        | Visitante Anônimo                         | Cadastro de conta com validação de nickname, ano de nascimento e consentimento LGPD                                  |
| `recuperar-senha.tsx` | `/recuperar-senha` | Visitante Anônimo                         | Redefinição de senha via token enviado por e-mail                                                                    |
| `termos.tsx`          | `/termos`          | Público                                   | Exibição dos Termos de Uso e Política de Privacidade                                                                 |
| `painel.tsx`          | `/painel`          | `estudante` (Home do Estudante)           | Dashboard pessoal com ofensiva diária (_streak_), conclusão, medalhas e precisão por tópico                          |
| `trilha.tsx`          | `/trilha`          | `estudante`                               | Trilha didática em unidades com desbloqueio sequencial de lições                                                     |
| `licao.$lessonId.tsx` | `/licao/:lessonId` | `estudante`                               | Aula interativa em 2 etapas: Guia Teórico (com pauta e exemplo sonoro) + Exercícios práticos                         |
| `pratica.tsx`         | `/pratica`         | `estudante`                               | _Playground_ de prática livre com piano virtual, pauta dinâmica e gravação de músicas                                |
| `glossario.tsx`       | `/glossario`       | Todos os usuários autenticados            | Dicionário visual pesquisável com filtro por categoria e diagramas VexFlow                                           |
| `perfil.tsx`          | `/perfil`          | Todos os usuários autenticados            | Edição de perfil, troca de senha, exportação de dados, revogação e exclusão (LGPD)                                   |
| `admin.conteudo.tsx`  | `/admin/conteudo`  | `admin-conteudo` (Home do Admin Conteúdo) | CRUD de Unidades, Lições, Exercícios por Lição, Triagem (construtor VexFlow) e Glossário                             |
| `admin.sistema.tsx`   | `/admin/sistema`   | `admin-sistema` (Home do Admin Sistema)   | Dashboard gerencial (_Big Numbers_, gráficos, logs de auditoria) e gestão de usuários com busca, filtros e paginação |

---

## Componentes Musicais Principais

- **`VirtualPiano.tsx` + `audio.ts`:** Renderiza duas oitavas completas (`C3` a `B4`) acionáveis por clique/toque ou pelo teclado físico do computador, sintetizando o som no navegador com latência inferior a 50ms via `Tone.PolySynth`.
- **`Stave.tsx`:** Suporta dois modos de operação em VexFlow 4+:

1. `data`: Recebe `{ clef, timeSignature, notes }` no padrão _EasyScore_ (utilizado na Triagem e no construtor visual do Admin).
2. `notes`: Recebe um array de notas (ex.: `["C4", "E4"]`) e renderiza acordes ou sequências melódicas (utilizado nas Lições e no Construtor de Escalas).

- **`GlossaryDiagram.tsx`:** Traduz identificadores textuais (`treble`, `bass`, `alto`, `tenor`, `percussion`, `time-4/4`, `whole`, `half`, `quarter`, `eighth`, `sharp`, `flat`, `natural`, etc.) em símbolos musicais vetoriais padronizados.
