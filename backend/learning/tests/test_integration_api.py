import json
import time
import uuid
import urllib.error
import urllib.request
from django.contrib.auth import get_user_model
from django.test import LiveServerTestCase
from learning.models import Modulo, Aula

User = get_user_model()


class HttpResponseWrapper:
    """Encapsula status HTTP, headers e corpo JSON de uma resposta HTTP real."""

    def __init__(self, status_code: int, headers: dict, raw_body: bytes):
        self.status_code = status_code
        self.headers = {k.lower(): v for k, v in headers.items()}
        self.raw_body = raw_body
        if raw_body:
            try:
                self.json = json.loads(raw_body.decode("utf-8"))
            except ValueError:
                self.json = None
        else:
            self.json = None

    def get_header(self, name: str):
        return self.headers.get(name.lower())


class HttpTestClient:
    """
    Cliente HTTP real equivalente ao RestClient com RANDOM_PORT da Aula 11.
    Configurado para não lançar exceção em respostas 4xx/5xx (defaultStatusHandler).
    """

    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")

    def request(self, method: str, path: str, body: dict | None = None, token: str | None = None) -> HttpResponseWrapper:
        url = f"{self.base_url}{path}"
        headers = {"Accept": "application/json"}
        data = None

        if body is not None:
            data = json.dumps(body).encode("utf-8")
            headers["Content-Type"] = "application/json"

        if token:
            headers["Authorization"] = f"Bearer {token}"

        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                return HttpResponseWrapper(resp.status, dict(resp.headers), resp.read())
        except urllib.error.HTTPError as err:
            # Não propaga exceção em 4xx/5xx para permitir asserções sobre o erro
            return HttpResponseWrapper(err.code, dict(err.headers), err.read())


