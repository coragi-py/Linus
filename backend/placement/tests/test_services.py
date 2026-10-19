import unittest
from unittest.mock import patch, MagicMock
from placement.services import TriagemService, RespostasVaziasException, PerguntasNaoEncontradasException

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