#Api para determinar como a aplicação vai lidar com as aplicações, por antonio 12/09
from rest_framework import viewsets
from rest_framework.permissions import AllowAny  # Altere para AllowAny temporariamente ou globalmente
from .models import Musica
from .serializers import MusicaSerializer

class MusicaViewSet(viewsets.ModelViewSet):
    queryset = Musica.objects.all().order_by('-data_criacao')
    serializer_class = MusicaSerializer
    permission_classes = [AllowAny]  # Permite que qualquer usuário salve na prática livre

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(id_usuario=self.request.user)
        else:
            serializer.save(id_usuario=None) # Salva sem usuário associado se não estiver logado RETIRAR PARA PRODUÇÃO