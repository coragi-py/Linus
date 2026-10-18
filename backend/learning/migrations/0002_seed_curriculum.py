import uuid
from django.db import migrations


def seed_curriculum(apps, schema_editor):
    Modulo = apps.get_model("learning", "Modulo")
    Aula = apps.get_model("learning", "Aula")
    Exercicio = apps.get_model("exercises", "Exercicio")
    Badge = apps.get_model("gamification", "Badge")

    badges_iniciais = [
        (
            "primeira-nota",
            "Primeira Nota",
            "Concluiu a primeira lição na trilha do Linus.",
            "star",
        ),
        (
            "tres-licoes",
            "Três Lições",
            "Concluiu 3 lições na trilha de aprendizado.",
            "trophy",
        ),
        (
            "ofensiva-5-dias",
            "Consistência (5 dias)",
            "Manteve uma ofensiva de estudos por 5 dias consecutivos.",
            "flame",
        ),
    ]
    for codigo, nome, descricao, icone in badges_iniciais:
        Badge.objects.update_or_create(
            codigo=codigo,
            defaults={"nome": nome, "descricao": descricao, "icone_url": icone},
        )

    unidades = [
        {
            "id": uuid.UUID("00000000-0000-0000-0001-000000000001"),
            "ordem": 1,
            "titulo": "Unidade 1: Leitura de Partituras",
            "descricao": "Domine a pauta musical, a Clave de Sol, as notas nas linhas/espaços e a divisão rítmica.",
            "categoria": "Iniciante",
            "tag_topico": "Leitura de Partituras",
            "aulas": [
                {
                    "id": uuid.UUID("00000000-0000-0000-0002-000000000101"),
                    "ordem": 1,
                    "titulo": "A Pauta e as Notas na Clave de Sol",
                    "conteudo_teorico": (
                        "A partitura é o mapa visual da música. Ela é escrita sobre a Pauta (ou Pentagrama), "
                        "formada por 5 linhas horizontais e 4 espaços contados sempre de baixo para cima. "
                        "Cada linha e cada espaço representa uma altura (nota) diferente.\n\n"
                        "No início da pauta colocamos a Clave de Sol. A espiral central desse símbolo nasce exatamente "
                        "na 2ª linha, determinando que toda nota escrita nessa segunda linha chama-se Sol (G4). "
                        "A partir dela, basta seguir a ordem das 7 notas musicais (Dó – Ré – Mi – Fá – Sol – Lá – Si) "
                        "alternando entre linha e espaço.\n\n"
                        "💡 Regra prática de memorização:\n"
                        "• Notas nas 5 linhas (de baixo para cima): Mi (1ª) – Sol (2ª) – Si (3ª) – Ré (4ª) – Fá (5ª).\n"
                        "• Notas nos 4 espaços (de baixo para cima): Fá (1º) – Lá (2º) – Dó (3º) – Mi (4º).\n"
                        "• O Dó Central (C4) fica logo abaixo da 1ª linha, cortado por um pequeno traço chamado linha suplementar inferior."
                    ),
                    "partitura_dados": {
                        "resumo": "Pauta, referência da Clave de Sol, Dó Central e notas nas linhas e espaços.",
                        "clef": "treble",
                        "notes": ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
                        "caption": "Escala de Dó4 a Si4 na Clave de Sol: observe como as notas sobem alternando entre linha e espaço.",
                    },
                    "exercicios": [
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000001011"),
                            "tipo": "note-reading",
                            "enunciado": "Qual nota está escrita na linha suplementar abaixo da pauta?",
                            "gabarito_dados": {
                                "ordem": 1,
                                "stave": ["C4"],
                                "options": ["Dó", "Ré", "Mi", "Fá"],
                                "answer": "Dó",
                                "explanation": "O Dó Central (C4) fica na primeira linha suplementar inferior da Clave de Sol.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000001012"),
                            "tipo": "note-reading",
                            "enunciado": "Qual nota está escrita na 2ª linha da pauta (referência da Clave de Sol)?",
                            "gabarito_dados": {
                                "ordem": 2,
                                "stave": ["G4"],
                                "options": ["Fá", "Sol", "Lá", "Si"],
                                "answer": "Sol",
                                "explanation": "A espiral da Clave de Sol envolve a 2ª linha, batizando-a com a nota Sol (G4).",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000001013"),
                            "tipo": "keyboard",
                            "enunciado": "Observe a nota na 1ª linha da pauta (Mi / E4) e toque-a no piano virtual.",
                            "gabarito_dados": {
                                "ordem": 3,
                                "stave": ["E4"],
                                "answer": "E4",
                                "targetNote": "E4",
                                "explanation": "A primeira linha da Clave de Sol corresponde à nota Mi (E4), duas teclas brancas à direita do Dó4.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000001014"),
                            "tipo": "note-reading",
                            "enunciado": "Esta nota ocupa o 2º espaço da pauta. Que nota é esta?",
                            "gabarito_dados": {
                                "ordem": 4,
                                "stave": ["A4"],
                                "options": ["Sol", "Lá", "Si", "Dó"],
                                "answer": "Lá",
                                "explanation": "Os 4 espaços da Clave de Sol formam a sequência Fá – Lá – Dó – Mi. O 2º espaço é o Lá (A4).",
                            },
                        },
                    ],
                },
                {
                    "id": uuid.UUID("00000000-0000-0000-0002-000000000102"),
                    "ordem": 2,
                    "titulo": "Figuras Rítmicas e Fórmulas de Compasso",
                    "conteudo_teorico": (
                        "Além de saber qual nota tocar (altura), precisamos saber por quanto tempo sustentá-la (duração). "
                        "Na escrita musical, o formato da figura indica sua duração relativa.\n\n"
                        "A Semibreve (cabeça aberta sem haste) é a figura de maior duração padrão. "
                        "A partir dela, cada nova figura dura exatamente metade da anterior:\n"
                        "• Semibreve = 4 tempos (no compasso 4/4)\n"
                        "• Mínima (cabeça aberta com haste) = 2 tempos (metade da semibreve)\n"
                        "• Semínima (cabeça preenchida com haste) = 1 tempo (a pulsação padrão de marcha)\n"
                        "• Colcheia (cabeça preenchida com haste e 1 colchete) = 1/2 tempo (duas colcheias cabem em 1 tempo).\n\n"
                        "💡 Fórmula de Compasso 4/4:\n"
                        "O número superior (4) indica que cada compasso comporta 4 tempos, e o número inferior (4) indica "
                        "que a Semínima é a figura que vale 1 tempo inteiro."
                    ),
                    "partitura_dados": {
                        "resumo": "Semibreve, mínima, semínima, colcheia e pulsação no compasso 4/4.",
                        "clef": "treble",
                        "notes": ["C4", "E4", "G4", "C5"],
                        "caption": "Pulsação de 4 notas no compasso quaternário: ouça a regularidade rítmica.",
                    },
                    "exercicios": [
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000001021"),
                            "tipo": "multiple-choice",
                            "enunciado": "Quantos tempos vale uma Mínima dentro de um compasso 4/4?",
                            "gabarito_dados": {
                                "ordem": 1,
                                "options": ["1 tempo", "2 tempos", "3 tempos", "4 tempos"],
                                "answer": "2 tempos",
                                "explanation": "A mínima vale metade da semibreve (4 ÷ 2 = 2 tempos no compasso 4/4).",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000001022"),
                            "tipo": "multiple-choice",
                            "enunciado": "Qual figura musical dura meio tempo (0,5) no compasso 4/4 e possui 1 colchete na haste?",
                            "gabarito_dados": {
                                "ordem": 2,
                                "options": ["Semibreve", "Semínima", "Colcheia", "Mínima"],
                                "answer": "Colcheia",
                                "explanation": "A colcheia vale metade de uma semínima; portanto, cabem 2 colcheias em 1 tempo.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000001023"),
                            "tipo": "multiple-choice",
                            "enunciado": "Quantas Semínimas são necessárias para preencher integralmente um compasso 4/4?",
                            "gabarito_dados": {
                                "ordem": 3,
                                "options": ["2 semínimas", "3 semínimas", "4 semínimas", "8 semínimas"],
                                "answer": "4 semínimas",
                                "explanation": "Como cada semínima vale 1 tempo no compasso 4/4, 4 semínimas somam os 4 tempos do compasso.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000001024"),
                            "tipo": "keyboard",
                            "enunciado": "Toque no piano virtual a nota Sol (G4) destacada na pauta.",
                            "gabarito_dados": {
                                "ordem": 4,
                                "stave": ["G4"],
                                "answer": "G4",
                                "targetNote": "G4",
                                "explanation": "Sol (G4) é a quinta tecla branca a partir do Dó4.",
                            },
                        },
                    ],
                },
            ],
        },
        {
            "id": uuid.UUID("00000000-0000-0000-0001-000000000002"),
            "ordem": 2,
            "titulo": "Unidade 2: Intervalos e Escalas",
            "descricao": "Compreenda tons, semitons, intervalos melódicos/harmônicos e a estrutura da Escala Maior.",
            "categoria": "Iniciante",
            "tag_topico": "Intervalos e Escalas",
            "aulas": [
                {
                    "id": uuid.UUID("00000000-0000-0000-0002-000000000201"),
                    "ordem": 1,
                    "titulo": "Tons, Semitons e Intervalos Fundamentais",
                    "conteudo_teorico": (
                        "Intervalo é a distância de altura entre duas notas musicais. A menor distância no sistema ocidental "
                        "é o Semitom (1 tecla adjacente no piano, seja branca ou preta), e a soma de 2 semitons forma 1 Tom inteiro.\n\n"
                        "No teclado do piano, entre duas teclas brancas vizinhas quase sempre existe uma tecla preta no meio (1 Tom de distância), "
                        "com apenas duas exceções naturais que possuem distância direta de 1 Semitom: entre Mi–Fá (E–F) e entre Si–Dó (B–C).\n\n"
                        "💡 Os intervalos mais importantes para construir acordes e melodias:\n"
                        "• Terça Menor = 3 semitons (ex: Dó a Mi bemol — sonoridade introspectiva/melancólica)\n"
                        "• Terça Maior = 4 semitons / 2 tons (ex: Dó a Mi — sonoridade brilhante e alegre)\n"
                        "• Quarta Justa = 5 semitons (ex: Dó a Fá)\n"
                        "• Quinta Justa = 7 semitons (ex: Dó a Sol — intervalo de grande estabilidade acústica)."
                    ),
                    "partitura_dados": {
                        "resumo": "Semitons naturais (Mi-Fá / Si-Dó), Terça Maior e Quinta Justa.",
                        "clef": "treble",
                        "notes": ["C4", "E4", "G4"],
                        "caption": "Dó4 a Mi4 forma uma Terça Maior (4 semitons); Dó4 a Sol4 forma uma Quinta Justa (7 semitons).",
                    },
                    "exercicios": [
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000002011"),
                            "tipo": "note-reading",
                            "enunciado": "Qual é o intervalo formado entre as notas Dó (C4) e Mi (E4) na pauta?",
                            "gabarito_dados": {
                                "ordem": 1,
                                "stave": ["C4", "E4"],
                                "options": ["Terça maior", "Terça menor", "Quarta justa", "Quinta justa"],
                                "answer": "Terça maior",
                                "explanation": "De Dó a Ré há 1 tom (2 semitons) e de Ré a Mi há mais 1 tom (2 semitons), somando 4 semitons = Terça Maior.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000002012"),
                            "tipo": "note-reading",
                            "enunciado": "Qual é o intervalo de 7 semitons formado entre Dó (C4) e Sol (G4)?",
                            "gabarito_dados": {
                                "ordem": 2,
                                "stave": ["C4", "G4"],
                                "options": ["Quarta justa", "Quinta justa", "Sexta maior", "Oitava"],
                                "answer": "Quinta justa",
                                "explanation": "De Dó a Sol percorremos 5 graus (Dó-Ré-Mi-Fá-Sol) totalizando 7 semitons: uma Quinta Justa.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000002013"),
                            "tipo": "multiple-choice",
                            "enunciado": "Quais são os dois únicos pares de notas naturais que possuem apenas 1 semitom de distância (sem tecla preta entre elas)?",
                            "gabarito_dados": {
                                "ordem": 3,
                                "options": [
                                    "Mi–Fá e Si–Dó",
                                    "Dó–Ré e Fá–Sol",
                                    "Ré–Mi e Sol–Lá",
                                    "Lá–Si e Dó–Ré",
                                ],
                                "answer": "Mi–Fá e Si–Dó",
                                "explanation": "No piano, todas as notas terminadas em 'i' (Mi e Si) passam diretamente para a próxima tecla branca com apenas 1 semitom.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000002014"),
                            "tipo": "keyboard",
                            "enunciado": "Partindo de Dó4, toque no piano a nota que forma uma Quarta Justa acima (Fá4).",
                            "gabarito_dados": {
                                "ordem": 4,
                                "stave": ["F4"],
                                "answer": "F4",
                                "targetNote": "F4",
                                "explanation": "Fá4 (1º espaço da pauta) está 5 semitons acima de Dó4, formando uma Quarta Justa.",
                            },
                        },
                    ],
                },
                {
                    "id": uuid.UUID("00000000-0000-0000-0002-000000000202"),
                    "ordem": 2,
                    "titulo": "A Estrutura da Escala Maior",
                    "conteudo_teorico": (
                        "Uma escala musical é uma sucessão ordenada de notas que serve como paleta sonora para compor e improvisar. "
                        "A mais importante da música ocidental é a Escala Maior Diatônica.\n\n"
                        "Toda Escala Maior segue exatamente a mesma fórmula de distâncias entre seus 7 graus:\n"
                        "Tom – Tom – Semitom – Tom – Tom – Tom – Semitom (T – T – S – T – T – T – S).\n\n"
                        "💡 Exemplo prático em Dó Maior:\n"
                        "Começando em Dó (C4) e tocando apenas as teclas brancas (Dó – Ré – Mi – Fá – Sol – Lá – Si – Dó), "
                        "os semitons naturais entre Mi–Fá (3º para 4º grau) e Si–Dó (7º para 8º grau) encaixam-se perfeitamente "
                        "na fórmula sem precisar de nenhum sustenido ou bemol!"
                    ),
                    "partitura_dados": {
                        "resumo": "Fórmula T-T-S-T-T-T-S e construção da escala de Dó Maior.",
                        "clef": "treble",
                        "notes": ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
                        "caption": "Os 7 graus da Escala de Dó Maior: repare que entre Mi-Fá (3º-4º) há 1 semitom natural.",
                    },
                    "exercicios": [
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000002021"),
                            "tipo": "multiple-choice",
                            "enunciado": "Em quais graus de uma Escala Maior ocorrem os semitons (S) da fórmula T–T–S–T–T–T–S?",
                            "gabarito_dados": {
                                "ordem": 1,
                                "options": [
                                    "Entre o 3º–4º graus e entre o 7º–8º graus",
                                    "Entre o 1º–2º graus e entre o 5º–6º graus",
                                    "Entre o 2º–3º graus e entre o 6º–7º graus",
                                    "Apenas entre o 4º–5º graus",
                                ],
                                "answer": "Entre o 3º–4º graus e entre o 7º–8º graus",
                                "explanation": "Em Dó maior, o 3º–4º grau é Mi–Fá e o 7º–8º grau é Si–Dó, justamente onde ficam os semitons.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000002022"),
                            "tipo": "builder",
                            "enunciado": "Monte a escala de Dó Maior ascendente clicando nas 7 notas em ordem.",
                            "gabarito_dados": {
                                "ordem": 2,
                                "sequence": ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
                                "answer": "C4,D4,E4,F4,G4,A4,B4",
                                "explanation": "A escala de Dó maior percorre todas as notas naturais: Dó, Ré, Mi, Fá, Sol, Lá e Si.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000002023"),
                            "tipo": "multiple-choice",
                            "enunciado": "Na escala de Sol Maior (G – A – B – C – D – E – F#), por que o Fá precisa receber um sustenido (F#)?",
                            "gabarito_dados": {
                                "ordem": 3,
                                "options": [
                                    "Para manter 1 Tom entre o 6º e 7º graus (E–F#) e 1 Semitom para o 8º grau (F#–G)",
                                    "Porque toda escala é obrigada a ter pelo menos duas teclas pretas",
                                    "Para transformar a escala em menor",
                                    "Apenas por convenção estética da partitura",
                                ],
                                "answer": "Para manter 1 Tom entre o 6º e 7º graus (E–F#) e 1 Semitom para o 8º grau (F#–G)",
                                "explanation": "O 7º grau (Sensível) precisa estar a meio tom da tônica (F# -> G) para respeitar a fórmula da Escala Maior.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000002024"),
                            "tipo": "keyboard",
                            "enunciado": "Toque no piano virtual o 7º grau (Sensível) da escala de Dó Maior: a nota Si (B4).",
                            "gabarito_dados": {
                                "ordem": 4,
                                "stave": ["B4"],
                                "answer": "B4",
                                "targetNote": "B4",
                                "explanation": "Si (B4, na 3ª linha da pauta) é a sensível de Dó Maior, localizada meio tom abaixo da tônica.",
                            },
                        },
                    ],
                },
            ],
        },
        {
            "id": uuid.UUID("00000000-0000-0000-0001-000000000003"),
            "ordem": 3,
            "titulo": "Unidade 3: Modos Gregos",
            "descricao": "Explore as atmosferas sonoras dos 7 modos gregos: Jônio, Dórico, Frígio, Lídio, Mixolídio, Eólio e Lócrio.",
            "categoria": "Intermediário",
            "tag_topico": "Modos Gregos",
            "aulas": [
                {
                    "id": uuid.UUID("00000000-0000-0000-0002-000000000301"),
                    "ordem": 1,
                    "titulo": "Modos com Terça Maior: Jônio, Lídio e Mixolídio",
                    "conteudo_teorico": (
                        "Os Modos Gregos nascem quando utilizamos as mesmas notas de uma escala maior, mas mudamos qual nota "
                        "funciona como centro gravitacional (tônica). Três desses modos possuem uma Terça Maior a partir da tônica, "
                        "apresentando caráter luminoso e aberto:\n\n"
                        "• 1º Grau — Modo Jônio (Dó a Dó): É a própria Escala Maior natural. Soa estável, alegre e conclusivo.\n"
                        "• 4º Grau — Modo Lídio (Fá a Fá nas teclas brancas): Igual à escala maior, porém com a 4ª Aumentada (#4). "
                        "Essa nota característica cria uma sensação espacial, sonhadora e cinematográfica.\n"
                        "• 5º Grau — Modo Mixolídio (Sol a Sol nas teclas brancas): Igual à escala maior, porém com a 7ª Menor (b7). "
                        "Muito usado no Rock, Blues, Baião nordestino e Funk.\n\n"
                        "💡 Dica de ouro: Para sentir o sabor de cada modo, compare-o sempre com a escala maior comum e observe a nota característica (#4 no Lídio; b7 no Mixolídio)."
                    ),
                    "partitura_dados": {
                        "resumo": "Modos Jônio (1º grau), Lídio (#4) e Mixolídio (b7).",
                        "clef": "treble",
                        "notes": ["F4", "G4", "A4", "B4", "C5"],
                        "caption": "Início do Modo Lídio em Fá: a nota Si natural (B4) forma a 4ª aumentada (#4) característica.",
                    },
                    "exercicios": [
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000003011"),
                            "tipo": "multiple-choice",
                            "enunciado": "Qual modo grego possui caráter maior e tem a Quarta Aumentada (#4) como nota característica?",
                            "gabarito_dados": {
                                "ordem": 1,
                                "options": ["Lídio", "Mixolídio", "Eólio", "Lócrio"],
                                "answer": "Lídio",
                                "explanation": "O modo Lídio (4º grau da escala maior) eleva o 4º grau em meio tom (#4), gerando um som flutuante e brilhante.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000003012"),
                            "tipo": "multiple-choice",
                            "enunciado": "O modo Mixolídio (muito presente no Blues, Rock e Baião) diferencia-se da escala maior por possuir:",
                            "gabarito_dados": {
                                "ordem": 2,
                                "options": [
                                    "A Sétima Menor (b7)",
                                    "A Terça Menor (b3)",
                                    "A Segunda Menor (b2)",
                                    "A Quinta Diminuta (b5)",
                                ],
                                "answer": "A Sétima Menor (b7)",
                                "explanation": "O Mixolídio parte do 5º grau da escala maior: mantém a 3ª maior, mas possui o 7º grau abaixado (b7).",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000003013"),
                            "tipo": "builder",
                            "enunciado": "Monte os 5 primeiros graus do modo Sol Mixolídio ascendente (G3 a D4).",
                            "gabarito_dados": {
                                "ordem": 3,
                                "sequence": ["G3", "A3", "B3", "C4", "D4"],
                                "answer": "G3,A3,B3,C4,D4",
                                "explanation": "Partindo de Sol (G3) pelas notas naturais temos Sol, Lá, Si, Dó e Ré.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000003014"),
                            "tipo": "keyboard",
                            "enunciado": "No modo de Fá Lídio, toque no piano a nota que representa a 4ª aumentada (#4): Si (B4).",
                            "gabarito_dados": {
                                "ordem": 4,
                                "stave": ["B4"],
                                "answer": "B4",
                                "targetNote": "B4",
                                "explanation": "Em Fá maior a 4ª justa seria Si bemol; no Fá Lídio usamos Si natural (B4), que é a #4.",
                            },
                        },
                    ],
                },
                {
                    "id": uuid.UUID("00000000-0000-0000-0002-000000000302"),
                    "ordem": 2,
                    "titulo": "Modos Menores: Dórico, Frígio, Eólio e Lócrio",
                    "conteudo_teorico": (
                        "Os quatro modos restantes possuem Terça Menor (b3) em relação à sua tônica, conferindo-lhes "
                        "sonoridades mais densas, suaves ou dramáticas:\n\n"
                        "• 2º Grau — Modo Dórico (Ré a Ré): É uma escala menor com a 6ª Maior (6M). Soa sofisticado e equilibrado (muito usado no Jazz, MPB e Santana).\n"
                        "• 3º Grau — Modo Frígio (Mi a Mi): Escala menor com a 2ª Menor (b2, apenas meio tom acima da tônica). Tem sonoridade espanhola/flamenca inconfundível.\n"
                        "• 6º Grau — Modo Eólio (Lá a Lá): É a nossa Escala Menor Natural (relativa menor da escala maior).\n"
                        "• 7º Grau — Modo Lócrio (Si a Si): É o único modo com a Quinta Diminuta (b5), gerando forte instabilidade.\n\n"
                        "💡 Resumo prático dos 7 graus de Dó Maior:\n"
                        "1º Dó Jônio | 2º Ré Dórico | 3º Mi Frígio | 4º Fá Lídio | 5º Sol Mixolídio | 6º Lá Eólio | 7º Si Lócrio."
                    ),
                    "partitura_dados": {
                        "resumo": "Modos Dórico (6M), Frígio (b2), Eólio (Menor Natural) e Lócrio (b5).",
                        "clef": "treble",
                        "notes": ["D4", "E4", "F4", "G4", "A4", "B4"],
                        "caption": "Modo Ré Dórico: escala menor (Ré–Mi–Fá) com a 6ª Maior característica na nota Si natural (B4).",
                    },
                    "exercicios": [
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000003021"),
                            "tipo": "multiple-choice",
                            "enunciado": "Qual modo começa no 2º grau da escala maior e se destaca por ser menor com Sexta Maior (6M)?",
                            "gabarito_dados": {
                                "ordem": 1,
                                "options": ["Jônio", "Dórico", "Frígio", "Lócrio"],
                                "answer": "Dórico",
                                "explanation": "O modo Dórico (de Ré a Ré nas teclas brancas) possui 3ª menor (Fá) e 6ª maior (Si natural).",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000003022"),
                            "tipo": "builder",
                            "enunciado": "Monte os 6 primeiros graus do modo Ré Dórico ascendente (D4 a B4).",
                            "gabarito_dados": {
                                "ordem": 2,
                                "sequence": ["D4", "E4", "F4", "G4", "A4", "B4"],
                                "answer": "D4,E4,F4,G4,A4,B4",
                                "explanation": "O Ré Dórico utiliza as notas naturais D4, E4, F4, G4, A4 e B4.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000003023"),
                            "tipo": "multiple-choice",
                            "enunciado": "Qual modo equivale exatamente à Escala Menor Natural e parte do 6º grau da escala maior?",
                            "gabarito_dados": {
                                "ordem": 3,
                                "options": ["Modo Eólio", "Modo Frígio", "Modo Lídio", "Modo Mixolídio"],
                                "answer": "Modo Eólio",
                                "explanation": "O 6º grau (Lá Eólio em relação a Dó maior) forma a escala menor natural relativa.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000003024"),
                            "tipo": "multiple-choice",
                            "enunciado": "Qual modo tem sonoridade flamenca/espanhola por possuir uma Segunda Menor (b2) logo após a tônica?",
                            "gabarito_dados": {
                                "ordem": 4,
                                "options": ["Modo Frígio", "Modo Jônio", "Modo Dórico", "Modo Lídio"],
                                "answer": "Modo Frígio",
                                "explanation": "No modo Mi Frígio (3º grau), a distância da tônica Mi para o 2º grau Fá é de apenas 1 semitom (b2).",
                            },
                        },
                    ],
                },
            ],
        },
        {
            "id": uuid.UUID("00000000-0000-0000-0001-000000000004"),
            "ordem": 4,
            "titulo": "Unidade 4: Acordes e Campos Harmônicos",
            "descricao": "Construa tríades maiores, menores e diminutas e domine as funções do Campo Harmônico Maior.",
            "categoria": "Praticante Empírico",
            "tag_topico": "Acordes e Campos Harmônicos",
            "aulas": [
                {
                    "id": uuid.UUID("00000000-0000-0000-0002-000000000401"),
                    "ordem": 1,
                    "titulo": "Formação de Tríades: Maiores e Menores",
                    "conteudo_teorico": (
                        "Enquanto a melodia acontece tocando uma nota após a outra, a Harmonia surge quando combinamos "
                        "três ou mais notas simultaneamente para formar um Acorde. O bloco fundamental da harmonia chama-se Tríade.\n\n"
                        "Uma tríade é construída empilhando terças (1º grau + 3º grau + 5º grau):\n"
                        "• Tríade Maior (ex: Dó Maior = C): Tônica (Dó) + Terça Maior (Mi, 4 semitons) + Quinta Justa (Sol, 7 semitons).\n"
                        "• Tríade Menor (ex: Lá Menor = Am): Tônica (Lá) + Terça Menor (Dó, 3 semitons) + Quinta Justa (Mi, 7 semitons).\n\n"
                        "💡 Observe a diferença: A 1ª e a 5ª notas permanecem estáveis; é justamente a Terça (3ª maior ou 3ª menor) "
                        "que define se o acorde soa maior (alegre/aberto) ou menor (suave/melancólico)."
                    ),
                    "partitura_dados": {
                        "resumo": "Empilhamento de terças: Tônica, Terça e Quinta em acordes maiores e menores.",
                        "clef": "treble",
                        "notes": ["C4", "E4", "G4"],
                        "caption": "Tríade de Dó Maior (Dó4 – Mi4 – Sol4): Tônica + Terça Maior + Quinta Justa.",
                    },
                    "exercicios": [
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000004011"),
                            "tipo": "multiple-choice",
                            "enunciado": "Quais notas formam a tríade de Dó Maior (C)?",
                            "gabarito_dados": {
                                "ordem": 1,
                                "options": [
                                    "Dó, Mi, Sol",
                                    "Dó, Mi bemol, Sol",
                                    "Dó, Fá, Lá",
                                    "Dó, Ré, Sol",
                                ],
                                "answer": "Dó, Mi, Sol",
                                "explanation": "Tríade de Dó Maior = Dó (tônica) + Mi (terça maior) + Sol (quinta justa).",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000004012"),
                            "tipo": "builder",
                            "enunciado": "Monte a tríade de Lá Menor (Am) em ordem ascendente (A3, C4, E4).",
                            "gabarito_dados": {
                                "ordem": 2,
                                "sequence": ["A3", "C4", "E4"],
                                "answer": "A3,C4,E4",
                                "explanation": "Lá menor é formada por Lá (tônica) + Dó (terça menor) + Mi (quinta justa).",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000004013"),
                            "tipo": "multiple-choice",
                            "enunciado": "Qual intervalo interno de uma tríade determina se o acorde é Maior ou Menor?",
                            "gabarito_dados": {
                                "ordem": 3,
                                "options": [
                                    "A Terça (3ª Maior = 4 semitons; 3ª Menor = 3 semitons)",
                                    "A Quinta Justa (7 semitons)",
                                    "A Oitava da nota fundamental",
                                    "O volume com que o acorde é tocado",
                                ],
                                "answer": "A Terça (3ª Maior = 4 semitons; 3ª Menor = 3 semitons)",
                                "explanation": "A terça é a nota modal do acorde: ela define o modo maior ou menor da tríade.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000004014"),
                            "tipo": "keyboard",
                            "enunciado": "Para completar a tríade de Fá Maior (Fá – Lá – ?), toque a Quinta Justa no piano (Dó5 ou Dó4: C4).",
                            "gabarito_dados": {
                                "ordem": 4,
                                "stave": ["C4"],
                                "answer": "C4",
                                "targetNote": "C4",
                                "explanation": "A tríade de Fá Maior é formada pelas notas Fá (1º), Lá (3ª maior) e Dó (5ª justa).",
                            },
                        },
                    ],
                },
                {
                    "id": uuid.UUID("00000000-0000-0000-0002-000000000402"),
                    "ordem": 2,
                    "titulo": "O Campo Harmônico Maior e Funções Harmônicas",
                    "conteudo_teorico": (
                        "Quando montamos uma tríade sobre cada uma das 7 notas da Escala Maior (usando apenas notas da própria escala), "
                        "obtemos o Campo Harmônico Maior. Ele mostra quais acordes 'combinam' naturalmente dentro de um tom!\n\n"
                        "Em qualquer tonalidade maior, a qualidade dos 7 acordes segue sempre esta regra fixa:\n"
                        "• Maiores (I, IV e V graus): Em Dó Maior -> I = C (Dó Maior), IV = F (Fá Maior), V = G (Sol Maior).\n"
                        "• Menores (ii, iii e vi graus): Em Dó Maior -> ii = Dm (Ré menor), iii = Em (Mi menor), vi = Am (Lá menor).\n"
                        "• Diminuto (vii° grau): Em Dó Maior -> vii° = B° (Si diminuto, com 3ª menor e 5ª diminuta).\n\n"
                        "💡 As 3 Funções Harmônicas:\n"
                        "1. Tônica (I, vi, iii): Sensação de repouso e casa (ex: C e Am).\n"
                        "2. Subdominante (IV, ii): Sensação de movimento/afastamento médio (ex: F e Dm).\n"
                        "3. Dominante (V, vii°): Sensação de tensão que pede resolução de volta para a Tônica (ex: G resolvendo em C)."
                    ),
                    "partitura_dados": {
                        "resumo": "Acordes I, ii, iii, IV, V, vi, vii° e funções Tônica, Subdominante e Dominante.",
                        "clef": "treble",
                        "notes": ["G3", "B3", "D4", "C4", "E4", "G4"],
                        "caption": "Cadência autêntica V -> I: acorde Dominante de Sol Maior (G) resolvendo na Tônica Dó Maior (C).",
                    },
                    "exercicios": [
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000004021"),
                            "tipo": "multiple-choice",
                            "enunciado": "No campo harmônico de Dó Maior, qual é o acorde do V grau (função Dominante)?",
                            "gabarito_dados": {
                                "ordem": 1,
                                "options": ["Fá maior", "Sol maior", "Lá menor", "Si diminuto"],
                                "answer": "Sol maior",
                                "explanation": "Contando 5 graus a partir de Dó (Dó-Ré-Mi-Fá-Sol), o V grau é Sol Maior (G), o acorde dominante.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000004022"),
                            "tipo": "multiple-choice",
                            "enunciado": "Quais graus do Campo Harmônico Maior geram sempre acordes Menores?",
                            "gabarito_dados": {
                                "ordem": 2,
                                "options": [
                                    "II, III e VI graus (em Dó: Dm, Em e Am)",
                                    "I, IV e V graus (em Dó: C, F e G)",
                                    "Apenas o VII grau",
                                    "Todos os graus ímpares",
                                ],
                                "answer": "II, III e VI graus (em Dó: Dm, Em e Am)",
                                "explanation": "No campo harmônico maior, os graus I, IV e V são maiores; os graus ii, iii e vi são menores; e o vii° é diminuto.",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000004023"),
                            "tipo": "builder",
                            "enunciado": "Monte a tríade do acorde Dominante de Dó Maior: Sol Maior ascendente (G3, B3, D4).",
                            "gabarito_dados": {
                                "ordem": 3,
                                "sequence": ["G3", "B3", "D4"],
                                "answer": "G3,B3,D4",
                                "explanation": "Sol Maior (G) é formado por Sol (tônica), Si (terça maior) e Ré (quinta justa).",
                            },
                        },
                        {
                            "id": uuid.UUID("00000000-0000-0000-0003-000000004024"),
                            "tipo": "multiple-choice",
                            "enunciado": "Qual acorde do campo harmônico de Dó Maior atua como relativo menor da Tônica (VI grau)?",
                            "gabarito_dados": {
                                "ordem": 4,
                                "options": ["Lá menor (Am)", "Ré menor (Dm)", "Mi menor (Em)", "Fá maior (F)"],
                                "answer": "Lá menor (Am)",
                                "explanation": "O VI grau (Lá menor) compartilha duas notas com Dó maior (Dó e Mi) e exerce função Tônica relativa.",
                            },
                        },
                    ],
                },
            ],
        },
    ]

    for u in unidades:
        modulo, _ = Modulo.objects.update_or_create(
            id=u["id"],
            defaults={
                "ordem": u["ordem"],
                "titulo": u["titulo"],
                "descricao": u["descricao"],
                "categoria": u["categoria"],
                "ativo": True,
            },
        )
        for a in u["aulas"]:
            aula, _ = Aula.objects.update_or_create(
                id=a["id"],
                defaults={
                    "modulo": modulo,
                    "ordem": a["ordem"],
                    "titulo": a["titulo"],
                    "conteudo_teorico": a["conteudo_teorico"],
                    "partitura_dados": a.get("partitura_dados"),
                    "ativa": True,
                },
            )
            for ex in a["exercicios"]:
                Exercicio.objects.update_or_create(
                    id=ex["id"],
                    defaults={
                        "aula": aula,
                        "tipo": ex["tipo"],
                        "enunciado": ex["enunciado"],
                        "gabarito_dados": ex["gabarito_dados"],
                        "tag_topico": u["tag_topico"],
                        "ativo": True,
                    },
                )


def reverse_seed(apps, schema_editor):
    Modulo = apps.get_model("learning", "Modulo")
    Modulo.objects.filter(
        id__in=[
            uuid.UUID("00000000-0000-0000-0001-000000000001"),
            uuid.UUID("00000000-0000-0000-0001-000000000002"),
            uuid.UUID("00000000-0000-0000-0001-000000000003"),
            uuid.UUID("00000000-0000-0000-0001-000000000004"),
        ]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("learning", "0001_initial"),
        ("exercises", "0001_initial"),
        ("gamification", "0001_initial"),
        ("progress", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_curriculum, reverse_seed),
    ]