#Adicionado as Urls para mapear os endpoints, por Antonio 12/09
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MusicaViewSet

router = DefaultRouter()
router.register(r'musicas', MusicaViewSet, basename='musica')

urlpatterns = [
    path('', include(router.urls)),
]