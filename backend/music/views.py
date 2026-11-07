# API para gerenciamento de músicas do Playground (amostras públicas + gravações privadas do aluno)
from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from audit.services.audit_service import AuditService
from .models import Musica
from .serializers import MusicaSerializer


class MusicaViewSet(viewsets.ModelViewSet):
    serializer_class = MusicaSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        # Retorna as amostras públicas (id_usuario=None) + as músicas privadas do usuário autenticado
        if user and user.is_authenticated:
            return Musica.objects.filter(
                Q(id_usuario__isnull=True) | Q(id_usuario=user)
            ).order_by('-data_criacao')
        # Visitantes não autenticados visualizam apenas as amostras públicas
        return Musica.objects.filter(id_usuario__isnull=True).order_by('-data_criacao')

    def perform_create(self, serializer):
        if self.request.user and self.request.user.is_authenticated:
            instancia = serializer.save(id_usuario=self.request.user)
            AuditService.log_event(
                self.request,
                self.request.user,
                "MUSIC_RECORDING_CREATED",
                {"id_musica": str(instancia.id_musica), "nome_musica": instancia.nome_musica},
            )
        else:
            serializer.save(id_usuario=None)

    def perform_destroy(self, instance):
        user = self.request.user
        # Impede que alunos comuns excluam as amostras públicas da plataforma
        if instance.id_usuario is None:
            if not (user and user.is_authenticated and (user.is_staff or user.is_superuser)):
                raise PermissionDenied("As músicas de amostra pública não podem ser excluídas.")
        # Garante que apenas o dono da gravação possa excluí-la
        elif not user or not user.is_authenticated or instance.id_usuario != user:
            raise PermissionDenied("Você só pode excluir suas próprias gravações.")

        musica_id = str(instance.id_musica)
        nome = instance.nome_musica
        instance.delete()

        if user and user.is_authenticated:
            AuditService.log_event(
                self.request,
                user,
                "MUSIC_RECORDING_DELETED",
                {"id_musica": musica_id, "nome_musica": nome},
            )