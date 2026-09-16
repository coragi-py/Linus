# Esse arquivo gera hash dos dados quando forem salvos, bloqueando tentativas de atualização ou exclusão após isso. Por Anny, em 16/09.

import hashlib
from django.core.exceptions import ValidationError
from django.db import models
from accounts.models import Usuario
class LogAuditoria(models.Model):
    # O DER aponta bigint para auditoria (melhor para performance em tabelas de log massivas)
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    acao = models.CharField(max_length=255)
    ip_origem = models.GenericIPAddressField(null=True, blank=True) # esses parametros permitem que o log seja salvo como nulo caso não tenha sido encontrado
    detalhes = models.JSONField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "TB_LOG_AUDITORIA"

# Essa função bloqueia qualquer tentativa de UPDATE e DELETE
    def save(self, *args, **kwargs):
        if self.pk:
            raise ValidationError("Logs de auditoria são imutáveis e não podem ser alterados.")
        
        # Gera o hash SHA-256 nos dados críticos da linha antes de salvar
        raw_data = f"{self.usuario_id}{self.acao}{self.ip_origem}{self.detalhes}".encode('utf-8')
        self.checksum = hashlib.sha256(raw_data).hexdigest()
        
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError("Logs de auditoria não podem ser excluídos.")