import uuid
from django.db import migrations


def seed_curriculum(apps, schema_editor):
    Modulo = apps.get_model('learning', 'Modulo')
    Aula = apps.get_model('learning', 'Aula')
    Exercicio = apps.get_model('exercises', 'Exercicio')
    Badge = apps.get_model('gamification', 'Badge')

    # Badges padrões
    badges_iniciais = [
        (
            'primeira-nota',
            'Primeira Nota',
            'Concluiu a primeira lição na trilha do Linus.',
            'star',
        ),
        (
            'tres-licoes',
            'Três Lições',
            'Concluiu 3 lições na trilha de aprendizado.',
            'trophy',
        ),
        (
            'ofensiva-5-dias',
            'Consistência (5 dias)',
            'Manteve uma ofensiva de estudos por 5 dias consecutivos.',
            'flame',
        ),
    ]
    for codigo, nome, descricao, icone in badges_iniciais:
        Badge.objects.get_or_create(
            codigo=codigo,
            defaults={'nome': nome, 'descricao': descricao, 'icone_url': icone},
        )

    # Evita duplicar caso já existam módulos cadastrados
    if Modulo.objects.exists():
        return

    unidades = [
        {
            'id': uuid.UUID('00000000-0000-0000-0001-000000000001'),
            'ordem': 1,
            'titulo': 'Unidade 1: Leitura de Partituras',
            'descricao': 'Pauta, clave de Sol, notas e figuras de duração.',
            'categoria': 'Iniciante',
            'tag_topico': 'Leitura de Partituras',
            'aulas': [
                {
                    'id': uuid.UUID('00000000-0000-0000-0002-000000000101'),
                    'ordem': 1,
                    'titulo': 'As notas na clave de Sol',
                    'conteudo_teorico': 'Reconheça as notas nas linhas e espaços',
                    'exercicios': [
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000001011'),
                            'tipo': 'note-reading',
                            'enunciado': 'Qual nota está escrita na pauta?',
                            'gabarito_dados': {
                                'ordem': 1,
                                'stave': ['C4'],
                                'options': ['Dó', 'Ré', 'Mi', 'Fá'],
                                'answer': 'Dó',
                                'explanation': 'Dó central fica na linha suplementar abaixo da pauta, na clave de Sol.',
                            },
                        },
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000001012'),
                            'tipo': 'note-reading',
                            'enunciado': 'Qual nota está escrita na pauta?',
                            'gabarito_dados': {
                                'ordem': 2,
                                'stave': ['G4'],
                                'options': ['Fá', 'Sol', 'Lá', 'Si'],
                                'answer': 'Sol',
                                'explanation': 'A clave de Sol envolve a segunda linha, que é justamente o Sol.',
                            },
                        },
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000001013'),
                            'tipo': 'keyboard',
                            'enunciado': 'Toque no piano a nota mostrada na pauta.',
                            'gabarito_dados': {
                                'ordem': 3,
                                'stave': ['E4'],
                                'answer': 'E4',
                                'targetNote': 'E4',
                                'explanation': 'Mi fica no primeiro espaço da pauta, entre a primeira e a segunda linha.',
                            },
                        },
                    ],
                },
                {
                    'id': uuid.UUID('00000000-0000-0000-0002-000000000102'),
                    'ordem': 2,
                    'titulo': 'Figuras de duração',
                    'conteudo_teorico': 'Semibreve, mínima, semínima e colcheia',
                    'exercicios': [
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000001021'),
                            'tipo': 'multiple-choice',
                            'enunciado': 'Quantos tempos vale uma mínima em compasso 4/4?',
                            'gabarito_dados': {
                                'ordem': 1,
                                'options': ['1 tempo', '2 tempos', '3 tempos', '4 tempos'],
                                'answer': '2 tempos',
                                'explanation': 'A mínima vale metade da semibreve: 2 tempos em 4/4.',
                            },
                        },
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000001022'),
                            'tipo': 'multiple-choice',
                            'enunciado': 'Qual figura vale meio tempo em 4/4?',
                            'gabarito_dados': {
                                'ordem': 2,
                                'options': ['Semibreve', 'Semínima', 'Colcheia', 'Mínima'],
                                'answer': 'Colcheia',
                                'explanation': 'A colcheia é metade da semínima, portanto meio tempo em 4/4.',
                            },
                        },
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000001023'),
                            'tipo': 'note-reading',
                            'enunciado': 'Qual nota está escrita na pauta?',
                            'gabarito_dados': {
                                'ordem': 3,
                                'stave': ['A4'],
                                'options': ['Sol', 'Lá', 'Si', 'Dó'],
                                'answer': 'Lá',
                                'explanation': 'Lá ocupa o segundo espaço da pauta na clave de Sol.',
                            },
                        },
                    ],
                },
            ],
        },
        {
            'id': uuid.UUID('00000000-0000-0000-0001-000000000002'),
            'ordem': 2,
            'titulo': 'Unidade 2: Intervalos e Escalas',
            'descricao': 'Distâncias entre notas e a escala maior.',
            'categoria': 'Iniciante',
            'tag_topico': 'Intervalos e Escalas',
            'aulas': [
                {
                    'id': uuid.UUID('00000000-0000-0000-0002-000000000201'),
                    'ordem': 1,
                    'titulo': 'Intervalos básicos',
                    'conteudo_teorico': 'Terças, quartas e quintas',
                    'exercicios': [
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000002011'),
                            'tipo': 'note-reading',
                            'enunciado': 'Qual é o intervalo entre as duas notas da pauta?',
                            'gabarito_dados': {
                                'ordem': 1,
                                'stave': ['C4', 'E4'],
                                'options': ['Terça maior', 'Terça menor', 'Quarta justa', 'Quinta justa'],
                                'answer': 'Terça maior',
                                'explanation': 'De Dó a Mi há 4 semitons, formando uma terça maior.',
                            },
                        },
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000002012'),
                            'tipo': 'note-reading',
                            'enunciado': 'Qual é o intervalo entre as duas notas da pauta?',
                            'gabarito_dados': {
                                'ordem': 2,
                                'stave': ['C4', 'G4'],
                                'options': ['Quarta justa', 'Quinta justa', 'Sexta maior', 'Oitava'],
                                'answer': 'Quinta justa',
                                'explanation': 'De Dó a Sol há 7 semitons: quinta justa, base dos acordes.',
                            },
                        },
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000002013'),
                            'tipo': 'builder',
                            'enunciado': 'Monte a escala de Dó maior ascendente.',
                            'gabarito_dados': {
                                'ordem': 3,
                                'sequence': ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
                                'answer': 'C4,D4,E4,F4,G4,A4,B4',
                                'explanation': 'Dó maior segue tom-tom-semitom-tom-tom-tom-semitom, sem acidentes.',
                            },
                        },
                    ],
                },
            ],
        },
        {
            'id': uuid.UUID('00000000-0000-0000-0001-000000000003'),
            'ordem': 3,
            'titulo': 'Unidade 3: Modos Gregos',
            'descricao': 'Jônio, dórico, frígio, lídio, mixolídio, eólio e lócrio.',
            'categoria': 'Intermediário',
            'tag_topico': 'Modos Gregos',
            'aulas': [
                {
                    'id': uuid.UUID('00000000-0000-0000-0002-000000000301'),
                    'ordem': 1,
                    'titulo': 'Os sete modos',
                    'conteudo_teorico': 'Cada grau da escala maior gera um modo',
                    'exercicios': [
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000003011'),
                            'tipo': 'multiple-choice',
                            'enunciado': 'Qual modo começa no segundo grau da escala maior?',
                            'gabarito_dados': {
                                'ordem': 1,
                                'options': ['Jônio', 'Dórico', 'Frígio', 'Lídio'],
                                'answer': 'Dórico',
                                'explanation': 'O dórico parte do 2º grau: em Dó maior, de Ré a Ré.',
                            },
                        },
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000003012'),
                            'tipo': 'multiple-choice',
                            'enunciado': 'Qual modo tem a quarta aumentada como característica?',
                            'gabarito_dados': {
                                'ordem': 2,
                                'options': ['Lídio', 'Mixolídio', 'Eólio', 'Lócrio'],
                                'answer': 'Lídio',
                                'explanation': 'O lídio (4º grau) tem #4, som luminoso e flutuante.',
                            },
                        },
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000003013'),
                            'tipo': 'builder',
                            'enunciado': 'Monte o modo dórico de Ré (só notas naturais).',
                            'gabarito_dados': {
                                'ordem': 3,
                                'sequence': ['D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
                                'answer': 'D4,E4,F4,G4,A4,B4',
                                'explanation': 'O dórico de Ré usa apenas notas naturais, com terça e sétima menores.',
                            },
                        },
                    ],
                },
            ],
        },
        {
            'id': uuid.UUID('00000000-0000-0000-0001-000000000004'),
            'ordem': 4,
            'titulo': 'Unidade 4: Acordes e Campos Harmônicos',
            'descricao': 'Tríades, tétrades e a harmonização da escala.',
            'categoria': 'Praticante Empírico',
            'tag_topico': 'Acordes e Campos Harmônicos',
            'aulas': [
                {
                    'id': uuid.UUID('00000000-0000-0000-0002-000000000401'),
                    'ordem': 1,
                    'titulo': 'Tríades maiores e menores',
                    'conteudo_teorico': 'A construção do acorde em terças',
                    'exercicios': [
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000004011'),
                            'tipo': 'multiple-choice',
                            'enunciado': 'Quais notas formam o acorde de Dó maior?',
                            'gabarito_dados': {
                                'ordem': 1,
                                'options': ['Dó, Mi, Sol', 'Dó, Mi bemol, Sol', 'Dó, Fá, Lá', 'Dó, Ré, Sol'],
                                'answer': 'Dó, Mi, Sol',
                                'explanation': 'Tríade maior = tônica + terça maior + quinta justa.',
                            },
                        },
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000004012'),
                            'tipo': 'builder',
                            'enunciado': 'Monte a tríade de Lá menor ascendente.',
                            'gabarito_dados': {
                                'ordem': 2,
                                'sequence': ['A3', 'C4', 'E4'],
                                'answer': 'A3,C4,E4',
                                'explanation': 'Lá menor = Lá + Dó (terça menor) + Mi (quinta justa).',
                            },
                        },
                        {
                            'id': uuid.UUID('00000000-0000-0000-0003-000000004013'),
                            'tipo': 'multiple-choice',
                            'enunciado': 'No campo harmônico de Dó maior, qual é o acorde do V grau?',
                            'gabarito_dados': {
                                'ordem': 3,
                                'options': ['Fá maior', 'Sol maior', 'Lá menor', 'Si diminuto'],
                                'answer': 'Sol maior',
                                'explanation': 'O V grau de Dó maior é Sol maior, o acorde dominante.',
                            },
                        },
                    ],
                },
            ],
        },
    ]

    for u in unidades:
        modulo = Modulo.objects.create(
            id=u['id'],
            ordem=u['ordem'],
            titulo=u['titulo'],
            descricao=u['descricao'],
            categoria=u['categoria'],
            ativo=True,
        )
        for a in u['aulas']:
            aula = Aula.objects.create(
                id=a['id'],
                modulo=modulo,
                ordem=a['ordem'],
                titulo=a['titulo'],
                conteudo_teorico=a['conteudo_teorico'],
                ativa=True,
            )
            for ex in a['exercicios']:
                Exercicio.objects.create(
                    id=ex['id'],
                    aula=aula,
                    tipo=ex['tipo'],
                    enunciado=ex['enunciado'],
                    gabarito_dados=ex['gabarito_dados'],
                    tag_topico=u['tag_topico'],
                    ativo=True,
                )


def reverse_seed(apps, schema_editor):
    Modulo = apps.get_model('learning', 'Modulo')
    Modulo.objects.filter(
        id__in=[
            uuid.UUID('00000000-0000-0000-0001-000000000001'),
            uuid.UUID('00000000-0000-0000-0001-000000000002'),
            uuid.UUID('00000000-0000-0000-0001-000000000003'),
            uuid.UUID('00000000-0000-0000-0001-000000000004'),
        ]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('learning', '0001_initial'),
        ('exercises', '0001_initial'),
        ('gamification', '0001_initial'),
        ('progress', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_curriculum, reverse_seed),
    ]