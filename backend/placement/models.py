# Esse arquivo contém os modelos de dados relacionados à triagem de usuários, incluindo sessões de triagem, perguntas e opções de resposta. Ele define a estrutura do banco de dados para armazenar informações sobre as sessões de triagem, as respostas dos usuários e os níveis atribuídos com base nas respostas fornecidas.

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

class PerguntaTriagem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enunciado = models.CharField(max_length=255)
    tipo = models.CharField(max_length=50, choices=[('texto', 'Texto'), ('partitura', 'Partitura')], default='texto')
    dados_partitura = models.JSONField(null=True, blank=True)
    ordem = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)

    class Meta:
        db_table = "TB_PERGUNTA_TRIAGEM"
        ordering = ['ordem']

    def __str__(self):
        return f"{self.ordem} - {self.enunciado}"

class OpcaoTriagem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pergunta = models.ForeignKey(PerguntaTriagem, on_delete=models.CASCADE, related_name='opcoes')
    texto = models.CharField(max_length=255)
    # 1: Iniciante, 2: Intermediário, 3: Praticante Empírico
    peso_perfil = models.IntegerField(default=1) 

    class Meta:
        db_table = "TB_OPCAO_TRIAGEM"

    def __str__(self):
        return self.texto