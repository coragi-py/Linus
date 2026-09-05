import uuid
from django.db import models
from accounts.models import Usuario
from learning.models import Aula

class ProgressoAula(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='progressos')
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE, related_name='acompanhamentos')
    concluida = models.BooleanField(default=False)
    taxa_acerto = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "TB_PROGRESSO_AULA"