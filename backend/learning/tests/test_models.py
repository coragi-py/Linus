from django.test import TestCase
from learning.models import Modulo, Aula
from learning.serializers import ModuloSerializer, AulaSerializer


class LearningModelAndSerializerTests(TestCase):
    def test_criacao_modulo_e_aula_e_serializacao_aliases(self):
        modulo = Modulo.objects.create(
            ordem=10,
            titulo="Unidade Teste: Percepção",
            descricao="Treinamento auditivo inicial",
            categoria="Iniciante",
            ativo=True,
        )
        aula = Aula.objects.create(
            modulo=modulo,
            ordem=1,
            titulo="Aula 1: Timbres",
            conteudo_teorico="Identificando timbres e alturas",
            partitura_dados={"clef": "treble", "notes": "C4/w"},
            ativa=True,
        )

        aula_data = AulaSerializer(aula).data
        self.assertEqual(aula_data["title"], "Aula 1: Timbres")
        self.assertEqual(aula_data["subtitle"], "Identificando timbres e alturas")
        self.assertEqual(aula_data["exercises"], [])

        modulo_data = ModuloSerializer(modulo).data
        self.assertEqual(modulo_data["index"], 10)
        self.assertEqual(modulo_data["title"], "Unidade Teste: Percepção")
        self.assertEqual(modulo_data["level"], "Iniciante")
        self.assertEqual(len(modulo_data["lessons"]), 1)