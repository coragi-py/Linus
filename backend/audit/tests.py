# Esse arquivo deve implementar a simulação de acessos a API para teste da camada de auditoria. Porém ainda não está funcional, aguardando a camada de accounts ser finalizada. Por Anny, em 17/09.

from django.test import TestCase, RequestFactory
from django.contrib.auth.signals import user_logged_in, user_login_failed
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient
from accounts.models import Usuario  
from .models import LogAuditoria
import audit.signals  

class AuditoriaTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        
        # Como o model Usuario ainda não possui o UserManager configurado, 
        # usamos o .create() padrão do Django passando apenas o email.
        self.user = Usuario.objects.create(email='teste@linus.com', ano_nascimento=2005)
        
        # Criamos o admin e injetamos 'is_staff' diretamente na instância 
        # da memória para satisfazer a permissão IsAdminUser da view.
        self.admin_user = Usuario.objects.create(email='admin@linus.com', ano_nascimento=2005)
        self.admin_user.is_staff = True 
        
        self.client = APIClient()

    def test_5_1_log_criacao_e_login_registrado(self):
        """Testa se os sinais de criação e login estão gerando logs (Requisito 5.1)"""
        self.assertTrue(LogAuditoria.objects.filter(acao='CADASTRO_NOVO_USUARIO').exists())

        request = self.factory.get('/fake-login/')
        request.META['REMOTE_ADDR'] = '192.168.1.100'
        
        user_logged_in.send(sender=self.user.__class__, request=request, user=self.user)

        log = LogAuditoria.objects.filter(acao='LOGIN_SUCESSO').last()
        self.assertIsNotNone(log)
        self.assertEqual(log.usuario, self.user)

    def test_5_2_log_falha_registrado(self):
        """Testa se falhas de login são registradas (Requisito 5.2)"""
        request = self.factory.get('/fake-login/')
        credenciais_erradas = {'email': 'hacker@malicioso.com'}
        
        user_login_failed.send(
            sender=__name__, 
            credentials=credenciais_erradas, 
            request=request
        )

        log = LogAuditoria.objects.filter(acao='LOGIN_FALHA').last()
        self.assertIsNotNone(log)
        self.assertEqual(log.detalhes['identificador_tentado'], 'hacker@malicioso.com')

    def test_5_3_protecao_contra_alteracao_e_exclusao(self):
        """Testa a imutabilidade dos logs (Requisito 5.3)"""
        log = LogAuditoria.objects.create(
            usuario=self.user, 
            acao='TESTE_IMUTABILIDADE', 
            ip_origem='127.0.0.1'
        )
        
        log.ip_origem = '8.8.8.8'
        with self.assertRaisesMessage(ValidationError, "Logs de auditoria são imutáveis"):
            log.save()

        with self.assertRaisesMessage(ValidationError, "Logs de auditoria não podem ser excluídos"):
            log.delete()

    def test_5_4_analise_logs_view(self):
        """Testa o endpoint de análise de logs (Requisito 5.4)"""
        for _ in range(6):
            request = self.factory.get('/fake-login/')
            request.META['REMOTE_ADDR'] = '203.0.113.50'
            user_login_failed.send(sender=__name__, credentials={'email': 'admin'}, request=request)

        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.get('/api/v1/audit/analise/') 
        
        self.assertEqual(response.status_code, 200)
        dados = response.json()
        
        self.assertIn('metricas_gerais', dados)
        self.assertTrue(dados['metricas_gerais']['logins_com_falha'] >= 6)
        
        ips_suspeitos = dados['seguranca']['alerta_ips_suspeitos']
        self.assertTrue(any(ip['ip_origem'] == '203.0.113.50' for ip in ips_suspeitos))