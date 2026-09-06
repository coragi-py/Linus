# Linus — Guia de desenvolvimento local

Este guia explica como preparar o ambiente local do projeto Linus, executar frontend, backend e banco de dados, trabalhar em branches e abrir Pull Requests.

> **Arquitetura atual:** frontend em React/Vite e backend Django organizado como monólito modular. O PostgreSQL é executado localmente com Docker Compose. Redis, Sentry e Datadog não fazem parte do escopo atual.

---

## 1. Pré-requisitos

Instale as ferramentas abaixo antes de iniciar.

| Ferramenta     |  Versão recomendada | Verificação                          |
| -------------- | ------------------: | ------------------------------------ |
| Git            |    2.40 ou superior | `git --version`                      |
| Node.js        |  20 LTS ou superior | `node --version`                     |
| npm            | acompanha o Node.js | `npm --version`                      |
| Python         |    3.11 ou superior | `python --version` ou `py --version` |
| Docker Desktop |        versão atual | `docker --version`                   |
| Docker Compose |        versão atual | `docker compose version`             |
| VS Code        |         recomendada | opcional                             |

No Windows, abra o Docker Desktop e aguarde até que ele esteja em execução antes de subir o banco de dados.

---

## 2. Clonar o repositório

No terminal, escolha uma pasta de trabalho e execute:

```bash
git clone https://github.com/coragi-py/Linus.git
cd Linus
```

Confira a branch principal disponível:

```bash
git branch -a
```

Antes de criar uma branch, atualize sua cópia local:

```bash
git checkout main
git pull origin main
```

---

## 3. Trabalhar com branches

Nunca desenvolva diretamente na branch `main`.

Crie uma branch a partir da `main` atualizada. Use nomes curtos, em minúsculo e separados por hífen.

```bash
git checkout -b feature/nome-da-funcionalidade
```

Exemplos:

```bash
git checkout -b feature/triagem-inicial
git checkout -b feature/piano-virtual
git checkout -b feature/autenticacao
git checkout -b fix/correcao-login
git checkout -b docs/atualiza-readme
```

Envie a branch para o GitHub na primeira vez:

```bash
git push -u origin feature/nome-da-funcionalidade
```

Durante o desenvolvimento:

```bash
git status
git add .
git commit -m "feat: descreve a funcionalidade implementada"
git push
```

Antes de abrir um Pull Request, atualize a branch com a `main`:

```bash
git checkout main
git pull origin main
git checkout feature/nome-da-funcionalidade
git merge main
```

Resolva conflitos, execute os testes e envie a branch novamente:

```bash
git push
```

Depois, abra um Pull Request no GitHub de `feature/nome-da-funcionalidade` para `main`.

---

## 4. Banco de dados com Docker

O arquivo `docker-compose.yml` do repositório sobe um PostgreSQL local para desenvolvimento.

Na raiz do projeto, execute:

```bash
docker compose up -d
```

Verifique se o contêiner está em execução:

```bash
docker compose ps
```

Veja os logs, se necessário:

```bash
docker compose logs -f
```

Para parar os serviços sem apagar os dados:

```bash
docker compose down
```

Para remover também os volumes e reiniciar o banco do zero:

```bash
docker compose down -v
```

> **Atenção:** `docker compose down -v` apaga os dados locais do PostgreSQL. Use esse comando apenas quando for necessário reiniciar o ambiente de desenvolvimento.

A configuração atual do Docker Compose utiliza o banco PostgreSQL com os seguintes dados locais:

```text
Host: localhost
Porta: 5432
Banco: linus_db
Usuário: linus_db_admin
Senha: Af2612!!!
```

Essas credenciais são exclusivas do ambiente local e não devem ser usadas em produção.

---

## 5. Configurar o backend

Abra um segundo terminal e entre na pasta do backend:

```bash
cd backend
```

### 5.1 Criar ambiente virtual

#### Windows PowerShell

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Se o PowerShell bloquear a ativação, execute uma vez no terminal:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Depois, tente novamente:

```powershell
.\.venv\Scripts\Activate.ps1
```

#### Windows CMD

```bat
py -3.11 -m venv .venv
.venv\Scripts\activate.bat
```

#### Linux ou macOS

```bash
python3.11 -m venv .venv
source .venv/bin/activate
```

Quando o ambiente virtual estiver ativo, o terminal deverá mostrar `(.venv)` no início da linha.

### 5.2 Instalar dependências

Com o ambiente virtual ativo:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 5.3 Criar o arquivo `.env`

Na pasta `backend`, crie um arquivo chamado `.env` usando o modelo abaixo:

```env
DJANGO_SECRET_KEY=troque-esta-chave-por-uma-chave-local-segura
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

DB_ENGINE=django.db.backends.postgresql
DB_NAME=linus_db
DB_USER=linus_user
DB_PASSWORD=linus_password
DB_HOST=localhost
DB_PORT=5432

# URL de Conexão do Django (Usada pelo dj-database-url)
DATABASE_URL=postgres://usuarioBancoAqui:SenhaBancoAqui@localhost:5432/linus_db

GEMINI_API_KEY=
```

A chave local pode ser gerada com:

