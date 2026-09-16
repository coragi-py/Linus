# Esse arquivo define que o painel de admin pode somente ver os logs e não edita-los. Por Anny, em 16/09.

from django.contrib import admin
from .models import LogAuditoria

@admin.register(LogAuditoria)
class LogAuditoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'acao', 'ip_origem', 'criado_em')
    list_filter = ('acao', 'criado_em')
    search_fields = ('usuario__email', 'ip_origem', 'detalhes')
    readonly_fields = ('id', 'usuario', 'acao', 'ip_origem', 'detalhes', 'criado_em')
    
    # Ordenando por logs mais recentes
    ordering = ('-criado_em',) 
    
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False