from datetime import timedelta
from django.utils import timezone
from zoneinfo import ZoneInfo
from accounts.services.email_service import EmailService
from audit.models import AuditLog
from audit.services.audit_service import AuditService
from gamification.models import GamificacaoPerfil

BRT_TZ = ZoneInfo("America/Sao_Paulo")

class StreakNotificationService:
    """
    Serviço responsável por identificar estudantes com ofensiva (streak) ativa
    que ainda não realizaram nenhuma atividade no dia atual e disparar lembretes
    às 20h00 (horário de Brasília) via Brevo.
    """

    HORA_DISPARO_PADRAO = 20  # 20h00 (America/Sao_Paulo)

    @classmethod
    def notificar_usuarios_em_risco(
        cls,
        request=None,
        validar_horario: bool = False,
        hora_alvo: int = HORA_DISPARO_PADRAO,
    ) -> dict:
        agora_local = timezone.localtime()
        hoje = agora_local.date()
        ontem = hoje - timedelta(days=1)

        # Quando acionado pelo agendador automático, só dispara na janela das 20h
        if validar_horario and agora_local.hour != hora_alvo:
            return {
                "data_verificacao": str(hoje),
                "hora_verificacao": agora_local.strftime("%H:%M"),
                "status": f"aguardando_janela_{hora_alvo:02d}h",
                "elegiveis": 0,
                "enviados": 0,
                "falhas": 0,
            }

        # Idempotência: busca alunos que já receberam o lembrete na data de hoje
        usuarios_ja_notificados_hoje = AuditLog.objects.filter(
            action="STREAK_REMINDER_EMAIL_SENT",
            timestamp__date=hoje,
        ).values_list("user_id", flat=True)

        # Regra:
        # - streak_atual >= 1 (tem ofensiva ativa)
        # - ultimo_acesso_estudo == ontem (não fez atividade hoje; se fez, a data já é 'hoje')
        # - conta ativa, com aceite LGPD e não anonimizada
        perfis_em_risco = (
            GamificacaoPerfil.objects.select_related("usuario")
            .filter(
                streak_atual__gte=1,
                ultimo_acesso_estudo=ontem,
                usuario__is_active=True,
                usuario__terms_accepted=True,
                usuario__anonymized_at__isnull=True,
            )
            .exclude(usuario__email__endswith="@anon.com")
            .exclude(usuario__email__endswith="@deleted.local")
            .exclude(usuario_id__in=usuarios_ja_notificados_hoje)
        )

        enviados = 0
        falhas = 0

        for perfil in perfis_em_risco:
            usuario = perfil.usuario
            try:
                EmailService.send_streak_reminder_email(
                    email=usuario.email,
                    nome=usuario.nome,
                    streak_atual=perfil.streak_atual,
                )
                AuditService.log_event(
                    request,
                    usuario,
                    "STREAK_REMINDER_EMAIL_SENT",
                    {
                        "streak_atual": perfil.streak_atual,
                        "ultimo_acesso": str(ontem),
                        "disparado_as": agora_local.strftime("%H:%M"),
                    },
                )
                enviados += 1
            except Exception as exc:
                AuditService.log_event(
                    request,
                    usuario,
                    "STREAK_REMINDER_EMAIL_FAILED",
                    {"streak_atual": perfil.streak_atual, "error": str(exc)},
                )
                falhas += 1

        return {
            "data_verificacao": str(hoje),
            "hora_verificacao": agora_local.strftime("%H:%M"),
            "status": "processado",
            "elegiveis": enviados + falhas,
            "enviados": enviados,
            "falhas": falhas,
        }