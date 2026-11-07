import uuid
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser
from learning.models import Modulo, Aula
from exercises.models import Exercicio, TentativaExercicio
from exercises.serializers import ExercicioSerializer


class ExercisesModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.aluno = CustomUser.objects.create_user(
            email="aluno.ex@teste.com",
            password="PasswordForte!123",
            nome="Aluno Exercicio",
            role=CustomUser.Role.USUARIO,
            terms_accepted=True,
        )
        self.admin_conteudo = CustomUser.objects.create_user(
            email="admin.ex@teste.com",
            password="PasswordForte!123",
            nome="Admin Exercicio",
            role=CustomUser.Role.ADMIN_CONTEUDO,
            terms_accepted=True,
        )
        self.aula = Aula.objects.first()
        self.exercicio = Exercicio.objects.filter(aula=self.aula).first()

    def test_serializer_exercicio_mapeia_aliases_do_gabarito(self):
        ex = Exercicio.objects.create(
            aula=self.aula,
            tipo="builder",
            enunciado="Monte a tríade de Dó Maior",
            gabarito_dados={
                "ordem": 10,
                "sequence": ["C4", "E4", "G4"],
                "answer": "C4,E4,G4",
                "explanation": "Dó, Mi e Sol formam a tríade maior.",
            },
            tag_topico="Acordes e Campos Harmônicos",
            ativo=True,
        )
        data = ExercicioSerializer(ex).data
        self.assertEqual(data["kind"], "builder")
        self.assertEqual(data["prompt"], "Monte a tríade de Dó Maior")
        self.assertEqual(data["answer"], "C4,E4,G4")
        self.assertEqual(data["sequence"], ["C4", "E4", "G4"])
        self.assertEqual(data["explanation"], "Dó, Mi e Sol formam a tríade maior.")

    def test_filtrar_exercicios_por_aula(self):
        response = self.client.get(f"/api/v1/learning/exercicios/?aula={self.aula.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        for item in response.data:
            self.assertEqual(str(item["aula"]), str(self.aula.id))

    def test_registrar_tentativa_correta_e_incorreta_calcula_precisao(self):
        self.client.force_authenticate(user=self.aluno)
        resposta_correta = self.exercicio.gabarito_dados.get("answer")

        # 1ª tentativa: Correta
        res_ok = self.client.post(
            "/api/v1/learning/tentativas/",
            {
                "exercicio": str(self.exercicio.id),
                "resposta": resposta_correta,
                "tempo_resposta_ms": 1200,
            },
            format="json",
        )
        self.assertEqual(res_ok.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res_ok.data["acertou"])

        # 2ª tentativa: Incorreta
        res_err = self.client.post(
            "/api/v1/learning/tentativas/",
            {
                "exercicio": str(self.exercicio.id),
                "resposta": "NotaInvalida",
                "tempo_resposta_ms": 2500,
            },
            format="json",
        )
        self.assertEqual(res_err.status_code, status.HTTP_201_CREATED)
        self.assertFalse(res_err.data["acertou"])

        stats_topico = res_err.data["errorsByTopic"][self.exercicio.tag_topico]
        self.assertEqual(stats_topico["total"], 2)
        self.assertEqual(stats_topico["erros"], 1)
        self.assertEqual(TentativaExercicio.objects.filter(usuario=self.aluno).count(), 2)

    def test_registrar_tentativa_valida_erros_400_e_404(self):
        self.client.force_authenticate(user=self.aluno)

        # Sem campo exercicio -> 400
        res_400 = self.client.post("/api/v1/learning/tentativas/", {}, format="json")
        self.assertEqual(res_400.status_code, status.HTTP_400_BAD_REQUEST)

        # UUID inexistente -> 404
        res_404 = self.client.post(
            "/api/v1/learning/tentativas/",
            {"exercicio": str(uuid.uuid4()), "resposta": "Dó"},
            format="json",
        )
        self.assertEqual(res_404.status_code, status.HTTP_404_NOT_FOUND)