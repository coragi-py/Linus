# Backend — Linus

> API Django do Linus, organizada por aplicativos de domínio e responsável por identidade, regras de negócio, persistência, auditoria e integrações de backend.

## Escopo e arquitetura

O backend segue uma organização modular do Django. O pacote `core` concentra a inicialização e as configurações transversais; os demais aplicativos concentram modelos, regras, serialização, rotas, views, serviços e testes por domínio.

```text
backend/
├── core/            # settings, URLs raiz, exceções, ASGI/WSGI
├── accounts/        # usuário, autenticação, hash, recuperação e serviços
├── audit/           # modelo e serviço de auditoria
├── learning/        # aprendizagem, trilhas e/ou lições
├── music/           # entidades do domínio musical
├── exercises/       # exercícios
├── placement/       # triagem/avaliação inicial
├── progress/        # acompanhamento da evolução
├── gamification/    # mecanismos de gamificação
├── glossary/        # termos e definições
├── ai_gateway/      # fronteira para integração com IA
├── common/          # elementos compartilhados
├── requirements.txt
└── manage.py
```

## Configuração e execução

### Ambiente virtual e dependências

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\\Scripts\\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
```

### Ambiente

```bash
cp .env.example .env
```

Para Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure valores locais no `.env`, sem versioná-lo. A estrutura de variáveis identificada é:

```dotenv
# Django
DJANGO_SECRET_KEY=troque-por-uma-chave-longa-e-aleatoria
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend e CORS
CORS_ALLOWED_ORIGINS=http://localhost:8080
FRONTEND_URL=http://localhost:8080

# PostgreSQL
DB_ENGINE=django.db.backends.postgresql
DB_HOST=localhost
DB_PORT=5432
POSTGRES_DB=linus_db
POSTGRES_USER=linus_db_user
POSTGRES_PASSWORD=troque-por-uma-senha-local
DATABASE_URL=postgres://linus_db_user:troque-por-uma-senha-local@localhost:5432/linus_db

# Integrações externas
GEMINI_API_KEY=
GOOGLE_OAUTH2_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET_KEY=

