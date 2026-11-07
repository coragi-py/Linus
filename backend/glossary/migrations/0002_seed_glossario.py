import sys
from django.db import migrations


TERMOS_GLOSSARIO_COMPLETO = [
    # ================= PAUTAS, CLAVES E FÓRMULAS DE COMPASSO =================
    {
        "termo": "Pauta",
        "categoria": "Pautas",
        "figura_svg": "stave",
        "definicao": (
            "Também chamada de Pentagrama, consiste no conjunto de 5 linhas horizontais paralelas e 4 espaços "
            "equidistantes, sempre contados de baixo para cima. Funciona como um gráfico de alturas musicais: "
            "quanto mais alto uma nota é grafada na pauta, mais agudo é o seu som."
        ),
    },
    {
        "termo": "Clave de Sol",
        "categoria": "Pautas",
        "figura_svg": "treble",
        "definicao": (
            "Símbolo posicionado no início da pauta cuja espiral central envolve a 2ª linha, determinando que "
            "qualquer nota escrita nessa linha é o Sol4 (acima do Dó central). É a clave padrão para registros "
            "médios e agudos (mão direita do piano, violão, violino, flauta e voz)."
        ),
    },
    {
        "termo": "Clave de Fá",
        "categoria": "Pautas",
        "figura_svg": "bass",
        "definicao": (
            "Clave utilizada para grafar sons médios e graves. Seus dois pontos envolvem a 4ª linha da pauta, "
            "fixando nela a nota Fá3 (abaixo do Dó central). É indispensável para a leitura da mão esquerda do "
            "piano, contrabaixo, violoncelo, fagote e trombone."
        ),
    },
    {
        "termo": "Clave de Dó (Alto)",
        "categoria": "Pautas",
        "figura_svg": "alto",
        "definicao": (
            "Clave centrada exatamente na 3ª linha da pauta, atribuindo a essa linha central a nota Dó4 (Dó Central). "
            "Permite escrever notas da região média sem excesso de linhas suplementares, sendo a clave padrão da viola de arco."
        ),
    },
    {
        "termo": "Clave de Dó (Tenor)",
        "categoria": "Pautas",
        "figura_svg": "tenor",
        "definicao": (
            "Variação da Clave de Dó posicionada na 4ª linha da pauta, determinando que a 4ª linha corresponde ao "
            "Dó Central (C4). É amplamente empregada para passagens agudas do violoncelo, fagote e trombone tenor."
        ),
    },
    {
        "termo": "Clave de Percussão",
        "categoria": "Pautas",
        "figura_svg": "percussion",
        "definicao": (
            "Também chamada de clave neutra, é utilizada para instrumentos rítmicos de altura indefinida (como bateria, "
            "caixa e percussão). Nela, cada linha ou espaço não indica uma nota afinada, mas sim uma peça diferente do kit percussivo."
        ),
    },
    {
        "termo": "Compasso 4/4",
        "categoria": "Pautas",
        "figura_svg": "time-4/4",
        "definicao": (
            "Fórmula de compasso quaternário simples — a mais frequente na música ocidental. O numerador (4) indica "
            "que cabem 4 pulsos por compasso, enquanto o denominador (4) define a Semínima como unidade de tempo (1 pulso)."
        ),
    },
    {
        "termo": "Compasso 3/4",
        "categoria": "Pautas",
        "figura_svg": "time-3/4",
        "definicao": (
            "Fórmula de compasso ternário simples, característica das valsas, minuetos e guarânias. Organiza o pulso "
            "em ciclos de 3 tempos (Forte – fraco – fraco), tendo a Semínima como figura equivalente a 1 tempo."
        ),
    },
    {
        "termo": "Compasso 2/4",
        "categoria": "Pautas",
        "figura_svg": "time-2/4",
        "definicao": (
            "Fórmula de compasso binário simples, formada por 2 tempos de Semínima por compasso (Forte – fraco). "
            "É a estrutura rítmica base de gêneros brasileiros como o samba, o choro, a marcha, o frevo e o baião."
        ),
    },
    {
        "termo": "Compasso 6/8",
        "categoria": "Pautas",
        "figura_svg": "time-6/8",
        "definicao": (
            "Compasso binário composto que agrupa 6 colcheias por compasso divididas em 2 pulsos principais ternários "
            "(cada pulso equivale a uma semínima pontuada, subdividida em 3 colcheias). Comum em baladas, blues lento e giga."
        ),
    },
    {
        "termo": "Tempo Comum (C)",
        "categoria": "Pautas",
        "figura_svg": "time-c",
        "definicao": (
            "Símbolo tradicional que substitui e equivale exatamente à fórmula de compasso 4/4 (quaternário simples). "
            "Tem origem na notação mensural renascentista, em que o semicírculo representava a divisão 'imperfeita' (binária/quaternária)."
        ),
    },
    {
        "termo": "Tempo Cortado (C|)",
        "categoria": "Pautas",
        "figura_svg": "time-cut",
        "definicao": (
            "Conhecido pelo termo italiano 'Alla breve', equivale à fórmula 2/2. Embora possua a mesma soma de figuras "
            "do 4/4, é sentido em 2 pulsos rápidos em que a Mínima passa a valer 1 tempo inteiro."
        ),
    },

    # ================= FIGURAS DE DURAÇÃO (NOTAS E PAUSAS) =================
    {
        "termo": "Semibreve",
        "categoria": "Figuras",
        "figura_svg": "whole",
        "definicao": (
            "Figura musical de referência (unidade inteira = 1/1) representada por uma cabeça oval aberta sem haste. "
            "No compasso 4/4, dura 4 tempos completos, preenchendo sozinha um compasso inteiro."
        ),
    },
    {
        "termo": "Mínima",
        "categoria": "Figuras",
        "figura_svg": "half",
        "definicao": (
            "Figura representada por uma cabeça oval aberta com haste vertical, equivalente à metade da semibreve (1/2). "
            "No compasso 4/4, sustenta o som por 2 tempos completos (duas mínimas preenchem um compasso 4/4)."
        ),
    },
    {
        "termo": "Semínima",
        "categoria": "Figuras",
        "figura_svg": "quarter",
        "definicao": (
            "Figura com cabeça oval preenchida e haste vertical, correspondente a 1/4 da semibreve. "
            "Nos compassos de denominador 4 (2/4, 3/4, 4/4), vale exatamente 1 tempo, funcionando como o pulso do metrônomo."
        ),
    },
    {
        "termo": "Colcheia",
        "categoria": "Figuras",
        "figura_svg": "eighth",
        "definicao": (
            "Figura com cabeça preenchida, haste e 1 colchete (ou barra de ligação), equivalente a 1/8 da semibreve. "
            "No compasso 4/4, vale meio tempo (0,5), dividindo cada batida do metrônomo em duas partes iguais."
        ),
    },
    {
        "termo": "Semicolcheia",
        "categoria": "Figuras",
        "figura_svg": "sixteenth",
        "definicao": (
            "Figura com cabeça preenchida, haste e 2 colchetes, equivalente a 1/16 da semibreve. "
            "No compasso 4/4, dura 1/4 de tempo (0,25), permitindo tocar 4 notas rápidas dentro de uma única batida."
        ),
    },
    {
        "termo": "Fusa",
        "categoria": "Figuras",
        "figura_svg": "thirtysecond",
        "definicao": (
            "Figura de execução muito rápida com 3 colchetes na haste, equivalente a 1/32 da semibreve. "
            "Em um compasso 4/4, vale 1/8 de tempo, subdividindo um único pulso de semínima em 8 notas."
        ),
    },
    {
        "termo": "Semifusa",
        "categoria": "Figuras",
        "figura_svg": "sixtyfourth",
        "definicao": (
            "Figura com 4 colchetes na haste, correspondente a 1/64 da semibreve. "
            "No compasso 4/4, vale 1/16 de tempo (16 notas em um único pulso), aparecendo sobretudo em ornamentos e passagens virtuosísticas."
        ),
    },
    {
        "termo": "Pausa de Semibreve",
        "categoria": "Figuras",
        "figura_svg": "whole-rest",
        "definicao": (
            "Símbolo retangular grafado 'pendurado' logo abaixo da 4ª linha da pauta. "
            "Indica silêncio absoluto de 4 tempos no compasso 4/4 (ou a pausa de um compasso inteiro em qualquer métrica)."
        ),
    },
    {
        "termo": "Pausa de Mínima",
        "categoria": "Figuras",
        "figura_svg": "half-rest",
        "definicao": (
            "Símbolo retangular apoiado sobre a 3ª linha da pauta (semelhante a um chapéu). "
            "Determina uma interrupção sonora de 2 tempos no compasso 4/4, equivalente à duração da figura Mínima."
        ),
    },
    {
        "termo": "Pausa de Semínima",
        "categoria": "Figuras",
        "figura_svg": "quarter-rest",
        "definicao": (
            "Símbolo sinuoso colocado no centro da pauta que indica 1 tempo inteiro de silêncio nos compassos "
            "de denominador 4 (2/4, 3/4 e 4/4), possuindo o mesmo valor temporal da Semínima."
        ),
    },
    {
        "termo": "Pausa de Colcheia",
        "categoria": "Figuras",
        "figura_svg": "eighth-rest",
        "definicao": (
            "Símbolo com uma haste inclinada e 1 gancho voltado para a esquerda. "
            "Representa meio tempo (1/2) de silêncio no compasso 4/4, sendo muito usado em contratempos e síncopes."
        ),
    },
    {
        "termo": "Pausa de Semicolcheia",
        "categoria": "Figuras",
        "figura_svg": "sixteenth-rest",
        "definicao": (
            "Símbolo com haste inclinada e 2 ganchos, equivalente ao silêncio de uma Semicolcheia (1/4 de tempo em 4/4). "
            "Essencial para criar articulações rítmicas precisas em levadas de funk, choro e música de câmara."
        ),
    },
    {
        "termo": "Pausa de Fusa",
        "categoria": "Figuras",
        "figura_svg": "thirtysecond-rest",
        "definicao": (
            "Símbolo com 3 ganchos que indica silêncio de 1/8 de tempo no compasso 4/4, "
            "correspondendo exatamente à duração da figura Fusa."
        ),
    },
    {
        "termo": "Pausa de Semifusa",
        "categoria": "Figuras",
        "figura_svg": "sixtyfourth-rest",
        "definicao": (
            "Símbolo com 4 ganchos que indica uma brevíssima pausa de 1/16 de tempo no compasso 4/4, "
            "equivalente à duração da figura Semifusa."
        ),
    },

    # ================= ACIDENTES MUSICAIS =================
    {
        "termo": "Sustenido",
        "categoria": "Acidentes",
        "figura_svg": "sharp",
        "definicao": (
            "Acidente musical (#) grafado à esquerda da cabeça da nota que eleva sua afinação em 1 semitom (meio tom). "
            "No piano, tocar o sustenido de uma nota equivale a avançar uma tecla imediatamente para a direita."
        ),
    },
    {
        "termo": "Bemol",
        "categoria": "Acidentes",
        "figura_svg": "flat",
        "definicao": (
            "Acidente musical (b) grafado à esquerda da cabeça da nota que abaixa sua afinação em 1 semitom (meio tom). "
            "No piano, tocar o bemol de uma nota equivale a recuar uma tecla imediatamente para a esquerda."
        ),
    },
    {
        "termo": "Bequadro",
        "categoria": "Acidentes",
        "figura_svg": "natural",
        "definicao": (
            "Acidente de cancelamento que anula o efeito de qualquer sustenido ou bemol anterior (seja da armadura de clave "
            "ou de uma alteração ocorrente no mesmo compasso), restituindo a nota ao seu estado natural (tecla branca no piano)."
        ),
    },
    {
        "termo": "Dobrado Sustenido",
        "categoria": "Acidentes",
        "figura_svg": "doublesharp",
        "definicao": (
            "Acidente (x ou ##) que eleva a altura da nota natural em 2 semitons (1 tom inteiro). "
            "É utilizado para preservar a escrita correta dos graus em tonalidades que já possuem muitos sustenidos na armadura."
        ),
    },
    {
        "termo": "Dobrado Bemol",
        "categoria": "Acidentes",
        "figura_svg": "doubleflat",
        "definicao": (
            "Acidente (bb) que abaixa a altura da nota natural em 2 semitons (1 tom inteiro). "
            "Aparece frequentemente em acordes diminutos e tonalidades menores com muitos bemóis na armadura de clave."
        ),
    },
]


def seed_glossario(apps, schema_editor):
    if "test" in sys.argv:
        return

    Glossario = apps.get_model("glossary", "Glossario")

    for item in TERMOS_GLOSSARIO_COMPLETO:
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
    nomes = [item["termo"] for item in TERMOS_GLOSSARIO_COMPLETO]
    Glossario.objects.filter(termo__in=nomes).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("glossary", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_glossario, reverse_seed_glossario),
    ]