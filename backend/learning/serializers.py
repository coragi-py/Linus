from rest_framework import serializers
from .models import Modulo, Aula
from exercises.serializers import ExercicioSerializer


class AulaSerializer(serializers.ModelSerializer):
    exercicios = serializers.SerializerMethodField()

    # Aliases de leitura para compatibilidade direta com o frontend (trilha.tsx / licao.$lessonId.tsx)
    title = serializers.CharField(source='titulo', read_only=True)
    subtitle = serializers.CharField(source='conteudo_teorico', read_only=True)
    exercises = serializers.SerializerMethodField()

    class Meta:
        model = Aula
        fields = [
            'id',
            'modulo',
            'ordem',
            'titulo',
            'conteudo_teorico',
            'partitura_dados',
            'ativa',
            'exercicios',
            # Aliases frontend
            'title',
            'subtitle',
            'exercises',
        ]

    def get_exercicios(self, obj):
        qs = obj.exercicios.filter(ativo=True)
        exercicios_ordenados = sorted(
            qs,
            key=lambda e: e.gabarito_dados.get('ordem', 0) if isinstance(e.gabarito_dados, dict) else 0
        )
        return ExercicioSerializer(exercicios_ordenados, many=True).data

    def get_exercises(self, obj):
        return self.get_exercicios(obj)


class ModuloSerializer(serializers.ModelSerializer):
    aulas = serializers.SerializerMethodField()

    # Aliases de leitura para compatibilidade direta com o frontend (trilha.tsx)
    index = serializers.IntegerField(source='ordem', read_only=True)
    title = serializers.CharField(source='titulo', read_only=True)
    description = serializers.CharField(source='descricao', read_only=True)
    level = serializers.CharField(source='categoria', read_only=True)
    lessons = serializers.SerializerMethodField()

    class Meta:
        model = Modulo
        fields = [
            'id',
            'ordem',
            'titulo',
            'descricao',
            'categoria',
            'ativo',
            'aulas',
            # Aliases frontend
            'index',
            'title',
            'description',
            'level',
            'lessons',
        ]

    def get_aulas(self, obj):
        qs = obj.aulas.filter(ativa=True).order_by('ordem')
        return AulaSerializer(qs, many=True).data

    def get_lessons(self, obj):
        return self.get_aulas(obj)