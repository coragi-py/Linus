# Esse arquivo contém a lógica de negócio para a triagem de usuários, incluindo a obtenção das perguntas, processamento das respostas e atribuição de nível com base nas respostas fornecidas.

import uuid
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import PerguntaTriagem, OpcaoTriagem, SessaoTriagem
from .serializers import PerguntaTriagemSerializer

class TriagemAPIView(APIView):
    permission_classes = [] # Rota pública, não exige token JWT

    def get(self, request):
        perguntas = PerguntaTriagem.objects.filter(ativo=True)
        serializer = PerguntaTriagemSerializer(perguntas, many=True)
        return Response(serializer.data)

    def post(self, request):
        respostas = request.data.get('respostas', {})
        if not respostas:
            return Response({"erro": "Nenhuma resposta fornecida"}, status=status.HTTP_400_BAD_REQUEST)

        pontuacao_total = 0
        total_respondido = len(respostas)

        # Processa os pesos das opções selecionadas
        for pergunta_id, opcao_id in respostas.items():
            try:
                opcao = OpcaoTriagem.objects.get(id=opcao_id)
                pontuacao_total += opcao.peso_perfil
            except OpcaoTriagem.DoesNotExist:
                continue

        # Algoritmo de nivelamento básico
        media = pontuacao_total / total_respondido if total_respondido > 0 else 1
        
        if media <= 1.5:
            nivel = 'Iniciante'
        elif media <= 2.5:
            nivel = 'Intermediário'
        else:
            nivel = 'Praticante Empírico'

        # Persiste a sessão para ser vinculada no momento do cadastro
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
            'sessionKey': session_key
        }, status=status.HTTP_201_CREATED)