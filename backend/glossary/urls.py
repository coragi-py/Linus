# Esse arquivo define os endpoints da API REST para os modelos Modulo e Aula, utilizando o Django REST Framework. Por Fabio 10/09
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ModuloViewSet, AulaViewSet

router = DefaultRouter()
router.register(r'modulos', ModuloViewSet, basename='modulo')
router.register(r'aulas', AulaViewSet, basename='aula')

urlpatterns = [
    path('', include(router.urls)),
]