import uuid
from django.db import models

class Usuario(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome_completo = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    senha_hash = models.CharField(max_length=255)
    ano_nascimento = models.SmallIntegerField()
    google_oid = models.CharField(max_length=255, unique=True, null=True, blank=True)
    perfil = models.CharField(max_length=50)
    ativo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "TB_USUARIO"