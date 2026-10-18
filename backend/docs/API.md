# Documentação da API REST — Linus

Todos os endpoints utilizam o prefixo base `/api/v1/` e trafegam dados em formato JSON.
Para rotas autenticadas, envie o cabeçalho HTTP:

```http
Authorization: Bearer <access_token>
Content-Type: application/json

```

---

## Sumário de Prefixos

| Prefixo              | Módulo Django                                       | Descrição                                                                         |
| -------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------- |
| `/api/v1/auth/`      | `accounts`                                          | Cadastro, login, 2FA, Google OAuth, recuperação de senha, LGPD e gestão de contas |
| `/api/v1/placement/` | `placement`                                         | Triagem de nivelamento e CRUD administrativo de questões                          |
| `/api/v1/learning/`  | `learning`, `exercises`, `progress`, `gamification` | Módulos, aulas, exercícios, tentativas, conclusão de lição, progresso e streaks   |
| `/api/v1/glossary/`  | `glossary`                                          | Termos e diagramas do glossário musical                                           |
| `/api/v1/music/`     | `music`                                             | Gravações de notas musicais do Playground                                         |
| `/api/v1/ai/`        | `ai_gateway`                                        | Assistente didático de dúvidas (Google Gemini API)                                |

---

## 1. Autenticação, Perfil, LGPD e Administração (`/api/v1/auth/`)

### 1.1. Cadastro de Usuário

`POST /api/v1/auth/register/` — **Permissão:** Pública (`AllowAny`)

**Request**

```json
{
  "nome": "Ana Silva",
  "email": "ana@exemplo.com",
  "password": "SenhaForte!123",
  "ano_nascimento": 2002,
  "terms_accepted": true,
  "terms_version": "v1.0"
}
```

**Response `201 Created**`

```json
{
  "refresh": "<jwt_refresh>",
  "access": "<jwt_access>",
  "message": "Conta criada com sucesso."
}
```

### 1.2. Login Local

`POST /api/v1/auth/login/` — **Permissão:** Pública (`AllowAny`)

**Request**

```json
{
  "email": "ana@exemplo.com",
  "password": "SenhaForte!123",
  "terms_accepted": false,
  "terms_version": ""
}
```

**Responses**

- `200 OK`: `{ "refresh": "<jwt_refresh>", "access": "<jwt_access>" }` (Quando `is_2fa_enabled = false`)
- `202 Accepted`: `{ "status": "2fa_required", "message": "Código 2FA enviado para o e-mail." }`
- `403 Forbidden` (Termos revogados): `{ "status": "terms_required", "message": "Consentimento revogado. Você precisa aceitar os Termos de Uso novamente." }`
- `403 Forbidden` (Conta suspensa): `{ "error": "Sua conta foi suspensa pelo administrador do sistema." }`
- `401 Unauthorized`: `{ "error": "Credenciais inválidas." }`

### 1.3. Verificação de Segundo Fator (2FA)

`POST /api/v1/auth/verify-2fa/` — **Permissão:** Pública (`AllowAny`)

**Request**

```json
{
  "email": "ana@exemplo.com",
  "otp": "123456"
}
```

**Response `200 OK**`

```json
{
  "refresh": "<jwt_refresh>",
  "access": "<jwt_access>"
}
```

### 1.4. Login / Cadastro com Google OAuth 2.0

`POST /api/v1/auth/google/` — **Permissão:** Pública (`AllowAny`)

**Request**

```json
{
  "id_token": "<google_id_token>",
  "name": "Ana Silva",
  "terms_accepted": true,
  "terms_version": "v1.0",
  "ano_nascimento": 2002
}
```

**Responses:** `200 OK` (autenticado), `201 Created` (registrado), `202 Accepted` (`2fa_required`) ou `403 Forbidden` (`registration_required` / `terms_required`).

### 1.5. Recuperação de Senha

- **Solicitar Link:** `POST /api/v1/auth/password-reset/`
- **Request:** `{ "email": "ana@exemplo.com" }`
- **Response `200 OK`:** `{ "message": "Se o e-mail estiver cadastrado, enviaremos um link de recuperação." }`

