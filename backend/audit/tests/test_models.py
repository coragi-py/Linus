# Este arquivo foca em garantir que a imutabilidade do AuditLog funcione em nível de banco de dados.

from django.test import TestCase
from django.core.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from audit.models import AuditLog

User = get_user_model()

class AuditLogModelTests(TestCase):
    def setUp(self):
        # Cria um usuário de teste para associar ao log
        self.user = User.objects.create_user(
            email="auditoria@linus.com",
            nome="Inspetor de Logs",
            password="Password@123"
        )
        
        # Cria um log inicial válido
        self.log = AuditLog.objects.create(
            user=self.user,
            action="INITIAL_TEST_ACTION",
            ip_address="192.168.0.1",
            user_agent="Mozilla/5.0 TestAgent",
            payload={"teste": True}
        )

    def test_criacao_de_log_sucesso(self):
        """Garante que a inserção (INSERT) de um log no banco ocorra normalmente."""
        self.assertEqual(AuditLog.objects.count(), 1)
        self.assertEqual(self.log.action, "INITIAL_TEST_ACTION")

    def test_update_log_bloqueado(self):
        """Garante a imutabilidade: impede qualquer atualização (UPDATE) de um log existente."""
        self.log.action = "TAMPERED_ACTION"
        
        with self.assertRaisesMessage(PermissionDenied, "Registros de auditoria são imutáveis e não podem ser alterados."):
            self.log.save()

    def test_delete_log_bloqueado(self):
        """Garante a imutabilidade: impede a exclusão (DELETE) de um log existente."""
        with self.assertRaisesMessage(PermissionDenied, "Registros de auditoria são imutáveis e não podem ser excluídos."):
            self.log.delete()

    def test_representacao_string(self):
        """Verifica se o método __str__ retorna o formato legível esperado."""
        expected_str = f"{self.log.timestamp} - INITIAL_TEST_ACTION - User ID: {self.user.id}"
        self.assertEqual(str(self.log), expected_str)