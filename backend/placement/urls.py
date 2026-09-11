# Esse arquivo contém as rotas da API relacionadas à triagem de usuários, permitindo que os clientes obtenham as perguntas da triagem e enviem suas respostas para avaliação.
# Adicionado o endpoint para a viewset PerguntaTriagemViewSet, que permite operações CRUD nas perguntas da triagem.

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import TriagemAPIView, PerguntaTriagemAdminViewSet

router = DefaultRouter()
router.register(r'admin/questoes', PerguntaTriagemAdminViewSet, basename='admin-questoes')

urlpatterns = [
    path('questions/', TriagemAPIView.as_view(), name='triagem-questions'),
    path('submit/', TriagemAPIView.as_view(), name='triagem-submit'),
    path('', include(router.urls)),
]