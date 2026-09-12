#Api para determinar como a aplicação vai lidar com as aplicações, por antonio 12/09
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Musica
from .serializers import MusicaSerializer

class MusicaViewSet(viewsets.ModelViewSet):
    queryset = Musica.objects.all().order_by('-data_criacao')
    serializer_class = MusicaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Se o usuário estiver logado, associa automaticamente à gravação
        if self.request.user.is_authenticated:
            serializer.save(id_usuario=self.request.user)
        else:
            serializer.save()