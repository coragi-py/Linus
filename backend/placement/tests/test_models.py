from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from placement.models import SessaoTriagem, TriagemInicial, PerguntaTriagem, OpcaoTriagem

User = get_user_model()

class PlacementModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="aluno_triagem@linus.com", nome="Aluno", password="Password@123")

    def test_sessao_triagem_creation(self):
        """Testa o armazenamento de uma sessão temporária de triagem para visitantes."""
        sessao = SessaoTriagem.objects.create(
            session_key="sess_123456",
            respostas={"q1": "opt1"},
            nivel_atribuido="Iniciante",
            status="concluida",
            expires_at=timezone.now() + timedelta(hours=2)
        )
        self.assertEqual(sessao.session_key, "sess_123456")
        self.assertEqual(sessao.nivel_atribuido, "Iniciante")

    def test_triagem_inicial_creation(self):
        """Testa o registro histórico da triagem vinculado a um aluno cadastrado."""
        triagem = TriagemInicial.objects.create(
            usuario=self.user,
            respostas={"q2": "opt3"},
            nivel_atribuido="Intermediário"
        )
        self.assertEqual(triagem.usuario, self.user)
        self.assertEqual(triagem.nivel_atribuido, "Intermediário")

    def test_pergunta_opcao_str(self):
        """Valida a representação em string dos modelos para o Django Admin e logs."""
        pergunta = PerguntaTriagem.objects.create(
            enunciado="O que é uma semibreve?",
            tipo="texto",
            ordem=1
        )
        opcao = OpcaoTriagem.objects.create(
            pergunta=pergunta,
            texto="Uma figura musical",
            peso_perfil=2
        )
        self.assertEqual(str(pergunta), "1 - O que é uma semibreve?")
        self.assertEqual(str(opcao), "Uma figura musical")