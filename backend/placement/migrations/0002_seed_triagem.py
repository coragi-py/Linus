import sys
import uuid

from django.db import migrations


QUESTOES_TRIAGEM = [
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000001"),
        "ordem": 1,
        "tipo": "texto",
        "enunciado": (
            "Qual alternativa melhor descreve sua experiência atual "
            "com teoria musical e leitura de partitura?"
        ),
        "dados_partitura": None,
        "opcoes": [
            {
                "texto": "Estou começando do zero e nunca estudei teoria musical.",
                "peso_perfil": 1,
            },
            {
                "texto": "Toco algumas músicas de ouvido ou por cifras, mas não leio partitura.",
                "peso_perfil": 1,
            },
            {
                "texto": "Já conheço as notas básicas e consigo identificar figuras simples na pauta.",
                "peso_perfil": 2,
            },
            {
                "texto": "Leio partituras básicas e já estudei escalas, intervalos ou formação de acordes.",
                "peso_perfil": 3,
            },
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000002"),
        "ordem": 2,
        "tipo": "partitura",
        "enunciado": (
            "Observe a pauta na clave de sol. "
            "Qual nota musical está posicionada na segunda linha, de baixo para cima?"
        ),
        "dados_partitura": {
            "clef": "treble",
            "timeSignature": "4/4",
            "notes": "G4/w",
            "width": 300,
            "height": 130,
        },
        "opcoes": [
            {"texto": "Mi (E4)", "peso_perfil": 1},
            {"texto": "Sol (G4)", "peso_perfil": 2},
            {"texto": "Fá (F4)", "peso_perfil": 1},
            {"texto": "Lá (A4)", "peso_perfil": 1},
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000003"),
        "ordem": 3,
        "tipo": "partitura",
        "enunciado": (
            "Na clave de sol, qual nota está representada pela primeira linha "
            "adicional abaixo da pauta?"
        ),
        "dados_partitura": {
            "clef": "treble",
            "timeSignature": "4/4",
            "notes": "C4/w",
            "width": 300,
            "height": 130,
        },
        "opcoes": [
            {"texto": "Dó central (C4)", "peso_perfil": 2},
            {"texto": "Ré (D4)", "peso_perfil": 1},
            {"texto": "Si (B3)", "peso_perfil": 1},
            {"texto": "Sol (G3)", "peso_perfil": 1},
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000004"),
        "ordem": 4,
        "tipo": "texto",
        "enunciado": (
            "Em um compasso 4/4, quantos tempos duram, respectivamente, "
            "uma mínima e uma semínima?"
        ),
        "dados_partitura": None,
        "opcoes": [
            {
                "texto": "Mínima = 4 tempos | Semínima = 2 tempos",
                "peso_perfil": 1,
            },
            {
                "texto": "Mínima = 2 tempos | Semínima = 1 tempo",
                "peso_perfil": 2,
            },
            {
                "texto": "Mínima = 1 tempo | Semínima = meio tempo",
                "peso_perfil": 1,
            },
            {
                "texto": "Ambas duram 1 tempo, mudando apenas o timbre.",
                "peso_perfil": 1,
            },
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000005"),
        "ordem": 5,
        "tipo": "partitura",
        "enunciado": (
            "Observe as duas notas sucessivas na pauta, Dó4 e Sol4. "
            "Qual é o intervalo melódico entre elas?"
        ),
        "dados_partitura": {
            "clef": "treble",
            "timeSignature": "4/4",
            "notes": "C4/h, G4/h",
            "width": 300,
            "height": 130,
        },
        "opcoes": [
            {"texto": "Terça maior", "peso_perfil": 1},
            {"texto": "Quarta justa", "peso_perfil": 1},
            {"texto": "Quinta justa", "peso_perfil": 2},
            {"texto": "Sexta menor", "peso_perfil": 1},
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000006"),
        "ordem": 6,
        "tipo": "texto",
        "enunciado": (
            "Qual é a fórmula de intervalos, em tons e semitons, "
            "que estrutura a escala maior natural?"
        ),
        "dados_partitura": None,
        "opcoes": [
            {
                "texto": "Tom – Tom – Semitom – Tom – Tom – Tom – Semitom",
                "peso_perfil": 2,
            },
            {
                "texto": "Tom – Semitom – Tom – Tom – Semitom – Tom – Tom",
                "peso_perfil": 1,
            },
            {
                "texto": "Todos os graus são separados por 1 tom inteiro.",
                "peso_perfil": 1,
            },
            {
                "texto": "Semitom – Tom – Tom – Semitom – Tom – Tom – Tom",
                "peso_perfil": 1,
            },
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000007"),
        "ordem": 7,
        "tipo": "texto",
        "enunciado": (
            "Dentro do estudo dos modos gregos, qual modo é formado a partir "
            "do 6º grau da escala maior e corresponde à escala menor natural?"
        ),
        "dados_partitura": None,
        "opcoes": [
            {"texto": "Modo dórico (2º grau)", "peso_perfil": 1},
            {"texto": "Modo frígio (3º grau)", "peso_perfil": 1},
            {"texto": "Modo mixolídio (5º grau)", "peso_perfil": 1},
            {"texto": "Modo eólio (6º grau)", "peso_perfil": 3},
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000008"),
        "ordem": 8,
        "tipo": "partitura",
        "enunciado": (
            "Observe as notas Dó (C4), Mi (E4) e Sol (G4) na pauta. "
            "Qual tríade elas formam?"
        ),
        "dados_partitura": {
            "clef": "treble",
            "timeSignature": "4/4",
            "notes": "C4/q, E4/q, G4/h",
            "width": 300,
            "height": 130,
        },
        "opcoes": [
            {"texto": "Tríade de Dó maior (C)", "peso_perfil": 2},
            {"texto": "Tríade de Dó menor (Cm)", "peso_perfil": 1},
            {"texto": "Tríade de Lá menor (Am)", "peso_perfil": 1},
            {"texto": "Acorde diminuto de Dó (Cdim)", "peso_perfil": 1},
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000009"),
        "ordem": 9,
        "tipo": "texto",
        "enunciado": (
            "Na tonalidade de Dó maior, qual acorde ocupa o V grau, "
            "também chamado de acorde dominante?"
        ),
        "dados_partitura": None,
        "opcoes": [
            {"texto": "Fá maior (F)", "peso_perfil": 1},
            {"texto": "Sol maior (G)", "peso_perfil": 3},
            {"texto": "Lá menor (Am)", "peso_perfil": 1},
            {"texto": "Mi menor (Em)", "peso_perfil": 1},
        ],
    },
]


def seed_triagem(apps, schema_editor):
    if "test" in sys.argv:
        return

    PerguntaTriagem = apps.get_model("placement", "PerguntaTriagem")
    OpcaoTriagem = apps.get_model("placement", "OpcaoTriagem")

    for questao in QUESTOES_TRIAGEM:
        pergunta, _ = PerguntaTriagem.objects.update_or_create(
            id=questao["id"],
            defaults={
                "ordem": questao["ordem"],
                "tipo": questao["tipo"],
                "enunciado": questao["enunciado"],
                "dados_partitura": questao["dados_partitura"],
                "ativo": True,
            },
        )

        OpcaoTriagem.objects.filter(pergunta=pergunta).delete()

        OpcaoTriagem.objects.bulk_create(
            [
                OpcaoTriagem(
                    pergunta=pergunta,
                    texto=opcao["texto"],
                    peso_perfil=opcao["peso_perfil"],
                )
                for opcao in questao["opcoes"]
            ]
        )


def reverse_seed_triagem(apps, schema_editor):
    PerguntaTriagem = apps.get_model("placement", "PerguntaTriagem")
    OpcaoTriagem = apps.get_model("placement", "OpcaoTriagem")

    ids = [questao["id"] for questao in QUESTOES_TRIAGEM]

    OpcaoTriagem.objects.filter(pergunta_id__in=ids).delete()
    PerguntaTriagem.objects.filter(id__in=ids).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("placement", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_triagem, reverse_seed_triagem),
    ]