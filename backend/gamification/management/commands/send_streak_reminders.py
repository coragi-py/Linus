from django.core.management.base import BaseCommand
from gamification.services.notification_service import StreakNotificationService


class Command(BaseCommand):
    help = "Envia e-mails de lembrete via Brevo para alunos que ainda não estudaram hoje e têm streak ativo."

    def handle(self, *args, **options):
        resultado = StreakNotificationService.notificar_usuarios_em_risco()
        self.stdout.write(
            self.style.SUCCESS(
                f"Processamento concluído ({resultado['data_verificacao']}): "
                f"{resultado['enviados']} enviado(s), {resultado['falhas']} falha(s)."
            )
        )