# Linus

> Plataforma web de apoio ao aprendizado de música, organizada como uma aplicação cliente-servidor com frontend TypeScript e API backend em Django.

## Visão geral

O Linus reúne recursos de aprendizagem musical, trilhas e lições, prática, glossário, triagem de nível, acompanhamento de progresso, gamificação e áreas administrativas. O projeto foi estruturado em dois componentes principais:

- **Frontend:** aplicação TypeScript com Vite e TanStack Router, responsável pelas telas, interação, validações de experiência e consumo da API.
- **Backend:** API Django modular, responsável por identidade, regras de domínio, persistência, auditoria e serviços de segurança.

## Funcionalidades mapeadas

| Área                 | Responsabilidade                                                              |
| -------------------- | ----------------------------------------------------------------------------- |
| Contas               | Cadastro, autenticação, recuperação de senha e gestão do perfil do usuário    |
| Aprendizagem         | Trilhas, lições e conteúdos de aprendizagem                                   |
| Exercícios e prática | Execução de atividades e recursos de prática musical                          |
| Música               | Estruturas e regras do domínio musical                                        |
| Glossário            | Consulta de termos e conceitos musicais                                       |
| Triagem              | Identificação ou classificação inicial do usuário                             |
| Progresso            | Acompanhamento da evolução do estudante                                       |
| Gamificação          | Mecânicas de progresso, recompensas ou indicadores                            |
| Auditoria            | Registro de eventos relevantes do sistema                                     |
| Administração        | Gestão de conteúdo e de parâmetros do sistema                                 |
| Assistente de IA     | Componente de interface e módulo `ai_gateway` reservado para integração de IA |

## Arquitetura

```text
Navegador
    |
    | HTTP(S) / JSON
    v
Frontend (TypeScript + Vite + TanStack Router)
    |- rotas e páginas
    |- componentes de interface
    |- contexto de aplicação
    |- recursos de áudio e música
    |
    v
Backend (Django)
    |- core: configurações, URLs e exceções
    |- accounts: identidade, credenciais e recuperação de senha
    |- módulos de domínio: learning, music, exercises, glossary,
    |   placement, progress e gamification
    |- audit: eventos e serviços de auditoria
    |- ai_gateway: limite de integração com serviços de IA
    |
    v
PostgreSQL
```

A divisão por aplicativos Django favorece separação de responsabilidades. O frontend adota roteamento baseado em arquivos, com páginas públicas, autenticadas e administrativas agrupadas em `src/routes`.

## Estrutura de diretórios

```text
Linus/
├── .github/workflows/        # Automação de testes do backend
├── backend/
│   ├── core/                 # Configuração Django, URLs e exceções
│   ├── accounts/             # Usuários, autenticação e segurança
│   ├── audit/                # Auditoria e serviços de log
│   ├── learning/             # Trilhas, lições e aprendizagem
│   ├── music/                # Domínio musical
│   ├── exercises/            # Exercícios
│   ├── placement/            # Triagem
│   ├── progress/             # Progresso
│   ├── gamification/         # Gamificação
│   ├── glossary/             # Glossário
│   ├── ai_gateway/           # Integração de IA
│   ├── requirements.txt      # Dependências Python
│   └── manage.py             # CLI do Django
├── frontend/
│   ├── src/components/       # Componentes reutilizáveis e UI
│   ├── src/context/          # Estado compartilhado
│   ├── src/lib/              # Utilitários, áudio e regras auxiliares
│   ├── src/routes/           # Rotas e páginas da aplicação
│   ├── package.json          # Dependências e scripts Node.js
│   └── vite.config.ts        # Configuração de build/desenvolvimento
├── docker-compose.yml        # Orquestração local por Docker (PostgreSQL)
└── README.md                 # Documentação principal
```

## Pré-requisitos

- Git
- Python 3.12 ou versão compatível com as dependências do backend
- Node.js LTS e npm
- PostgreSQL
- Docker e Docker Compose, caso opte por executar os serviços em contêineres

