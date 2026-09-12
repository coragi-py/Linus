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
        if not respostas:
            return Response({"erro": "Nenhuma resposta fornecida"}, status=status.HTTP_400_BAD_REQUEST)

        pontuacao_total = 0
        acertos = 0
        total_respondido = len(respostas)
        perguntas_ativas = PerguntaTriagem.objects.filter(ativo=True)
        total_questoes = perguntas_ativas.count()
        pontos_maximos = 0

        for pergunta in perguntas_ativas:
            peso_maximo_pergunta = max(pergunta.opcoes.values_list('peso_perfil', flat=True), default=1)
            pontos_maximos += peso_maximo_pergunta
            
            resposta_id = respostas.get(str(pergunta.id))
            if resposta_id:
                try:
                    opcao = OpcaoTriagem.objects.get(id=resposta_id)
                    pontuacao_total += opcao.peso_perfil
                    if opcao.peso_perfil == peso_maximo_pergunta:
                        acertos += 1
                except OpcaoTriagem.DoesNotExist:
                    continue

        media = pontuacao_total / total_respondido if total_respondido > 0 else 1
        
        if media <= 1.5:
            nivel = 'Iniciante'
            modulo = {"titulo": "Unidade 1: Leitura de Partituras", "descricao": "Pauta, clave de Sol, notas e figuras de duração."}
        elif media <= 2.5:
            nivel = 'Intermediário'
            modulo = {"titulo": "Unidade 2: Intervalos e Escalas", "descricao": "Estrutura de tons, semitons e formação de escalas maiores."}
        else:
            nivel = 'Praticante Empírico'
            modulo = {"titulo": "Unidade 3: Harmonia Funcional", "descricao": "Acordes, campo harmônico e aplicação prática no piano."}

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
                'total_questoes': total_questoes,
                'pontos': pontuacao_total,
                'pontos_maximos': pontos_maximos
            },
            'modulo_recomendado': modulo
        }, status=status.HTTP_201_CREATED)