import uuid
from django.db import models
from django.conf import settings
from learning.models import Aula

class Exercicio(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE, related_name='exercicios')
    tipo = models.CharField(max_length=50)
    enunciado = models.TextField()
    gabarito_dados = models.JSONField()
    tag_topico = models.CharField(max_length=100)
    ativo = models.BooleanField(default=True)

    class Meta:
        db_table = "TB_EXERCICIO"

class TentativaExercicio(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tentativas')
    exercicio = models.ForeignKey(Exercicio, on_delete=models.CASCADE, related_name='tentativas_recebidas')
    acertou = models.BooleanField()
    tempo_resposta_ms = models.IntegerField()
    realizada_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "TB_TENTATIVA_EXERCICIO"