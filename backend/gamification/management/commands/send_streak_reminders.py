from django.core.management.base import BaseCommand
from gamification.services.notification_service import StreakNotificationService


class Command(BaseCommand):
    help = "Envia e-mails de lembrete às 20h via Brevo para alunos que ainda não estudaram hoje e têm streak ativo."

    def add_arguments(self, parser):
        parser.add_argument(
            "--scheduled",
            action="store_true",
            help="Valida se o horário atual está na janela das 20h00 (America/Sao_Paulo) antes de disparar.",
        )

    def handle(self, *args, **options):
        validar_horario = options.get("scheduled", False)
        resultado = StreakNotificationService.notificar_usuarios_em_risco(
            validar_horario=validar_horario
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"Processamento ({resultado['data_verificacao']} - {resultado.get('status', 'ok')}): "
                f"{resultado['enviados']} enviado(s), {resultado['falhas']} falha(s)."
            )
        )