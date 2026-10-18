import sys
from django.db import migrations


TERMOS_PLANILHA = [
    # Pautas e Claves / Fórmulas de Compasso (Categoria: Pautas)
    {
        "termo": "Pauta",
        "categoria": "Pautas",
        "figura_svg": "stave",
        "definicao": "Conjunto de cinco linhas e quatro espaços onde as notas são escritas.",
    },
    {
        "termo": "Clave de Sol",
        "categoria": "Pautas",
        "figura_svg": "treble",
        "definicao": "Fixa a nota Sol na segunda linha da pauta.",
    },
    {
        "termo": "Clave de Fá",
        "categoria": "Pautas",
        "figura_svg": "bass",
        "definicao": "Fixa a nota Fá na quarta linha da pauta.",
    },
    {
        "termo": "Clave de Dó (Alto)",
        "categoria": "Pautas",
        "figura_svg": "alto",
        "definicao": "Fixa a nota Dó na terceira linha (usada pela viola).",
    },
    {
        "termo": "Clave de Dó (Tenor)",
        "categoria": "Pautas",
        "figura_svg": "tenor",
        "definicao": "Fixa a nota Dó na quarta linha (usada pelo violoncelo e fagote).",
    },
    {
        "termo": "Clave de Percussão",
        "categoria": "Pautas",
        "figura_svg": "percussion",
        "definicao": "Indica que a pauta será usada para instrumentos sem afinação definida.",
    },
    {
        "termo": "Compasso 4/4",
        "categoria": "Pautas",
        "figura_svg": "time-4/4",
        "definicao": "Compasso quaternário simples.",
    },
    {
        "termo": "Compasso 3/4",
        "categoria": "Pautas",
        "figura_svg": "time-3/4",
        "definicao": "Compasso ternário simples.",
    },
    {
        "termo": "Compasso 2/4",
        "categoria": "Pautas",
        "figura_svg": "time-2/4",
        "definicao": "Compasso binário simples.",
    },
    {
        "termo": "Compasso 6/8",
        "categoria": "Pautas",
        "figura_svg": "time-6/8",
        "definicao": "Compasso binário composto.",
    },
    {
        "termo": "Tempo Comum (C)",
        "categoria": "Pautas",
        "figura_svg": "time-c",
        "definicao": "Outra forma de representar o compasso 4/4.",
    },
    {
        "termo": "Tempo Cortado (C|)",
        "categoria": "Pautas",
        "figura_svg": "time-cut",
        "definicao": "Outra forma de representar o compasso 2/2 (Alla breve).",
    },
    # Figuras de Nota e Pausas (Categoria: Figuras)
    {
        "termo": "Semibreve",
        "categoria": "Figuras",
        "figura_svg": "whole",
        "definicao": "Figura de maior duração usual (4 tempos em 4/4).",
    },
    {
        "termo": "Mínima",
        "categoria": "Figuras",
        "figura_svg": "half",
        "definicao": "Vale 2 tempos em compasso 4/4.",
    },
    {
        "termo": "Semínima",
        "categoria": "Figuras",
        "figura_svg": "quarter",
        "definicao": "Vale 1 tempo em compasso 4/4. É a pulsação mais comum.",
    },
    {
        "termo": "Colcheia",
        "categoria": "Figuras",
        "figura_svg": "eighth",
        "definicao": "Vale meio tempo em compasso 4/4 (1 colchete).",
    },
    {
        "termo": "Semicolcheia",
        "categoria": "Figuras",
        "figura_svg": "sixteenth",
        "definicao": "Vale 1/4 de tempo em compasso 4/4 (2 colchetes).",
    },
    {
        "termo": "Fusa",
        "categoria": "Figuras",
        "figura_svg": "thirtysecond",
        "definicao": "Vale 1/8 de tempo em compasso 4/4 (3 colchetes).",
    },
    {
        "termo": "Semifusa",
        "categoria": "Figuras",
        "figura_svg": "sixtyfourth",
        "definicao": "Vale 1/16 de tempo em compasso 4/4 (4 colchetes).",
    },
    {
        "termo": "Pausa de Semibreve",
        "categoria": "Figuras",
        "figura_svg": "whole-rest",
        "definicao": "Silêncio equivalente à semibreve.",
    },
    {
        "termo": "Pausa de Mínima",
        "categoria": "Figuras",
        "figura_svg": "half-rest",
        "definicao": "Silêncio equivalente à mínima.",
    },
    {
        "termo": "Pausa de Semínima",
        "categoria": "Figuras",
        "figura_svg": "quarter-rest",
        "definicao": "Silêncio equivalente à semínima.",
    },
    {
        "termo": "Pausa de Colcheia",
        "categoria": "Figuras",
        "figura_svg": "eighth-rest",
        "definicao": "Silêncio equivalente à colcheia.",
    },
    {
        "termo": "Pausa de Semicolcheia",
        "categoria": "Figuras",
        "figura_svg": "sixteenth-rest",
        "definicao": "Silêncio equivalente à semicolcheia.",
    },
    {
        "termo": "Pausa de Fusa",
        "categoria": "Figuras",
        "figura_svg": "thirtysecond-rest",
        "definicao": "Silêncio equivalente à fusa.",
    },
    {
        "termo": "Pausa de Semifusa",
        "categoria": "Figuras",
        "figura_svg": "sixtyfourth-rest",
        "definicao": "Silêncio equivalente à semifusa.",
    },
    # Acidentes (Categoria: Acidentes)
    {
        "termo": "Sustenido",
        "categoria": "Acidentes",
        "figura_svg": "sharp",
        "definicao": "Eleva a nota em um semitom.",
    },
    {
        "termo": "Bemol",
        "categoria": "Acidentes",
        "figura_svg": "flat",
        "definicao": "Abaixa a nota em um semitom.",
    },
    {
        "termo": "Bequadro",
        "categoria": "Acidentes",
        "figura_svg": "natural",
        "definicao": "Cancela um sustenido ou bemol anterior.",
    },
    {
        "termo": "Dobrado Sustenido",
        "categoria": "Acidentes",
        "figura_svg": "doublesharp",
        "definicao": "Eleva a nota em um tom inteiro.",
    },
    {
        "termo": "Dobrado Bemol",
        "categoria": "Acidentes",
        "figura_svg": "doubleflat",
        "definicao": "Abaixa a nota em um tom inteiro.",
    },
]


def seed_glossario(apps, schema_editor):
    # Evita conflito com testes unitários isolados de glossário
    if "test" in sys.argv:
        return

    Glossario = apps.get_model("glossary", "Glossario")

    for item in TERMOS_PLANILHA:
        Glossario.objects.update_or_create(
            termo=item["termo"],
            defaults={
                "categoria": item["categoria"],
                "figura_svg": item["figura_svg"],
                "definicao": item["definicao"],
            },
        )


def reverse_seed_glossario(apps, schema_editor):
    Glossario = apps.get_model("glossary", "Glossario")
    nomes = [item["termo"] for item in TERMOS_PLANILHA]
    Glossario.objects.filter(termo__in=nomes).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("glossary", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_glossario, reverse_seed_glossario),
    ]