from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser
from audit.models import AuditLog
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

    def test_rbac_bloqueia_visitante_e_aluno_comum_de_modificar_conteudo(self):
        payload = {
            "ordem": 99,
            "titulo": "Unidade Invasora",
            "descricao": "Teste RBAC",
            "categoria": "Iniciante",
            "ativo": True,
        }
        # Visitante anônimo -> 401
        res_anon = self.client.post("/api/v1/learning/modulos/", payload, format="json")
        self.assertEqual(res_anon.status_code, status.HTTP_401_UNAUTHORIZED)

        # Aluno autenticado -> 403
        self.client.force_authenticate(user=self.aluno)
        res_aluno = self.client.post("/api/v1/learning/modulos/", payload, format="json")
        self.assertEqual(res_aluno.status_code, status.HTTP_403_FORBIDDEN)

    def test_rbac_permite_admin_conteudo_crud_completo_com_auditoria(self):
        self.client.force_authenticate(user=self.admin_conteudo)

        # Criar módulo
        payload_mod = {
            "ordem": 5,
            "titulo": "Unidade 5: Rítmica Avançada",
            "descricao": "Polirritmia e compassos compostos.",
            "categoria": "Praticante Empírico",
            "ativo": True,
        }
        res_mod = self.client.post("/api/v1/learning/modulos/", payload_mod, format="json")
        self.assertEqual(res_mod.status_code, status.HTTP_201_CREATED)
        mod_id = res_mod.data["id"]
        self.assertTrue(AuditLog.objects.filter(action="MODULO_CREATED").exists())

        # Atualizar módulo
        res_patch = self.client.patch(
            f"/api/v1/learning/modulos/{mod_id}/",
            {"titulo": "Unidade 5: Rítmica Modificada"},
            format="json",
        )
        self.assertEqual(res_patch.status_code, status.HTTP_200_OK)
        self.assertTrue(AuditLog.objects.filter(action="MODULO_UPDATED").exists())

        # Criar aula dentro do módulo
        payload_aula = {
            "modulo": mod_id,
            "ordem": 1,
            "titulo": "Compasso 6/8",
            "conteudo_teorico": "Subdivisão ternária",
            "ativa": True,
        }
        res_aula = self.client.post("/api/v1/learning/aulas/", payload_aula, format="json")
        self.assertEqual(res_aula.status_code, status.HTTP_201_CREATED)
        aula_id = res_aula.data["id"]
        self.assertTrue(AuditLog.objects.filter(action="AULA_CREATED").exists())

        # Excluir aula e módulo
        res_del_aula = self.client.delete(f"/api/v1/learning/aulas/{aula_id}/")
        self.assertEqual(res_del_aula.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(AuditLog.objects.filter(action="AULA_DELETED").exists())

        res_del_mod = self.client.delete(f"/api/v1/learning/modulos/{mod_id}/")
        self.assertEqual(res_del_mod.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(AuditLog.objects.filter(action="MODULO_DELETED").exists())