# Esse arquivo define os serializers para os modelos PerguntaTriagem e OpcaoTriagem, permitindo a conversão entre instâncias de modelo e representações JSON para uso em APIs RESTful.
# Adicionando a funcionalidade de criação e atualização de perguntas e suas opções de forma atômica, garantindo a integridade dos dados no banco de dados.
from rest_framework import serializers
from django.db import transaction
from .models import PerguntaTriagem, OpcaoTriagem

class OpcaoTriagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpcaoTriagem
        fields = ['id', 'texto']

class PerguntaTriagemSerializer(serializers.ModelSerializer):
    opcoes = OpcaoTriagemSerializer(many=True, read_only=True)

    class Meta:
        model = PerguntaTriagem
        fields = ['id', 'enunciado', 'tipo', 'dados_partitura', 'ordem', 'ativo', 'opcoes']
class PerguntaTriagemAdminSerializer(serializers.ModelSerializer):
    opcoes = OpcaoTriagemSerializer(many=True, read_only=True)

    class Meta:
        model = PerguntaTriagem
        fields = ['id', 'enunciado', 'tipo', 'dados_partitura', 'ordem', 'ativo', 'opcoes']

    @transaction.atomic
    def create(self, validated_data):
        opcoes_data = validated_data.pop('opcoes', [])
        pergunta = PerguntaTriagem.objects.create(**validated_data)
        for opcao in opcoes_data:
            opcao.pop('id', None)
            OpcaoTriagem.objects.create(pergunta=pergunta, **opcao)
        return pergunta

    @transaction.atomic
    def update(self, instance, validated_data):
        opcoes_data = validated_data.pop('opcoes', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if opcoes_data is not None:
            # Substitui as alternativas pelas novas enviadas
            instance.opcoes.all().delete()
            for opcao in opcoes_data:
                opcao.pop('id', None)
                OpcaoTriagem.objects.create(pergunta=instance, **opcao)
        return instance