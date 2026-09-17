# Esse arquivo registra na TB quando for criado um user, quando houver login sucesso/falha e quando encerrar sessão. Por Anny, em 16/09.
# Esse arquivo foi corrigido, salvando logs com msg de alerta quando o id estiver como nulo ou estiver errado por algum motivo, 
# não impedindo que o usuário faça login/logout. Por Anny, em 17/09.

from django.contrib.auth.signals import user_logged_in, user_login_failed, user_logged_out
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction  
from .models import LogAuditoria
from ipware import get_client_ip
from crum import get_current_request

Usuario = get_user_model()

def extrair_ip_seguro(request):
    if not request:
        return '0.0.0.0'
    ip, is_routable = get_client_ip(request)
    return ip if ip else '0.0.0.0'

# Log de Autenticação com Sucesso
@receiver(user_logged_in)
def registrar_login_sucesso(sender, request, user, **kwargs):
    id_tentado = getattr(user, 'pk', getattr(user, 'id', None))
    
    try:
        # Tenta salvar o log atrelando o usuário fornecido pelo módulo de login
        with transaction.atomic():
            LogAuditoria.objects.create(
                usuario_id=id_tentado,
                acao='LOGIN_SUCESSO',
                ip_origem=extrair_ip_seguro(request),
                detalhes={'mensagem': 'Sessão iniciada com sucesso.'}
            )
    except IntegrityError:
        # Se o módulo accounts injetar um UUID falso e o banco rejeitar,
        # salvamos o log mesmo assim, sem a chave estrangeira.
        LogAuditoria.objects.create(
            usuario=None,
            acao='LOGIN_SUCESSO',
            ip_origem=extrair_ip_seguro(request),
            detalhes={
                'mensagem': 'Sessão iniciada, mas o banco rejeitou o vínculo (Inconsistência no módulo accounts).',
                'id_invalido_recebido': str(id_tentado)
            }
        )

# Log de Falha de Autenticação
@receiver(user_login_failed)
def registrar_login_falha(sender, credentials, request, **kwargs):
    identificador_inicial = credentials.get('email') or credentials.get('username', 'Desconhecido')
    identificador_seguro = str(identificador_inicial)[:150]
    
    LogAuditoria.objects.create(
        acao='LOGIN_FALHA',
        ip_origem=extrair_ip_seguro(request),
        detalhes={
            'identificador_tentado': identificador_seguro, 
            'mensagem': 'Credenciais inválidas fornecidas.'
        }
    )

# Log de Encerramento de Sessão
@receiver(user_logged_out)
def registrar_logout(sender, request, user, **kwargs):
    id_tentado = getattr(user, 'pk', getattr(user, 'id', None))
    
    try:
        with transaction.atomic():
            LogAuditoria.objects.create(
                usuario_id=id_tentado,
                acao='LOGOUT',
                ip_origem=extrair_ip_seguro(request),
                detalhes={'mensagem': 'Sessão encerrada voluntariamente.'}
            )
    except IntegrityError:
        # Se o módulo accounts injetar um UUID falso e o banco rejeitar,
        # salvamos o log mesmo assim, sem a chave estrangeira.
        LogAuditoria.objects.create(
            usuario=None,
            acao='LOGOUT',
            ip_origem=extrair_ip_seguro(request),
            detalhes={
                'mensagem': 'Sessão encerrada (ID fornecido não existe no banco de dados).',
                'id_invalido_recebido': str(id_tentado)
            }
        )

# Log de Criação de Usuário 
@receiver(post_save, sender=Usuario)
def registrar_criacao_usuario(sender, instance, created, **kwargs):
    if created:
        request_atual = get_current_request()
        LogAuditoria.objects.create(
            usuario=instance,
            acao='CADASTRO_NOVO_USUARIO',
            ip_origem=extrair_ip_seguro(request_atual), 
            detalhes={
                'email': getattr(instance, 'email', ''),
                'mensagem': 'Novo usuário registrado no banco de dados.'
            }
        )