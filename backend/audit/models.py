#Adicionado help_text (que servirá como documentação viva) sobre as finalidades das informações utilizadas em auditoria, seguindo LGPD, por Anny em 09/09.
from django.db import models
from accounts.models import Usuario

class LogAuditoria(models.Model):
    # O DER aponta bigint para auditoria (melhor para performance em tabelas de log massivas)
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(
        Usuario, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        help_text="Finalidade: Identificação do titular associado à ação (mantido nulo se a conta for excluída para anonimização)."
    )
    acao = models.CharField(
        max_length=255,
        help_text="Finalidade: Descrição da ação crítica realizada no sistema."
    )
    ip_origem = models.GenericIPAddressField(
        help_text="Finalidade: Requisito de segurança e auditoria técnica (rastreabilidade)."
    )
    detalhes = models.JSONField(
        null=True, 
        blank=True,
        help_text="Finalidade: Payload ou metadados da requisição para rastreabilidade de falhas."
    )
    criado_em = models.DateTimeField(
        auto_now_add=True,
        help_text="Finalidade: Carimbo de data/hora (UTC) do evento (Log)."
    )

    class Meta:
        db_table = "TB_LOG_AUDITORIA"