# Definindo estrutura JSON que o front vai consumir, por Anny em 07/09
# Alterado a forma de expor os campos do modelo Glossario para o frontend, adicionando aliases em inglês para os campos 'termo', 'definicao', 'figura_svg' e 'categoria', facilitando a integração com o frontend do aluno. Por Fabio 10/09
from rest_framework import serializers
from .models import Glossario

class GlossarioSerializer(serializers.ModelSerializer):
    term = serializers.CharField(source='termo', read_only=True)
    definition = serializers.CharField(source='definicao', read_only=True)
    diagram = serializers.CharField(source='figura_svg', read_only=True, allow_null=True)
    category = serializers.CharField(source='categoria', read_only=True)

    class Meta:
        model = Glossario
        fields = [
            'id', 
            'termo', 'definicao', 'figura_svg', 'categoria',
            'term', 'definition', 'diagram', 'category'
        ]
        extra_kwargs = {
            'figura_svg': {'required': False, 'allow_blank': True, 'allow_null': True}
        }