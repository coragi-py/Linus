# Esse arquivo carrega os sinais do signals para que o django leia os arquivos. Por Anny, em 17/09.
from django.apps import AppConfig


class AuditConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "audit"

    def ready(self):
        # Importa os sinais aqui
        import audit.signals