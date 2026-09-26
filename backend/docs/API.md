# Backend — Linus

## Mapeamento de APIs

### Regras gerais

- Requests e responses utilizam JSON, salvo indicação contrária.
- Para endpoints autenticados, enviar `Authorization: Bearer <access_token>`.
- Campos marcados como `write_only` são aceitos na requisição e não retornados na resposta.
- O DRF pode retornar erros de validação como objeto em que cada chave de campo contém uma lista de mensagens.
- Os exemplos usam valores fictícios.

## Contas e autenticação

Base: `/api/v1/auth/`.

### Cadastro

`POST /api/v1/auth/register/`

**Request**

```json
{
  "nome": "Ana Silva",
  "email": "ana@example.com",
  "password": "SenhaForte!123",
  "ano_nascimento": 2000,
  "terms_accepted": true,
  "terms_version": "v1.0"
}
```

| Campo            | Tipo         | Obrigatório | Observação                                               |
| ---------------- | ------------ | ----------: | -------------------------------------------------------- |
| `nome`           | string       |         Sim | Campo do modelo de usuário                               |
| `email`          | string       |         Sim | Normalizado para minúsculas e sem espaços laterais       |
| `password`       | string       |         Sim | Validado pelas regras de senha do Django e não retornado |
| `ano_nascimento` | integer/null |         Não | Encaminhado para o usuário                               |
| `terms_accepted` | boolean      |         Sim | Deve ser `true`                                          |
| `terms_version`  | string       |         Sim | Máximo de 50 caracteres                                  |

**Response `201 Created`**

```json
{
  "refresh": "<jwt_refresh>",
  "access": "<jwt_access>",
  "message": "Conta criada com sucesso."
}
```

**Response de validação `400 Bad Request`**

```json
{
  "email": ["Este e-mail já está registrado."]
}
```

A view também pode retornar `{ "error": "..." }` com `400` quando ocorre uma exceção durante a criação. O conteúdo exato depende da exceção capturada.

### Login local

`POST /api/v1/auth/login/`

**Request**

```json
{
  "email": "ana@example.com",
  "password": "SenhaForte!123",
  "terms_accepted": false,
  "terms_version": ""
}
```

`terms_accepted` e `terms_version` são opcionais no serializer e servem ao fluxo de reaceite quando o usuário revogou ou não possui aceite válido.

**Response `200 OK` — login concluído**

```json
{
  "refresh": "<jwt_refresh>",
  "access": "<jwt_access>"
}
```

**Response `202 Accepted` — 2FA exigido**

```json
{
  "status": "2fa_required",
  "message": "Código 2FA enviado para o e-mail."
}
```

**Response `403 Forbidden` — termos exigidos**

```json
{
  "status": "terms_required",
  "message": "Consentimento revogado. Você precisa aceitar os Termos de Uso novamente."
}
```

**Response `401 Unauthorized` — credenciais inválidas**

```json
{
  "error": "Credenciais inválidas."
}
```

**Response `400 Bad Request` — validação**

```json
{
  "email": ["Informe um endereço de e-mail válido."]
}
```

### Login/registro com Google

`POST /api/v1/auth/google/`

**Request**

```json
{
  "id_token": "<google_id_token>",
  "name": "Ana Silva",
  "terms_accepted": true,
  "terms_version": "v1.0",
  "ano_nascimento": 2000
}
```

| Campo            | Tipo         | Obrigatório | Observação                                           |
| ---------------- | ------------ | ----------: | ---------------------------------------------------- |
| `id_token`       | string       |         Sim | Validado no backend contra o client ID configurado   |
| `name`           | string       |         Não | Usado no fluxo de cadastro, conforme a view          |
| `terms_accepted` | boolean      |         Sim | Necessário para o cadastro/reaceite                  |
| `terms_version`  | string       |         Sim | Máximo de 50 caracteres; permite vazio no serializer |
| `ano_nascimento` | integer/null |         Não | Usado no cadastro via Google                         |

**Response `200 OK` — usuário existente autenticado**

```json
{
  "refresh": "<jwt_refresh>",
  "access": "<jwt_access>"
}
```

**Response `202 Accepted` — 2FA exigido**

```json
{
  "status": "2fa_required",
  "message": "Código 2FA enviado para o e-mail."
}
```

**Response `403 Forbidden` — cadastro ou reaceite necessário**

```json
{
  "status": "registration_required",
  "message": "Usuário não encontrado. Aceite os termos de uso para concluir o cadastro."
}
```

ou:

```json
{
  "status": "terms_required",
  "message": "Consentimento revogado. Você precisa aceitar os Termos de Uso novamente."
}
```

