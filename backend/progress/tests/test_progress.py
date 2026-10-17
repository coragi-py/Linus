from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser
from learning.models import Aula
from exercises.models import Exercicio
from progress.models import ProgressoAula


class ProgressModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.aluno = CustomUser.objects.create_user(
            email="aluno.prog@teste.com",
            password="PasswordForte!123",
            nome="Aluno Progresso",
            role=CustomUser.Role.USUARIO,
            terms_accepted=True,
        )
        self.client.force_authenticate(user=self.aluno)
        self.aula = Aula.objects.first()
        self.exercicio = Exercicio.objects.filter(aula=self.aula).first()

    def test_refazer_aula_atualiza_taxa_acerto_sem_duplicar_progresso(self):
        url = f"/api/v1/learning/aulas/{self.aula.id}/concluir/"

        # 1ª conclusão com 1 de 3 acertos (33.33%)
        res1 = self.client.post(url, {"acertos": 1, "total": 3}, format="json")
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertAlmostEqual(res1.data["taxa_acerto"], 33.33, places=2)

        # 2ª conclusão com 3 de 3 acertos (100.00%)
        res2 = self.client.post(url, {"acertos": 3, "total": 3}, format="json")
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(res2.data["taxa_acerto"], 100.0)

        # Garante que existe apenas 1 registro em TB_PROGRESSO_AULA para (usuario, aula)
        registros = ProgressoAula.objects.filter(usuario=self.aluno, aula=self.aula)
        self.assertEqual(registros.count(), 1)
        self.assertEqual(registros.first().taxa_acerto, Decimal("100.00"))

    def test_endpoint_meu_progresso_consolida_dados_exclusivos_do_aluno(self):
        """RF07: O dashboard deve consolidar apenas os dados associados ao ID do usuário ativo."""
        # Registra tentativa e conclui aula
        self.client.post(
            "/api/v1/learning/tentativas/",
            {"exercicio": str(self.exercicio.id), "resposta": "Errada", "tempo_resposta_ms": 900},
            format="json",
        )
        self.client.post(
            f"/api/v1/learning/aulas/{self.aula.id}/concluir/",
            {"acertos": 2, "total": 3},
            format="json",
        )

        res = self.client.get("/api/v1/learning/progresso/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["nome"], "Aluno Progresso")
        self.assertEqual(res.data["role"], "usuario")
        self.assertEqual(res.data["streak"], 1)
        self.assertIn(str(self.aula.id), res.data["completedLessons"])
        self.assertIn("primeira-nota", res.data["badges"])
        self.assertIn(self.exercicio.tag_topico, res.data["errorsByTopic"])