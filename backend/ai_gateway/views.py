import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google import genai

@csrf_exempt
def chat_ai_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')

            if not user_message:
                return JsonResponse({'ERRO':'Mensagem não fornecida.'}, status=400)

            # O SDK novo reconhece a variável GEMINI_API_KEY do seu .env automaticamente
            client = genai.Client()

            # Prompt da persona do Linus
            system_prompt = (
                "Você é LINUS, um antigo e sábio professor de Teoria Musical. "
                "Responda sempre de forma **objetiva, direta e concisa**. "
                "Evite explicações longas ou prolixas para perguntas simples. Vá direto ao conceito principal, "
                "mantendo um tom acolhedor, didático e amigável. "
                "Lembre-se da regra de ouro: NUNCA forneça exemplos ou analogias espontaneamente, "
                "apenas pergunte ao final se o aluno deseja um exemplo."
            )
            
            # Na nova API Interactions, combinamos o contexto e a mensagem no mesmo input
            full_input = f"{system_prompt}\n\nAluno: {user_message}"

            # Chamada atualizada (Maio de 2026) e modelo 3.5
            interaction = client.interactions.create(
                model="gemini-3.1-flash-lite",
                input=full_input
            )
            
            return JsonResponse({
                'reply': interaction.output_text
            }, status=200)
            
        except Exception as e:
            # Imprime o erro no console do Django para facilitar o debug de problemas de chave ou cota
            print(f"Erro no Gemini: {e}")
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Método não permitido.'}, status=405)