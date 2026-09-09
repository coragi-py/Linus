#Adicionado help_text (que servirá como documentação viva) sobre as finalidades das informações utilizadas dos usuários, seguindo LGPD, por Anny em 09/09.
import uuid
from django.db import models

class Usuario(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome_completo = models.CharField(
        max_length=255,
        help_text="Finalidade: Identificação do usuário e personalização da interface."
    )
    email = models.EmailField(
        unique=True,
        help_text="Finalidade: Utilizado como credencial de login e para envio de comunicações essenciais do sistema."
    )
    senha_hash = models.CharField(
        max_length=255,
        help_text="Finalidade: Autenticação e proteção das credenciais de acesso."
    )
    ano_nascimento = models.SmallIntegerField(
        help_text="Finalidade (LGPD): Mapeamento demográfico da faixa etária do público-alvo, sem retenção de dados pessoais sensíveis."
    )
    google_oid = models.CharField(
        max_length=255,
        unique=True, 
        null=True, 
        blank=True,
        help_text="Finalidade: Identificador único para viabilizar o login rápido e seguro via autenticação federada (Google OAuth 2.0)."
    )
    perfil = models.CharField(
        max_length=50,
        help_text="Finalidade: Definição de permissões e controle de acesso (ex: Aluno ou Administrador)."
    )
    ativo = models.BooleanField(
        default=True,
        help_text="Finalidade: Controle de status da conta para retenção e controle."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Finalidade: Registro de auditoria técnica informando quando os dados foram coletados."
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Finalidade: Registro de auditoria técnica para rastrear a última modificação dos dados."
    )

    class Meta:
        db_table = "TB_USUARIO"