import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O e-mail é obrigatório para o cadastro.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', CustomUser.Role.ADMIN_SISTEMA)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser deve ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        USUARIO = 'usuario', 'Usuário'
        ADMIN_CONTEUDO = 'admin-conteudo', 'Admin Conteúdo'
        ADMIN_SISTEMA = 'admin-sistema', 'Admin Sistema'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, max_length=255, db_index=True)
    
    # Dados do Usuário
    ano_nascimento = models.IntegerField(null=True, blank=True)
    
    # RBAC (Role-Based Access Control)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USUARIO)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Autenticação e Segurança
    is_2fa_enabled = models.BooleanField(default=False)

    # Conformidade LGPD
    terms_accepted = models.BooleanField(default=False)
    terms_accepted_at = models.DateTimeField(null=True, blank=True)
    terms_version = models.CharField(max_length=50, null=True, blank=True)
    consent_ip = models.GenericIPAddressField(null=True, blank=True)
    anonymized_at = models.DateTimeField(null=True, blank=True)

    # Metadados
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'TB_USUARIO'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'

    def __str__(self):
        return self.email


class TwoFactorAuthToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='two_factor_tokens')
    token_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.IntegerField(default=0)
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = 'TB_TOKEN_2FA'

    def is_valid(self):
        return not self.is_used and self.attempts < 5 and timezone.now() < self.expires_at


class PasswordResetToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = 'TB_TOKEN_RECUPERACAO'

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at