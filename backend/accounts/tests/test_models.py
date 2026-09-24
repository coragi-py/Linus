# Este arquivo garante que as validações de banco de dados, bloqueios de palavras impróprias e a lógica de criação de usuários e superusuários funcionem perfeitamente em nível de ORM.

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from accounts.models import validar_nickname_apropriado

User = get_user_model()

class CustomUserModelTests(TestCase):
    def test_validar_nickname_bloqueia_palavras_improprias(self):
        """Garante que a blacklist do validador levante erro para nomes proibidos."""
        with self.assertRaises(ValidationError):
            validar_nickname_apropriado('admin_master')
        with self.assertRaises(ValidationError):
            validar_nickname_apropriado('SistemaLinus')

    def test_validar_nickname_permite_nomes_comuns(self):
        """Garante que nomes válidos passem sem levantar exceções."""
        try:
            validar_nickname_apropriado('João Silva')
        except ValidationError:
            self.fail("validar_nickname_apropriado levantou ValidationError inesperadamente.")

    def test_criar_usuario_sucesso(self):
        """Verifica a criação padrão de usuário e o hash de senha."""
        user = User.objects.create_user(
            email='aluno@teste.com', 
            nome='Aluno Teste', 
            password='Password@123'
        )
        self.assertEqual(user.email, 'aluno@teste.com')
        self.assertTrue(user.check_password('Password@123'))
        self.assertEqual(user.role, 'usuario')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)

    def test_criar_usuario_sem_email_ou_nome_falha(self):
        """Validações do CustomUserManager para campos obrigatórios."""
        with self.assertRaisesMessage(ValueError, 'O e-mail é obrigatório para o cadastro.'):
            User.objects.create_user(email='', nome='Teste', password='123')
            
        with self.assertRaisesMessage(ValueError, 'O nome/nickname é obrigatório para o cadastro.'):
            User.objects.create_user(email='teste@teste.com', nome='', password='123')

    def test_criar_superuser_sucesso(self):
        """Garante que o superuser receba as roles e permissões máximas do RBAC."""
        admin = User.objects.create_superuser(
            email='admin@teste.com', 
            password='Password@123'
        )
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertEqual(admin.role, 'admin-sistema')
        self.assertEqual(admin.nome, 'Administrador')