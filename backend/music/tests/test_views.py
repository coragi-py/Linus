from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from music.models import Musica

User = get_user_model()

class MusicaViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="aluno_musica@linus.com",
            nome="Beethoven",
            password="Password@123"
        )
        # Cria uma música inicial para testar leitura, atualização e exclusão
        self.musica_a = Musica.objects.create(
            nome_musica="Ode to Joy",
            notas=["E4", "E4", "F4", "G4"],
            id_usuario=self.user
        )
        # Router registrou basename='musica', então as URLs automáticas são 'musica-list' e 'musica-detail'
        self.list_url = reverse('musica-list') 

    def test_listar_musicas_ordem_decrescente_criacao(self):
        """Verifica se as músicas retornam em ordem da mais nova para a mais velha."""
        Musica.objects.create(
            nome_musica="Fur Elise",
            notas=["E5", "D#5", "E5"]
        )
        
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        # Confirma ordenação '-data_criacao' (Fur Elise criada depois, logo é o index 0)
        self.assertEqual(response.data[0]['nome_musica'], "Fur Elise")
        self.assertEqual(response.data[1]['nome_musica'], "Ode to Joy")

    def test_criar_musica_usuario_autenticado(self):
        """Testa o perform_create para atrelar a gravação ao estudante logado."""
        self.client.force_authenticate(user=self.user)
        data = {
            "nome_musica": "Sonata ao Luar",
            "notas": ["C#4", "E4", "G#4"]
        }
        
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['id_usuario'], self.user.id)

    def test_criar_musica_usuario_nao_autenticado(self):
        """Testa o perform_create atrelando id_usuario como nulo para visitantes."""
        self.client.force_authenticate(user=None)
        data = {
            "nome_musica": "Tema Visitante",
            "notas": ["C4", "E4", "G4"]
        }
        
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNone(response.data['id_usuario'])

    def test_serializer_bloqueia_notas_fora_do_formato_array(self):
        """Garante que a API devolva 400 se o Frontend enviar uma string ao invés de uma lista de notas."""
        data = {
            "nome_musica": "Erro Formato",
            "notas": "C4, D4, E4" # Passando como string em vez de lista [ ]
        }
        
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("O campo notas deve ser uma lista.", str(response.data['notas']))

    def test_serializer_bloqueia_excesso_de_notas(self):
        """Testa a barreira de performance/banco impedindo uma requisição com mais de 128 notas."""
        data = {
            "nome_musica": "Música Super Longa",
            "notas": ["C4"] * 129 # Cria um array com 129 posições
        }
        
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Uma música não pode ter mais do que 128 notas.", str(response.data['notas']))

    def test_atualizar_musica_sucesso(self):
        """Testa a edição de uma música."""
        detail_url = reverse('musica-detail', args=[self.musica_a.id_musica])
        data = {
            "nome_musica": "Ode to Joy Editada",
            "notas": ["E4", "E4", "F4", "G4", "A4"]
        }
        
        response = self.client.put(detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.musica_a.refresh_from_db()
        self.assertEqual(self.musica_a.nome_musica, "Ode to Joy Editada")
        self.assertEqual(len(self.musica_a.notas), 5)

    def test_deletar_musica_sucesso(self):
        """Testa a operação de exclusão."""
        detail_url = reverse('musica-detail', args=[self.musica_a.id_musica])
        response = self.client.delete(detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Musica.objects.count(), 0)