```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Não envie o arquivo `.env` para o GitHub. Ele deve permanecer listado no `.gitignore`.

> A variável `GEMINI_API_KEY` é necessária apenas para testar a integração do assistente didático. Não compartilhe a chave em mensagens, commits, Pull Requests, capturas de tela ou documentos públicos.

### 5.4 Conferir conexão com banco

Antes de executar migrations, confirme que o PostgreSQL foi iniciado com Docker:

```bash
cd ..
docker compose ps
cd backend
```

Se o banco estiver ativo, prossiga para as migrations.

### 5.5 Executar migrations

Execute as migrations padrão e as migrations dos módulos já implementados:

```bash
python manage.py makemigrations
python manage.py migrate
```

> Execute `makemigrations` apenas quando você tiver criado ou alterado models. Para preparar o ambiente sem alterações de model, normalmente basta executar `python manage.py migrate`.

Crie um usuário administrador local, se necessário:

```bash
python manage.py createsuperuser
```

### 5.6 Executar o backend

```bash
python manage.py runserver
```

O backend deverá ficar disponível em:

```text
http://127.0.0.1:8000/
```

Para executar em outra porta:

```bash
python manage.py runserver 8001
```

Para encerrar o servidor, pressione `Ctrl + C`.

---

## 6. Configurar o frontend

Abra um terceiro terminal e entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências com o arquivo de lock do projeto:

```bash
npm ci
```

Se ocorrer erro relacionado ao `package-lock.json`, use:

```bash
npm install
```

### 6.1 Criar arquivo `.env.local`

Na pasta `frontend`, crie o arquivo `.env.local`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Use o prefixo `VITE_` apenas para variáveis que podem ser expostas ao navegador.

> Nunca coloque `GEMINI_API_KEY`, `DJANGO_SECRET_KEY`, senha do banco ou qualquer segredo no `.env.local` do frontend.

### 6.2 Executar o frontend

```bash
npm run dev
```

O Vite exibirá a URL local no terminal. Normalmente:

```text
http://localhost:5173/
```

Para abrir o servidor automaticamente no navegador:

```bash
npm run dev -- --open
```

Para validar o build de produção:

```bash
npm run build
```

Para executar verificações configuradas no projeto:

```bash
npm run lint
```

---

## 7. Ordem recomendada para iniciar o projeto

Abra três terminais na raiz do repositório.

### Terminal 1: PostgreSQL

```bash
docker compose up -d
```

### Terminal 2: backend

```bash
cd backend
# Ative o ambiente virtual
python manage.py migrate
python manage.py runserver
```

### Terminal 3: frontend

```bash
cd frontend
npm run dev
```

Depois, abra a URL exibida pelo Vite, normalmente `http://localhost:5173/`.

---

## 8. Fluxo da triagem antes do cadastro

A triagem inicial pode ser iniciada por visitantes. Para evitar dependência de Redis no MVP, informações temporárias devem ser mantidas por sessão do Django ou por registro temporário no PostgreSQL com prazo de expiração.

Regras recomendadas para implementação:

- Não armazenar dados de conta antes do visitante criar uma conta.
- Usar uma chave de sessão para identificar a triagem em andamento.
- Associar o resultado ao usuário somente após o cadastro ser concluído.
- Definir data de expiração para dados temporários não vinculados.
- Remover ou anonimizar registros temporários expirados.

---

## 9. Convenções de desenvolvimento

### Commits

Use mensagens objetivas no padrão abaixo:

```text
feat: adiciona triagem inicial
fix: corrige mapeamento de teclas do piano
docs: atualiza guia de desenvolvimento
refactor: reorganiza serviços do módulo de exercícios
test: adiciona testes de autenticação
chore: atualiza dependências
```

### Pull Requests

Antes de solicitar revisão:

- Atualize a branch com a `main`.
- Execute migrations, quando houver alteração de models.
- Execute o backend e valide os endpoints alterados.
- Execute `npm run lint` no frontend.
- Execute `npm run build` no frontend.
- Não envie arquivos `.env`, `.venv`, `node_modules`, banco local ou credenciais.
- Descreva no Pull Request o que foi alterado e como testar.

Modelo de descrição:

```md
## O que foi feito

-

## Como testar

1.
2.

## Observações

-
```

---

## 10. Problemas frequentes

### Docker não inicia

Confirme que o Docker Desktop está aberto e em execução:

```bash
docker info
```

Se o comando falhar, abra ou reinicie o Docker Desktop.

### Porta 5432 já está em uso

Provavelmente existe outro PostgreSQL em execução na máquina. Pare o serviço que está usando a porta ou altere a porta publicada no `docker-compose.yml` e atualize `DB_PORT` no `.env` do backend.

### Erro de conexão do Django com o banco

Confirme:

```bash
docker compose ps
```

Verifique se os valores `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST` e `DB_PORT` no `.env` correspondem ao `docker-compose.yml`.

### Erro `ModuleNotFoundError` no backend

Confirme que o ambiente virtual está ativo e reinstale as dependências:

```bash
pip install -r requirements.txt
```

### Erro `npm` ou dependência ausente no frontend

Remova a pasta `node_modules` e instale novamente:

```bash
npm ci
```

No Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
npm ci
```

### Frontend não consegue acessar o backend

Confirme que o backend está em execução em `http://127.0.0.1:8000/` e que o arquivo `frontend/.env.local` contém:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Também confirme a configuração de CORS no Django antes de integrar os dois servidores locais.

### Migration não é encontrada

Execute:

```bash
python manage.py makemigrations
python manage.py migrate
```

Se a migration já existir, execute apenas:

```bash
python manage.py migrate
```

---

## 11. Segurança mínima

- Nunca envie arquivos `.env` ao repositório.
- Nunca registre chaves da Gemini API em commits, issues ou Pull Requests.
- Use somente credenciais locais de desenvolvimento no Docker Compose.
- Não use senhas pessoais como senha local do banco.
- Revise `git status` antes de cada commit.
- Caso uma chave seja enviada acidentalmente, revogue-a imediatamente no provedor e gere outra chave.

---

## 12. Encerrar o ambiente

Para encerrar os servidores frontend e backend, pressione `Ctrl + C` nos respectivos terminais.

Para parar o PostgreSQL local:

```bash
docker compose down
```

Os dados persistem no volume Docker até que seja executado:

```bash
docker compose down -v
```
