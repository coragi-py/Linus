from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from music.models import Musica

User = get_user_model()


class MusicaViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="musico@linus.com",
            nome="Musico Teste",
            password="Password@123",
            terms_accepted=True,
        )
        # 1º Cria a música pública (mais antiga)
        self.musica_publica = Musica.objects.create(
            nome_musica="Brilha Estrelinha",
            notas=["C4", "C4", "G4"],
            id_usuario=None,
        )
        # 2º Cria a música privada do usuário (mais recente)
        self.musica_privada = Musica.objects.create(
            nome_musica="Melodia do Usuario",
            notas=["C4", "E4", "G4"],
            id_usuario=self.user,
        )
        self.list_url = reverse("musica-list")

    def test_listar_musicas_ordem_decrescente_criacao(self):
        """Verifica se as músicas retornam em ordem da mais nova para a mais velha."""
        # Autentica o usuário para enxergar tanto as públicas quanto a sua privada (total = 2)
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        # A mais recente foi criada por último (musica_privada ou a pública dependendo da ordem)
        self.assertEqual(response.data[0]["nome_musica"], "Melodia do Usuario")

    def test_visitante_nao_autenticado_visualiza_apenas_musicas_publicas(self):
        """Garante que usuários não logados vejam apenas as amostras públicas."""
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["nome_musica"], "Brilha Estrelinha")

    def test_criar_musica_privada_com_sucesso(self):
        """Testa a criação de uma nova música vinculada ao usuário autenticado."""
        self.client.force_authenticate(user=self.user)
        data = {
            "nome_musica": "Nova Composicao",
            "notas": ["D4", "F4", "A4"],
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["nome_musica"], "Nova Composicao")
        self.assertFalse(response.data["is_publica"])

    def test_atualizar_musica_sucesso(self):
        """Testa a edição de uma música própria do usuário."""
        self.client.force_authenticate(user=self.user)
        detail_url = reverse("musica-detail", kwargs={"pk": self.musica_privada.pk})
        data = {
            "nome_musica": "Melodia Atualizada",
            "notas": ["C4", "E4", "G4", "B4"],
        }
        response = self.client.put(detail_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.musica_privada.refresh_from_db()
        self.assertEqual(self.musica_privada.nome_musica, "Melodia Atualizada")

    def test_deletar_musica_sucesso(self):
        """Testa a exclusão de uma música própria do usuário."""
        self.client.force_authenticate(user=self.user)
        detail_url = reverse("musica-detail", kwargs={"pk": self.musica_privada.pk})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Musica.objects.filter(pk=self.musica_privada.pk).exists())

    def test_aluno_nao_pode_deletar_musica_publica(self):
        """Garante que um aluno comum não consegue excluir amostras públicas da plataforma."""
        self.client.force_authenticate(user=self.user)
        detail_url = reverse("musica-detail", kwargs={"pk": self.musica_publica.pk})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Musica.objects.filter(pk=self.musica_publica.pk).exists())