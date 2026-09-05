# Esse arquivo contém as rotas da API relacionadas à triagem de usuários, permitindo que os clientes obtenham as perguntas da triagem e enviem suas respostas para avaliação.

from django.urls import path
from .views import TriagemAPIView

urlpatterns = [
    path('questions/', TriagemAPIView.as_view(), name='triagem-questions'),
    path('submit/', TriagemAPIView.as_view(), name='triagem-submit'),
]