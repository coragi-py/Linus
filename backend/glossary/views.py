# Esse arquivo cria métodos http GET, POST, PUT E DELETE de forma automatica (frontend só irá listar na página de alunos), por Anny em 07/09 
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Glossario
from .serializers import GlossarioSerializer

class GlossarioViewSet(viewsets.ModelViewSet):

    queryset = Glossario.objects.all().order_by('termo')
    serializer_class = GlossarioSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None  # Retorna array direto para evitar falhas no frontend
