from django.db import models
from accounts.models import Usuario

class LogAuditoria(models.Model):
    # O DER aponta bigint para auditoria (melhor para performance em tabelas de log massivas)
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    acao = models.CharField(max_length=255)
    ip_origem = models.GenericIPAddressField()
    detalhes = models.JSONField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "TB_LOG_AUDITORIA"