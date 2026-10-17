from datetime import timedelta
from django.utils import timezone
from accounts.services.email_service import EmailService
from audit.services.audit_service import AuditService
from gamification.models import GamificacaoPerfil


class StreakNotificationService:
    """
    Serviço responsável por identificar estudantes com ofensiva (streak) ativa
    que ainda não realizaram nenhuma aula no dia atual e disparar lembretes via Brevo.
    """

    @staticmethod
    def notificar_usuarios_em_risco(request=None) -> dict:
        hoje = timezone.localdate()
        ontem = hoje - timedelta(days=1)

        perfis_em_risco = GamificacaoPerfil.objects.select_related("usuario").filter(
            streak_atual__gte=1,
            ultimo_acesso_estudo=ontem,
            usuario__is_active=True,
            usuario__terms_accepted=True,
            usuario__anonymized_at__isnull=True,
        ).exclude(usuario__email__endswith="@anon.com")

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
                    {"streak_atual": perfil.streak_atual, "ultimo_acesso": str(ontem)},
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
            "elegiveis": enviado_total := (enviados + falhas),
            "enviados": enviados,
            "falhas": falhas,
        }