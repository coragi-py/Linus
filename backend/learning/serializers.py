from rest_framework import serializers
from .models import Modulo, Aula
from exercises.serializers import ExercicioSerializer


class AulaSerializer(serializers.ModelSerializer):
    exercicios = serializers.SerializerMethodField()

    # Aliases para o frontend:
    # - subtitle: resumo curto para o card da Trilha
    # - theory: texto didático completo para o Guia Teórico dentro da Lição
    title = serializers.CharField(source='titulo', read_only=True)
    subtitle = serializers.SerializerMethodField()
    theory = serializers.CharField(source='conteudo_teorico', read_only=True)
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
            'theory',
            'exercises',
        ]

    def get_subtitle(self, obj):
        if isinstance(obj.partitura_dados, dict) and obj.partitura_dados.get('resumo'):
            return obj.partitura_dados['resumo']
        texto = (obj.conteudo_teorico or '').strip()
        primeira_linha = texto.split('\n')[0].strip()
        if len(primeira_linha) > 95:
            return primeira_linha[:92].rstrip() + '...'
        return primeira_linha

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