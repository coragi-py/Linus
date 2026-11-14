import uuid
from django.db import migrations


def _ex(ordem, tipo, enunciado, answer, explanation, stave=None, options=None, target=None, seq=None):
    """Helper enxuto para estruturar o gabarito_dados compatível com VexFlow e VirtualPiano."""
    dados = {
        "ordem": ordem,
        "answer": answer,
        "explanation": explanation,
    }
    if stave is not None:
        dados["stave"] = stave
    if options is not None:
        dados["options"] = options
    if target is not None:
        dados["targetNote"] = target
    if seq is not None:
        dados["sequence"] = seq
    return {
        "tipo": tipo,
        "enunciado": enunciado,
        "gabarito_dados": dados,
    }


CURRICULUM_15_MODULOS = [
    # =========================================================================
    # CICLO 1: INICIANTE (MÓDULOS 1 A 5)
    # =========================================================================
    {
        "ordem": 1,
        "titulo": "Unidade 1: Leitura na Clave de Sol",
        "descricao": "Domine o pentagrama, a referência da Clave de Sol, o Dó Central e as notas nas linhas e espaços.",
        "categoria": "Iniciante",
        "tag_topico": "Leitura na Clave de Sol",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "A Pauta e as Notas nas Linhas e Espaços",
                "conteudo_teorico": (
                    "Segundo Bohumil Med (Teoria da Música, 5ª ed.), a notação musical ocidental utiliza a Pauta (ou Pentagrama): "
                    "um conjunto de 5 linhas horizontais, paralelas e equidistantes que formam 4 espaços entre si, sempre contados de baixo para cima.\n\n"
                    "Para determinar o nome e a altura exata das notas, colocamos uma Clave no início da pauta. "
                    "A Clave de Sol é assinada na 2ª linha: isso significa que toda nota desenhada sobre a segunda linha chama-se Sol (G4).\n\n"
                    "💡 Mnemônicos clássicos de leitura (Priolli, 2013):\n"
                    "• Notas nas 5 linhas (de baixo para cima): Mi (1ª) – Sol (2ª) – Si (3ª) – Ré (4ª) – Fá (5ª).\n"
                    "• Notas nos 4 espaços (de baixo para cima): Fá (1º) – Lá (2º) – Dó (3º) – Mi (4º).\n"
                    "📖 Fonte: MED, Bohumil. Teoria da Música, Cap. 2; PRIOLLI, Maria Luisa. Princípios Básicos da Música, Vol. 1."
                ),
                "partitura_dados": {
                    "resumo": "As 5 linhas e 4 espaços da pauta na Clave de Sol.",
                    "clef": "treble",
                    "notes": ["E4", "F4", "G4", "A4", "B4"],
                    "caption": "Notas da 1ª linha (Mi4) até a 3ª linha (Si4) alternando entre linha e espaço.",
                },
                "exercicios": [
                    _ex(1, "note-reading", "Qual nota está escrita na 2ª linha da pauta (referência da Clave de Sol)?", "Sol", "A espiral da Clave de Sol nasce na 2ª linha, determinando a nota Sol (G4).", stave=["G4"], options=["Mi", "Fá", "Sol", "Lá"]),
                    _ex(2, "note-reading", "Qual nota ocupa o 1º espaço da pauta na Clave de Sol?", "Fá", "Acima da 1ª linha (Mi4) está o 1º espaço, correspondente à nota Fá (F4).", stave=["F4"], options=["Dó", "Ré", "Fá", "Sol"]),
                    _ex(3, "keyboard", "Observe a nota na 1ª linha da pauta (Mi / E4) e toque-a no piano virtual.", "E4", "A 1ª linha da Clave de Sol é a nota Mi (E4), localizada antes do Fá.", stave=["E4"], target="E4"),
                    _ex(4, "note-reading", "Esta nota está no 2º espaço da Clave de Sol. Que nota é esta?", "Lá", "Os espaços formam a sequência Fá – Lá – Dó – Mi; o 2º espaço é o Lá (A4).", stave=["A4"], options=["Sol", "Lá", "Si", "Dó"]),
                ],
            },
            {
                "ordem": 2,
                "titulo": "O Dó Central e as Linhas Suplementares",
                "conteudo_teorico": (
                    "Quando precisamos escrever sons mais graves ou mais agudos do que as 5 linhas da pauta comportam, utilizamos pequenos traços "
                    "horizontais chamados Linhas Suplementares Superiores ou Inferiores (Lacerda, 2014).\n\n"
                    "A nota mais importante de referência no piano é o Dó Central (C4). Na Clave de Sol, ele fica exatamente na 1ª linha suplementar inferior "
                    "(um pequeno traço logo abaixo da primeira linha). No espaço imediatamente entre esse Dó e a 1ª linha (Mi) mora a nota Ré (D4).\n\n"
                    "💡 Referência no Piano Virtual:\n"
                    "O Dó Central (C4) fica sempre à esquerda do grupo de duas teclas pretas no centro do teclado.\n"
                    "📖 Fonte: LACERDA, Osvaldo. Compêndio de Teoria Elementar da Música, Cap. II."
                ),
                "partitura_dados": {
                    "resumo": "Dó Central (C4), Ré (D4) e linhas suplementares inferiores.",
                    "clef": "treble",
                    "notes": ["C4", "D4", "E4", "G4"],
                    "caption": "O Dó Central (C4) cortado pela 1ª linha suplementar inferior, seguido de Ré4, Mi4 e Sol4.",
                },
                "exercicios": [
                    _ex(1, "note-reading", "Qual nota está escrita na 1ª linha suplementar inferior da Clave de Sol?", "Dó", "O Dó Central (C4) é grafado sobre a primeira linha suplementar abaixo da pauta.", stave=["C4"], options=["Dó", "Ré", "Mi", "Si"]),
                    _ex(2, "keyboard", "Localize e toque no piano virtual o Dó Central (C4) exibido na partitura.", "C4", "O Dó4 é a tecla branca imediatamente à esquerda do par de teclas pretas centrais.", stave=["C4"], target="C4"),
                    _ex(3, "note-reading", "Qual nota fica encostada logo abaixo da 1ª linha da pauta (entre o Dó4 e o Mi4)?", "Ré", "No espaço suplementar inferior (entre C4 e E4) fica a nota Ré (D4).", stave=["D4"], options=["Dó", "Ré", "Fá", "Sol"]),
                    _ex(4, "builder", "Construa na pauta o tricorde inicial de Dó a Mi em ordem ascendente (C4, D4, E4).", "C4,D4,E4", "A sequência sobe grau a grau: Dó4 (linha suplementar), Ré4 (espaço inferior) e Mi4 (1ª linha).", stave=["C4", "D4", "E4"], seq=["C4", "D4", "E4"]),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Leitura Fluente na Oitava Central (C4 a B4)",
                "conteudo_teorico": (
                    "Combinando as linhas suplementares inferiores com as linhas e espaços do pentagrama, obtemos os 7 graus diatônicos "
                    "da oitava central: Dó (C4), Ré (D4), Mi (E4), Fá (F4), Sol (G4), Lá (A4) e Si (B4).\n\n"
                    "Observe na partitura que, a partir da 3ª linha (nota Si / B4), a haste das figuras musicais passa a ser desenhada "
                    "preferencialmente voltada para baixo, por equilíbrio visual no pentagrama (Med, 2017).\n\n"
                    "💡 Prática de leitura por pontos de ancoragem:\n"
                    "Memorize três âncoras visuais: Dó4 (linha suplementar), Sol4 (2ª linha) e Si4 (3ª linha central).\n"
                    "📖 Fonte: MED, Bohumil. Teoria da Música, 5ª ed., p. 19-24."
                ),
                "partitura_dados": {
                    "resumo": "Domínio das 7 notas diatônicas de Dó4 a Si4 na pauta e no teclado.",
                    "clef": "treble",
                    "notes": ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
                    "caption": "As sete notas naturais da oitava central na Clave de Sol.",
                },
                "exercicios": [
                    _ex(1, "note-reading", "Qual nota está escrita exatamente sobre a 3ª linha (linha central) da Clave de Sol?", "Si", "As linhas são Mi (1ª), Sol (2ª) e Si (3ª linha central = B4).", stave=["B4"], options=["Sol", "Lá", "Si", "Dó"]),
                    _ex(2, "keyboard", "Toque no piano virtual a nota Si (B4) mostrada na 3ª linha da partitura.", "B4", "Si4 (B4) fica à direita do grupo de três teclas pretas, logo antes do próximo Dó.", stave=["B4"], target="B4"),
                    _ex(3, "keyboard", "Toque no piano virtual a nota Lá (A4) escrita no 2º espaço da pauta.", "A4", "Lá4 (A4 = 440 Hz, nota de afinação universal) fica no 2º espaço da Clave de Sol.", stave=["A4"], target="A4"),
                    _ex(4, "builder", "Toque em sequência as notas das 3 primeiras linhas da Clave de Sol (Mi4, Sol4 e Si4).", "E4,G4,B4", "1ª linha = Mi (E4), 2ª linha = Sol (G4) e 3ª linha = Si (B4).", stave=["E4", "G4", "B4"], seq=["E4", "G4", "B4"]),
                ],
            },
        ],
    },
    {
        "ordem": 2,
        "titulo": "Unidade 2: Pulso, Ritmo e Compassos Simples",
        "descricao": "Compreenda a proporção das figuras de duração, pausas e as fórmulas de compasso 4/4, 3/4 e 2/4.",
        "categoria": "Iniciante",
        "tag_topico": "Pulso e Ritmo",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "Figuras Rítmicas: Semibreve, Mínima e Semínima",
                "conteudo_teorico": (
                    "Na música, o Ritmo é a organização do tempo em pulsações regulares. A duração relativa dos sons é representada "
                    "pelas Figuras de Valor (ou Figuras Rítmicas), que seguem uma divisão binária proporcional (Priolli, 2013):\n\n"
                    "• Semibreve (número representativo 1): Figura de maior duração no sistema moderno. Em compasso 4/4, dura 4 tempos.\n"
                    "• Mínima (número representativo 2): Vale metade da semibreve. Em 4/4, dura 2 tempos.\n"
                    "• Semínima (número representativo 4): Vale um quarto da semibreve (metade da mínima). Em 4/4, dura 1 tempo inteiro.\n\n"
                    "💡 Anatomia da figura:\n"
                    "A Semibreve possui apenas cabeça branca aberta; a Mínima adiciona a haste; a Semínima possui cabeça preenchida e haste.\n"
                    "📖 Fonte: PRIOLLI, Maria Luisa. Princípios Básicos da Música, Vol. 1, Cap. 1."
                ),
                "partitura_dados": {
                    "resumo": "Proporção matemática entre Semibreve (4t), Mínima (2t) e Semínima (1t).",
                    "clef": "treble",
                    "notes": ["C4", "E4", "G4", "C4"],
                    "caption": "Quatro pulsações estáveis marcando os tempos do compasso quaternário.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Quantos tempos vale uma Mínima dentro de um compasso quaternário 4/4?", "2 tempos", "A mínima equivale à metade da semibreve (4 ÷ 2 = 2 tempos).", stave=["C4", "G4"], options=["1 tempo", "2 tempos", "3 tempos", "4 tempos"]),
                    _ex(2, "multiple-choice", "Quantas Semínimas são necessárias para igualar a duração de 1 Semibreve?", "4 semínimas", "Na proporção binária, 1 semibreve divide-se em 2 mínimas ou 4 semínimas.", stave=["C4", "D4", "E4", "F4"], options=["2 semínimas", "3 semínimas", "4 semínimas", "8 semínimas"]),
                    _ex(3, "keyboard", "Marque o 1º tempo do compasso tocando a nota Dó Central (C4) indicada na pauta.", "C4", "A pulsação regular inicia no tempo forte com a nota Dó4.", stave=["C4"], target="C4"),
                    _ex(4, "builder", "Execute as 4 semínimas do compasso em ordem: Dó4, Ré4, Mi4 e Fá4.", "C4,D4,E4,F4", "Quatro semínimas preenchem os 4 tempos de um compasso 4/4.", stave=["C4", "D4", "E4", "F4"], seq=["C4", "D4", "E4", "F4"]),
                ],
            },
            {
                "ordem": 2,
                "titulo": "Subdivisão: Colcheias, Semicolcheias e Pausas",
                "conteudo_teorico": (
                    "Quando dividimos 1 tempo (uma semínima) em partes menores, surgem as figuras com colchetes (ou barras de ligação):\n\n"
                    "• Colcheia (fração 1/8): Possui 1 colchete na haste. Dura 1/2 tempo em 4/4 (cabem 2 colcheias em 1 tempo, ou 8 no compasso).\n"
                    "• Semicolcheia (fração 1/16): Possui 2 colchetes na haste. Dura 1/4 de tempo em 4/4 (cabem 4 semicolcheias em 1 tempo).\n\n"
                    "Para cada figura de som existe uma Pausa (silêncio) de idêntica duração (Med, 2017): a pausa da Semibreve fica pendurada "
                    "abaixo da 4ª linha, enquanto a pausa da Mínima apoia-se em cima da 3ª linha.\n"
                    "📖 Fonte: MED, Bohumil. Teoria da Música, 5ª ed., Cap. 3 e 4."
                ),
                "partitura_dados": {
                    "resumo": "Colcheia (1/2 tempo), Semicolcheia (1/4 de tempo) e Pausas musicais.",
                    "clef": "treble",
                    "notes": ["G4", "A4", "G4", "E4"],
                    "caption": "Movimento melódico subdividido entre Sol4, Lá4 e Mi4.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual figura musical possui 1 colchete e dura meio tempo (0,5) no compasso 4/4?", "Colcheia", "A colcheia (1/8) vale metade de uma semínima; duas colcheias formam 1 tempo.", stave=["G4", "A4"], options=["Semibreve", "Mínima", "Semínima", "Colcheia"]),
                    _ex(2, "multiple-choice", "Como diferenciamos visualmente a pausa de Semibreve da pausa de Mínima na pauta?", "A pausa de Semibreve fica abaixo da 4ª linha; a de Mínima fica sobre a 3ª linha", "Regra clássica: a semibreve (mais 'pesada', 4 tempos) pendura-se na 4ª linha; a mínima (2 tempos) descansa sobre a 3ª linha.", options=["A pausa de Semibreve fica abaixo da 4ª linha; a de Mínima fica sobre a 3ª linha", "São idênticas na partitura", "A pausa de Mínima tem dois colchetes", "A pausa de Semibreve ocupa a 1ª linha"]),
                    _ex(3, "keyboard", "Toque a nota Sol (G4) mostrada na pauta para iniciar a subdivisão.", "G4", "Sol4 está na 2ª linha da Clave de Sol.", stave=["G4"], target="G4"),
                    _ex(4, "multiple-choice", "Quantas Semicolcheias cabem dentro de 1 único tempo de Semínima?", "4 semicolcheias", "Como 1 semínima = 2 colcheias e cada colcheia = 2 semicolcheias, cabem 4 semicolcheias em 1 tempo.", options=["2 semicolcheias", "4 semicolcheias", "8 semicolcheias", "16 semicolcheias"]),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Fórmulas de Compasso Simples: 4/4, 3/4 e 2/4",
                "conteudo_teorico": (
                    "Compasso é o agrupamento de tempos em porções iguais, separadas por linhas verticais chamadas Barras de Compasso (Lacerda, 2014). "
                    "Nos Compassos Simples, a unidade de tempo é uma figura simples (divisível por 2):\n\n"
                    "• Numerador (número superior): Indica quantos tempos há em cada compasso (2 = Binário, 3 = Ternário, 4 = Quaternário).\n"
                    "• Denominador (número inferior): Indica qual figura vale 1 tempo (o número 4 representa a Semínima).\n\n"
                    "💡 Acentuação métrica natural:\n"
                    "• 2/4 (Marcha/Samba/Polca): 1º tempo Forte, 2º Fraco.\n"
                    "• 3/4 (Valsa): 1º tempo Forte, 2º Fraco, 3º Fraco.\n"
                    "• 4/4 (C): 1º Forte, 2º Fraco, 3º Meio-Forte, 4º Fraco.\n"
                    "📖 Fonte: LACERDA, Osvaldo. Compêndio de Teoria Elementar da Música, Cap. IV."
                ),
                "partitura_dados": {
                    "resumo": "Significado do numerador/denominador e acentuação em 2/4, 3/4 e 4/4.",
                    "clef": "treble",
                    "notes": ["C4", "E4", "G4"],
                    "caption": "Três tempos de um compasso ternário (3/4): Forte – Fraco – Fraco.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Na fórmula de compasso 3/4, o que indicam respectivamente o número 3 e o número 4?", "3 tempos por compasso, sendo que a Semínima (4) vale 1 tempo", "O numerador (3) define o compasso ternário e o denominador (4) define a semínima como unidade de tempo.", stave=["C4", "E4", "G4"], options=["3 tempos por compasso, sendo que a Semínima (4) vale 1 tempo", "4 tempos por compasso com 3 mínimas", "3 compassos de 4 semibreves", "Compasso composto de 3 colcheias"]),
                    _ex(2, "multiple-choice", "Qual é a acentuação métrica característica do compasso ternário 3/4 (como na valsa)?", "Forte – Fraco – Fraco", "Todo compasso ternário possui o 1º tempo Forte seguido de dois tempos Fracos.", options=["Forte – Fraco – Fraco", "Forte – Forte – Fraco", "Fraco – Forte – Fraco", "Forte – Meio-Forte – Forte"]),
                    _ex(3, "builder", "Toque os 3 tempos deste compasso ternário em ordem: Dó4, Mi4 e Sol4.", "C4,E4,G4", "Dó4 (1º tempo forte), Mi4 (2º tempo fraco) e Sol4 (3º tempo fraco).", stave=["C4", "E4", "G4"], seq=["C4", "E4", "G4"]),
                    _ex(4, "keyboard", "Toque a nota Fá (F4) que inicia o compasso na partitura.", "F4", "Fá4 está localizada no 1º espaço da Clave de Sol.", stave=["F4"], target="F4"),
                ],
            },
        ],
    },
    {
        "ordem": 3,
        "titulo": "Unidade 3: Clave de Fá e Registro Grave",
        "descricao": "Aprenda a ler notas na Clave de Fá (mão esquerda do piano) e integre o registro grave (C3 a B3).",
        "categoria": "Iniciante",
        "tag_topico": "Clave de Fá",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "A Clave de Fá na 4ª Linha e a Nota Fá3",
                "conteudo_teorico": (
                    "Para escrever as notas graves executadas pela mão esquerda no piano, no contrabaixo, no violoncelo ou no fagote, "
                    "utilizamos a Clave de Fá assinada na 4ª linha (Med, 2017).\n\n"
                    "Os dois pequenos pontos da Clave de Fá envolvem exatamente a 4ª linha da pauta (contada de baixo para cima), "
                    "determinando que toda nota escrita nessa 4ª linha chama-se Fá (F3 — uma oitava abaixo da oitava central).\n\n"
                    "💡 Mnemônico da Clave de Fá (de baixo para cima):\n"
                    "• 5 Linhas: Sol (1ª) – Si (2ª) – Ré (3ª) – Fá (4ª) – Lá (5ª).\n"
                    "• 4 Espaços: Lá (1º) – Dó (2º) – Mi (3º) – Sol (4º).\n"
                    "📖 Fonte: MED, Bohumil. Teoria da Música, 5ª ed., p. 20-23."
                ),
                "partitura_dados": {
                    "resumo": "Referência da Clave de Fá na 4ª linha (F3) e mapeamento das linhas e espaços.",
                    "clef": "bass",
                    "notes": ["C3", "E3", "F3", "G3", "A3"],
                    "caption": "Notas na Clave de Fá: Dó3 (2º espaço), Mi3 (3º espaço) e Fá3 (4ª linha).",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual linha da pauta fica entre os dois pontos da Clave de Fá e qual nota ela batiza?", "A 4ª linha, batizada com a nota Fá (F3)", "A Clave de Fá fixa a nota Fá3 sobre a 4ª linha do pentagrama.", options=["A 4ª linha, batizada com a nota Fá (F3)", "A 2ª linha, batizada com a nota Sol", "A 3ª linha, batizada com a nota Dó", "A 1ª linha, batizada com a nota Mi"]),
                    _ex(2, "keyboard", "Toque no registro grave do piano virtual (oitava 3) a nota Fá3 (F3), referência da Clave de Fá.", "F3", "F3 fica na primeira metade (esquerda) do piano virtual de duas oitavas.", stave=["F3"], target="F3"),
                    _ex(3, "multiple-choice", "Na Clave de Fá, quais são as notas das 5 linhas contadas de baixo para cima?", "Sol – Si – Ré – Fá – Lá", "Na Clave de Fá, as linhas sobem em terças a partir de Sol2: Sol – Si – Ré – Fá – Lá.", options=["Sol – Si – Ré – Fá – Lá", "Mi – Sol – Si – Ré – Fá", "Fá – Lá – Dó – Mi – Sol", "Dó – Mi – Sol – Si – Ré"]),
                    _ex(4, "keyboard", "Toque a nota Sol grave (G3) no piano virtual.", "G3", "Sol3 fica uma tecla branca acima do Fá3 na oitava grave do teclado.", stave=["G3"], target="G3"),
                ],
            },
            {
                "ordem": 2,
                "titulo": "Linhas e Espaços no Registro Grave (C3 a B3)",
                "conteudo_teorico": (
                    "O piano virtual do Linus abrange duas oitavas completas: a Oitava 3 (grave, de C3 a B3) e a Oitava 4 (central, de C4 a B4). "
                    "Na Clave de Fá, a nota Dó3 (C3) localiza-se confortavelmente no 2º espaço da pauta!\n\n"
                    "A partir do Dó3 (2º espaço), subindo grau a grau na Clave de Fá, temos:\n"
                    "• Dó3 (2º espaço) -> Ré3 (3ª linha) -> Mi3 (3º espaço) -> Fá3 (4ª linha) -> Sol3 (4º espaço) -> Lá3 (5ª linha) -> Si3 (acima da 5ª linha).\n\n"
                    "💡 Dominar a oitava 3 permite tocar linhas de baixo (walking bass) e a fundamental dos acordes com a mão esquerda.\n"
                    "📖 Fonte: PRIOLLI, Maria Luisa. Princípios Básicos da Música, Vol. 1, Cap. 3."
                ),
                "partitura_dados": {
                    "resumo": "Leitura e execução da oitava grave (C3 a B3) na Clave de Fá.",
                    "clef": "bass",
                    "notes": ["C3", "D3", "E3", "F3", "G3", "A3", "B3"],
                    "caption": "Escala de Dó3 a Si3 escrita na Clave de Fá.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Onde se localiza a nota Dó3 (C3) no pentagrama da Clave de Fá?", "No 2º espaço (de baixo para cima)", "Os espaços da Clave de Fá são Lá (1º), Dó (2º), Mi (3º) e Sol (4º).", options=["No 2º espaço (de baixo para cima)", "Na 1ª linha suplementar inferior", "Na 4ª linha", "No 4º espaço"]),
                    _ex(2, "keyboard", "Toque a primeira nota mais grave do piano virtual: o Dó3 (C3).", "C3", "C3 é a primeira tecla branca à extrema esquerda do nosso piano virtual.", stave=["C3"], target="C3"),
                    _ex(3, "keyboard", "Toque a nota Lá3 (A3), localizada na 5ª linha da Clave de Fá.", "A3", "A3 fica duas teclas brancas abaixo do Dó Central (C4).", stave=["A3"], target="A3"),
                    _ex(4, "builder", "Construa a linha de baixo subindo de Dó3 até Sol3 (C3, D3, E3, F3, G3).", "C3,D3,E3,F3,G3", "Pentacorde grave de Dó Maior na oitava 3: C3, D3, E3, F3 e G3.", stave=["C3", "D3", "E3", "F3", "G3"], seq=["C3", "D3", "E3", "F3", "G3"]),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Conectando as Duas Mãos através do Dó Central",
                "conteudo_teorico": (
                    "No piano, utilizamos o Sistema de Pauta Dupla (Grand Staff), que une a Clave deFá (embaixo, mão esquerda) e a Clave de Sol "
                    "(em cima, mão direita). O elo de ligação perfeito entre as duas claves é o Dó Central (C4) (Kostka & Payne, 2018)!\n\n"
                    "• Na Clave de Fá: o Dó Central (C4) fica na 1ª linha suplementar SUPERIOR (acima da 5ª linha, Lá3).\n"
                    "• Na Clave de Sol: o mesmo Dó Central (C4) fica na 1ª linha suplementar INFERIOR (abaixo da 1ª linha, Mi4).\n\n"
                    "💡 Assim, a escala sobe continuamente da mão esquerda (C3..B3) para a mão direita (C4..B4) sem nenhuma lacuna!\n"
                    "📖 Fonte: KOSTKA, Stefan; PAYNE, Dorothy. Tonal Harmony, 8th ed., Cap. 1."
                ),
                "partitura_dados": {
                    "resumo": "O Dó Central (C4) como ponto de encontro simétrico entre as Claves de Fá e Sol.",
                    "clef": "treble",
                    "notes": ["G3", "A3", "B3", "C4", "D4", "E4"],
                    "caption": "Passagem contínua do registro grave (G3, A3, B3) para o registro médio (C4, D4, E4).",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual nota funciona como elo simétrico entre a 1ª linha suplementar superior da Clave de Fá e a 1ª inferior da Clave de Sol?", "O Dó Central (C4)", "O Dó Central (C4) fica exatamente no meio do sistema de pauta dupla do piano.", options=["O Dó Central (C4)", "O Sol (G4)", "O Fá (F3)", "O Lá (A4)"]),
                    _ex(2, "builder", "Toque a passagem que cruza da oitava 3 para a oitava 4: Lá3, Si3, Dó4 e Ré4 (A3, B3, C4, D4).", "A3,B3,C4,D4", "A sequência conecta o final da oitava grave (A3, B3) ao início da oitava central (C4, D4).", stave=["A3", "B3", "C4", "D4"], seq=["A3", "B3", "C4", "D4"]),
                    _ex(3, "keyboard", "Toque a nota Si3 (B3), imediatamente vizinha à esquerda do Dó Central (C4).", "B3", "Si3 (B3) está meio tom abaixo do Dó Central (C4).", stave=["B3"], target="B3"),
                    _ex(4, "builder", "Toque em oitavas paralelas as notas Dó3 e Dó4 em sequência (C3, C4).", "C3,C4", "C3 e C4 possuem o mesmo nome de nota separados por 1 oitava (12 semitons).", stave=["C3", "C4"], seq=["C3", "C4"]),
                ],
            },
        ],
    },
    {
        "ordem": 4,
        "titulo": "Unidade 4: Tons, Semitons e Alterações",
        "descricao": "Domine os semitons naturais, as teclas pretas do piano, sustenidos (#), bemóis (b), bequadro e enarmonia.",
        "categoria": "Iniciante",
        "tag_topico": "Alterações e Acidentes",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "Semitons Naturais (Mi–Fá e Si–Dó) e Tons Inteiros",
                "conteudo_teorico": (
                    "No sistema temperado ocidental, a menor distância entre dois sons é o Semitom (ou meio tom). No teclado do piano, "
                    "1 semitom equivale à distância entre qualquer tecla e sua vizinha imediata (branca ou preta). Dois semitons somados formam 1 Tom (Med, 2017).\n\n"
                    "Olhando para as teclas brancas do piano, quase todos os pares vizinhos possuem uma tecla preta entre eles (distância de 1 Tom), "
                    "exceto dois pares que não possuem tecla preta intermediária e formam Semitons Naturais:\n"
                    "• Entre Mi e Fá (E – F)\n"
                    "• Entre Si e Dó (B – C).\n"
                    "📖 Fonte: MED, Bohumil. Teoria da Música, 5ª ed., Cap. 7."
                ),
                "partitura_dados": {
                    "resumo": "Onde ficam os semitons naturais Mi–Fá e Si–Dó no teclado e na pauta.",
                    "clef": "treble",
                    "notes": ["E4", "F4", "B4", "C4"],
                    "caption": "Pares de semitom diatônico natural: Mi4–Fá4 e Si4–Dó.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Quais são os dois únicos pares de notas naturais que possuem 1 semitom de distância (sem tecla preta entre elas)?", "Mi–Fá e Si–Dó", "As notas terminadas em 'i' (Mi e Si) distam apenas meio tom da nota natural seguinte (Fá e Dó).", stave=["E4", "F4"], options=["Mi–Fá e Si–Dó", "Dó–Ré e Fá–Sol", "Ré–Mi e Sol–Lá", "Lá–Si e Dó–Ré"]),
                    _ex(2, "multiple-choice", "Quantos semitons formam 1 Tom inteiro no sistema musical ocidental?", "2 semitons", "Um tom inteiro corresponde sempre à soma de 2 semitons.", options=["1 semitom", "2 semitons", "3 semitons", "4 semitons"]),
                    _ex(3, "builder", "Toque no piano o semitom natural ascendente entre a 1ª linha e o 1º espaço: Mi4 e Fá4 (E4, F4).", "E4,F4", "De E4 para F4 não há tecla preta: é um semitom diatônico natural.", stave=["E4", "F4"], seq=["E4", "F4"]),
                    _ex(4, "builder", "Toque o semitom natural entre a oitava 3 e a oitava 4: Si3 e Dó4 (B3, C4).", "B3,C4", "De B3 para C4 também passamos diretamente de uma tecla branca à outra (1 semitom).", stave=["B3", "C4"], seq=["B3", "C4"]),
                ],
            },
            {
                "ordem": 2,
                "titulo": "Sustenido (#), Bemol (b) e Bequadro nas Teclas Pretas",
                "conteudo_teorico": (
                    "Os Sinais de Alteração (ou Acidentes) modificam a altura de uma nota natural (Lacerda, 2014):\n\n"
                    "• Sustenido (#): Eleva a altura da nota em 1 semitom (para a tecla imediatamente à direita).\n"
                    "• Bemol (b): Abaixa a altura da nota em 1 semitom (para a tecla imediatamente à esquerda).\n"
                    "• Bequadro (♮): Anula o efeito de qualquer sustenido ou bemol anterior, devolvendo a nota ao seu estado natural.\n\n"
                    "💡 Na partitura, o acidente é escrito ANTES da cabeça da nota na mesma linha/espaço, mas na fala dizemos o nome depois (ex: 'Fá sustenido').\n"
                    "📖 Fonte: LACERDA, Osvaldo. Compêndio de Teoria Elementar da Música, Cap. VI."
                ),
                "partitura_dados": {
                    "resumo": "Ação do Sustenido (#), Bemol (b) e Bequadro nas teclas pretas do piano.",
                    "clef": "treble",
                    "notes": ["C4", "C#4", "D4", "F#4", "G4"],
                    "caption": "Passagem cromática por Dó4, Dó#4, Ré4, Fá#4 e Sol4.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual é a função do sinal de alteração chamado Bequadro?", "Anular o efeito de um sustenido ou bemol, restituindo a nota natural", "O bequadro cancela alterações anteriores e devolve a nota à sua altura natural.", options=["Anular o efeito de um sustenido ou bemol, restituindo a nota natural", "Subir a nota em 2 tons", "Abaixar a nota em 1 oitava", "Dobrar a duração rítmica da nota"]),
                    _ex(2, "keyboard", "Toque no piano virtual a tecla preta correspondente a Dó Sustenido (C#4), meio tom acima de C4.", "C#4", "C#4 é a primeira tecla preta do grupo de duas teclas pretas, logo à direita do Dó4.", stave=["C#4"], target="C#4"),
                    _ex(3, "keyboard", "Toque no piano virtual a nota Fá Sustenido (F#4), meio tom acima de Fá4.", "F#4", "F#4 é a primeira tecla preta do grupo de três teclas pretas.", stave=["F#4"], target="F#4"),
                    _ex(4, "builder", "Toque o movimento cromático ascendente: Fá4, Fá#4 e Sol4 (F4, F#4, G4).", "F4,F#4,G4", "Passamos da tecla branca F4 para a preta F#4 e chegamos à branca G4.", stave=["F4", "F#4", "G4"], seq=["F4", "F#4", "G4"]),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Enarmonia e Escala Cromática",
                "conteudo_teorico": (
                    "Chama-se Enarmonia o fenômeno em que duas notas possuem nomes e grafias diferentes na partitura, mas produzem "
                    "exatamente o mesmo som (a mesma tecla no piano) no sistema temperado (Med, 2017):\n\n"
                    "• Dó sustenido (C#) = Ré bemol (Db)\n"
                    "• Fá sustenido (F#) = Sol bemol (Gb)\n"
                    "• Sol sustenido (G#) = Lá bemol (Ab)\n"
                    "• Mi sustenido (E#) = Fá natural (F)\n\n"
                    "Quando tocamos todas as 12 notas (brancas e pretas) em sequência de semitom em semitom, executamos a Escala Cromática.\n"
                    "📖 Fonte: MED, Bohumil. Teoria da Música, 5ª ed., Cap. 8."
                ),
                "partitura_dados": {
                    "resumo": "Notas enarmônicas (C# = Db) e passagem pela escala cromática.",
                    "clef": "treble",
                    "notes": ["C4", "C#4", "D4", "D#4", "E4"],
                    "caption": "Trecho cromático de Dó4 a Mi4 avançando de semitom em semitom.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Como se chama a relação entre duas notas de nomes diferentes que produzem o mesmo som no piano (ex: Sol# e Láb)?", "Enarmonia", "Notas enarmônicas possuem grafias distintas mas mesma frequência sonora no temperamento igual.", stave=["G#4"], options=["Enarmonia", "Síncope", "Quiáltera", "Modulação"]),
                    _ex(2, "keyboard", "A nota Lá Bemol (Ab4) é enarmônica de Sol Sustenido (G#4). Toque essa tecla preta (G#4) no piano.", "G#4", "G#4 / Ab4 é a tecla preta do meio no grupo de três teclas pretas.", stave=["G#4"], target="G#4"),
                    _ex(3, "builder", "Execute o trecho cromático de 4 semitons: Dó4, Dó#4, Ré4, Ré#4 e Mi4.", "C4,C#4,D4,D#4,E4", "A escala cromática percorre todas as teclas brancas e pretas consecutivas.", stave=["C4", "C#4", "D4", "D#4", "E4"], seq=["C4", "C#4", "D4", "D#4", "E4"]),
                    _ex(4, "multiple-choice", "Quantos semitons (teclas brancas + pretas) existem dentro de uma oitava cromática completa antes de repetir a nota?", "12 semitons", "O sistema temperado ocidental divide a oitava em 12 semitons iguais (7 teclas brancas e 5 pretas).", options=["7 semitons", "8 semitons", "10 semitons", "12 semitons"]),
                ],
            },
        ],
    },
    {
        "ordem": 5,
        "titulo": "Unidade 5: Intervalos Musicais Fundamentais",
        "descricao": "Classifique e ouça segundas, terças, quartas, quintas, sextas, sétimas e oitavas na pauta e no teclado.",
        "categoria": "Iniciante",
        "tag_topico": "Intervalos Musicais",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "Segundas e Terças (Maiores e Menores)",
                "conteudo_teorico": (
                    "Intervalo é a distância de altura entre duas notas. Ele possui uma classificação numérica (quantidade de graus que abrange) "
                    "e uma qualificação (Maior, Menor, Justo, Aumentado ou Diminuto) baseada no número de semitons (Lacerda, 2014):\n\n"
                    "• Segunda Menor (2m): 1 semitom (ex: Mi4–Fá4).\n"
                    "• Segunda Maior (2M): 2 semitons / 1 tom (ex: Dó4–Ré4).\n"
                    "• Terça Menor (3m): 3 semitons / 1 tom e meio (ex: Ré4–Fá4 ou Lá3–Dó4 — base do acorde menor).\n"
                    "• Terça Maior (3M): 4 semitons / 2 tons (ex: Dó4–Mi4 — base do acorde maior).\n"
                    "📖 Fonte: LACERDA, Osvaldo. Compêndio de Teoria Elementar da Música, Cap. VII."
                ),
                "partitura_dados": {
                    "resumo": "Comparação auditiva e visual entre Terça Maior (4 semitons) e Terça Menor (3 semitons).",
                    "clef": "treble",
                    "notes": ["C4", "E4", "D4", "F4"],
                    "caption": "Dó4–Mi4 forma uma Terça Maior (4 semitons); Ré4–Fá4 forma uma Terça Menor (3 semitons).",
                },
                "exercicios": [
                    _ex(1, "note-reading", "Qual é o intervalo de 4 semitons (2 tons) formado entre Dó (C4) e Mi (E4) na pauta?", "Terça maior", "De Dó4 a Mi4 abrangemos 3 graus (Dó-Ré-Mi) e 4 semitons: Terça Maior.", stave=["C4", "E4"], options=["Segunda maior", "Terça menor", "Terça maior", "Quarta justa"]),
                    _ex(2, "note-reading", "Qual é o intervalo de 3 semitons (1 tom e meio) formado entre Ré (D4) e Fá (F4)?", "Terça menor", "De Ré4 a Mi4 há 1 tom e de Mi4 a Fá4 há 1 semitom, totalizando 3 semitons = Terça Menor.", stave=["D4", "F4"], options=["Terça menor", "Terça maior", "Quarta justa", "Quinta justa"]),
                    _ex(3, "keyboard", "Partindo de Dó4, toque no piano a nota que forma uma Terça Maior acima: Mi (E4).", "E4", "Mi4 está 4 semitons acima de Dó4.", stave=["C4", "E4"], target="E4"),
                    _ex(4, "builder", "Toque o intervalo melódico de Terça Menor a partir de Lá3: Lá3 e Dó4 (A3, C4).", "A3,C4", "De A3 para B3 há 1 tom e de B3 para C4 há 1 semitom (3 semitons = 3m).", stave=["A3", "C4"], seq=["A3", "C4"]),
                ],
            },
            {
                "ordem": 2,
                "titulo": "Intervalos Justos: Quartas, Quintas e Oitavas",
                "conteudo_teorico": (
                    "Enquanto segundas, terças, sextas e sétimas podem ser Maiores ou Menores, os intervalos de 1ª (Uníssono), 4ª, 5ª e 8ª "
                    "são classificados como Intervalos Justos devido à sua consonância acústica perfeita (Med, 2017):\n\n"
                    "• Quarta Justa (4J): 5 semitons / 2 tons e meio (ex: Dó4 a Fá4).\n"
                    "• Quinta Justa (5J): 7 semitons / 3 tons e meio (ex: Dó4 a Sol4 — pilar de estabilidade dos acordes).\n"
                    "• Oitava Justa (8J): 12 semitons / 6 tons (ex: Dó3 a Dó4).\n"
                    "• Exceção importante: entre Fá e Si natural há 6 semitons (3 tons inteiros), formando o famoso Trítono (4ª Aumentada / 5ª Diminuta).\n"
                    "📖 Fonte: MED, Bohumil. Teoria da Música, 5ª ed., Cap. 10."
                ),
                "partitura_dados": {
                    "resumo": "Quarta Justa (5 semitons), Quinta Justa (7 semitons) e Oitava Justa (12 semitons).",
                    "clef": "treble",
                    "notes": ["C4", "F4", "C4", "G4"],
                    "caption": "Dó4–Fá4 (Quarta Justa = 5 semitons) e Dó4–Sol4 (Quinta Justa = 7 semitons).",
                },
                "exercicios": [
                    _ex(1, "note-reading", "Qual é o intervalo de 7 semitons formado entre as notas Dó (C4) e Sol (G4) na pauta?", "Quinta justa", "De Dó4 a Sol4 percorremos 5 graus e 7 semitons: uma Quinta Justa (5J).", stave=["C4", "G4"], options=["Quarta justa", "Quinta justa", "Sexta maior", "Sétima maior"]),
                    _ex(2, "keyboard", "Partindo de Dó4, toque no piano a nota que forma uma Quarta Justa (5 semitons acima): Fá4 (F4).", "F4", "Fá4 está 2 tons e meio (5 semitons) acima de Dó4.", stave=["C4", "F4"], target="F4"),
                    _ex(3, "keyboard", "Partindo de Ré4, toque a nota que forma uma Quinta Justa (7 semitons acima): Lá4 (A4).", "A4", "De Ré4 a Lá4 temos 7 semitons, formando uma Quinta Justa.", stave=["D4", "A4"], target="A4"),
                    _ex(4, "multiple-choice", "Como se chama o intervalo de 6 semitons (3 tons inteiros) formado naturalmente entre Fá4 e Si4?", "Trítono (Quarta aumentada / Quinta diminuta)", "Três tons inteiros (6 semitons) formam o Trítono, intervalo de forte tensão harmônica.", stave=["F4", "B4"], options=["Trítono (Quarta aumentada / Quinta diminuta)", "Quarta justa", "Quinta justa", "Sexta menor"]),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Sextas, Sétimas e Inversão de Intervalos",
                "conteudo_teorico": (
                    "Completando os intervalos simples (dentro de 1 oitava), temos as Sextas e Sétimas (Guest, 2006):\n\n"
                    "• Sexta Menor (6m): 8 semitons (ex: Mi4–Dó5 ou Dó4–Láb4).\n"
                    "• Sexta Maior (6M): 9 semitons (ex: Dó4–Lá4).\n"
                    "• Sétima Menor (7m): 10 semitons (ex: Ré4–Dó5 ou Sol3–Fá4 — fundamental nos acordes dominantes V7).\n"
                    "• Sétima Maior (7M): 11 semitons (ex: Dó4–Si4 — fica a apenas 1 semitom da oitava!).\n\n"
                    "💡 Regra dos 9 na Inversão (Lacerda): Ao inverter um intervalo (subir a nota grave 1 oitava), a soma dá sempre 9 "
                    "(2ª vira 7ª; 3ª vira 6ª; 4ª vira 5ª), Maior vira Menor e Justo permanece Justo!\n"
                    "📖 Fonte: LACERDA, Osvaldo. Compêndio de Teoria Elementar da Música, Cap. VII; GUEST, Ian. Harmonia, Vol. 1."
                ),
                "partitura_dados": {
                    "resumo": "Sexta Maior (9 semitons), Sétima Menor (10s), Sétima Maior (11s) e Regra dos 9.",
                    "clef": "treble",
                    "notes": ["C4", "A4", "C4", "B4"],
                    "caption": "Dó4–Lá4 (Sexta Maior) e Dó4–Si4 (Sétima Maior).",
                },
                "exercicios": [
                    _ex(1, "note-reading", "Qual é o intervalo de 9 semitons formado entre Dó (C4) e Lá (A4) na pauta?", "Sexta maior", "De Dó4 a Lá4 abrangemos 6 graus (Dó-Ré-Mi-Fá-Sol-Lá) e 9 semitons: Sexta Maior.", stave=["C4", "A4"], options=["Quinta justa", "Sexta maior", "Sétima menor", "Oitava justa"]),
                    _ex(2, "note-reading", "Qual é o intervalo de 11 semitons formado entre Dó (C4) e Si (B4)?", "Sétima maior", "Si4 está a apenas 1 semitom de completar a oitava (11 semitons = Sétima Maior).", stave=["C4", "B4"], options=["Sexta maior", "Sétima menor", "Sétima maior", "Quarta justa"]),
                    _ex(3, "builder", "Toque o intervalo de Sétima Menor (10 semitons) muito usado em acordes dominantes: Sol3 e Fá4 (G3, F4).", "G3,F4", "De Sol3 até Fá4 temos 10 semitons (1 tom abaixo da oitava Sol4): uma Sétima Menor.", stave=["G3", "F4"], seq=["G3", "F4"]),
                    _ex(4, "multiple-choice", "Pela Regra dos 9 da inversão de intervalos, ao invertermos uma Terça Maior (3M), qual intervalo obtemos?", "Uma Sexta Menor (6m)", "9 - 3 = 6, e a qualidade Maior inverte-se para Menor (Terça Maior -> Sexta Menor).", options=["Uma Sexta Menor (6m)", "Uma Quinta Justa (5J)", "Uma Sétima Maior (7M)", "Uma Quarta Aumentada"]),
                ],
            },
        ],
    },

    # =========================================================================
    # CICLO 2: INTERMEDIÁRIO (MÓDULOS 6 A 10)
    # =========================================================================
    {
        "ordem": 6,
        "titulo": "Unidade 6: A Estrutura da Escala Maior",
        "descricao": "Domine a fórmula T–T–S–T–T–T–S, os nomes dos graus tonais/modais e a construção de Sol e Ré Maior.",
        "categoria": "Intermediário",
        "tag_topico": "Escala Maior",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "Fórmula da Escala Maior (T–T–S–T–T–T–S) em Dó",
                "conteudo_teorico": (
                    "Uma Escala Diatônica Maior é uma sucessão de 7 notas conjuntas divididas em dois tetracordes idênticos (Tom–Tom–Semitom) "
                    "separados por 1 Tom central (Med, 2017).\n\n"
                    "Isso resulta na fórmula universal da Escala Maior:\n"
                    "• Tom – Tom – Semitom – Tom – Tom – Tom – Semitom (T – T – S – T – T – T – S).\n\n"
                    "💡 Os semitons ocorrem sempre entre o 3º e 4º graus (em Dó Maior: Mi–Fá) e entre o 7º e 8º graus (em Dó Maior: Si–Dó).\n"
                    "📖 Fonte: MED, Bohumil. Teoria da Música, 5ª ed., Cap. 12."
                ),
                "partitura_dados": {
                    "resumo": "A fórmula universal T–T–S–T–T–T–S e os dois tetracordes de Dó Maior.",
                    "clef": "treble",
                    "notes": ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
                    "caption": "Escala de Dó Maior: semitons naturais entre 3º–4º (Mi–Fá) e 7º–8º graus.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Em quais graus de qualquer Escala Maior localizam-se os semitons (S) da fórmula T–T–S–T–T–T–S?", "Entre o 3º–4º graus e entre o 7º–8º graus", "Os dois tetracordes maiores terminam com semitom: do 3º para o 4º grau e do 7º para o 8º grau.", stave=["C4", "D4", "E4", "F4", "G4", "A4", "B4"], options=["Entre o 3º–4º graus e entre o 7º–8º graus", "Entre o 1º–2º graus e entre o 5º–6º graus", "Entre o 2º–3º graus e entre o 6º–7º graus", "Apenas entre o 4º–5º graus"]),
                    _ex(2, "builder", "Construa a escala de Dó Maior ascendente clicando nas 7 notas em ordem (C4 a B4).", "C4,D4,E4,F4,G4,A4,B4", "Dó4, Ré4, Mi4, Fá4, Sol4, Lá4 e Si4 seguem T-T-S-T-T-T-S apenas nas teclas brancas.", stave=["C4", "D4", "E4", "F4", "G4", "A4", "B4"], seq=["C4", "D4", "E4", "F4", "G4", "A4", "B4"]),
                    _ex(3, "keyboard", "Toque no piano virtual o 4º grau (Subdominante) da escala de Dó Maior: Fá4 (F4).", "F4", "Contando Dó (1º), Ré (2º), Mi (3º), o 4º grau é Fá4.", stave=["F4"], target="F4"),
                    _ex(4, "builder", "Monte o primeiro tetracorde de Dó Maior (os 4 primeiros graus: C4, D4, E4, F4).", "C4,D4,E4,F4", "O tetracorde inferior C4–D4–E4–F4 possui a estrutura Tom – Tom – Semitom.", stave=["C4", "D4", "E4", "F4"], seq=["C4", "D4", "E4", "F4"]),
                ],
            },
            {
                "ordem": 2,
                "titulo": "Os Graus da Escala e a Sensível (7º Grau)",
                "conteudo_teorico": (
                    "Cada um dos 7 graus da escala possui um nome funcional específico na teoria tonal (Lacerda, 2014; Kostka & Payne, 2018):\n\n"
                    "• I — Tônica (centro tonal de repouso absoluto)\n"
                    "• II — Supertônica\n"
                    "• III — Mediante (define o modo maior ou menor)\n"
                    "• IV — Subdominante (grau tonal de afastamento médio)\n"
                    "• V — Dominante (grau tonal de polaridade harmônica)\n"
                    "• VI — Superdominante (tônica da relativa menor)\n"
                    "• VII — Sensível (localizada meio tom abaixo da tônica, gera forte atração ascendente para resolver no I grau).\n"
                    "📖 Fonte: LACERDA, Osvaldo. Compêndio de Teoria Elementar da Música, Cap. VIII."
                ),
                "partitura_dados": {
                    "resumo": "Funções de Tônica (I), Mediante (III), Subdominante (IV), Dominante (V) e Sensível (VII).",
                    "clef": "treble",
                    "notes": ["C4", "F4", "G4", "B4"],
                    "caption": "Em Dó Maior: Tônica (Dó4), Subdominante (Fá4), Dominante (Sol4) e Sensível (Si4).",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Como é chamado o VII grau da Escala Maior, situado a apenas 1 semitom abaixo da Tônica?", "Sensível", "O VII grau chama-se Sensível por sua forte tendência melódica de resolver meio tom acima na Tônica.", stave=["B4", "C4"], options=["Sensível", "Mediante", "Supertônica", "Subdominante"]),
                    _ex(2, "keyboard", "Toque no piano virtual a Sensível (VII grau) da escala de Dó Maior: Si4 (B4).", "B4", "Em Dó Maior, o 7º grau é Si (B4).", stave=["B4"], target="B4"),
                    _ex(3, "multiple-choice", "Quais são os três Graus Tonais principais que estruturam a tonalidade?", "I (Tônica), IV (Subdominante) e V (Dominante)", "Os graus I, IV e V sintetizam os três pilares tonais da escala.", options=["I (Tônica), IV (Subdominante) e V (Dominante)", "II, III e VI graus", "Apenas o III e o VII graus", "I, II e III graus"]),
                    _ex(4, "builder", "Toque os 3 Graus Tonais de Dó Maior em ordem: Tônica (C4), Subdominante (F4) e Dominante (G4).", "C4,F4,G4", "Em Dó Maior: I = Dó4, IV = Fá4 e V = Sol4.", stave=["C4", "F4", "G4"], seq=["C4", "F4", "G4"]),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Escalas Maiores com Sustenidos: Sol e Ré Maior",
                "conteudo_teorico": (
                    "Quando construímos uma Escala Maior começando em qualquer nota diferente de Dó, precisamos aplicar acidentes (sustenidos ou bemóis) "
                    "para manter a fórmula T–T–S–T–T–T–S intacta (Guest, 2006):\n\n"
                    "• Escala de Sol Maior (G): Sol – Lá – Si – Dó – Ré – Mi – Fá#. O 7º grau precisa ser Fá Sustenido (F#) para ficar a 1 tom do Mi e a 1 semitom do Sol.\n"
                    "• Escala de Ré Maior (D): Ré – Mi – Fá# – Sol – Lá – Si – Dó#. Além do Fá# (3º grau), o 7º grau precisa ser Dó Sustenido (C#).\n\n"
                    "📖 Fonte: GUEST, Ian. Harmonia: Método Prático, Vol. 1, Cap. 2."
                ),
                "partitura_dados": {
                    "resumo": "Construção das escalas de Sol Maior (F#) e Ré Maior (F# e C#) no piano.",
                    "clef": "treble",
                    "notes": ["G3", "A3", "B3", "C4", "D4", "E4", "F#4"],
                    "caption": "Escala de Sol Maior de G3 a F#4: observe a tecla preta F#4 na sensível (7º grau).",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Na escala de Sol Maior, qual nota recebe sustenido para atuar como Sensível (7º grau)?", "Fá sustenido (F#)", "De Mi para F# há 1 tom, e de F# para Sol há 1 semitom, cumprindo a fórmula da Escala Maior.", stave=["F#4", "G4"], options=["Fá sustenido (F#)", "Dó sustenido (C#)", "Sol sustenido (G#)", "Ré sustenido (D#)"]),
                    _ex(2, "keyboard", "Toque no piano virtual a Sensível da escala de Sol Maior: Fá Sustenido (F#4).", "F#4", "F#4 é a primeira tecla preta do grupo de três teclas pretas.", stave=["F#4"], target="F#4"),
                    _ex(3, "builder", "Monte a escala de Sol Maior ascendente de G3 até G4 (G3, A3, B3, C4, D4, E4, F#4, G4).", "G3,A3,B3,C4,D4,E4,F#4,G4", "Sol Maior utiliza todas as teclas brancas exceto o 7º grau, que é F#4.", stave=["G3", "A3", "B3", "C4", "D4", "E4", "F#4", "G4"], seq=["G3", "A3", "B3", "C4", "D4", "E4", "F#4", "G4"]),
                    _ex(4, "builder", "Monte os 5 primeiros graus da escala de Ré Maior (D4, E4, F#4, G4, A4).", "D4,E4,F#4,G4,A4", "Em Ré Maior, a Terça Maior (3º grau) é Fá Sustenido (F#4).", stave=["D4", "E4", "F#4", "G4", "A4"], seq=["D4", "E4", "F#4", "G4", "A4"]),
                ],
            },
        ],
    },
    {
        "ordem": 7,
        "titulo": "Unidade 7: Ciclo das Quintas e Armaduras",
        "descricao": "Entenda a lógica matemática do Ciclo das Quintas, a ordem dos sustenidos/bemóis e as armaduras de clave.",
        "categoria": "Intermediário",
        "tag_topico": "Ciclo das Quintas",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "O Ciclo das Quintas e a Ordem dos Sustenidos",
                "conteudo_teorico": (
                    "Se partirmos de Dó Maior (0 acidentes) e subirmos de Quinta Justa em Quinta Justa, descobrimos todas as tonalidades "
                    "com sustenidos em ordem crescente de acidentes (Med, 2017):\n\n"
                    "• Dó (0) -> Sol (1#: Fá#) -> Ré (2#: Fá#, Dó#) -> Lá (3#: Fá#, Dó#, Sol#) -> Mi (4#) -> Si (5#) -> Fá# (6#) -> Dó# (7#).\n\n"
                    "💡 Ordem invariável dos 7 Sustenidos na Armadura de Clave:\n"
                    "Fá – Dó – Sol – Ré – Lá – Mi – Si (sempre em intervalos de 5ª justa!).\n"
                    "📖 Fonte: MED, Bohumil. Teoria da Música, 5ª ed., Cap. 13."
                ),
                "partitura_dados": {
                    "resumo": "Progressão por quintas (C -> G -> D -> A -> E) e ordem Fá–Dó–Sol–Ré–Lá–Mi–Si.",
                    "clef": "treble",
                    "notes": ["C4", "G4", "D4", "A4", "E4"],
                    "caption": "Tônicas do Ciclo das Quintas: Dó, Sol, Ré, Lá e Mi.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual é a ordem fixa de entrada dos 7 sustenidos nas armaduras de clave?", "Fá – Dó – Sol – Ré – Lá – Mi – Si", "Os sustenidos surgem sempre em quintas ascendentes a partir de Fá#: Fá – Dó – Sol – Ré – Lá – Mi – Si.", options=["Fá – Dó – Sol – Ré – Lá – Mi – Si", "Si – Mi – Lá – Ré – Sol – Dó – Fá", "Dó – Ré – Mi – Fá – Sol – Lá – Si", "Sol – Ré – Lá – Mi – Si – Fá – Dó"]),
                    _ex(2, "builder", "Toque no piano as 4 primeiras tônicas do Ciclo das Quintas: Dó4, Sol4, Ré4 e Lá4 (C4, G4, D4, A4).", "C4,G4,D4,A4", "C (0#), G (1#), D (2#) e A (3#) avançam em quintas justas.", stave=["C4", "G4", "D4", "A4"], seq=["C4", "G4", "D4", "A4"]),
                    _ex(3, "multiple-choice", "Quantos e quais sustenidos possui a escala de Lá Maior no Ciclo das Quintas?", "3 sustenidos: Fá#, Dó# e Sol#", "Seguindo a ordem Fá–Dó–Sol, Lá Maior possui 3 sustenidos (F#, C# e G#).", options=["3 sustenidos: Fá#, Dó# e Sol#", "1 sustenido: Fá#", "2 sustenidos: Fá# e Dó#", "4 sustenidos: Fá#, Dó#, Sol# e Ré#"]),
                    _ex(4, "keyboard", "Toque o 3º sustenido que surge na armadura de Lá Maior (a sensível Sol# / G#4).", "G#4", "Em Lá Maior, o 7º grau (sensível) é Sol Sustenido (G#4).", stave=["G#4"], target="G#4"),
                ],
            },
            {
                "ordem": 2,
                "titulo": "O Ciclo das Quartas e Escalas com Bemóis (Fá Maior)",
                "conteudo_teorico": (
                    "Quando caminhamos no sentido inverso (por Quartas Justas ascendentes ou Quintas descendentes a partir de Dó), "
                    "surgem as tonalidades com Bemóis (Lacerda, 2014):\n\n"
                    "• Dó (0) -> Fá Maior (1b: Sib) -> Si bemol Maior (2b: Sib, Mib) -> Mi bemol Maior (3b: Sib, Mib, Láb).\n\n"
                    "💡 Ordem invariável dos 7 Bemóis (exatamente o inverso dos sustenidos):\n"
                    "Si – Mi – Lá – Ré – Sol – Dó – Fá.\n"
                    "Em Fá Maior (F – G – A – Bb – C – D – E), o 4º grau precisa ser Si bemol (Bb4 / A#4 no teclado) para distar 1 semitom de Lá.\n"
                    "📖 Fonte: LACERDA, Osvaldo. Compêndio de Teoria Elementar da Música, Cap. IX."
                ),
                "partitura_dados": {
                    "resumo": "Ordem dos bemóis (Si–Mi–Lá–Ré–Sol–Dó–Fá) e escala de Fá Maior.",
                    "clef": "treble",
                    "notes": ["F4", "G4", "A4", "A#4", "C4"],
                    "caption": "Tetratacorde de Fá Maior: Fá4, Sol4, Lá4 e Si bemol (enarmônico A#4).",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual é a ordem fixa de entrada dos 7 bemóis nas armaduras de clave?", "Si – Mi – Lá – Ré – Sol – Dó – Fá", "A ordem dos bemóis é o espelho exato da ordem dos sustenidos: Si – Mi – Lá – Ré – Sol – Dó – Fá.", options=["Si – Mi – Lá – Ré – Sol – Dó – Fá", "Fá – Dó – Sol – Ré – Lá – Mi – Si", "Mi – Fá – Sol – Lá – Si – Dó – Ré", "Si – Lá – Sol – Fá – Mi – Ré – Dó"]),
                    _ex(2, "multiple-choice", "Qual é o único acidente presente na escala de Fá Maior?", "Si bemol (Bb)", "Para manter 1 semitom entre o 3º grau (Lá) e o 4º grau, Fá Maior utiliza Si bemol (Bb).", options=["Si bemol (Bb)", "Fá sustenido (F#)", "Mi bemol (Eb)", "Dó sustenido (C#)"]),
                    _ex(3, "keyboard", "Toque no piano virtual a tecla preta correspondente ao 4º grau de Fá Maior: Si bemol / Lá# (A#4).", "A#4", "A terceira tecla preta do grupo de três corresponde a Si bemol (Bb4 / A#4).", stave=["A#4"], target="A#4"),
                    _ex(4, "builder", "Monte os 4 primeiros graus da escala de Fá Maior (F4, G4, A4, A#4).", "F4,G4,A4,A#4", "O primeiro tetracorde de Fá Maior é Fá4 – Sol4 – Lá4 – Sib4 (A#4).", stave=["F4", "G4", "A4", "A#4"], seq=["F4", "G4", "A4", "A#4"]),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Identificando Tonalidades pela Armadura de Clave",
                "conteudo_teorico": (
                    "A Armadura de Clave é o conjunto de sustenidos ou bemóis colocado logo após a clave no início da pauta. "
                    "Existem duas regras práticas infalíveis para descobrir a tonalidade maior instantaneamente (Med, 2017):\n\n"
                    "1. Armaduras com Sustenidos (#): O último sustenido da armadura é sempre a Sensível (7º grau). Basta subir 1 semitom a partir dele "
                    "para encontrar o nome do tom! (Ex: Último # é Dó# -> subindo meio tom = Ré Maior).\n"
                    "2. Armaduras com Bemóis (b): O penúltimo bemol da armadura já é o próprio nome da tonalidade maior! (Com 1 bemol, Sib, o tom é Fá Maior).\n"
                    "📖 Fonte: MED, Bohumil. Teoria da Música, 5ª ed., p. 112-118."
                ),
                "partitura_dados": {
                    "resumo": "Regras práticas do último sustenido (+1 semitom) e do penúltimo bemol.",
                    "clef": "treble",
                    "notes": ["D4", "F#4", "A4", "D4"],
                    "caption": "Arpejo de Ré Maior (2 sustenidos na armadura: Fá# e Dó#).",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Se uma armadura de clave possui 2 sustenidos (Fá# e Dó#), qual é a tonalidade Maior correspondente?", "Ré Maior", "O último sustenido é Dó# (7º grau); subindo meio tom chegamos à tônica Ré Maior.", stave=["D4", "F#4", "A4"], options=["Sol Maior", "Ré Maior", "Lá Maior", "Mi Maior"]),
                    _ex(2, "multiple-choice", "Em uma armadura com bemóis (ex: Sib, Mib, Láb), como identificamos rapidamente a tonalidade Maior?", "Pelo penúltimo bemol da armadura (no exemplo, Mi bemol Maior)", "Em armaduras com 2 ou mais bemóis, o penúltimo bemol na ordem Si-Mi-Lá-Ré-Sol-Dó-Fá dá nome ao tom maior.", options=["Pelo penúltimo bemol da armadura (no exemplo, Mi bemol Maior)", "Subindo meio tom do último bemol", "Contando apenas as notas naturais", "Sempre será Fá Maior"]),
                    _ex(3, "keyboard", "Em uma partitura cujo último sustenido da armadura é Fá# (F#4), toque no piano a nota Tônica dessa tonalidade (G4).", "G4", "Meio tom acima do último sustenido (F#4) está a tônica Sol (G4 = Sol Maior).", stave=["G4"], target="G4"),
                    _ex(4, "builder", "Toque as notas do arpejo da tonalidade de 2 sustenidos (Ré Maior): Ré4, Fá#4 e Lá4 (D4, F#4, A4).", "D4,F#4,A4", "Tônica (D4), Terça Maior (F#4) e Quinta Justa (A4) de Ré Maior.", stave=["D4", "F#4", "A4"], seq=["D4", "F#4", "A4"]),
                ],
            },
        ],
    },
    {
        "ordem": 8,
        "titulo": "Unidade 8: Escalas Menores e Tonalidades Relativas",
        "descricao": "Compreenda a Escala Menor Natural, as relativas menores e as formas Harmônica e Melódica.",
        "categoria": "Intermediário",
        "tag_topico": "Escalas Menores",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "Escala Menor Natural (Fórmula T–S–T–T–S–T–T)",
                "conteudo_teorico": (
                    "Enquanto a Escala Maior possui sonoridade brilhante e expansiva, a Escala Menor apresenta caráter introspectivo e dramático, "
                    "definido principalmente pelo seu 3º grau menor (a 3 semitons da tônica) (Kostka & Payne, 2018).\n\n"
                    "A Escala Menor Natural (ou Primitiva) segue a fórmula:\n"
                    "• Tom – Semitom – Tom – Tom – Semitom – Tom – Tom (T – S – T – T – S – T – T).\n\n"
                    "💡 Os semitons na escala menor natural ficam entre o 2º–3º graus e entre o 5º–6º graus. "
                    "Em Lá Menor (A – B – C – D – E – F – G), os semitons naturais Si–Dó (2º–3º) e Mi–Fá (5º–6º) formam a escala sem nenhum acidente!\n"
                    "📖 Fonte: KOSTKA, Stefan; PAYNE, Dorothy. Tonal Harmony, 8th ed., Cap. 2."
                ),
                "partitura_dados": {
                    "resumo": "Fórmula T–S–T–T–S–T–T e construção de Lá Menor Natural nas teclas brancas.",
                    "clef": "treble",
                    "notes": ["A3", "B3", "C4", "D4", "E4", "F4", "G4"],
                    "caption": "Escala de Lá Menor Natural (A3 a G4): semitons entre 2º–3º (Si–Dó) e 5º–6º (Mi–Fá).",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Em quais graus ocorrem os semitons na Escala Menor Natural (T–S–T–T–S–T–T)?", "Entre o 2º–3º graus e entre o 5º–6º graus", "Em Lá menor natural: B–C (2º–3º) e E–F (5º–6º).", stave=["A3", "B3", "C4", "D4", "E4", "F4", "G4"], options=["Entre o 2º–3º graus e entre o 5º–6º graus", "Entre o 3º–4º graus e entre o 7º–8º graus", "Entre o 1º–2º graus e entre o 4º–5º graus", "Apenas entre o 7º–8º graus"]),
                    _ex(2, "builder", "Monte a escala de Lá Menor Natural ascendente de A3 até G4 (A3, B3, C4, D4, E4, F4, G4).", "A3,B3,C4,D4,E4,F4,G4", "Lá Menor Natural percorre as teclas brancas de Lá3 a Sol4.", stave=["A3", "B3", "C4", "D4", "E4", "F4", "G4"], seq=["A3", "B3", "C4", "D4", "E4", "F4", "G4"]),
                    _ex(3, "keyboard", "Toque no piano o 3º grau (Mediante menor) da escala de Lá Menor: a nota Dó4 (C4).", "C4", "Dó4 está 3 semitons acima de Lá3, caracterizando a terça menor da escala.", stave=["C4"], target="C4"),
                    _ex(4, "multiple-choice", "Qual intervalo entre o 1º e o 3º grau define que uma escala pertence ao modo Menor?", "Uma Terça Menor (3 semitons / 1 tom e meio)", "A distância de 3 semitons entre a tônica e a mediante é a assinatura modal menor.", options=["Uma Terça Menor (3 semitons / 1 tom e meio)", "Uma Terça Maior (4 semitons)", "Uma Quinta Diminuta", "Uma Sétima Maior"]),
                ],
            },
            {
                "ordem": 2,
                "titulo": "Tonalidades Relativas (Dó Maior e Lá Menor)",
                "conteudo_teorico": (
                    "Toda tonalidade Maior possui uma Tonalidade Relativa Menor que compartilha exatamente a mesma armadura de clave "
                    "(as mesmas notas, porém com outra tônica) (Med, 2017).\n\n"
                    "• Para achar a Relativa Menor de um tom Maior: basta buscar o seu 6º grau (ou descer 1 tom e meio / 3 semitons a partir da tônica maior).\n"
                    "  - Dó Maior (0 acidentes) <-> Lá Menor (6º grau de Dó)\n"
                    "  - Sol Maior (1#: Fá#) <-> Mi Menor (6º grau de Sol)\n"
                    "  - Fá Maior (1b: Sib) <-> Ré Menor (6º grau de Fá).\n"
                    "📖 Fonte: MED, Bohumil. Teoria da Música, 5ª ed., Cap. 14."
                ),
                "partitura_dados": {
                    "resumo": "Relação de 6º grau (-3 semitons) entre tons maiores e suas relativas menores.",
                    "clef": "treble",
                    "notes": ["C4", "A3", "G4", "E4"],
                    "caption": "Pares relativos: Dó Maior <-> Lá Menor e Sol Maior <-> Mi Menor.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual grau de uma Escala Maior dá origem à sua Tonalidade Relativa Menor?", "O VI grau (localizado 1 tom e meio abaixo da tônica maior)", "O 6º grau da escala maior é a tônica de sua relativa menor.", options=["O VI grau (localizado 1 tom e meio abaixo da tônica maior)", "O IV grau", "O V grau", "O II grau"]),
                    _ex(2, "keyboard", "Partindo de Sol4 (G4), toque no piano a tônica de sua Relativa Menor (3 semitons abaixo): Mi4 (E4).", "E4", "Sol Maior e Mi Menor são relativas e compartilham 1 sustenido (F#) na armadura.", stave=["E4"], target="E4"),
                    _ex(3, "keyboard", "Partindo de Fá4 (F4), toque no piano a tônica de sua Relativa Menor (3 semitons abaixo): Ré4 (D4).", "D4", "Fá Maior e Ré Menor são tonalidades relativas (ambas possuem Sib na armadura).", stave=["D4"], target="D4"),
                    _ex(4, "builder", "Monte os 5 primeiros graus de Mi Menor Natural (relativa de Sol Maior, usando F#4): E4, F#4, G4, A4, B4.", "E4,F#4,G4,A4,B4", "Mi Menor utiliza Fá Sustenido (F#4) no 2º grau para manter o semitom entre o 2º e 3º graus (F#4–G4).", stave=["E4", "F#4", "G4", "A4", "B4"], seq=["E4", "F#4", "G4", "A4", "B4"]),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Escalas Menor Harmônica e Menor Melódica",
                "conteudo_teorico": (
                    "Na Escala Menor Natural, o 7º grau fica a 1 tom inteiro da tônica (em Lá menor: Sol natural -> Lá), não possuindo força de Sensível. "
                    "Para criar a atração de semitom para a tônica (e formar o acorde dominante V7), os compositores criaram duas variantes (Guest, 2006):\n\n"
                    "• Escala Menor Harmônica: Eleva o 7º grau em 1 semitom (#7). Em Lá Menor: A – B – C – D – E – F – G#. "
                    "Entre o 6º grau (Fá) e o 7º elevado (Sol#) surge um intervalo exótico de 1 tom e meio (2ª aumentada = 3 semitons).\n"
                    "• Escala Menor Melódica: Eleva o 6º e o 7º graus (#6 e #7) na subida para suavizar a melodia (em Lá: F# e G#).\n"
                    "📖 Fonte: GUEST, Ian. Harmonia: Método Prático, Vol. 1, Cap. 4."
                ),
                "partitura_dados": {
                    "resumo": "O 7º grau elevado (#7) na Menor Harmônica e o 6º/7º elevados na Menor Melódica.",
                    "clef": "treble",
                    "notes": ["A3", "B3", "C4", "D4", "E4", "F4", "G#4"],
                    "caption": "Escala de Lá Menor Harmônica: destaque para a sensível Sol Sustenido (G#4).",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual alteração transforma a Escala Menor Natural em uma Escala Menor Harmônica?", "A elevação do 7º grau em 1 semitom (criando a Sensível)", "Subir o 7º grau em meio tom (ex: Sol -> Sol# em Lá menor) cria a sensível harmônica.", stave=["F4", "G#4", "A4"], options=["A elevação do 7º grau em 1 semitom (criando a Sensível)", "O abaixamento do 3º grau", "A retirada do 5º grau", "A elevação do 2º grau"]),
                    _ex(2, "keyboard", "Toque no piano virtual a Sensível (7º grau elevado) de Lá Menor Harmônica: Sol Sustenido (G#4).", "G#4", "G#4 fica a apenas 1 semitom de Lá4, gerando forte atração tonal.", stave=["G#4"], target="G#4"),
                    _ex(3, "builder", "Monte o tetracorde superior de Lá Menor Harmônica (E4, F4, G#4, A4).", "E4,F4,G#4,A4", "Observe o salto característico de 3 semitons entre F4 e G#4 resolvendo em A4.", stave=["E4", "F4", "G#4", "A4"], seq=["E4", "F4", "G#4", "A4"]),
                    _ex(4, "multiple-choice", "Por que a Escala Menor Melódica eleva tanto o 6º quanto o 7º grau no movimento ascendente?", "Para eliminar o salto de 2ª aumentada (1 tom e meio) entre o 6º e o 7º grau da menor harmônica", "Ao elevar o 6º grau (Fá#) junto com o 7º (Sol#), a passagem melódica fica fluida por tons e semitons.", options=["Para eliminar o salto de 2ª aumentada (1 tom e meio) entre o 6º e o 7º grau da menor harmônica", "Para ter apenas 5 notas", "Para anular a tônica", "Para igualar a escala cromática"]),
                ],
            },
        ],
    },
    {
        "ordem": 9,
        "titulo": "Unidade 9: Divisão Rítmica Avançada e Expressão",
        "descricao": "Domine o ponto de aumento, ligaduras, compassos compostos (6/8), síncope, andamento e dinâmica.",
        "categoria": "Intermediário",
        "tag_topico": "Ritmo Avançado",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "Ponto de Aumento e Ligadura de Prolongamento",
                "conteudo_teorico": (
                    "Existem dois recursos fundamentais na notação tradicional para ampliar a duração de uma figura musical (Priolli, 2013):\n\n"
                    "• Ponto de Aumento: Um pequeno ponto colocado à direita da cabeça da nota que acrescenta a ela metade do seu próprio valor.\n"
                    "  - Mínima pontuada = 2 + 1 = 3 tempos (em 4/4 ou 3/4).\n"
                    "  - Semínima pontuada = 1 + 0,5 = 1 tempo e meio (equivalente a 3 colcheias).\n"
                    "• Ligadura de Valor (ou Prolongamento): Linha curva que une duas notas de MESMA altura, somando suas durações (inclusive atravessando a barra de compasso).\n"
                    "📖 Fonte: PRIOLLI, Maria Luisa. Princípios Básicos da Música, Vol. 1, Cap. 5."
                ),
                "partitura_dados": {
                    "resumo": "Cálculo do Ponto de Aumento (+50% do valor) e Ligadura de Prolongamento.",
                    "clef": "treble",
                    "notes": ["C4", "E4", "G4"],
                    "caption": "Três notas sustentadas ilustrando o preenchimento de um compasso ternário.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual é o efeito exato de um Ponto de Aumento colocado à direita de uma figura musical?", "Aumenta a duração da figura em metade (50%) do seu valor original", "O ponto simples soma à nota metade do valor que ela já possui.", options=["Aumenta a duração da figura em metade (50%) do seu valor original", "Dobra o valor da figura (100%)", "Diminui o tempo pela metade", "Aumenta o volume da nota"]),
                    _ex(2, "multiple-choice", "Quantos tempos dura uma Mínima Pontuada em um compasso 4/4?", "3 tempos", "A mínima vale 2 tempos; seu ponto vale metade de 2 (1 tempo). Logo, 2 + 1 = 3 tempos.", options=["2 tempos e meio", "3 tempos", "4 tempos", "1 tempo e meio"]),
                    _ex(3, "multiple-choice", "Para que uma linha curva entre duas notas seja uma Ligadura de Prolongamento (somando os tempos), as notas devem ter:", "Exatamente a mesma altura (o mesmo nome/tecla)", "Se as notas tiverem alturas diferentes, a curva indica legato (articulação/fraseado), e não soma de valor.", options=["Exatamente a mesma altura (o mesmo nome/tecla)", "Alturas diferentes em oitavas distintas", "Sustenidos diferentes", "Pausas entre elas"]),
                    _ex(4, "keyboard", "Toque no piano virtual a nota Sol4 (G4) sustentada na pauta.", "G4", "Sol4 fica na 2ª linha da Clave de Sol.", stave=["G4"], target="G4"),
                ],
            },
            {
                "ordem": 2,
                "titulo": "Compassos Compostos (6/8) e Quiálteras (Tercinas)",
                "conteudo_teorico": (
                    "Nos Compassos Compostos (como 6/8, 9/8 e 12/8), cada tempo tem subdivisão TERNÁRIA (divide-se naturalmente em 3 partes iguais), "
                    "e a unidade de tempo é uma figura pontuada (Med, 2017):\n\n"
                    "• Compasso 6/8: É um compasso BINÁRIO Composto (possui 2 tempos principais fortes/fracos), onde cada tempo vale uma Semínima Pontuada "
                    "(dividida em 3 colcheias, totalizando 6 colcheias por compasso).\n"
                    "• Tercina (Quiáltera): Ocorre quando inserimos 3 figuras iguais dentro de um tempo de compasso simples onde normalmente caberiam apenas 2.\n"
                    "📖 Fonte: MED, Bohumil. Teoria da Música, 5ª ed., Cap. 16 e 18."
                ),
                "partitura_dados": {
                    "resumo": "Subdivisão ternária no compasso Binário Composto 6/8 e conceito de Tercinas.",
                    "clef": "treble",
                    "notes": ["C4", "E4", "G4", "C4", "E4", "G4"],
                    "caption": "Dois grupos de 3 colcheias (C4–E4–G4) formando os 2 tempos compostos do 6/8.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Como é classificado metricamente o compasso 6/8?", "Binário Composto (2 tempos, cada um subdividido em 3 colcheias)", "Em 6/8 temos 2 pulsações de semínima pontuada (6 ÷ 3 = 2 tempos compostos).", stave=["C4", "E4", "G4"], options=["Binário Composto (2 tempos, cada um subdividido em 3 colcheias)", "Sextenário Simples de 6 semibreves", "Ternário Simples", "Quaternário Composto"]),
                    _ex(2, "builder", "Toque o arpejo de 3 notas que preenche o 1º tempo composto de um 6/8: Dó4, Mi4 e Sol4 (C4, E4, G4).", "C4,E4,G4", "Três colcheias (C4-E4-G4) agrupam-se em 1 tempo de semínima pontuada no 6/8.", stave=["C4", "E4", "G4"], seq=["C4", "E4", "G4"]),
                    _ex(3, "multiple-choice", "Como se chama o grupo rítmico em que 3 figuras ocupam o espaço de 2 figuras em um compasso simples (grafado com um '3')?", "Tercina (Quiáltera)", "A tercina é a quiáltera mais comum, dividindo em 3 partes iguais um tempo normalmente binário.", options=["Tercina (Quiáltera)", "Fermata", "Anacruse", "Bequadro"]),
                    _ex(4, "keyboard", "Toque a nota Lá4 (A4) no piano virtual.", "A4", "Lá4 ocupa o 2º espaço da Clave de Sol.", stave=["A4"], target="A4"),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Contratempo, Síncope, Andamento e Dinâmica",
                "conteudo_teorico": (
                    "O balanço rítmico da música brasileira (Samba, Choro, Bossa Nova) e do Jazz nasce do deslocamento dos acentos métricos (Lacerda, 2014):\n\n"
                    "• Síncope: Ocorre quando um som começa em um tempo FRACO (ou parte fraca do tempo) e se prolonga sobre o tempo FORTE seguinte.\n"
                    "• Contratempo: Ocorre quando os tempos fortes são preenchidos por pausas (silêncio) e as notas soam apenas nos tempos fracos.\n"
                    "• Andamento e Dinâmica: O andamento indica a velocidade do pulso em BPM (Adagio = lento, Andante = moderado, Allegro = rápido), "
                    "enquanto a dinâmica indica a intensidade/volume: p (piano = suave), f (forte), crescendo e diminuendo.\n"
                    "📖 Fonte: LACERDA, Osvaldo. Compêndio de Teoria Elementar da Música, Cap. V e XI."
                ),
                "partitura_dados": {
                    "resumo": "Síncope, Contratempo, indicações de Andamento (BPM) e Dinâmica (p, mf, f).",
                    "clef": "treble",
                    "notes": ["E4", "G4", "A4", "G4"],
                    "caption": "Desenho melódico com variação expressiva entre Mi4, Sol4 e Lá4.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Quando uma nota é atacada em um tempo fraco (ou parte fraca do tempo) e prolonga-se sobre o tempo forte seguinte, temos uma:", "Síncope", "A síncope desloca a acentuação natural ao articular na parte fraca e sustentar sobre a parte forte.", options=["Síncope", "Escala Enarmônica", "Armadura de Clave", "Clave de Dó"]),
                    _ex(2, "multiple-choice", "Na notação tradicional de Dinâmica (intensidade), o que significam as abreviaturas 'p' e 'f'?", "p = piano (suave/fraco) e f = forte (intenso)", "Do italiano piano (suave) e forte (intenso), razão pela qual o instrumento se chama Pianoforte.", options=["p = piano (suave/fraco) e f = forte (intenso)", "p = pausa e f = fim", "p = rápido e f = lento", "p = primeira oitava e f = fá"]),
                    _ex(3, "builder", "Toque a frase melódica expressiva na pauta: Mi4, Sol4, Lá4 e Sol4 (E4, G4, A4, G4).", "E4,G4,A4,G4", "Sequência melódica E4 – G4 – A4 – G4.", stave=["E4", "G4", "A4", "G4"], seq=["E4", "G4", "A4", "G4"]),
                    _ex(4, "multiple-choice", "Qual termo italiano de Andamento indica uma execução rápida e viva (tipicamente entre 120 e 156 BPM)?", "Allegro", "Adagio é lento, Andante é passo caminhante moderado, e Allegro indica andamento rápido e brilhante.", options=["Allegro", "Adagio", "Largo", "Lento"]),
                ],
            },
        ],
    },
    {
        "ordem": 10,
        "titulo": "Unidade 10: Modos Gregos (Jônio a Lócrio)",
        "descricao": "Domine os 7 modos gregos, suas fórmulas intervalares e suas notas características na prática.",
        "categoria": "Intermediário",
        "tag_topico": "Modos Gregos",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "Modos com Terça Maior: Jônio, Lídio (#4) e Mixolídio (b7)",
                "conteudo_teorico": (
                    "Segundo Ian Guest (Harmonia: Método Prático) e Almir Chediak, os 7 Modos Gregos surgem ao tomarmos cada grau da escala maior "
                    "como centro modal (tônica). Três modos possuem Terça Maior (3M), apresentando sonoridade luminosa:\n\n"
                    "• I Grau — Modo Jônio (ex: Dó a Dó): É a própria Escala Maior natural (1, 2, 3, 4, 5, 6, 7M).\n"
                    "• IV Grau — Modo Lídio (ex: Fá a Fá nas teclas brancas): Escala maior com a Quarta Aumentada (#4). Sonoridade flutuante e espacial.\n"
                    "• V Grau — Modo Mixolídio (ex: Sol a Sol nas teclas brancas): Escala maior com a Sétima Menor (b7). Típico do Blues, Rock e Baião nordestino.\n"
                    "📖 Fonte: GUEST, Ian. Harmonia: Método Prático, Vol. 2; CHEDIAK, Almir. Harmonia & Improvisação, Vol. 1."
                ),
                "partitura_dados": {
                    "resumo": "Modos maiores: Jônio (natural), Lídio (nota característica #4) e Mixolídio (b7).",
                    "clef": "treble",
                    "notes": ["F4", "G4", "A4", "B4", "C4"],
                    "caption": "Fá Lídio: a nota Si natural (B4) forma a 4ª aumentada (#4) em relação a Fá.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual modo grego de terça maior possui a Quarta Aumentada (#4) como nota característica?", "Lídio", "O modo Lídio (IV grau) destaca-se pela #4, que elimina a tensão da 4ª justa e cria brilho cinematográfico.", stave=["F4", "G4", "A4", "B4"], options=["Lídio", "Mixolídio", "Dórico", "Frígio"]),
                    _ex(2, "multiple-choice", "O modo Mixolídio (muito usado no Baião, Blues e Rock) diferencia-se da escala maior (Jônio) por possuir:", "A Sétima Menor (b7)", "Partindo do V grau (Sol a Sol nas brancas), o 7º grau é Fá natural (b7).", stave=["G3", "A3", "B3", "C4", "D4", "E4", "F4"], options=["A Sétima Menor (b7)", "A Terça Menor (b3)", "A Segunda Menor (b2)", "A Quinta Diminuta (b5)"]),
                    _ex(3, "builder", "Monte os 5 primeiros graus do modo Sol Mixolídio ascendente (G3, A3, B3, C4, D4).", "G3,A3,B3,C4,D4", "Sol Mixolídio parte de G3 percorrendo as notas naturais G3, A3, B3, C4 e D4.", stave=["G3", "A3", "B3", "C4", "D4"], seq=["G3", "A3", "B3", "C4", "D4"]),
                    _ex(4, "keyboard", "No modo Fá Lídio, toque no piano a nota característica que forma a 4ª aumentada (#4): Si4 (B4).", "B4", "Em Fá maior a 4ª justa seria Sib; em Fá Lídio tocamos Si natural (B4 = #4).", stave=["B4"], target="B4"),
                ],
            },
            {
                "ordem": 2,
                "titulo": "Modos Menores: Dórico (6M), Frígio (b2) e Eólio",
                "conteudo_teorico": (
                    "Entre os modos que possuem Terça Menor (b3), três são amplamente usados na composição e improvisação (Chediak, 2011):\n\n"
                    "• VI Grau — Modo Eólio (ex: Lá a Lá): É a nossa Escala Menor Natural (1, 2, b3, 4, 5, b6, b7).\n"
                    "• II Grau — Modo Dórico (ex: Ré a Ré nas teclas brancas): Escala menor com a Sexta Maior (6M). Em Ré Dórico, a nota característica é o Si natural (6M), muito usado na MPB, Jazz e Funk.\n"
                    "• III Grau — Modo Frígio (ex: Mi a Mi nas teclas brancas): Escala menor com a Segunda Menor (b2). Em Mi Frígio, a passagem Mi -> Fá (1 semitom logo na saída) cria a atmosfera flamenca/espanhola.\n"
                    "📖 Fonte: CHEDIAK, Almir. Harmonia & Improvisação, Vol. 1, p. 95-104."
                ),
                "partitura_dados": {
                    "resumo": "Modos menores: Eólio (Menor Natural), Dórico (6M) e Frígio (b2).",
                    "clef": "treble",
                    "notes": ["D4", "E4", "F4", "G4", "A4", "B4"],
                    "caption": "Modo Ré Dórico: escala menor com a Sexta Maior característica na nota Si4 (B4).",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual modo menor começa no II grau da escala maior e possui a Sexta Maior (6M) como nota característica?", "Dórico", "O modo Dórico é uma escala menor natural com o 6º grau elevado (6M).", stave=["D4", "E4", "F4", "G4", "A4", "B4"], options=["Dórico", "Frígio", "Eólio", "Lócrio"]),
                    _ex(2, "builder", "Monte os 6 primeiros graus do modo Ré Dórico ascendente (D4, E4, F4, G4, A4, B4).", "D4,E4,F4,G4,A4,B4", "Ré Dórico percorre as teclas brancas de D4 até a sua nota característica B4 (6M).", stave=["D4", "E4", "F4", "G4", "A4", "B4"], seq=["D4", "E4", "F4", "G4", "A4", "B4"]),
                    _ex(3, "multiple-choice", "Qual modo menor possui sonoridade espanhola/flamenca devido à Segunda Menor (b2) logo acima da tônica?", "Modo Frígio", "O modo Frígio (III grau, ex: Mi a Mi) tem 1 semitom entre o 1º e o 2º grau (Mi–Fá = b2).", stave=["E4", "F4", "G4", "A4"], options=["Modo Frígio", "Modo Jônio", "Modo Lídio", "Modo Mixolídio"]),
                    _ex(4, "keyboard", "No modo Mi Frígio, toque no piano a nota característica de 2ª menor (b2) logo acima do Mi4: Fá4 (F4).", "F4", "Fá4 está apenas meio tom acima da tônica Mi4, caracterizando o modo Frígio.", stave=["F4"], target="F4"),
                ],
            },
            {
                "ordem": 3,
                "titulo": "O Modo Lócrio (b5) e a Nota Característica Modal",
                "conteudo_teorico": (
                    "O sétimo e último modo grego é o Modo Lócrio, construído sobre o VII grau da escala maior (ex: de Si a Si nas teclas brancas) (Guest, 2006).\n\n"
                    "• VII Grau — Modo Lócrio (1, b2, b3, 4, b5, b6, b7): É o único modo cujo 5º grau não é uma Quinta Justa, mas sim uma Quinta Diminuta (b5 — entre Si e Fá há 6 semitons, um trítono!). Por isso, acompanha os acordes meio-diminutos (m7b5).\n\n"
                    "💡 Quadro-resumo das Notas Características Modais:\n"
                    "Lídio = #4 | Mixolídio = b7 | Dórico = 6M | Eólio = b6 | Frígio = b2 | Lócrio = b5.\n"
                    "📖 Fonte: GUEST, Ian. Harmonia: Método Prático, Vol. 2."
                ),
                "partitura_dados": {
                    "resumo": "Estrutura do Modo Lócrio (b2, b5) e síntese das notas características dos 7 modos.",
                    "clef": "treble",
                    "notes": ["B3", "C4", "D4", "E4", "F4"],
                    "caption": "Os 5 primeiros graus de Si Lócrio (B3 a F4): repare na Quinta Diminuta entre Si3 e Fá4.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Por que o Modo Lócrio (VII grau) é considerado o mais instável dos 7 modos gregos?", "Porque possui uma Quinta Diminuta (b5) em relação à sua tônica", "Entre a tônica (Si) e o 5º grau (Fá) há um trítono (b5), retirando o apoio acústico da quinta justa.", stave=["B3", "F4"], options=["Porque possui uma Quinta Diminuta (b5) em relação à sua tônica", "Porque não possui terça", "Porque tem 12 notas", "Porque só pode ser tocado na Clave de Fá"]),
                    _ex(2, "builder", "Monte os 5 primeiros graus de Si Lócrio ascendente (B3, C4, D4, E4, F4).", "B3,C4,D4,E4,F4", "De Si3 (B3) a Fá4 (F4) percorremos 1, b2, b3, 4 e b5 nas teclas brancas.", stave=["B3", "C4", "D4", "E4", "F4"], seq=["B3", "C4", "D4", "E4", "F4"]),
                    _ex(3, "keyboard", "Partindo de Dó4 (C4), toque a nota Fá#4 (F#4) para sentir a sonoridade da #4 do modo Dó Lídio.", "F#4", "Em Dó Lídio, o 4º grau é elevado de Fá para Fá# (F#4).", stave=["F#4"], target="F#4"),
                    _ex(4, "multiple-choice", "Qual modo grego equivale exatamente à Escala Menor Natural e parte do VI grau da escala maior?", "Modo Eólio", "O VI grau (ex: Lá Eólio em relação a Dó Jônio) forma a Escala Menor Natural.", options=["Modo Eólio", "Modo Lídio", "Modo Jônio", "Modo Lócrio"]),
                ],
            },
        ],
    },

    # =========================================================================
    # CICLO 3: PRATICANTE EMPÍRICO / AVANÇADO (MÓDULOS 11 A 15)
    # =========================================================================
    {
        "ordem": 11,
        "titulo": "Unidade 11: Formação de Tríades",
        "descricao": "Construa acordes de 3 sons (Tríades Maiores, Menores, Diminutas, Aumentadas e Suspensas) no piano.",
        "categoria": "Praticante Empírico",
        "tag_topico": "Formação de Tríades",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "Tríades Maiores e Menores (Empilhamento de Terças)",
                "conteudo_teorico": (
                    "Harmonia é a combinação de sons simultâneos. O bloco construtivo essencial da harmonia tonal é a Tríade: um acorde de 3 notas "
                    "formado pela superposição de duas terças (Fundamental/1º grau + Terça/3º grau + Quinta/5º grau) (Chediak, 2011):\n\n"
                    "• Tríade Maior (ex: C = Dó Maior): Fundamental (Dó) + Terça Maior (Mi, 4 semitons) + Quinta Justa (Sol, 7 semitons).\n"
                    "• Tríade Menor (ex: Am = Lá Menor): Fundamental (Lá) + Terça Menor (Dó, 3 semitons) + Quinta Justa (Mi, 7 semitons).\n\n"
                    "💡 A Quinta Justa dá estabilidade acústica; quem define se o acorde é maior ou menor é exclusivamente a Terça!\n"
                    "📖 Fonte: CHEDIAK, Almir. Harmonia & Improvisação, Vol. 1, p. 45-52."
                ),
                "partitura_dados": {
                    "resumo": "Construção de Tríades Maiores (1–3M–5J) e Menores (1–b3–5J) na pauta e no teclado.",
                    "clef": "treble",
                    "notes": ["C4", "E4", "G4"],
                    "caption": "Tríade de Dó Maior (C4 – E4 – G4) e relação de terças superpostas.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Quais notas formam a tríade perfeita de Dó Maior (C)?", "Dó, Mi, Sol", "Fundamental (Dó) + Terça Maior (Mi) + Quinta Justa (Sol).", stave=["C4", "E4", "G4"], options=["Dó, Mi, Sol", "Dó, Mib, Sol", "Dó, Fá, Lá", "Dó, Ré, Sol"]),
                    _ex(2, "builder", "Monte a tríade de Dó Maior em ordem ascendente (C4, E4, G4).", "C4,E4,G4", "C4 (tônica), E4 (terça maior) e G4 (quinta justa).", stave=["C4", "E4", "G4"], seq=["C4", "E4", "G4"]),
                    _ex(3, "builder", "Monte a tríade de Lá Menor (Am) em ordem ascendente (A3, C4, E4).", "A3,C4,E4", "A3 (tônica), C4 (terça menor) e E4 (quinta justa).", stave=["A3", "C4", "E4"], seq=["A3", "C4", "E4"]),
                    _ex(4, "keyboard", "Para transformar a tríade de Ré Menor (Ré – Fá – Lá) em Ré Maior (D), toque a nova Terça Maior no piano: Fá#4 (F#4).", "F#4", "Elevando a terça menor (F4) em meio tom para F#4, obtemos a tríade de Ré Maior (D – F# – A).", stave=["F#4"], target="F#4"),
                ],
            },
            {
                "ordem": 2,
                "titulo": "Tríades Diminutas (b3, b5) e Aumentadas (3M, #5)",
                "conteudo_teorico": (
                    "Quando a quinta da tríade deixa de ser justa (sofre alteração de meio tom para baixo ou para cima), surgem duas tríades "
                    "simétricas de forte colorido harmônico (Kostka & Payne, 2018):\n\n"
                    "• Tríade Diminuta (ex: B° = Si Diminuto): Fundamental (Si) + Terça Menor (Ré, 3 semitons) + Quinta Diminuta (Fá, 6 semitons). "
                    "São duas terças menores empilhadas (3m + 3m).\n"
                    "• Tríade Aumentada (ex: Caug ou C(#5)): Fundamental (Dó) + Terça Maior (Mi, 4 semitons) + Quinta Aumentada (Sol#, 8 semitons). "
                    "São duas terças maiores empilhadas (3M + 3M).\n"
                    "📖 Fonte: KOSTKA, Stefan; PAYNE, Dorothy. Tonal Harmony, 8th ed., Cap. 3."
                ),
                "partitura_dados": {
                    "resumo": "Estrutura simétrica das Tríades Diminutas (1–b3–b5) e Aumentadas (1–3M–#5).",
                    "clef": "treble",
                    "notes": ["B3", "D4", "F4"],
                    "caption": "Tríade de Si Diminuto (B° = B3 – D4 – F4), formada naturalmente no VII grau de Dó Maior.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual é a estrutura intervalar de uma Tríade Diminuta (como B°)?", "Fundamental + Terça Menor (b3) + Quinta Diminuta (b5)", "A tríade diminuta empilha duas terças menores consecutivas, gerando um trítono entre a 1ª e a 5ª.", stave=["B3", "D4", "F4"], options=["Fundamental + Terça Menor (b3) + Quinta Diminuta (b5)", "Fundamental + Terça Maior + Quinta Justa", "Fundamental + Quarta Justa + Quinta Justa", "Fundamental + Terça Menor + Quinta Aumentada"]),
                    _ex(2, "builder", "Monte a tríade de Si Diminuto (B°) em ordem ascendente (B3, D4, F4).", "B3,D4,F4", "Si3 (tônica), Ré4 (terça menor) e Fá4 (quinta diminuta).", stave=["B3", "D4", "F4"], seq=["B3", "D4", "F4"]),
                    _ex(3, "builder", "Monte a tríade de Dó Aumentado — C(#5) — em ordem ascendente (C4, E4, G#4).", "C4,E4,G#4", "Dó4 (tônica), Mi4 (terça maior) e Sol#4 (quinta aumentada).", stave=["C4", "E4", "G#4"], seq=["C4", "E4", "G#4"]),
                    _ex(4, "keyboard", "Na tríade de Dó Aumentado (Dó – Mi – Sol#), toque no piano a Quinta Aumentada: Sol#4 (G#4).", "G#4", "G#4 está 8 semitons acima de Dó4, formando a quinta aumentada (#5).", stave=["G#4"], target="G#4"),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Acordes Suspensos (sus2 e sus4) na Prática",
                "conteudo_teorico": (
                    "Nos Acordes Suspensos (muito usados no Pop, Rock, Worship e MPB), a terça do acorde (nota que define o modo maior/menor) "
                    "é temporariamente omitida e substituída pela 2ª maior ou pela 4ª justa (Guest, 2006):\n\n"
                    "• Acorde sus4 (ex: Csus4): Fundamental (Dó) + Quarta Justa (Fá) + Quinta Justa (Sol). A 4ª (Fá) cria uma suspensão que tende a resolver na 3ª (Mi).\n"
                    "• Acorde sus2 (ex: Csus2): Fundamental (Dó) + Segunda Maior (Ré) + Quinta Justa (Sol). Sonoridade aberta e moderna.\n"
                    "📖 Fonte: GUEST, Ian. Harmonia: Método Prático, Vol. 1, Cap. 6."
                ),
                "partitura_dados": {
                    "resumo": "Substituição da terça nos acordes Csus4 (1–4–5) e Csus2 (1–2–5).",
                    "clef": "treble",
                    "notes": ["C4", "F4", "G4", "E4"],
                    "caption": "Acorde Csus4 (Dó4 – Fá4 – Sol4) resolvendo a 4ª (Fá4) na 3ª (Mi4).",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "O que caracteriza a formação de um acorde suspenso como Csus4 ou Csus2?", "A terça do acorde é substituída pela 4ª justa (sus4) ou pela 2ª maior (sus2)", "Sem a terça, o acorde perde a definição estrita de maior/menor e ganha sonoridade suspensa.", stave=["C4", "F4", "G4"], options=["A terça do acorde é substituída pela 4ª justa (sus4) ou pela 2ª maior (sus2)", "A tônica do acorde é removida", "O acorde passa a ter apenas 1 nota", "A quinta é substituída pela sétima maior"]),
                    _ex(2, "builder", "Monte o acorde de Dó com Quarta Suspensa (Csus4) em ordem ascendente (C4, F4, G4).", "C4,F4,G4", "Csus4 é formado por Dó4 (1º), Fá4 (4ª justa) e Sol4 (5ª justa).", stave=["C4", "F4", "G4"], seq=["C4", "F4", "G4"]),
                    _ex(3, "builder", "Monte o acorde de Dó com Segunda Suspensa (Csus2) em ordem ascendente (C4, D4, G4).", "C4,D4,G4", "Csus2 é formado por Dó4 (1º), Ré4 (2ª maior) e Sol4 (5ª justa).", stave=["C4", "D4", "G4"], seq=["C4", "D4", "G4"]),
                    _ex(4, "keyboard", "Resolva a suspensão do acorde Csus4 (Dó–Fá–Sol) tocando no piano a Terça Maior de Dó: Mi4 (E4).", "E4", "A 4ª suspensa (Fá4) resolve descendo meio tom para a 3ª maior (Mi4).", stave=["E4"], target="E4"),
                ],
            },
        ],
    },
    {
        "ordem": 12,
        "titulo": "Unidade 12: Inversão de Acordes e Condução de Vozes",
        "descricao": "Domine a 1ª e 2ª inversões das tríades (C/E, C/G) e o encadeamento suave de acordes no teclado.",
        "categoria": "Praticante Empírico",
        "tag_topico": "Inversão de Acordes",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "Estado Fundamental e 1ª Inversão (Baixo na Terça)",
                "conteudo_teorico": (
                    "A posição de um acorde é determinada por qual nota está no Baixo (a nota mais grave executada) (Kostka & Payne, 2018):\n\n"
                    "• Estado Fundamental (ex: C = Dó3 – Mi3 – Sol3): A própria Fundamental (Dó) é a nota mais grave.\n"
                    "• Primeira Inversão (cifrada como C/E e cifragem barroca 6): A Terça do acorde (Mi) passa a ser a nota mais grave no baixo, "
                    "e o Dó sobe uma oitava (Mi3 – Sol3 – Dó4).\n\n"
                    "💡 Usar a 1ª inversão permite criar linhas de baixo melódicas que caminham por graus conjuntos!\n"
                    "📖 Fonte: KOSTKA, Stefan; PAYNE, Dorothy. Tonal Harmony, 8th ed., Cap. 3 e 5."
                ),
                "partitura_dados": {
                    "resumo": "Diferença entre Estado Fundamental (C) e Primeira Inversão com baixo na terça (C/E).",
                    "clef": "treble",
                    "notes": ["E3", "G3", "C4"],
                    "caption": "Tríade de Dó Maior na 1ª Inversão (C/E): Mi3 no baixo, Sol3 no meio e Dó4 na ponta.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Quando dizemos que uma tríade está na Primeira Inversão (ex: C/E), qual nota do acorde encontra-se no baixo (nota mais grave)?", "A Terça do acorde (no exemplo, a nota Mi)", "Na cifra com barra C/E, a letra à esquerda (C) é o acorde e a letra à direita (E) é a terça no baixo.", stave=["E3", "G3", "C4"], options=["A Terça do acorde (no exemplo, a nota Mi)", "A Fundamental (Dó)", "A Quinta (Sol)", "A Sétima (Si)"]),
                    _ex(2, "builder", "Monte a tríade de Dó Maior na 1ª Inversão (C/E) do grave para o agudo (E3, G3, C4).", "E3,G3,C4", "A terça (E3) fica no baixo, seguida da quinta (G3) e da fundamental oitavada (C4).", stave=["E3", "G3", "C4"], seq=["E3", "G3", "C4"]),
                    _ex(3, "keyboard", "No acorde F/A (Fá Maior na 1ª inversão), toque no piano a nota que deve soar no baixo: Lá3 (A3).", "A3", "A terça de Fá Maior (Fá–Lá–Dó) é a nota Lá (A3).", stave=["A3"], target="A3"),
                    _ex(4, "multiple-choice", "Na cifragem popular moderna, como representamos o acorde de Sol Maior (G–B–D) em sua Primeira Inversão?", "G/B (Sol com baixo em Si)", "Como Si (B) é a terça de Sol Maior, a 1ª inversão é grafada G/B.", options=["G/B (Sol com baixo em Si)", "G/D", "G7", "Gm"]),
                ],
            },
            {
                "ordem": 2,
                "titulo": "Segunda Inversão (Baixo na Quinta / 6/4)",
                "conteudo_teorico": (
                    "Quando colocamos a Quinta da tríade como nota mais grave no baixo, obtemos a Segunda Inversão (cifragem tradicional 6/4) (Med, 2017):\n\n"
                    "• Segunda Inversão de Dó Maior (C/G): A Quinta (Sol3) fica no baixo, seguida da Fundamental (Dó4) e da Terça (Mi4) -> Sol3 – Dó4 – Mi4.\n\n"
                    "💡 Na harmonia clássica e no piano popular, o acorde na 2ª inversão (como C/G) possui sonoridade brilhante e aberta (há uma Quarta Justa "
                    "entre o baixo Sol3 e o Dó4), sendo muito usado como acorde cadencial antes do dominante G!\n"
                    "📖 Fonte: MED, Bohumil. Teoria da Música, 5ª ed.; KOSTKA & PAYNE, Cap. 9."
                ),
                "partitura_dados": {
                    "resumo": "Segunda Inversão (baixo na 5ª, ex: C/G) e abertura em quarta justa.",
                    "clef": "treble",
                    "notes": ["G3", "C4", "E4"],
                    "caption": "Dó Maior na 2ª Inversão (C/G): Sol3 no baixo, Dó4 e Mi4.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual nota do acorde fica na posição mais grave (baixo) quando uma tríade está na Segunda Inversão (ex: C/G)?", "A Quinta do acorde (no exemplo, Sol)", "Na 2ª inversão, a 5ª da tríade ocupa o baixo.", stave=["G3", "C4", "E4"], options=["A Quinta do acorde (no exemplo, Sol)", "A Terça do acorde (Mi)", "A Fundamental (Dó)", "A Sensível (Si)"]),
                    _ex(2, "builder", "Monte a tríade de Dó Maior na 2ª Inversão (C/G) em ordem ascendente (G3, C4, E4).", "G3,C4,E4", "Quinta no baixo (G3), fundamental no meio (C4) e terça na ponta (E4).", stave=["G3", "C4", "E4"], seq=["G3", "C4", "E4"]),
                    _ex(3, "builder", "Monte a tríade de Fá Maior na 2ª Inversão (F/C), mantendo o Dó4 no baixo (C4, F4, A4).", "C4,F4,A4", "Em Fá Maior (Fá–Lá–Dó), a 5ª é Dó; logo F/C na 2ª inversão é C4 – F4 – A4.", stave=["C4", "F4", "A4"], seq=["C4", "F4", "A4"]),
                    _ex(4, "keyboard", "Toque a nota da ponta (mais aguda) de Dó Maior na 2ª inversão (G3 – C4 – E4): Mi4 (E4).", "E4", "Na abertura G3–C4–E4, a nota da melodia (ponta) é o Mi4.", stave=["E4"], target="E4"),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Encadeamento Suave de Acordes no Teclado (Voice Leading)",
                "conteudo_teorico": (
                    "Um dos segredos dos pianistas profissionais é a Lei do Menor Esforço na Condução de Vozes (Voice Leading): ao trocar de um acorde "
                    "para outro, mantemos na mesma tecla a nota comum entre os dois acordes e movemos as demais vozes pelo menor caminho possível (Guest, 2006)!\n\n"
                    "• Exemplo prático (C -> F/C): Tocamos Dó Maior fundamental (C4 – E4 – G4). Para ir a Fá Maior (Fá – Lá – Dó), mantemos o dedo parado no Dó4 "
                    "e apenas subimos E4 -> F4 e G4 -> A4 (formando C4 – F4 – A4 = Fá na 2ª inversão), sem saltar a mão pelo teclado!\n"
                    "📖 Fonte: GUEST, Ian. Harmonia: Método Prático, Vol. 1, Cap. 5."
                ),
                "partitura_dados": {
                    "resumo": "Lei do menor caminho (Voice Leading) mantendo notas comuns entre acordes no piano.",
                    "clef": "treble",
                    "notes": ["C4", "E4", "G4", "C4", "F4", "A4"],
                    "caption": "Encadeamento suave C (C4–E4–G4) -> F/C (C4–F4–A4) mantendo a nota comum Dó4.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual é o princípio fundamental da boa condução de vozes (Voice Leading) ao encadear dois acordes no piano?", "Manter as notas comuns paradas na mesma voz e mover as demais pelo menor intervalo possível", "Isso evita saltos bruscos de mão e cria transições harmônicas elegantes.", options=["Manter as notas comuns paradas na mesma voz e mover as demais pelo menor intervalo possível", "Saltar sempre 2 oitavas a cada acorde", "Tocar todos os acordes exclusivamente em estado fundamental", "Nunca repetir nenhuma tecla entre dois acordes"]),
                    _ex(2, "multiple-choice", "Ao encadear os acordes de Dó Maior (Dó–Mi–Sol) e Sol Maior (Sol–Si–Ré), qual é a nota comum que permanece no mesmo lugar?", "A nota Sol (G)", "Sol é a 5ª de Dó Maior e a 1ª (fundamental) de Sol Maior.", stave=["B3", "D4", "G4"], options=["A nota Sol (G)", "A nota Dó (C)", "A nota Fá (F)", "A nota Lá (A)"]),
                    _ex(3, "builder", "Toque Sol Maior na 1ª inversão (G/B = B3, D4, G4), que encadeia suavemente com Dó Maior (C4, E4, G4).", "B3,D4,G4", "B3 sobe meio tom para C4, D4 sobe 1 tom para E4 e o G4 permanece parado!", stave=["B3", "D4", "G4"], seq=["B3", "D4", "G4"]),
                    _ex(4, "keyboard", "Toque no piano a nota comum compartilhada entre Dó Maior (C–E–G) e Fá Maior (F–A–C): Dó4 (C4).", "C4", "Dó4 pertence simultaneamente às tríades de C e F.", stave=["C4"], target="C4"),
                ],
            },
        ],
    },
    {
        "ordem": 13,
        "titulo": "Unidade 13: O Campo Harmônico Maior",
        "descricao": "Domine os 7 acordes diatônicos (I, ii, iii, IV, V, vi, vii°), as 3 funções harmônicas e as cadências.",
        "categoria": "Praticante Empírico",
        "tag_topico": "Campo Harmônico Maior",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "Os 7 Graus Diatônicos em Tríades (I, ii, iii, IV, V, vi, vii°)",
                "conteudo_teorico": (
                    "Quando empilhamos uma tríade sobre cada um dos 7 graus da Escala Maior (usando exclusivamente notas da própria escala), "
                    "obtemos o Campo Harmônico Maior (Chediak, 2011).\n\n"
                    "Em qualquer tonalidade maior, a qualidade das 7 tríades segue sempre esta estrutura invariável:\n"
                    "• Acordes Maiores (I, IV e V): Em Dó Maior -> I = C (Dó Maior), IV = F (Fá Maior), V = G (Sol Maior).\n"
                    "• Acordes Menores (ii, iii e vi): Em Dó Maior -> ii = Dm (Ré menor), iii = Em (Mi menor), vi = Am (Lá menor).\n"
                    "• Acorde Diminuto (vii°): Em Dó Maior -> vii° = B° (Si diminuto).\n"
                    "📖 Fonte: CHEDIAK, Almir. Harmonia & Improvisação, Vol. 1, p. 55-62."
                ),
                "partitura_dados": {
                    "resumo": "Estrutura fixa do Campo Harmônico Maior: I, ii, iii, IV, V, vi e vii°.",
                    "clef": "treble",
                    "notes": ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
                    "caption": "As 7 fundamentais do Campo Harmônico de Dó Maior: C, Dm, Em, F, G, Am e B°.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Quais graus do Campo Harmônico Maior geram sempre tríades Maiores?", "I, IV e V graus (em Dó Maior: C, F e G)", "Os graus tonais I, IV e V produzem tríades maiores em qualquer tonalidade maior.", options=["I, IV e V graus (em Dó Maior: C, F e G)", "ii, iii e vi graus (Dm, Em e Am)", "Apenas o I e o vii° graus", "Todos os graus pares"]),
                    _ex(2, "multiple-choice", "Quais graus do Campo Harmônico Maior geram sempre tríades Menores?", "ii, iii e vi graus (em Dó Maior: Dm, Em e Am)", "O 2º, 3º e 6º graus formam acordes menores diatônicos.", options=["ii, iii e vi graus (em Dó Maior: Dm, Em e Am)", "I, IV e V graus", "Apenas o vii° grau", "I, iii e V graus"]),
                    _ex(3, "builder", "Monte a tríade do II grau de Dó Maior: Ré Menor (Dm = D4, F4, A4).", "D4,F4,A4", "O ii grau de Dó Maior é Ré menor (Ré4 – Fá4 – Lá4).", stave=["D4", "F4", "A4"], seq=["D4", "F4", "A4"]),
                    _ex(4, "builder", "Monte a tríade do III grau de Dó Maior: Mi Menor (Em = E4, G4, B4).", "E4,G4,B4", "O iii grau de Dó Maior é Mi menor (Mi4 – Sol4 – Si4).", stave=["E4", "G4", "B4"], seq=["E4", "G4", "B4"]),
                ],
            },
            {
                "ordem": 2,
                "titulo": "Funções Harmônicas: Tônica, Subdominante e Dominante",
                "conteudo_teorico": (
                    "Na Teoria das Funções Harmônicas (formulada por Hugo Riemann e sistematizada no Brasil por Ian Guest), os 7 acordes do campo harmônico "
                    "agrupam-se em 3 famílias funcionais de sensação auditiva:\n\n"
                    "1. Função Tônica (I, vi e iii): Sensação de estabilidade, repouso e conclusão. (Em Dó: C, Am e Em).\n"
                    "2. Função Subdominante (IV e ii): Sensação de movimento, partida e afastamento moderado, pois contêm o 4º grau (Fá), mas não a sensível (Si). (Em Dó: F e Dm).\n"
                    "3. Função Dominante (V e vii°): Sensação de tensão máxima que pede resolução de volta à Tônica. (Em Dó: G e B°).\n"
                    "📖 Fonte: GUEST, Ian. Harmonia: Método Prático, Vol. 1, Cap. 7."
                ),
                "partitura_dados": {
                    "resumo": "As 3 famílias funcionais de Riemann: Tônica (repouso), Subdominante (meio) e Dominante (tensão).",
                    "clef": "treble",
                    "notes": ["C4", "F4", "G4", "C4"],
                    "caption": "Ciclo funcional completo I -> IV -> V -> I (Tônica -> Subdominante -> Dominante -> Tônica).",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "No campo harmônico de Dó Maior, qual acorde exerce a função Dominante principal (V grau)?", "Sol Maior (G)", "O V grau (Sol Maior) contém a sensível Si, exercendo função Dominante que atrai para Dó Maior.", stave=["G3", "B3", "D4"], options=["Sol Maior (G)", "Fá Maior (F)", "Lá Menor (Am)", "Ré Menor (Dm)"]),
                    _ex(2, "multiple-choice", "Qual acorde menor atua como substituto direto da Subdominante (IV = Fá Maior) por compartilhar as notas Fá e Lá?", "Ré Menor (ii grau = Dm)", "Dm (Ré–Fá–Lá) e F (Fá–Lá–Dó) compartilham duas notas e pertencem à função Subdominante.", options=["Ré Menor (ii grau = Dm)", "Mi Menor (iii grau = Em)", "Sol Maior (V grau)", "Dó Maior (I grau)"]),
                    _ex(3, "builder", "Monte a tríade do acorde Dominante (V grau) de Dó Maior: Sol Maior (G3, B3, D4).", "G3,B3,D4", "Sol Maior é formado por G3 (tônica), B3 (terça maior) e D4 (quinta justa).", stave=["G3", "B3", "D4"], seq=["G3", "B3", "D4"]),
                    _ex(4, "keyboard", "Toque a fundamental do acorde relativo menor da Tônica (vi grau de Dó Maior): Lá3 (A3).", "A3", "O vi grau (Lá menor = Am) exerce função Tônica relativa.", stave=["A3"], target="A3"),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Cadências Clássicas: Perfeita, Plagal e Deceptiva",
                "conteudo_teorico": (
                    "As Cadências Harmônicas funcionam como a pontuação (vírgulas e pontos finais) do discurso musical (Kostka & Payne, 2018):\n\n"
                    "• Cadência Autêntica / Perfeita (V -> I): A resolução mais forte da música tonal (ex: G -> C). Equivale a um ponto final afirmativo.\n"
                    "• Cadência Plagal (IV -> I): Resolução suave da Subdominante direto para a Tônica sem tensão dominante (ex: F -> C), conhecida como 'Cadência do Amém'.\n"
                    "• Cadência Deceptiva (ou Interrompida, V -> vi): O dominante G prepara o ouvido para C, mas resolve de surpresa no relativo menor Am (vi)!\n"
                    "• Meia-Cadência (x -> V): A frase descansa suspensa sobre o acorde Dominante (V), como uma pergunta.\n"
                    "📖 Fonte: KOSTKA, Stefan; PAYNE, Dorothy. Tonal Harmony, 8th ed., Cap. 10."
                ),
                "partitura_dados": {
                    "resumo": "Pontuação harmônica: Cadência Autêntica (V->I), Plagal (IV->I) e Deceptiva (V->vi).",
                    "clef": "treble",
                    "notes": ["F4", "A4", "C4", "E4", "G4"],
                    "caption": "Movimento Plagal IV -> I: Fá Maior resolvendo em Dó Maior.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Como é chamada a cadência em que o acorde Subdominante resolve diretamente na Tônica (IV -> I, ex: F -> C)?", "Cadência Plagal", "A progressão IV -> I é a Cadência Plagal, famosa pelo encerramento coral litúrgico.", options=["Cadência Plagal", "Cadência Deceptiva", "Meia-Cadência", "Modulação Cromática"]),
                    _ex(2, "multiple-choice", "O que acontece em uma Cadência Deceptiva (Interrompida) na tonalidade de Dó Maior?", "O acorde Dominante (G) resolve de surpresa no VI grau (Lá menor — Am) em vez de ir para Dó Maior", "Como Am tem função tônica relativa, ele engana a expectativa de conclusão perfeita (V -> vi).", options=["O acorde Dominante (G) resolve de surpresa no VI grau (Lá menor — Am) em vez de ir para Dó Maior", "A música termina sem nenhum acorde", "O acorde I resolve no vii°", "O compasso muda para 5/4"]),
                    _ex(3, "builder", "Toque o movimento de baixos fundamentais da progressão I – IV – V – I em Dó Maior (C3, F3, G3, C4).", "C3,F3,G3,C4", "Tônica (Dó3) -> Subdominante (Fá3) -> Dominante (Sol3) -> Tônica (Dó4).", stave=["C3", "F3", "G3", "C4"], seq=["C3", "F3", "G3", "C4"]),
                    _ex(4, "keyboard", "Conclua a Cadência Autêntica Perfeita (G -> C) tocando a tônica Dó4 (C4) no piano.", "C4", "A resolução do Dominante na Tônica (C4) encerra a frase com estabilidade total.", stave=["C4"], target="C4"),
                ],
            },
        ],
    },
    {
        "ordem": 14,
        "titulo": "Unidade 14: Tétrades e Acordes com Sétima",
        "descricao": "Adicione a 7ª às tríades (7M, m7, V7 dominante, m7b5 e dim7) e domine a resolução do trítono.",
        "categoria": "Praticante Empírico",
        "tag_topico": "Tétrades e Sétimas",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "Acorde Maior com Sétima Maior (7M) e Menor com Sétima (m7)",
                "conteudo_teorico": (
                    "Quando empilhamos mais uma terça acima da 5ª da tríade (1º + 3º + 5º + 7º graus), formamos um acorde de 4 sons chamado Tétrade — "
                    "a base da Bossa Nova, da MPB e do Jazz (Chediak, 2011):\n\n"
                    "• Maior com Sétima Maior (ex: C7M ou Cmaj7): Tríade Maior (Dó–Mi–Sol) + Sétima Maior (Si, 11 semitons). Ocorre nos graus I7M e IV7M.\n"
                    "• Menor com Sétima (ex: Dm7 ou Am7): Tríade Menor (Ré–Fá–Lá) + Sétima Menor (Dó, 10 semitons). Ocorre nos graus iim7, iiim7 e vim7.\n"
                    "📖 Fonte: CHEDIAK, Almir. Harmonia & Improvisação, Vol. 1, p. 65-74."
                ),
                "partitura_dados": {
                    "resumo": "Formação das tétrades C7M (1–3M–5J–7M) e Dm7 (1–b3–5J–b7).",
                    "clef": "treble",
                    "notes": ["C4", "E4", "G4", "B4"],
                    "caption": "Tétrade de Dó com Sétima Maior — C7M (Dó4 – Mi4 – Sol4 – Si4).",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Quais são as 4 notas que formam a tétrade de Dó com Sétima Maior (C7M / Cmaj7)?", "Dó, Mi, Sol e Si", "Tríade de Dó Maior (Dó–Mi–Sol) somada à 7ª Maior (Si natural).", stave=["C4", "E4", "G4", "B4"], options=["Dó, Mi, Sol e Si", "Dó, Mi, Sol e Si bemol", "Dó, Mib, Sol e Si", "Dó, Fá, Sol e Lá"]),
                    _ex(2, "builder", "Monte a tétrade de Dó com Sétima Maior (C7M) em ordem ascendente (C4, E4, G4, B4).", "C4,E4,G4,B4", "C4 (1º), E4 (3M), G4 (5J) e B4 (7M).", stave=["C4", "E4", "G4", "B4"], seq=["C4", "E4", "G4", "B4"]),
                    _ex(3, "builder", "Monte a tétrade de Lá Menor com Sétima (Am7) em ordem ascendente (A3, C4, E4, G4).", "A3,C4,E4,G4", "A3 (1º), C4 (b3), E4 (5J) e G4 (b7).", stave=["A3", "C4", "E4", "G4"], seq=["A3", "C4", "E4", "G4"]),
                    _ex(4, "keyboard", "No acorde Ré Menor com Sétima (Dm7 = Ré – Fá – Lá – ?), toque no piano a Sétima Menor (b7): Dó4 (C4).", "C4", "A sétima menor de Ré é Dó natural (C4), localizada 1 tom abaixo da oitava Ré.", stave=["C4"], target="C4"),
                ],
            },
            {
                "ordem": 2,
                "titulo": "Acorde Dominante (V7) e o Trítono Harmônico",
                "conteudo_teorico": (
                    "No V grau do campo harmônico maior surge a tétrade mais importante da música tonal: o Acorde Maior com Sétima Menor, "
                    "chamado de Acorde Dominante (ex: G7 em Dó Maior) (Guest, 2006):\n\n"
                    "• Estrutura do G7: Sol (1º) + Si (3ª Maior) + Ré (5ª Justa) + Fá natural (7ª Menor / b7).\n\n"
                    "💡 Por que o G7 tem tanta força de atração para resolver em Dó (C)?\n"
                    "Porque entre a sua 3ª (Si, sensível do tom) e a sua 7ª (Fá, 4º grau do tom) forma-se o TRÍTONO (6 semitons)! "
                    "Na resolução G7 -> C, o Si sobe meio tom para Dó e o Fá desce meio tom para Mi!\n"
                    "📖 Fonte: GUEST, Ian. Harmonia: Método Prático, Vol. 1, Cap. 8."
                ),
                "partitura_dados": {
                    "resumo": "Tétrade Dominante G7 (1–3M–5J–b7) e resolução contrária do Trítono (Si–Fá -> Dó–Mi).",
                    "clef": "treble",
                    "notes": ["G3", "B3", "D4", "F4"],
                    "caption": "Acorde Dominante Sol com Sétima (G7): o trítono interno ocorre entre Si3 e Fá4.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Quais duas notas dentro do acorde Dominante G7 (Sol – Si – Ré – Fá) formam o Trítono que impulsiona a resolução em Dó Maior?", "A Terça (Si) e a Sétima (Fá)", "Entre Si e Fá há exatamente 3 tons (6 semitons = Trítono), que resolve em Dó e Mi.", stave=["B3", "F4"], options=["A Terça (Si) e a Sétima (Fá)", "A Fundamental (Sol) e a Quinta (Ré)", "O Sol e o Dó", "O Ré e o Lá"]),
                    _ex(2, "builder", "Monte a tétrade Dominante de Sol com Sétima (G7) em ordem ascendente (G3, B3, D4, F4).", "G3,B3,D4,F4", "G3 (1º), B3 (3ª maior), D4 (5ª justa) e F4 (7ª menor).", stave=["G3", "B3", "D4", "F4"], seq=["G3", "B3", "D4", "F4"]),
                    _ex(3, "builder", "Toque o Trítono do acorde G7 (Si3 e Fá4) seguido de sua resolução em Dó4 e Mi4 (B3, F4, C4, E4).", "B3,F4,C4,E4", "O Si3 sobe meio tom para Dó4 e o Fá4 desce meio tom para Mi4!", stave=["B3", "F4", "C4", "E4"], seq=["B3", "F4", "C4", "E4"]),
                    _ex(4, "keyboard", "No acorde D7 (Ré – Fá# – Lá – Dó, dominante de Sol Maior), toque a Sétima Menor no piano: Dó4 (C4).", "C4", "D7 combina a terça maior F#4 com a sétima menor C4 (formando o trítono F#–C).", stave=["C4"], target="C4"),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Acordes Meio-Diminuto (m7b5) e Diminuto (dim7)",
                "conteudo_teorico": (
                    "Quando adicionamos uma sétima sobre uma tríade diminuta (1 – b3 – b5), obtemos dois tipos distintos de tétrades (Chediak, 2011):\n\n"
                    "• Acorde Meio-Diminuto — Bm7(b5) ou BØ (VII grau do Campo Harmônico Maior): Tríade diminuta (Si–Ré–Fá) + Sétima Menor (Lá, 10 semitons). "
                    "Chama-se 'meio-diminuto' porque a 5ª é diminuta, mas a 7ª é menor!\n"
                    "• Acorde Diminuto Completo — B°7 ou Bdim7 (VII grau da Escala Menor Harmônica): Tríade diminuta (Si–Ré–Fá) + Sétima Diminuta (Lá bemol / Sol#, 9 semitons). "
                    "É totalmente simétrico (dividindo a oitava em terças menores de 3 em 3 semitons).\n"
                    "📖 Fonte: CHEDIAK, Almir. Harmonia & Improvisação, Vol. 1, p. 75-82."
                ),
                "partitura_dados": {
                    "resumo": "Diferença entre a tétrade Meio-Diminuta Bm7(b5) e a Diminuta Completa B°7.",
                    "clef": "treble",
                    "notes": ["B3", "D4", "F4", "A4"],
                    "caption": "Acorde Si Meio-Diminuto — Bm7(b5): Si3, Ré4, Fá4 e Lá4.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Qual é a diferença entre o acorde Meio-Diminuto Bm7(b5) e o acorde Diminuto completo B°7?", "O Meio-Diminuto possui Sétima Menor (Lá natural), enquanto o Diminuto possui Sétima Diminuta (Láb / Sol#)", "Ambos têm a base Si–Ré–Fá (1–b3–b5), diferenciando-se na 7ª (b7 vs. bb7).", stave=["B3", "D4", "F4", "A4"], options=["O Meio-Diminuto possui Sétima Menor (Lá natural), enquanto o Diminuto possui Sétima Diminuta (Láb / Sol#)", "O Meio-Diminuto tem apenas 2 notas", "O Diminuto possui Terça Maior", "Não existe diferença entre eles"]),
                    _ex(2, "builder", "Monte a tétrade de Si Meio-Diminuto — Bm7(b5) — do VII grau de Dó Maior (B3, D4, F4, A4).", "B3,D4,F4,A4", "Si3 (1º), Ré4 (b3), Fá4 (b5) e Lá4 (b7).", stave=["B3", "D4", "F4", "A4"], seq=["B3", "D4", "F4", "A4"]),
                    _ex(3, "builder", "Monte a tétrade simétrica de Si Diminuto completo (B°7), usando Sol#4/Láb4 como 7ª diminuta (B3, D4, F4, G#4).", "B3,D4,F4,G#4", "Em B°7 todas as notas distam 3 semitons entre si: B3, D4, F4 e Ab4 (G#4).", stave=["B3", "D4", "F4", "G#4"], seq=["B3", "D4", "F4", "G#4"]),
                    _ex(4, "keyboard", "Toque a Sétima Menor do acorde Si Meio-Diminuto (Bm7b5): a nota Lá4 (A4).", "A4", "Lá4 está 10 semitons acima de Si3, formando a 7ª menor do acorde meio-diminuto.", stave=["A4"], target="A4"),
                ],
            },
        ],
    },
    {
        "ordem": 15,
        "titulo": "Unidade 15: Harmonia Aplicada, Escalas de Improvisação e Repertório",
        "descricao": "Aplique a progressão II–V–I, as escalas Pentatônica e Blues, dominantes secundárias e empréstimo modal.",
        "categoria": "Praticante Empírico",
        "tag_topico": "Harmonia Aplicada e Improvisação",
        "aulas": [
            {
                "ordem": 1,
                "titulo": "A Progressão II–V–I Maior e Menor",
                "conteudo_teorico": (
                    "A cadência II – V – I é a célula harmônica mais importante do Jazz, da Bossa Nova, do Samba e da MPB (Guest, 2006; Chediak, 2011). "
                    "Ela percorre as três funções harmônicas com movimento de baixos em Quintas descendentes (ou Quartas ascendentes):\n\n"
                    "• II–V–I em Dó Maior: Dm7 (Subdominante) -> G7 (Dominante) -> C7M (Tônica).\n"
                    "• II–V–I em Lá Menor (usando a escala menor harmônica): Bm7(b5) (II meio-diminuto) -> E7 (V7 dominante com Sol#) -> Am7 (Tônica menor).\n"
                    "📖 Fonte: GUEST, Ian. Harmonia: Método Prático, Vol. 1, Cap. 10; CHEDIAK, Almir. Vol. 1."
                ),
                "partitura_dados": {
                    "resumo": "Estrutura da cadência II–V–I Maior (Dm7–G7–C7M) e Menor (Bm7b5–E7–Am7).",
                    "clef": "treble",
                    "notes": ["D3", "G3", "C3", "E4", "G4", "B4"],
                    "caption": "Movimento de fundamentais D3 -> G3 -> C3 sustentando a resolução II–V–I em Dó Maior.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Quais acordes formam a cadência II – V – I em tétrades na tonalidade de Dó Maior?", "Dm7 -> G7 -> C7M", "O II grau é menor com 7ª (Dm7), o V é dominante (G7) e o I é maior com 7ª maior (C7M).", stave=["D4", "G3", "C4"], options=["Dm7 -> G7 -> C7M", "Cmaj7 -> Fmaj7 -> G7", "Em7 -> Am7 -> Dm7", "F7M -> Bm7(b5) -> Am7"]),
                    _ex(2, "builder", "Toque o movimento de baixos fundamentais de um II – V – I em Dó Maior na oitava 3 (D3, G3, C3).", "D3,G3,C3", "Ré3 (II) prepara Sol3 (V), que resolve em Dó3 (I).", stave=["D3", "G3", "C3"], seq=["D3", "G3", "C3"]),
                    _ex(3, "multiple-choice", "Em um II – V – I para uma tonalidade MENOR (ex: Lá Menor), qual é a qualidade do acorde do II grau?", "Meio-Diminuto — Bm7(b5)", "Na tonalidade menor, o II grau possui quinta diminuta (Si–Ré–Fá–Lá = Bm7b5).", options=["Meio-Diminuto — Bm7(b5)", "Maior com Sétima Maior (B7M)", "Menor com Sétima (Bm7)", "Aumentado"]),
                    _ex(4, "keyboard", "No acorde dominante E7 (Mi – Sol# – Si – Ré) que resolve em Lá Menor (Am), toque a Terça Maior (sensível de Lá): Sol#4 (G#4).", "G#4", "O Sol#4 (G#4) do acorde E7 resolve meio tom acima na tônica Lá4.", stave=["G#4"], target="G#4"),
                ],
            },
            {
                "ordem": 2,
                "titulo": "Escalas Pentatônicas (Maior e Menor) e Blues",
                "conteudo_teorico": (
                    "A Escala Pentatônica é uma escala de 5 notas que retira os dois semitons (e consequentemente o trítono) da escala diatônica, "
                    "tornando-a universalmente consonante para criação de melodias e improvisação (Chediak, 2011):\n\n"
                    "• Pentatônica Maior (graus 1, 2, 3, 5, 6 — sem o 4º e o 7º graus): Em Dó Maior -> Dó – Ré – Mi – Sol – Lá.\n"
                    "• Pentatônica Menor (graus 1, b3, 4, 5, b7 — relativa de Dó): Em Lá Menor -> Lá – Dó – Ré – Mi – Sol.\n"
                    "• Escala Blues (Hexatônica): Adiciona a 'Blue Note' (#4 / b5) à pentatônica menor! Em Lá Blues: Lá – Dó – Ré – Ré#(Mib) – Mi – Sol.\n"
                    "📖 Fonte: CHEDIAK, Almir. Harmonia & Improvisação, Vol. 1, p. 112-120."
                ),
                "partitura_dados": {
                    "resumo": "Pentatônica Maior (1-2-3-5-6), Pentatônica Menor (1-b3-4-5-b7) e a Blue Note (b5).",
                    "clef": "treble",
                    "notes": ["C4", "D4", "E4", "G4", "A4"],
                    "caption": "Escala Pentatônica de Dó Maior (C4 – D4 – E4 – G4 – A4).",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Quais dois graus da Escala Maior são omitidos para formar a Escala Pentatônica Maior (1 – 2 – 3 – 5 – 6)?", "O 4º e o 7º graus (eliminando os semitons e o trítono)", "Ao retirar Fá (4º) e Si (7º) de Dó Maior, restam Dó–Ré–Mi–Sol–Lá sem nenhum semitom.", stave=["C4", "D4", "E4", "G4", "A4"], options=["O 4º e o 7º graus (eliminando os semitons e o trítono)", "O 1º e o 5º graus", "O 2º e o 3º graus", "O 3º e o 6º graus"]),
                    _ex(2, "builder", "Monte a Escala Pentatônica de Dó Maior ascendente (C4, D4, E4, G4, A4).", "C4,D4,E4,G4,A4", "As 5 notas de Dó Pentatônica Maior são C4, D4, E4, G4 e A4.", stave=["C4", "D4", "E4", "G4", "A4"], seq=["C4", "D4", "E4", "G4", "A4"]),
                    _ex(3, "builder", "Monte a Escala Pentatônica de Lá Menor ascendente (A3, C4, D4, E4, G4).", "A3,C4,D4,E4,G4", "Lá Pentatônica Menor (1, b3, 4, 5, b7) utiliza A3, C4, D4, E4 e G4.", stave=["A3", "C4", "D4", "E4", "G4"], seq=["A3", "C4", "D4", "E4", "G4"]),
                    _ex(4, "keyboard", "Toque no piano a 'Blue Note' (#4 / b5) que transforma a pentatônica de Lá Menor na Escala de Lá Blues: Ré#4 / Mib4 (D#4).", "D#4", "Em Lá Blues (A–C–D–Eb–E–G), a Blue Note fica exatamente entre o 4º grau (D4) e o 5º grau (E4): D#4.", stave=["D#4"], target="D#4"),
                ],
            },
            {
                "ordem": 3,
                "titulo": "Dominantes Secundárias (V7/V) e Empréstimo Modal",
                "conteudo_teorico": (
                    "Para enriquecer uma música além dos 7 acordes básicos do tom, utilizamos dois recursos consagrados na harmonia funcional (Guest, 2006; Kostka & Payne, 2018):\n\n"
                    "• Dominantes Secundárias (Dominantes Individuais): Qualquer acorde maior ou menor do campo harmônico pode ser precedido pelo seu próprio "
                    "acorde Dominante V7! Em Dó Maior, para preparar o acorde de Sol (V), usamos Ré com Sétima (D7 = V7/V); para preparar Lá menor (vi), usamos Mi com Sétima (E7 = V7/vi).\n"
                    "• Acordes de Empréstimo Modal (AEM): Consiste em tomar emprestado um acorde da escala homônima menor (ex: usar Fá Menor — Fm — logo após Fá Maior — F — dentro do tom de Dó Maior)!\n"
                    "📖 Fonte: GUEST, Ian. Harmonia: Método Prático, Vol. 1, Cap. 12 e 15; KOSTKA & PAYNE, Cap. 16 e 21."
                ),
                "partitura_dados": {
                    "resumo": "Dominantes Secundárias (V7/V, V7/vi) e Acordes de Empréstimo Modal (IVm).",
                    "clef": "treble",
                    "notes": ["D4", "F#4", "A4", "C4", "G3", "B3", "D4"],
                    "caption": "Dominante Secundária D7 (V7/V) preparando o acorde Dominante G (V) em Dó Maior.",
                },
                "exercicios": [
                    _ex(1, "multiple-choice", "Em uma música na tonalidade de Dó Maior, qual é a função do acorde Ré Maior com Sétima (D7 = Ré–Fá#–Lá–Dó) antes de Sol Maior (G)?", "Dominante Secundária do V grau (V7/V)", "D7 é o quinto grau dominante de Sol (V7/V), criando uma preparação individual para o V grau.", stave=["D4", "F#4", "A4", "C4"], options=["Dominante Secundária do V grau (V7/V)", "Tônica principal", "Acorde diminuto do I grau", "Subdominante diatônica sem alteração"]),
                    _ex(2, "builder", "Monte a tríade de Ré Maior (D4, F#4, A4), base da Dominante Secundária V/V em Dó Maior.", "D4,F#4,A4", "Ao elevar o Fá natural de Dm para Fá# (F#4), transformamos o ii grau na dominante secundária D (V/V).", stave=["D4", "F#4", "A4"], seq=["D4", "F#4", "A4"]),
                    _ex(3, "multiple-choice", "Quando estamos em Dó Maior e usamos o acorde de Fá Menor (Fm, vindo de Dó Menor) antes de resolver em Dó Maior, qual técnica aplicamos?", "Acorde de Empréstimo Modal (AEM — Subdominante Menor)", "Fm é emprestado do tom homônimo de Dó Menor, criando a clássica cadência IV -> IVm -> I.", options=["Acorde de Empréstimo Modal (AEM — Subdominante Menor)", "Escala Pentatônica", "Mudança de Clave", "Quiáltera"]),
                    _ex(4, "keyboard", "No acorde de Empréstimo Modal Fá Menor (Fm = Fá – Láb – Dó), toque no piano a terça menor que foi abaixada: Láb4 / Sol#4 (G#4).", "G#4", "Em Fá Maior a terça é Lá natural (A4); no empréstimo modal Fá Menor ela desce meio tom para Láb4 (G#4).", stave=["G#4"], target="G#4"),
                ],
            },
        ],
    },
]


