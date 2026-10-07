# Esse arquivo contém a lógica de negócio para a triagem de usuários, incluindo a obtenção das perguntas, processamento das respostas e atribuição de nível com base nas respostas fornecidas.
# Adicionado PerguntaTriagemViewSet para permitir operações CRUD nas perguntas da triagem, facilitando a administração do conteúdo da triagem.

import uuid
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import PerguntaTriagem, OpcaoTriagem, SessaoTriagem
from .serializers import PerguntaTriagemSerializer

# ViewSet para o CRUD de Perguntas da Triagem
class PerguntaTriagemViewSet(viewsets.ModelViewSet):
    queryset = PerguntaTriagem.objects.all().order_by('ordem')
    serializer_class = PerguntaTriagemSerializer
    permission_classes = []
    pagination_class = None

class TriagemAPIView(APIView):
    permission_classes = [] 

    def get(self, request):
        perguntas = PerguntaTriagem.objects.filter(ativo=True).order_by('ordem')
        serializer = PerguntaTriagemSerializer(perguntas, many=True)
        return Response(serializer.data)

    def post(self, request):
        respostas = request.data.get('respostas', {})
        perguntas_ativas = PerguntaTriagem.objects.filter(ativo=True)

        # 1. PREPARAÇÃO (Transformar dados do ORM em dicionários puros para o Service)
        perguntas_lista = []
        opcoes_dict = {}
        
        for pergunta in perguntas_ativas:
            peso_maximo = max(pergunta.opcoes.values_list('peso_perfil', flat=True), default=1)
            perguntas_lista.append({
                'id': str(pergunta.id), 
                'peso_maximo': peso_maximo
            })
            
            resposta_id = respostas.get(str(pergunta.id))
            if resposta_id:
                try:
                    opcao = OpcaoTriagem.objects.get(id=resposta_id)
                    opcoes_dict[str(resposta_id)] = {'peso_perfil': opcao.peso_perfil}
                except OpcaoTriagem.DoesNotExist:
                    pass

        # 2. EXECUÇÃO DA REGRA DE NEGÓCIO ISOLADA
        try:
            nivel, acertos, pontuacao_total, pontos_maximos = TriagemService.calcular_nivel(
                respostas, perguntas_lista, opcoes_dict
            )
        except (RespostasVaziasException, PerguntasNaoEncontradasException) as e:
            return Response({"erro": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # 3. DEFINIÇÃO DO MÓDULO (Pós-processamento visual)
        if nivel == 'Iniciante':
            modulo = {"titulo": "Unidade 1: Leitura de Partituras", "descricao": "Pauta, clave de Sol, notas e figuras de duração."}
        elif nivel == 'Intermediário':
            modulo = {"titulo": "Unidade 2: Intervalos e Escalas", "descricao": "Estrutura de tons, semitons e formação de escalas maiores."}
        else:
            modulo = {"titulo": "Unidade 3: Harmonia Funcional", "descricao": "Acordes, campo harmônico e aplicação prática no piano."}

        # 4. PERSISTÊNCIA E RETORNO HTTP
        session_key = f"sess_{uuid.uuid4().hex[:12]}"
        SessaoTriagem.objects.create(
            session_key=session_key,
            respostas=respostas,
            nivel_atribuido=nivel,
            status='concluida',
            expires_at=timezone.now() + timedelta(hours=2)
        )

        return Response({
            'nivel': nivel,
            'sessionKey': session_key,
            'estatisticas': {
                'acertos': acertos,
                'total_questoes': perguntas_ativas.count(),
                'pontos': pontuacao_total,
                'pontos_maximos': pontos_maximos
            },
            'modulo_recomendado': modulo
        }, status=status.HTTP_201_CREATED)