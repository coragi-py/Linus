from django.test import TestCase
from django.db.utils import IntegrityError
from glossary.models import Glossario

class GlossarioModelTests(TestCase):
    def test_criar_termo_com_sucesso(self):
        """Garante a criação de um termo musical salvando corretamente no banco."""
        termo = Glossario.objects.create(
            termo="Acorde",
            definicao="Conjunto de três ou mais notas tocadas simultaneamente.",
            figura_svg="<svg class='vexflow'>...notas do acorde...</svg>",
            categoria="Harmonia"
        )
        self.assertEqual(Glossario.objects.count(), 1)
        self.assertIsNotNone(termo.id)
        self.assertEqual(termo.termo, "Acorde")

    def test_termo_deve_ser_unico(self):
        """Impede a criação de termos musicais duplicados no banco de dados (unique=True)."""
        Glossario.objects.create(
            termo="Clave de Sol",
            definicao="Símbolo que indica a nota Sol na segunda linha.",
            categoria="Notação"
        )
        
        with self.assertRaises(IntegrityError):
            Glossario.objects.create(
                termo="Clave de Sol", # Mesmo termo propositalmente
                definicao="Outra definição para a mesma clave.",
                categoria="Notação"
            )

    def test_figura_svg_pode_ser_nula(self):
        """Garante que o campo de imagem (VexFlow SVG) aceita valores nulos para termos teóricos."""
        termo = Glossario.objects.create(
            termo="Andante",
            definicao="Andamento moderado, velocidade de caminhada.",
            categoria="Dinâmica e Andamento"
            # figura_svg não enviado
        )
        self.assertIsNone(termo.figura_svg)