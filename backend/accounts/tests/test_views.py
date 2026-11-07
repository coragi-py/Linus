# Este arquivo utiliza o APIClient do Django REST Framework para simular requisições HTTP reais,
# testando o fluxo de Registro, Login, regras de RBAC, suspensão de contas e anonimização da LGPD.

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from unittest.mock import patch
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class AuthAndLGPDViewsTests(APITestCase):
    def setUp(self):
        # Usuário padrão (Estudante) - 2FA desativado para testar login direto
        self.user = User.objects.create_user(
            email='estudante@linus.com',
            nome='Estudante',
            password='Password@123',
            terms_accepted=True,
            is_2fa_enabled=False,
            role='usuario'
        )
        # Administrador de Sistema
        self.admin = User.objects.create_superuser(
            email='admin@linus.com',
            password='Password@123'
        )

    def test_registro_usuario_sucesso(self):
        """Testa o endpoint de registro completo gerando tokens JWT."""
        url = reverse('register')
        data = {
            'nome': 'Novo Aluno',
            'email': 'novo@linus.com',
            'password': 'StrongPassword@1',
            'ano_nascimento': 2005,
            'terms_accepted': True,
            'terms_version': '1.0'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('message', response.data)

    def test_login_sucesso_retorna_tokens(self):
        """Garante que credenciais válidas retornam o JWT."""
        url = reverse('login')
        response = self.client.post(url, {'email': 'estudante@linus.com', 'password': 'Password@123'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_login_lgpd_revogado_bloqueia_acesso(self):
        """Verifica a conformidade LGPD: acesso suspenso se termos não estiverem aceitos."""
        self.user.terms_accepted = False
        self.user.save()

        url = reverse('login')
        response = self.client.post(url, {'email': 'estudante@linus.com', 'password': 'Password@123'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['status'], 'terms_required')

    def test_login_usuario_suspenso_pelo_admin_bloqueia_acesso(self):
        """Garante que um usuário com is_active=False (mesmo com termos aceitos) não consiga logar."""
        self.user.is_active = False
        self.user.save(update_fields=['is_active'])

        url = reverse('login')
        response = self.client.post(url, {'email': 'estudante@linus.com', 'password': 'Password@123'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('error', response.data)

    def test_rbac_acesso_admin_por_estudante_negado(self):
        """Verifica se um usuário comum é barrado em rotas de administrador."""
        self.client.force_authenticate(user=self.user)
        url = reverse('admin-users-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_rbac_acesso_admin_por_admin_permitido(self):
        """Verifica se um admin do sistema consegue acessar a tabela de gestão."""
        self.client.force_authenticate(user=self.admin)
        url = reverse('admin-users-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

    def test_admin_suspende_e_reativa_usuario_no_banco(self):
        """Verifica se o PATCH do admin altera efetivamente is_active na TB_USUARIO."""
        self.client.force_authenticate(user=self.admin)
        url = f"/api/v1/auth/admin/users/{self.user.id}/"

        # 1. Suspender
        res_suspend = self.client.patch(url, {'ativo': False}, format='json')
        self.assertEqual(res_suspend.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_active)

        # 2. Reativar
        res_reactivate = self.client.patch(url, {'ativo': True}, format='json')
        self.assertEqual(res_reactivate.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)

    def test_admin_nao_pode_suspender_propria_conta(self):
        """Impede que o administrador desative a si mesmo."""
        self.client.force_authenticate(user=self.admin)
        url = f"/api/v1/auth/admin/users/{self.admin.id}/"
        response = self.client.patch(url, {'ativo': False}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.admin.refresh_from_db()
        self.assertTrue(self.admin.is_active)

    def test_admin_altera_role_de_usuario(self):
        """Verifica se o admin consegue promover um estudante para admin-conteudo e reverter."""
        self.client.force_authenticate(user=self.admin)
        url = f"/api/v1/auth/admin/users/{self.user.id}/"

        response = self.client.patch(url, {'role': 'conteudo'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, 'admin-conteudo')

        response_revert = self.client.patch(url, {'role': 'estudante'}, format='json')
        self.assertEqual(response_revert.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, 'estudante')

    def test_lgpd_exclusao_de_conta_anonimiza_dados(self):
        """Garante a exclusão irreversível dos dados pessoais mantendo a integridade demográfica."""
        self.client.force_authenticate(user=self.user)
        url = reverse('privacy-delete-account')
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Recarrega o usuário do banco para verificar a anonimização
        self.user.refresh_from_db()
        self.assertTrue(self.user.email.endswith('@anon.com'))
        self.assertEqual(self.user.nome, '********')
        self.assertFalse(self.user.is_active)
        self.assertFalse(self.user.terms_accepted)
        self.assertFalse(self.user.has_usable_password())


class SecurityAndProfileViewsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='perfil@linus.com',
            nome='Usuario Perfil',
            password='Password@123',
            terms_accepted=True,
            is_2fa_enabled=True,
            role='usuario'
        )
        self.client.force_authenticate(user=self.user)

    def test_atualizacao_de_perfil_com_sucesso(self):
        """Verifica se o usuário consegue alterar o próprio nome."""
        url = reverse('profile-update')
        response = self.client.put(url, {'nome': 'Nome Atualizado'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.nome, 'Nome Atualizado')

    def test_atualizacao_de_perfil_nome_curto_falha(self):
        """Verifica o bloqueio de nomes curtos."""
        url = reverse('profile-update')
        response = self.client.put(url, {'nome': 'A'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_troca_de_senha_com_sucesso(self):
        """Testa o endpoint de mudança de senha segura (Update Password)."""
        url = reverse('password-change')
        data = {
            'old_password': 'Password@123',
            'new_password': 'NovaSenha@2026'
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NovaSenha@2026'))

    def test_logout_invalida_token(self):
        """Verifica se a rota de logout coloca o refresh_token na blacklist."""
        refresh = RefreshToken.for_user(self.user)
        url = reverse('logout')

        response = self.client.post(url, {'refresh': str(refresh)})
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    @patch('accounts.services.email_service.EmailService.send_password_reset_email')
    def test_solicitacao_recuperacao_senha(self, mock_send_email):
        """Verifica o envio de recuperação de senha simulando o disparo de e-mail (Mock)."""
        self.client.force_authenticate(user=None)
        url = reverse('password-reset-request')

        response = self.client.post(url, {'email': 'perfil@linus.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(mock_send_email.called)

    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_registro_com_sucesso(self, mock_verify):
        """Simula um token do Google válido para testar a criação de conta via OAuth."""
        self.client.force_authenticate(user=None)

        mock_verify.return_value = {
            'email': 'oauth@linus.com',
            'email_verified': True
        }

        url = reverse('google-auth')
        data = {
            'id_token': 'token_falso_123',
            'name': 'Usuario OAuth',
            'terms_accepted': True,
            'terms_version': '1.0'
        }

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertTrue(User.objects.filter(email='oauth@linus.com').exists())