# Backend — Linus

API REST do sistema Linus desenvolvida em Python com Django e Django REST Framework, estruturada segundo a arquitetura de monólito modular.

## Arquitetura de Módulos

O pacote `core` centraliza as configurações (`settings.py`), o roteamento raiz sob o prefixo `/api/v1/` (`urls.py`) e o tratamento customizado de exceções (`exceptions.py`). As regras de negócio estão divididas nos seguintes aplicativos:

| Módulo         | Tabelas Principais (`db_table`)                                                      | Responsabilidade                                                                                |
| -------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `accounts`     | `TB_USUARIO`, `TB_TOKEN_2FA`, `TB_TOKEN_RECUPERACAO`                                 | Gestão de usuários, RBAC, hash PBKDF2, JWT, Google OAuth 2.0, 2FA, LGPD e disparo de e-mails    |
| `placement`    | `TB_PERGUNTA_TRIAGEM`, `TB_OPCAO_TRIAGEM`, `TB_SESSAO_TRIAGEM`, `TB_TRIAGEM_INICIAL` | Questionário de nivelamento pedagógico, cálculo determinístico de nível e sessão temporária     |
| `learning`     | `TB_MODULO`, `TB_AULA`                                                               | Unidades didáticas, lições da trilha e orquestração dos endpoints de estudo                     |
| `exercises`    | `TB_EXERCICIO`, `TB_TENTATIVA_EXERCICIO`                                             | Exercícios interativos (`note-reading`, `multiple-choice`, `keyboard`, `builder`) e tentativas  |
| `progress`     | `TB_PROGRESSO_AULA`                                                                  | Registro de aulas concluídas e cálculo de taxa de acerto por estudante                          |
| `gamification` | `TB_GAMIFICACAO_PERFIL`, `TB_BADGE`, `TB_USUARIO_BADGE`                              | Controle de ofensiva diária (_streak_), pontuação, concessão de medalhas e lembretes por e-mail |
| `glossary`     | `TB_GLOSSARIO`                                                                       | Base de termos musicais, categorias e identificadores/diagramas vetoriais                       |
| `music`        | `TB_MUSICA`                                                                          | Persistência de gravações de notas realizadas no _Playground_                                   |
| `ai_gateway`   | —                                                                                    | Proxy seguro de comunicação com a Google Gemini API restrito ao escopo de teoria musical        |
| `audit`        | `TB_AUDITORIA`                                                                       | Registro imutável (_append-only_) de eventos críticos e de segurança com IP, User-Agent e UTC   |

---

## Variáveis de Ambiente (`.env`)

Crie o arquivo `backend/.env` a partir de `backend/.env.example`:

```dotenv
# Django
DJANGO_SECRET_KEY=chave-secreta-aleatoria
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend e CORS
CORS_ALLOWED_ORIGINS=http://localhost:8080
FRONTEND_URL=http://localhost:8080

# Banco de Dados PostgreSQL
DB_ENGINE=django.db.backends.postgresql
DB_HOST=localhost
DB_PORT=5432
POSTGRES_DB=linus_db
POSTGRES_USER=linus_db_user
POSTGRES_PASSWORD=senha_local
DATABASE_URL=postgres://linus_db_user:senha_local@localhost:5432/linus_db

# Integrações Externas
GEMINI_API_KEY=
GOOGLE_OAUTH2_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET_KEY=

# Mensageria Transacional (Brevo SMTP)
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=
BREVO_SMTP_PASSWORD=
DEFAULT_FROM_EMAIL=noreply@linus.app.br

```

---

## Execução, Migrações e Comandos Administrativos

### Instalar dependências e aplicar migrações

```bash
python -m venv .venv
# Linux/macOS: source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```

### Carga inicial automática (_Seed Migrations_)

O comando `python manage.py migrate` executa automaticamente as seguintes cargas de dados:

