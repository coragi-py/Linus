import uuid
from django.db import models
from django.contrib.auth.models import User

class Musica(models.Model):
    id_musica = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False, 
        db_column='id_musica'
    )
    nome_musica = models.CharField(max_length=150)
    notas = models.JSONField(default=list)  # Array de notas (até 128)
    id_usuario = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        db_column='id_usuario'
    )
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'TB_MUSICA'  # Forçando o nome da tabela.

    def __str__(self):
        return self.nome_musica