- **Confirmar Nova Senha:** `POST /api/v1/auth/password-reset/confirm/`
- **Request:** `{ "email": "ana@exemplo.com", "token": "<token>", "new_password": "NovaSenhaForte!123" }`
- **Response `200 OK`:** `{ "message": "Senha redefinida com sucesso." }`

### 1.6. Logout

`POST /api/v1/auth/logout/` — **Permissão:** Autenticado (`IsAuthenticated`)

**Request**

```json
{
  "refresh": "<jwt_refresh>"
}
```

**Response `205 Reset Content**`

```json
{
  "message": "Sessão encerrada com sucesso."
}
```

### 1.7. Perfil e Direitos do Titular (LGPD)

Todas as rotas abaixo exigem `IsAuthenticated`:

- **Exportar Dados Pessoais:** `GET /api/v1/auth/privacy/data/`
- **Response `200 OK`:** Retorna `id`, `email`, `ano_nascimento`, `role`, `is_2fa_enabled`, `termos_de_uso` e `metadados`.

- **Revogar Consentimento:** `POST /api/v1/auth/privacy/revoke-consent/`
- **Response `200 OK`:** `{ "message": "Consentimento revogado. Seu acesso à plataforma foi suspenso." }`

- **Excluir e Anonimizar Conta:** `DELETE /api/v1/auth/privacy/delete-account/`
- **Response `200 OK`:** `{ "message": "Sua conta e dados pessoais foram excluídos e anonimizados com sucesso." }`

- **Atualizar Nome de Perfil:** `PUT /api/v1/auth/profile/update/`
- **Request:** `{ "nome": "Ana Maria Silva" }`
- **Response `200 OK`:** `{ "message": "Perfil atualizado com sucesso.", "tokens": { "refresh": "...", "access": "..." } }`

- **Alterar Senha:** `PUT /api/v1/auth/password/change/`
- **Request:** `{ "old_password": "SenhaAtual!123", "new_password": "NovaSenhaForte!123" }`
- **Response `200 OK`:** `{ "message": "Senha atualizada com sucesso." }`

### 1.8. Administração do Sistema (`admin-sistema`)

Exigem usuário autenticado com papel `admin-sistema`:

- **Métricas, Gráficos e Auditoria (Dashboard):** `GET /api/v1/auth/admin/metrics/`
- **Response `200 OK`:**

```json
{
  "totais": {
    "usuarios": 1005,
    "ativos": 965,
    "suspensos": 40,
    "usuarios_2fa": 5,
    "anonimizados_lgpd": 0,
    "licoes": 12,
    "tentativas_exercicios": 48,
    "precisao_global": 81.3,
    "eventos_auditoria_7d": 34,
    "falhas_autenticacao_7d": 2
  },
  "distribuicao_papeis": {
    "estudantes": 1002,
    "admins_conteudo": 1,
    "admins_sistema": 2
  },
  "acervo": {
    "unidades": 4,
    "aulas": 8,
    "exercicios": 32,
    "glossario": 31,
    "gravacoes_playground": 3
  },
  "grafico": [
    {
      "dia": "Seg (12/10)",
      "ativos": 140,
      "novos_registros": 142,
      "licoes": 4,
      "exercicios": 16
    }
  ],
  "desempenho_topicos": [
    {
      "topico": "Leitura de Partituras",
      "total": 24,
      "precisao": 87.5
    }
  ],
  "ultimos_logs": [
    {
      "id": "<uuid>",
      "action": "LESSON_COMPLETED",
      "usuario": "ana@exemplo.com",
      "ip_address": "127.0.0.1",
      "timestamp": "18/10/2026 08:10"
    }
  ]
}
```

- **Listar Usuários:** `GET /api/v1/auth/admin/users/`
- **Response `200 OK`:** Lista de usuários contendo `id`, `nome`, `email`, `role` e `ativo`.

