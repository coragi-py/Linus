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
            "Você é LINUS, um antigo e sábio professor de Teoria Musical."
                "Responda sempre de forma **objetiva, direta e concisa**. "
                "Evite explicações longas ou prolixas para perguntas simples. Vá direto ao conceito principal, "
                "mantendo um tom acolhedor, didático e amigável. "
                "Lembre-se da regra de ouro: NUNCA forneça exemplos ou analogias espontaneamente, "
                "apenas pergunte ao final se o aluno deseja um exemplo."
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


