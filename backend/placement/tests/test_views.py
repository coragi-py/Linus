from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
import uuid
from placement.models import PerguntaTriagem, OpcaoTriagem, SessaoTriagem

class PlacementViewSetTests(APITestCase):
    def setUp(self):
        # Q1 (Ativa) - Peso máximo 3
        self.q1 = PerguntaTriagem.objects.create(enunciado="Lê partitura?", ordem=1, ativo=True)
        self.q1_opt1 = OpcaoTriagem.objects.create(pergunta=self.q1, texto="Não", peso_perfil=1)
        self.q1_opt2 = OpcaoTriagem.objects.create(pergunta=self.q1, texto="Sim com fluência", peso_perfil=3)

        # Q2 (Ativa) - Peso máximo 2
        self.q2 = PerguntaTriagem.objects.create(enunciado="Sabe formar acordes?", ordem=2, ativo=True)
        self.q2_opt1 = OpcaoTriagem.objects.create(pergunta=self.q2, texto="O básico", peso_perfil=2)

        # Q3 (Ativa - Sem Opções) - Força a validação do "default=1" no cálculo de max() do seu view
        self.q3_sem_opcao = PerguntaTriagem.objects.create(enunciado="Q Vazia", ordem=3, ativo=True)

        # Q Inativa - Não deve aparecer para o usuário
        self.q_inativa = PerguntaTriagem.objects.create(enunciado="Q Oculta", ordem=4, ativo=False)

        # URLs
        self.admin_url = reverse('admin-questoes-list')
        self.questions_url = reverse('triagem-questions')
        self.submit_url = reverse('triagem-submit')

    def test_crud_pergunta_admin_criar(self):
        """Testa criação atômica de pergunta e opções simultaneamente via serializer."""
        data = {
            "enunciado": "Nova Pergunta Musical",
            "ordem": 5,
            "opcoes": [
                {"texto": "Opção A", "peso_perfil": 1},
                {"texto": "Opção B", "peso_perfil": 3}
            ]
        }
        response = self.client.post(self.admin_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PerguntaTriagem.objects.count(), 5)
        self.assertEqual(OpcaoTriagem.objects.filter(pergunta__enunciado="Nova Pergunta Musical").count(), 2)

    def test_crud_pergunta_admin_atualizar_com_opcoes(self):
        """Testa se a atualização zera as opções antigas e insere as novas perfeitamente."""
        detail_url = reverse('admin-questoes-detail', args=[self.q1.id])
        data = {
            "enunciado": "Lê partitura atualizada?",
            "opcoes": [
                {"texto": "Apenas Clave de Sol", "peso_perfil": 2}
            ]
        }
        response = self.client.put(detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.q1.refresh_from_db()
        self.assertEqual(self.q1.enunciado, "Lê partitura atualizada?")
        self.assertEqual(self.q1.opcoes.count(), 1)  # As 2 antigas foram apagadas

    def test_crud_pergunta_admin_atualizar_sem_opcoes(self):
        """Testa o comportamento de PATCH (Atualizar apenas o enunciado, mantendo opções)."""
        detail_url = reverse('admin-questoes-detail', args=[self.q1.id])
        data = {"enunciado": "Modificada Sem Mexer Nas Opções"}
        response = self.client.patch(detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.q1.opcoes.count(), 2)

    def test_obter_questoes_ativas_apenas(self):
        """Testa se o Endpoint público entrega apenas perguntas marcadas como ativas."""
        response = self.client.get(self.questions_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)  # q1, q2 e q3_sem_opcao

    def test_submit_vazio_falha(self):
        """Garante a barreira de segurança que impede a avaliação de gabaritos vazios."""
        response = self.client.post(self.submit_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Nenhuma resposta fornecida", response.data['erro'])

    def test_submit_nivel_iniciante(self):
        """Testa o motor de cálculo: Média <= 1.5 resulta em Iniciante (Módulo 1)."""
        data = {
            "respostas": {
                str(self.q1.id): str(self.q1_opt1.id), # Escolheu a opção de peso 1
            }
        }
        response = self.client.post(self.submit_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nivel'], 'Iniciante')
        self.assertEqual(response.data['estatisticas']['acertos'], 0) # Peso máx da Q1 é 3
        self.assertIn("Leitura de Partituras", response.data['modulo_recomendado']['titulo'])
        self.assertEqual(SessaoTriagem.objects.count(), 1)

    def test_submit_nivel_intermediario(self):
        """Testa o motor de cálculo: Média <= 2.5 resulta em Intermediário (Módulo 2)."""
        data = {
            "respostas": {
                str(self.q2.id): str(self.q2_opt1.id), # Escolheu a opção de peso 2
            }
        }
        response = self.client.post(self.submit_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nivel'], 'Intermediário')
        self.assertEqual(response.data['estatisticas']['acertos'], 1) # Peso máx da Q2 é 2

    def test_submit_nivel_avancado(self):
        """Testa o motor de cálculo: Média > 2.5 resulta em Praticante Empírico (Módulo 3)."""
        data = {
            "respostas": {
                str(self.q1.id): str(self.q1_opt2.id), # Escolheu a opção de peso 3
            }
        }
        response = self.client.post(self.submit_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nivel'], 'Praticante Empírico')
        self.assertIn("Harmonia Funcional", response.data['modulo_recomendado']['titulo'])

    def test_submit_ignora_respostas_invalidas(self):
        """Garante que IDs forjados pelo frontend não quebrem a avaliação (Except Block)."""
        data = {
            "respostas": {
                str(self.q1.id): str(uuid.uuid4()) # Manda um UUID que não existe no banco
            }
        }
        response = self.client.post(self.submit_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # O except ignora a nota. Pontuação=0. Média=0 <= 1.5 -> Iniciante
        self.assertEqual(response.data['nivel'], 'Iniciante')