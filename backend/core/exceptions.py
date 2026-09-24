from rest_framework.views import exception_handler
from rest_framework.exceptions import Throttled

def custom_exception_handler(exc, context):
    # Executa o manipulador padrão do DRF primeiro para obter a resposta base
    response = exception_handler(exc, context)

    # Verifica se a exceção é de limite de taxa (Throttle - 429)
    if isinstance(exc, Throttled) and response is not None:
        # exc.wait contém o tempo de espera restante em segundos
        tempo = exc.wait
        
        # Sobrescreve a mensagem padrão com o seu texto customizado
        response.data['detail'] = f"Limite de tentativas excedido. Por favor, aguarde {tempo} segundos."
        
        # response.data = {"erro": "Muitas requisições", "tempo_restante": tempo}

    return response