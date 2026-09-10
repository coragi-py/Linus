# Esse arquivo define as views para os modelos Modulo e Aula, definindo como eles serão expostos via API REST. Por Fabio 10/09
from rest_framework import viewsets
from .models import Modulo, Aula
from .serializers import ModuloSerializer, AulaSerializer

class ModuloViewSet(viewsets.ModelViewSet):
    queryset = Modulo.objects.all().order_by('ordem')
    serializer_class = ModuloSerializer
    permission_classes = []  # Ajustar conforme RBAC/autenticação definida

class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all().order_by('ordem')
    serializer_class = AulaSerializer
    permission_classes = []