import unittest
from unittest.mock import patch, MagicMock
from audit.services.audit_service import AuditService

class AuditServiceTest(unittest.TestCase):
    
    # 1. Caminho Feliz + Mock Verify
    @patch('audit.services.audit_service.AuditLog.objects.create')
    def test_deve_registrar_evento_com_dados_corretos(self, mock_create):
        # Arrange
        mock_request = MagicMock()
        mock_request.META = {'HTTP_X_FORWARDED_FOR': '192.168.1.5'}
        mock_user = MagicMock(is_authenticated=True)
        
        # Act
        AuditService.log_event(mock_request, mock_user, "LOGIN_SUCCESS", {"app": "linus"})
        
        # Assert
        mock_create.assert_called_once_with(
            user=mock_user,
            action="LOGIN_SUCCESS",
            ip_address="192.168.1.5",
            user_agent="Unknown",
            payload={"app": "linus"}
        )

    # 2. Caso-Limite (Múltiplos IPs no Forwarded For)
    def test_deve_extrair_apenas_primeiro_ip_quando_houver_multiplos(self):
        # Arrange
        mock_request = MagicMock()
        mock_request.META = {'HTTP_X_FORWARDED_FOR': '10.0.0.1, 192.168.1.1, 127.0.0.1'}
        
        # Act
        ip = AuditService.get_client_ip(mock_request)
        
        # Assert
        self.assertEqual(ip, '10.0.0.1')

    # 3. Violação / Erro (Headers ausentes)
    def test_deve_retornar_ip_padrao_quando_request_nao_tiver_headers_conhecidos(self):
        # Arrange
        mock_request = MagicMock()
        mock_request.META = {} # Sem REMOTE_ADDR ou HTTP_X_FORWARDED_FOR
        
        # Act
        ip = AuditService.get_client_ip(mock_request)
        
        # Assert
        self.assertEqual(ip, '0.0.0.0')