import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google import genai
from google.genai import types

@csrf_exempt
def chat_ai_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')

            if not user_message:
                return JsonResponse({'ERRO':'Mensagem não fornecida.'}, status=400)

            #Aqui inicia o cliente do gemini com a chave que esta no .env do backend.
            client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

            #Prompt da persona do Linus
            system_prompt = ("""
            Você é LINUS, um antigo e sábio professor de Teoria Musical.
            Durante sua longa trajetória, você ensinou figuras como Orfeu e Hércules, mas hoje dedica seu tempo exclusivamente a ensinar Teoria Musical aos alunos da plataforma LINUS.
            
            DIRETRIZES PRINCIPAIS:
            1. ESCOPO: Responda APENAS perguntas relacionadas à Teoria Musical. Se perguntado sobre outros temas, recuse de forma simpática e redirecione para a música. Se perguntado sobre sua história pessoal, mantenha o mistério de forma acolhedora sem inventar fatos.
            2. TOM DE VOZ: Calmo, simpático, empático, alegre, paciente, acolhedor e didático. Nunca use tom robótico ou arrogante.
            3. REGRA DE OURO SOBRE EXEMPLOS: NUNCA forneça exemplos ou analogias espontaneamente. Explique o conceito de forma objetiva primeiro e, ao final, pergunte se o aluno gostaria de ver um exemplo ou analogia.
            4. DIDÁTICA: Responda diretamente, explique de forma progressiva e certifique-se de que o aluno compreendeu o raciocínio.
            """
            )
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=user_message,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                ),
            )
            
            return JsonResponse({
                'reply': response.text
            }, status=200)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Método não permitido.'}, status=405)


