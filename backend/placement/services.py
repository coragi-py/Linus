class RespostasVaziasException(Exception):
    pass

class PerguntasNaoEncontradasException(Exception):
    pass

class TriagemService:
    @staticmethod
    def calcular_nivel(respostas: dict, perguntas_ativas_mock, opcoes_mockadas: dict) -> tuple:
        if not respostas:
            raise RespostasVaziasException("Nenhuma resposta fornecida para o cálculo da triagem.")
            
        if not perguntas_ativas_mock:
            raise PerguntasNaoEncontradasException("Não há perguntas ativas disponíveis para avaliação.")

        pontuacao_total = 0
        acertos = 0
        total_respondido = len(respostas)
        pontos_maximos = 0

        for pergunta in perguntas_ativas_mock:
            peso_maximo_pergunta = pergunta.get('peso_maximo', 1)
            pontos_maximos += peso_maximo_pergunta
            
            resposta_id = respostas.get(str(pergunta['id']))
            if resposta_id and resposta_id in opcoes_mockadas:
                opcao = opcoes_mockadas[resposta_id]
                pontuacao_total += opcao['peso_perfil']
                if opcao['peso_perfil'] == peso_maximo_pergunta:
                    acertos += 1

        media = pontuacao_total / total_respondido if total_respondido > 0 else 1
        
        if media <= 1.5:
            nivel = 'Iniciante'
        elif media <= 2.5:
            nivel = 'Intermediário'
        else:
            nivel = 'Praticante Empírico'

        return nivel, acertos, pontuacao_total, pontos_maximos