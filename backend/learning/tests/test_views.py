from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser
from learning.models import Modulo, Aula
from exercises.models import Exercicio, TentativaExercicio
from progress.models import ProgressoAula
from gamification.models import GamificacaoPerfil, UsuarioBadge


class LearningModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.aluno = CustomUser.objects.create_user(
            email="aluno@teste.com",
            password="PasswordForte!123",
            nome="Aluno Teste",
            role=CustomUser.Role.USUARIO,
            terms_accepted=True,
        )

        self.admin_conteudo = CustomUser.objects.create_user(
            email="conteudo@teste.com",
            password="PasswordForte!123",
            nome="Gestor Conteudo",
            role=CustomUser.Role.ADMIN_CONTEUDO,
            terms_accepted=True,
        )

        self.modulo = Modulo.objects.first()
        self.aula = Aula.objects.filter(modulo=self.modulo).order_by("ordem").first()
        self.exercicio = Exercicio.objects.filter(aula=self.aula).first()

    def test_listar_modulos_retorna_unidades_e_exercicios(self):
        response = self.client.get("/api/v1/learning/modulos/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 4)
        primeira_unidade = response.data[0]
        self.assertIn("lessons", primeira_unidade)
        self.assertIn("exercises", primeira_unidade["lessons"][0])

    def test_rbac_bloqueia_aluno_comum_de_criar_modulo(self):
        self.client.force_authenticate(user=self.aluno)
        payload = {
            "ordem": 99,
            "titulo": "Unidade Invasora",
            "descricao": "Teste RBAC",
            "categoria": "Iniciante",
            "ativo": True,
        }
        response = self.client.post("/api/v1/learning/modulos/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_rbac_permite_admin_conteudo_criar_modulo(self):
        self.client.force_authenticate(user=self.admin_conteudo)
        payload = {
            "ordem": 5,
            "titulo": "Unidade 5: Rítmica Avançada",
            "descricao": " Polirritmia e compassos compostos.",
            "categoria": "Praticante Empírico",
            "ativo": True,
        }
        response = self.client.post("/api/v1/learning/modulos/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_registrar_tentativa_exercicio_e_calcular_erros_por_topico(self):
        self.client.force_authenticate(user=self.aluno)
        payload = {
            "exercicio": str(self.exercicio.id),
            "resposta": "Resposta Errada",
            "tempo_resposta_ms": 1850,
        }
        response = self.client.post("/api/v1/learning/tentativas/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(response.data["acertou"])
        self.assertIn(self.exercicio.tag_topico, response.data["errorsByTopic"])
        self.assertEqual(
            response.data["errorsByTopic"][self.exercicio.tag_topico]["erros"], 1
        )
        self.assertEqual(TentativaExercicio.objects.filter(usuario=self.aluno).count(), 1)

    def test_concluir_aula_atualiza_progresso_streak_e_concede_badge(self):
        self.client.force_authenticate(user=self.aluno)
        url = f"/api/v1/learning/aulas/{self.aula.id}/concluir/"
        response = self.client.post(
            url, {"acertos": 3, "total": 3}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["concluida"])
        self.assertEqual(response.data["streak"], 1)
        self.assertIn(str(self.aula.id), response.data["completedLessons"])
        self.assertIn("primeira-nota", response.data["badges"])

        self.assertTrue(
            ProgressoAula.objects.filter(
                usuario=self.aluno, aula=self.aula, concluida=True
            ).exists()
        )
        perfil = GamificacaoPerfil.objects.get(usuario=self.aluno)
        self.assertEqual(perfil.streak_atual, 1)
        self.assertTrue(
            UsuarioBadge.objects.filter(
                usuario=self.aluno, badge__codigo="primeira-nota"
            ).exists()
        )