- `learning/migrations/0002_seed_curriculum.py`: 4 unidades didáticas, 8 lições completas (com guia teórico e partitura demonstrativa), 32 exercícios interativos e 3 medalhas iniciais.
- `placement/migrations/0002_seed_triagem.py`: 8 questões progressivas de nivelamento pedagógico (texto e partitura VexFlow) com alternativas e pesos.
- `glossary/migrations/0002_seed_glossario.py`: 31 termos fundamentais de teoria musical com definições aprofundadas e identificadores VexFlow.
- `music/migrations/0002_seed_public_musics.py`: 3 melodias populares públicas (`id_usuario=None`) como amostras demonstrativas no Playground.
- `accounts/migrations/0004_seed_1000_users.py`: 1.000 contas de estudantes com senhas e *salts* PBKDF2-SHA256 individualizados, distribuídas nos últimos 7 dias para validação de métricas e testes de carga.

### Disparo de lembretes de ofensiva (_Streak_) via CLI

Para verificar alunos com ofensiva ativa que ainda não estudaram no dia corrente e enviar o lembrete via Brevo SMTP:

```bash
python manage.py send_streak_reminders

```

---

## Controle de Acesso Baseado em Papéis (RBAC)

O modelo `CustomUser` (`TB_USUARIO`) define três papéis no sistema:

| Papel (`role`)   | Descrição                 | Permissões no Backend                                                                                    |
| ---------------- | ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `estudante`      | Aluno padrão              | Consome trilhas, submete exercícios e triagem, gerencia o próprio perfil/LGPD, usa Playground e IA.      |
| `admin-conteudo` | Administrador de Conteúdo | Leitura e escrita (CRUD) em módulos, aulas, exercícios, questões de triagem e termos do glossário.       |
| `admin-sistema`  | Administrador de Sistema  | Acesso às métricas gerenciais, listagem de usuários, alteração de papéis (`role`) e suspensão de contas. |

---

## Matriz de Tratamento de Dados Pessoais e Conformidade LGPD

| Processo                                                   | Finalidade                                                                                                      | Dados Pessoais Utilizados                                                              | Base Legal (LGPD)                                   | Compartilhamento                  | Medidas de Segurança                                                                |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------- |
| Gestão de Contas e Autenticação (Local e Google OAuth 2.0) | Identificar o usuário, autenticar sessões, enviar OTP 2FA, recuperar senha e gerenciar permissões (RBAC)        | Nome/nickname, e-mail e ano de nascimento                                              | Execução de contrato e Consentimento                | Brevo (SMTP) e Google (OAuth 2.0) | HTTPS/TLS, senhas com hash PBKDF2 + salt, tokens JWT de curta duração e blacklist   |
| Acompanhamento Pedagógico, Progresso e Gamificação         | Registrar evolução na trilha, calcular precisão por tópico, contabilizar _streaks_, conceder medalhas e músicas | Respostas de triagem, tentativas de exercícios, aulas concluídas e sequências de notas | Execução de contrato                                | Nenhum (processamento interno)    | Isolamento por `request.user` no ORM e transações atômicas (`transaction.atomic()`) |
| Assistente Didático de Dúvidas (`ai_gateway`)              | Responder dúvidas restritas ao escopo introdutório de teoria musical                                            | Texto da dúvida submetida pelo estudante                                               | Execução de contrato                                | Google Gemini API                 | Chave de API oculta no backend, prompt de sistema restritivo e sem envio de PII     |
| Auditoria e Segurança da Informação (`audit`)              | Rastreabilidade de eventos críticos, prevenção a fraudes e investigação de incidentes                           | ID do usuário, endereço IP, User-Agent, ação executada e timestamp UTC                 | Cumprimento de obrigação legal / Legítimo interesse | Nenhum                            | Tabela `TB_AUDITORIA` imutável (_append-only_) com bloqueio de `UPDATE` e `DELETE`  |

---

## Testes Automatizados e Cobertura

Todos os módulos de domínio contam com testes automatizados integrados ao pipeline `.github/workflows/testes-backend.yml`:

```bash
coverage run --omit="*/migrations/*,*/tests/*,manage.py" manage.py test accounts audit glossary music placement learning exercises gamification progress
coverage report -m --fail-under=70

```
