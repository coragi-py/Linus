# 

from django.test import TestCase, RequestFactory
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from audit.models import AuditLog
from audit.services.audit_service import AuditService

User = get_user_model()

class AuditServiceTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(
            email='rastreio@linus.com',
            nome='Usuario Rastreado',
            password='Password@123'
        )

    def test_get_client_ip_via_proxy(self):
        """Testa a extração do IP quando a requisição passa por um balanceador de carga/proxy."""
        request = self.factory.get('/', HTTP_X_FORWARDED_FOR='203.0.113.195, 10.0.0.1')
        ip = AuditService.get_client_ip(request)
        self.assertEqual(ip, '203.0.113.195')

    def test_get_client_ip_direto(self):
        """Testa a extração do IP quando a conexão é direta (sem HTTP_X_FORWARDED_FOR)."""
        request = self.factory.get('/', REMOTE_ADDR='198.51.100.2')
        ip = AuditService.get_client_ip(request)
        self.assertEqual(ip, '198.51.100.2')

    def test_get_client_ip_sem_request(self):
        """Garante que a falta de um request (ex: rotinas internas) retorne um IP zerado padrão."""
        ip = AuditService.get_client_ip(None)
        self.assertEqual(ip, '0.0.0.0')

    def test_get_user_agent_valido(self):
        """Garante a extração do cabeçalho do navegador."""
        request = self.factory.get('/', HTTP_USER_AGENT='LinusApp/1.0 (TestEnvironment)')
        ua = AuditService.get_user_agent(request)
        self.assertEqual(ua, 'LinusApp/1.0 (TestEnvironment)')

    def test_get_user_agent_sem_request(self):
        """Garante fallback para o User Agent caso o request seja nulo."""
        ua = AuditService.get_user_agent(None)
        self.assertEqual(ua, 'Unknown')

    def test_log_event_com_usuario_autenticado(self):
        """Verifica a gravação completa de um log associado a um usuário real."""
        request = self.factory.get('/', HTTP_X_FORWARDED_FOR='127.0.0.1', HTTP_USER_AGENT='Chrome/100')
        request.user = self.user  # Simula autenticação no RequestFactory
        
        AuditService.log_event(request, self.user, 'TEST_AUTH_ACTION', {'detalhe': 'sucesso'})
        
        log = AuditLog.objects.first()
        self.assertIsNotNone(log)
        self.assertEqual(log.user, self.user)
        self.assertEqual(log.action, 'TEST_AUTH_ACTION')
        self.assertEqual(log.ip_address, '127.0.0.1')
        self.assertEqual(log.user_agent, 'Chrome/100')
        self.assertEqual(log.payload, {'detalhe': 'sucesso'})

    def test_log_event_com_usuario_anonimo(self):
        """Garante que usuários não logados (ex: falhas de login) não quebrem o log."""
        request = self.factory.get('/')
        anonymous_user = AnonymousUser()
        
        # Payload não informado deve cair no default = {}
        AuditService.log_event(request, anonymous_user, 'FAILED_LOGIN')
        
        log = AuditLog.objects.first()
        self.assertIsNotNone(log)
        self.assertIsNone(log.user)  # O banco deve registrar null para a ForeignKey
        self.assertEqual(log.action, 'FAILED_LOGIN')
        self.assertEqual(log.payload, {})
        
    def test_log_event_sem_request_e_sem_usuario(self):
        """Testa rotinas isoladas de background onde não há nem request nem usuário."""
        AuditService.log_event(None, None, 'SYSTEM_CRON_JOB')
        
        log = AuditLog.objects.first()
        self.assertIsNotNone(log)
        self.assertIsNone(log.user)
        self.assertEqual(log.action, 'SYSTEM_CRON_JOB')
        self.assertEqual(log.ip_address, '0.0.0.0')
        self.assertEqual(log.user_agent, 'Unknown')