# E-mail SMTP
BREVO_SMTP_HOST=smtp.example.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=
BREVO_SMTP_PASSWORD=
DEFAULT_FROM_EMAIL=nao-responda@example.com
```

### Banco e servidor

```bash
python manage.py migrate
python manage.py runserver
```

### Testes

```bash
python manage.py test
```

Há diretórios de testes em `accounts`, `audit`, `glossary`, `music` e `placement`. A existência de outros aplicativos sem testes específicos deve ser tratada como lacuna a ser avaliada.

## Módulos

| Módulo         | Arquivos                                                                        | Responsabilidade documentada                                                |
| -------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `core`         | `settings.py`, `urls.py`, `exceptions.py`, ASGI/WSGI                            | Inicialização, configurações, URL raiz e tratamento transversal de exceções |
| `accounts`     | `models.py`, `serializers.py`, `views.py`, `urls.py`, `hashers.py`, `services/` | Identidade, credenciais, autenticação, perfil e recuperação de senha        |
| `audit`        | `models.py`, `services/audit_service.py`, `views.py`                            | Eventos de auditoria e serviço de registro                                  |
| `learning`     | `models.py`, `serializers.py`, `urls.py`, `views.py`                            | Conteúdos, lições, trilhas ou fluxo pedagógico                              |
| `music`        | `models.py`, `serializers.py`, `urls.py`, `views.py`                            | Dados e operações do domínio musical                                        |
| `exercises`    | `models.py`, `views.py`                                                         | Exercícios; rota e serialização precisam de confirmação no código           |
| `placement`    | `models.py`, `serializers.py`, `urls.py`, `views.py`                            | Triagem ou nivelamento inicial                                              |
| `progress`     | `models.py`, `views.py`                                                         | Progresso do estudante                                                      |
| `gamification` | `models.py`, `views.py`                                                         | Regras de gamificação                                                       |
| `glossary`     | `models.py`, `serializers.py`, `urls.py`, `views.py`                            | Glossário musical                                                           |
| `ai_gateway`   | `models.py`, `views.py`                                                         | Camada de integração com IA                                                 |
| `common`       | `models.py`, `views.py`                                                         | Componentes compartilhados ou base comum                                    |

## Mapeamento de endpoints

A API utiliza o prefixo geral `/api/v1/`. Os endpoints abaixo foram informados para a branch atual. Métodos HTTP, payloads, respostas e permissões exatas devem ser confirmados nas respectivas views e serializers; quando não foram fornecidos, aparecem como “a confirmar”.

### Rotas raiz

| Prefixo              | Arquivo incluído                 | Responsabilidade                                          |
| -------------------- | -------------------------------- | --------------------------------------------------------- |
| `/admin/`            | `django.contrib.admin.site.urls` | Administração nativa do Django                            |
| `/api/v1/auth/`      | `accounts.urls`                  | Contas, autenticação, perfil, privacidade e administração |
| `/api/v1/placement/` | `placement.urls`                 | Triagem e nivelamento                                     |
| `/api/v1/learning/`  | `learning.urls`                  | Aprendizagem                                              |
| `/api/v1/glossary/`  | `glossary.urls`                  | Glossário                                                 |
| `/api/v1/music/`     | `music.urls`                     | Músicas                                                   |

### Accounts e autenticação

Base: `/api/v1/auth/`, definida em `backend/accounts/urls.py`.

| Endpoint                                  | View                       | Método    | Autenticação/permissão                                              | Finalidade                                 |
| ----------------------------------------- | -------------------------- | --------- | ------------------------------------------------------------------- | ------------------------------------------ |
| `/api/v1/auth/register/`                  | `RegisterView`             | POST      | Público, conforme implementação                                     | Cadastro de usuário                        |
| `/api/v1/auth/login/`                     | `LoginView`                | POST      | Público; credencial primária                                        | Login local                                |
| `/api/v1/auth/google/`                    | `GoogleAuthView`           | POST      | Público; OAuth Google                                               | Login/associação via Google OAuth          |
| `/api/v1/auth/verify-2fa/`                | `Verify2FAView`            | POST      | Estado de autenticação pendente ou usuário autenticado, a confirmar | Validação do segundo fator                 |
| `/api/v1/auth/password-reset/`            | `PasswordResetRequestView` | POST      | Público                                                             | Solicitação de redefinição de senha        |
| `/api/v1/auth/password-reset/confirm/`    | `PasswordResetConfirmView` | POST      | Token de recuperação, a confirmar                                   | Confirmação da nova senha                  |
| `/api/v1/auth/logout/`                    | `LogoutView`               | POST      | Usuário autenticado, a confirmar                                    | Encerramento/invalidação da sessão         |
| `/api/v1/auth/privacy/data/`              | `UserPrivacyDataView`      | GET       | Usuário autenticado; titular dos dados                              | Consulta dos dados pessoais                |
| `/api/v1/auth/privacy/revoke-consent/`    | `RevokeConsentView`        | POST      | Usuário autenticado                                                 | Revogação de consentimento                 |
| `/api/v1/auth/privacy/delete-account/`    | `DeleteAccountView`        | DELETE    | Usuário autenticado; confirmação recomendada                        | Exclusão da conta/dados, conforme política |
| `/api/v1/auth/profile/update/`            | `UpdateProfileView`        | PUT       | Usuário autenticado                                                 | Atualização do perfil                      |
| `/api/v1/auth/password/change/`           | `ChangePasswordView`       | PUT       | Usuário autenticado                                                 | Alteração da senha                         |
| `/api/v1/auth/admin/metrics/`             | `AdminSystemMetricsView`   | GET       | Administrador                                                       | Métricas administrativas do sistema        |
| `/api/v1/auth/admin/users/`               | `AdminSystemUsersView`     | GET/PATCH | Administrador                                                       | Listagem de usuários                       |
| `/api/v1/auth/admin/users/<str:user_id>/` | `AdminSystemUsersView`     | GET/PATCH | Administrador                                                       | Consulta/gestão de usuário específico      |

### Placement

Base: `/api/v1/placement/`, definida em `backend/placement/urls.py`.

| Endpoint                       | View             | Método | Autenticação/permissão | Finalidade                  |
| ------------------------------ | ---------------- | ------ | ---------------------- | --------------------------- |
| `/api/v1/placement/questions/` | `TriagemAPIView` | GET    | Any                    | Obter perguntas de triagem  |
| `/api/v1/placement/submit/`    | `TriagemAPIView` | POST   | Any                    | Enviar respostas de triagem |

### Glossário

Base: `/api/v1/glossary/`, definida em `backend/glossary/urls.py`.

| Endpoint base              | ViewSet            | Método/ação               | Autenticação/permissão | Finalidade                             |
| -------------------------- | ------------------ | ------------------------- | ---------------------- | -------------------------------------- |
| `/api/v1/glossary/`        | `GlossarioViewSet` | Padrão do `DefaultRouter` | IsAuthenticated        | Operações do glossário                 |
| `/api/v1/glossary/termos/` | `GlossarioViewSet` | Padrão do `DefaultRouter` | IsAuthenticated        | Operações de termos para administração |

O arquivo registra o mesmo `GlossarioViewSet` em `termos` e na raiz do router. Confirme se essa duplicidade é intencional e se as permissões diferenciam a tela pública da área administrativa. O comentário no código menciona chamadas administrativas em `/api/v1/glossary/termos` e chamadas públicas em `/api/v1/glossary`.

### Música

Base: `/api/v1/music/`, definida em `backend/music/urls.py`.

| Endpoint base            | ViewSet         | Método/ação               | Autenticação/permissão | Finalidade              |
| ------------------------ | --------------- | ------------------------- | ---------------------- | ----------------------- |
| `/api/v1/music/musicas/` | `MusicaViewSet` | Padrão do `DefaultRouter` | IsAuthenticated        | Operações sobre músicas |

### Learning

O `core/urls.py` inclui `learning.urls` em `/api/v1/learning/`, e a árvore confirma `backend/learning/urls.py`. Os endpoints específicos ainda não foram informados.

| Prefixo             | Arquivo            | Endpoints     | Situação      |
| ------------------- | ------------------ | ------------- | ------------- |
| `/api/v1/learning/` | `learning/urls.py` | A implementar | A implementar |

## Dependências

| Categoria                 | Uso                                                         |
| ------------------------- | ----------------------------------------------------------- |
| Django                    | Framework web, ORM, migrações, autenticação e administração |
| Django REST Framework     | Construção da API, serializers, permissões e respostas HTTP |
| Driver PostgreSQL         | Conexão com PostgreSQL                                      |
| Configuração por ambiente | Leitura de `.env` e URL de banco de dados                   |
| CORS                      | Controle de origens permitidas para o frontend              |
| E-mail                    | Recuperação de senha e notificações por SMTP (Brevo)        |
| OAuth                     | Login e associação (Google OAuth 2.0)                       |
| IA                        | Integração do `ai_gateway`                                  |
| Teste/cobertura           | Execução de testes e relatório de cobertura                 |

As versões instaladas devem ser obtidas diretamente de `requirements.txt`:

```bash
pip install -r requirements.txt
pip freeze
```

## Matriz de dados pessoais e permissões

### Processos de tratamento

| Processo                                                       | Finalidade                                                                                                                                             | Dados pessoais utilizados                                                                                                                                                | Base legal informada                                | Compartilhamento                                              | Medidas de segurança informadas                                                                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Gestão de Contas e Autenticação (login local e Google OAuth)   | Identificar a pessoa usuária, permitir acesso à conta, enviar comunicações de segurança, incluindo 2FA e redefinição de senha, e gerenciar credenciais | Nome completo, e-mail e ano de nascimento                                                                                | Execução de contrato                                | Brevo, para e-mails transacionais, e Google Cloud, para OAuth | HTTPS, controle de acesso por tokens JWT e validação de perfil via ORM do Django                                              |
| Acompanhamento Didático, Progresso e Prática Musical           | Salvar avanços nas trilhas, contabilizar erros/acertos para recomendação, registrar streaks, conceder badges e salvar notas gravadas no piano virtual  | Respostas de nivelamento, histórico de lições, taxa de acerto/erro, dias de acesso e sequências de notas musicais salvas | Execução de contrato                                | Nenhum; processamento pedagógico interno no backend           | Restrição de endpoints e consultas parametrizadas, validando acesso somente ao próprio progresso                              |
| Assistente Didático Inteligente (Google Gemini API)            | Processar dúvidas textuais e retornar explicações e apoio didático restritos à teoria musical abordada                                                 | Conteúdo textual dos prompts enviados no chat                                                                            | Execução de contrato                                | Google Cloud, por meio da Google Gemini API                   | Prompts limitados por rate limit e instruções de sistema que restringem as respostas ao escopo definido                       |
| Auditoria, Segurança da Informação e Resposta a Incidentes     | Manter trilhas de acesso e registrar ações críticas para mitigar fraudes e cumprir requisitos legais                                                   | Endereço IP de origem, logs de autenticação e carimbo de data/hora UTC                                                   | Cumprimento de obrigação legal e legítimo interesse | Apenas autoridades competentes mediante ordem judicial        | Proteção contra injeção SQL; logs append-only; não armazenar senhas nem tokens completos em texto puro                        |
| Atendimento aos Direitos dos Titulares (suporte e privacidade) | Receber, analisar e responder solicitações de exclusão, portabilidade, correção, dúvidas técnicas e dúvidas legais enviadas ao e-mail oficial          | E-mail do remetente, nome e conteúdo textual da solicitação                                                              | Cumprimento de obrigação legal                      | Provedor do e-mail, como Gmail/Google                         | Acesso ao e-mail oficial restrito à equipe de desenvolvimento do PFC, protegido por senha forte e autenticação em duas etapas |

### Regras de acesso e permissões

| Recurso/processo               | Atores autorizados                          | Regra mínima esperada                                                                                                              |
| ------------------------------ | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Conta própria                  | Pessoa usuária autenticada                  | Ler e alterar somente seus próprios dados, salvo operações administrativas documentadas                                            |
| Progresso, histórico e prática | Pessoa usuária autenticada                  | Consultas parametrizadas por usuário autenticado; nunca confiar em um `user_id` fornecido pelo cliente sem autorização server-side |
| Dados de terceiros             | Administrador autorizado, quando necessário | Permissão explícita, finalidade definida, registro de auditoria e menor privilégio                                                 |
| Rotas administrativas          | Administrador                               | Permissão imposta no backend; ocultar links no frontend não é suficiente                                                           |
| Auditoria                      | Equipe autorizada                           | Leitura restrita, sem alteração de eventos por usuários comuns                                                                     |
| Solicitações de titulares      | Equipe responsável/encarregado              | Verificar identidade do solicitante, registrar protocolo, cumprir prazo e evitar divulgação indevida                               |
| Gemini API                     | Serviço backend                             | Chave somente no backend; não expor `GEMINI_API_KEY` ao navegador; limitar conteúdo e taxa                                         |
| Brevo                          | Serviço backend/e-mail                      | Credenciais somente em variáveis protegidas; não incluir tokens completos nos logs                                                 |
| Google OAuth                   | Serviço de autenticação                     | Validar tokens no backend, restringir redirect URIs e não confiar somente em dados recebidos do cliente                            |

## Referências técnicas

- Django Documentation — security e password management.
- OWASP Application Security Verification Standard (ASVS).
- OWASP Authentication Cheat Sheet e Forgot Password Cheat Sheet.
- Lei nº 13.709/2018 (LGPD).
- NIST SP 800-63B — Digital Identity Guidelines.
