import uuid
from django.db import models
from accounts.models import Usuario

class SessaoTriagem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session_key = models.CharField(max_length=255, unique=True)
    respostas = models.JSONField()
    nivel_atribuido = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "TB_SESSAO_TRIAGEM"

class TriagemInicial(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='triagens')
    sessao_triagem = models.ForeignKey(SessaoTriagem, on_delete=models.SET_NULL, null=True, blank=True)
    respostas = models.JSONField()
    nivel_atribuido = models.CharField(max_length=50)
    realizada_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "TB_TRIAGEM_INICIAL"