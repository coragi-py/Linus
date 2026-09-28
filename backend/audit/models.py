import uuid
from django.db import models
from django.core.exceptions import PermissionDenied
from django.conf import settings

class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    action = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    payload = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'TB_AUDITORIA'
        ordering = ['-timestamp']

    def save(self, *args, **kwargs):
        # Proteção contra UPDATE: verifica se o objeto já existe no banco
        if not self._state.adding:
            raise PermissionDenied("Registros de auditoria são imutáveis e não podem ser alterados.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Proteção contra DELETE
        raise PermissionDenied("Registros de auditoria são imutáveis e não podem ser excluídos.")

    def __str__(self):
        return f"{self.timestamp} - {self.action} - User ID: {self.user_id}"