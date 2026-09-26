# Linus

> Plataforma web de apoio ao aprendizado de música, organizada como uma aplicação cliente-servidor com frontend TypeScript e API backend em Django.

## Visão geral

O Linus reúne recursos de aprendizagem musical, trilhas e lições, prática, glossário, triagem de nível, acompanhamento de progresso, gamificação e áreas administrativas. O projeto foi estruturado em dois componentes principais:

- **Frontend:** aplicação TypeScript com Vite e TanStack Router, responsável pelas telas, interação, validações de experiência e consumo da API.
- **Backend:** API Django modular, responsável por identidade, regras de domínio, persistência, auditoria e serviços de segurança.

## Índice

- [Linus](#linus)
  - [Visão geral](#visão-geral)
  - [Índice](#índice)
  - [1. Funcionalidades mapeadas](#1-funcionalidades-mapeadas)
  - [2. Arquitetura](#2-arquitetura)
  - [Estrutura de diretórios](#estrutura-de-diretórios)
  - [3. Pré-requisitos](#3-pré-requisitos)
  - [4. Configuração local](#4-configuração-local)
    - [1. Obter o código](#1-obter-o-código)
    - [2. Preparar as variáveis de ambiente](#2-preparar-as-variáveis-de-ambiente)
    - [3. Iniciar os serviços do Docker](#3-iniciar-os-serviços-do-docker)
    - [4. Configurar e iniciar o backend](#4-configurar-e-iniciar-o-backend)
    - [5. Configurar e iniciar o frontend](#5-configurar-e-iniciar-o-frontend)
    - [6. Parar ou limpar o ambiente](#6-parar-ou-limpar-o-ambiente)
  - [5. Segurança e conformidade](#5-segurança-e-conformidade)
  - [6. Qualidade e testes](#6-qualidade-e-testes)
  - [7. Erros e soluções de problemas conhecidos](#7-erros-e-soluções-de-problemas-conhecidos)
  - [8. Documentação complementar](#8-documentação-complementar)
  - [9. Licença](#9-licença)
  - [10. Equipe do projeto](#10-equipe-do-projeto)

## 1. Funcionalidades mapeadas

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

## 2. Arquitetura

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

## 3. Pré-requisitos

- Git
- Python 3.12 ou versão compatível com as dependências do backend
- Node.js LTS e npm
- PostgreSQL
- Docker e Docker Compose, caso opte por executar os serviços em contêineres

## 4. Configuração local

### 1. Obter o código

```bash
git clone https://github.com/coragi-py/Linus.git
cd Linus
git checkout nome-da-branch
```

### 2. Preparar as variáveis de ambiente

A partir da raiz do projeto, copie o exemplo do backend e substitua os placeholders por valores locais. Não versione `.env`.

```bash
cp backend/.env.example backend/.env
```

No PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

### 3. Iniciar os serviços do Docker

**Antes de executar `migrate`**, na raiz do repositório:

```bash
docker compose up -d
```

O `-d` deixa os serviços em segundo plano. Confira se subiram e, se necessário, examine os logs:

```bash
docker compose ps
docker compose logs --tail=100
```

### 4. Configurar e iniciar o backend

Em um terminal, partindo da raiz:

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

Instale as dependências e aplique as migrações **após o banco estar pronto**:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 5. Configurar e iniciar o frontend

Em outro terminal partindo da raiz:

```bash
cd frontend
npm ci
npm run dev
```

Use `npm install` apenas se a instalação reprodutível por `npm ci` não for adequada ao seu ambiente.

### 6. Parar ou limpar o ambiente

Para interromper os contêineres sem descartar os dados persistidos nos volumes:

```bash
docker compose down
```

**Somente se precisar reiniciar o ambiente do zero**, na raiz do projeto:

```bash
docker compose down -v
```

**Atenção:** `down -v` remove também os volumes gerenciados pelo Compose, incluindo dados persistidos do PostgreSQL caso o banco use um volume do projeto. Isso pode apagar contas, conteúdo e histórico local de forma irrecuperável sem backup. Não execute em ambiente com dados que você precisa preservar. O comando não substitui backup e não apaga automaticamente arquivos externos ou volumes declarados como externos. Para retomar do zero, execute `docker compose up -d` e, após o banco ficar pronto, `python manage.py migrate` novamente.

---

## 5. Segurança e conformidade

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

## 6. Qualidade e testes

A árvore do projeto contém testes em `accounts`, `audit`, `glossary`, `music` e `placement`, além de workflow em `.github/workflows/testes-backend.yml`. Antes da entrega, execute ao menos:

```bash
cd backend
python manage.py test
```

Valide também fluxos críticos manualmente: registro, login, logout, recuperação de senha, permissões administrativas, consulta de dados pessoais, operação de trilhas/lições e tratamento de falhas.

## 7. Erros e soluções de problemas conhecidos

Os itens abaixo são cenários frequentes de configuração local e **não** um registro de bugs confirmados no projeto. Antes de alterar código, confira `docker compose ps`, os logs, as portas e as variáveis de ambiente.

| Sintoma                                                            | Causa possível                                                                       | Verificação e solução                                                                                                                                                                              |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `connection refused` ou `could not connect to server` no `migrate` | Banco parado, ainda iniciando, host/porta incorretos                                 | Rode `docker compose up -d`, confira `docker compose ps` e `docker compose logs --tail=100`; aguarde o banco e revise `DB_HOST`, `DB_PORT` e `DATABASE_URL` conforme Django local ou em contêiner. |
| `password authentication failed` no PostgreSQL                     | Senha, usuário ou URL divergentes; volume antigo inicializado com outras credenciais | Compare `.env`, `DATABASE_URL` e configuração do Compose. Se houver dados importantes, preserve-os e corrija credenciais sem apagar volumes; `down -v` só em ambiente descartável.                 |
| `port is already allocated`                                        | Porta já ocupada por outro serviço                                                   | Identifique o processo/contêiner na porta, pare-o ou mude o mapeamento no Compose e atualize `.env` correspondente.                                                                                |
| `no such table` ou tabela ausente                                  | Migrações não aplicadas na mesma base acessada pela API                              | Confirme que banco está pronto, revise a URL e execute `python manage.py migrate` no ambiente que executa o backend.                                                                               |
| Erro de CORS no navegador                                          | `CORS_ALLOWED_ORIGINS` não corresponde à origem real do frontend                     | Confira esquema (`http`/`https`), host e porta informados pelo Vite; atualize a variável e reinicie o backend.                                                                                     |
| Frontend não acessa a API                                          | URL incorreta, backend não iniciado ou porta divergente                              | Confirme `runserver`, endpoint requisitado e configuração de URL usada no frontend; use DevTools para identificar a requisição que falhou.                                                         |
| Erro de configuração do Django ou `SECRET_KEY` ausente             | `.env` não criado ou não carregado                                                   | Confirme a localização de `backend/.env`, variáveis exigidas em `core/settings.py` e reinicie o processo. Não coloque a chave no Git.                                                              |
| Falha de envio de e-mail                                           | SMTP não configurado, credencial inválida ou serviço indisponível                    | Confira as variáveis `BREVO_SMTP_*`, remetente autorizado e logs do backend; nunca imprima senhas ou tokens completos.                                                                             |
| `npm ci` falha                                                     | Node/npm incompatíveis ou `package-lock.json` fora de sincronia                      | Confira as versões esperadas pelo `package.json`, tente novamente com ambiente limpo e ajuste lockfile somente se necessário e intencional.                                                        |
| PowerShell bloqueia ativação do `.venv`                            | Política local de execução de scripts                                                | Use um terminal autorizado ou chame diretamente `.venv\Scripts\python.exe manage.py migrate`; não altere políticas globais sem necessidade.                                                        |
| Dados desapareceram depois de reiniciar                            | Execução anterior de `docker compose down -v` ou ausência de volume persistente      | Verifique volumes em `docker-compose.yml`; restaure backup, se existir. `down -v` foi projetado para remoção de volumes do projeto.                                                                |

## 8. Documentação complementar

- [`backend/README.md`](backend/README.md): arquitetura da API, módulos, endpoints, dependências e matriz de segurança.
- [`frontend/README.md`](frontend/README.md): rotas, regras de negócio de interface, validações, controles de UX e segurança no cliente.
- [Documentação da API](backend/docs/API.md): métodos, payloads e respostas HTTP.

## 9. Licença

Consulte o arquivo [`LICENSE`](LICENSE) do repositório.

## 10. Equipe do projeto

**Alunos:**

- Anny Gabriely Souza do Nascimento
- Antonio Luiz Lins Neto
- Fábio Yuuki Saruwataru

**Orientador:**

- Prof. Leonardo Cavalcante Alvino

**Co-orientador:**

- Prof. Alessandro da Silva Horas

**Instituição:**

- UMC - Universidade de Mogi das Cruzes (2026)
