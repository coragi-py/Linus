# Esse arquivo cria métodos http GET, POST, PUT E DELETE de forma automatica (frontend só irá listar na página de alunos), por Anny em 07/09 
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Glossario
from .serializers import GlossarioSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(tags=['Glossario'])
class GlossarioViewSet(viewsets.ReadOnlyModelViewSet):
    #"""
    #Lista todos os termos do glossário musical.
    #(Usamos ReadOnlyModelViewSet pois a edição será feita via Admin).
    #"""
    queryset = Glossario.objects.all().order_by('termo')
    serializer_class = GlossarioSerializer
    permission_classes = [AllowAny] # a leitura do glossario está publica temporariamente e deverá ser alterada quando as regras de autenticação forem implementadas (permission_classes = [IsAuthenticated])

