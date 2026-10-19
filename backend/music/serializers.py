# Criação do serializer para a comunicação entre banco de dados e frontend, validando os dados enviados, por Antonio 12/09/2026
from rest_framework import serializers
from .models import Musica


class MusicaSerializer(serializers.ModelSerializer):
    is_publica = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Musica
        fields = ['id_musica', 'nome_musica', 'notas', 'id_usuario', 'is_publica', 'data_criacao']
        read_only_fields = ['id_musica', 'id_usuario', 'is_publica', 'data_criacao']

    def get_is_publica(self, obj):
        return obj.id_usuario_id is None

    def validate_notas(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("O campo notas deve ser uma lista.")
        if len(value) > 128:
            raise serializers.ValidationError("Uma música não pode ter mais do que 128 notas.")
        return value