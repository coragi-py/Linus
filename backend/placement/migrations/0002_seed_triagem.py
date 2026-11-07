import sys
import uuid
from django.db import migrations


QUESTOES_TRIAGEM = [
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000001"),
        "ordem": 1,
        "tipo": "texto",
        "enunciado": "Qual das alternativas melhor descreve sua experiência atual com leitura musical e instrumentos?",
        "dados_partitura": None,
        "opcoes": [
            {"texto": "Estou começando do zero e nunca estudei teoria musical.", "peso_perfil": 1},
            {"texto": "Toco algumas músicas de ouvido ou por cifras, mas não leio partitura.", "peso_perfil": 1},
            {"texto": "Já conheço as notas básicas e consigo identificar figuras simples na pauta.", "peso_perfil": 2},
            {"texto": "Leio partituras básicas e já estudei escalas, intervalos ou formação de acordes.", "peso_perfil": 3},
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000002"),
        "ordem": 2,
        "tipo": "partitura",
        "enunciado": "Observe a pauta na Clave de Sol. Qual nota musical está posicionada na segunda linha (de baixo para cima)?",
        "dados_partitura": {
            "clef": "treble",
            "timeSignature": "4/4",
            "notes": "G4/w",
            "width": 300,
            "height": 130,
        },
        "opcoes": [
            {"texto": "Mi (E4)", "peso_perfil": 1},
            {"texto": "Sol (G4) — linha de referência da Clave de Sol", "peso_perfil": 2},
            {"texto": "Fá (F4)", "peso_perfil": 1},
            {"texto": "Lá (A4)", "peso_perfil": 1},
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000003"),
        "ordem": 3,
        "tipo": "partitura",
        "enunciado": "Qual nota está escrita na primeira linha suplementar inferior da Clave de Sol?",
        "dados_partitura": {
            "clef": "treble",
            "timeSignature": "4/4",
            "notes": "C4/w",
            "width": 300,
            "height": 130,
        },
        "opcoes": [
            {"texto": "Dó Central (C4)", "peso_perfil": 2},
            {"texto": "Ré (D4)", "peso_perfil": 1},
            {"texto": "Si (B3)", "peso_perfil": 1},
            {"texto": "Sol (G3)", "peso_perfil": 1},
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000004"),
        "ordem": 4,
        "tipo": "texto",
        "enunciado": "Em um compasso quaternário simples (4/4), quantos tempos duram respectivamente uma Mínima e uma Semínima?",
        "dados_partitura": None,
        "opcoes": [
            {"texto": "Mínima = 4 tempos | Semínima = 2 tempos", "peso_perfil": 1},
            {"texto": "Mínima = 2 tempos | Semínima = 1 tempo", "peso_perfil": 2},
            {"texto": "Mínima = 1 tempo | Semínima = meio tempo", "peso_perfil": 1},
            {"texto": "Ambas duram 1 tempo, mudando apenas o timbre.", "peso_perfil": 1},
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000005"),
        "ordem": 5,
        "tipo": "partitura",
        "enunciado": "Observe as duas notas sucessivas na pauta (Dó4 e Sol4). Qual é a classificação desse intervalo?",
        "dados_partitura": {
            "clef": "treble",
            "timeSignature": "4/4",
            "notes": "C4/h, G4/h",
            "width": 300,
            "height": 130,
        },
        "opcoes": [
            {"texto": "Terça Maior (4 semitons)", "peso_perfil": 1},
            {"texto": "Quarta Justa (5 semitons)", "peso_perfil": 1},
            {"texto": "Quinta Justa (7 semitons)", "peso_perfil": 2},
            {"texto": "Sexta Menor (8 semitons)", "peso_perfil": 1},
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000006"),
        "ordem": 6,
        "tipo": "texto",
        "enunciado": "Qual é a fórmula de intervalos (em Tons e Semitons) que estrutura qualquer Escala Maior natural (Modo Jônio)?",
        "dados_partitura": None,
        "opcoes": [
            {"texto": "Tom – Tom – Semitom – Tom – Tom – Tom – Semitom", "peso_perfil": 2},
            {"texto": "Tom – Semitom – Tom – Tom – Semitom – Tom – Tom", "peso_perfil": 1},
            {"texto": "Todos os graus são separados por 1 Tom inteiro.", "peso_perfil": 1},
            {"texto": "Semitom – Tom – Tom – Semitom – Tom – Tom – Tom", "peso_perfil": 1},
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000007"),
        "ordem": 7,
        "tipo": "texto",
        "enunciado": "Dentro do estudo dos Modos Gregos, qual modo é formado a partir do 6º grau da escala maior e corresponde à Escala Menor Natural?",
        "dados_partitura": None,
        "opcoes": [
            {"texto": "Modo Dórico (2º grau)", "peso_perfil": 1},
            {"texto": "Modo Frígio (3º grau)", "peso_perfil": 1},
            {"texto": "Modo Mixolídio (5º grau)", "peso_perfil": 1},
            {"texto": "Modo Eólio (6º grau)", "peso_perfil": 3},
        ],
    },
    {
        "id": uuid.UUID("00000000-0000-0000-0005-000000000008"),
        "ordem": 8,
        "tipo": "partitura",
        "enunciado": "As notas Dó (C4), Mi (E4) e Sol (G4) apresentadas na pauta formam qual estrutura harmônica e qual é o seu acorde dominante (V grau)?",
        "dados_partitura": {
            "clef": "treble",
            "timeSignature": "4/4",
            "notes": "C4/q, E4/q, G4/h",
            "width": 300,
            "height": 130,
        },
        "opcoes": [
            {"texto": "Tríade de Dó Maior; seu V grau (dominante) é Sol Maior (G).", "peso_perfil": 3},
            {"texto": "Tríade de Dó Menor; seu V grau é Fá Maior (F).", "peso_perfil": 1},
            {"texto": "Tríade de Lá Menor; seu V grau é Mi Menor (Em).", "peso_perfil": 1},
            {"texto": "Acorde diminuto de Dó; não possui dominante.", "peso_perfil": 1},
        ],
    },
]


def seed_triagem(apps, schema_editor):
    if "test" in sys.argv:
        return

    PerguntaTriagem = apps.get_model("placement", "PerguntaTriagem")
    OpcaoTriagem = apps.get_model("placement", "OpcaoTriagem")

    for q in QUESTOES_TRIAGEM:
        pergunta, _ = PerguntaTriagem.objects.update_or_create(
            id=q["id"],
            defaults={
                "ordem": q["ordem"],
                "tipo": q["tipo"],
                "enunciado": q["enunciado"],
                "dados_partitura": q["dados_partitura"],
                "ativo": True,
            },
        )
        OpcaoTriagem.objects.filter(pergunta=pergunta).delete()
        for op in q["opcoes"]:
            OpcaoTriagem.objects.create(
                pergunta=pergunta,
                texto=op["texto"],
                peso_perfil=op["peso_perfil"],
            )


def reverse_seed_triagem(apps, schema_editor):
    PerguntaTriagem = apps.get_model("placement", "PerguntaTriagem")
    ids = [q["id"] for q in QUESTOES_TRIAGEM]
    PerguntaTriagem.objects.filter(id__in=ids).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("placement", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_triagem, reverse_seed_triagem),
    ]