**Response `401 Unauthorized` — token inválido/expirado**

```json
{
  "error": "Token do Google inválido ou expirado."
}
```

**Response `400 Bad Request` — e-mail Google não verificado**

```json
{
  "error": "O e-mail da conta Google não foi verificado."
}
```

### Verificação do segundo fator

`POST /api/v1/auth/verify-2fa/`

**Request**

```json
{
  "email": "ana@example.com",
  "otp": "123456"
}
```

| Campo   | Tipo   | Obrigatório | Observação                     |
| ------- | ------ | ----------: | ------------------------------ |
| `email` | string |         Sim | Usado para localizar o usuário |
| `otp`   | string |         Sim | Máximo de 6 caracteres         |

**Response `200 OK`**

```json
{
  "refresh": "<jwt_refresh>",
  "access": "<jwt_access>"
}
```

**Response `400 Bad Request`**

```json
{
  "error": "Código inválido ou expirado."
}
```

**Response `404 Not Found`**

```json
{
  "error": "Usuário não encontrado."
}
```

### Solicitação de redefinição de senha

`POST /api/v1/auth/password-reset/`

**Request**

```json
{
  "email": "ana@example.com"
}
```

**Response**

O corpo e o status de sucesso dependem da implementação completa de `PasswordResetRequestView`, não incluída integralmente no material analisado. O serializer confirma apenas o campo `email`.

### Confirmação de redefinição de senha

`POST /api/v1/auth/password-reset/confirm/`

**Request**

```json
{
  "token": "<password_reset_token>",
  "new_password": "NovaSenhaForte!123"
}
```

| Campo          | Tipo   | Obrigatório | Observação                                               |
| -------------- | ------ | ----------: | -------------------------------------------------------- |
| `token`        | string |         Sim | Token de recuperação                                     |
| `new_password` | string |         Sim | Validado pelas regras de senha do Django e não retornado |

**Response**

O corpo e os status de sucesso/erro dependem da implementação completa de `PasswordResetConfirmView`.

### Logout

`POST /api/v1/auth/logout/`

**Headers**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request**

O corpo exato depende da implementação de `LogoutView`. Caso a view utilize blacklist de JWT, é comum que receba o refresh token:

```json
{
  "refresh": "<jwt_refresh>"
}
```

Esse exemplo deve ser confirmado contra a view antes de ser usado pelo frontend.

**Response**

O corpo e o status dependem da implementação completa da view.

## Perfil e privacidade

As rotas abaixo foram informadas no `accounts/urls.py`, mas os serializers/views correspondentes não foram fornecidos integralmente no material anexado. Por isso, o contrato do body permanece delimitado apenas pelo método e pela finalidade.

### Consulta de dados pessoais

`GET /api/v1/auth/privacy/data/`

**Request:** sem body.

**Response:** objeto com os dados do titular; campos e status a confirmar na `UserPrivacyDataView`.

### Revogação de consentimento

`POST /api/v1/auth/privacy/revoke-consent/`

**Request:** body a confirmar.

Exemplo possível, caso a implementação opere por finalidade:

```json
{
  "purpose": "terms"
}
```

O campo não deve ser documentado como contrato definitivo sem confirmação na view.

### Exclusão da conta

`DELETE /api/v1/auth/privacy/delete-account/`

**Request:** body a confirmar; recomenda-se confirmação explícita e reautenticação para uma operação destrutiva.

**Response:** status e body a confirmar na `DeleteAccountView`.

### Atualização do perfil

`PUT /api/v1/auth/profile/update/`

**Request:** campos de perfil a confirmar na view/serializer.

Possível estrutura baseada nos campos conhecidos do usuário:

```json
{
  "nome": "Ana Silva",
  "ano_nascimento": 2000
}
```

Este exemplo é ilustrativo e não substitui a definição efetiva da view.

### Alteração de senha

`PUT /api/v1/auth/password/change/`

**Request:** campos a confirmar na view. Uma estrutura recomendada seria:

```json
{
  "old_password": "SenhaAtual!123",
  "new_password": "NovaSenhaForte!123"
}
```

Os nomes devem ser ajustados ao contrato real antes da publicação.

## Administração

### Métricas

`GET /api/v1/auth/admin/metrics/`

**Request:** sem body.

**Response:** métricas administrativas; campos e status a confirmar em `AdminSystemMetricsView`.

### Lista de usuários

`GET /api/v1/auth/admin/users/`

**Request:** sem body. Parâmetros de consulta, paginação e filtros a confirmar.

**Response:** lista ou objeto paginado de usuários; campos a confirmar.

### Usuário específico

`GET /api/v1/auth/admin/users/<user_id>/`

