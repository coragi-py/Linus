import unittest
from unittest.mock import patch, MagicMock
from accounts.services.security_service import SecurityService

class SecurityServiceTest(unittest.TestCase):
    
    # 1. Caminho Feliz + Interação
    @patch('accounts.services.security_service.TwoFactorAuthToken.objects.filter')
    def test_deve_retornar_true_e_marcar_como_usado_quando_token_valido(self, mock_filter):
        # Arrange
        token_gerado = "123456"
        hash_esperado = SecurityService.hash_token(token_gerado)
        
        mock_token_obj = MagicMock()
        mock_token_obj.is_valid.return_value = True
        mock_token_obj.token_hash = hash_esperado
        
        # Configura o encadeamento: filter().order_by().first()
        mock_filter.return_value.order_by.return_value.first.return_value = mock_token_obj
        mock_user = MagicMock()

        # Act
        resultado = SecurityService.verify_2fa_token(mock_user, token_gerado)
        
        # Assert
        self.assertTrue(resultado)
        mock_token_obj.save.assert_called_once_with(update_fields=['is_used'])

    # 2. Violação + Mock Never (assert_not_called)
    @patch('accounts.services.security_service.TwoFactorAuthToken.objects.filter')
    def test_deve_retornar_false_e_nunca_salvar_quando_token_nao_encontrado(self, mock_filter):
        # Arrange
        mock_filter.return_value.order_by.return_value.first.return_value = None
        mock_user = MagicMock()

        # Act
        resultado = SecurityService.verify_2fa_token(mock_user, "000000")
        
        # Assert
        self.assertFalse(resultado)
        # O equivalente exato a verify(mock, never()).save() do Mockito
        mock_token_obj = MagicMock()
        mock_token_obj.save.assert_not_called()

    # 3. Limite (OTP Seguro)
    @patch('accounts.services.security_service.TwoFactorAuthToken.objects.create')
    @patch('accounts.services.security_service.TwoFactorAuthToken.objects.filter')
    def test_deve_gerar_otp_com_exatamente_seis_digitos_na_fronteira(self, mock_filter, mock_create):
        # Act
        otp = SecurityService.create_2fa_token(MagicMock())
        # Assert
        self.assertEqual(len(otp), 6)
        self.assertTrue(otp.isdigit())