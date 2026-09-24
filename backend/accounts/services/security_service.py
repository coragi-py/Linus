import secrets
import hashlib
from datetime import timedelta
from django.utils import timezone
from accounts.models import TwoFactorAuthToken, PasswordResetToken

class SecurityService:
    """
    Serviço centralizado para gestão criptográfica de tokens e OTPs.
    Nenhum token é salvo em plain-text no banco de dados.
    """

    @staticmethod
    def generate_secure_otp() -> str:
        return f"{secrets.randbelow(1000000):06d}"

    @staticmethod
    def hash_token(token: str) -> str:
        return hashlib.sha256(token.encode('utf-8')).hexdigest()

    @classmethod
    def create_2fa_token(cls, user) -> str:
        TwoFactorAuthToken.objects.filter(user=user, is_used=False).update(is_used=True)

        otp = cls.generate_secure_otp()
        hashed_otp = cls.hash_token(otp)
        expires = timezone.now() + timedelta(minutes=5)

        TwoFactorAuthToken.objects.create(
            user=user,
            token_hash=hashed_otp,
            expires_at=expires
        )
        return otp

    @classmethod
    def verify_2fa_token(cls, user, otp: str) -> bool:
        hashed_otp = cls.hash_token(otp)
        token_obj = TwoFactorAuthToken.objects.filter(
            user=user,
            is_used=False
        ).order_by('-created_at').first()

        if not token_obj or not token_obj.is_valid():
            return False

        if token_obj.token_hash == hashed_otp:
            token_obj.is_used = True
            token_obj.save(update_fields=['is_used'])
            return True
        else:
            token_obj.attempts += 1
            token_obj.save(update_fields=['attempts'])
            return False

    @classmethod
    def create_password_reset_token(cls, user) -> str:
        PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)

        raw_token = secrets.token_urlsafe(32)
        hashed_token = cls.hash_token(raw_token)
        expires = timezone.now() + timedelta(minutes=15)

        PasswordResetToken.objects.create(
            user=user,
            token_hash=hashed_token,
            expires_at=expires
        )
        return raw_token

    @classmethod
    def verify_password_reset_token(cls, user, token: str) -> bool:
        hashed_token = cls.hash_token(token)
        token_obj = PasswordResetToken.objects.filter(
            user=user,
            is_used=False
        ).order_by('-created_at').first()

        if not token_obj or not token_obj.is_valid():
            return False

        if token_obj.token_hash == hashed_token:
            token_obj.is_used = True
            token_obj.save(update_fields=['is_used'])
            return True

        return False