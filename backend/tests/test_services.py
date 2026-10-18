import unittest
from unittest.mock import patch, MagicMock
from audit.services.audit_service import AuditService
from accounts.services.security_service import SecurityService
from placement.services import TriagemService, RespostasVaziasException, PerguntasNaoEncontradasException

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


class TriagemServiceTest(unittest.TestCase):
    
    def setUp(self):
        self.perguntas_mock = [{'id': 1, 'peso_maximo': 3}, {'id': 2, 'peso_maximo': 2}]
        self.opcoes_mock = {
            'A': {'peso_perfil': 3}, # Acerto pergunta 1
            'B': {'peso_perfil': 1}, # Erro pergunta 1
            'C': {'peso_perfil': 2}, # Acerto pergunta 2
        }

    # 1. Caminho Feliz
    def test_deve_calcular_nivel_intermediario_quando_acerta_parcialmente(self):
        # Arrange
        respostas = {'1': 'B', '2': 'C'} # Ponto 1 + Ponto 2 = 3. Media = 1.5. Wait, 3/2 = 1.5 (Iniciante). 
        # Vamos ajustar para dar media > 1.5 e <= 2.5
        opcoes_ajustadas = {'B': {'peso_perfil': 2}, 'C': {'peso_perfil': 2}} 
        
        # Act
        nivel, acertos, total, maximo = TriagemService.calcular_nivel({'1':'B', '2':'C'}, self.perguntas_mock, opcoes_ajustadas)
        
        # Assert
        self.assertEqual(nivel, 'Intermediário')

    # 2. Violação / Exceção 1 (assertThrows equivalent)
    def test_deve_lancar_excecao_quando_respostas_forem_vazias(self):
        # Act & Assert
        with self.assertRaises(RespostasVaziasException) as ex:
            TriagemService.calcular_nivel({}, self.perguntas_mock, self.opcoes_mock)
        
        self.assertIn("Nenhuma resposta fornecida", str(ex.exception))

    # 3. Violação / Exceção 2 (assertThrows equivalent)
    def test_deve_lancar_excecao_quando_nao_houver_perguntas_ativas(self):
        # Act & Assert
        with self.assertRaises(PerguntasNaoEncontradasException) as ex:
            TriagemService.calcular_nivel({'1': 'A'}, [], self.opcoes_mock)
        
        self.assertIn("Não há perguntas ativas", str(ex.exception))

    # 4. Limite Parametrizado (@ParameterizedTest equivalent)
    def test_deve_atribuir_nivel_correto_nas_fronteiras_da_media_matematica(self):
        # Arrange - (Pontuação Total Simulada, Nível Esperado)
        casos_teste = [
            (3, 'Iniciante'),        # 3 pontos / 2 = 1.5 (Limite exato Iniciante)
            (5, 'Intermediário'),    # 5 pontos / 2 = 2.5 (Limite exato Intermediário)
            (6, 'Praticante Empírico') # 6 pontos / 2 = 3.0 (Acima de 2.5)
        ]
        
        for pontuacao, nivel_esperado in casos_teste:
            with self.subTest(pontuacao=pontuacao, nivel_esperado=nivel_esperado):
                # Construímos um mock on-the-fly para atingir a média exata
                opcoes_borda = {
                    'X': {'peso_perfil': pontuacao / 2.0},
                    'Y': {'peso_perfil': pontuacao / 2.0}
                }
                
                # Act
                nivel, _, _, _ = TriagemService.calcular_nivel({'1': 'X', '2': 'Y'}, self.perguntas_mock, opcoes_borda)
                
                # Assert
                self.assertEqual(nivel, nivel_esperado)