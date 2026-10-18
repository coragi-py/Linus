# Linus

Plataforma web interativa para o ensino autônomo e introdutório de teoria musical, desenvolvida como Projeto Final de Curso (PFC) em Engenharia de Software na Universidade de Mogi das Cruzes (UMC).

## Visão Geral

O **Linus** integra conteúdos didáticos progressivos, triagem inicial de nivelamento, piano virtual controlado pelo teclado físico com síntese de áudio em tempo real, partituras dinâmicas, exercícios com validação imediata, glossário visual, área de prática livre (_Playground_), gamificação leve e assistente didático baseado em IA.

A solução adota uma arquitetura web desacoplada:

- **Frontend (`frontend/`):** Single Page Application (SPA) em React, TypeScript, Vite, TanStack Router, Tailwind CSS, Tone.js e VexFlow.
- **Backend (`backend/`):** Monólito modular em Python, Django e Django REST Framework, com persistência em PostgreSQL, autenticação JWT/Google OAuth 2.0, envio de e-mails transacionais via Brevo SMTP e integração com Google Gemini API.

---

## Arquitetura e Estrutura de Diretórios

```text
Linus/
├── .github/workflows/
│   └── testes-backend.yml    # Pipeline CI/CD (testes automatizados e cobertura)
├── backend/
│   ├── core/                 # Configurações globais, roteamento raiz (/api/v1/) e exceções
│   ├── accounts/             # Usuários (RBAC), autenticação JWT/OAuth, 2FA, LGPD e e-mails
│   ├── placement/            # Triagem inicial de nivelamento pedagógico
│   ├── learning/             # Unidades (módulos) e lições (aulas) da trilha didática
│   ├── exercises/            # Exercícios interativos e histórico de tentativas
│   ├── progress/             # Acompanhamento de conclusão de aulas e taxas de acerto
│   ├── gamification/         # Ofensiva diária (streaks), pontuação, badges e lembretes
│   ├── glossary/             # Termos musicais, definições e diagramas vetoriais
│   ├── music/                # Gravação de sequências musicais no Playground
│   ├── ai_gateway/           # Integração protegida com a Google Gemini API
│   ├── audit/                # Logs imutáveis de auditoria e eventos de segurança
│   ├── common/               # Recursos compartilhados
│   ├── docs/API.md           # Especificação dos endpoints REST
│   ├── manage.py
│   └── requirements.txt
├── docs/                     # Documentação complementar de integrações e BPMN
├── frontend/
│   ├── src/components/       # Componentes de domínio (Stave, VirtualPiano, AppShell, AiAssistant) e UI
│   ├── src/context/          # Estado global e sincronização com a API (LinusContext)
│   ├── src/data/             # Estruturas tipadas e currículo de fallback
│   ├── src/lib/              # Síntese de áudio (Tone.js), teoria musical e utilitários
│   ├── src/routes/           # Rotas da aplicação (TanStack Router)
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml        # Orquestração local do banco de dados PostgreSQL
└── README.md

```

---

## Pré-requisitos

- **Git**
- **Python 3.11+**
- **Node.js 20+ (LTS)** e **npm**
- **Docker** e **Docker Compose** (ou instância local do PostgreSQL 15+)

---

## Configuração e Execução Local

### 1. Clonar o repositório e configurar variáveis de ambiente

```bash
git clone [https://github.com/coragi-py/Linus.git](https://github.com/coragi-py/Linus.git)
cd Linus
cp backend/.env.example backend/.env

```

No Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env

```

Preencha os valores locais no arquivo `backend/.env`.

### 2. Iniciar o banco de dados PostgreSQL via Docker

```bash
docker compose up -d

```

### 3. Configurar e iniciar o Backend (Porta 8000)

```bash
cd backend
python -m venv .venv

# Ativar ambiente virtual (Linux/macOS)
source .venv/bin/activate

# Ativar ambiente virtual (Windows PowerShell)
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```

> Ao executar `python manage.py migrate`, o sistema cria todas as tabelas e executa automaticamente as _migrations_ de carga inicial: 4 unidades didáticas, 8 lições com guia teórico e partitura demonstrativa, 32 exercícios interativos, 3 medalhas, 8 questões de triagem, 31 termos do glossário musical e 1.000 contas de estudantes.

### 4. Configurar e iniciar o Frontend (Porta 8080)

Em um novo terminal:

```bash
cd frontend
npm install
npm run dev

```

A aplicação estará disponível em `http://localhost:8080`.

---

## Testes e Qualidade

Para executar a suíte de testes automatizados e verificar a cobertura de código do backend:

```bash
cd backend
coverage run --omit="*/migrations/*,*/tests/*,manage.py" manage.py test accounts audit glossary music placement learning exercises gamification progress
coverage report -m

```

Para validar a tipagem e o linter do frontend:

```bash
cd frontend
npm run lint
npm run build

```

---

## Documentação Complementar

- [Documentação do Backend](backend/README.md): módulos Django, variáveis de ambiente, comandos administrativos, RBAC e conformidade LGPD.
- [Documentação do Frontend](frontend/README.md): rotas, componentes musicais (`Stave`, `VirtualPiano`, `GlossaryDiagram`) e fluxo de estado.
- [Referência da API REST](backend/docs/API.md): contratos de requisição e resposta de todos os endpoints `/api/v1/`.

---

## Licença

Distribuído sob a licença definida no arquivo [`LICENSE`](LICENSE).

## Autores e Orientação

**Autores:**

- Anny Gabriely Souza do Nascimento
- Antonio Luiz Lins Neto
- Fábio Yuuki Saruwataru

**Orientação:**

- **Orientador:** Prof. Leonardo Cavalcante Alvino
- **Coorientador:** Prof. Alessandro da Silva Horas

**Instituição:** Universidade de Mogi das Cruzes (UMC) — Bacharelado em Engenharia de Software (2026).
