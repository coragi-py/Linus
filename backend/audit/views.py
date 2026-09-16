# Esse arquivo implementa APIView processando logs brutos e entrega analises visuais. Por Anny, em 16/09.

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils.timezone import now
from datetime import timedelta
from django.db.models import Count
from .models import LogAuditoria

class AnaliseAuditoriaAPIView(APIView):
    """
    Endpoint (exclusivo para Administradores) que retorna uma análise consolidada
    dos logs de segurança para exibição no Dashboard.
    """
    
    # Bloqueia o acesso para qualquer usuário que não seja admin (is_staff=True)
    permission_classes = [IsAdminUser]

    def get(self, request):
        hoje = now()
        ultimas_24h = hoje - timedelta(days=1)
        
        # Logs das ultimas 24hrs
        total_logins_sucesso = LogAuditoria.objects.filter(
            acao='LOGIN_SUCESSO', 
            criado_em__gte=ultimas_24h
        ).count()
        
        total_logins_falha = LogAuditoria.objects.filter(
            acao='LOGIN_FALHA', 
            criado_em__gte=ultimas_24h
        ).count()
        
        total_cadastros = LogAuditoria.objects.filter(
            acao='CADASTRO_NOVO_USUARIO', 
            criado_em__gte=ultimas_24h
        ).count()

        # Identificando IPs suspeitos (Possível Força Bruta)
        # Agrupa os logs de falha por IP e conta quantas vezes cada um falhou nas últimas 24h.
        # Filtra apenas aqueles com mais de 5 tentativas de falha.
        ips_suspeitos = LogAuditoria.objects.filter(
            acao='LOGIN_FALHA',
            criado_em__gte=ultimas_24h
        ).values('ip_origem').annotate(
            tentativas_falhas=Count('id')
        ).filter(tentativas_falhas__gt=5).order_by('-tentativas_falhas')
        
        # Formatação da Resposta (Payload JSON para o React consumir)
        data = {
            "periodo_analise": "Últimas 24 horas",
            "metricas_gerais": {
                "novos_cadastros": total_cadastros,
                "logins_com_sucesso": total_logins_sucesso,
                "logins_com_falha": total_logins_falha,
            },
            "seguranca": {
                "alerta_ips_suspeitos": list(ips_suspeitos),
                # Avaliar a expansão aqui no futuro (ex: falhas de 2FA)
            }
        }
        
        return Response(data)