- **Alterar Papel ou Status (Suspender/Reativar):** `PATCH /api/v1/auth/admin/users/<user_id>/`
- **Request:** `{ "role": "conteudo", "ativo": false }`
- **Response `200 OK`:** `{ "message": "Usuário atualizado com sucesso.", "id": "<uuid>", "ativo": false, "role": "admin-conteudo" }`

---

## 2. Triagem de Nivelamento (`/api/v1/placement/`)

### 2.1. Listar Questões Ativas para o Visitante/Aluno

`GET /api/v1/placement/questions/` — **Permissão:** Pública (`AllowAny`)

### 2.2. Submeter Respostas da Triagem

`POST /api/v1/placement/submit/` — **Permissão:** Pública / Autenticado

**Request**

```json
{
  "respostas": {
    "<pergunta_uuid>": "<opcao_uuid>"
  }
}
```

**Response `201 Created**`

```json
{
  "nivel": "Iniciante",
  "sessionKey": "sess_4f8c2a1b7d90",
  "estatisticas": {
    "acertos": 2,
    "total_questoes": 8,
    "pontos": 10,
    "pontos_maximos": 19
  },
  "modulo_recomendado": {
    "titulo": "Unidade 1: Leitura de Partituras",
    "descricao": "Domine a pauta musical, a Clave de Sol, as notas nas linhas/espaços e a divisão rítmica."
  }
}
```

### 2.3. CRUD Administrativo de Questões de Triagem

Base: `/api/v1/placement/admin/questoes/` — **Permissão:** `admin-conteudo` / `admin-sistema`
Suporta `GET`, `POST`, `PUT`, `PATCH` e `DELETE`.

---

## 3. Trilha Didática, Exercícios, Progresso e Gamificação (`/api/v1/learning/`)

### 3.1. Unidades Didáticas (Módulos)

Base: `/api/v1/learning/modulos/`

- `GET`: Público — retorna todas as unidades ordenadas por `ordem`, incluindo a lista de `aulas` (`lessons`) e seus respectivos `exercicios` (`exercises`).
- `POST`, `PUT`, `PATCH`, `DELETE`: Restrito a `admin-conteudo` e `admin-sistema`.

**Payload de Criação/Edição (`POST` / `PUT`)**

```json
{
  "titulo": "Unidade 1: Leitura de Partituras",
  "descricao": "Domine a pauta musical, a Clave de Sol, as notas nas linhas/espaços e a divisão rítmica.",
  "categoria": "Iniciante",
  "ordem": 1,
  "ativo": true
}
```

### 3.2. Lições (Aulas)

Base: `/api/v1/learning/aulas/`

- `GET`: Público — expõe os campos nativos e os aliases `title`, `subtitle` (resumo curto para o card da trilha), `theory` (texto completo do guia teórico) e `exercises`.
- `POST`, `PUT`, `PATCH`, `DELETE`: Restrito a `admin-conteudo` e `admin-sistema`.

**Payload de Criação/Edição (`POST` / `PUT`)**

```json
{
  "modulo": "00000000-0000-0000-0001-000000000001",
  "titulo": "A Pauta e as Notas na Clave de Sol",
  "conteudo_teorico": "Explicação didática exibida na etapa teórica da lição...",
  "partitura_dados": {
    "resumo": "Pauta, referência da Clave de Sol, Dó Central e notas nas linhas e espaços.",
    "clef": "treble",
    "notes": ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
    "caption": "Escala de Dó4 a Si4 na Clave de Sol."
  },
  "ordem": 1,
  "ativa": true
}
```

### 3.3. Exercícios Interativos

Base: `/api/v1/learning/exercicios/` (Aceita filtro opcional `?aula=<aula_uuid>`)

- `GET`: Público.
- `POST`, `PUT`, `PATCH`, `DELETE`: Restrito a `admin-conteudo` e `admin-sistema`.

**Payload de Criação (`POST`)**

