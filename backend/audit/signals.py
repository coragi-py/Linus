# Esse arquivo registra na TB quando for criado um user, quando houver login sucesso/falha e quando encerrar sessão. Por Anny, em 16/09.

from django.contrib.auth.signals import user_logged_in, user_login_failed, user_logged_out
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import LogAuditoria
# Bibliotecas para fazer requisição do IP em caso de login e criação de user (respectivamente)
from ipware import get_client_ip
from crum import get_current_request

Usuario = get_user_model()

def extrair_ip_seguro(request):
    """
    Usa a biblioteca django-ipware para mitigar IP Spoofing.
    Ela sabe lidar corretamente com proxies e balanceadores de carga.
    """
    if not request:
        return '0.0.0.0' # IP de fallback para rotinas internas sem request
    
    ip, is_routable = get_client_ip(request)
    return ip if ip else '0.0.0.0'

#Log de Autenticação com Sucesso
@receiver(user_logged_in)
def registrar_login_sucesso(sender, request, user, **kwargs):
    LogAuditoria.objects.create(
        usuario=user,
        acao='LOGIN_SUCESSO',
        ip_origem=extrair_ip_seguro(request),
        detalhes={'mensagem': 'Sessão iniciada com sucesso.'}
    )

#Log de Falha de Autenticação (BLINDADO CONTRA INJEÇÃO)
@receiver(user_login_failed)
def registrar_login_falha(sender, credentials, request, **kwargs):
    # Captura o identificador
    identificador_inicial = credentials.get('email') or credentials.get('username', 'Desconhecido')
    # Trunca a string para no máximo 150 caracteres. Assim evita que o bd receba um payload gigante no campo username.
    identificador_seguro = str(identificador_inicial)[:150]
    LogAuditoria.objects.create(
        acao='LOGIN_FALHA',
        ip_origem=extrair_ip_seguro(request),
        detalhes={
            'identificador_tentado': identificador_seguro, 
            'mensagem': 'Credenciais inválidas fornecidas.'
        }
    )

#Log de Encerramento de Sessão
@receiver(user_logged_out)
def registrar_logout(sender, request, user, **kwargs):
    if user:
        LogAuditoria.objects.create(
            usuario=user,
            acao='LOGOUT',
            ip_origem=extrair_ip_seguro(request),
            detalhes={'mensagem': 'Sessão encerrada voluntariamente.'}
        )

#Log de Criação de Usuário 
@receiver(post_save, sender=Usuario) # usa a biblioteca crum
def registrar_criacao_usuario(sender, instance, created, **kwargs):
    if created:
        request_atual = get_current_request()
        ip_origem = extrair_ip_seguro(request_atual)

        LogAuditoria.objects.create(
            usuario=instance,
            acao='CADASTRO_NOVO_USUARIO',
            ip_origem=ip_origem, 
            detalhes={
                'email': getattr(instance, 'email', ''),
                'mensagem': 'Novo usuário registrado no banco de dados.'
            }
        )