
# Documentação: Integração com a API do Google Gemini (Assistente Linus)

## Objetivo
Descrever a arquitetura, o consumo funcional e as diretrizes de segurança da API externa **Google Gemini** integrada ao projeto **Linus**. A ferramenta atua como o **Professor Linus**, um tutor inteligente especializado em Teoria Musical que oferece suporte pedagógico interativo e personalizado aos estudantes.

---

## Visão Geral e Arquitetura
O front-end em React (interface do chat flutuante) nunca consome a API do Google diretamente; toda a comunicação é mediada pelo back-end em Django (`ai_gateway`), garantindo que a chave de acesso permaneça protegida no servidor.

* **Fluxo de Comunicação:** O aluno envia uma mensagem no chat $\rightarrow$ O Front-end dispara uma requisição HTTP para o endpoint interno do Django $\rightarrow$ O Back-end processa a mensagem aplicando a *System Instruction* da persona $\rightarrow$ A SDK oficial do Google Gemini processa a requisição e retorna a resposta formatada ao usuário.

---

## Rotas de Integração (API)
A disponibilização do serviço de inteligência artificial foi estruturada utilizando o **Django REST framework**. A interface exposta ao front-end é a seguinte:

| Método | Endpoint | Proteção | Objetivo |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/ai/chat/` | Pública / Autenticada | Recebe a mensagem digitada pelo aluno, processa a consulta junto ao Gemini e retorna a resposta pedagógica do Professor Linus. |

---

## Chamada à API Externa (Google Gemini)

| Item | Valor / Descrição |
| :--- | :--- |
| **API Utilizada** | Google Gemini API (`google-genai` SDK) |
| **Autenticação** | Chave de API (`GEMINI_API_KEY`), criada no Google AI Studio |
| **Persona (System Instruction)** | Professor Linus (sábio, focado em Teoria Musical, objetivo, conciso e com a regra de ouro de não fornecer exemplos espontâneos). |

### Exemplos de Payload

* **Requisição (Request Body enviado pelo Front-end):**
  ```json
  {
    "message": "O que é uma escala maior?"
  }
  ```

* **Resposta (Response Body retornado pelo Back-end):**
  ```json
  {
    "reply": "A escala maior é uma sequência de sete notas musicais..."
  }
  ```

---

## Situações e Tratamento de Resposta

| Situação | Resposta / Comportamento do Sistema |
| :--- | :--- |
| **Sucesso** | Retorna status `200 OK` contendo o JSON com a resposta gerada pela IA. |
| **Mensagem em branco** | Validação no back-end/front-end impede o envio de requisições vazias. |
| **Erro ou Indisponibilidade da API** | Retorna erro tratado com mensagem amigável ao usuário (*"Ah, meu caro, ocorreu um pequeno contratempo..."*), evitando travamentos na interface. |

---

## Configuração e Variáveis de Ambiente

| Variável | Onde configurar | Descrição |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `backend/.env` | Chave secreta da API do Gemini; **nunca versionada** no repositório. |

**Dependência Externa (Python):**
Certifique-se de instalar o pacote oficial atualizado no ambiente virtual do projeto:
```bash
pip install -r requirements.txt
```
*(Pacote requerido: `google-genai`)*

---

## Segurança e LGPD
* **Isolamento de Credenciais:** A chave de API reside exclusivamente no servidor (via arquivo `.env`).
* **Minimização de Dados:** Nenhuma informação sensível ou dado pessoal do estudante é repassado ao Google durante as interações com o chatbot; apenas a dúvida técnica musical é processada.
