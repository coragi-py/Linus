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
    enunciado = models.CharField(max_length=255) # O enunciado da pergunta que será exibido para o usuário durante a triagem.
    tipo = models.CharField(max_length=50, choices=[('texto', 'Texto'), ('partitura', 'Partitura')], default='texto') # O tipo de pergunta, que pode ser "texto" ou "partitura". Dependendo do tipo, a pergunta será renderizada de maneira diferente na interface do usuário.
    dados_partitura = models.JSONField(null=True, blank=True) # Um campo JSON opcional que armazena os dados da partitura musical, caso a pergunta seja do tipo "partitura". Esses dados podem incluir informações sobre notas musicais, compassos, etc., que serão usados para renderizar a partitura na interface do usuário. Caso seja tipo "texto", esse campo pode ser nulo ou vazio.
    ordem = models.IntegerField(default=0) # A ordem em que a pergunta será exibida durante a triagem. Perguntas com valores de ordem mais baixos serão exibidas antes das perguntas com valores de ordem mais altos.
    ativo = models.BooleanField(default=True) # Um campo booleano que indica se a pergunta está ativa e deve ser exibida durante a triagem. Perguntas inativas não serão apresentadas aos usuários.

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