**Request:** sem body; `user_id` é parâmetro de rota.

**Response:** representação do usuário; campos a confirmar.

### Atualização administrativa

`PATCH /api/v1/auth/admin/users/` ou `PATCH /api/v1/auth/admin/users/<user_id>/`

A rota e os métodos precisam ser conferidos no arquivo de URLs e na view. O body não foi fornecido nos serializers anexados; não documentar campos sem confirmar a implementação.

## Placement

Base: `/api/v1/placement/`.

### Perguntas de triagem

`GET /api/v1/placement/questions/`

**Request:** sem body.

**Response `200 OK`**

```json
[
  {
    "id": "a8098c1a-f86e-11da-bd1a-00112444be1e",
    "enunciado": "Qual é o seu nível de conhecimento musical?",
    "tipo": "multipla_escolha",
    "dados_partitura": null,
    "ordem": 1,
    "ativo": true,
    "opcoes": [
      {
        "id": "b8098c1a-f86e-11da-bd1a-00112444be1e",
        "texto": "Iniciante",
        "peso_perfil": 1
      }
    ]
  }
]
```

O formato acima é derivado de `PerguntaTriagemSerializer` e `OpcaoTriagemSerializer`.

### Envio das respostas

`POST /api/v1/placement/submit/`

**Request**

```json
{
  "respostas": {
    "a8098c1a-f86e-11da-bd1a-00112444be1e": "b8098c1a-f86e-11da-bd1a-00112444be1e"
  }
}
```

`respostas` é um objeto/dicionário em que a chave é o ID da pergunta e o valor é o ID da opção escolhida.

**Response `201 Created`**

```json
{
  "nivel": "Iniciante",
  "sessionKey": "sess_4f8c2a1b7d90",
  "estatisticas": {
    "acertos": 1,
    "total_questoes": 5,
    "pontos": 1,
    "pontos_maximos": 3
  },
  "modulo_recomendado": {
    "titulo": "Unidade 1: Leitura de Partituras",
    "descricao": "Pauta, clave de Sol, notas e figuras de duração."
  }
}
```

**Response `400 Bad Request`**

```json
{
  "erro": "Nenhuma resposta fornecida"
}
```

### CRUD administrativo de perguntas

`PerguntaTriagemViewSet` é um `ModelViewSet`, mas a rota do router não foi fornecida no material analisado. Quando registrado, o DRF normalmente oferece operações de coleção e detalhe:

| Operação             | Método   | Body                                     |
| -------------------- | -------- | ---------------------------------------- |
| Listagem             | `GET`    | Sem body                                 |
| Criação              | `POST`   | Objeto de pergunta com `opcoes` opcional |
| Detalhe              | `GET`    | Sem body                                 |
| Atualização completa | `PUT`    | Objeto completo                          |
| Atualização parcial  | `PATCH`  | Campos parciais                          |
| Exclusão             | `DELETE` | Sem body                                 |

**Body de criação/atualização**

```json
{
  "enunciado": "Qual é a função da clave de Sol?",
  "tipo": "multipla_escolha",
  "dados_partitura": null,
  "ordem": 1,
  "ativo": true,
  "opcoes": [
    {
      "texto": "Indicar a posição das notas na pauta",
      "peso_perfil": 2
    },
    {
      "texto": "Indicar o andamento da música",
      "peso_perfil": 0
    }
  ]
}
```

Na atualização, quando `opcoes` é enviado, o serializer remove as opções antigas e cria as novas dentro de transação.

## Glossário

Base: `/api/v1/glossary/`.

`GlossarioViewSet` é um `ModelViewSet` com `IsAuthenticated` e `pagination_class = None`. Os routers registrados são `/api/v1/glossary/termos/` e `/api/v1/glossary/`.

### Campos serializados

| Campo        | Tipo                               | Leitura/escrita | Observação             |
| ------------ | ---------------------------------- | --------------- | ---------------------- |
| `id`         | integer ou tipo definido no modelo | Leitura         | Identificador          |
| `termo`      | string                             | Conforme modelo | Campo nativo           |
| `definicao`  | string                             | Conforme modelo | Campo nativo           |
| `figura_svg` | string/null                        | Opcional        | Pode ser vazio ou nulo |
| `categoria`  | string                             | Conforme modelo | Campo nativo           |
| `term`       | string                             | Somente leitura | Alias de `termo`       |
| `definition` | string                             | Somente leitura | Alias de `definicao`   |
| `diagram`    | string/null                        | Somente leitura | Alias de `figura_svg`  |
| `category`   | string                             | Somente leitura | Alias de `categoria`   |

### Listagem

