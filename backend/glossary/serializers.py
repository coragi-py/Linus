# Definindo estrutura JSON que o front vai consumir, por Anny em 07/09
from rest_framework import serializers
from .models import Glossario

class GlossarioSerializer(serializers.ModelSerializer):
    # Renomeando figura_svg para diagram no JSON de saída para bater com o frontend atual
    diagram = serializers.CharField(source='figura_svg', required=False, allow_blank=True, allow_null=True)
    category = serializers.CharField(source='categoria')
    definition = serializers.CharField(source='definicao')
    term = serializers.CharField(source='termo')

    class Meta:
        model = Glossario
        fields = ['id', 'term', 'definition', 'diagram', 'category']