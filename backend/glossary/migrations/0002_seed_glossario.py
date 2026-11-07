import sys

from django.db import migrations


TERMOS_GLOSSARIO = [
    # ================= PAUTA, CLAVES E COMPASSOS =================
    {
        "termo": "Pauta",
        "categoria": "Pautas",
        "figura_svg": "stave",
        "definicao": (
            "Também chamada de pentagrama, é o conjunto de cinco linhas horizontais "
            "paralelas e quatro espaços, contados de baixo para cima. A posição de uma "
            "nota na pauta indica sua altura: quanto mais alta ela é escrita, mais agudo "
            "é o som representado."
        ),
    },
    {
        "termo": "Clave de Sol",
        "categoria": "Pautas",
        "figura_svg": "treble",
        "definicao": (
            "Símbolo posicionado no início da pauta cuja espiral central envolve a "
            "segunda linha. Essa linha passa a representar a nota Sol (G4). É a clave "
            "mais utilizada para registros médios e agudos, como voz, violino, flauta, "
            "violão e a mão direita do piano."
        ),
    },
    {
        "termo": "Clave de Fá",
        "categoria": "Pautas",
        "figura_svg": "bass",
        "definicao": (
            "Clave utilizada principalmente para registros médios e graves. Seus dois "
            "pontos envolvem a quarta linha da pauta, que passa a representar a nota "
            "Fá (F3). É comum na leitura da mão esquerda do piano, contrabaixo, "
            "violoncelo, fagote e trombone."
        ),
    },
    {
        "termo": "Clave de Dó (Alto)",
        "categoria": "Pautas",
        "figura_svg": "alto",
        "definicao": (
            "Variação da clave de dó posicionada na terceira linha da pauta. Ela "
            "determina que essa linha representa o dó central (C4). É utilizada "
            "principalmente pela viola de arco."
        ),
    },
    {
        "termo": "Clave de Dó (Tenor)",
        "categoria": "Pautas",
        "figura_svg": "tenor",
        "definicao": (
            "Variação da clave de dó posicionada na quarta linha da pauta. Ela determina "
            "que essa linha representa o dó central (C4). É utilizada em passagens mais "
            "agudas de instrumentos como violoncelo, fagote e trombone."
        ),
    },
    {
        "termo": "Clave de Percussão",
        "categoria": "Pautas",
        "figura_svg": "percussion",
        "definicao": (
            "Também chamada de clave neutra, é utilizada para instrumentos de percussão "
            "de altura indefinida, como bateria e caixa. Nela, linhas e espaços podem "
            "representar diferentes peças do instrumento, em vez de alturas específicas."
        ),
    },
    {
        "termo": "Compasso 4/4",
        "categoria": "Pautas",
        "figura_svg": "time-4-4",
        "definicao": (
            "Fórmula de compasso quaternário simples, muito comum na música ocidental. "
            "O número superior indica que cada compasso possui quatro tempos; o número "
            "inferior indica que a semínima corresponde à unidade de tempo."
        ),
    },
    {
        "termo": "Compasso 3/4",
        "categoria": "Pautas",
        "figura_svg": "time-3-4",
        "definicao": (
            "Fórmula de compasso ternário simples, com três tempos por compasso. "
            "A semínima corresponde à unidade de tempo. É frequente em valsas, "
            "minuetos e guarânias."
        ),
    },
    {
        "termo": "Compasso 2/4",
        "categoria": "Pautas",
        "figura_svg": "time-2-4",
        "definicao": (
            "Fórmula de compasso binário simples, com dois tempos por compasso. "
            "A semínima corresponde à unidade de tempo. É comum em gêneros como samba, "
            "choro, marcha, frevo e baião."
        ),
    },
    {
        "termo": "Compasso 6/8",
        "categoria": "Pautas",
        "figura_svg": "time-6-8",
        "definicao": (
            "Fórmula de compasso binário composto, formada por seis colcheias por "
            "compasso. Essas colcheias costumam ser agrupadas em dois pulsos maiores, "
            "cada um equivalente a uma semínima pontuada. É comum em baladas, blues "
            "lentos e gigas."
        ),
    },
    {
        "termo": "Tempo Comum",
        "categoria": "Pautas",
        "figura_svg": "time-c",
        "definicao": (
            "Símbolo tradicional, representado por um C, que equivale à fórmula de "
            "compasso 4/4. Indica um compasso quaternário simples, com quatro tempos "
            "por compasso e a semínima como unidade de tempo."
        ),
    },
    {
        "termo": "Tempo Cortado",
        "categoria": "Pautas",
        "figura_svg": "time-cut",
        "definicao": (
            "Símbolo tradicional, representado por um C cortado por uma linha vertical, "
            "que equivale à fórmula de compasso 2/2. Também chamado de alla breve, "
            "organiza o compasso em dois tempos, com a mínima como unidade de tempo."
        ),
    },

    # ================= FIGURAS, NOTAS E PAUSAS =================
    {
        "termo": "Semibreve",
        "categoria": "Figuras",
        "figura_svg": "whole",
        "definicao": (
            "Figura musical representada por uma cabeça oval aberta, sem haste. "
            "No compasso 4/4, dura quatro tempos e pode preencher um compasso inteiro."
        ),
    },
    {
        "termo": "Mínima",
        "categoria": "Figuras",
        "figura_svg": "half",
        "definicao": (
            "Figura musical representada por uma cabeça oval aberta com haste. "
            "No compasso 4/4, dura dois tempos, ou seja, metade da duração de uma semibreve."
        ),
    },
    {
        "termo": "Semínima",
        "categoria": "Figuras",
        "figura_svg": "quarter",
        "definicao": (
            "Figura musical representada por uma cabeça preenchida com haste. "
            "Em compassos como 2/4, 3/4 e 4/4, corresponde à unidade de tempo e dura "
            "um tempo."
        ),
    },
    {
        "termo": "Colcheia",
        "categoria": "Figuras",
        "figura_svg": "eighth",
        "definicao": (
            "Figura musical representada por uma cabeça preenchida, haste e um colchete "
            "ou barra de ligação. No compasso 4/4, dura meio tempo; duas colcheias "
            "correspondem a uma semínima."
        ),
    },
    {
        "termo": "Semicolcheia",
        "categoria": "Figuras",
        "figura_svg": "sixteenth",
        "definicao": (
            "Figura musical representada por uma cabeça preenchida, haste e dois "
            "colchetes ou barras de ligação. No compasso 4/4, dura um quarto de tempo; "
            "quatro semicolcheias correspondem a uma semínima."
        ),
    },
    {
        "termo": "Fusa",
        "categoria": "Figuras",
        "figura_svg": "thirtysecond",
        "definicao": (
            "Figura musical representada por uma cabeça preenchida, haste e três "
            "colchetes ou barras de ligação. No compasso 4/4, dura um oitavo de tempo; "
            "oito fusas correspondem a uma semínima."
        ),
    },
    {
        "termo": "Semifusa",
        "categoria": "Figuras",
        "figura_svg": "sixtyfourth",
        "definicao": (
            "Figura musical representada por uma cabeça preenchida, haste e quatro "
            "colchetes ou barras de ligação. No compasso 4/4, dura um dezesseis avos "
            "de tempo; dezesseis semifusas correspondem a uma semínima."
        ),
    },
    {
        "termo": "Pausa de Semibreve",
        "categoria": "Figuras",
        "figura_svg": "whole-rest",
        "definicao": (
            "Símbolo de silêncio equivalente à duração de uma semibreve. No compasso "
            "4/4, representa quatro tempos de silêncio e pode indicar um compasso inteiro."
        ),
    },
    {
        "termo": "Pausa de Mínima",
        "categoria": "Figuras",
        "figura_svg": "half-rest",
        "definicao": (
            "Símbolo de silêncio equivalente à duração de uma mínima. No compasso 4/4, "
            "representa dois tempos de silêncio."
        ),
    },
    {
        "termo": "Pausa de Semínima",
        "categoria": "Figuras",
        "figura_svg": "quarter-rest",
        "definicao": (
            "Símbolo de silêncio equivalente à duração de uma semínima. Em compassos "
            "como 2/4, 3/4 e 4/4, representa um tempo de silêncio."
        ),
    },
    {
        "termo": "Pausa de Colcheia",
        "categoria": "Figuras",
        "figura_svg": "eighth-rest",
        "definicao": (
            "Símbolo de silêncio equivalente à duração de uma colcheia. No compasso 4/4, "
            "representa meio tempo de silêncio."
        ),
    },
    {
        "termo": "Pausa de Semicolcheia",
        "categoria": "Figuras",
        "figura_svg": "sixteenth-rest",
        "definicao": (
            "Símbolo de silêncio equivalente à duração de uma semicolcheia. No compasso "
            "4/4, representa um quarto de tempo de silêncio."
        ),
    },
    {
        "termo": "Pausa de Fusa",
        "categoria": "Figuras",
        "figura_svg": "thirtysecond-rest",
        "definicao": (
            "Símbolo de silêncio equivalente à duração de uma fusa. No compasso 4/4, "
            "representa um oitavo de tempo de silêncio."
        ),
    },
    {
        "termo": "Pausa de Semifusa",
        "categoria": "Figuras",
        "figura_svg": "sixtyfourth-rest",
        "definicao": (
            "Símbolo de silêncio equivalente à duração de uma semifusa. No compasso 4/4, "
            "representa um dezesseis avos de tempo de silêncio."
        ),
    },

    # ================= ALTURA, INTERVALOS E ESCALAS =================
    {
        "termo": "Modo Grego",
        "categoria": "Teoria Musical",
        "figura_svg": "modes",
        "definicao": (
            "Escala derivada da reorganização dos graus de uma escala maior, com uma "
            "nota diferente funcionando como tônica. Os sete modos são jônio, dórico, "
            "frígio, lídio, mixolídio, eólio e lócrio."
        ),
    },

    # ================= ACIDENTES =================
    {
        "termo": "Sustenido",
        "categoria": "Acidentes",
        "figura_svg": "sharp",
        "definicao": (
            "Acidente musical, representado por #, que eleva a altura de uma nota em um "
            "semitom. É escrito antes da nota que deve ser alterada."
        ),
    },
    {
        "termo": "Bemol",
        "categoria": "Acidentes",
        "figura_svg": "flat",
        "definicao": (
            "Acidente musical, representado por b, que abaixa a altura de uma nota em um "
            "semitom. É escrito antes da nota que deve ser alterada."
        ),
    },
    {
        "termo": "Bequadro",
        "categoria": "Acidentes",
        "figura_svg": "natural",
        "definicao": (
            "Acidente musical que cancela o efeito de um sustenido ou bemol anterior, "
            "restaurando a nota ao seu estado natural."
        ),
    },
]


def seed_glossario(apps, schema_editor):
    if "test" in sys.argv:
        return

    Glossario = apps.get_model("glossary", "Glossario")

    for item in TERMOS_GLOSSARIO:
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

    termos = [item["termo"] for item in TERMOS_GLOSSARIO]
    Glossario.objects.filter(termo__in=termos).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("glossary", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_glossario, reverse_seed_glossario),
    ]