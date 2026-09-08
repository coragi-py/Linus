# Esse arquivo cria a rota de apenas de visualização de todos os termos do glossario, por Anny em 07/09
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GlossarioViewSet

router = DefaultRouter()
router.register(r'', GlossarioViewSet, basename='glossario')

urlpatterns = [
    path('', include(router.urls)),
]