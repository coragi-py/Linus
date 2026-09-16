# Esse arquivo cria as rotas para auditoria, permitindo o consumo da análise de logs pelo painel de dashboard. Por Anny, em 16/09.

from django.urls import path
from .views import AnaliseAuditoriaAPIView

urlpatterns = [
    # A rota final será /api/v1/audit/analise/
    path('analise/', AnaliseAuditoriaAPIView.as_view(), name='audit-analise'),
]