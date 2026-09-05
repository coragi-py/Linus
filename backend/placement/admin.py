from django.contrib import admin
from .models import PerguntaTriagem, OpcaoTriagem, SessaoTriagem

class OpcaoTriagemInline(admin.TabularInline):
    model = OpcaoTriagem
    extra = 3

@admin.register(PerguntaTriagem)
class PerguntaTriagemAdmin(admin.ModelAdmin):
    list_display = ('enunciado', 'tipo', 'ordem', 'ativo')
    inlines = [OpcaoTriagemInline]

@admin.register(SessaoTriagem)
class SessaoTriagemAdmin(admin.ModelAdmin):
    list_display = ('session_key', 'nivel_atribuido', 'status', 'created_at')