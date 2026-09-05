# Esse arquivo define os serializers para os modelos PerguntaTriagem e OpcaoTriagem, permitindo a conversão entre instâncias de modelo e representações JSON para uso em APIs RESTful.

from rest_framework import serializers
from .models import PerguntaTriagem, OpcaoTriagem

class OpcaoTriagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpcaoTriagem
        fields = ['id', 'texto']

class PerguntaTriagemSerializer(serializers.ModelSerializer):
    opcoes = OpcaoTriagemSerializer(many=True, read_only=True)

    class Meta:
        model = PerguntaTriagem
        fields = ['id', 'enunciado', 'tipo', 'dados_partitura', 'opcoes']