def expand_curriculum_15_modules(apps, schema_editor):
    Modulo = apps.get_model("learning", "Modulo")
    Aula = apps.get_model("learning", "Aula")
    Exercicio = apps.get_model("exercises", "Exercicio")
    Badge = apps.get_model("gamification", "Badge")

    # Garante as badges de gamificação
    badges_padrao = [
        ("primeira-nota", "Primeira Nota", "Concluiu a primeira lição na trilha do Linus.", "star"),
        ("tres-licoes", "Três Lições", "Concluiu 3 lições na trilha de aprendizado.", "trophy"),
        ("ofensiva-5-dias", "Consistência (5 dias)", "Manteve uma ofensiva de estudos por 5 dias consecutivos.", "flame"),
    ]
    for codigo, nome, descricao, icone in badges_padrao:
        Badge.objects.update_or_create(
            codigo=codigo,
            defaults={"nome": nome, "descricao": descricao, "icone_url": icone},
        )

    for u in CURRICULUM_15_MODULOS:
        # Busca por 'ordem' para preservar o UUID caso o módulo já exista em produção
        modulo = Modulo.objects.filter(ordem=u["ordem"]).first()
        if modulo:
            modulo.titulo = u["titulo"]
            modulo.descricao = u["descricao"]
            modulo.categoria = u["categoria"]
            modulo.ativo = True
            modulo.save()
        else:
            modulo = Modulo.objects.create(
                id=uuid.uuid4(),
                ordem=u["ordem"],
                titulo=u["titulo"],
                descricao=u["descricao"],
                categoria=u["categoria"],
                ativo=True,
            )

        for a in u["aulas"]:
            # Busca por (modulo, ordem) para preservar ProgressoAula existente em produção
            aula = Aula.objects.filter(modulo=modulo, ordem=a["ordem"]).first()
            if aula:
                aula.titulo = a["titulo"]
                aula.conteudo_teorico = a["conteudo_teorico"]
                aula.partitura_dados = a["partitura_dados"]
                aula.ativa = True
                aula.save()
            else:
                aula = Aula.objects.create(
                    id=uuid.uuid4(),
                    modulo=modulo,
                    ordem=a["ordem"],
                    titulo=a["titulo"],
                    conteudo_teorico=a["conteudo_teorico"],
                    partitura_dados=a["partitura_dados"],
                    ativa=True,
                )

            exercicios_atuais = list(Exercicio.objects.filter(aula=aula).order_by("id"))
            for idx, ex_data in enumerate(a["exercicios"]):
                if idx < len(exercicios_atuais):
                    ex_obj = exercicios_atuais[idx]
                    ex_obj.tipo = ex_data["tipo"]
                    ex_obj.enunciado = ex_data["enunciado"]
                    ex_obj.gabarito_dados = ex_data["gabarito_dados"]
                    ex_obj.tag_topico = u["tag_topico"]
                    ex_obj.ativo = True
                    ex_obj.save()
                else:
                    Exercicio.objects.create(
                        id=uuid.uuid4(),
                        aula=aula,
                        tipo=ex_data["tipo"],
                        enunciado=ex_data["enunciado"],
                        gabarito_dados=ex_data["gabarito_dados"],
                        tag_topico=u["tag_topico"],
                        ativo=True,
                    )


class Migration(migrations.Migration):

    dependencies = [
        ("learning", "0003_fix_all_seed_uuids"),
        ("exercises", "0001_initial"),
        ("gamification", "0001_initial"),
        ("progress", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(
            expand_curriculum_15_modules,
            migrations.RunPython.noop,
        ),
    ]