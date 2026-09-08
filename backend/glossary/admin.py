# Adicionando termos no painel do django para o admin gerenciar o glossario, por Anny em 07/09
from django.contrib import admin
from .models import Glossario

@admin.register(Glossario)
class GlossarioAdmin(admin.ModelAdmin):
    list_display = ('termo', 'categoria')
    list_filter = ('categoria',)
    search_fields = ('termo', 'definicao')
    ordering = ('termo',)