```json
{
  "aula": "00000000-0000-0000-0002-000000000101",
  "tipo": "note-reading",
  "enunciado": "Qual nota está escrita na linha suplementar abaixo da pauta?",
  "tag_topico": "Leitura de Partituras",
  "ativo": true,
  "gabarito_dados": {
    "ordem": 1,
    "stave": ["C4"],
    "options": ["Dó", "Ré", "Mi", "Fá"],
    "answer": "Dó",
    "explanation": "O Dó Central (C4) fica na primeira linha suplementar inferior da Clave de Sol."
  }
}
```

### 3.4. Registrar Tentativa de Exercício

`POST /api/v1/learning/tentativas/` — **Permissão:** `IsAuthenticated`

**Request**

```json
{
  "exercicio": "00000000-0000-0000-0003-000000001011",
  "resposta": "Dó",
  "tempo_resposta_ms": 1420
}
```

**Response `201 Created**`

```json
{
  "tentativa": {
    "id": "<uuid>",
    "usuario": "<uuid>",
    "exercicio": "00000000-0000-0000-0003-000000001011",
    "acertou": true,
    "tempo_resposta_ms": 1420,
    "realizada_em": "2026-10-18T11:00:00Z"
  },
  "acertou": true,
  "answer": "Dó",
  "explanation": "O Dó Central (C4) fica na primeira linha suplementar inferior da Clave de Sol.",
  "errorsByTopic": {
    "Leitura de Partituras": { "erros": 0, "total": 1 }
  }
}
```

### 3.5. Concluir Lição (Transação Atômica: Progresso + Streak + Badges)

`POST /api/v1/learning/aulas/<aula_uuid>/concluir/` — **Permissão:** `IsAuthenticated`

**Request**

```json
{
  "acertos": 4,
  "total": 4
}
```

**Response `200 OK**`

```json
{
  "aula_id": "00000000-0000-0000-0002-000000000101",
  "concluida": true,
  "taxa_acerto": 100.0,
  "streak": 1,
  "melhor_streak": 1,
  "pontuacao_total": 10,
  "completedLessons": ["00000000-0000-0000-0002-000000000101"],
  "badges": ["primeira-nota"]
}
```

### 3.6. Estado Consolidado de Progresso do Estudante

`GET /api/v1/learning/progresso/` — **Permissão:** `IsAuthenticated`

**Response `200 OK**`

```json
{
  "nome": "Ana Silva",
  "role": "estudante",
  "streak": 1,
  "melhor_streak": 1,
  "pontuacao_total": 10,
  "completedLessons": ["00000000-0000-0000-0002-000000000101"],
  "badges": ["primeira-nota"],
  "errorsByTopic": {
    "Leitura de Partituras": { "erros": 0, "total": 4 }
  },
  "placement": "Iniciante"
}
```

### 3.7. Disparar Lembretes de Ofensiva (_Streak_) via E-mail

`POST /api/v1/learning/streak-reminders/` — **Permissão:** `admin-conteudo` / `admin-sistema`

**Response `200 OK**`

```json
{
  "data_verificacao": "2026-10-18",
  "elegiveis": 1,
  "enviados": 1,
  "falhas": 0
}
```

---

## 4. Glossário Musical (`/api/v1/glossary/`)

Base: `/api/v1/glossary/termos/` (ou `/api/v1/glossary/`)

- `GET`: Lista todos os termos musicais com os campos nativos (`id`, `termo`, `definicao`, `figura_svg`, `categoria`) e aliases (`term`, `definition`, `diagram`, `category`).
- `POST`, `PUT`, `PATCH`, `DELETE`: CRUD de termos do glossário.

---

## 5. Prática Livre / Playground (`/api/v1/music/`)

Base: `/api/v1/music/musicas/`

- `GET`: Lista as sequências de notas gravadas.
- `POST`: Salva uma sequência de até 128 notas tocadas no piano virtual (`{ "nome_musica": "Minha melodia", "notas": ["C4", "E4", "G4"] }`).

---

## 6. Assistente Didático de IA (`/api/v1/ai/`)

- `POST /api/v1/ai/ask/` (conforme definido em `ai_gateway/urls.py`): Recebe a dúvida textual do estudante e retorna a explicação mediada pela Google Gemini API sob prompt de sistema restrito à teoria musical.
