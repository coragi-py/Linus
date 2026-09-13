# Criação do serilizer para a comunicação entre banco de dados e frontend, validando os dados enviados, por Antonio 12/09/2026
from rest_framework import serializers
from .models import Musica

class MusicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Musica
        fields = ['id_musica', 'nome_musica', 'notas', 'id_usuario', 'data_criacao']
        read_only_fields = ['id_musica', 'data_criacao']

    def validate_notas(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("O campo notas deve ser uma lista.")
        if len(value) > 128: #Para alterar a quantidade de notas por gravação, o texto abaixo tem que ser atualziado
            raise serializers.ValidationError("Uma música não pode ter mais do que 128 notas.")
        return value