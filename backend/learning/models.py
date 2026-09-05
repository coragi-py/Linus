import uuid
from django.db import models

class Modulo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ordem = models.IntegerField()
    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    categoria = models.CharField(max_length=100)
    ativo = models.BooleanField(default=True)

    class Meta:
        db_table = "TB_MODULO"

class Aula(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    modulo = models.ForeignKey(Modulo, on_delete=models.CASCADE, related_name='aulas')
    ordem = models.IntegerField()
    titulo = models.CharField(max_length=255)
    conteudo_teorico = models.TextField()
    partitura_dados = models.JSONField(null=True, blank=True)
    ativa = models.BooleanField(default=True)

    class Meta:
        db_table = "TB_AULA"