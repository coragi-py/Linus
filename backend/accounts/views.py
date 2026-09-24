from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.auth.models import update_last_login
from rest_framework.throttling import ScopedRateThrottle
from django.conf import settings
import uuid
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from accounts.serializers import (
    RegisterSerializer, LoginSerializer, Verify2FASerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    GoogleAuthSerializer
)
from accounts.services.security_service import SecurityService
from accounts.services.email_service import EmailService
from audit.services.audit_service import AuditService

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    # Implementação RBAC: injeta a role no payload do JWT para leitura no Frontend (TanStack Router)
    refresh['role'] = user.role
    refresh['nome'] = user.nome
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_attempt'
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.create_user(
                    nome=serializer.validated_data['nome'],
                    email=serializer.validated_data['email'],
                    password=serializer.validated_data['password'],
                    ano_nascimento=serializer.validated_data.get('ano_nascimento'),
                    terms_accepted=serializer.validated_data['terms_accepted'],
                    terms_version=serializer.validated_data['terms_version'],
                    terms_accepted_at=timezone.now(),
                    consent_ip=AuditService.get_client_ip(request)
                )
                AuditService.log_event(request, user, "USER_REGISTERED")
                tokens = get_tokens_for_user(user)
                tokens["message"] = "Conta criada com sucesso."
                return Response(tokens, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_attempt'

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            terms_accepted = serializer.validated_data.get('terms_accepted')
            terms_version = serializer.validated_data.get('terms_version')
            
            # Busca manual ignora a trava do is_active=False do authenticate() padrão
            user = User.objects.filter(email=email).first()
            
            if user and user.check_password(password):
                
                # 1. Validação de LGPD / Reativação de Conta
                if not user.terms_accepted:
                    if terms_accepted:
                        user.terms_accepted = True
                        user.terms_version = terms_version
                        user.terms_accepted_at = timezone.now()
                        user.is_active = True # Reativa a conta oficialmente
                        user.consent_ip = AuditService.get_client_ip(request)
                        user.save()
                        AuditService.log_event(request, user, "TERMS_REACCEPTED")
                    else:
                        return Response({
                            "status": "terms_required", 
                            "message": "Consentimento revogado. Você precisa aceitar os Termos de Uso novamente."
                        }, status=status.HTTP_403_FORBIDDEN)

                # 2. Validação de Segurança (2FA)
                if user.is_2fa_enabled:
                    otp = SecurityService.create_2fa_token(user)
                    EmailService.send_2fa_email(user.email, otp)
                    AuditService.log_event(request, user, "2FA_OTP_SENT")
                    return Response({"status": "2fa_required", "message": "Código 2FA enviado para o e-mail."}, status=status.HTTP_202_ACCEPTED)
                
                # 3. Login com Sucesso
                tokens = get_tokens_for_user(user)
                AuditService.log_event(request, user, "USER_LOGGED_IN")
                update_last_login(None, user)
                return Response(tokens, status=status.HTTP_200_OK)
            
            AuditService.log_event(request, None, "FAILED_LOGIN_ATTEMPT", {"email": email})
            return Response({"error": "Credenciais inválidas."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Verify2FAView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_attempt'

    def post(self, request):
        serializer = Verify2FASerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)
                
            if SecurityService.verify_2fa_token(user, otp):
                tokens = get_tokens_for_user(user)
                AuditService.log_event(request, user, "2FA_VERIFIED_AND_LOGGED_IN")
                return Response(tokens, status=status.HTTP_200_OK)
            
            AuditService.log_event(request, user, "FAILED_2FA_ATTEMPT")
            return Response({"error": "Código inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleAuthView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_attempt'

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        if serializer.is_valid():
            token_str = serializer.validated_data['id_token']
            
            try:
                idinfo = id_token.verify_oauth2_token(token_str, google_requests.Request(), settings.GOOGLE_OAUTH2_CLIENT_ID)
            except ValueError:
                AuditService.log_event(request, None, "FAILED_GOOGLE_LOGIN_ATTEMPT")
                return Response({"error": "Token do Google inválido ou expirado."}, status=status.HTTP_401_UNAUTHORIZED)
                
            email = idinfo.get('email')
            if not idinfo.get('email_verified'):
                return Response({"error": "O e-mail da conta Google não foi verificado."}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.filter(email=email).first()

            if user:
                terms_accepted = serializer.validated_data.get('terms_accepted')
                terms_version = serializer.validated_data.get('terms_version')

                # 1. Validação de LGPD / Reativação de Conta via Google
                if not user.terms_accepted:
                    if terms_accepted:
                        user.terms_accepted = True
                        user.terms_version = terms_version
                        user.terms_accepted_at = timezone.now()
                        user.is_active = True
                        user.consent_ip = AuditService.get_client_ip(request)
                        user.save()
                        AuditService.log_event(request, user, "TERMS_REACCEPTED_GOOGLE")
                    else:
                        return Response({
                            "status": "terms_required", 
                            "message": "Consentimento revogado. Você precisa aceitar os Termos de Uso novamente."
                        }, status=status.HTTP_403_FORBIDDEN)

                # 2. Validação 2FA
                if user.is_2fa_enabled:
                    otp = SecurityService.create_2fa_token(user)
                    EmailService.send_2fa_email(user.email, otp)
                    AuditService.log_event(request, user, "GOOGLE_LOGIN_2FA_SENT")
                    return Response({"status": "2fa_required", "message": "Código 2FA enviado para o e-mail."}, status=status.HTTP_202_ACCEPTED)

                # 3. Login com Sucesso
                tokens = get_tokens_for_user(user)
                AuditService.log_event(request, user, "USER_LOGGED_IN_GOOGLE")
                update_last_login(None, user)
                return Response(tokens, status=status.HTTP_200_OK)
            
            else:
                # Fluxo de Registro via Google
                terms_accepted = serializer.validated_data.get('terms_accepted')
                terms_version = serializer.validated_data.get('terms_version')
                ano_nascimento = serializer.validated_data.get('ano_nascimento')
                nome_usuario = serializer.validated_data.get('name') # Capturando o nome enviado pelo Front

                if not terms_accepted:
                    return Response({
                        "status": "registration_required",
                        "message": "Usuário não encontrado. Aceite os termos de uso para concluir o cadastro."
                    }, status=status.HTTP_403_FORBIDDEN)

                try:
                    # Agora, se o create_user falhar, ele não dirá que é culpa do Token
                    user = User.objects.create_user(
                        email=email,
                        nome=nome_usuario, # Passando o nome obrigatório
                        ano_nascimento=ano_nascimento,
                        terms_accepted=terms_accepted,
                        terms_version=terms_version,
                        terms_accepted_at=timezone.now(),
                        consent_ip=AuditService.get_client_ip(request)
                    )
                    user.set_unusable_password()
                    user.save()

                    AuditService.log_event(request, user, "USER_REGISTERED_GOOGLE")
                    tokens = get_tokens_for_user(user)
                    return Response(tokens, status=status.HTTP_201_CREATED)
                except Exception as e:
                    return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'password_reset'

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                token = SecurityService.create_password_reset_token(user)
                reset_link = f"{settings.FRONTEND_URL}/recuperar-senha?token={token}&email={email}"
                EmailService.send_password_reset_email(user.email, reset_link)
                AuditService.log_event(request, user, "PASSWORD_RESET_REQUESTED")
            except User.DoesNotExist:
                pass # Prevenção de enumeração
            
            return Response({"message": "Se o e-mail estiver cadastrado, enviaremos um link de recuperação."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_attempt'

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            email = request.data.get('email')
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Dados de usuário inválidos."}, status=status.HTTP_400_BAD_REQUEST)

            if SecurityService.verify_password_reset_token(user, token):
                user.set_password(new_password)
                user.save()
                AuditService.log_event(request, user, "PASSWORD_RESET_SUCCESSFUL")
                return Response({"message": "Senha redefinida com sucesso."}, status=status.HTTP_200_OK)
                
            AuditService.log_event(request, user, "FAILED_PASSWORD_RESET_ATTEMPT")
            return Response({"error": "Token inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)
                
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            AuditService.log_event(request, request.user, "USER_LOGGED_OUT")
            return Response({"message": "Sessão encerrada com sucesso."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Token inválido ou já invalidado."}, status=status.HTTP_400_BAD_REQUEST)

class UserPrivacyDataView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_attempt'

    def get(self, request):
        user = request.user
        
        # Estruturação padronizada dos dados do titular (Art. 18, II da LGPD)
        privacy_data = {
            "id": str(user.id),
            "email": user.email,
            "ano_nascimento": user.ano_nascimento,
            "role": user.role,
            "is_2fa_enabled": user.is_2fa_enabled,
            "termos_de_uso": {
                "aceitos": user.terms_accepted,
                "versao": user.terms_version,
                "data_aceite": user.terms_accepted_at,
                "ip_consentimento": user.consent_ip
            },
            "metadados": {
                "criado_em": user.created_at,
                "atualizado_em": user.updated_at
            }
        }
        
        AuditService.log_event(request, user, "LGPD_DATA_EXPORTED")
        return Response(privacy_data, status=status.HTTP_200_OK)

class RevokeConsentView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_attempt'

    def post(self, request):
        user = request.user
        
        # Suspensão do consentimento e inativação de acessos
        user.terms_accepted = False
        user.is_active = False 
        user.save(update_fields=['terms_accepted', 'is_active'])
        
        AuditService.log_event(request, user, "LGPD_CONSENT_REVOKED")
        return Response({
            "message": "Consentimento revogado. Seu acesso à plataforma foi suspenso."
        }, status=status.HTTP_200_OK)

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_attempt'

    def delete(self, request):
        user = request.user
        
        # Anonimização Criptográfica (Art. 18, IV e VI da LGPD)
        # Os dados pessoais são destruídos, mas o ID é mantido para não quebrar a 
        # integridade relacional dos logs de auditoria e métricas gamificadas.
        # fake_email = f"anon_{uuid.uuid4().hex[:12]}@deleted.local"
        fake_email = "********"
        user.email = fake_email
        user.nome = "********"
        user.set_unusable_password()
        user.is_active = False
        user.is_2fa_enabled = False
        user.terms_accepted = False
        user.terms_version = None
        user.consent_ip = None
        user.anonymized_at = timezone.now()
        
        user.save()
        
        AuditService.log_event(request, user, "LGPD_ACCOUNT_ANONYMIZED")
        
        return Response({
            "message": "Sua conta e dados pessoais foram excluídos e anonimizados com sucesso."
        }, status=status.HTTP_200_OK)

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_attempt'

    def put(self, request):
        nome = request.data.get('nome')
        if not nome or len(nome.strip()) < 3:
            return Response({"error": "O nome deve ter pelo menos 3 caracteres."}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        user.nome = nome.strip()
        user.save(update_fields=['nome'])
        
        AuditService.log_event(request, user, "PROFILE_NAME_UPDATED")
        
        # Gera um novo token para o frontend atualizar o nome no cabeçalho imediatamente
        tokens = get_tokens_for_user(user)
        return Response({"message": "Perfil atualizado com sucesso.", "tokens": tokens}, status=status.HTTP_200_OK)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_attempt'

    def put(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        user = request.user
        if not user.check_password(old_password):
            AuditService.log_event(request, user, "FAILED_PASSWORD_CHANGE_ATTEMPT")
            return Response({"error": "A senha atual está incorreta."}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save(update_fields=['password'])
        
        AuditService.log_event(request, user, "PASSWORD_CHANGED_SUCCESSFULLY")
        return Response({"message": "Senha atualizada com sucesso."}, status=status.HTTP_200_OK)