from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    terms_accepted = serializers.BooleanField(required=True)
    terms_version = serializers.CharField(max_length=50, required=True)
    
    class Meta:
        model = User
        fields = ('email', 'password', 'ano_nascimento', 'terms_accepted', 'terms_version')
        
    def validate_terms_accepted(self, value):
        if not value:
            raise serializers.ValidationError("A leitura e o consentimneto dos termos de uso é obrigatório (Art. 8º LGPD).")
        return value
        
    def validate_email(self, value):
        email = value.lower().strip()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Este e-mail já está registrado em nossa plataforma.")
        return email

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class Verify2FASerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])