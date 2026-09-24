from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from glossary.models import Glossario

class GlossarioViewSetTests(APITestCase):
    def setUp(self):
        # Criação de massa de dados focada em teoria musical
        self.termo_a = Glossario.objects.create(
            termo="Acorde",
            definicao="Conjunto de três ou mais notas tocadas simultaneamente.",
            figura_svg="<svg class='vexflow'><g class='vf-stave'>...</g></svg>",
            categoria="Harmonia"
        )
        self.termo_p = Glossario.objects.create(
            termo="Pauta",
            definicao="Conjunto de 5 linhas e 4 espaços onde se escrevem as notas.",
            categoria="Notação"
        )
        self.list_url = reverse('glossario-list') 

    def test_listar_termos_ordem_alfabetica(self):
        """Verifica se o GET retorna todos os itens ordenados alfabeticamente pelo termo."""
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verifica a ordenação ('Acorde' deve vir antes de 'Pauta')
        self.assertEqual(response.data[0]['termo'], "Acorde")
        self.assertEqual(response.data[1]['termo'], "Pauta")

    def test_listar_termos_sem_paginacao(self):
        """Garante que a resposta é um Array direto (pagination_class = None)."""
        response = self.client.get(self.list_url)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 2)

    def test_serializer_expoe_aliases_em_ingles(self):
        """Verifica se a resposta da API expõe as chaves traduzidas para o frontend do aluno."""
        response = self.client.get(self.list_url)
        item = response.data[0] # Pega o termo "Acorde"
        
        self.assertIn("term", item)
        self.assertEqual(item["term"], "Acorde")
        
        self.assertIn("definition", item)
        self.assertEqual(item["definition"], "Conjunto de três ou mais notas tocadas simultaneamente.")
        
        # Garante que o diagrama renderizado pelo VexFlow é exposto corretamente
        self.assertIn("diagram", item)
        self.assertTrue(item["diagram"].startswith("<svg class='vexflow'>"))
        
        self.assertIn("category", item)
        self.assertEqual(item["category"], "Harmonia")

    def test_criar_novo_termo_sucesso(self):
        """Testa a operação de POST (Create) para um novo termo musical."""
        data = {
            "termo": "Semibreve",
            "definicao": "Figura musical que representa a maior duração relativa.",
            "categoria": "Ritmo"
        }
        response = self.client.post(self.list_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Glossario.objects.count(), 3)

    def test_atualizar_termo_sucesso(self):
        """Testa a operação de PUT (Update) corrigindo uma definição."""
        detail_url = reverse('glossario-detail', args=[self.termo_a.id])
        data = {
            "termo": "Acorde",
            "definicao": "Sobreposição de terças formando uma harmonia.",
            "categoria": "Harmonia"
        }
        response = self.client.put(detail_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.termo_a.refresh_from_db()
        self.assertEqual(self.termo_a.definicao, "Sobreposição de terças formando uma harmonia.")

    def test_deletar_termo_sucesso(self):
        """Testa a exclusão de um termo do glossário (DELETE)."""
        detail_url = reverse('glossario-detail', args=[self.termo_p.id])
        response = self.client.delete(detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Glossario.objects.count(), 1)

    def test_rota_alternativa_admin_termos(self):
        """Garante que a rota mapeada como 'glossario-termos' para o dashboard admin funciona."""
        url_termos = reverse('glossario-termos-list')
        response = self.client.get(url_termos)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)