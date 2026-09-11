# Esse arquivo cria a rota de apenas de visualização de todos os termos do glossario, por Anny em 07/09
# Alterado a rota para permitir operações CRUD no glossário, facilitando a administração do conteúdo do glossário. Por Fabio 10/09

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GlossarioViewSet

router = DefaultRouter()
# Permite chamdas pelo admin em /api/v1/glossary/termos
router.register(r'termos', GlossarioViewSet, basename='glossario-termos')
# Permite chamadas pela telapública em /api/v1/glossary
router.register(r'', GlossarioViewSet, basename='glossario')

urlpatterns = [
    path('', include(router.urls)),
]