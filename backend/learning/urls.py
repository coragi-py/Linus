from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ModuloViewSet,
    AulaViewSet,
    ExercicioViewSet,
    RegistrarTentativaView,
    MeuProgressoView,
)

router = DefaultRouter()
router.register(r'modulos', ModuloViewSet, basename='modulo')
router.register(r'aulas', AulaViewSet, basename='aula')
router.register(r'exercicios', ExercicioViewSet, basename='exercicio')

urlpatterns = [
    path('tentativas/', RegistrarTentativaView.as_view(), name='learning-tentativas'),
    path('progresso/', MeuProgressoView.as_view(), name='learning-progresso'),
    path('', include(router.urls)),
]