# Arquivo responsável por definir os serializers para os modelos Modulo e Aula e permitir o gerenciamento de dados relacionados a esses modelos na API. Por Fabio 10/09
from rest_framework import serializers
from .models import Modulo, Aula

class AulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = '__all__'

class ModuloSerializer(serializers.ModelSerializer):
    aulas = AulaSerializer(many=True, read_only=True)

    class Meta:
        model = Modulo
        fields = '__all__'