class LearningControllersIntegrationTest(LiveServerTestCase):
    """
    Testes de Integração ponta a ponta (HTTP -> Segurança JWT/RBAC -> ViewSet -> Serializer -> ORM -> Banco de Teste)
    cobrindo todos os endpoints de ModuloViewSet (/api/v1/learning/modulos/) e AulaViewSet (/api/v1/learning/aulas/).
    """

    MODULOS_PATH = "/api/v1/learning/modulos/"
    AULAS_PATH = "/api/v1/learning/aulas/"

    def setUp(self):
        self.client_http = HttpTestClient(self.live_server_url)
        ts = time.time_ns()

        # 1. Registra e obtém token de Estudante (USER sem permissão de escrita em conteúdo) pelo endpoint real
        self.student_email = f"estudante.{ts}@linus.com"
        res_reg_student = self.client_http.request(
            "POST",
            "/api/v1/auth/register/",
            body={
                "nome": f"Estudante {ts}",
                "email": self.student_email,
                "password": "Password@123",
                "ano_nascimento": 2001,
                "terms_accepted": True,
                "terms_version": "v1.0",
            },
        )
        self.token_estudante = res_reg_student.json["access"]

        # 2. Registra usuário Admin de Conteúdo, promove o role no banco de teste e obtém token via /auth/login/
        self.admin_email = f"admin.{ts}@linus.com"
        self.client_http.request(
            "POST",
            "/api/v1/auth/register/",
            body={
                "nome": f"Professor {ts}",
                "email": self.admin_email,
                "password": "Password@123",
                "ano_nascimento": 1988,
                "terms_accepted": True,
                "terms_version": "v1.0",
            },
        )
        User.objects.filter(email=self.admin_email).update(
            role="admin-conteudo",
            is_staff=True,
            is_2fa_enabled=False,
        )
        res_login_admin = self.client_http.request(
            "POST",
            "/api/v1/auth/login/",
            body={
                "email": self.admin_email,
                "password": "Password@123",
            },
        )
        self.token_admin = res_login_admin.json["access"]

    # ==================== HELPERS ====================
    def build_modulo_request(self, titulo: str, ordem: int = 10) -> dict:
        return {
            "titulo": titulo,
            "descricao": f"Descrição didática para {titulo}",
            "categoria": "Iniciante",
            "ordem": ordem,
            "ativo": True,
        }

    def criar_modulo_via_api(self, titulo: str, ordem: int = 10) -> dict:
        res = self.client_http.request(
            "POST",
            self.MODULOS_PATH,
            body=self.build_modulo_request(titulo, ordem),
            token=self.token_admin,
        )
        self.assertEqual(res.status_code, 201)
        return res.json

    def build_aula_request(self, modulo_id: str, titulo: str, ordem: int = 1) -> dict:
        return {
            "modulo": modulo_id,
            "titulo": titulo,
            "conteudo_teorico": f"Guia teórico completo da aula {titulo}.",
            "ordem": ordem,
            "ativa": True,
        }

    def criar_aula_via_api(self, modulo_id: str, titulo: str, ordem: int = 1) -> dict:
        res = self.client_http.request(
            "POST",
            self.AULAS_PATH,
            body=self.build_aula_request(modulo_id, titulo, ordem),
            token=self.token_admin,
        )
        self.assertEqual(res.status_code, 201)
        return res.json

    # ==================== TESTES DO CONTROLLER 1: ModuloViewSet ====================

    def test_criarModulo_comDadosValidos_deveRetornar201ComIdHeaderLocationEPersistirNoBanco(self):
        # Arrange
        ts = time.time_ns()
        payload = self.build_modulo_request(f"Unidade Extra {ts}", ordem=99)

        # Act
        response = self.client_http.request(
            "POST", self.MODULOS_PATH, body=payload, token=self.token_admin
        )

        # Assert (Status, Corpo, Header Location e Persistência no Banco)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.json.get("id"))
        self.assertEqual(response.json.get("titulo"), f"Unidade Extra {ts}")
        self.assertEqual(
            response.get_header("Location"),
            f"/api/v1/learning/modulos/{response.json['id']}/",
        )
        self.assertTrue(Modulo.objects.filter(id=response.json["id"]).exists())

    def test_listarModulos_quandoModuloCriado_deveRetornar200EConterModuloNaLista(self):
        # Arrange
        ts = time.time_ns()
        criado = self.criar_modulo_via_api(f"Unidade Listagem {ts}", ordem=50)

        # Act
        response = self.client_http.request("GET", self.MODULOS_PATH)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)
        ids_retornados = [m["id"] for m in response.json]
        self.assertIn(criado["id"], ids_retornados)

    def test_buscarModuloPorId_comIdExistente_deveRetornar200ETodosOsCampos(self):
        # Arrange
        ts = time.time_ns()
        criado = self.criar_modulo_via_api(f"Unidade Detalhe {ts}", ordem=51)

        # Act
        response = self.client_http.request("GET", f"{self.MODULOS_PATH}{criado['id']}/")

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["id"], criado["id"])
        self.assertEqual(response.json["titulo"], f"Unidade Detalhe {ts}")
        self.assertEqual(response.json["categoria"], "Iniciante")

    def test_atualizarModulo_comDadosValidos_deveRetornar200EGravarNovoTituloNoBanco(self):
        # Arrange
        ts = time.time_ns()
        criado = self.criar_modulo_via_api(f"Unidade Original {ts}", ordem=52)
        novo_payload = {
            "titulo": f"Unidade Editada {ts}",
            "descricao": "Descrição atualizada via PUT",
            "categoria": "Intermediário",
            "ordem": 52,
            "ativo": True,
        }

        # Act
        response = self.client_http.request(
            "PUT",
            f"{self.MODULOS_PATH}{criado['id']}/",
            body=novo_payload,
            token=self.token_admin,
        )

        # Assert (Status, Corpo e Efeito Persistido no Banco)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["titulo"], f"Unidade Editada {ts}")
        modulo_db = Modulo.objects.get(id=criado["id"])
        self.assertEqual(modulo_db.titulo, f"Unidade Editada {ts}")
        self.assertEqual(modulo_db.categoria, "Intermediário")

    def test_removerModulo_comIdExistente_deveRetornar204EGetSeguinteRetornar404(self):
        # Arrange
        ts = time.time_ns()
        criado = self.criar_modulo_via_api(f"Unidade Para Excluir {ts}", ordem=53)

        # Act
        response = self.client_http.request(
            "DELETE",
            f"{self.MODULOS_PATH}{criado['id']}/",
            token=self.token_admin,
        )

        # Assert (Status 204 e confirmação via GET seguinte retornando 404)
        self.assertEqual(response.status_code, 204)
        busca_apos_delete = self.client_http.request("GET", f"{self.MODULOS_PATH}{criado['id']}/")
        self.assertEqual(busca_apos_delete.status_code, 404)

    # ==================== TESTES DO CONTROLLER 2: AulaViewSet ====================

    def test_criarAula_comDadosValidos_deveRetornar201ComIdELocation(self):
        # Arrange
        ts = time.time_ns()
        modulo = self.criar_modulo_via_api(f"Unidade Base Aula {ts}", ordem=60)
        payload = self.build_aula_request(modulo["id"], f"Lição Nova {ts}", ordem=1)

        # Act
        response = self.client_http.request(
            "POST", self.AULAS_PATH, body=payload, token=self.token_admin
        )

        # Assert
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.json.get("id"))
        self.assertEqual(response.json.get("titulo"), f"Lição Nova {ts}")
        self.assertEqual(
            response.get_header("Location"),
            f"/api/v1/learning/aulas/{response.json['id']}/",
        )
        self.assertTrue(Aula.objects.filter(id=response.json["id"]).exists())

    def test_listarAulas_quandoAulaCriada_deveRetornar200EConterAulaNaLista(self):
        # Arrange
        ts = time.time_ns()
        modulo = self.criar_modulo_via_api(f"Unidade Lista Aulas {ts}", ordem=61)
        aula = self.criar_aula_via_api(modulo["id"], f"Aula Listada {ts}", ordem=1)

        # Act
        response = self.client_http.request("GET", self.AULAS_PATH)

        # Assert
        self.assertEqual(response.status_code, 200)
        ids_aulas = [a["id"] for a in response.json]
        self.assertIn(aula["id"], ids_aulas)

    def test_buscarAulaPorId_comIdExistente_deveRetornar200ECamposDaAula(self):
        # Arrange
        ts = time.time_ns()
        modulo = self.criar_modulo_via_api(f"Unidade Detalhe Aula {ts}", ordem=62)
        aula = self.criar_aula_via_api(modulo["id"], f"Aula Detalhada {ts}", ordem=1)

        # Act
        response = self.client_http.request("GET", f"{self.AULAS_PATH}{aula['id']}/")

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["id"], aula["id"])
        self.assertEqual(response.json["titulo"], f"Aula Detalhada {ts}")

    def test_atualizarAula_comDadosValidos_deveRetornar200EPersistirAlteracao(self):
        # Arrange
        ts = time.time_ns()
        modulo = self.criar_modulo_via_api(f"Unidade Update Aula {ts}", ordem=63)
        aula = self.criar_aula_via_api(modulo["id"], f"Aula Antes {ts}", ordem=1)

        # Act
        response = self.client_http.request(
            "PUT",
            f"{self.AULAS_PATH}{aula['id']}/",
            body={
                "modulo": modulo["id"],
                "titulo": f"Aula Depois {ts}",
                "conteudo_teorico": "Conteúdo teórico revisado.",
                "ordem": 2,
                "ativa": True,
            },
            token=self.token_admin,
        )

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["titulo"], f"Aula Depois {ts}")
        aula_db = Aula.objects.get(id=aula["id"])
        self.assertEqual(aula_db.titulo, f"Aula Depois {ts}")

    def test_removerAula_comIdExistente_deveRetornar204EDeixarDeExistirNoBanco(self):
        # Arrange
        ts = time.time_ns()
        modulo = self.criar_modulo_via_api(f"Unidade Delete Aula {ts}", ordem=64)
        aula = self.criar_aula_via_api(modulo["id"], f"Aula Removível {ts}", ordem=1)

        # Act
        response = self.client_http.request(
            "DELETE",
            f"{self.AULAS_PATH}{aula['id']}/",
            token=self.token_admin,
        )

        # Assert
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Aula.objects.filter(id=aula["id"]).exists())

    def test_concluirAula_comoEstudanteAutenticado_deveRetornar200EAtualizarStreakEBadge(self):
        # Arrange
        ts = time.time_ns()
        modulo = self.criar_modulo_via_api(f"Unidade Conclusão {ts}", ordem=65)
        aula = self.criar_aula_via_api(modulo["id"], f"Aula Concluível {ts}", ordem=1)

        # Act
        response = self.client_http.request(
            "POST",
            f"{self.AULAS_PATH}{aula['id']}/concluir/",
            body={"acertos": 4, "total": 4},
            token=self.token_estudante,
        )

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json["concluida"])
        self.assertEqual(response.json["taxa_acerto"], 100.0)
        self.assertEqual(response.json["streak"], 1)
        self.assertIn("primeira-nota", response.json["badges"])

    # ==================== FLUXO CRUZANDO 2 RECURSOS RELACIONADOS ====================

    def test_fluxoModuloEAulas_criarModuloCriarAulaVinculadaEBuscarModulo_deveListarAulaDentroDoModulo(self):
        # Arrange
        ts = time.time_ns()
        modulo = self.criar_modulo_via_api(f"Unidade Relacional {ts}", ordem=70)
        aula = self.criar_aula_via_api(modulo["id"], f"Lição Filha {ts}", ordem=1)

        # Act
        response = self.client_http.request("GET", f"{self.MODULOS_PATH}{modulo['id']}/")

        # Assert
        self.assertEqual(response.status_code, 200)
        ids_aulas_do_modulo = [a["id"] for a in response.json["aulas"]]
        self.assertIn(aula["id"], ids_aulas_do_modulo)

    # ==================== CENÁRIOS DE ERRO (4xx: 400 e 404) ====================

    def test_criarModulo_semTituloObrigatorio_deveRetornar400ComMensagemDeValidacao(self):
        # Arrange
        payload_invalido = {"descricao": "Sem título", "categoria": "Iniciante", "ordem": 1}

        # Act
        response = self.client_http.request(
            "POST", self.MODULOS_PATH, body=payload_invalido, token=self.token_admin
        )

        # Assert
        self.assertEqual(response.status_code, 400)
        self.assertIn("titulo", response.json)

    def test_buscarModuloPorId_comUuidInexistente_deveRetornar404NotFound(self):
        # Arrange
        id_inexistente = uuid.uuid4()

        # Act
        response = self.client_http.request("GET", f"{self.MODULOS_PATH}{id_inexistente}/")

        # Assert
        self.assertEqual(response.status_code, 404)
        self.assertIsNotNone(response.json)

    def test_criarAula_comModuloInexistente_deveRetornar400BadRequest(self):
        # Arrange
        payload_invalido = {
            "modulo": str(uuid.uuid4()),
            "titulo": "Aula Órfã",
            "conteudo_teorico": "Texto",
            "ordem": 1,
        }

        # Act
        response = self.client_http.request(
            "POST", self.AULAS_PATH, body=payload_invalido, token=self.token_admin
        )

        # Assert
        self.assertEqual(response.status_code, 400)
        self.assertIn("modulo", response.json)

    def test_buscarAulaPorId_comUuidInexistente_deveRetornar404NotFound(self):
        # Arrange
        id_inexistente = uuid.uuid4()

        # Act
        response = self.client_http.request("GET", f"{self.AULAS_PATH}{id_inexistente}/")

        # Assert
        self.assertEqual(response.status_code, 404)
        self.assertIsNotNone(response.json)

    # ==================== TRÍADE DE SEGURANÇA (401, 403 e 201 no mesmo endpoint) ====================

    def test_criarModulo_semTokenDeAutenticacao_deveRetornar401Unauthorized(self):
        # Arrange
        payload = self.build_modulo_request("Unidade Sem Token", ordem=80)

        # Act
        response = self.client_http.request("POST", self.MODULOS_PATH, body=payload, token=None)

        # Assert
        self.assertEqual(response.status_code, 401)

    def test_criarModulo_comoEstudanteSemPermissao_deveRetornar403Forbidden(self):
        # Arrange
        payload = self.build_modulo_request("Unidade Bloqueada Para Aluno", ordem=81)

        # Act
        response = self.client_http.request(
            "POST", self.MODULOS_PATH, body=payload, token=self.token_estudante
        )

        # Assert
        self.assertEqual(response.status_code, 403)