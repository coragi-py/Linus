from rest_framework import serializers
from .models import Exercicio, TentativaExercicio


class ExercicioSerializer(serializers.ModelSerializer):
    # Aliases de leitura para compatibilidade direta com o frontend (Lovable)
    kind = serializers.CharField(source='tipo', read_only=True)
    prompt = serializers.CharField(source='enunciado', read_only=True)
    answer = serializers.SerializerMethodField()
    explanation = serializers.SerializerMethodField()
    stave = serializers.SerializerMethodField()
    options = serializers.SerializerMethodField()
    targetNote = serializers.SerializerMethodField()
    sequence = serializers.SerializerMethodField()

    class Meta:
        model = Exercicio
        fields = [
            'id',
            'aula',
            'tipo',
            'enunciado',
            'gabarito_dados',
            'tag_topico',
            'ativo',
            # Aliases frontend
            'kind',
            'prompt',
            'answer',
            'explanation',
            'stave',
            'options',
            'targetNote',
            'sequence',
        ]

    def _gabarito(self, obj):
        return obj.gabarito_dados if isinstance(obj.gabarito_dados, dict) else {}

    def get_answer(self, obj):
        return self._gabarito(obj).get('answer', '')

    def get_explanation(self, obj):
        return self._gabarito(obj).get('explanation', '')

    def get_stave(self, obj):
        return self._gabarito(obj).get('stave')

    def get_options(self, obj):
        return self._gabarito(obj).get('options')

    def get_targetNote(self, obj):
        return self._gabarito(obj).get('targetNote')

    def get_sequence(self, obj):
        return self._gabarito(obj).get('sequence')


class TentativaExercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TentativaExercicio
        fields = ['id', 'usuario', 'exercicio', 'acertou', 'tempo_resposta_ms', 'realizada_em']
        read_only_fields = ['id', 'usuario', 'realizada_em']