import uuid
from django.db import models
from accounts.models import Usuario

class GamificacaoPerfil(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='gamificacao')
    streak_atual = models.IntegerField(default=0)
    melhor_streak = models.IntegerField(default=0)
    ultimo_acesso_estudo = models.DateField(null=True, blank=True)
    pontuacao_total = models.IntegerField(default=0)

    class Meta:
        db_table = "TB_GAMIFICACAO_PERFIL"

class Badge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    codigo = models.CharField(max_length=100, unique=True)
    nome = models.CharField(max_length=150)
    descricao = models.TextField()
    icone_url = models.CharField(max_length=255)

    class Meta:
        db_table = "TB_BADGE"

class UsuarioBadge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='badges_conquistadas')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    data_conquista = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "TB_USUARIO_BADGE"