`GET /api/v1/glossary/` ou `GET /api/v1/glossary/termos/`

**Request:** sem body.

**Response `200 OK`**

```json
[
  {
    "id": 1,
    "termo": "Escala maior",
    "definicao": "Sequência de notas organizada por tons e semitons.",
    "figura_svg": null,
    "categoria": "Escalas",
    "term": "Escala maior",
    "definition": "Sequência de notas organizada por tons e semitons.",
    "diagram": null,
    "category": "Escalas"
  }
]
```

### Detalhe, criação, atualização e exclusão

Como o viewset herda `ModelViewSet`, o DRF normalmente expõe ações de detalhe no router:

| Operação             | Método   | URL típica  | Body                           |
| -------------------- | -------- | ----------- | ------------------------------ |
| Detalhe              | `GET`    | `.../<pk>/` | Sem body                       |
| Criação              | `POST`   | `.../`      | Campos graváveis do serializer |
| Atualização completa | `PUT`    | `.../<pk>/` | Campos graváveis               |
| Atualização parcial  | `PATCH`  | `.../<pk>/` | Campos parciais                |
| Exclusão             | `DELETE` | `.../<pk>/` | Sem body                       |

**Body de criação/atualização**

```json
{
  "termo": "Escala maior",
  "definicao": "Sequência de notas organizada por tons e semitons.",
  "figura_svg": "<svg>...</svg>",
  "categoria": "Escalas"
}
```

Os aliases em inglês são `read_only`; não devem ser enviados como campos de escrita.

## Música

Base: `/api/v1/music/`.

`MusicaViewSet` é um `ModelViewSet`. O router registra `/api/v1/music/musicas/`. O código anexado define `AllowAny` e, no `perform_create`, associa o usuário autenticado quando houver login ou salva `id_usuario = None` para visitante.

### Campos serializados

| Campo          | Tipo                    | Leitura/escrita                | Observação                          |
| -------------- | ----------------------- | ------------------------------ | ----------------------------------- |
| `id_musica`    | Tipo definido no modelo | Somente leitura                | Identificador                       |
| `nome_musica`  | Tipo definido no modelo | Conforme modelo                | Nome da música                      |
| `notas`        | lista                   | Conforme modelo                | Máximo de 128 itens; deve ser lista |
| `id_usuario`   | Tipo definido no modelo | Deve ser tratado pelo servidor | Sobrescrito em `perform_create`     |
| `data_criacao` | data/hora               | Somente leitura                | Gerado pelo modelo                  |

### Listagem

`GET /api/v1/music/musicas/`

**Request:** sem body.

**Response `200 OK`**

```json
[
  {
    "id_musica": 1,
    "nome_musica": "Minha melodia",
    "notas": ["C4", "E4", "G4"],
    "id_usuario": 7,
    "data_criacao": "2026-09-26T14:30:00Z"
  }
]
```

O tipo exato de `id_musica`, `id_usuario` e o formato dos itens de `notas` dependem do modelo e do frontend.

### Criação

`POST /api/v1/music/musicas/`

**Request autenticado**

```json
{
  "nome_musica": "Minha melodia",
  "notas": ["C4", "E4", "G4"]
}
```

Em razão de `perform_create`, o cliente não deve definir `id_usuario`; o servidor deve usar o usuário autenticado.

**Request anônimo conforme o código atual**

```json
{
  "nome_musica": "Rascunho público",
  "notas": ["C4", "D4"]
}
```

Nesse caso, a view salva `id_usuario` como `None`.

**Response `201 Created`**

```json
{
  "id_musica": 1,
  "nome_musica": "Minha melodia",
  "notas": ["C4", "E4", "G4"],
  "id_usuario": 7,
  "data_criacao": "2026-09-26T14:30:00Z"
}
```

**Response `400 Bad Request` — mais de 128 notas ou tipo inválido**

```json
{
  "notas": ["Uma música não pode ter mais do que 128 notas."]
}
```

ou:

```json
{
  "notas": ["O campo notas deve ser uma lista."]
}
```

### Detalhe, atualização e exclusão

Como o viewset herda `ModelViewSet`, o router expõe:

| Operação             | Método   | URL típica                    | Body             |
| -------------------- | -------- | ----------------------------- | ---------------- |
| Detalhe              | `GET`    | `/api/v1/music/musicas/<pk>/` | Sem body         |
| Atualização completa | `PUT`    | `/api/v1/music/musicas/<pk>/` | Campos graváveis |
| Atualização parcial  | `PATCH`  | `/api/v1/music/musicas/<pk>/` | Campos parciais  |
| Exclusão             | `DELETE` | `/api/v1/music/musicas/<pk>/` | Sem body         |