## Configuração local

### 1. Obter o código

```bash
git clone https://github.com/coragi-py/Linus.git
cd Linus
git checkout nome-da-branch
```

### 2. Configurar o backend

```bash
cd backend
python -m venv .venv
```

Ative o ambiente virtual:

```bash
# Linux/macOS
source .venv/bin/activate

# Windows PowerShell
.venv\Scripts\Activate.ps1
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie o arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Preencha as variáveis com credenciais **locais e não versionadas**. Consulte [`backend/README.md`](backend/README.md) para a descrição dos grupos de configuração.

Execute as migrações e inicie a API:

```bash
python manage.py migrate
python manage.py runserver
```

### 3. Configurar o frontend

Em outro terminal:

```bash
cd frontend
npm ci
npm run dev
```

Use `npm install` apenas se a instalação reprodutível por `npm ci` não for adequada ao seu ambiente.

A configuração anexada indica desenvolvimento local com frontend em `http://localhost:8080`; confirme a porta efetiva exibida pelo Vite e mantenha CORS e `FRONTEND_URL` coerentes.

### 4. Docker Compose

O repositório possui `docker-compose.yml`. Revise os serviços, portas, volumes e variáveis antes de iniciar, pois a configuração pode ser específica ao ambiente do projeto:

```bash
docker compose up --build
```

## Variáveis de ambiente

Nunca versione o arquivo `.env`. O exemplo deve conter somente nomes de variáveis, valores fictícios e comentários. Em linhas gerais, o backend utiliza grupos para:

| Grupo                | Finalidade                                                 |
| -------------------- | ---------------------------------------------------------- |
| Django               | Chave secreta, depuração e hosts autorizados               |
| CORS e frontend      | Origens permitidas e URL pública do frontend               |
| Banco de dados       | Driver, host, porta, base, usuário, senha e URL de conexão |
| Integrações externas | Chaves de IA e OAuth                                       |
| E-mail               | Servidor SMTP, porta, conta emissora e credencial SMTP     |

Se uma chave, senha, token OAuth, credencial SMTP ou URL de banco com senha foi exposta fora do ambiente local, **revogue e gere novos valores** antes de qualquer publicação ou entrega.

## Segurança e conformidade

Módulo dedicado de contas, hasher customizado, serviço de segurança, recuperação por e-mail, módulo de auditoria e testes em diversos aplicativos.

A validação cobre:

- Algoritmo de hash, custo, salt e armazenamento de senhas.
- Fluxo de login, expiração de sessão ou token, logout, 2FA e mitigação contra força bruta.
- Geração, expiração, uso único e auditoria de tokens de recuperação de senha.
- HTTPS/TLS em produção, redirecionamento HTTP → HTTPS e cabeçalhos de segurança.
- Proteção de segredos, dados em repouso e chaves criptográficas.
- Inventário de dados pessoais, finalidade, consentimento, revogação e direitos do titular conforme LGPD.
- Integridade, retenção e análise dos logs de auditoria.

Consulte os READMEs de backend e frontend para o inventário de evidências.

## Qualidade e testes

A árvore do projeto contém testes em `accounts`, `audit`, `glossary`, `music` e `placement`, além de workflow em `.github/workflows/testes-backend.yml`. Antes da entrega, execute ao menos:

```bash
cd backend
python manage.py test
```

Também valide fluxos críticos manualmente: registro, login, logout, recuperação de senha, permissões administrativas, consulta de dados pessoais, operação de trilhas/lições e tratamento de falhas.

## Documentação complementar

- [`backend/README.md`](backend/README.md): arquitetura da API, módulos, endpoints, dependências e matriz de segurança.
- [`frontend/README.md`](frontend/README.md): rotas, regras de negócio de interface, validações, controles de UX e segurança no cliente.

## Licença

Consulte o arquivo [`LICENSE`](LICENSE) do repositório.
